import { config } from "dotenv";
import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import qs from "qs";
import fs from "fs";
import crypto from "crypto";
import way from "path";
import axios from "axios";
import { findSourceMap } from "module";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PORT = "4001"; //changeable
const http = `http://localhost:${PORT}`;

export const handleDeleteUser = (req, res) => res.send("delete user");

export const getJoin = (req, res) => {
  return res.render("users/join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { email, username, password, password2 } = req.body;

  if (!emailRegex.test(email)) {
    return res.status(404).render("users/join", {
      pageTitle: "Join",
      error: "This is not Email form",
    });
  }

  const exist = await User.exists({
    $or: [{ email: email }, { username: username }],
  });

  if (exist) {
    return res.status(404).render("users/join", {
      pageTitle: "Join",
      error: "This email or username already exists",
    });
  }
  if (username.length < 4 || username.length > 12) {
    return res.status(404).render("users/join", {
      pageTitle: "Join",
      error: "Username must be between 4 and 12 characters long",
    });
  }
  if (password != password2)
    return res.status(404).render("users/join", {
      pageTitle: "Join",
      error: "Passwords do not match",
    });

  try {
    await User.create({
      email,
      username,
      password,
    });
  } catch (error) {
    return res
      .status(404)
      .render("users/join", { pageTitle: "Join", error: `${error}` });
  }
  return res.redirect("/");
};

export const getLogin = (req, res) => {
  return res.render("users/login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("users/login", {
      pageTitle: "Login",
      error: `Username does not exist`,
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("users/login", {
      pageTitle: "Login",
      error: "Password is not correct",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startKakaoLogin = (req, res) => {
  let { scope } = req.query;
  var scopeParam = "";
  if (scope) {
    scopeParam = "&scope=" + scope;
  }
  const redirectUrl = `${http}/users/kakao/finish`; // port number is changeable
  const baseUrl = `https://kauth.kakao.com`;
  const params = `/oauth/authorize?client_id=${process.env.KAKAO_CLIENT}&redirect_uri=${redirectUrl}&response_type=code${scopeParam}`;
  const finalUrl = `${baseUrl}${params}`;

  return res.status(302).redirect(finalUrl);
};

export const finishKakaoLogin = async (req, res) => {
  const param = qs.stringify({
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_CLIENT,
    redirect_uri: `${http}/users/kakao/finish`,
    client_secret: process.env.KAKAO_SECRET,
    code: req.query.code,
  });
  const header = { "content-type": "application/x-www-form-urlencoded" };
  var tokenRequest = await call(
    "POST",
    "https://kauth.kakao.com/oauth/token",
    param,
    header
  );
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://kapi.kakao.com/v2/user/me";
    const param = {};
    const header = {
      "content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + access_token,
    };
    var rtn = await call("POST", apiUrl, param, header);

    const email = rtn.kakao_account.email;

    let user = await User.findOne({ email: email });
    const img = await downloadAvatar(rtn.properties.thumbnail_image);
    if (!user) {
      await User.create({
        username: rtn.properties.nickname,
        email: email,
        password: "",
        socialOnly: true,
        avatarUrl: img,
      });
      const newUser = await User.findOne({ email: email });
      req.session.loggedIn = true;
      req.session.user = newUser;
      return res.redirect("/");
    }

    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  }
  return res.status(401).redirect("/login");
};

async function downloadAvatar(url) {
  const uploadPath = way.join(process.cwd(), "uploads", "avatar");
  if (!fs.existsSync(uploadPath)) {
    // if uploadPath's path does not exist build new one
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  const randomName = crypto.randomBytes(16).toString("hex"); //32digits random hex numbers will be the name
  const filePath = way.join(uploadPath, randomName);

  const response = await axios({
    // img data exist, we take it from here, which means "response" is img.data
    method: "GET",
    url,
    responseType: "stream",
  });

  const writer = fs.createWriteStream(filePath); // writerable Stream
  response.data.pipe(writer); //readable Stream connected --^

  console.log(filePath);
  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(`uploads/avatar/${randomName}`));
    writer.on("error", reject);
  });
}

async function call(method, uri, param, header) {
  try {
    var rtn = await axios({
      // axios is a Promise-based HTTP client for the browser and Node.js.
      method: method,
      url: uri,
      headers: header,
      data: param,
    });
  } catch (err) {
    rtn = err.response;
  }
  return rtn.data;
}

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userRequest = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `bearer ${access_token}`,
        },
      })
    ).json();
    const emailRequest = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `bearer ${access_token}`,
        },
      })
    ).json();

    const email = emailRequest.find(
      (email) => email.primary === true && email.verified === true
    );

    let user = await User.findOne({ email: email.email });

    if (!email) return res.redirect("/login");

    const img = await downloadAvatar(userRequest.avatar_url);
    if (!user) {
      user = await User.create({
        username: userRequest.login,
        email: email.email,
        password: "",
        socialOnly: true,
        avatarUrl: img,
      });
    }

    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.status(401).redirect("/login");
  }
};
export const getEditProfile = (req, res) => {
  return res.render("users/editProfile", { pageTitle: "Edit Profile" });
};
export const postEditProfile = async (req, res) => {
  const { _id, avatarUrl } = res.locals.user;
  const {
    body: { email, username },
    file,
  } = req;

  const socialUser = await User.findById({ _id });
  if (socialUser.socialOnly) {
    if (socialUser.email === email) return res.redirect();
  }
  await User.findByIdAndUpdate(_id, {
    email,
    username,
    avatarUrl: file ? file.path : avatarUrl,
  });
  const updatedUser = await User.findById({ _id });
  req.session.user = updatedUser;
  return res.redirect("/users/profile");
};

export const profile = (req, res) => {
  return res.render("users/profile", { pageTitle: "Profile" });
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getChangePassword = (req, res) => {
  return res.render("users/changePassword", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const { oldPassword, newPassword, passwordConfirmation } = req.body;
  const { password, _id } = res.locals.user;
  const ok = await bcrypt.compare(oldPassword, password);
  if (!ok) {
    res.render("users/changePassword", {
      error: "Plz double check your Old Password",
    });
  }
  if (newPassword !== passwordConfirmation) {
    res.render("users/changePassword", {
      error: "Plz double check your confirmation Password",
    });
  }
  const updatedUser = await User.findById(_id);
  updatedUser.password = newPassword;
  await updatedUser.save();
  return res.redirect("/users/logout");
};

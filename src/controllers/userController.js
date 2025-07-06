import { config } from "dotenv";
import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const handleDeleteUser = (req, res) => res.send("delete user");
export const handleEditUser = (req, res) => res.send("edit user");
export const getJoin = (req, res) => {

    return res.render("join", {pageTitle:"Join"});
}
export const postJoin = async(req, res) => {
    const {email, username, password, password2} = req.body;

    if(!emailRegex.test(email)){
        return res.status(404).render("join", {pageTitle:"Join", error: "This is not Email form"});
    };

    const exist = await User.exists({$or: [{email: email}, {username: username}]});

    if(exist){
        return res.status(404).render("join", {pageTitle:"Join", error: "This email or username already exists"});
    }
    if(username.length < 4 || username.length > 12){
        return res.status(404).render("join", {pageTitle:"Join", error: "Username must be between 4 and 12 characters long"});
    }
    if(password != password2)
        return res.status(404).render("join", {pageTitle:"Join", error: "Passwords do not match"});

    try{
        await User.create({
            email,
            username,
            password,
        });
    }catch(error){
        return res.status(404).render("/join", {pageTitle:"Join", error: `${error}`});
    }
    return res.redirect("/");
}
export const getLogin = (req, res) => {
    return res.render("login", {pageTitle: "Login"});
}
export const postLogin = async(req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username, socialOnly: false});
    if(!user){
        return res.status(400).render("login", {pageTitle: "Login", error:`Username does not exist`});
    }
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", {pageTitle: "Login", error: "Password is not correct"});
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");

}

// export const startKakaoLogin = (req, res) => {
//     const baseUrl = "https://kauth.kakao.com/oauth/authorize"
//     const config = {
        
//     };
//     return res.redirect();
// };

// export const finishKakaoLogin = (req, res) => {

// };
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
}

export const finishGithubLogin = async (req, res) => { 
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    
    const tokenRequest = await( await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    })).json();

    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userRequest = await(await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `bearer ${access_token}`,
            }
        })).json();
        const emailRequest = await(await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `bearer ${access_token}`,
            }
        })).json();

        const email = emailRequest.find((email) => email.primary === true && email.verified === true);

        let user = await User.findOne({email: email.email});
        
        if(!email)
            return res.redirect("/login");

        if(!user){
            user = await User.create({
                username: userRequest.login,
                email: email.email,
                password: "",
                socialOnly: true,
                avatarUrl: userRequest.avatar_url,
            });
        }

        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    }else{
        return res.redirect("/login");
    }
}
export const profile = (req, res) => res.send("Profile");
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};
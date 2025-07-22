import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.user = req.session.user;
  res.locals.website = "Memory";
  next();
};

export const notUserMiddleware = (req, res, next) => {
  if (!res.locals.loggedIn) return res.redirect("/");
  next();
};

export const noSocialMiddleware = (req, res, next) => {
  if (res.locals.user.socialOnly) return res.redirect("/");
  next();
};

export const avatarMiddleware = multer({ dest: "uploads/avatar/" });
export const videoMiddleware = multer({ dest: "uploads/video/" });

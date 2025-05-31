export const localsMiddleware = (req, res, next) => {
    res.locals.LoggedIn = Boolean(res.session.LoggedIn);
    res.locals.user = req.session.user;
    res.locals.website = "Memory";
    
};
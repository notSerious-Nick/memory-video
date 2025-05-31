import User from "../models/User";
import bcrypt from "bcrypt";

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
    const user = await User.findOne(username);
    if(!user){
        return res.status(400).render("login", {pageTitle: "Login", error:`Username does not exist`});
    }
    const ok = bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", {pageTitle: "Login", error: "Password is not correct"})
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");

}

export const profile = (req, res) => res.send("Profile");
export const logout = (req, res) => res.send("logout");
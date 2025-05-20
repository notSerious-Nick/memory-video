import User from "../models/User";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const handleDeleteUser = (req, res) => res.send("delete user");
export const handleEditUser = (req, res) => res.send("edit user");
export const getJoin = (req, res) => {

    return res.render("join", {pageTitle:"Join"});
}
export const postJoin = async(req, res) => {
    const {email, username, password, password2} = req.body;

    if(!emailRegex.test(email)){
        return res.render("join", {pageTitle:"Join", error: "This is not Email form"});
    };

    const exist = await User.exists({$or: [{email: email}, {username: username}]});

    if(exist){
        return res.render("join", {pageTitle:"Join", error: "This email or username already exists"});
    }
    if(username.length < 4 || username.length > 12){
        return res.render("join", {pageTitle:"Join", error: "Username must be between 4 and 12 characters long"});
    }
    if(password != password2)
        return res.render("join", {pageTitle:"Join", error: "Passwords do not match"});

    try{
        await User.create({
            email,
            username,
            password,
        });
    }catch(error){
        return res.render("/join", {error: `${password}`});
    }
    return res.redirect("/");
}
export const login = (req, res) => res.send("Login");
export const profile = (req, res) => res.send("Profile");
export const logout = (req, res) => res.send("logout");
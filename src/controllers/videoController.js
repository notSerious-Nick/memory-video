const fakeUser = {
    username: "nick",
    loggedIn: true,
}
let videos = [
    {
        title: "First",
        rating:"5",
        Comment:"4",
        createdAt:`${Date.now}`,
        views:"3",
        id:"1",
    },
    {
        title: "Second",
        rating:"5",
        Comment:"4",
        createdAt:`${Date.now}`,
        views:"3",
        id:"2",
    },
];
export const handleDeleteVideo = (req, res) => res.send("Delete video");
export const handleEditVideo = (req, res) => res.send("Edit video");
export const trending = (req, res) => {
    
    return res.render("home", {pageTitle:"Home", fakeUser:fakeUser, videos:videos});
}
export const watching = (req, res) => {
    const {id} = req.params;
    const video = videos[id - 1];
    return res.render("watch",{pageTitle:video.title, video:video});
}
export const upload = (req, res) => res.send("upload");
export const search = (req, res) => res.send("Search");
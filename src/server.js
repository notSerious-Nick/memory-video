import express from "express"; // node_modules include express file

const PORT = 4000;

const app = express(); // application(server) has to listent request from client, server turn on all the time

const handleHome = (req, res) => {
    return res.send("hey"); // if not return with res, the website does unlimited load
}

app.get("/",handleHome);

const handleListening = () => console.log(`listening! ${PORT}`);

app.listen(PORT, handleListening); // ex) button.addEventListener("click", handleClick)
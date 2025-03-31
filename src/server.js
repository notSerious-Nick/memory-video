import express from "express"; // node_modules include express file

const PORT = 4000;

const app = express(); // application(server) has to listent request from client, server turn on all the time

const handleListening = () => console.log("listening!");

app.listen(PORT, handleListening); // ex) button.addEventListener("click", handleClick)
import "dotenv/config"
import "./db";
import "./models/Video";
import app from "./server";

const PORT = 4001;

const handleListening = () => console.log(`✅ listening! http://localhost:${PORT}`);

app.listen(PORT, handleListening); // ex) button.addEventListener("click", handleClick)38492     1 /System/Library/CoreServices/ControlCenter.app/Contents/MacOS/Contr1n
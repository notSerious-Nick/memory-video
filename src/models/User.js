import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {type: String,
        required: true,
        unique: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        unique: true,
        minLength: 8,
    }
});

userSchema.pre("save", async function(){
    if(!this.isModified())
        return;
    const saltRounds = 6;
    const hash = new bcrypt.hash(this.password, saltRounds);
    this.password = hash;
});

const User = mongoose.model("User", userSchema);

export default User;
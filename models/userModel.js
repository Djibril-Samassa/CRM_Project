const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        Unique: true
    },
    password:{
        type: String,
        minLength: 6
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;
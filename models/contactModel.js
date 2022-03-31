const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    userId: [{type: mongoose.Types.ObjectId, ref:"User"}],
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        Unique: true,
        required: true
        },
    description: {
        type: String,
        required: true
    },
    category: {
        type: Number,
        required: true
    }
})

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    userId: [{type: mongoose.Types.ObjectId, ref:"user"}],
    name: String,
    email:{
        type: String,
        Unique: true
        },
    description: String,
    category: Number
})

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
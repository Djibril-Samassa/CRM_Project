const express = require("express");
const mongoose =  require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/userModel");
const Contact = require("./models/contactModel")

const app =  express();
app.use(express.json());

mongoose.connect("mongodb+srv://Djibril:lNedKFxGkSmmeTJ6@cluster0.qzfvb.mongodb.net/crmDB?retryWrites=true&w=majority",
{useNewUrlParser: true})
.then(()=>{
    console.log("Connected to MongoDB");
})


app.get("/",(req,res) =>{
    res.json("Bienvenue sur le Projet CRM")
})

app.post("/register", async(req,res) =>{
    const hashedPassword = await bcrypt.hash(req.body.password)
    try{
        const user = await User.create({
            email: req.body.email,
            password: hashedPassword
        });
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            message: "An error happened"
        })
    }

    res.json("Utilisateur crée")
})


app.listen(8000,() =>{
    console.log("Listening");
})
const express = require("express");
const mongoose =  require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CookieParser = require("cookie-parser");
const User = require("./models/userModel");
const Contact = require("./models/contactModel");
const ADN = "bpdxkojfnnqbmopojcfdjiagjtydsyflyzmgfxqatzfwmtpcuxgpdyuleomhtoso";
require('dotenv').config();

const { PORT, MONGODB_URI, API_KEY } = process.env;
let isLoggedIn = true;
var port = process.env.PORT || 8000;
const app =  express();
app.use(express.json());

mongoose.connect("mongodb+srv://Djibril:lNedKFxGkSmmeTJ6@cluster0.qzfvb.mongodb.net/crmDB?retryWrites=true&w=majority",
{useNewUrlParser: true})
.then(()=>{
    console.log("Connected to MongoDB");
})

function middleware1(req, res, next){
    if(isLoggedIn === false){
        console.log("veuillez vous connecter");
    }else{
        next();
    }
}

app.get("/",(req,res) =>{
    res.send("<h1>Bienvenue sur le Projet CRM</h1>")
})


app.post("/register", async(req,res) =>{
    const hashedPassword = await bcrypt.hash(req.body.password, 5)
    try{
        await User.create({
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

app.post("/login", async(req,res) =>{
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user) {
		return res.status(400).json({
			message: "Invalid email or password",
		});
	}

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
		return res.status(400).json({
			message: "Invalid email or password",
		});
	}

    const token = jwt.sign({id: user._id}, ADN);

    res.cookie("jwt", token, {httpOnly: true, secure: false});

    isLoggedIn = true;

    res.json("connected")
})

app.post("/contact", middleware1, async(req,res) =>{
    const data = req.body;
    const nb = data.lenght;
    try{
         await Contact.create(data)
    } catch(err){
        console.log(err);
        res.status(400).json({
            message: "An error happened"
        })
    }

    res.json(`${data.name} a été ajouté aux contacts`)
})

app.put("/contact/:name", middleware1, async(req,res) =>{
    const { name, email, description, category } = req.body;
    try {
        await Contact.findOneAndReplace({name : req.params.name}, {name, email, description, category});
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            message: "An error happened"
        })
    }
    res.json("le contact a bien été modifié")
})

app.delete("/contact/delete/:name", middleware1, async(req, res) =>{
    try{
        await Contact.findOneAndDelete({name: req.params.name})
    }
    catch(err){
        console.log(err);
        res.json({
            message: "An error Happened"
        })
    }
    res.json("Contact supprimé")
})

app.get("/contact", middleware1, async(req,res) =>{
    const contactList = await Contact.find();
    const filteredContact = await contactList.filter((contact)=>{
        return(
            contact.name = req.query.name
        )
    })

    res.json(filteredContact);
})

app.listen(8000,() =>{
    console.log("Listening");
})
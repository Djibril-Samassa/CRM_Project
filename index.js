const express = require("express");
const mongoose =  require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CookieParser = require("cookie-parser");
const User = require("./models/userModel");
const Contact = require("./models/contactModel");
const ADN = "bpdxkojfnnqbmopojcfdjiagjtydsyflyzmgfxqatzfwmtpcuxgpdyuleomhtoso";
let LoggedIn = false

const app =  express();
app.use(express.json());

mongoose.connect("mongodb+srv://Djibril:lNedKFxGkSmmeTJ6@cluster0.qzfvb.mongodb.net/crmDB?retryWrites=true&w=majority",
{useNewUrlParser: true})
.then(()=>{
    console.log("Connected to MongoDB");
})

function middleware(req, res, next){
    if(isLoggedIn === false){
        console.log("veuillez vous connecter");
    }else{
        next();
    }
}

app.get("/",(req,res) =>{
    res.json("Bienvenue sur le Projet CRM")
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

app.post("/contact", middleware, async(req,res) =>{
    
    try{
        await Contact.create(req.body)
    } catch(err){
        console.log(err);
        res.status(400).json({
            message: "An error happened"
        })
    }
    res.json("contact ajouté")
})

app.listen(8000,() =>{
    console.log("Listening");
})
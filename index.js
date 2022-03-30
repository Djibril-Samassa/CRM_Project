const express = require("express");
const mongoose =  require("mongoose");

const app =  express();
app.use(express.json());

mongoose.connect("mongodb+srv://Djibril:Ds02072001@cluster0.qzfvb.mongodb.net/crmDB?retryWrites=true&w=majority",
{useNewUrlParser: true})
.then(()=>{
    console.log("Connected to MongoDB");
})


app.get("/",(req,res) =>{
    res.json("Bienvenue sur le Projet CRM")
})


app.listen(8000,() =>{
    console.log("Listening");
})
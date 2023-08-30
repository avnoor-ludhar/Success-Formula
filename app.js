import express from 'express';
import bodyParser from 'body-parser';
import _ from 'lodash';
import axios from 'axios';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

const apiKey = "AIzaSyDn1r1hXZN5XuFGhqYJh8JkZ7YEH9EYsIc";

mongoose.connect("mongodb://localhost/SuccessDB", {useNewUrlParser: true});

const itemsSchema = new mongoose.Schema({
    name:String
  });
  
const Item = mongoose.model("Item", itemsSchema);

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});
  
const List = mongoose.model("List", listSchema);

const bookSchema = new mongoose.Schema({
    img: String,
    title: String,
    read: Boolean,
    description: String
});

const Book = mongoose.model("Book", bookSchema);

const userSchema = new mongoose.Schema({
    username: String,
    library: [bookSchema],
    gratitudes: [String],
    goals: listSchema
});

const User = mongoose.model("User", userSchema);

const config = {
    params: { key: apiKey }
};

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", async (req, res)=>{
    try{
        const response = await axios.get("https://www.googleapis.com/books/v1/volumes/OSchEAAAQBAJ", config);
        
        const book = {
            title: response.data.volumeInfo.title,
            img: response.data.volumeInfo.imageLinks.thumbnail,
            description: response.data.volumeInfo.description
        }
        res.render("home.ejs", {book: book});
    } catch(err){
        console.log(err);
    }
});  

app.get("/searchBook", async(req, res)=>{
    res.render("bookSearch.ejs", {books: bookSearchResults});
});

app.post("/searchBook", async(req, res)=>{
    try{
        const bookBack = await axios.get("https://www.googleapis.com/books/v1/volumes/?q=" + req.body.book + "&maxResults=16" + "&key=" + apiKey);
        res.render("bookSearch.ejs", {books: bookBack.data.items});
    } catch(err){
        console.log(err);
    }
});

app.listen(port, ()=>{
    console.log("listening on port 3000");
});
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
    recentBook: bookSchema,
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
        const currUser = await User.findOne({_id: "64ee73aa43df42a8ae27dc11"});

        res.render("home.ejs", {book: currUser.recentBook});
    } catch(err){
        console.log(err);
    }
});

app.post("/", async (req, res)=>{
    try{
        const newRecentBookID =  req.body.newBookID ;
        const currUser = await User.findOne({_id: "64ee73aa43df42a8ae27dc11"});

        currUser.library.forEach((book)=>{

            //toString because we got returned a bson object as the objectid
            if(book._id.toString() === newRecentBookID){
                currUser.recentBook = book;
            }
        });
        await currUser.save();

        res.redirect("/");
    } catch(err){
        console.log(err);
    }
        
});

app.get("/searchBook", async(req, res)=>{
    res.render("bookSearch.ejs", {books: []});
});

app.post("/searchBook", async(req, res)=>{
    try{
        const bookBack = await axios.get("https://www.googleapis.com/books/v1/volumes/?q=" + req.body.book + "&maxResults=16" + "&key=" + apiKey);
        res.render("bookSearch.ejs", {books: bookBack.data.items});
    } catch(err){
        console.log(err);
    }
});

app.get("/books", async (req, res)=>{
    const currUser = await User.findOne({_id: "64ee73aa43df42a8ae27dc11"});
    res.render("gallery.ejs", {library: currUser.library});
});

app.post("/books/delete", async (req, res)=>{
    try{
        const bookDeleteID = req.body.deleteBook;
        await User.findOneAndUpdate({_id: "64ee73aa43df42a8ae27dc11"}, {$pull: {library: {_id: bookDeleteID}}});
        res.redirect("/books");
    } catch(err){
        console.log(err);
    }
});

app.post("/books", async (req, res)=>{
    const selectedBook = JSON.parse(req.body.chosenBook);

    const book = new Book({
        title: selectedBook.title,
        read: false,
        description: selectedBook.description
    });
    
    if(typeof selectedBook.imageLinks === "undefined"){ 
        book.img = "/images/error-svgrepo-com.svg";
    } else {
        book.img = selectedBook.imageLinks.thumbnail;
    }

    const foundUser = await User.findOne({_id: "64ee73aa43df42a8ae27dc11"});
    foundUser.library.push(book);
    await foundUser.save();

    res.redirect("/books");
});

app.get("/recentBook", async (req, res)=>{
    const currUser = await User.findOne({_id: "64ee73aa43df42a8ae27dc11"});
    res.render("recentBook.ejs", {library: currUser.library});
});

app.listen(port, ()=>{
    console.log("listening on port 3000");
});
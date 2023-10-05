import express from 'express';
import bodyParser from 'body-parser';
import _ from 'lodash';
import axios from 'axios';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

const apiKey = "AIzaSyDn1r1hXZN5XuFGhqYJh8JkZ7YEH9EYsIc";

mongoose.connect("mongodb://localhost/SuccessDB", {useNewUrlParser: true});


// item schema and model
const itemsSchema = new mongoose.Schema({
    name:String
  });
  
const Item = mongoose.model("Item", itemsSchema);

//List schema and model
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});
  
const List = mongoose.model("List", listSchema);


// BOOK SCHEMA AND MODEL
const bookSchema = new mongoose.Schema({
    img: String,
    title: String,
    read: Boolean,
    description: String
});

const Book = mongoose.model("Book", bookSchema);

// day schedule schema and task schema


const taskSchema = new mongoose.Schema({
    startTime:  {
        type: String,
        required: [true, "Start time required"]
    },
    endTime: {
        type: String,
        required: [true, "End time required"]
    },
    description: String
})

const Task = mongoose.model("Task", taskSchema);

const daySchema = new mongoose.Schema({
    dayOfWeek: String,
    tasks: [taskSchema]
});

const Day = mongoose.model("Day", daySchema);


// USER SCHEMA AND MODEL
const userSchema = new mongoose.Schema({
    username: String,
    library: [bookSchema],
    recentBook: bookSchema,
    gratitudes: [String],
    goals: listSchema,
    todaySchedule: daySchema
});

const User = mongoose.model("User", userSchema);

const config = {
    params: { key: apiKey }
};

const userID = "64ee73aa43df42a8ae27dc11";
const todoListID = "64f3539452d300fb323441d1";
const goalsListID = "64f3539452d300fb323441d0";

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// gets data from mongodb database and renders into home.ejs template
app.get("/", async (req, res)=>{
    try{
        const currUser = await User.findById(userID);
        const todoList = await List.findById(todoListID);
        const goalsList = await List.findById(goalsListID);

        res.render("home.ejs", {book: currUser.recentBook, todo: todoList.items, goals: goalsList.items, tasks: currUser.todaySchedule.tasks.sort()});
    } catch(err){
        console.log(err.message);
    }
});

// creaetes a new todo item in the list using data from front end and updating the todo list 
// in list collection
app.post("/todo", async (req, res)=>{
    try{
        const todoList = await List.findById(todoListID);

        const newTodo = new Item({
            name: req.body["todo"]
        });

        todoList.items.push(newTodo);
        await todoList.save();
        res.redirect("/");

    } catch(e){
        console.log(e.message);
    }
});

// deletes item using mongodb array pull operator
app.post("/todo/delete", async (req, res)=>{
    const deleteID = req.body.deleteTodo;
    await List.findOneAndUpdate({_id: todoListID}, {$pull: {items: {_id: deleteID}}});

    res.redirect("/");
});

// goals list structured in the exact same way as todo list
app.post("/goals", async (req, res)=>{
    try{
        const goalsList = await List.findById(goalsListID);

        const newGoal = new Item({
            name: req.body["goal"]
        });

        goalsList.items.push(newGoal);
        await goalsList.save();
        res.redirect("/");

    } catch(e){
        console.log(e);
    }
});

// Delete functions in the exact same way as well
app.post("/goals/delete", async (req, res)=>{
    const deleteID = req.body.deleteGoal;
    await List.findOneAndUpdate({_id: goalsListID}, {$pull: {items: {_id: deleteID}}});
    
    res.redirect("/");
});


// 
app.post("/", async (req, res)=>{
    try{
        const newRecentBookID =  req.body.newBookID ;
        const currUser = await User.findOne({_id: userID});

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
    const currUser = await User.findOne({_id: userID});
    res.render("gallery.ejs", {library: currUser.library});
});

app.post("/books/delete", async (req, res)=>{
    try{
        const bookDeleteID = req.body.deleteBook;
        await User.findOneAndUpdate({_id: userID}, {$pull: {library: {_id: bookDeleteID}}});

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

    const foundUser = await User.findOne({_id: userID});
    foundUser.library.push(book);
    await foundUser.save();

    res.redirect("/books");
});

app.get("/recentBook", async (req, res)=>{
    const currUser = await User.findOne({_id: userID});
    res.render("recentBook.ejs", {library: currUser.library});
});

app.get("/create", async (req, res)=>{
    const foundUser = await User.findOne({_id: userID});

    res.render("create.ejs", {dayOfWeek: foundUser.todaySchedule.dayOfWeek, tasks: foundUser.todaySchedule.tasks.sort()});
});

app.post("/create", async (req,res)=>{
    try{
        var foundUser = await User.findOne({_id: userID});

        if(req.body.contentType === "addItem"){
        
            const task = new Task({
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                description: req.body.taskDescription
            });

            foundUser.todaySchedule.tasks.push(task);

            await foundUser.save();

            res.redirect("/create");
        } else{

            foundUser.todaySchedule.tasks.forEach((task, idx)=>{

                //toString because we got returned a bson object as the objectid
                if(task._id.toString() === req.body.delSchedID){
                    foundUser.todaySchedule.tasks.splice(idx,idx+1);
                }
            });

            await foundUser.save();

            res.redirect("/create");
        }
        
    } catch(err){
        console.log(err);
    }
});

app.post("/create/home", (req, res)=>{
    res.redirect("/home")
});

app.listen(port, ()=>{
    console.log("listening on port 3000");
});
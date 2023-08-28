import express from 'express';
import bodyParser from 'body-parser';
import _ from 'lodash';
import axios from 'axios';

const app = express();
const port = 3000;

const apiKey = "AIzaSyDn1r1hXZN5XuFGhqYJh8JkZ7YEH9EYsIc";

const config = {
    params: { key: apiKey },
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

app.listen(port, ()=>{
    console.log("listening on port 3000");
});
import express from 'express';
import bodyParser from 'body-parser';
import _ from 'lodash';

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res)=>{
    res.render("home.ejs");
});

app.listen(port, ()=>{
    console.log("listening on port 3000");
});
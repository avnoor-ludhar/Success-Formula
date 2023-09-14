Success Formula 
Video Demo:  <URL HERE>
Description:

The goal of this project was to create a web application that made making schedules easy for myself and hopefully any others that choose to use the application. I did this using my knowledge that I gained from cs50 and another udemy course taht I took on udemy. This led me to use node.js, mongodb, mongoose, axios, express and ejs to create my full stack web application.

app.js

The app.js file is the heart of the application, it has all the middleware which are used to access information in the route handlers before the page is rendered to the user more specifically body-parser which allows us to get content from html forms and other parts of the web application. We also have the connection to the mongodb database at the start of the code, we create our schemas for each collection we have in our mongodb database. We then create our mongodb models which are used to access and change information in our mongodb database. All the schemas were set up for future implementations as well, like a gratitude section that has not yet been added. I also hope hopefully the ability for users to log in and the ability to use the website with their own information saved instead of the static website that we have right now. 

We then have the main route handler which will send our main home.ejs file to the user and all of our data in our database specifically the recent book, 
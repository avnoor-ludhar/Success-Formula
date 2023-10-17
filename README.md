# Success Formula 
Video Demo:  https://youtu.be/EQrZ-NVgseg?si=G1n8yxTkeacVSUes
Description:

The goal of this project was to create a web application that made making schedules easy for myself and hopefully many others that choose to use the application. I did this using my knowledge that I gained from cs50 and another udemy course on web development. This led me to use node.js, mongodb, mongoose, axios, express and ejs to create my full stack web application.

## Files

### app.js

The app.js file is the heart of the application, it has all the middleware which are used to access information in the route handlers before the page is rendered to the user. More specifically body-parser which allows us to get content from html forms and other parts of the web application. We also have the connection to the mongodb database at the start of the code, we create our schemas for each collection we have in our mongodb database. We then create our mongodb models which are used to access and change information in our mongodb database. All the schemas were set up for future implementations as well, like a gratitude section that has not yet been added. I also hope to add the ability for users to log in and use the website with their own information saved instead of the static website that we have right now. 

We then have the main route handler which will send our main home.ejs file to the user and all of our data in our database specifically the recent book, schedule, and todos. We then have various route handlers for the different functionalities of our website. We have a POST path for / which is how we change our most recent book. We have a /searchbook POST path which will search google books API using axios to find any books that match the name specified in the input field, with a limit of 16 resources to be sent back. We have a /books and /books/delete which will get our library of books that we have added and also post to delete a book on that page. A post request to /books adds a new book to the library and it happens at the location of /searchbook. /recentBook renders the page identical to the library but is used to update the most recent book. Finally, we have the /create routes to create a new schedule which will render the ejs template for creating a schedule when acceessed through the get route and creates a new item when a post request is received. /create/home is to create a schedule, which will be used when we have multiple days and weeks of schedules being available. 

### EJS templates 

I had many ejs templates for the varying pages styled with mostly flexboxes, CSS grid and common CSS properties like box-shadow, margin etc. Our home page was divided into five sections, the first being a recent book, underneath will be a gratitude(not yet implemented), the center contains a schedule that spans two grid cells, and finally the two lists on the right hand side each in their own cells of the grid. All items used the .flex class to center items in their containing divs. I also used EJS partials to have a repeating header and footer in all my pages. Some didn't implement the headers and footers due to utilization of the bootstrap framework. Which had certain style conflicts specifically with the nav bar and horizontal rule elements which caused me to have to recreate certain class names and add styles to those sections. All EJS templates use the same core principles, forEach loops for repeated elements, buttons, and html forms. Html forms were used to send data to the backend through the post route when needing to send information or to update a resource on the website. forEach loops were used for reoccuring elements like books and schedule items. 

### static.js

The static.js was used to add a strike through when an input field had a checkbox clicked, this strike through was added to the elements of the todo list and goals list. 

### styles.css

styles.css was used for the styling of every element of the website except in the create.ejs file which utilized the bootstrap framework. As stated earlier it uses mostly flexboxes, CSS grid and simple properties to cause the styles we see on screen. One thing that I would like to point out is the animation in the top left corner of the page was inspired by the 100 days css challenge where I created that element from scratch using CSS animations. Mobile view will be implemented in the future using media queries. 

## Final words

This project was created with my own uses in mind, I am an avid reader and love to see all the books I have read I also like to create weekly goals and daily todos to complete tasks. Now that I've realized I can make this into a full fledged website I plan to implement more features for users to be able to also use the website.

### Remote git repository containing files:

https://github.com/avnoor-ludhar/schedule-app/tree/main
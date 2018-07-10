var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
// var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000 ;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost:27017/scraperDB");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/scraperDB";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


//ROUTES

//Route for rendering html
app.get('/', function(req, res){
  res.render('index')
})

// A GET route for scraping the nytimes website
app.get("/api/scrape", function(req, res){
  request("https://www.nytimes.com/section/sports", function(error, response, html){

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html)

    // An empty array to save the data that we'll scrape
    var results = [];

    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $(".story").each(function(i, element) {

      // Save the text of the element in a "title" variable
      var title = $(element).find(".headline").text().trim()

      var summary = $(element).find(".summary").text().trim()

      // In the currently selected element, look at its child elements (i.e., its a-tags),
      // then save the values for any "href" attributes that the child elements may have
      var link = $(element).find(".headline").children().attr("href") || $(element).find(".story-link").attr("href");

      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
        title: title,
        summary: summary,
        link: link
      });
    });

    // Log the results once you've looped through each of the elements found with cheerio

    console.log(results)
    res.send(results)
  })
})



// Route for clearing articles in db
app.delete('/api/deletearticle:id', function(req, res){
  db.Note.findByIdAndRemove(req.params.id, (err, todo) => {
    if (err) return res.status(500).send(err)
    // send back with a message and the id of the document that was removed
    const response = { 
      message: "Article successfully deleted", 
      id: article._id
    }
    return res.status(200).send(response)
  })
})


// Route for saving an article
app.post("/api/save", function(req, res){
  db.Article.create(req.body)
    .then(function(dbArticle){
      console.log(dbArticle);
      res.send(dbArticle);
    })
    .catch(function(err){
      return res.json(err)
    })
})


//Route for getting all saved Articles from the db
app.get("/articles", function(req, res){
  db.Article.find({})
    .then(function(dbArticles){
      //store data in handlebars object
      const handlebarObj = {articles: dbArticles}
      console.log(dbArticles)
      res.render('articles', handlebarObj)
    })
    
})

app.post("/note", (req, res) => {
  db.Note.create({ title: "test", body: "test body" }).then(note => console.log(note))
})


//Route for getting saved notes
// app.get("/notes", function(req, res){
//   db.Note.find()
//     .then(function(dbNotes){
//       //store data in handlebars object
//       const handlebarObj = {notes: dbNotes}
//       console.log(dbNotes)
//       res.render('articles', handlebarObj )
//     })
// })

//Route for creating a new note
// app.post('/api/newnote', function(req, res){
//   db.Note.create(req.body)
//     .then(function(dbNotes){
//       console.log(dbNotes)
//       res.send(dbNotes)
//     })
//     .catch(function(err){
//       return res.json(err)
//     })
// })

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, store data in handlebars object
      // const handlebarObj = {notes: dbNotes}
      // console.log(dbNotes)
      res.send(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for creating/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//Route for deleting a note
app.delete('/api/deletenote:id', function(req, res){
  db.Note.findByIdAndRemove(req.params.id, (err, todo) => {
    if (err) return res.status(500).send(err)
    // send back with a message and the id of the document that was removed
    const response = { 
      message: "Note successfully deleted", 
      id: note._id
    }
    return res.status(200).send(response)
  })
})

//Route for deleting a saved article
app.delete('/api/deletearticle:id', function(req, res){
  db.Note.findByIdAndRemove(req.params.id, (err, todo) => {
    if (err) return res.status(500).send(err)
    // send back with a message and the id of the document that was removed
    const response = { 
      message: "Article successfully deleted", 
      id: article._id
    }
    return res.status(200).send(response)
  })
})


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

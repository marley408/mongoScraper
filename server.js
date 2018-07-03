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

var PORT = 3000;

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
mongoose.connect("mongodb://localhost:27017/scraperDB");

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
      // If we were able to successfully find Articles, send them back to the client
      // res.json(dbArticle)
      const handlebarObj = {articles: dbArticles}
      console.log(dbArticles)
      res.render('articles', handlebarObj)
    })
    
})




// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

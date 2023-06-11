const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB')
.then(() =>{
  console.log("Mongo Connection Open")
})
.catch(err => {
  console.log("Mongo not connected")
  console.log(err)
})



const itemSchema = {
  name: String
}

const Item = mongoose.model("Item", itemSchema)

const item1 = new Item({
  name: "Welcome to your todoList"
});

const item2 = new Item({
  name: "Hit the + button to add a new item"
})

const item3 = new Item({
  name: "<-- Hit this to delete an item"
})

const defaultItem = [item1, item2, item3]



app.get("/", function(req, res) {

  Item.find({})
  .then(data =>{
    if(data.length === 0){
      Item.insertMany(defaultItem)
      .then( res => {
        console.log("Succesfuly inserted items")
      })
      .catch(e => {
        console.log(e)
      })
      res.redirect("/");

    } else{
    res.render("list", {listTitle: "Today", newListItems: data});
    }
  })





  

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});


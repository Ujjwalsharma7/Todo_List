const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _ = require("lodash")

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

const listSchema = {
  name: String, 
  items: [itemSchema]
}

const List = mongoose.model("List", listSchema)


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


app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name:customListName})
    .then(foundlist => {
     if(!foundlist){
      // Create new list 
      const list = new List({
        name: customListName,
        items: defaultItem
      })
     
      list.save();
      res.redirect("/" + customListName)
     } else {
    //  show an existing
    res.render("list", {listTitle: foundlist.name , newListItems: foundlist.items})
     }
    })
    .catch(err => {
      console.log(err)
    })

  
})

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName})
      .then(foundlist => {
        foundlist.items.push(item);
        foundlist.save();
        res.redirect("/" + listName);
      })
  }
 
});

app.post("/delete", function(req, res){
  const checkedItemId =  req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndDelete(checkedItemId)
    .then(() =>{
      console.log("Sucessfulyy deleted item")
      res.redirect("/");
    })
    .catch(err => {
      console.log("Mongo not connected")
      console.log(err)
    })  
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}})
      .then( foundlist => {
        res.redirect("/" + listName);
      })
  }

 
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});


//jshint esversion:6

const express = require("express");

const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"));


let items = ["Buy Food"," Eat food", "Cook food"];
let workItems = []
app.set('view engine', 'ejs');

app.get("/", function(req, res) {

  var today = new Date()

  var options ={
    weekday: "long",
    day: "numeric",
    month: "long"
  };
var day = today.toLocaleDateString("en-US", options);

res.render("list", {listTitle: day, newListItems: items})
});

app.post("/", function(req, res)  {

  let item = req.body.newItem

  if(req.body.list == "Work List"){
    workItems.push(item)
    res.redirect("/work")
  }else{
    items.push(item);
    res.redirect("/")
  }

})

app.get("/work", function(req, res){
  res.render("list", {listTitle: "Work List", newListItems: workItems})
})

app.post("/work", function(req, res){
  let item = req.body.newItem
  workItems.push(item)
  res.redirect("/ work")
})
app.listen(3000, function(){
  console.log("Server started on port 3000.");
});

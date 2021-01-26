const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name:"Welcome to your todolist!"
});

const item2 = new Item({
  name:"Hit + to add new item"
});

const item3 = new Item({
  name:"Hit the checkbox to delete item"
});

const defaultItems = [item1,item2,item3];

app.get("/",function(req,res){
  var today = new Date();
  var options = {
    weekday:"long",
    day:"numeric",
    month:"long"
  };
  var day = today.toLocaleDateString("en-US",options);

  Item.find({},function(err,foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Successfully entered items in db");
        }
      });
      res.redirect("/");
    }else{
      res.render("list",{kindofday:day, newitem:foundItems});
    }
  });
});

app.post("/",function(req,res){
  const stuff = new Item({
    name:req.body.newItem
  });
  stuff.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){
  const id = req.body.checkbox;
  Item.findByIdAndRemove(id, function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Deletion successful");
    }
    res.redirect("/");
  });
});

app.listen(3000,function(req,res){
  console.log("Server is running on port 3000");
});

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//const mongodb =require('mongojs');


//Port
const port = 1234;

//Init app
const app = express();

//Db Connection
const MongoClient = require('mongodb').MongoClient;
const objID =require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/';

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

//View Setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');

//connect to mongodb

MongoClient.connect(url, (err,db) => {
if (err) throw err;
var dbo = db.db('todoapp');
Todos = dbo.collection('todos');

app.listen(port, ()=>{
    console.log('Server listening on port: '+port)
});

});


app.get('/',(req,res,next) => {
    
        Todos.find({}).toArray(function(err,todos){

            if(err) throw err;
            console.log(todos);
            res.render('index',{
               todos: todos
            });    
        });
});
 
app.post('/todo/add',(req,res,next) =>
{
    const todo ={
        text: req.body.text,
        body: req.body.body
    }
    // Insert todo
    Todos.insert(todo,(err,result) => {
        if(err){
            return console.log(err)
            }
            console.log('Todo Added....');
            res.redirect('/')
    });
});

//delete
app.delete('/todo/delete/:id', (req,res,next) => {
    const query = {_id: objID(req.params.id)}
    Todos.deleteOne(query, (err, response) => {
        if(err){
            return console.log(err);
        }
        console.log('Todo Removed');
        res.send(200);
    });
});

  //Edit 
  app.get('/todo/edit/:id',(req,res,next) => {
    const query = {_id: objID(req.params.id)}
    
        Todos.find(query).next(function(err,todo){

            if(err){
            return console.log(err);
            } 
        
            res.render('edit',{
               todo: todo
            });    
        });
});

//Edit then Insert
app.post('/todo/edit/:id',(req,res,next) =>
{
    const query = {_id: objID(req.params.id)}
    const todo ={
        text: req.body.text,
        body: req.body.body
    }
    // Update todo
    Todos.updateOne(query, {$set:todo},(err,result) => {
        if(err){
            return console.log(err)
            }
            console.log('Todo Updated....');
            res.redirect('/')
    });
});




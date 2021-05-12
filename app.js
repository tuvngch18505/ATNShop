
var express = require('express')
var hbs = require('hbs')
var app = express()
var bodyParser = require("body-parser");
 
app.use(bodyParser.urlencoded({ extended: false}))
app.set('view engine','hbs')

var url = 'mongodb+srv://bboyfinger:bboyfinger123@cluster0.q601u.mongodb.net/asm2'                              //'mongodb://localhost:27017'; 
var MongoClient = require('mongodb').MongoClient; 

hbs.registerPartials(__dirname +'/views/partials')
app.use(express.static(__dirname +'/public'));

app.post('/update',async (req,res)=>{
    let id = req.body.txtId;
    let numberInput = req.body.txtNumber;
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let colorInput = req.body.txtColor;
    let materialInput = req.body.txtMaterial;
    let madeinInput = req.body.txtMadein;
    let DescriptionInput = req.body.txtDescription; 
    let newValues ={$set : {Number: numberInput, Name: nameInput, Price:priceInput, Color: colorInput, Material: materialInput, Madein: madeinInput, Description: DescriptionInput}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    let client= await MongoClient.connect(url);
    let dbo = client.db("asm2");
    await dbo.collection("product").updateOne(condition,newValues);
    res.redirect('/');
})

app.get('/edit',async (req,res)=>{
    let id = req.query.id;

    var ObjectID = require('mongodb').ObjectID;

    let condition = {"_id" : ObjectID(id)};

    let client= await MongoClient.connect(url);

    let dbo = client.db("asm2");

    let productToEdit = await dbo.collection("product").findOne(condition);

    res.render('edit',{product:productToEdit})

})

app.get('/delete',async (req,res)=>{
    let id = req.query.id;

    var ObjectID = require('mongodb').ObjectID;

    let condition = {"_id" : ObjectID(id)};

    let client= await MongoClient.connect(url);

    let dbo = client.db("asm2");

    await dbo.collection("product").deleteOne(condition);

    res.redirect('/')

})

app.get('/insert',(req, res) => {
    res.render("newproduct")
})

app.post('/doInsert',async (req, res)=>{
    var numberInput = req.body.txtNumber;
    var nameInput = req.body.txtName;
    var priceInput = req.body.txtPrice;
    var colorInput = req.body.txtColor;
    var materialInput = req.body.txtMaterial;
    var madeinInput = req.body.txtMadein;
    var DescriptionInput = req.body.txtDescription; 
    var newProduct = {Number: numberInput, Name: nameInput, Price:priceInput, Color: colorInput, Material: materialInput, Madein: madeinInput, Description: DescriptionInput};
    let client = await MongoClient.connect(url); // connect to url mongodb
    let dbo = client.db("asm2"); // connect to asm2 table
    await dbo.collection("product").insertOne(newProduct); // add insert
    res.redirect('/')
})

app.post('/search',async (req,res)=>{
    let client = await MongoClient.connect(url); // connect adress
    let nameInput = req.body.txtName;
    let searchCondition = new RegExp(nameInput, 'i')
    //hellởqeqưeq
    let dbo = client.db("asm2"); // connect database test table
    let results = await dbo.collection("product").find({Name: searchCondition}).toArray(); // lay product table
    res.render('index',{model: results})
})

app.get('/',async (req,res)=>{ /// connect database
    let client = await MongoClient.connect(url); // connect adress
    let dbo = client.db("asm2"); // connect database test table
    
    let results = await dbo.collection("product").find({}).toArray(); // lay product table
    res.render('index',{model: results})
})

app.get('/',(req,res)=>{
    res.render('index')
})

const PORT = process.env.PORT || 3000
app.listen(PORT);
console.log('Server is running' + PORT)









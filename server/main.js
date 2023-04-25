const express = require("express");
const multer = require("multer");
const fs = require("fs");
const db = require("./connectDB");
const common = require("./common");

// init
const app = express();
app.use(multer({ dest: './public/uploads' }).any());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// solution cors and router
app.all('*', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers','X-Requested-With,Content-Type')
  res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS')
  next();
})

app.get('/api/', async function (req, res) {
    res.json({'hello':'world'});
})


// require data
app.get('/api/verify-code/:code', async function (req, res) {
    res.json({result:true});
})

app.get('/api/extract-records/:code', async function (req, res) {
    res.json([{records:req.params.code+"-server"}]);
})

app.get('/api/create-records/', async function (req, res) {
    const recordsCode = common.createCode();
    common.createRecords(recordsCode);
    res.json({code:recordsCode});
})


// write data
app.post('/api/record-files/', async function (req, res) {
  res.json({type:req.files});
  console.log(req.files);
})

app.post('/api/record-text/', async function (req, res) {
  res.json({result:true});
  console.log(req.body);
})

app.listen(8082, function() {
    console.log("- path:http://localhost:8082");
})
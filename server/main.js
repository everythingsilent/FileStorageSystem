const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path =require("path");
const db = require("./Database");
const common = require("./Common");
const { encode } = require("punycode");

// init
const app = express();
app.use(multer({ dest: './uploads' }).any());
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
  res.json({'Author':'弃书捐剑'});
})

// read data
app.get('/api/verify-code/:code', async function (req, res) {
  var verifyCode = req.params.code;
  codeExist = await db.verifyCodeExist(verifyCode);
  res.json({result:codeExist});
})

app.get('/api/extract-records/:code', async function (req, res) {
  var code = req.params.code;
  var data = await db.extractRecords(code);
  res.json(data);
})

app.post('/api/create-records/', async function (req, res) {
  recordCode = await db.createRecords();
  res.json({code:recordCode});
})

// download file
app.get('/api/uploads/:fileName/:fileOriginalName', async function (req, res) {
  var fileName = req.params.fileName;
  var fileOriginalName = decodeURI(req.params.fileOriginalName);
  var filePath = path.join(__dirname, 'uploads', fileName);

  var stats = fs.statSync(filePath); 
  if(stats.isFile()){
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename='+fileOriginalName,
      'Content-Length': stats.size
    });
    fs.createReadStream(filePath).pipe(res);
  }else{
    res.end(404);
  }
})

// write data
app.post('/api/record-files/:code', async function (req, res) {
  var code = req.params.code;
  var fileObject = req.files[0];
  var fileName = fileObject.filename;
  var fileOriginalName = encodeURI(fileObject.originalname);
  var fileSize = fileObject.size;
  var fileUrl = 'http://localhost:8082/api/uploads/'+fileName+'/'+fileOriginalName;
  var fileUploadTime = new Date();
  var fileBson = new common.Bson(fileUploadTime, 'file', fileSize, fileOriginalName, fileUrl);

  if (db.record(code, fileBson)) {
    res.json({result:true});
  }else {
    res.end(404);
  }
})

app.post('/api/record-text/:code', async function (req, res) {
  // constructor(time, type, size, name, content)
  var code = req.params.code;
  var textContent = req.body.content;
  var textRecordTime = new Date();
  var textSize = textContent.length;
  var textName = '文本';
  var textBson = new common.Bson(textRecordTime, 'text', textSize, textName, textContent);

  if (db.record(code, textBson)) {
    res.json({result:true})
  }else {
    res.end(404);
  }
})

// delete data
app.get('/api/delete-record/:code/:id', async function (req, res) {
  var ObjectId = require('mongodb').ObjectId;
  var bson = {_id:new ObjectId(req.params.id)};
  var code = req.params.code;
  if (db.deleteRecord(code, bson)) {
    res.json({result:true});
  }else {
    res.end(404);
  }
})

app.listen(8082, function() {
  console.log("http://localhost:8082/api/");
})
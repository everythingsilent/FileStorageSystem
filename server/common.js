const path = require('path');
const fs = require('fs');

class Bson {
  constructor(time, type, size, name, content) {
      return  {
          time:time,
          type:type,
          size:size,
          name:name,
          content:content,
      }
  }
}

function createCollectionInsertInit() {
  const welcome = new Bson(new Date(), 'text', '1024', '公告', '作者：弃书捐剑');
  return welcome;
}

function randomCode() {
    var letterPool = "abcdefghijklmnopqrstuvwxyz";
    var numberPool = "0123456789";
    var code = '';

    var randomCodePool = numberPool;
    for (var i=0;i<4;i++) {
      var isLetter = parseInt(Math.random().toString()[3]) > 5;
      if (isLetter) {
        randomCodePool = letterPool;
      }else{
        randomCodePool = numberPool;
      }
      var codeKey = Math.floor(Math.random()*randomCodePool.length);
      code+=randomCodePool[codeKey];
    }
    return code;
}

function deleteFile(fileUrl) {
  const RegExp = /uploads\/(.*)\/[/s/S]*/g
  fileName = RegExp.exec(fileUrl)[1];
  filePath = path.join(__dirname, 'uploads', fileName);
  try {
    fs.unlinkSync(filePath);
  }catch {
    console.log('删除异常!');
  }
}

module.exports = {
  Bson,
  randomCode,
  createCollectionInsertInit,
  deleteFile
}
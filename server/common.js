function createCode() {
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

function createRecords(code) {
    console.log(code);
}

module.exports = {
    createCode,
    createRecords
}
const { MongoClient } = require("mongodb");
const common = require('./Common');

const url = 'mongodb://127.0.0.1';
const client = new MongoClient(url);
const db = client.db('test');

// read
async function verifyCodeExist(verifyCode) {
    const codeList = await db.listCollections().toArray();
    var codeExist = false
    codeList.forEach(code=>{
        if (code.name == verifyCode) {
            codeExist = true;
        }
    });
    return codeExist
}

async function extractRecords(code) {
    data = await (await db.collection(code).find({})).toArray();
    return data
}

// write
async function createRecords() {
    code = common.randomCode();
    if (await verifyCodeExist(code)) {
        createRecord();
    }else {
        initInsert = common.createCollectionInsertInit();
        await db.collection(code).insertOne(initInsert);
        return code
    }
}

async function record(code, bson) {
    if (await verifyCodeExist(code)) {
        await db.collection(code).insertOne(bson);
        return true
    } else{
        return false
    }
}

// delete
async function deleteRecord(code, bson) {
    if (await verifyCodeExist(code)) {
        data = await (await db.collection(code).find(bson)).toArray();
        if (data[0].type == 'file') {
            common.deleteFile(data[0].content);
        }
        await db.collection(code).deleteOne(bson);
        return true
    }else {
        return false
    }
}


module.exports = {
    verifyCodeExist,
    createRecords,
    extractRecords,
    record,
    deleteRecord,
}

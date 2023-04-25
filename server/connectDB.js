const {MongoClient} = require("mongodb");

async function main() {
    const url = "mongodb://127.0.0.1";
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log("- connect mongoDB state:success");
    }catch {
        console.log("- connect mongoDB state:error");
    }finally {
        await client.close();
    }
}

main();
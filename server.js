const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

async function main() {
  async function listDatabases() {
    let databasesList = await client.db().admin().listDatabases()
    databasesList.databases.forEach(db=> {
      console.log(db.name);
    })
  }

  const uri = "mongodb+srv://user:iamauser@airport-wonyq.mongodb.net/test?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
  try {
    await client.connect()
    await listDatabases(client)
  }
  catch  (e){
    console.error(e);
  }
  finally {
    await client.close()
  }
}

main().catch(console.error)

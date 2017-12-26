#!/usr/bin/env nodejs

const assert = require('assert');
const mongo = require('mongodb').MongoClient;
const process = require('process');

const user = require('./model/user');
const model = require('./model/model');
const server = require('./server/server');

const DB_URL = 'mongodb://localhost:27017/users';


function getPort(argv) {
  let port = null;
  if (argv.length !== 3 || !(port = Number(argv[2]))) {
    console.error(`usage: ${argv[1]} PORT`);
    process.exit(1);
  }
  return port;
}

const port = getPort(process.argv);

mongo.connect(DB_URL).
  then((db) => user.initUser(db)).
  then(function(db) {
    const model1 = new model.Model(db);
    server.serve(port, model1);
    //db.close();
  }).
  catch((e) => console.error(e));

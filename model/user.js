const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;
const USER = 'user';
const DEFAULT_INDEXES = { _id: 'text' };

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use('/users/:id', bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


function User(db) {
  this.db = db;
  this.user = db.collection(USER);
}

/*Get user */
User.prototype.getUser = function(id) {
  const searchSpec = { $text: { $search: id } };
  return this.user.find(searchSpec).toArray().
    then(function(user) {
      return new Promise(function(resolve, reject) {
	if (user.length === 1) {
	  resolve(user[0]);
	}
	else {
	  reject(new Error(`cannot find user ${id}`));
	}
      });
    });
}


/* Delete user */
User.prototype.deleteUser = function(id) {
  return this.user.deleteOne({_id: id	}).
    then(function(results) {
      return new Promise(function(resolve, reject) {
	if (results.deletedCount === 1) {
	  resolve();
	}
	else {
	  reject(new Error(`cannot delete user ${id}`));
	}
      });
    });
}

/*Add/Put user */
User.prototype.storeUser = function(tuple) {
  return this.user.insertOne(tuple).
    then(function(results) {
      return new Promise((resolve) => resolve(results.insertedId));      
    });
}

/* Post/Update User */
User.prototype.updateUser = function(id,body) {
  const UserSpec = ({ _id: id});
  return this.user.updateOne(UserSpec,{$set: body}).
    then(function(result) {
      return new Promise(function(resolve, reject) {
	if (result.modifiedCount !== 1) {
	  reject(new Error(`updated ${result.modifiedCount} user`));
	}
	else {
	  resolve();
	}
      });
    });
}


function initUser(db, user=null) {
  return new Promise(function(resolve, reject) {
    const collection = db.collection(USER);
      collection.createIndex(DEFAULT_INDEXES);
	resolve(db);
  });
}

module.exports = {
  User: User,
  initUser: initUser
};

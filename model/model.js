const user = require('./user');


function Model(db) {
  
  this.user = new user.User(db);
}


module.exports = {
  Model: Model
};

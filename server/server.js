const express = require('express');
const bodyParser = require('body-parser');


const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;
const SEE_OTHER = 303;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

function serve(port, model) {
  const app = express();
  app.locals.model = model;
  app.locals.port = port;
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });
}


function setupRoutes(app) {
  app.use('/users/:id', bodyParser.json());
  app.put('/users/:id', storeUser(app)); 
  app.get('/users/:id', getUser(app));
  app.delete('/users/:id', deleteUser(app));
  app.post('/users/:id', updateUser(app));

}

function requestUrl(req) {
  const port = req.app.locals.port;
  return `${req.protocol}://${req.hostname}:${port}${req.originalUrl}`;
}
  
module.exports = {
  serve: serve
}


/*GET */
function getUser(app) {
  return function(request, response) {
    const id = request.params.id;
    if (typeof id === 'undefined') {
      response.sendStatus(BAD_REQUEST);
    }
    else {
      request.app.locals.model.user.getUser(id).
	then((results) => response.json(results)).
	catch((err) => {
	  console.error(err);
	  response.sendStatus(NOT_FOUND);
	});
    }
  };
}

/* DELETE */
function deleteUser(app) {
  return function(request, response) {
    const id = request.params.id;
    if (typeof id === 'undefined') {
      response.sendStatus(BAD_REQUEST);
    }
    else {
      request.app.locals.model.user.deleteUser(id).
	then(() => response.end()).
	catch((err) => {
	  console.error(err);
	  response.sendStatus(NOT_FOUND);
	});
    }
  };
}


/* PUT */
function storeUser(app) {
  return function(request, response) {
	const body = request.body;
    request.app.locals.model.user.storeUser(body).
      then(function(id) {
	response.append('Location', requestUrl(request) + '/' + id);
	response.sendStatus(CREATED);
      }).
      catch((err) => {
	console.error(err);
	response.sendStatus(NO_CONTENT);
      });
  };
}


/* POST */
function updateUser(app) {
  return function(request, response) {
    const id = request.params.id;
    const body = request.body;
    if (typeof body === 'undefined') {
      response.sendStatus(BAD_REQUEST);
    }
    else {
      const user = response.locals.user;
      request.app.locals.model.user.updateUser(id, body).
	then(function(id) {
	response.sendStatus(SEE_OTHER);
      }).
      catch((err) => {
	console.error(err);
	response.sendStatus(NOT_FOUND);
      });
    }
  };
}

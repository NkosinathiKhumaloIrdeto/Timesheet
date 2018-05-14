let mongoose = require('mongoose');
let mongoUrl = 'mongodb://localhost:27017/Timesheets';
let assert = require('assert');

mongoose.connect('mongodb://127.0.0.2/test', function () { /* dummy function */ })
  .then(() => {
    return server.start();
  })
  .catch(err => { // mongoose connection error will be handled here

    console.error('App starting error:', err.stack);

    process.exit(1);
    
  });

describe('Test Connection:', function () {
  it('Should be able to connect to MongoDB', function () {

    assert.equal([1, 2, 3].indexOf(4), -1);

  });

});

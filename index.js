import Express from 'express'
import Cors from 'cors'
import BodyParser from 'body-parser'
import Mongoose from 'mongoose'

const app = Express();

//var Play = require('./models/play');
//var Movie = require('./models/movie');

/*
var db = Mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  console.log("Connected to mongod server");
});
Mongoose.connect('mongodb://localhost/cinema');
*/

app.use(Cors());
app.use(BodyParser.urlencoded({ extended : true}));
app.use(BodyParser.json());

const port = 8080;

//var router = require('./routes')(app, Play, Movie);

app.get('/', function(req,res){
  let str = "<div style='white-space: pre'>";
  str += 'This is Memo API Server Default Page';
  res.send(str);
});

const server = app.listen(port, function(){
  console.log("Express server has started on port " + port)
});
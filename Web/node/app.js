/**
 * app.js - Main Node.js Express Application Controller
 */

// Module dependencies.
var express = require('express'),
    pug = require('pug'),
    path = require('path'),
    eclairjs = require("eclairjs");

var app = express(),
    spark = new eclairjs();

var sparkSession = spark.sql.SparkSession
            .builder()
            .appName("Spark SQL Example")
            .getOrCreate();

var resultado = sparkSession.sql("SELECT * FROM dados");

var stringEncoder = spark.sql.Encoders.STRING();
    var teste = resultado.map(
     function (row) {
      return "id_predio: " + row.getString(0);
    }, stringEncoder);

// Setup the application's environment.
app.set('port',  process.env._EJS_APP_PORT || 3000);
app.set('host',  process.env.EJS_APP_HOST || 'ec2-52-67-25-14.sa-east-1.compute.amazonaws.com');
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

// Route all GET requests to our public static index.html page
app.get('/', function(req, res){
    res.render('index', {title: 'Using EclairJS to Count Words in a File', results: teste.take(5)});
});

// Start listening for requests
var server = app.listen(app.get('port'), app.get('host'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

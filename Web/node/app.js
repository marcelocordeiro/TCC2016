// Module dependencies
var express = require('express'),
    mysql = require('mysql');

var app = express();

// Setup the application's environment.
app.set('port',  process.env._EJS_APP_PORT || 3000);
app.set('host',  process.env.EJS_APP_HOST || 'ec2-52-67-25-14.sa-east-1.compute.amazonaws.com');

app.set('view engine', 'ejs'); 

app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use('/Fonts',  express.static(__dirname + '/public/Fonts'));
app.use('/Icons',  express.static(__dirname + '/public/Icons'));
app.use('/Images',  express.static(__dirname + '/public/Images'));
app.use('/Scripts',  express.static(__dirname + '/public/Scripts'));
app.use('/Styles',  express.static(__dirname + '/public/Styles'));


app.get('/',function(req,res){
    var pool = mysql.createPool({
      host     : 'localhost',
      user     : 'root',
      password : '32941457',
      database : 'tcc'
    });
    
    var results = "";
    var canvasscript = "";
    
    pool.getConnection(function (error, connection) {
        connection.query('SELECT * FROM paredes_1', function(err, rows, fields) {
          if (!err) {
            rows.forEach(function(value) {
                canvasscript += "ctx.beginPath(); ctx.moveTo(" + value.ponto1x * 8+ ", " + value.ponto1y * 8 + "); ctx.lineTo(" + value.ponto2x * 8 + ", " + value.ponto2y * 8 + "); ctx.stroke();";
            });
          }
          else {
            console.log('Erro!');
            console.log(err);
          }
        });
        
        connection.query('SELECT * FROM dispositivos_1 WHERE id_disp IN (SELECT MAX(id_disp) FROM dispositivos_1 GROUP BY mac ORDER BY mac)', function(err, rows, fields) {
          if (!err) {
            rows.forEach(function(value) {
                canvasscript += "ctx.beginPath(); ctx.arc(" + value.loc_x * 8 + ", " + value.loc_y * 8 + ", 2, 0, 2 * Math.PI); ctx.stroke();";
                if ((value.loc_x <= 25) && (value.loc_y <= 25))
                    results += "<tr> <td>" + value.mac + "</td> <td>Laboratório 1 (" + value.loc_x + ", " + value.loc_y + ")</tr>"
                else if ((value.loc_x >= 25) && (value.loc_y <= 25))
                    results += "<tr> <td>" + value.mac + "</td> <td>Laboratório 2 (" + value.loc_x + ", " + value.loc_y + ")</tr>"
                else if ((value.loc_x <= 25) && (value.loc_y >= 25))
                    results += "<tr> <td>" + value.mac + "</td> <td>Cozinha (" + value.loc_x + ", " + value.loc_y + ")</tr>"
                else
                    results += "<tr> <td>" + value.mac + "</td> <td>Banheiro (" + value.loc_x + ", " + value.loc_y + ")</tr>"
            });
            res.render('index', { canvas_script: canvasscript, devices: results});
          }
          else {
            console.log('Erro!');
            console.log(err);
          }
        });
    });
    


    
})

// Binding express app to port 3000
app.listen(app.get('port'), app.get('host'), function(){
    console.log('App express funcionando na porta ' + app.get('port'));
});
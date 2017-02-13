function insertinto() {
    
    var chosenmac = Math.floor(Math.random() * 17);
    var locx = Math.floor(Math.random() * 51);
    var locy = Math.floor(Math.random() * 51);
   
    connection.query('INSERT INTO dispositivos_1 (mac, loc_x, loc_y) VALUES ("' + macs[chosenmac] + '", ' + locx + ', ' + locy + ')', function(err, rows, fields) {
        if (!err)
            console.log("Adicionado " + macs[chosenmac] + " na posição " + locx + " e " + locy);
        else {
            console.log('Erro!');
            console.log(err);
        }
    });

}

var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '32941457',
    database : 'tcc'
});

var macs = ["F7:60:BF:C9:30:54", "24:8F:07:D6:5F:1F", "23:BB:53:F4:87:CE", "DD:4B:46:07:D9:76", "43:E5:9E:D2:8A:F7", "3B:2B:FE:7C:AA:F0", "A8:C0:3B:2E:38:BE", "E3:A7:43:F8:7C:D8", "7A:69:AF:18:CD:ED", "95:A9:96:4D:EF:F5", "1D:30:94:CF:B7:AD", "5B:60:3C:D1:E3:4C", "8B:AD:2A:22:35:DD", "48:46:CE:EC:4B:92", "01:24:07:20:BE:43", "09:C5:70:9A:51:46", "1B:55:25:6B:A9:DE"];

setInterval(insertinto, 5000);
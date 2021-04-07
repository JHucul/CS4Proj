let express = require('express');
let path = require("path");
var bodyParser = require('body-parser');   //new Need to add for post
var routes = require("./routes");

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));  //new Need to add for post
app.use(bodyParser.json());                          //new Need to add for post
app.use(routes);



let imagePathName = ""

//app.use(express.static('./public'))
app.use('/', express.static('./'));


//req is info sending to server from client.
//res is info sending to client from server.
app.get("/",function(req,res) {
    res.sendFile(path.resolve((__dirname,"public/views/index.html")));
});


app.get("/Chat",function(req,res) {
    res.sendFile(path.resolve((__dirname,"public/views/chat.html")));
});

app.get("/CreateChat",function(req,res) {
    res.sendFile(path.resolve((__dirname,"public/views/chatCreation.html")));
});
//below is a wrapper of http.createServer(requestHandler).listen(3000);
app.listen(3000,function() {
    console.log("started on port 3000");
});


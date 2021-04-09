let express = require('express');
let path = require("path");
var bodyParser = require('body-parser');   //new Need to add for post
var routes = require("./routes");
var info = require("./InfoContainer");
var Users = require("./Users");
var User = require('./User');
let db = new Users()
let app = express();
app.use(bodyParser.urlencoded({ extended: true }));  //new Need to add for post
app.use(bodyParser.json());                          //new Need to add for post
app.use(routes);
app.use(info);



let imagePathName = "";

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
app.post("/Login", function(req, res) {
    while(true){
        _users = db.getUsers()
        for(user in _users){
            if(user.name == req.body.name){
                if(req.body.passwd == user.passwd){
                    res.json({success : "login successful", status : 200})
                    break
                }
            }
            else{
                res.status(400).send({message: 'Login Error'})
                break
            }
        }
    }
})
app.post("/Register", function(req, res) {
    db.addUser(new User(req.body.name, req.body.passwd))
    res.json({success : "register successful", status : 200})
})
//below is a wrapper of http.createServer(requestHandler).listen(3000);
app.listen(3000,function() {
    console.log("started on port 3000");
});


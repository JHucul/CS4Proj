const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/group8', {useNewUrlParser: true, useUnifiedTopology: true});

var express = require("express");
var router = express.Router();
let path = require("path");
var formidable = require('formidable');
var mv = require('mv');
const http = require('http');
const fs = require('fs');
var bodyParser = require('body-parser'); 
router.use(bodyParser.urlencoded({ extended: true }));  //new Need to add for post
router.use(bodyParser.json());                          //new Need to add for post
var info = require("./InfoContainer");
var crypto = require('crypto');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Successfull database connection")
  const loginSchema = new mongoose.Schema({
    username: String,
    password: String,
    loggedin: Boolean,
    ip: String
  });
  const Login = mongoose.model('Login', loginSchema);

  router.post('/fileupload', function(req, res){
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        var newpath = __dirname + '/public/images/' + files.filetoupload.name;
        var newPathName = newpath.replace(/%/g, "");
        mv(oldpath, newPathName, function (err) {
          if (err) throw err;
        });
      });
  });

  router.get('/getDirPath', function(req, res){
      res.json({dir:__dirname});
  })

  router.get('/getTextLogText', function(req, res){
    fs.readFile(req.query.publicPath, (err, data) => {
        if (err) throw err;
        res.json({textLog:data.toString()});
    })
  })
  router.get('/getLoginInfoText', function(req, res){
      res.json({text:JSON.parse(fs.readFileSync('./logins.json', 'utf-8'))});
  })
  router.get('/getBannedIPs', function(req, res){
      res.json({text:JSON.parse(fs.readFileSync('./BannedIPs.json', 'utf-8'))});
  })
  router.get('/GetAdmins', function(req, res){
    res.json({text:JSON.parse(fs.readFileSync('./AdminIPs.json', 'utf-8'))});
  })
  router.post('/CheckBan', function(req, res){
    let jsonData = JSON.parse(fs.readFileSync('./BannedIPs.json', 'utf-8'))
    for(var i = 0; i < jsonData.Users.length; i++) {
        var obj = jsonData.Users[i];
        if(req.body.name == obj.username){
          res.json({banned:true});
          return;
        }
    }
    res.json({banned:false});
  })
  router.post('/CheckAdmin', function(req, res){
    let jsonData = JSON.parse(fs.readFileSync('./AdminIPs.json', 'utf-8'))
    for(var i = 0; i < jsonData.Users.length; i++) {
        var obj = jsonData.Users[i];
        if(req.body.name == obj.username){
          res.json({admin:true});
          return;
        }
    }
    res.json({admin:false});
  })

  router.post('/setTextLogText', function(req, res){////req.query for get, req.body for post
    fs.appendFile(req.body.publicPath, req.body.text, (err) => {
      if (err) {
          console.log(err);
        }
      });
    fs.appendFile(req.body.devPath, req.body.text + req.body.ip, (err) => {
        if (err) {
          console.log(err);
        }
      });
      res.json({default:"text"});
  })
  router.post('/AddIpToBanList', function(req, res){
    fs.readFile('./BannedIPs.json', 'utf8', (err, data) => {
      if (err) {
          console.log(`Error reading file from disk: ${err}`);
          res.sendStatus(500)
      } 
      else{
          // parse JSON string to JSON object
          const banned = JSON.parse(data);
          banned.Users.push({
            //ip: req.body.ip
            username: req.body.name
          });
          // write new data back to the file
          fs.writeFile('./BannedIPs.json', JSON.stringify(banned, null, 4), (err) => {
            if (err) {
              console.log(`Error writing file: ${err}`);
              res.sendStatus(500)
            }
          });
          res.sendStatus(200)
      }
    });
  })
  router.post('/RemoveIpFromBanList', function(req, res){
    fs.readFile('./BannedIPs.json', 'utf8', (err, data) => {
      if (err) {
          console.log(`Error reading file from disk: ${err}`);
          res.sendStatus(500)
      } 
      else{
          // parse JSON string to JSON object
          const banned = JSON.parse(data);
          for(let i = 0; i < banned.Users.length; i++){
            if(banned.Users[i].username == req.body.name){
              banned.Users.splice(i, 1);
            }
          }
          // write new data back to the file
          fs.writeFile('./BannedIPs.json', JSON.stringify(banned, null, 4), (err) => {
            if (err) {
              console.log(`Error writing file: ${err}`);
              res.sendStatus(500)
            }
          });
          res.sendStatus(200)
      }
    });
  })
  router.post('/AddToAdminList', function(req, res){
    fs.readFile('./AdminIPs.json', 'utf8', (err, data) => {
      if (err) {
          console.log(`Error reading file from disk: ${err}`);
          res.sendStatus(500)
      } 
      else{
          // parse JSON string to JSON object
          const banned = JSON.parse(data);
          banned.Users.push({
            //ip: req.body.ip
            username: req.body.name
          });
          // write new data back to the file
          fs.writeFile('./AdminIPs.json', JSON.stringify(banned, null, 4), (err) => {
            if (err) {
              console.log(`Error writing file: ${err}`);
              res.sendStatus(500)
            }
          });
          res.sendStatus(200)
      }
    });
  })
  router.post('/RemoveIpFromAdminList', function(req, res){
    fs.readFile('./AdminIPs.json', 'utf8', (err, data) => {
      if (err) {
          console.log(`Error reading file from disk: ${err}`);
          res.sendStatus(500)
      } 
      else{
          // parse JSON string to JSON object
          const banned = JSON.parse(data);
          for(let i = 0; i < banned.Users.length; i++){
            if(banned.Users[i].username == req.body.name){
              banned.Users.splice(i, 1);
            }
          }
          // write new data back to the file
          fs.writeFile('./AdminIPs.json', JSON.stringify(banned, null, 4), (err) => {
            if (err) {
              console.log(`Error writing file: ${err}`);
              res.sendStatus(500)
            }
          });
          res.sendStatus(200)
      }
    });
  })

  router.post('/clearTextLogText', function(req, res){////req.query for number, req.body for strings
      fs.writeFile(req.body.publicPath,'', (err) => {

        // In case of a error throw err.
        if (err) throw err;
    })
      res.json({default:'text'});
  })
  router.post('/Login', function(req, res){
    userName = JSON.stringify(req.body.name)
    userPassword = JSON.stringify(req.body.passwd)
    userIP = JSON.stringify(req.body.ip)
    Login.find({username: userName, password: userPassword}).exec( function (err, logins) {
      console.log("finding")
      if (err){
        console.log(err);
        res.sendStatus(500)
      }
      else if(logins.length){
        console.log("updating")
        Login.updateOne({username: userName}, {loggedin:true})
        res.sendStatus(200)
      }
    })
})
  router.post('/Register', function(req, res){
      let present = false
      userName = JSON.stringify(req.body.name)
      userPassword = JSON.stringify(req.body.passwd)
      userIP = JSON.stringify(req.body.ip)
      Login.find({username: userName}, function (err, logins) {
        if (err){
          console.log(err);
          res.sendStatus(500)
        }
        else if(logins.length){
          present = true
        }
      })
      if(present == false){
        user = new Login({
          username: userName,
          password: userPassword,
          loggedin: true,
          ip: userIP
        })
        user.save(function (err, user) {
          if (err){
            console.log(err);
            res.sendStatus(500)
          } 
          else{
            res.sendStatus(200)
          } 
        });
      }
  })
  router.get('/Chat', function(req, res){
    userName = JSON.stringify(req.query.name)
    Login.find({username: userName, loggedin:true}).exec(function (err, logins) {
      if (err){
        console.log(err);
        res.sendStatus(500)
      }
      else if(logins.length){
        res.sendFile('public/views/Chat.html', {root: __dirname })
      }
      else{
        res.sendStatus(403)
      }
    })
  })
  router.post("/logout", function(req, res){
    // unfinished
    userName = JSON.stringify(req.body.name)
    Login.updateOne({username: userName}, {loggedin:false})
  })
  router.get('/CreateChat', function(req, res){
    fs.readFile('./logins.json', 'utf8', (err, data) => {
      if (err) {
        console.log(`Error reading file from disk: ${err}`);
        res.sendStatus(500)
      } else {
        const logins = JSON.parse(data);
        let present = false
        logins.users.forEach(element => {
          if(element.username == req.query.name && element.loggedin == true){
            present = true
          }
        })
        if(!present){
          res.sendStatus(403)
        }
        else{
          res.sendFile('public/views/chatCreation.html', {root: __dirname })
        }
      }
    })
  })
})
module.exports = router;


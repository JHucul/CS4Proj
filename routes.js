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
        try {
          let fileSize = files.filetoupload.size / 1000000.0;
          if(fileSize > 90){
            console.log("File to big");
            return;
          }
          var oldpath = files.filetoupload.path;
          var newpath = __dirname + '/public/images/' + files.filetoupload.name;
          var newPathName = newpath.replace(/%/g, "");
          mv(oldpath, newPathName, function (err) {
            if (err) throw err;
          });
        } catch (error) {}
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
      //res.json({text:JSON.parse(fs.readFileSync('./logins.json', 'utf-8'))});
      Login.find(function (err, logins) {
        if (err){
          console.log(err);
          res.sendStatus(500)
        }
        else
          res.json({text:logins});
      })
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
    Login.find({username: req.body.name, password: req.body.passwd}).exec( function (err, logins) {
      console.log("finding")
      if (err){
        console.log(err);
        res.sendStatus(500)
      }
      else if(logins.length){
        console.log("updating")
        Login.updateOne({username: req.body.name}, {loggedin:true}).exec(function (err, logins){
          if(err){
            console.log(err)
            res.sendStatus(500)
          }
          else
            res.sendStatus(200)
        })
        
      }
    })
})
  router.post('/Register', function(req, res){
      let present = false
      if(req.body.name.includes('"') || req.body.name.includes("'")){
        res.json({status:"WrongCharacter"});
        return;
      }
      else{
        Login.find({username: req.body.name}, function (err, logins) {
          if (err){
            console.log(err);
            //res.sendStatus(500)
          }
          else if(logins.length){
            present = true
            res.json({status:"NameTaken"});
            return;
          }
          if(present == false){
            user = new Login({
              username: req.body.name,
              password: req.body.passwd,
              loggedin: true,
              ip: req.body.ip
            })
            user.save(function (err, user) {
              if (err){
                console.log(err);
                //res.sendStatus(500)
              } 
              else{
                //res.sendStatus(200)
                res.json({status:"Good"});
              } 
            });
          }
        })
      }
  })
  router.get('/Chat', function(req, res){
    Login.find({username: req.query.name, loggedin:true}).exec(function (err, logins) {
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
    console.log(req.body.name)
    Login.updateOne({username: req.body.name}, {loggedin:false}).exec(function (err, logins){
      if(err){
        console.log(err)
        res.sendStatus(500)
      }
      else
        res.sendStatus(200)
    })
  })
  router.get('/CreateChat', function(req, res){
    Login.find({username: req.query.name, loggedin:true}).exec(function (err, logins) {
      if (err){
        console.log(err);
        res.sendStatus(500)
      }
      else if(logins.length){
        res.sendFile('public/views/chatCreation.html', {root: __dirname })
      }
      else{
        res.sendStatus(403)
      }
    })
  })
})
module.exports = router;


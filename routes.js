
var express = require("express");
var router = express.Router();
let path = require("path");
var formidable = require('formidable');
var mv = require('mv');
const fs = require('fs');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));  //new Need to add for post
router.use(bodyParser.json());                          //new Need to add for post
var info = require("./InfoContainer");



router.post('/fileupload', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = __dirname + '/public/images/' + files.filetoupload.name;
      mv(oldpath, newpath, function (err) {
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

router.post('/CheckBan', function(req, res){
  let jsonData = JSON.parse(fs.readFileSync('./BannedIPs.json', 'utf-8'))
  //console.log(jsonData);
  for (var key of Object.keys(jsonData)) {
    if(req.body.ip == jsonData[key]){
      res.json({banned:true});
      return;
    }
  }
  res.json({banned:false});
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

router.post('/clearTextLogText', function(req, res){////req.query for number, req.body for strings
    fs.writeFile(req.body.publicPath,'', (err) => {

      // In case of a error throw err.
      if (err) throw err;
  })
    res.json({default:'text'});
})
router.post('/Login', function(req, res){
  fs.readFile('./logins.json', 'utf8', (err, data) => {
    const logins = JSON.parse(data);
    for(var i=0; i<logins.users.length; i++){
      logins.users[i].loggedin = false
    }
    let present = false
    // logins.users.forEach(element => {
    //   if(element.username == req.body.name && element.password == req.body.passwd){
    //     present = true
    //     element.loggedin = true
    //     res.sendStatus(200)
    //   }
    // });
    for(var i=0; i<logins.users.length; i++){
      if(logins.users[i].username == req.body.name && logins.users[i].password == req.body.passwd){
        present = true
        logins.users[i].loggedin = true
        res.sendStatus(200)
      }
    }
    if(!present)
      res.sendStatus(403)
  });
})
router.post('/Register', function(req, res){
  fs.readFile('./logins.json', 'utf8', (err, data) => {

    if (err) {
        console.log(`Error reading file from disk: ${err}`);
        res.sendStatus(500)
    } else {

        // parse JSON string to JSON object
        const logins = JSON.parse(data);
        // for(var i=0; i<logins.users.length; i++){
        //   logins.users[i].loggedin = false
        // }
        // add a new record
        let present = false
        logins.users.forEach(element => {
          if(element.username == req.body.name){
            present = true
            res.sendStatus(403)
          }
        });
        if(present == false){
          logins.users.push({
            username: req.body.name,
            password: req.body.passwd,
            ip: req.body.ip,
            // loggedin: true
          });
          // write new data back to the file
          fs.writeFile('./logins.json', JSON.stringify(logins, null, 4), (err) => {
            if (err) {
              console.log(`Error writing file: ${err}`);
              res.sendStatus(500)
            }
          });
          res.sendStatus(200)
        }
    }
  });
})

module.exports = router;

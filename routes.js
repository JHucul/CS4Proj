
var express = require("express");
var router = express.Router();
var formidable = require('formidable');
var mv = require('mv');
const fs = require('fs');

var info = require("./InfoContainer");

let pathName = "";
//let curChatDir = (__dirname,'public/logs/GlobalChat1.txt');
let curChatNum = 0;

/*
router.get("/setFileLocation",function(req,res){
      res.json({imagepathName:pathName});
});

router.post('/fileupload', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = __dirname + '/public/' + files.filetoupload.name;
      mv(oldpath, newpath, function (err) {
        if (err) throw err;
        pathName = '/public/' + files.filetoupload.name
        res.write('File uploaded and moved!');
        res.end();
      });
    });
});
*/

router.post('/ChangeChat',function(req,res) {
    //console.log(info.ChatContainer[req.body.number].name)
    //curChatDir = info.ChatContainer[req.body.number].path;
    curChatNum = req.body.number;
    res.json({default:"text"});
});

router.get('/getTextLogText', function(req, res){
  //res.json({textLog:info.ChatContainer[curChatNum].textLog});
  fs.readFile(info.ChatContainer[curChatNum].publicPath, (err, data) => {
      if (err) throw err;
      res.json({textLog:data.toString()});
  })
})

router.post('/setTextLogText', function(req, res){////req.query for get, req.body for post
   //info.ChatContainer[curChatNum].textLog += req.body.text;
   fs.appendFile(info.ChatContainer[curChatNum].publicPath, req.body.text, (err) => {
     if (err) {
        console.log(err);
      }
    });
   fs.appendFile(info.ChatContainer[curChatNum].devPath, req.body.text + "PlaceHolderforIP", (err) => {
      if (err) {
        console.log(err);
      }
    });
    res.json({default:"text"});
})

router.post('/clearTextLogText', function(req, res){////req.query for number, req.body for strings
    //info.ChatContainer[curChatNum].textLog = '';
    fs.writeFile(info.ChatContainer[curChatNum].publicPath,'', (err) => { 
        
      // In case of a error throw err. 
      if (err) throw err; 
  })
    res.json({default:'text'});
})

module.exports = router;



var express = require("express");
var router = express.Router();
var formidable = require('formidable');
var mv = require('mv');
const fs = require('fs')
 

let pathName = ""

/*
router.get("/",function(req,res){
	    res.sendFile(__dirname + "/index.html");
});
*/

router.get("/setFileLocation",function(req,res){
      //console.log(pathName)
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

router.get('/getTextLogText', function(req, res){
  var text;
  fs.readFile((__dirname,'public/TextLog.txt'), (err, data) => {
      if (err) throw err;
    
      text = data.toString()
      res.json({textLog:text});
  })
})

router.post('/setTextLogText', function(req, res){////req.query for number, req.body for strings
   fs.appendFile((__dirname,'public/TextLog.txt'), req.body.text, (err) => {
    if (err) {
      console.log(err);
    }
  });
   /*
  fs.readFile((__dirname,'public/TextLog.txt'), (err, data) => {
      if (err) throw err;
      data.toString()

      fs.writeFile((__dirname,'public/TextLog.txt'), data.toString() + req.body.text, (err) => { 
          
        // In case of a error throw err. 
        if (err) throw err; 
    }) 
  })
  */
})

router.post('/clearTextLogText', function(req, res){////req.query for number, req.body for strings

    fs.writeFile((__dirname,'public/TextLog.txt'),"", (err) => { 
        
      // In case of a error throw err. 
      if (err) throw err; 
  })
})

module.exports = router;



//const localStorage = require('local-storage');

let chat1 = {
  		name: "Global Chat 1",
  		password: "123",
  		colour: "black",
  		publicPath:(__dirname,'public/logs/GlobalChat1/DisplayedChat.txt'),
  		devPath:(__dirname,'public/logs/GlobalChat1/DevChat.txt'),
  		//profiles: { names = ["Andy" , "Steve" , "Tony" ] },
	    textLog:""
}
let chat2 = {
  		name: "Global Chat 2",
  		password: "123",
  		colour: "red",
  		publicPath:(__dirname,'public/logs/GlobalChat2/DisplayedChat.txt'),
  		devPath:(__dirname,'public/logs/GlobalChat2/DevChat.txt'),
  		//profiles: { names = ["Andy" , "Steve" , "Tony" ] },
  		textLog: ""
}
let chat3 = {
  		name: "Global Chat 3",
  		password: "123",
  		colour: "blue",
  		publicPath:(__dirname,'public/logs/GlobalChat3/DisplayedChat.txt'),
  		devPath:(__dirname,'public/logs/GlobalChat3/DevChat.txt'),
  		//profiles: { names = ["Andy" , "Steve" , "Tony" ] },
  		textLog: ""
}

this.ChatContainer = [chat1, chat2, chat3]
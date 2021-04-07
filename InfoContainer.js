

let chat1 = {
  		name: "Global Chat 1",
  		password: "123",
  		colour: "black",
  		path:(__dirname,'public/logs/GlobalChat1.txt'),
  		//profiles: { names = ["Andy" , "Steve" , "Tony" ] },
  		textLog: ""
}
let chat2 = {
  		name: "Global Chat 2",
  		password: "123",
  		colour: "red",
  		path:(__dirname,'public/logs/GlobalChat2.txt'),
  		//profiles: { names = ["Andy" , "Steve" , "Tony" ] },
  		textLog: ""
}
let chat3 = {
  		name: "Global Chat 3",
  		password: "123",
  		colour: "blue",
  		path:(__dirname,'public/logs/GlobalChat3.txt'),
  		//profiles: { names = ["Andy" , "Steve" , "Tony" ] },
  		textLog: ""
}

this.ChatContainer = [chat1, chat2, chat3]
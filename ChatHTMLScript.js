
setInterval(ShowTextLogBut, 500);//speed at which the chat log is updated, lower makes it faster
let curChatNum = JSON.parse(localStorage.getItem("curChatnumKey"));
let dirName = "";
let localChatContainer = [];
let scrollDown = true;

function Chat(_name, _password, _color, _publicPath, _devPath){
  this.name = _name;
  this.password = _password;
  this.color = _color;
  this.publicPath = _publicPath;
  this.devPath = _devPath;
}


function JumpToBottom(){
  if(document.getElementById("chatBox") != null)
    document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight
}
function ShowTextLog(data){
  $("#chatBox").html(data.textLog).text()  
  if(scrollDown)
    JumpToBottom();
}
function ShowTextLogBut(data){
	$.get("/getTextLogText", {num:curChatNum, publicPath:localChatContainer[curChatNum].publicPath}, ShowTextLog);
}
function InputText(){
  if($("#input").val() == ""  && $("#fileStuff").val() == "")//case for no pic or text
    alert("You need to input somthing to send")
  else if($("#input").val() != "" && $("#fileStuff").val() != ""){//case for both text and pic input
    $.post('/setTextLogText', {num:curChatNum, publicPath:localChatContainer[curChatNum].publicPath, devPath:localChatContainer[curChatNum].devPath, 
                              text:"\n" + "<text style=color:#7a49a5><b>" + sessionStorage.name + "</b></text>" + "\n" + $("#input").val()+ "\n" + 
                              "<img src=" + "'/public/images/" + $("#fileStuff").val().split('\\').pop() + "'" + ">" + "\n" }, null)
    $("#picForm").submit();
    $("#input").val("");
    $("#fileStuff").val("");
  }
  else if($("#input").val() != ""){//case for just text input
    $.post('/setTextLogText', {num:curChatNum,publicPath:localChatContainer[curChatNum].publicPath, devPath:localChatContainer[curChatNum].devPath,
           text:"\n" + "<text style=color:#7a49a5><b>" + sessionStorage.name + "</b></text>" + "\n" + $("#input").val()+ "\n"}, null)
    $("#input").val("");
  }
  else if($("#fileStuff").val() != ""){//case for just pic input
    $.post('/setTextLogText', {num:curChatNum,publicPath:localChatContainer[curChatNum].publicPath, devPath:localChatContainer[curChatNum].devPath,
                               text:"\n" + "<text style=color:#7a49a5><b>" + sessionStorage.name + "</b></text>" + "\n" + 
                               "<img src=" + "'/public/images/" + $("#fileStuff").val().split('\\').pop() + "'" + ">" + "\n" }, null)

    $("#picForm").submit();
    $("#fileStuff").val("");
  } 
  scrollDown = true;   
  $.get("/getTextLogText", {num:curChatNum, publicPath:localChatContainer[curChatNum].publicPath}, ShowTextLog);
}
function ClearTextLog(data){
	$.post("/clearTextLogText", {num:curChatNum, publicPath:localChatContainer[curChatNum].publicPath}, null);
	ShowTextLogBut();
}
function ChangeChat(num){
  curChatNum = num;
  $("#CurChatDisplayName").html(localChatContainer[curChatNum].name);
  localStorage.setItem("curChatnumKey", JSON.stringify(curChatNum));
  ShowTextLogBut();
  JumpToBottom();
  //document.getElementById("textDisplay").scrollTop = document.getElementById("textDisplay").scrollHeight
}
function CreateChatButtons(data){
  for (var i = 3; i < JSON.parse(localStorage.getItem("chatContainerKey")).length; i++) { // -3
    var btn = document.createElement('input');
    btn.type = "button";
    btn.name = i;
    btn.id = JSON.parse(localStorage.getItem("chatContainerKey"))[i].name; 
    btn.value = JSON.parse(localStorage.getItem("chatContainerKey"))[i].name;
    //btn.class = "ChatButton";
    btn.onclick = function(j) { return function() { ChangeChat(j); }; }(i)
    $('#container').append(btn);
  }
}   
function CreateNewChat(){
  if($("#chatName").val() != ""){
    $.post("/CreateChatFunction", {name:$("#chatName").val(), ChatContainer:localChatContainer}, UpdateLocalChatContainer)
    window.location.href = '/Chat'
  }
  else if($("#chatName").val() == ""){
    alert("Put in a chat name");
  }
}
function UpdateLocalChatContainer(data){
  localChatContainer.push(data.container);
  localStorage.setItem("chatContainerKey", JSON.stringify(localChatContainer));
  console.log(localChatContainer.length);
}
window.onload = function NewFunction() {
  //document.getElementById("textDisplay").scrollTop = document.getElementById("textDisplay").scrollHeight
} 
function Initialize(data){
  if(JSON.parse(localStorage.getItem("chatContainerKey")) == null){
    dirName = data.dir + "/";
    let chat1 = new Chat("Global Chat 1", "123", "black", 
              (dirName + 'public/logs/GlobalChat1/DisplayedChat.txt'), 
              (dirName + 'public/logs/GlobalChat1/DevChat.txt'));
    let chat2 = new Chat("Global Chat 2", "123", "red", 
              (dirName + '/public/logs/GlobalChat2/DisplayedChat.txt'), 
              (dirName + '/public/logs/GlobalChat2/DevChat.txt'));
    let chat3 = new Chat("Global Chat 3", "123", "blue", 
              (dirName +'/public/logs/GlobalChat3/DisplayedChat.txt'), 
              (dirName +'/public/logs/GlobalChat3/DevChat.txt'));

    localChatContainer = [chat1, chat2, chat3];
    localStorage.setItem("chatContainerKey", JSON.stringify(localChatContainer));
    $("#CurChatDisplayName").html(localChatContainer[curChatNum].name); 
  }
  else{
    localChatContainer = JSON.parse(localStorage.getItem("chatContainerKey"));
    $("#CurChatDisplayName").html(localChatContainer[curChatNum].name); 
    //localStorage.removeItem("chatContainerKey");
    console.log(localChatContainer)
  }
  CreateChatButtons(); 

}
$(document).ready(function(){ 
  //$.get("/CreateChatButtons", null, CreateChatButtons);
  //$.get("/getTextLogText", {num:curChatNum, publicPath:localChatContainer[curChatNum].publicPath}, ShowTextLog); 
  $.get("/getDirPath", null, Initialize) 
  $("#sendBut").click(InputText);
  $("#clearBut").click(ClearTextLog);
  $("#creatBut").click(CreateNewChat);
  $("#JumpBut").click(JumpToBottom);
  $("#nameInput").html("Your Name: " + sessionStorage.name)
  $('#input').keydown(function(e){
  if(e.keyCode === 13)
    InputText();
  });
  $("#chatBox").on("wheel", function() {
    scrollDown = false;
    if(document.getElementById("chatBox").scrollTop >= (document.getElementById("chatBox").scrollHeight - document.getElementById("chatBox").offsetHeight))
      scrollDown = true;
  })
});     
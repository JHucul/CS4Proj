
let curChatNum = JSON.parse(localStorage.getItem("curChatnumKey"));
let dirName = "";
let localChatContainer = [];
let scrollDown = true;
let userIp = "";
let tempText = "";
let date = new Date();

function Chat(_name, _password, _color, _publicPath, _devPath){
  this.name = _name;
  this.password = _password;
  this.color = _color;
  this.publicPath = _publicPath;
  this.devPath = _devPath;
}
setInterval(ShowTextLogBut, 500);//speed at which the chat log is updated, lower makes it faster
setTimeout(FirstTextLog, 1000);

function JumpToBottom(){
  if(document.getElementById("chatBox") != null)
    document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight
}
function ShowTextLog(data){
  let newText = data.textLog.replace(tempText, "");
  //console.log(newText);
  if(newText != ""){  
    if(newText.includes("img")){
      tempText = data.textLog;
      setTimeout(function() { delayedSetText(data, newText); }, 500);
    }
    else{
      $("#chatBox").append(newText);
      tempText = data.textLog;
    }
  }
  if(scrollDown)
    JumpToBottom();
}
function delayedSetText(data, newText){
  $("#chatBox").append(newText);
}
function ShowTextLogBut(data){
  $.post("/CheckBan", {ip:userIp, name:sessionStorage.name}, SendToTheBanPage);
	$.get("/getTextLogText", {num:curChatNum, publicPath:localChatContainer[curChatNum].publicPath}, ShowTextLog);
}
function FirstTextLog(data){
	$.get("/getTextLogText", {num:curChatNum, publicPath:localChatContainer[curChatNum].publicPath}, FirstShowTextLog);
}
function FirstShowTextLog(data){
  tempText = data.textLog;
  $("#chatBox").html(data.textLog).text()
  if(scrollDown)
    JumpToBottom();
}
function InputText(){
  let curTime = "";
  if(date.getHours() <= 12){
    if(date.getMinutes() < 10)
      curTime = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " at " + date.getHours() + ":0" + date.getMinutes() + " am";
    else
      curTime = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + " am";
  }
  else{
    if(date.getMinutes() < 10)
      curTime = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " at " + (parseInt(date.getHours()) - 12) + ":0" + date.getMinutes() + " pm";
    else
      curTime = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " at " + (parseInt(date.getHours()) - 12) + ":" + date.getMinutes() + " pm";
  }
  let time = " " + "<text style='font-family: system-ui;font-size:15px;'>" + curTime + "</text>";

  if($("#input").val() == ""  && $("#fileStuff").val() == "")//case for no pic or text
    alert("You need to input somthing to send");
  else if($("#nameInput").html() == "Your Name: undefined")//case for if they manually skiped the login page
    alert("You need to login or register first");
  else if($("#input").val() != "" && $("#fileStuff").val() != ""){//case for both text and pic input
    let newPicName = $("#fileStuff").val().split('\\').pop().replace(/%/g, "");
    if($("#input").val().includes("<") && $("#input").val().includes(">")){
      $.post('/setTextLogText', {num:curChatNum, ip:userIp, publicPath:localChatContainer[curChatNum].publicPath, devPath:localChatContainer[curChatNum].devPath,
        text:"\n" + "<text style=color:#7a49a5><b>" + sessionStorage.name + "</b></text>" + time + "\n" + "I, " + sessionStorage.name + " may be a big dumb smelly boy that loves feet, but even I can see that this is an awesome project" + 
        "\n" +"<img src=" + "'/public/images/" + newPicName + "'" + ">" + "\n"}, null)
    }
    else if($("#input").val().includes("https://")){
      $("#picForm").submit();
      let message = $("#input").val().split(' ');
      let hyperLink = "";
      for(let i = 0; i < message.length; i++){
        if(message[i].includes("https://")){
          if(message[i].includes("youtube") && message[i].includes("watch")){
            hyperLink = message[i];
            hyperLink = hyperLink.replace("watch?v=", "embed/");
            message[i] = "<iframe width='420' height='345' src='" + hyperLink + "'></iframe>";
          }
          else{
            hyperLink = message[i];
            message[i] = "<a href='" + hyperLink + "'>" + hyperLink + "</a>";
          }
       }
      }
      //console.log(hyperLink);
      let joinedMessage = message.join(" ");
      //console.log(joinedMessage);

      $.post('/setTextLogText', {num:curChatNum, ip:userIp, publicPath:localChatContainer[curChatNum].publicPath, devPath:localChatContainer[curChatNum].devPath,
        text:"\n" + "<text style=color:#7a49a5><b>" + sessionStorage.name + "</b></text>" + time + "\n" + joinedMessage + "\n" +"<img src=" + "'/public/images/" + newPicName + "'" + ">" + "\n"}, null)
    }
    else{   
      $("#picForm").submit();
      $.post('/setTextLogText', {num:curChatNum, ip:userIp, publicPath:localChatContainer[curChatNum].publicPath, devPath:localChatContainer[curChatNum].devPath, 
                                text:"\n" + "<text style=color:#7a49a5><b>" + sessionStorage.name + "</b></text>" + time + "\n" + $("#input").val()+ "\n" + 
                                "<img src=" + "'/public/images/" + newPicName + "'" + ">" + "\n" }, null)  
    }
    $("#input").val("");
    $("#fileStuff").val("");
  }
  else if($("#input").val() != ""){//case for just text input
    if($("#input").val().includes("<") && $("#input").val().includes(">")){
      $.post('/setTextLogText', {num:curChatNum, ip:userIp, publicPath:localChatContainer[curChatNum].publicPath, devPath:localChatContainer[curChatNum].devPath,
        text:"\n" + "<text style=color:#7a49a5><b>" + sessionStorage.name + "</b></text>" + time + "\n" + "I, " + sessionStorage.name + " may be a big dumb smelly boy that loves feet, but even I can see that this is an awesome project" + "\n"}, null)
    }
    else if($("#input").val().includes("https://")){
      let message = $("#input").val().split(' ');
      let hyperLink = "";
      for(let i = 0; i < message.length; i++){
         if(message[i].includes("https://")){
          if(message[i].includes("youtube") && message[i].includes("watch")){
            hyperLink = message[i];
            hyperLink = hyperLink.replace("watch?v=", "embed/");
            message[i] = "<iframe width='420' height='345' src='" + hyperLink + "'></iframe>";
          }
          else{
            hyperLink = message[i];
            message[i] = "<a href='" + hyperLink + "'>" + hyperLink + "</a>";
          }
        }
      }
      //console.log(hyperLink);
      let joinedMessage = message.join(" ");
      //console.log(joinedMessage);

      $.post('/setTextLogText', {num:curChatNum, ip:userIp, publicPath:localChatContainer[curChatNum].publicPath, devPath:localChatContainer[curChatNum].devPath,
        text:"\n" + "<text style=color:#7a49a5><b>" + sessionStorage.name + "</b></text>" + time + "\n" + joinedMessage + "\n"}, null)
    }
    else{
    $.post('/setTextLogText', {num:curChatNum, ip:userIp, publicPath:localChatContainer[curChatNum].publicPath, devPath:localChatContainer[curChatNum].devPath,
           text:"\n" + "<text style=color:#7a49a5><b>" + sessionStorage.name + "</b></text>" + time + "\n" + $("#input").val()+ "\n"}, null)
    }
    $("#input").val("");
  }
  else if($("#fileStuff").val() != ""){//case for just pic input
    let newPicName = $("#fileStuff").val().split('\\').pop().replace(/%/g, "");
    $.post('/setTextLogText', {num:curChatNum, ip:userIp, publicPath:localChatContainer[curChatNum].publicPath, devPath:localChatContainer[curChatNum].devPath,
                               text:"\n" + "<text style=color:#7a49a5><b>" + sessionStorage.name + "</b></text>" + time + "\n" + 
                               "<img src=" + "'/public/images/" + newPicName + "'" + ">" + "\n" }, null)

    $("#picForm").submit();
    $("#fileStuff").val("");
  } 
  scrollDown = true;   
  //$.get("/getTextLogText", {num:curChatNum, publicPath:localChatContainer[curChatNum].publicPath}, ShowTextLog);
}
function ClearTextLog(data){
	$.post("/clearTextLogText", {num:curChatNum, publicPath:localChatContainer[curChatNum].publicPath}, null);
	ShowTextLogBut();
}
function ChangeChat(num){
  curChatNum = num;
  scrollDown = true; 
  $("#CurChatDisplayName").html(localChatContainer[curChatNum].name);
  localStorage.setItem("curChatnumKey", JSON.stringify(curChatNum));
  FirstTextLog();
  JumpToBottom();
  //document.getElementById("textDisplay").scrollTop = document.getElementById("textDisplay").scrollHeight
}
function CreateChatButtons(data){
  for (var i = 3; i < localChatContainer.length; i++) { // -3
    if(localChatContainer[i] != null){
      var btn = document.createElement('wbutton');
      //btn.type = "button";
      btn.name = i;
      btn.id = JSON.parse(localStorage.getItem("chatContainerKey"))[i].name; 
      btn.innerHTML = JSON.parse(localStorage.getItem("chatContainerKey"))[i].name;
      //btn.class = "ChatButton";
      btn.onclick = function(j) { return function() { ChangeChat(j); }; }(i)
      $('#ButtonContainer').append(btn);
    }
  }
}   
function CreateNewChat(){
  if($("#chatName").val() != ""){
    $.post("/CreateChatFunction", {name:$("#chatName").val(), ChatContainer:localChatContainer}, UpdateLocalChatContainer)

    alert("Chat Added!");

    //window.location.href = '/Chat'
  }
  else if($("#chatName").val() == ""){
    alert("Put in a chat name");
  }
}
function RemoveChat(){
  if($("#removeChatName").val() == ""){
    alert("Put in a chat name");
    return;
  }
  for (var i = 0; i < localChatContainer.length; i++) {
    if(localChatContainer[i] != null){
      if(localChatContainer[i].name == $("#removeChatName").val()){
        localChatContainer[i] = null;
        localStorage.setItem("chatContainerKey", JSON.stringify(localChatContainer));
      }
    }
  }
  alert("Chat Removed!");
  //window.location.href = '/Chat'
}
function UpdateLocalChatContainer(data){
  localChatContainer.push(data.container);
  localStorage.setItem("chatContainerKey", JSON.stringify(localChatContainer));
  console.log(localChatContainer.length);
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
    //localStorage.removeItem("chatContainerKey")[3];
    //console.log(localChatContainer)
  }
  CreateChatButtons(); 
}
window.onload = function NewFunction() {
  let apiKey = 'd9e53816d07345139c58d0ea733e3870';
  $.getJSON('https://api.bigdatacloud.net/data/ip-geolocation-with-confidence?key=' + apiKey, function(data) {
    //console.log(JSON.stringify(data, null, 2));
    userIp = data.ip;
    //console.log(userIp);
    $.post("/CheckBan", {ip:userIp, name:sessionStorage.name}, SendToTheBanPage);
  });

  //var source = new EventSource("demo_sse.php");
  var source = new EventSource("./public/logs/GlobalChat3/DisplayedChat.txt");
  source.onmessage = function(event) {
    console.log(event.data);
    //document.getElementById("result").innerHTML += event.data + "<br>";
  };
} 
function SendToTheBanPage(data){
    if(data.banned)
      window.location.href = "/Banned";
}
$(document).ready(function(){ 
  $.get("/getDirPath", null, Initialize) 
  $("#sendBut").click(InputText);
  $("#clearBut").click(ClearTextLog);
  $("#creatBut").click(CreateNewChat);
  $("#removeBut").click(RemoveChat);
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
function chat(){
  var location = window.location.href.split('/')
  window.location.href = location[0] + 'Chat?name=' + sessionStorage.name
}
function logOut(){
  $.post("/logout", {name: sessionStorage.name}, successLO)
}
function CreateChat(){
  $.get("/CreateChat", {name: sessionStorage.name}, successCC)
}
function successCC(){
  var location = window.location.href.split('/')
  window.location.href = location[0] + 'CreateChat?name=' + sessionStorage.name
}
function successLO(){
  var location = window.location.href.split('/')
  window.location.href = location[0]
}
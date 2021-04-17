

setInterval(ShowTextLogBut, 500);
let curChatNum = 0;

function ShowTextLog(data){
  $("#chatBox").html(data.textLog).text()
  /*
	if(document.getElementById("textDisplay").scrollTop >= document.getElementById("textDisplay").scrollHeight - document.getElementById("textDisplay").scrollHeight*.5)
	document.getElementById("textDisplay").scrollTop = document.getElementById("textDisplay").scrollHeight
  */
}
function ShowTextLogBut(data){
	$.get("/getTextLogText", {num:curChatNum}, ShowTextLog);
}
function InputText(){
  if($("#input").val() == ""  && $("#fileStuff").val() == "")//case for no pic or text
    alert("You need to input somthing to send")
  else if($("#nameInput").val() == "" || $("#nameInput").val() == "Name")//case for no name
    alert("You need to input your name")
  else if($("#input").val() != "" && $("#fileStuff").val() != ""){//case for both text and pic input
    $.post('/setTextLogText', {num:curChatNum, text:"\n" + "<text style=color:#7a49a5><b>" + $("#nameInput").val() + "</b></text>" + "\n" + $("#input").val()+ "\n" + 
                              "<img src=" + "'/public/images/" + $("#fileStuff").val().split('\\').pop() + "'" + ">" + "\n" }, null)
    //$.get("/getTextLogText", {num:curChatNum}, ShowTextLog);
    //$.post("/fileupload", {file:$('#fileStuff')[0].files[0]}, null);
    $("#picForm").submit();
    $("#input").val("");
    $("#fileStuff").val("");
  }
  else if($("#input").val() != ""){//case for just text input
    $.post('/setTextLogText', {num:curChatNum, text:"\n" + "<text style=color:#7a49a5><b>" + $("#nameInput").val() + "</b></text>" + "\n" + $("#input").val()+ "\n"}, null)
    $.get("/getTextLogText", {num:curChatNum}, ShowTextLog);
    $("#input").val("");
  }
  else if($("#fileStuff").val() != ""){//case for just pic input
    $.post('/setTextLogText', {num:curChatNum, text:"\n" + "<text style=color:#7a49a5><b>" + $("#nameInput").val() + "</b></text>" + "\n" + 
                               "<img src=" + "'/public/images/" + $("#fileStuff").val().split('\\').pop() + "'" + ">" + "\n" }, null)
    //$.get("/getTextLogText", {num:curChatNum}, ShowTextLog);
    //$.post("/fileupload", {file:$('#fileStuff')[0].files[0]}, null);
    $("#picForm").submit();
    $("#fileStuff").val("");
  }
}
function ClearTextLog(data){
	$.post("/clearTextLogText", {num:curChatNum}, null);
	ShowTextLogBut();
}
function ChangeChat(num){
  curChatNum = num;
  ShowTextLogBut();
  //document.getElementById("textDisplay").scrollTop = document.getElementById("textDisplay").scrollHeight
}
function CreateChatButtons(data){
  for (var i = 3; i < data.chats.length; i++) { // -3
    var btn = document.createElement('input');
    btn.type = "button";
    btn.name = i;
    btn.id = data.chats[i].name; 
    btn.value = data.chats[i].name;
    //btn.class = "ChatButton";
    btn.onclick = function(j) { return function() { ChangeChat(j); }; }(i)
    $('#container').append(btn);
  }
}
window.onload = function NewFunction() {
	//document.getElementById("textDisplay").scrollTop = document.getElementById("textDisplay").scrollHeight
}
$(document).ready(function(){ 
  $.get("/CreateChatButtons", null, CreateChatButtons);
  $.get("/getTextLogText", {num:curChatNum}, ShowTextLog);    
  $("#sendBut").click(InputText);
  $("#clearBut").click(ClearTextLog);
  $("#nameInput").val(sessionStorage.name)
  $('#input').keydown(function(e){
  if(e.keyCode === 13)
    InputText();
  });
});     
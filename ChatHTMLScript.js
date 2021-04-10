

setInterval(ShowTextLogBut, 500);
let curChatNum = 0;

function ShowTextLog(data){
	$("#textDisplay").val(data.textLog);
  //$("#TestBox").text(data.textLog);
  $("#TestBox").html(data.textLog).text()
	if(document.getElementById("textDisplay").scrollTop >= document.getElementById("textDisplay").scrollHeight - document.getElementById("textDisplay").scrollHeight*.5)
	document.getElementById("textDisplay").scrollTop = document.getElementById("textDisplay").scrollHeight
}
function ShowTextLogBut(data){
	$.get("/getTextLogText", {num:curChatNum}, ShowTextLog);
}
function InputText(){
  console.log($("#fileStuff").val())
	if($("#input").val() != "" && $("#nameInput").val() != "" && $("#nameInput").val() != "Name"){
    $.post('/setTextLogText', {text:"\n" + $("#nameInput").val() + "\n" + $("#input").val()+ "\n" + 
                              "<img src=" + $("#fileStuff").val() + ">" + "\n" }, null)
    $.get("/getTextLogText", null, ShowTextLog);
  }
  else if($("#input").val() == "")
    alert("You need to input somthing to send")
  else if($("#nameInput").val() == "" || $("#nameInput").val() == "Name")
    alert("You need to input your name")
}
function ClearTextLog(data){
	$.post("/clearTextLogText", null, null);
	ShowTextLogBut();
}
function ChangeChat(num){
  curChatNum = num;
  ShowTextLogBut();
  document.getElementById("textDisplay").scrollTop = document.getElementById("textDisplay").scrollHeight
}
function CreateChatButtons(data){
  for (var i = 3; i < data.chats.length; i++) { // -3
    var btn = document.createElement('input');
    btn.type = "button";
    btn.name = i;
    btn.id = data.chats[i].name; 
    btn.value = data.chats[i].name;
    btn.onclick = function(j) { return function() { ChangeChat(j); }; }(i)
    $('#container').append(btn);
  }
}
window.onload = function NewFunction() {
	document.getElementById("textDisplay").scrollTop = document.getElementById("textDisplay").scrollHeight
}
$(document).ready(function(){ 
  $.get("/CreateChatButtons", null, CreateChatButtons);
  $.get("/getTextLogText", {num:curChatNum}, ShowTextLog);
  $("#sendBut").click(InputText);
  $("#clearBut").click(ClearTextLog);
  $('#input').keydown(function(e){
  if(e.keyCode === 13)
  	InputText();
 });
});     
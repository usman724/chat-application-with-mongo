

let currentUser="";

function ReteriveMessageData() {
  $.ajax({
    url: '/chats',
    method: 'GET',
    success:result =>{
      let msgHist = '';
      let msgs = JSON.parse(result);
      msgHist = `<li class="nojoin" ><h2>No One Join Yet</h2></li>`;
      let MyFirstMessage = true;
      for (i in msgs) {
        let msg = msgs[i];  
        if (MyFirstMessage) {
          msgHist = ``;
          MyFirstMessage= false;
        }
      
        msgHist +=msg.alias===currentUser?`<li class="ownlist"> ${msg.message}:<b class="username">${msg.alias}</b><br></li>`:`<li class="list"><b class="username">${msg.alias}</b>: ${msg.message}<br></li>`;
      }
      $('#msglist').html(msgHist);
  }  
})
}



function send() {

  $.ajax({
    url: '/chats/post',
    data: { 
      alias: $('#input_alias').val(),
      msg: $('#input_msg').val() },
    method: 'POST'
  });

  currentUser = $('#input_alias').val();

  // Clear the Input Field After send data
  // Name remain same after sending the message
  //$('#input_alias').val("");
  $('#input_alias').prop('readonly', true);

   $('#input_msg').val(""); 

}


function clearChat() {
  $.ajax({
    url: '/clear',
    method: 'GET'
  });
}

setInterval(() => ReteriveMessageData(), 1000);

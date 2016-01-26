// YOUR CODE HERE:
var rooms = {};
var friendsList=[];
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',

  init: function() {

  },

  send: function(message) {
    
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent. Data: ', data);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message. Error: ', data);
      }
    });
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {"order": "-createdAt"},
      contentType: 'application/json',
      success: function (data){
        app.addMessages(data);
        console.log('chatterbox: Messages received. Data: ', data); 
      },
      error: function (data) {
        console.error('chatterbox: Failed to receive message. Error: ', data);
      }
    });
  },

  clearMessages: function() {
    $(".chat").remove();
    
  },

  addMessages: function(data) {
    for(var i = 0; i < data.results.length; i++) {
      var user = $('<span class="username"></span>');
      user.text(data.results[i].username || 'anonymous');
      var msg = $('<span></span>');
      msg.text(data.results[i].text || '');
      var line = $('<div class="chat"></div>');
      line.append(user);
      line.append(': ');
      line.append(msg);
      $('#chats').append(line);
    }
  },

  addRooms: function() {
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      data: {"order": "-createdAt"},
      contentType: 'application/json',
      success: function (data){
        for(var i = 0; i < data.results.length; i++) {
          if (!rooms[data.results[i].roomname]) {
            rooms[data.results[i].roomname] = data.results[i].roomname;
          }
        }
        for (var key in rooms) {
          $("#roomSelect").append($("<option></option>").val(key).html(key));
        }        
        console.log('chatterbox: Messages received. Data: ', data); 
      },
      error: function (data) {
        console.error('chatterbox: Failed to receive message. Error: ', data);
      }
    });
  },

  addRoom: function() {

  },

  selectRoom: function(name){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      data: {"order": "-createdAt"},
      contentType: 'application/json',
      success: function (data){
        var roomMessages={
          results: []
        };
        var selected = name || $('#roomSelect option:selected').val();
        for(var i=0;i<data.results.length;i++){
          if(data.results[i].roomname===selected){
            roomMessages.results.push(data.results[i])
          }
        }
        app.clearMessages();
        app.addMessages(roomMessages);

        console.log('chatterbox: Messages received. Data: ', data); 
      },
      error: function (data) {
        console.error('chatterbox: Failed to receive message. Error: ', data);
      }
    });
  }

};


$(document).ready(function() {
  var name = prompt('User?: ');
  $("#submit").click(function() {
    var value = $("#send").val();
    var message = {
     username: name,
     text: value,
     roomname: $('#roomSelect option:selected').val()
    }    
    app.send(message);
    app.clearMessages();
    app.selectRoom();
  });
  $("#clear").click(function() {
    app.clearMessages();
  })
  $("#refresh").click(function() {
    app.selectRoom();
  })
  $("#roomSelect").change(function() {
    app.selectRoom();
  })
  $("#newRoom").click(function() {
    var newRoom = prompt("Room Name: ");
    $("#roomSelect").append($("<option></option>").val(newRoom).html(newRoom));
  })
  console.log(friendsList);
  app.fetch();
  app.addRooms();
});
// YOUR CODE HERE:
//<button class="submit" type="button">Submit</button>
var username = prompt("User: ");
var rooms = {};
var friendsList = [];
var app;
$(document).ready(function() {
  app = {
    server: 'https://api.parse.com/1/classes/chatterbox',
    room: 'lobby',
    username: 'anonymous',

    init: function() {
      app.updateRooms();
      app.fetch();
      $("#roomSelect").val("lobby");
      setInterval(app.fetch, 5000);
    },

    send: function(message) {
      app.startSpinner();
      $.ajax({
        url: app.server,
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          app.fetch();
          console.log('chatterbox: Message sent. Data: ', data);
          app.stopSpinner(); 
        },
        error: function (data) {
          console.error('chatterbox: Failed to send message. Error: ', data);
        }
      });
    },

    fetch: function() {
      app.startSpinner();
      $.ajax({
        url: app.server,
        type: 'GET',
        data: {"order": "-createdAt"},
        contentType: 'application/json',
        success: function (data){
          app.selectRoom(data);
          app.stopSpinner(); 
          console.log('chatterbox: Messages received. Data: ', data);
        },
        error: function (data) {
          console.error('chatterbox: Failed to receive message. Error: ', data);
        }
      });
    },

    //CLEAR MESSAGES FROM CHATS
    clearMessages: function() {
      $("#chats").empty();
      
    },

    //
    populate: function(data) {
      for(var i = 0; i < data.results.length; i++) {
        var user = $('<span class="username"></span>');
        user.text(data.results[i].username || 'anonymous');
        var msg= $('<span></span>');
        for(var j=0;j<friendsList.length;j++){
          if(data.results[i].username===friendsList[j]){
            var msg= $('<span class="friend"></span>');
            break;
          }
        }   
        msg.text(data.results[i].text || '');
        var line = $('<div class="chat"></div>');
        line.append(user);
        line.append(': ');
        line.append(msg);
        $('#chats').append(line);
      }
    },

    addMessage: function(message) {
      var user = $('<span class="username"></span>');
      user.text(message.username || 'anonymous');
      var msg = $('<span></span>');
      msg.text(message.text || '');
      var line = $('<div class="chat"></div>');
      line.append(user);
      line.append(': ');
      line.append(msg);
      $("#chats").append(line)
    },

    handleSubmit: function() {
      var value = $("#send").val();
      var message = {
       username: username,
       text: value,
       roomname: $('#roomSelect option:selected').val()
      };
      app.send(message);
      app.clearMessages();
      app.addMessage(message);
      $("#send").val("");
    },

    updateRooms: function() {
      app.startSpinner();
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
          app.stopSpinner();  
        },
        error: function (data) {
          console.error('chatterbox: Failed to receive message. Error: ', data);
        }
      });
    },

    addRoom: function(room) {
      $("#roomSelect").append($("<option></option>").val(room).html(room));
    },

    addFriend: function(friend) {
      if (friendsList.indexOf(friend) === -1) {
        friendsList.push(friend);
      }
    },

    selectRoom: function(data) {
      var roomMessages = {
        results: []
      };
      var selected = $('#roomSelect option:selected').val() || 'lobby';
      for(var i=0;i<data.results.length;i++){
        if(data.results[i].roomname===selected){
          roomMessages.results.push(data.results[i])
        }
      }
      app.clearMessages();
      app.populate(roomMessages);
    },

    startSpinner: function() {
      $('.spinner img').show();
    },

    stopSpinner: function() {
      $('.spinner img').hide();
    }

  };

  $(".submit").click(function(event) {
    event.preventDefault();
    app.handleSubmit();
  });
  $("#clear").click(function() {
    app.clearMessages();
  })
  $("#refresh").click(function() {
    app.fetch();
  })
  $("#roomSelect").change(function() {
    app.fetch();
  })
  $("#newRoom").click(function() {
    var newRoom = prompt("Room Name: ");
    app.addRoom(newRoom);
  })
  $(document).on('click', '.username', function() {
    var newFriend = $(this).text();
    app.addFriend(newFriend);
  })
  app.init();
});
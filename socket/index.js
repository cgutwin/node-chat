/**
 * Created on 3/26/2018
 * Chris Gutwin
 * https://cgutwin.ca/
 *
 * Katrhina Hernandez
 * https://katrhina.com/
 */
const SERVER = require("http").Server();
const PORT = 10001 || process.env.PORT; //Port 10001 || whatever is available.
const IO = require("socket.io")(SERVER);

/*
* three arrays for the storage
* inner arrays format as follows:
*
* roomList:
* [
*   ROOMX: [
*     ROOMNAME //maybe pointless
*   ]
*   ...
* ]
*
* userList:
* [
*   ROOMX: [
*     'user1'
*     'user2'
*   ]
*   ...
* ]
*
* messageList:
* [
*   ROOMX: [
*     'a'
*     'b'
*   ]
*   ...
* ]
* */
let roomList = [];
let userList = [];
let messageList = [];

IO.on("connection", (socket)=>{
  console.log("User connected to socket.");
  
  socket.on("joinNewUser", (data)=>{
    let roomName = data.room;
    let username = data.user;
    
    /*
    * checks if userList and roomList already have the user/room in the arrays
    * */
    if (userList[roomName]) {
      userList[roomName].push(username);
    }
    else {
      userList[roomName] = [];
      userList[roomName].push(username);
    }
    
    if (roomList.indexOf(roomName) > -1) {
      roomList[roomName].push(roomName);
    }
    else {
      roomList[roomName] = [];
      roomList[roomName].push(roomName);
    }
    console.log(`Room list: ${roomList}`);
    console.log(`User list: ${userList}`);
    
    socket.join(roomName);
    socket.room = roomName;
    console.log(`These users are in the corresponding rooms: ${userList[roomName]}`);
    /*
    * sends back current room information, this happens on join
    * */
    IO.to(socket.room).emit("usernameList", userList[roomName]);
    if (messageList[roomName]) {
      IO.to(socket.room).emit("messageList", messageList[roomName]);
    }
  });
    
  socket.on("messagePkg", (data)=>{
    console.log(`Received message formatted as follows: ${data}`);
    /*
    * checks if room exists in messageList, creates if not
    * */
    if (messageList[data.roomName]) {
      messageList[data.roomName].push(data.message);
    }
    else {
      messageList[data.roomName] = [];
      messageList[data.roomName].push(data.message);
    }
    IO.to(socket.room).emit("messageList", messageList[data.roomName]);
  });
  
  socket.on("disconnect", ()=>{
    console.log("User disconnected from socket.");
  });
});

SERVER.listen(PORT, (err)=>{
  if (err) {
    console.log("Error opening socket: " + err);
    return false; //break, exit
  }
  else {
    console.log("Socket open on port " + PORT);
  }
});
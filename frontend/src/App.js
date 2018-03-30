/**
 * Created on 3/26/2018
 * Chris Gutwin
 * https://cgutwin.ca/
 *
 * Katrhina Hernandez
 * https://katrhina.com/
 */
import React, {Component} from "react";
import "./App.css";
import socketio from "socket.io-client";
import Rooms from "./Comp/Rooms";

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: null,
      message: null,
      userList: [],
      messageList: [],
      isLoggedIn: false,
      room: null,
      showUsernamePrompt: false
    };
    
    this.joinChat = this.joinChat.bind(this);
    this.onInputChangeHandler = this.onInputChangeHandler.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onRoomChangeHandler = this.onRoomChangeHandler.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }
  
  componentDidMount() {
    try {
      this.socket = socketio("http://localhost:10001");
    } catch (e) {
      console.log(`Error: Unable to connect to server. More: ${e}`)
    }
  }
  
  componentDidUpdate() {
    // Receives information back from socket, sets as data
    this.socket.on("usernameList", (data) => {
      this.setState({
        userList: data
      });
    });
    this.socket.on("messageList", (data) => {
      console.log(data);
      this.setState({
        messageList: data
      });
      this.scrollToBottom(); //keep main chat div scrolled to bottom by default
    });
  }
  
  // Emits the current user and requested room to the socket.
  joinChat() {
    let user = {
      user: this.state.username,
      room: this.state.room
    };
    if (this.state.username && this.state.room) {
      try {
        this.socket.emit("joinNewUser", user);
        this.setState({
          isLoggedIn: true // Joined chat.
        });
      } catch (e) {
        console.log(`Error: Unable to join the channel. More: ${e}`);
      }
    }
  }
  
  /**
   * Keeps div at bottom for most recent chats.
   * https://stackoverflow.com/a/42417252 but using refs instead of findDOMNode.
   * findDOMNode ass shown in https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react#comment82286688_45905418.
   */
  scrollToBottom() {
    this.refs.chatdisp.scrollTop = this.refs.chatdisp.scrollHeight;
  }
  
  // TODO: I think this is causing the message sending to be slow, eventually lagging out the tab. Test and maybe revert back to a general message handler
  // Sets the specified state (input) to the value of the text input.
  onInputChangeHandler(input, evt) {
    this.setState({
      [input]: evt.target.value
    });
  }
  
  // Packages and sends message and what room it goes with.
  sendMessage() {
    let messagePkg = {
      message: `${this.state.username}: ${this.state.message}`,
      roomName: this.state.room
    };
    if (this.state.message) {
      try {
        this.socket.emit("messagePkg", messagePkg);
      } catch (e) {
        console.log(`Error: Couldn't submit message. More: ${e}`);
      }
    }
    else {
      return false;
    }
  }
  
  // Sets temp room info.
  onRoomChangeHandler(roomName) {
    if (roomName) {
      this.setState({
        room: roomName.toUpperCase(),
        showUsernamePrompt: true
      });
    }
  }
  
  render() {
    
    let renderDisplay = null;
    let renderMessageInput = null;
    let renderSendButton = null;
    let renderComp = null;
    
    // if not logged in, prompts for a username.
    if (!this.state.isLoggedIn) {
      renderDisplay = (
        <div>
          <input onChange={this.onInputChangeHandler.bind(this, "username")}
                 type="text"
                 placeholder="Enter Username"
                 id="sign-in"
          />
          <button onClick={this.joinChat} id="button-join">Join Chat</button>
        </div>
      );
    }
    // if logged in, parses messages with respect to the chat room you're in, displays all relevant inputs and messages.
    else {
      let messageList = this.state.messageList.map((obj, i) => {
        return (
          <p className="message" key={i}>
            <span className="fontweight400">{obj}</span>
          </p>
        )
      });
      // renderMessageInput and renderSend button split elements to make use of CSS grid styling.
      renderMessageInput = (
        <div id="controls">
          <input onChange={this.onInputChangeHandler.bind(this, "message")}
                 type="text"
                 placeholder="Type a message here"
                 id="message-input"
          />
        </div>
      );
      renderSendButton = (
        <button onClick={this.sendMessage}
                id="button-send"
        >
          <img id="icon-send" src={require('./Assets/send.svg')}/>
        </button>
      );
      // shows all the messages
      renderDisplay = (
        <div>
          <div ref="chatdisp" id="chat-display">{messageList}</div>
        </div>
      );
    }
    // Create the username list, always shown
    let usernameList = this.state.userList.map((obj, i) => {
      return (
        <div className="user" key={i}>
          {obj}
        </div>
      )
    });
    
    if (this.state.showUsernamePrompt === false) {
      // show available rooms
      renderComp = <Rooms onRoomChangeHandler={this.onRoomChangeHandler}/>;
    }
    else {
      // now show whole process
      renderComp = (
        <div className="main">
          <div id="user-display">
            <div>
              <h2 id="connected-users">CONNECTED USERS IN {this.state.room}</h2>
              <div id="user-list">
                {/*blank until join the room*/}
                {usernameList}
              </div>
            </div>
          </div>
          <div id="message-area">
            {renderDisplay}
          </div>
          {renderMessageInput} {renderSendButton}
        </div>
      )
    }
    return (
      //now show it
      <div>
        {renderComp}
      </div>
    );
  }
}

export default App;
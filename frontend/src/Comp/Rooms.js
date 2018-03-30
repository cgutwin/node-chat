/**
 * Created on 3/26/2018
 * Chris Gutwin
 * https://cgutwin.ca/
 *
 * Katrhina Hernandez
 * https://katrhina.com/
 */
import React, {Component} from "react";
import "./Room.css";

class Rooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newRoomId: null,
      roomList: null
    };
    this.onInputChangeHandler = this.onInputChangeHandler.bind(this);
  }
  
  // sets the specified state (input) to the value of the text input
  onInputChangeHandler(input, evt) {
    this.setState({
      [input]: evt.target.value
    });
  }
  
  render() {
    return (
      <div className="r_main">
        <div className="r_controls">
          <div className="r_roomButtons">
            <button onClick={this.props.onRoomChangeHandler.bind(this, "Room1")}><p>1</p>Room 1</button>
            <button onClick={this.props.onRoomChangeHandler.bind(this, "Room2")}><p>2</p>Room 2</button>
            <button onClick={this.props.onRoomChangeHandler.bind(this, "Room3")}><p>3</p>Room 3</button>
            <button onClick={this.props.onRoomChangeHandler.bind(this, "Room4")}><p>4</p>Room 4</button>
          </div>
          <p id="divider">or</p>
          <div className="r_newRooms">
            <input onChange={this.onInputChangeHandler}
                   type="text"
                   placeholder="Type a room name"
            />
            <br/>
            <button onClick={this.props.onRoomChangeHandler.bind(this, this.state.newRoomId)}>Add Room</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Rooms;
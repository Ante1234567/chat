import {Component} from "react";
import './App.css';
import Messages from "./Messages";
import Input from "./Input"

function randomName() {
  const user = "user_";
  const nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly", "feather", "grass", "haze", "mountain", "night", "pond", "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder", "violet", "water", "wildflower", "wave", "water", "resonance"];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return user + noun;
}

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
      color: randomColor()
    }
  }

  constructor() {
    super();
    this.drone = new window.Scaledrone("PqYfsQwr63B5Wwrh", {
      data: this.state.member
    });
    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }

  render() {
    return (
  <div class="float-parent-element">
    <div class="float-message-element">
      <div class="message-block">
      <div class="chat-header">
        <h1>CHAT</h1>
        <p>With Friends</p>
        <Input
        onSendMessage={this.onSendMessage}
      />
      </div>
      </div>
    </div>
    <div class="float-chat-element">
      <div class="chat-block">
      <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
      </div>
    </div>
  </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  }

}

export default App;
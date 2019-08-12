/**
 * Sample React Native App
 *
 * adapted from App.js generated by the following command:
 *
 * react-native init example
 *
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import { Alert, Platform, StyleSheet, Text, View, Button, TextInput } from 'react-native';
import TwilioVoiceModule from 'react-native-twilio-voice-module';

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      status: 'DISCONNECTED',
      message: '--',
      userName: 'Alice',
      connectBtnTitle: 'Connect',
      speakerBtnTitle: 'Turn on speaker',
      muteBtnTitle: 'Mute',
      speakerOn: false,
      mute: false
    }
  }

  componentDidMount() {
    TwilioVoiceModule.addEventListener('deviceRegistered', this._deviceRegistered);
    TwilioVoiceModule.addEventListener('deviceNotRegistered', this._deviceNotRegistered);
    TwilioVoiceModule.addEventListener('connectionDidConnect', this._connectionDidConnect);
    TwilioVoiceModule.addEventListener('connectionDidFailed', this._connectionDidFailed);
    TwilioVoiceModule.addEventListener('connectionDidRinging', this._connectionDidRinging);
    TwilioVoiceModule.addEventListener('connectionDidReconnecting', this._connectionDidReconnecting);
    TwilioVoiceModule.addEventListener('connectionDidReconnect', this._connectionDidReconnect);
    TwilioVoiceModule.addEventListener('connectionDidDisconnect', this._connectionDidDisconnect);
    TwilioVoiceModule.addEventListener('callIncoming', this._callIncoming);
    TwilioVoiceModule.addEventListener('callIncomingCancelled', this._callIncomingCancelled);
    TwilioVoiceModule.getVersion((version) => {
      console.log('Twilio sdk version', version);
    });
    this._initTwilio();
  }

  componentWillUnmount() {
    TwilioVoiceModule.removeEventListener('deviceRegistered', this._deviceRegistered);
    TwilioVoiceModule.removeEventListener('deviceNotRegistered', this._deviceNotRegistered);
    TwilioVoiceModule.removeEventListener('connectionDidConnect', this._connectionDidConnect);
    TwilioVoiceModule.removeEventListener('connectionDidFailed', this._connectionDidFailed);
    TwilioVoiceModule.removeEventListener('connectionDidRinging', this._connectionDidRinging);
    TwilioVoiceModule.removeEventListener('connectionDidReconnecting', this._connectionDidReconnecting);
    TwilioVoiceModule.removeEventListener('connectionDidReconnect', this._connectionDidReconnect);
    TwilioVoiceModule.removeEventListener('connectionDidDisconnect', this._connectionDidDisconnect);
    TwilioVoiceModule.removeEventListener('callIncoming', this._callIncoming);
    TwilioVoiceModule.removeEventListener('callIncomingCancelled', this._callIncomingCancelled);
  }

  _deviceRegistered = () => {
    console.log('device registered');
  }

  _deviceNotRegistered = (data) => {
    console.log('device not registered', data);
  }

  _connectionDidConnect = async (data) => {
    console.log(data);
    this.setState({ status: data.call_state, connectBtnTitle: 'Disconnect' });
    const activeCall = await TwilioVoiceModule.getActiveCall();
    console.log('Active call', activeCall);
  }

  _connectionDidFailed = (data) => {
    console.log(data);
  }

  _connectionDidRinging = (data) => {
    console.log(data);
  }

  _connectionDidReconnecting = (data) => {
    console.log(data);
  }

  _connectionDidDisconnect = (data) => {
    console.log(data);
    this.setState({ status: data.call_state, connectBtnTitle: 'Connect' });
  }

  _toggleConnect = async () => {
    if (this.state.status == 'DISCONNECTED') {
      if (this.state.userName) {

        TwilioVoiceModule.connect({
          To: '+123456789',
          From: '+987654321',
        });

      } else {
        Alert.alert('Alert', 'Input user name');
      }
    } else if (this.state.status == 'CONNECTED') {
      TwilioVoiceModule.disconnect();
    }
  }

  _callIncoming = (data) => {
    console.log('Call incoming', data);
    Alert.alert(
      'Incomnig call',
      `${data.call_from} is calling you`,
      [
        {
          text: 'Accept', onPress: () => TwilioVoiceModule.accept()
        },
        {
          text: 'Reject', onPress: () => TwilioVoiceModule.reject()
        }
      ]
    );
  }

  _callIncomingCancelled = () => {
    console.log('Call incoming cancelled');
  }

  _initTwilio = async () => {
    const fetchTokenApi =
      await fetch(`http://stepintocity-server.herokuapp.com/twilio/testAccessToken?identity=${this.state.userName}&platform=${Platform.OS}`)
    const fetchTokenJson = await fetchTokenApi.json()
    TwilioVoiceModule.initWithToken(fetchTokenJson.data).then(res => {
      console.log(res);
    });
  }

  _toggleSpeaker = () => {
    const speakerBtnTitle = this.state.speakerOn ? 'Turn on speaker' : 'Turn off speaker';
    this.setState({ speakerOn: !this.state.speakerOn, speakerBtnTitle }, () => {
      TwilioVoiceModule.setSpeakerPhone(this.state.speakerOn);
    });
  }

  _toggleMute = () => {
    const muteBtnTitle = this.state.mute ? 'Mute' : 'Unmute';
    this.setState({ mute: !this.state.mute, muteBtnTitle }, () => {
      TwilioVoiceModule.setMuted(this.state.mute);
    });
  }

  render() {
    const { userName, connectBtnTitle, speakerBtnTitle, muteBtnTitle } = this.state;
    return (
      <View style={styles.container}>

        <Text style={styles.welcome}>☆TwilioVoiceModule example☆</Text>

        <TextInput
          style={styles.inputField}
          editable={true}
          value={userName}
          onChangeText={(text) => this.setState({ userName: text })}
          placeholder='Input user name'
          keyboardType='default'
          maxLength={20} />

        <Text style={styles.instructions}>STATUS: {this.state.status}</Text>

        <TextInput
          style={styles.inputField}
          editable={true}
          placeholder='Input client name'
          keyboardType='default'
          maxLength={13} />

        <View style={styles.buttonsWrapper}>
          <Button title={connectBtnTitle} onPress={this._toggleConnect} />
          <Button title={speakerBtnTitle} onPress={this._toggleSpeaker} />
          <Button title={muteBtnTitle} onPress={this._toggleMute} />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginTop: 16,
    marginBottom: 5,
  },
  inputField: {
    height: 40,
    textAlign: 'center',
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    color: 'black'
  },
  buttonsWrapper: {

  }
});

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  Alert,
  ActivityIndicator,
  Image
} from "react-native";
import t from "tcomb-form-native"; // 0.6.9
// import firebase from '../components/Firebase'
import firebase from "firebase";
if (!firebase.apps.length) {
  //avoid re-initializing
  firebase.initializeApp({
    apiKey: "AIzaSyBw0oPudvm00kF_OWmCQLp81qo03WY8DoE",
    authDomain: "rock-elevator-259718.firebaseapp.com",
    databaseURL: "https://rock-elevator-259718.firebaseio.com",
    projectId: "rock-elevator-259718",
    storageBucket: "rock-elevator-259718.appspot.com",
    messagingSenderId: "109151963963",
    appId: "1:109151963963:web:8cc0af19b327cc8af2451e",
    measurementId: "G-D51BQWGP37"
  });
}
export default class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submit: false
    };
  }
  handleSubmit = async () => {
    // this.setState({submit: true});
    const value = this._form.getValue();
    firebase
      .database()
      .ref("contact/")
      .push(value)
      .then(res => {
        Alert.alert("thank for reaching me");
      })
      .catch(err => {
        console.error(err);
      });
  };
  render() {
    const Form = t.form.Form;
    const options = {
      fields: {
        message: {
          multiline: true,
          stylesheet: {
            ...Form.stylesheet,
            textbox: {
              ...Form.stylesheet.textbox,
              normal: {
                ...Form.stylesheet.textbox.normal,
                height: 150
              },
              error: {
                ...Form.stylesheet.textbox.error,
                height: 150
              }
            }
          }
        }
      }
    };
    const ContactForm = t.struct({
      email: t.String,
      name: t.String,
      message: t.String
    });
    return (
      <View style={styles.container}>
        <Form
          type={ContactForm}
          ref={c => (this._form = c)}
          options={options}
        />
        <TouchableHighlight
          ref="form"
          style={styles.button}
          onPress={this.handleSubmit}
          underlayColor="#99d9f4"
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginTop: 50,
    padding: 20,
    backgroundColor: "#ffffff"
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    alignSelf: "center"
  },
  button: {
    height: 36,
    backgroundColor: "#48BBEC",
    borderColor: "#48BBEC",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "stretch",
    justifyContent: "center"
  }
});

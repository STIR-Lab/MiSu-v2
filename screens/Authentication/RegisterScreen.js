import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Auth } from "aws-amplify";
import appStyle from "../../styles/AppStyle";
import authStyle from "../../styles/AuthStyle";
import ConfirmCodePopup from "../../components/popup/ConfirmCodePopup";
import { Icon } from "react-native-elements";
import { changeRole } from "../../services/creationService";

function RegisterScreen(props) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [authCode, setAuthcode] = useState("");
  const [signedUp, setSignedup] = useState(false);
  const [confirmingCode, setConfirmCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [accessLevel, setAccess] = useState("");

  const handleSignUp = async () => {
    setErrorMessage("");
    setIsLoading(true);

    const passwordRegex = new RegExp(
      "^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$",
      "g"
    );
    if (name === "") setErrorMessage("Missing name");
    else if (username === "") setErrorMessage("Missing email address");
    else if (password === "") setErrorMessage("Missing password");
    else if (passwordConfirm == "" || password != passwordConfirm)
      setErrorMessage("Re-check confirm password field");
    else if (passwordRegex.test(password) == false)
      setErrorMessage(
        "Password Must contain 8 characters, a number, a symbol, an upper case letter, and a lower case letter"
      );
    else {
      console.log("Attempting sign-up");
      console.log(name, username, password, passwordConfirm);
      const response = await Auth.signUp({
        username,
        password,
        attributes: {
          name,
          email: username,
          phone_number: "+11111111111",
          address: "null",
          "custom:user_type": accessLevel === "Owner" ? "1" : "0",
          // phone_number: '+1' + phone.replace(/\D/g, ''),
          // 'custom:city': city,
          // 'custom:state': state,
        },
      })
        .then((response) => {
          //setState(error: null)
          setErrorMessage(null);
          setUserId(response.userSub);
          setSignedup(true);
          setMessage("A confirmation code was sent to your email! ");
          setErrorMessage("");
          setConfirmCode(true);
          console.log("Successful signup!");
          console.log(response.userSub);
        })
        .catch((error) => {
          setErrorMessage(error.message);
          console.log("==ERROR DURING SIGNUP PROCESS==", error.message);
        });
    }

    setIsLoading(false);
  };

  // Verify sign up code
  const confirmSignUp = async (username, authCode) => {
    setErrorMessage("");
    setMessage("");
    setConfirmCode(false);

    // Form validation
    if (username == "") {
      setMessage("Please enter the email you're verifying");
      setErrorMessage("");
    } else if (authCode == "") {
      setMessage("Please enter the code sent to your email");
      setErrorMessage("");
    } else {
      setIsLoading(true);
      const user = await Auth.confirmSignUp(username, authCode)
        .then(async (user) => {
          console.log("confirmed sign up successful!");
          setErrorMessage("");
          setMessage("Confirm successful, please sign in.");
          props.navigation.navigate("Login", {
            username: username,
            password: password,
          });
          setIsLoading(false);
        })
        .catch((err) => {
          setErrorMessage(err.message);
          setMessage("");
          setIsLoading(false);
        });
    }
  };

  // The loading element will restrict input during networked operations
  let loadingElement = null;
  if (isLoading) {
    loadingElement = (
      <View style={[appStyle.loadingHolder]}>
        <ActivityIndicator size="large" style={[appStyle.loadingElement]} />
      </View>
    );
  }

  // The error element will be set if there is actually an error
  let errorElement = null;
  if (errorMessage) {
    errorElement = (
      <View style={authStyle.errorMessage}>
        {errorMessage && (
          <Text style={authStyle.errorMessage}>{errorMessage}</Text>
        )}
      </View>
    );
  }
  // The message element will be set if there is actually an error
  let messageElement = null;
  if (message) {
    messageElement = (
      <View style={authStyle.message}>
        {message && <Text style={authStyle.message}>{message}</Text>}
      </View>
    );
  }

  // The confirm code popup will appear if there is actually an error
  let confirmPopupElement = null;
  if (confirmingCode) {
    confirmPopupElement = (
      <ConfirmCodePopup
        onCancel={() => setConfirmCode(false)}
        onSubmit={confirmSignUp}
        username={username}
      />
    );
  }

  // checks the password complexity as it is being filled
  let passwordErrorElement = null;
  if (password) {
    // regex for all five complexity requirements
    let passwordPolicy = [
      RegExp(".{8,}$", "g"),
      RegExp("[A-Z]", "g"),
      RegExp("[a-z]", "g"),
      RegExp("[0-9]", "g"),
      RegExp("\\W", "g"),
    ];
    // matching error messages
    let passwordPolicyMessages = [
      " Password must contain atleast 1 upper case character",
      " Password must contain atleast 1 lower case character",
      " Password must contain atleast 8 characters",
      " Password must contain atleast 1 number",
      " Password contain atleast 1 symbol",
    ];
    // empty string to hold the error messages put to the screen
    var passwordPolicyErrorString = "";

    for (var i = 0; i < passwordPolicy.length; i++) {
      if (!passwordPolicy[i].test(password)) {
        passwordPolicyErrorString += passwordPolicyMessages[i] + "\n";
      }
    }

    //console.log(passwordPolicyMessages);
    if (passwordPolicyErrorString != "")
      passwordErrorElement = (
        <Text
          style={{
            color: "red",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          {passwordPolicyErrorString}
        </Text>
      );
  }

  const guestOwner = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          marginLeft: 70,
          marginRight: 70,
        }}
      >
        <TouchableOpacity onPress={() => setAccess("Guest")}>
          <View
            style={{
              flexDirection: "column",
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: "#5BD3FF",
              borderRadius: 10,
              elevation: 3,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.8,
              shadowRadius: 20.41,
              borderColor: "#3E3E3E",
              borderWidth: accessLevel == "Guest" ? 1 : 0,
            }}
          >
            <Icon name="user" size={35} type="feather" color="white" />
            <Text style={{ color: "white" }}>Guest</Text>
          </View>
        </TouchableOpacity>

        <Text
          style={{ alignSelf: "center", color: "#3E3E3E", fontWeight: "bold" }}
        >
          OR
        </Text>

        <TouchableOpacity onPress={() => setAccess("Owner")}>
          <View
            style={{
              flexDirection: "column",
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: "white",
              borderRadius: 10,
              elevation: 3,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.8,
              shadowRadius: 20.41,
              borderColor: "#3E3E3E",
              borderWidth: accessLevel == "Owner" ? 1 : 0,
            }}
          >
            <Icon name="home" type="font-awesom" size={35} color="#3E3E3E" />
            <Text style={{ color: "#3E3E3E" }}>Owner</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      enabled={true}
      behavior="height"
      style={authStyle.container}
    >
      <ScrollView
        style={(authStyle.container, { marginTop: 20 })}
        bounces={false}
      >
        {/* Render the loading element */}
        {loadingElement}

        {/* Render the Confirm Popup */}
        {confirmPopupElement}

        {/* Render the app icon */}
        <View style={authStyle.iconHolder}>
          <Image
            style={authStyle.icon}
            source={require("../../assets/MISUv2.png")}
          />
        </View>

        {/* Render the greeting */}
        <Text style={authStyle.greeting}>
          {`Create your`}
          <Text style={authStyle.appName}> {"MiSu"} </Text>
          account
        </Text>

        {/* Render the register form */}
        <View style={authStyle.authForm}>
          <TextInput
            onChangeText={(name) => setName(name)}
            style={authStyle.authFormInput}
            autoCapitalize="words"
            value={name}
            placeholder={"Name"}
          />
          <TextInput
            onChangeText={(text) => setUsername(text)}
            style={authStyle.authFormInput}
            autoCapitalize="none"
            value={username}
            placeholder={"Email Address"}
          />
          <TextInput
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            style={authStyle.authFormInput}
            autoCapitalize="none"
            value={password}
            placeholder={"Password"}
          />
          <TextInput
            onChangeText={(passwordConfirm) =>
              setPasswordConfirm(passwordConfirm)
            }
            secureTextEntry
            style={authStyle.authFormInput}
            autoCapitalize="none"
            value={passwordConfirm}
            placeholder={"Re-Type Password"}
          />

          <View style={authStyle.passwordError}>{passwordErrorElement}</View>
        </View>

        {guestOwner()}

        {/* Render the submit button  */}
        <View style={authStyle.authFormButtonHolder}>
          <TouchableOpacity
            style={authStyle.authFormButton}
            onPress={handleSignUp}
          >
            <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 25 }}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Render the error message */}
        {errorElement}

        {/* Render the message */}
        {messageElement}

        {/* Render the confirm code toggle */}
        <View>
          <TouchableOpacity
            style={{ alignSelf: "center", marginTop: 16 }}
            onPress={() => {
              setConfirmCode(true);
            }}
          >
            <Text style={{ color: "#414959", fontSize: 13 }} Password>
              Have a confirmation code?{" "}
              <Text style={{ color: "#71ccf0", fontWeight: "500" }}>
                Confirm
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Render the register toggle */}
        <View>
          <TouchableOpacity
            style={{ alignSelf: "center" }}
            onPress={() => props.navigation.navigate("Login")}
          >
            <Text style={{ color: "#414959", fontSize: 13 }} Password>
              Already have an account?{" "}
              <Text style={{ color: "#71ccf0", fontWeight: "500" }}>
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;

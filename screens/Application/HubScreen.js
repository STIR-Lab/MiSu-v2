import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Dimensions,
  Linking,
} from "react-native";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
import Modal from "react-native-modal";
import { getHubInfoAction } from "../../redux/Action/getHubInfoAction";
import { registerHubAction } from "../../redux/Action/registerHubAction";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const windowHeight = Dimensions.get("window").height;

function HubScreen(props) {
  const [url, setUrl] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const [hubUrlHelper, toggleHubUrlHelper] = useState(false);

  // ========================================================
  // To access status codes:
  // props.registerData.data.statusCode;
  // 405: invalid URL
  // 401: Invalid authentications
  // 400: Server Error
  // 502: Something Crashed
  // 200: No error
  // ========================================================
  const handleClick = async () => {
    if (url == "" || url == null || token == "" || token == null) {
      setError("Some fields have not been completed.");
      return;
    } else {
      await props
        .register(
          {
            hub_url: url,
            hub_token: token,
          },
          props.sessionData.idToken
        )
        .then((res) => {
          // console.log("====HUB SCREEN res", res);
          // console.log(props);
          if (res.statusCode === 200) props.navigation.pop();
          else if (res.statusCode === 405)
            setError("Invalid Hub URL. Is your Hub turned on?");
          else if (res.statusCode === 401)
            setError("Invalid Token. Please check again");
          else if (res.statusCode === 400 || res.statusCode === 502)
            setError("Server Error Occured, try again later.");
          else setError("Unidentified Error");
        })
        .catch((err) => console.log(err));
      // setError('It probably worked..');
    }
  };

  const openTab = (url) => {
    Linking.openURL(url)
      .then(props.navigation.pop())
      .catch((err) => console.log(err));
  };

  let hubUrlModal = (
    <Modal
      isVisible={hubUrlHelper}
      backdropColor={"#00000090"}
      hasBackdrop={true}
      backdropOpacity={10}
      onBackdropPress={() => toggleHubUrlHelper(false)}
    >
      <View style={style.modalContainer}>
        <Icon type="font-awesome" name="exclamation-triangle" size={50} />
        <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
          You may use either a paid subscription service or open a port on your
          router
        </Text>
        <Text style={{ marginTop: 10, textAlign: "center", fontSize: 15 }}>
          In order for HomeAssistant to reach our servers, it is required! You
          may select a tutorial below in order to aid in setup
        </Text>
        <View style={style.buttonContainer}>
          <TouchableOpacity
            onPress={() => openTab("https://www.nabucasa.com/config/")}
            style={{
              borderWidth: 2,
              borderColor: "#008CFF",
              width: 130,
              height: 50,
              borderRadius: 10,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#008CFF",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Nabu Casa
            </Text>
            <Text style={{ textAlign: "center" }}>subscription</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              openTab(
                "https://www.home-assistant.io/docs/configuration/remote/"
              )
            }
            style={{
              borderRadius: 10,
              borderColor: "#008CFF",
              borderWidth: 2,
              width: 130,
              height: 50,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#008CFF",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Portforwarding
            </Text>
            <Text style={{ textAlign: "center" }}>free</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={style.container}>
        <TouchableOpacity
          style={{
            alignSelf: "flex-start",
            marginLeft: 15,
          }}
          onPress={() => {
            props.navigation.pop();
          }}
        >
          <Icon name="arrow-back" size={40} />
        </TouchableOpacity>
        <Text style={{ marginTop: -40, fontWeight: "bold", fontSize: 30 }}>
          Register Your Hub
        </Text>

        <View style={style.cardContainer}>
          <Text style={{ fontWeight: "bold" }}>Smart Hub Provider</Text>
          <View style={style.card}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require("../../assets/icons/ha_icon.png")}
            />
            <Text style={{ textAlign: "center" }}>Home Assistant</Text>
          </View>
        </View>

        <View style={style.form}>
          <View style={style.formRow}>
            <TouchableOpacity onPress={() => toggleHubUrlHelper(true)}>
              <Icon
                name="question-circle"
                type="font-awesome-5"
                size={20}
                style={{ alignSelf: "center", marginRight: 10 }}
              />
            </TouchableOpacity>
            <TextInput
              style={style.input}
              autoCapitalize="none"
              onChangeText={(e) => setUrl(e)}
              value={url}
              placeholder="Hub URL"
              placeholderTextColor="#808080"
            ></TextInput>
          </View>
          <View style={style.formRow}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "https://www.atomicha.com/home-assistant-how-to-generate-long-lived-access-token-part-1/"
                )
              }
            >
              <Icon
                name="question-circle"
                type="font-awesome-5"
                size={20}
                style={{ alignSelf: "center", marginRight: 10 }}
              />
            </TouchableOpacity>
            <TextInput
              style={style.input}
              autoCapitalize="none"
              onChangeText={(e) => setToken(e)}
              value={token}
              placeholder="Hub Token"
              placeholderTextColor="#808080"
            ></TextInput>
          </View>

          <Text style={style.error}>{error}</Text>
        </View>

        <TouchableOpacity style={style.button} onPress={() => handleClick()}>
          <Icon
            name="home"
            type="font-awesome-5"
            color="white"
            size={20}
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            Add Hub
          </Text>
        </TouchableOpacity>
        {hubUrlModal}
      </View>
    </TouchableWithoutFeedback>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#008CFF",
    flexDirection: "row",
    width: 158,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  cardContainer: {
    marginTop: 70,
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    width: 100,
    height: 100,
    borderRadius: 4,
    flexDirection: "column",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    alignSelf: "center",
    shadowOpacity: 10,
    shadowRadius: 20.41,
    borderBottomWidth: 2,
    borderBottomColor: "#a8a8a8",
    elevation: 2,
    marginTop: 10,
  },
  error: {
    color: "red",
  },
  form: {
    marginTop: 60,
    height: windowHeight * 0.25,
    width: "100%",
    paddingHorizontal: 25,
  },
  formRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#F8F8F8",
    borderColor: "#9A9A9A",
    borderWidth: 0.5,
    elevation: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    width: "90%",
  },
  modalContainer: {
    padding: 12,
    flex: 0.45,
    backgroundColor: "#F1F1F1",
    borderRadius: 15,
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    // alignSelf: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
});

const mapStateToProps = (state) => {
  const { hubInfoData, sessionData, sharedAccountsData, registerData } = state;
  return { hubInfoData, sessionData, sharedAccountsData, registerData };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (data, idToken) => dispatch(registerHubAction(data, idToken)),
    getHub: (idToken) => dispatch(getHubInfoAction(idToken)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HubScreen);

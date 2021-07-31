import React, { useState, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import SearchBar from "../../components/SearchBar";
import { getHubInfoAction } from "../../redux/Action/getHubInfoAction";
import { registerHubAction } from "../../redux/Action/registerHubAction";
import { shareAction } from "../../redux/Action/shareAction";
import appStyle from "../../styles/AppStyle";
import DeviceInfoCard from "../../components/cards/DeviceInfoCard";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Feather";
import { getSharedAccountsAction } from "../../redux/Action/getSharedAccountsAction";

import { createSharedUser } from "../../services/creationService";
import { showToast } from "../../utils/toast";
//import { shareAction } from "../../../redux/Action/shareAction";

// AWS Config

// const AWS = require('aws-sdk');
// AWS.config.update({ region: 'us-east-1' });

function GuestsScreen(props) {
  const [searchParam, setSearchParam] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [sharedAccs, setSharedAccs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [opacity, setOpacity] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // openModal = () => {
  //   setIsVisible(!isVisible);
  // };

  openModal2 = () => {
    setIsVisible2(!isVisible2);
  };

  // console.log(props.devicesData.devices);

  // =========================================================================
  // REFRESH LOGIC: TO DO LATER
  // =========================================================================

  // Retrieves all the information on pull down/refresh of the app
  // onRefresh = async () => {
  // 	// await this.setState({ loading: true });
  // 	// await this.setState({ refreshingUsers: true });
  // 	const { idToken } = props.sessionData;
  // 	props.getHub(idToken);
  // 	props.getDevices(idToken);
  // 	await props.getAccounts(idToken);
  // 	props.getSharedDevices(idToken);
  // 	getUsageLogs();
  // 	getAccessLogs();
  // 	// await this.setState({ loading: false });
  // 	// await this.setState({ refreshingUsers: false });
  // };

  // Called when when the screen is about to load, grabs all the info to display
  // THE LACK OF THE [] IN THE SECOND PARAMETER CAUSES INFINITE CONSOLE LOGGING OR RERENDERING IN ACCOUNT SCREEN
  // REQUIRES FURTHER INVESTIGATION
  useEffect(() => {
    // if (props.sessionData != null)
    // 	props.navigation.setParams({
    // 		name: props.sessionData.name
    // 	});
    // const { idToken } = props.sessionData;
    // console.log("GuestsScreen:", props.sessionData.idToken);
    const idToken = 0;
    //getUsageLogs();
    //getAccessLogs();
    // onRefresh();
    fetchData(idToken);
  }, [props.sharedAccountsData.sharedAccounts, sharedAccs]);

  // console.log("GuestsScreen:", props.sessionData.idToken);
  async function fetchData(idToken) {
    // console.log('Fetching Data..');
    // props.getHub(idToken);
    // props.getDevices(idToken);
    // props.getSharedDevices(idToken);
    // props.getAccounts(idToken);
    // console.log("PROPS", props)
    setSharedAccs(props.sharedAccountsData.sharedAccounts);
    // console.log('Data Fetched.');

    // console.log("==SHARED ACCS:", sharedAccs);
    // console.log("== GUESTS SCREEN== ", props);
  }

  async function addNewGuest() {
    let str = guestEmail.split(" ").join("").toLowerCase();
    await createSharedUser(props.sessionData.idToken, str)
      .then((response) => {
        // console.log(response);
        return response;
      })
      .then((response) => {
        // console.log("Return from Add Guest")
        // console.log(response)
        if (response.statusCode === 200) {
          setTimeout(() => {
            props.getAccounts(props.sessionData.idToken);
            showToast("User added successfully!");
            setIsVisible2(false);
          }, 1000);
        } else {
          setErrorMsg("An error occured, try again.");
        }
      })
      .catch((err) => console.log(err));
  }

  // let modal = (
  //   <Modal
  //     visible={isVisible}
  //     transparent={true}
  //     onBackdropPress={() => setIsVisible(false)}
  //   >
  //     <View style={styles.modal}>
  //       <Text>Test</Text>
  //     </View>
  //   </Modal>
  // );

  let modal2 = (
    <Modal
      isVisible={isVisible2}
      transparent={true}
      onBackdropPress={() => setIsVisible2(false)}
      backdropColor={"#00000080"}
      backdropOpacity={1}
      hasBackdrop={true}
    >
      <View style={styles.addGuestmodal}>
        <View style={styles.addGuestHeader}>
          <Icon name="users" type="feather" color="black" size={25} />
          <Text style={{ marginLeft: 10, fontSize: 20 }}>Add New Guest</Text>
        </View>
        <Text
          style={{
            fontWeight: "bold",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          Send a request to your guest to have them share your home!
        </Text>
        <TextInput
          style={styles.input}
          placeholder={"Guest Email"}
          onChangeText={(text) => setGuestEmail(text)}
        />
        <Text style={styles.responseMsg}>{errorMsg}</Text>
        <TouchableOpacity onPress={() => addNewGuest()}>
          <View style={styles.submitButton}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 22,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Send Request
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={appStyle.container}>
        <View style={styles.header}>
          <SearchBar setSearchParam={setSearchParam} screen={"Guests"} />
          <TouchableOpacity style={styles.button} onPress={() => openModal2()}>
            <Icon name="user-plus" size={30} style={{ color: "#44ABFF" }} />
            <View style={styles.addGuest}>
              <Text style={{ textAlign: "center" }}>Add Guest</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* <Text>{searchParam}</Text> */}
        <ScrollView style={styles.cardContainer}>
          {Array.isArray(sharedAccs) &&
            sharedAccs
              .filter((guest) => guest.name.includes(searchParam))
              .map((entry, i) => (
                <DeviceInfoCard
                  key={i}
                  title={entry.name}
                  user={entry}
                  device={entry.devices}
                  type={"GuestCard"}
                  sharedAccs={sharedAccs}
                  navigation={props.navigation}
                  myDevices={props.devicesData.devices}
                  idToken={props.sessionData.idToken}
                  delete={props.getAccounts}
                />
              ))}
        </ScrollView>
        {/* {modal} */}
        {modal2}
      </View>
    </TouchableWithoutFeedback>
  );
}

const mapStateToProps = (state) => {
  const {
    devicesData,
    sharedAccountsData,
    sessionData,
    shareState,
    AccessState,
  } = state;
  return {
    devicesData,
    sharedAccountsData,
    sessionData,
    shareState,
    AccessState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ModifyAccess: (title, value) => {
      dispatch(ModifyAccessStateAction(title, value));
    },
    getAccounts: (idToken) => dispatch(getSharedAccountsAction(idToken)),
    Share: (idToken, email, device, accounts, properties, options) => {
      dispatch(
        shareAction(idToken, email, device, accounts, properties, options)
      );
    },
  };
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    marginTop: 0,
    margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
    position: "absolute",
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    height: 50,
    right: 0,
    width: "32%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 6,
  },
  modal: {
    backgroundColor: "green",
    width: 300,
    height: 500,
    alignSelf: "center",
    alignItems: "center",
  },
  addGuest: {
    alignItems: "center",
    marginLeft: 5,
  },

  addGuestmodal: {
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    width: 300,
    height: 300,
    alignSelf: "center",
    alignItems: "center",
  },

  addGuestHeader: {
    marginTop: 25,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  input: {
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "#F4F4F4",
    alignSelf: "stretch",
    paddingLeft: 20,
    height: 48,
    fontSize: 16,
    marginTop: 21,
    marginHorizontal: 20,
  },

  submitButton: {
    marginTop: 15,
    backgroundColor: "#289EFF",
    borderRadius: 10,
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  responseMsg: {
    marginTop: 5,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GuestsScreen);

import React, { useState, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import SearchBar from "../../components/SearchBar";
import { getHubInfoAction } from "../../redux/Action/getHubInfoAction";
import { registerHubAction } from "../../redux/Action/registerHubAction";
import appStyle from "../../styles/AppStyle";
import DeviceInfoCard from "../../components/cards/DeviceInfoCard";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Feather";

// AWS Config

// const AWS = require('aws-sdk');
// AWS.config.update({ region: 'us-east-1' });


function YourHubsScreen(props) {
  const [searchParam, setSearchParam] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [sharedAccs, setSharedAccs] = useState(null);
  const [loading, setLoading] = useState(false);

  openModal = () => {
    setIsVisible(!isVisible);
  };
  // console.log(props);

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
    console.log(props);
    const idToken = 0;
    //getUsageLogs();
    //getAccessLogs();
    // onRefresh();
    fetchData(idToken);
    // console.log(props);
    // console.log('== GUESTS SCREEN== ' + JSON.stringify(sharedAccs));
  }, []);

  async function fetchData(idToken) {
    // console.log('Fetching Data..');
    // props.getHub(idToken);
    // props.getDevices(idToken);
    // props.getSharedDevices(idToken);
    // props.getAccounts(idToken);
    setSharedAccs(props.sharedAccountsData.sharedAccounts);
    // console.log('Data Fetched.');

    // console.log(props);
    // console.log("== GUESTS SCREEN== " + JSON.stringify(sharedAccs));
  };



  let modal = (
    <Modal
      visible={isVisible}
      transparent={true}
      onBackdropPress={() => setIsVisible(false)}
    >
      <View style={styles.modal}>
        <Text>Test</Text>
      </View>
    </Modal>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={appStyle.container}>
        <View style={styles.header}>
          <SearchBar setSearchParam={setSearchParam} screen={"Guests"} />
          <TouchableOpacity style={styles.button} onPress={() => openModal()}>
            <Icon name="user-plus" size={30} style={{ color: "#44ABFF" }} />
            <View style={styles.addGuest}>
              <Text style={{ textAlign: "center" }}>Add Guest</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* <Text>{searchParam}</Text> */}
        <ScrollView style={styles.cardContainer}>
          <DeviceInfoCard
            title={"Sam Smith"}
            type={"GuestCard"}
            sharedAccs={sharedAccs}
            navigation={props.navigation}
          />
        </ScrollView>
        {modal}
      </View>
    </TouchableWithoutFeedback>
  );
}

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
    height: 70,
    right: 0,
    width: "32%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
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
});


const mapStateToProps = (state) => {
	const { hubInfoData, sessionData, sharedAccountsData, registerData } = state;
	return { hubInfoData, sessionData, sharedAccountsData, registerData };
};

const mapDispatchToProps = (dispatch) => {
	return {
		register: (data, idToken) => dispatch(registerHubAction(data, idToken)),
		getHub: (idToken) => dispatch(getHubInfoAction(idToken))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(YourHubsScreen);
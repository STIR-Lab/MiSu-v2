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
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { connect } from "react-redux";
import SearchBar from "../../components/SearchBar";
import { getHubInfoAction } from "../../redux/Action/getHubInfoAction";
import { registerHubAction } from "../../redux/Action/registerHubAction";
import appStyle from "../../styles/AppStyle";
import DeviceInfoCard from "../../components/cards/DeviceInfoCard";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Feather";
import { getSharedDevicesAction } from "../../redux/Action/getSharedDevicesAction";

// AWS Config

// const AWS = require('aws-sdk');
// AWS.config.update({ region: 'us-east-1' });

function YourHubsScreen(props) {
  const isFocused = useIsFocused();
  const [searchParam, setSearchParam] = useState("");
  const [sharedAccs, setSharedAccs] = useState(null);
  const [refresh, setFresh] = useState(1);

  let collapsibleList;

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
    // console.log("Your hub screen useEffect");
    const idToken = props.sessionData.idToken;
    fetchData(idToken);
  }, [props, isFocused]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const idToken = props.sessionData.idToken;
  //     fetchData(idToken);
  //   }, [props, isFocused])
  // );

  function getResults(results) {
    setSharedAccs(results);
    // console.log(sharedAccs);
    // console.log("YOUR HUBS SCREEN GET RESULTS:", props);
    return;
  }

  async function fetchData(idToken) {
    await props
      .getList(idToken)
      .then((res) => getResults(res))
      .catch((err) => console.log(err));
  }

  collapsibleList =
    !sharedAccs || !sharedAccs.message ? (
      <Text>Loading...</Text>
    ) : sharedAccs.message.length == 0 ? (
      <Text>
        Request Access to someone's smart home to gain access to their devices!
      </Text>
    ) : (
      sharedAccs.message
        .filter(
          (hub) => hub.sharer_name.includes(searchParam) && hub.accepted == 1
        )
        .map((m) => (
          <DeviceInfoCard
            key={m.login_credentials_id}
            title={m.sharer_name}
            devices={m.devices}
            type={"HubCard"}
            sharedAccs={m}
            navigation={props.navigation}
          />
        ))
    );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={appStyle.container}>
        <View style={styles.header}>
          <SearchBar setSearchParam={setSearchParam} screen={""} />
        </View>
        {/* <Text>{searchParam}</Text> */}
        <ScrollView style={styles.cardContainer}>{collapsibleList}</ScrollView>
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
});

const mapStateToProps = (state) => {
  const { hubInfoData, sessionData, sharedAccountsData, registerData } = state;
  return { hubInfoData, sessionData, sharedAccountsData, registerData };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (data, idToken) => dispatch(registerHubAction(data, idToken)),
    getHub: (idToken) => dispatch(getHubInfoAction(idToken)),
    getList: (idToken) => dispatch(getSharedDevicesAction(idToken)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(YourHubsScreen);

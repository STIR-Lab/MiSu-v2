import { Auth } from "aws-amplify";
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
import { useIsFocused } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar";
import DeviceInfoCard from "../../components/cards/DeviceInfoCard";
import { getHubInfoAction } from "../../redux/Action/getHubInfoAction";
import { registerHubAction } from "../../redux/Action/registerHubAction";
import appStyle from "../../styles/AppStyle";

import { getListofSharedAccountsDevicesScreen } from "../../services/listDevice";

function DevicesScreen(props) {
  const isFocused = useIsFocused();
  const [searchParam, setSearchParam] = useState("");
  const [sharedAccs, setSharedAccs] = useState(null);

  useEffect(() => {
    fetchData();
  }, [props, isFocused]);

  async function fetchData(idToken) {
    console.log("Fetching devicesScreen data");
    await getListofSharedAccountsDevicesScreen(props.sessionData.idToken)
      .then((response) => {
        // console.log("Devices Screen", response);
        if (response.statusCode == 200) {
          console.log("changine", response);
          setSharedAccs(response);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={appStyle.container}>
        <View style={styles.header}>
          <SearchBar setSearchParam={setSearchParam} screen={"Devices"} />
        </View>

        <ScrollView style={styles.cardContainer}>
          {sharedAccs &&
            sharedAccs.message
              .filter((guest) => guest.name.includes(searchParam))
              .map((entry, i) => (
                <DeviceInfoCard
                  key={i}
                  type={"DeviceCard"}
                  title={entry.name}
                  guests={entry.guests}
                  deviceType={entry.type}
                  entityId={entry.entity_id}
                  navigation={props.navigation}
                  refresh={fetchData}
                />
              ))}
        </ScrollView>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DevicesScreen);

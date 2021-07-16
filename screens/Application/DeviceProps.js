import { Route53 } from "aws-sdk";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Switch,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import DeviceCard from "../../components/cards/DeviceCard";
import appStyle from "../../styles/AppStyle";

// importing set schedule card from ./cards
import SetScheduleCard from "../../components/cards/SetScheduleCard";

function DeviceProps(props) {
  const [userName, setUserName] = useState("Placeholder");
  const [deviceName, setDeviceName] = useState("Placeholder");
  // Properties
  const [geofencing, setGeofencing] = useState(false);
  const [accessType, setAccessType] = useState(false);
  const [allDayAccess, setAllDayAccess] = useState(false);
  const [timeStart, setTimeStart] = useState(null);
  const [timeEnd, setTimeEnd] = useState(null);
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [reoccuringDays, setReoccuringDays] = useState(null);
  const [reoccuringType, setReoccuringType] = useState(0);

  useEffect(() => {
    console.log(
      "==DeviceProps==" + JSON.stringify(props.route.params) + "======"
    );
    var accountProperties = props.route.params.accObject;
    var deviceProperties = props.route.params.currDevice.properties[0];
    if (accountProperties.name != null) {
      setUserName(accountProperties.name);
    }
    if (props.route.params.deviceName != null) {
      setDeviceName(props.route.params.deviceName);
    }

    if (deviceProperties == null) {
      return;
    }

    // Geofencing
    // -> 0: disabled, 1: enabled
    if (deviceProperties.geofencing != null) {
      if (deviceProperties.geofencing == "1") {
        console.log("Setting geofencing true");
        setGeofencing(true);
      }
    }

    // Access-Type
    // -> 0: nothing, 1: all-in, 2: Time-range
    if (deviceProperties.access_type != null) {
      // No Access
      if (deviceProperties.accessType == "0") {
      }
      // All-In
      if (deviceProperties.accessType == "1") {
      }
      // Time-Range
      if (deviceProperties.accessType == "2") {
      }
    }

    // Time-all-day
    // -> 0: No, 1: Yes
    if (deviceProperties.time_all_day != null) {
      if (deviceProperties.time_all_day == "1") {
        setAllDayAccess(true);
      }
    }

    // Time Start
    if (deviceProperties.time_start != null) {
      // Only set time start/end if allDayAccess not enabled
      if (!allDayAccess) {
        setTimeStart(deviceProperties.time_start);
      }
    }

    // Time End
    if (deviceProperties.time_end != null) {
      if (!allDayAccess) {
        setTimeEnd(deviceProperties.time_end);
      }
    }

    // Date Start
    if (deviceProperties.date_start != null) {
      setDateStart(deviceProperties.date_start);
    }

    // Date End
    if (deviceProperties.date_end != null) {
      setDateEnd(deviceProperties.date_end);
    }

    // Days Reoccuring
    // -> array[0-6] = array[sunday, monday, tuesday, ...]
    if (deviceProperties.days_reoccuring != null) {
      console.log(deviceProperties.days_reoccuring);
    }

    // Reoccuring Type
    // -> 0: Not reoccuring, 1: Weekly, 2: Bi-weekly
    if (deviceProperties.reoccuringType != null) {
      setReoccuringType(deviceProperties.reoccuringType);
    }
  }, []);

  // async function fetchValues() {
  //   const response = await fetch(
  //     'https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/property',
  //     {
  //       method: 'POST',
  //       headers: {
  //         Authorization: 'Bearer ' + props.route.params.bearerId,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         account: props.route.params.device.login_credentials_id,
  //         device: props.route.params.device.shared_device_properties_id,
  //       }),
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //     });
  // }

  return (
    <View style={appStyle.container}>
      {
        <View style={appStyle.cardContainer}>
          <View>
            <TouchableOpacity
              style={{ alignSelf: "flex-start" }}
              onPress={() => {
                props.navigation.pop();
              }}
            >
              <Icon name="arrow-back" size={35} style={{ marginBottom: 10 }} />
            </TouchableOpacity>
          </View>
          <ScrollView style={appStyle.scrollView}>
            <View style={propstyle.rowContainer}>
              <View style={propstyle.card}>
                <View style={propstyle.row}>
                  <Image source={require("../../assets/people.png")} />
                  <Text
                    style={{
                      paddingLeft: 10,
                      paddingRight: 10,
                      alignSelf: "center",
                      fontSize: 16,
                    }}
                  >
                    {userName}
                  </Text>
                </View>
              </View>

              <View style={propstyle.devicecard}>
                <View style={appStyle.row}>
                  <Image
                    style={{ marginLeft: 10, alignSelf: "center" }}
                    source={require("../../assets/zap.png")}
                  />
                  <Text
                    style={{
                      paddingLeft: 10,
                      paddingRight: 10,
                      alignSelf: "center",
                      fontSize: 13,
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {deviceName}
                  </Text>
                </View>
              </View>
            </View>

            <View style={propstyle.column}>
              <Text style={{ fontSize: 26, fontWeight: "bold" }}>
                Set Schedule
              </Text>

              <SetScheduleCard
                deviceProperties={props.route.params.currDevice.properties}
                navigation={props.route.params.navigation}
              />

              <Text style={{ marginTop: 20, fontSize: 26, fontWeight: "bold" }}>
                Available Actions
              </Text>
              <View style={[propstyle.lineContainer, { marginTop: 8 }]} />
              <View
                style={{
                  marginTop: 10,
                  paddingBottom: 0,
                  flexDirection: "row",
                  alignSelf: "stretch",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 20 }}>Lock/Unlock</Text>
              </View>

              <Text style={{ marginTop: 20, fontSize: 26, fontWeight: "bold" }}>
                Set Geofencing
              </Text>
              <View style={[propstyle.lineContainer, { marginTop: 8 }]} />
              <View
                style={{
                  marginTop: 20,
                  paddingBottom: 0,
                  flexDirection: "row",
                  alignSelf: "stretch",
                  justifyContent: "space-between",
                }}
              >
                <Switch
                  style={{
                    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                  }}
                  trackColor={{ true: "#2DC62A", false: "#FF5D53" }}
                  value={geofencing}
                  // Kolbe api call to set gps location and set deviceProps gps_location
                  onValueChange={(x) => {}}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      }
    </View>
  );
}

const propstyle = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#FFFFFF",

    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 10,
    shadowRadius: 20.41,
    borderBottomWidth: 3,
    borderBottomColor: "#a8a8a8",
    elevation: 4,

    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 35,
    paddingBottom: 5,
    marginBottom: 5,
    marginRight: 25,
  },
  devicecard: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#44ABFF",

    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 10,
    shadowRadius: 20.41,
    borderBottomWidth: 3,
    borderBottomColor: "#a8a8a8",
    elevation: 4,

    paddingTop: 5,
    paddingLeft: 2,
    paddingRight: 4,
    paddingBottom: 5,
    marginBottom: 5,
    marginRight: 0,
  },
  row: {
    margin: 2,
    paddingBottom: 0,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  rowContainer: {
    margin: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },
  column: {
    margin: 2,
    marginTop: 20,
    paddingBottom: 0,
    flexDirection: "column",
    alignSelf: "stretch",
  },
  lineContainer: {
    flex: 1,
    backgroundColor: "#333333",
    height: 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
});

const mapStateToProps = (state) => {
  const { devicesData, sessionData, sharedDevicesData, sharedAccountsData } =
    state;
  return { devicesData, sessionData, sharedDevicesData, sharedAccountsData };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dosomething: () => {},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceProps);

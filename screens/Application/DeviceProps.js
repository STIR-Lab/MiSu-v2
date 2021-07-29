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
  Alert,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import DeviceCard from "../../components/cards/DeviceCard";
import appStyle from "../../styles/AppStyle";
import UserAvatar from 'react-native-user-avatar';

// importing set schedule card from ./cards
import SetScheduleCard from "../../components/cards/SetScheduleCard";
import { set } from "react-native-reanimated";

// imorting gps functionality
import GPS from "../../components/GPS.js";
import * as Location from "expo-location";
import haversine from "haversine";
import { ActivityIndicator } from "react-native";

function DeviceProps(props) {
  const isFocused = useIsFocused();
  const [userName, setUserName] = useState("Placeholder");
  const [deviceName, setDeviceName] = useState("Placeholder");
  const [isLoading, setIsLoading] = useState(true);

  const [account, setAccount] = useState("");
  const [deviceId, setDeviceId] = useState("");

  // Properties
  const [propertiesObj, setPropertiesObj] = useState({});

  const [accessType, setAccessType] = useState(false);
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [reoccuringDays, setReoccuringDays] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [geofencing, setGeofencing] = useState(0);
  const [reoccuringType, setReoccuringType] = useState(0);
  const [allDayAccess, setAllDayAccess] = useState(0);
  const [timeStart, setTimeStart] = useState(null);
  const [timeEnd, setTimeEnd] = useState(null);

  useEffect(() => {
    // console.log("Entered deviceProps");
    // console.log("==DeviceProps==", props.route.params, "======");
    var accountProperties = props.route.params.currDevice;
    setIsLoading(true);

    if (
      accountProperties.shared_device_properties_id != null &&
      accountProperties.login_credentials_id != null
    ) {
      // setDeviceId(accountProperties.devices[0].shared_device_properties_id);
      getDeviceProperties(
        accountProperties.login_credentials_id,
        accountProperties.shared_device_properties_id
      );
    }

    if (accountProperties.name != null) {
      setDeviceName(accountProperties.name);
    }
    if (props.route.params.accObject.name != null) {
      setUserName(props.route.params.accObject.name);
    }

    if (
      props.route.params.currDevice.properties == null ||
      props.route.params.currDevice.properties == ""
    ) {
      return;
    }
  }, [props, geofencing, isFocused]);

  async function getDeviceProperties(accountID, deviceID) {
    // console.log("Fetching with:// " + accountID + " : " + deviceID);
    const response = await fetch(
      "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getproperty",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + props.route.params.idToken,
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          account: accountID,
          device_id: deviceID,
        }),
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setIsLoading(false);
        if (data.properties != null) {
          setProperties(data.properties);
          setPropertiesObj(data.properties);
        }
      });
  }

  function setProperties(deviceProperties) {
    // Geofencing
    // -> 0: disabled, 1: enabled
    if (deviceProperties.geofencing != null) {
      setGeofencing(deviceProperties.geofencing);
    }

    // Access-Type
    // -> 0: nothing, 1: all-in, 2: Time-range
    if (deviceProperties.access_type != null) {
      setAccessType(deviceProperties.access_type);
    }

    // Time-all-day
    // -> 0: No, 1: Yes
    if (deviceProperties.time_all_day != null) {
      setAllDayAccess(deviceProperties.time_all_day);
    }

    // Time Start
    if (deviceProperties.time_start != null) {
      setTimeStart(deviceProperties.time_start);
    }

    // Time End
    if (deviceProperties.time_end != null) {
      setTimeEnd(deviceProperties.time_end);
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
      setReoccuringDays(deviceProperties.days_reoccuring);
    }

    // Reoccuring Type
    // -> 0: Not reoccuring, 1: Weekly, 2: Bi-weekly
    if (deviceProperties.reoccuringType != null) {
      setReoccuringType(deviceProperties.reoccuringType);
    }
  }

  async function handleSwitch(x) {
    setGeofencing(x);
    const response = await fetch(
      "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/property",
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + props.route.params.idToken,
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          account: props.route.params.currDevice.login_credentials_id,
          device: props.route.params.currDevice.shared_device_properties_id,
          shared_property_id:
            props.route.params.currDevice.properties[0].shared_property_id,
          geofencing: x == true ? 1 : 0,
          access_type: accessType,
          days_reoccuring: reoccuringDays,
          all_day: allDayAccess,
          time_start: timeStart,
          time_end: timeEnd,
          date_start: dateStart,
          date_end: dateEnd,
          reoccuring_type: reoccuringType,
        }),
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log("GEOFENCING RETURN", data);
        if (data.statusCode != 200) {
          setGeofencing(!x);
        }
      });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////////////////

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
                <UserAvatar size={40} borderRadius={41} name={props.route.params.accObject.name} />
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

              {!isLoading ? (
                <SetScheduleCard
                  accObject={props.route.params.accObject}
                  deviceProperties={propertiesObj}
                  navigation={props.route.params.navigation}
                  idToken={props.route.params.idToken}
                />
              ) : (
                <ActivityIndicator
                  style={{ marginTop: 50 }}
                  size="large"
                  color="#5BD3FF"
                />
              )}

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
                  value={geofencing == 0 ? false : true}
                  // Kolbe api call to set gps location and set deviceProps gps_location
                  onValueChange={(x) => {
                    handleSwitch(x);
                  }}
                />

                {geofencing ? (
                  <GPS
                    token={props.route.params.idToken}
                    hubLong={props.hubInfoData.hub_longitude}
                    hubLat={props.hubInfoData.hub_latitude}
                  />
                ) : null}
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={propstyle.redButton}
            onPress={() =>
              deleteGuest(
                props.route.params.user.login_credentials_id,
                props.route.params.idToken
              )
            }
          >
            <Text style={propstyle.redButtonText}>Revoke Access</Text>
          </TouchableOpacity>
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
  redButton: {
    backgroundColor: "#ea5f5f",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    height: 60,
    width: 185,
    shadowColor: "#000",
    shadowOffset: {
      width: 20,
      height: 5,
    },
    shadowOpacity: 0.9,
    shadowRadius: 2.62,
    borderWidth: 1.4,
    borderColor: "#cc9797",
    elevation: 6,
  },
  redButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

const mapStateToProps = (state) => {
  const {
    hubInfoData,
    devicesData,
    sessionData,
    sharedDevicesData,
    sharedAccountsData,
  } = state;
  return {
    hubInfoData,
    devicesData,
    sessionData,
    sharedDevicesData,
    sharedAccountsData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dosomething: () => {},
    getHub: (idToken) => dispatch(getHubInfoAction(idToken)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceProps);

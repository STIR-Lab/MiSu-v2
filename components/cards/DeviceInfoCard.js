import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import Collapsible from "react-native-collapsible";
import SampleDeviceList from "../../components/cards/ListEntries/SampleDeviceList";
import LastActionCard from "../../components/cards/LastActionCard";

import { Icon } from "react-native-elements";

function DeviceInfoCard(props) {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    // console.log('==DEVICE INFO CARD== ' + props.sharedAccs.devices[0].name);
  });

  // Ugly check to determine icon off of deviceName
  const checkIcon = (deviceName) => {
    // Needed for before data is loaded
    //  -> deviceName should **never** be null once deployed
    if (deviceName == null) return "aperture";
    var dName = deviceName.toString().toLowerCase();
    if (dName.includes("bulb")) {
      return "zap";
    }
    if (dName.includes("lock")) {
      return "lock";
    }
    if (dName.includes("speaker") || dName.includes("google")) {
      return "speaker";
    }
    return "aperture";
  };

  const deviceIcons = () => {
    return (
      <View style={styles.row}>
        {props.device &&
          props.device.map((entry, i) => (
            <View style={styles.iconContainer} key={i}>
              <Icon
                name={checkIcon(entry.name)}
                type="feather"
                style={{
                  borderRadius: 10,
                  borderColor: "#58d456",
                  borderWidth: 2,
                }}
              />
            </View>
          ))}
      </View>
    );
  };

  const alter = () => {
    setCollapsed(!collapsed);
  };

  let list;

  if (props.type == "HubCard")
    list = (
      <SampleDeviceList
        screen="Hubs"
        title={props.title}
        devices={props.devices}
        sharedAccs={props.sharedAccs}
        navigation={props.navigation}
      />
    );
  else if (props.type == "GuestCard")
    list = (
      <SampleDeviceList
        screen="Guests"
        title={props.title}
        user={props.user}
        devices={props.device}
        // sharedAccs={props.sharedAccs} attempting to use redux instead
        navigation={props.navigation}
      />
    );
  else if (props.type == "DeviceCard")
    list = (
      // TODO: Render the Sample Device List from the Devices Screen
      <View />
    );

  const panel = (
    <View style={styles.container}>
      <View style={styles.header}>
        {props.type != "HubCard" ? (
          <View style={styles.devIcon}>
            <Image
              source={require("../../assets/people.png")}
              resizeMode="stretch"
              style={{
                height: 45,
                width: 45,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </View>
        ) : (
          <View style={styles.devIcon2}>
            <Icon name="home" type="feather" size={45} />
          </View>
        )}

        <View>
          <Text style={styles.userName}>{props.title}</Text>
        </View>

        {/* Device Icons */}
        {deviceIcons()}

        <TouchableOpacity style={styles.dropDownButtom} onPress={alter}>
          {collapsed ? (
            <Icon name="chevron-right" type="feather" size={35} />
          ) : (
            <Icon name="chevron-down" type="feather" size={35} />
          )}
        </TouchableOpacity>
      </View>
      <Collapsible collapsed={collapsed} style={styles.expanded}>
        <View style={styles.activeGuests}>
          <Text style={styles.text}>
            {props.type == "DeviceCard" ? "Active Guests" : "Devices"}
          </Text>
        </View>
        <View style={styles.guestList}>{list}</View>
        {props.type != "HubCard" && <LastActionCard screen={props.type} />}
      </Collapsible>
    </View>
  );

  return (
    <View>
      <TouchableWithoutFeedback>{panel}</TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  activeGuests: {
    alignContent: "center",
    padding: 15,
  },
  text: {
    fontWeight: "700",
    fontSize: 18,
    color: "#404040",
  },
  container: {
    width: "100%",
    marginBottom: 15,
  },
  header: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    height: 80,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 6,
  },
  guestList: {
    width: "100%",
    alignItems: "center",
  },
  dropDownButtom: {
    backgroundColor: "#FFFFFF",
    position: "absolute",
    right: 0,
    borderTopRightRadius: 5,
    height: "100%",
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 0.5,
  },
  expanded: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  devIcon: {
    alignSelf: "center",
    height: 46,
    width: 46,
    marginHorizontal: 10,
  },
  iconContainer: {
    height: 30,
    width: 30,
    alignSelf: "center",
    justifyContent: "center",
  },
  row: {
    margin: 2,
    marginLeft: 40,
    paddingBottom: 0,
    flexDirection: "row",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  devIcon2: {
    height: 46,
    width: 46,
    marginHorizontal: 15,
    borderRadius: 6,
  },
});

export default DeviceInfoCard;

import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { Button, Icon } from "react-native-elements";
import { connect } from "react-redux";
import { getHubInfoAction } from "../../redux/Action/getHubInfoAction";
import { registerHubAction } from "../../redux/Action/registerHubAction";
import appStyle from "../../styles/AppStyle";


function DeviceControlScreen(props) {
  const [deviceTitle, setDeviceTitle] = useState("Unknown");
  const [toggledOn, setToggle] = useState(false);
  const [hubOffline, setHubOffline] = useState(false);

  const [reoccuringDays, setReoccuringDays] = useState("");

  useEffect(() => {
    console.log("DEVICE CONTROL", props.route.params.device);
    if (props.route.params.device.properties[0].access_type == "2")
    {
      console.log("==============")
      let daysOfWeek = "";
      if (props.route.params.device.properties[0].days_reoccuring[0])
        daysOfWeek+= "Sun, "
      if (props.route.params.device.properties[0].days_reoccuring[1])
        daysOfWeek+= "Mon, "
      if (props.route.params.device.properties[0].days_reoccuring[2])
        daysOfWeek+= "Tues, "
      if (props.route.params.device.properties[0].days_reoccuring[3])
        daysOfWeek+= "Wed, "
      if (props.route.params.device.properties[0].days_reoccuring[4])
        daysOfWeek+= "Thurs, "
      if (props.route.params.device.properties[0].days_reoccuring[5])
        daysOfWeek+= "Fri, "
      if (props.route.params.device.properties[0].days_reoccuring[6])
        daysOfWeek+= "Sat, "
      daysOfWeek = daysOfWeek.slice(0, -2);
      setReoccuringDays(daysOfWeek);
    }
    fetchValues();
  }, []);

  async function fetchValues() {
    const response = await fetch(
      "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getvalues",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + props.route.params.bearerId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: props.route.params.device.login_credentials_id,
          device: props.route.params.device.shared_device_properties_id,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log("DATA ON DEVICE CONTROL", data);
        if (data.message.attributes.friendly_name != null) {
          setDeviceTitle(data.message.attributes.friendly_name);
        }
        else
        {
          setHubOffline(true);
        }

        if (data.message.state == "unlocked" || data.message.state == "on") {
          setToggle(true);
        }
      });
  }

  async function handleClick(value) {
    // Handles the action for when button is currently toggled
    if ((value == "unlock" && toggledOn) || (value == "lock" && !toggledOn)) {
      return;
    }

    await fetch(
      "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + props.route.params.bearerId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: props.route.params.device.login_credentials_id,
          device_id: props.route.params.device.shared_device_properties_id,
          action: value,
        }),
      }
    );
    setToggle(!toggledOn);
  }

  return (
    <View style={appStyle.container}>
      <View style={styles.appbar}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.pop();
          }}
        >
          <Icon name="arrow-left" type="feather" color="black" size={45} />
        </TouchableOpacity>
      </View>

      <View style={appStyle.container}>
        <View style={styles.title}>
          <Text style={{ fontSize: 23, fontWeight: "bold", color: "#353535" }}>
            {deviceTitle}
          </Text>
        </View>

        <View style={styles.card}>
          <View
            style={{
              alignSelf: "center",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Image source={require("../../assets/DeviceIcons/Lock.png")} />

            {toggledOn ? (
              <View style={styles.row}>
                <Icon
                  name="circle"
                  type="feather"
                  color="red"
                  size={17}
                  style={{ marginRight: 5 }}
                />
                <Text style={{ color: "red", fontWeight: "bold" }}>Unlocked</Text>
              </View>
            ) : (
              <View style={styles.row}>
                <Icon
                  name="circle"
                  type="feather"
                  color="green"
                  size={17}
                  style={{ marginRight: 5 }}
                />
                <Text style={{ color: "green", fontWeight: "bold" }}>Locked</Text>
              </View>
            )}
          </View>
        </View>

        {!hubOffline ?
        <View style={styles.scheduleContainer}>
          <View style={styles.scheduleRow}>
            <Icon name="schedule" type="material" size={25} style={styles.icons} />
            <View style={styles.scheduleDataCont}>
              { props.route.params.device.properties[0].reoccuring_type == 1 && <Text style={styles.scheduleText}>{reoccuringDays}</Text>}
              {(props.route.params.device.properties[0].time_end != null && props.route.params.device.properties[0].time_start != null) ?
              <Text style={styles.scheduleText}>{props.route.params.device.properties[0].time_start.slice(0, -3)} - {props.route.params.device.properties[0].time_end.slice(0, -3)}</Text> :
              props.route.params.device.properties[0].access_type == 0 ?
              <Text style={styles.scheduleText}>Never</Text> : <Text style={styles.scheduleText}>All Day</Text>}
            </View>
          </View>
          <View style={styles.scheduleRow}>
            <Icon name="replay" type="material" size={25} style={styles.icons} />
            <View style={styles.scheduleDataCont}>
              {props.route.params.device.properties[0].reoccuring_type == 0 &&
              <Text style={styles.scheduleText}>Not recurring</Text>}
              {props.route.params.device.properties[0].reoccuring_type == 1 &&
              <Text style={styles.scheduleText}>Recurring Weekly</Text>}
            </View>
          </View>
          <View style={styles.scheduleRow}>
            <Icon name="date-range" type="material" size={25} style={styles.icons} />
            <View style={styles.scheduleDataCont}>            
              {props.route.params.device.properties[0].date_start != null && props.route.params.device.properties[0].date_end != null &&
              <Text style={styles.scheduleText}>{props.route.params.device.properties[0].date_start} - {props.route.params.device.properties[0].date_end}</Text>}
              {props.route.params.device.properties[0].access_type == 0 &&
              <Text style={styles.scheduleText}>Never</Text>}
              {props.route.params.device.properties[0].access_type == 1 &&
              <Text style={styles.scheduleText}>Always</Text>}
            </View>
          </View>
        </View> 
        :
        <View style={styles.scheduleContainer}>
          <Text style={styles.offlineText}>Device Offline</Text>
        </View>
        } 

        <View style={styles.col}>
          <Text style={{ fontSize: 23, fontWeight: "bold", color: "#353535" }}>
            Actions
          </Text>

          <View style={[styles.lineContainer, { marginTop: 10 }]} />
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <TouchableOpacity onPress={() => handleClick("lock")}>
              <View
                style={[
                  styles.button,
                  { backgroundColor: toggledOn == true ? "#5bd3ff" : "#f5f5f5" },
                ]}
              >
                <Text
                  style={{ fontWeight: "bold", color: "black", fontSize: 30 }}
                >
                  Lock
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleClick("unlock")}>
              <View
                style={[
                  styles.button,
                  { backgroundColor: toggledOn == true ? "#f5f5f5" : "#5bd3ff" },
                ]}
              >
                <Text
                  style={{ fontWeight: "bold", color: "black", fontSize: 30 }}
                >
                  Unlock
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: "#60B8FF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    width: 160,
    height: 70,
  },
  appbar: {
    marginTop: 10,
    paddingBottom: 0,
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  title: {
    marginTop: 10,
    marginBottom: 20,
  },
  row: {
    marginTop: 10,
    flexDirection: "row",
  },
  col: {
    flexDirection: "column",
    alignSelf: "stretch",
  },
  card: {
    height: 150,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",

    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 5,
    shadowRadius: 20.41,
    borderBottomWidth: 3,
    borderBottomColor: "#a8a8a8",
    elevation: 3,
    marginBottom: 20,
  },
  scheduleContainer: {
    height: 180,
    width: 330,
    
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
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
    marginBottom: 20,
  },
  scheduleRow: {
    backgroundColor: "#FFFFFF",
    justifyContent: 'space-between',
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: 60,
    borderRadius:15
  },
  scheduleDataCont: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15
  },
  scheduleText: {
    fontSize: 18
  },
  offlineText: {
    fontSize: 28,
    alignSelf: "center",
    paddingTop: 60
  },
  icons: {
    marginLeft: 10,
  },
  lineContainer: {
    backgroundColor: "#c3c3c3",
    height: 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
});

export default DeviceControlScreen;

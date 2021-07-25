import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// if issues arise in this card, change DeviceProps to pass in entire Properties array instead of [0]
// Sengled Light:
// deviceProps[0] => slider props
// deviceProps[1] => bool props
const SetScheduleCard = (props) => {
  const [startDate, setStartDate] = useState("None");
  const [endDate, setEndDate] = useState("None");
  const [reoccuring, setReoccuring] = useState("Not Reoccuring");
  const [reoccuringDays, setReoccuringDays] = useState("None");
  const [timeStart, setTimeStart] = useState("None");
  const [timeEnd, setTimeEnd] = useState("None");

  const [gpsLocation, setGpsStatus] = useState(false);

  useEffect(() => {
    // console.log("setScheduleCard: ", props);
    if (props.deviceProperties == null) {
      return;
    }

    if (props.deviceProperties.date_start != null) {
      if (props.deviceProperties.date_start != "") {
        setStartDate(props.deviceProperties.date_start);
      }
    }
    if (props.deviceProperties.date_end != null) {
      if (props.deviceProperties.date_end != "") {
        setEndDate(props.deviceProperties.date_end);
      }
    }

    if (props.deviceProperties.reoccuring_type != null) {
      if (props.deviceProperties.reoccuring_type == "0") {
        setReoccuring("Not Reoccuring");
      }
      if (props.deviceProperties.reoccuring_type == "1") {
        setReoccuring("Weekly");
      }
      if (props.deviceProperties.reoccuring_type == "2") {
        setReoccuring("Bi-Weekly");
      }
    }

    if (props.deviceProperties.days_reoccuring != null) {
      // TODO: loop thru array and find days
      setReoccuringDays("Mon, Tu");
    }

    if (props.deviceProperties.time_start != null) {
      if (props.deviceProperties.time_start != "") {
        setTimeStart(props.deviceProperties.time_start);
      }
    }
    if (props.deviceProperties.time_end != null) {
      if (props.deviceProperties.time_end != "") {
        setTimeEnd(props.deviceProperties.time_end);
      }
    }
  }, [props]);

  return (
    <View
      style={{
        height: 150,
        marginTop: 10,
        backgroundColor: "white",
        borderRadius: 10,
        flexDirection: "row",
      }}
    >
      <View style={styles.contentContainer}>
        <View style={styles.contentRow}>
          <Icon name="schedule" size={25} style={styles.icons} />
          <Text style={styles.font}>
            {reoccuringDays} / {timeStart} - {timeEnd}
          </Text>
        </View>
        <View style={styles.contentRow}>
          <Icon name="replay" size={25} style={styles.icons} />
          <Text style={styles.font}>{reoccuring}</Text>
        </View>
        <View style={styles.contentRow}>
          <Icon name="date-range" size={25} style={styles.icons} />
          <Text style={styles.font}>
            {startDate} - {endDate}
          </Text>
        </View>
      </View>
      <View style={{ flexGrow: 0, flexBasis: 85 }}>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("SetScheduleScreen", {
              deviceProperties: props.deviceProperties,
              accObject: props.accObject,
              navigation: props.navigation,
              idToken: props.idToken,
            })
          }
          style={styles.editButton}
        >
          <Text style={{ fontSize: 25, color: "white" }}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SetScheduleCard;

const styles = StyleSheet.create({
  editButton: {
    backgroundColor: "#44ABFF",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    borderRadius: 12,
    elevation: 4,
  },
  contentContainer: {
    flexDirection: "column",
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 12,
  },
  contentRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  icons: {
    flexBasis: 50,
    marginLeft: 10,
  },
  font: {
    fontSize: 16,
  },
});

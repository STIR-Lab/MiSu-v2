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
  const [reoccuringDays, setReoccuringDays] = useState("");
  const [timeStart, setTimeStart] = useState("None");
  const [timeEnd, setTimeEnd] = useState("None");
  const [accessType, setAccessType] = useState(0);

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

    if (props.deviceProperties.access_type != null) {
      setAccessType(props.deviceProperties.access_type);
    }

    if (props.deviceProperties.reoccuring_type != null) {
      if (props.deviceProperties.reoccuring_type == 0) {
        setReoccuring("Not Reoccuring");
      }
      if (props.deviceProperties.reoccuring_type == 1) {
        setReoccuring("Weekly");
      }
      if (props.deviceProperties.reoccuring_type == 2) {
        setReoccuring("Bi-Weekly");
      }
    }

    if (props.deviceProperties.days_reoccuring != null) {
      // console.log(props.deviceProperties.access_type);
      let daysOfWeek = "";
      if (props.deviceProperties.days_reoccuring[0]) daysOfWeek += "Sun, ";
      if (props.deviceProperties.days_reoccuring[1]) daysOfWeek += "Mon, ";
      if (props.deviceProperties.days_reoccuring[2]) daysOfWeek += "Tues, ";
      if (props.deviceProperties.days_reoccuring[3]) daysOfWeek += "Wed, ";
      if (props.deviceProperties.days_reoccuring[4]) daysOfWeek += "Thurs, ";
      if (props.deviceProperties.days_reoccuring[5]) daysOfWeek += "Fri, ";
      if (props.deviceProperties.days_reoccuring[6]) daysOfWeek += "Sat, ";
      daysOfWeek = daysOfWeek.slice(0, -2);
      setReoccuringDays(daysOfWeek);
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
        height: 200,
        marginTop: 10,
        backgroundColor: "white",
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
      }}
    >
      <View style={styles.contentContainer}>
        <View style={styles.contentRow}>
          <Icon name="schedule" size={25} style={styles.icons} />
          <View style={styles.scheduleDataCont}>
            {reoccuringDays != "" && (
              <Text style={styles.font}>{reoccuringDays}</Text>
            )}
            {timeStart != "None" && timeEnd != "None" ? (
              <Text style={styles.font}>
                {timeStart.slice(0, -3)} - {timeEnd.slice(0, -3)}
              </Text>
            ) : accessType == 0 ? (
              <Text style={styles.font}>Never</Text>
            ) : (
              <Text style={styles.font}>All Day</Text>
            )}
          </View>
        </View>
        <View style={styles.contentRow}>
          <Icon name="replay" size={25} style={styles.icons} />
          <Text style={styles.font}>{reoccuring}</Text>
        </View>
        <View style={styles.contentRow}>
          <Icon name="date-range" size={25} style={styles.icons} />
          {accessType == 0 ? (
            <Text style={styles.font}>Never</Text>
          ) : accessType == 1 ? (
            <Text style={styles.font}>Always</Text>
          ) : (
            <Text style={styles.font}>
              {startDate} - {endDate}
            </Text>
          )}
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
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    elevation: 4,
  },
  contentContainer: {
    justifyContent: "center",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    width: 200
  },
  icons: {
    flexBasis: 50,
    marginLeft: 10,
  },
  font: {
    fontSize: 16,
  },
  scheduleDataCont: {
    flexDirection: "column"
  },
});

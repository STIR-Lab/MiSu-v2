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
  const [reoccuring, setReoccuring] = useState("Reoccuring not initiated");
  const [tempTimeStart, setTimeStart] = useState("None");
  const [tempTimeEnd, setTimeEnd] = useState("None");

  const [gpsLocation, setGpsStatus] = useState(false);

  useEffect(() => {
    // console.log("setScheduleCard: " + JSON.stringify(props.deviceProperties));
    if (props.deviceProperties == null) {
      return;
    }

    if (props.deviceProperties.time_range_start_date != "")
      setStartDate(props.deviceProperties.time_range_start_date);
    if (props.deviceProperties.time_range_end_date != "")
      setEndDate(props.deviceProperties.time_range_end_date);
    if (props.deviceProperties.time_range_reoccuring != "")
      setReoccuring(props.deviceProperties.time_range_end_date);
    if (props.deviceProperties.temp_time_range_start != "")
      setTimeStart(props.deviceProperties.temp_time_range_start);
    if (props.deviceProperties.temp_time_range_end != "")
      setTimeEnd(props.deviceProperties.temp_time_range_end);
    //
    if (props.deviceProperties.gps_location != null) setGpsStatus(true);
  }, []);

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
            {tempTimeStart} - {tempTimeEnd}
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
          onPress={() => props.navigation.navigate("SetScheduleScreen")}
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

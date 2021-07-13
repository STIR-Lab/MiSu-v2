import React, { useState, useEffect } from "react";
import {
  Button,
  Switch,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import MiSuv2 from "../../assets/MISUv2.png";
import { Avatar, Chip } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import xtype from "xtypejs";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
//const weekdays = ['Monday', 'Tuesday', 'Wednesday', "Thursday", "Friday", "Saturday", "Sunday"];

//Import Header Component
import Header from "../../components/app/Header.js";

const SetScheduleScreen = () => {
  return (
    <View style={styles.screen}>
      {/* <Header title="Set Schedule" /> */}
      <View style={styles.info}>
        <NameBadge name="John Smith" />
        <PropertyBadge property="On/Off" />
      </View>
      <View style={styles.setTime}>
        <WeekDays />
        <AllDay />
        <StartTime />
        <StartDate />
        <EndTime />
        <EndDate />
      </View>
      <View style={styles.setRepeat}>
        <Button title="Save" />
      </View>
    </View>
  );
};

const NameBadge = ({ name }) => {
  return (
    <View style={styles.nameChip}>
      <Image
        style={styles.nameBadge}
        source={require("../../assets/icons/user.png")}
      />
      <Text style={styles.nameText}> {name}</Text>
    </View>
  );
};

const PropertyBadge = ({ property }) => {
  return (
    <View style={styles.propertyChip}>
      <Image
        style={styles.propertyBadge}
        source={require("../../assets/icons/user.png")}
      />
      <Text style={styles.propertyText}> {property}</Text>
    </View>
  );
};

const WeekDays = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState([
    { label: "All", value: "All" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
    { label: "Sunday", value: "Sunday" },
  ]);
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <View style={styles.time}>
      <Text style={styles.timeText}>Week Days</Text>
      <DropDownPicker
        placeholder="Select Days"
        style={styles.picker}
        multiple={true}
        min={0}
        max={7}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        open={open}
        value={value}
        containerStyle={{
          width: 170,
          borderColor: "white",
        }}
        selectedItemContainerStyle={{
          backgroundColor: "#5F9EE950",
        }}
      />
    </View>
  );
};

// AllDay swtich component

const AllDay = () => {
  return (
    <View style={styles.time}>
      <Text style={styles.timeText}>All Day</Text>
      <Switch style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }} />
    </View>
  );
};

// Start Time component
// Button calls time picker

const StartTime = () => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [time, setTime] = useState(null);

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (startTime) => {
    console.warn("A time has been picked: ", startTime);
    setTime(
      startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
    console.log(xtype.type(time));
    hideTimePicker();
  };

  return (
    <View style={styles.time}>
      <Text style={styles.timeText}>Start Time</Text>
      <Button title="Start Time" onPress={showTimePicker} />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
      />
    </View>
  );
};

// End Time component
// Button calls end time picker

const EndTime = () => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (time) => {
    console.warn("A time has been picked: ", time);
    hideTimePicker();
  };

  return (
    <View style={styles.time}>
      <Text style={styles.timeText}>End Time</Text>
      <Button title="End Time" onPress={showTimePicker} />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
      />
    </View>
  );
};

// set  Start Date component

const StartDate = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A time has been picked: ", date);
    hideDatePicker();
  };
  return (
    <View style={styles.time}>
      <Text style={styles.timeText}>Start Date</Text>
      <Button title="Start Date" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const EndDate = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A time has been picked: ", date);
    hideDatePicker();
  };
  return (
    <View style={styles.time}>
      <Text style={styles.timeText}>End Date</Text>
      <Button title="End Date" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

/*
  const Repeat = () => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState([
      {label: 'Indefinetly', value: 'Indefinetly'},
      {label: 'One-Time', value: 'One-Time'},
      {label: 'Weekly', value: 'Weekly'},
      {label: 'Bi-Weekly', value: 'Bi-Weekly'},
      {label: 'Monthly', value: 'Monthly'},

    ]);
    return(
      <View>
        <DropDownPicker 
                        placeholder="Select Days"
                        style={styles.picker}  
                        containerStyle={{
                               width: 170,
                               borderColor: "white"
                        }}
                        selectedItemContainerStyle={{
                              backgroundColor: "#5F9EE950"
                        }}/>
      </View>
    )
  }
  */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    width: "100%",
  },

  info: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "space-between",
    marginRight: 55,
    marginLeft: 55,
    flex: 0.15,
    alignItems: "flex-end",
    alignSelf: "stretch",
    paddingBottom: 15,
  },
  setTime: {
    flex: 1,
    flexDirection: "column",
  },
  time: {
    flexDirection: "row",
    paddingTop: 13,
    padding: 12,
    paddingRight: 20,
    justifyContent: "space-between",
    alignItems: "center",

    width: "100%",
  },
  timeText: {
    paddingLeft: 100,
    fontSize: 14,
    fontWeight: "bold",
  },
  picker: {
    paddingLeft: 10,
    borderColor: "white",
    elevation: 6,
    width: 170,
    height: 40,
  },
  setRepeat: {
    backgroundColor: "transparent",
    flex: 0.15,
  },
  badges: {
    backgroundColor: "cyan",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameChip: {
    backgroundColor: "white",
    borderRadius: 500,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 170,
    height: 50,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  nameBadge: {
    marginLeft: 3,
    height: 35,
    width: 35,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "900",
    marginRight: 10,
  },
  propertyChip: {
    backgroundColor: "#44ABFF",
    borderRadius: 500,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 50,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },

  propertyBadge: {
    marginRight: 2,
    height: 35,
    width: 35,
    tintColor: "white",
  },
  propertyText: {
    fontSize: 17,
    color: "white",
    fontWeight: "bold",
  },
  switch: {},
});

export default SetScheduleScreen;

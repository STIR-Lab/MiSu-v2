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
import { Icon } from "react-native-elements";

//Import Header Component
import Header from "../../components/app/Header.js";

const SetScheduleScreen = (props) => {
  const [name, setName] = useState("User");
  const [endDate, setEndDate] = useState(null);
  const [accessType, setAccessType] = useState("Off");
  const [accessDigit, setAccessDigit] = useState("0");
  const [allDay, setAllDay] = useState(false);

  // Start Time
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [startTime, setStartTime] = useState(null);
  // End Time
  const [endTime, setEndTime] = useState(null);
  // Start Date
  const [startDate, setStartDate] = useState(null);
  // Week Days
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

  function handleSave() {
    editProperties();
    props.navigation.pop();
  }

  // console.log("SET SCHEDULE", props)

  function handleAccessType() {
    if (accessType === "Off") {
      setAccessType("On");
      setAccessDigit("10");
      return;
    }
    if (accessType === "On") {
      setAccessType("Schedule");
      setAccessDigit("2");
      return;
    }
    if (accessType === "Schedule") {
      setAccessType("Off");
      setAccessDigit("0");
      return;
    }
  }

  async function editProperties() {
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
          account: props.route.params.accObject.login_credentials_id,
          device:
            props.route.params.deviceProperties.shared_device_properties_id,
          shared_property_id:
            props.route.params.deviceProperties.shared_property_id,
          geofencing: props.route.params.deviceProperties.geofencing,
          access_type: accessDigit,
          all_day: allDay ? "1" : "0",
          time_start: startTime,
          time_end: endTime,
          date_start: startDate,
          date_end: endDate,
          reoccuring: null,
          reoccuring_type: "0",
        }),
      }
    );
  }

  useEffect(() => {
    if (props.route.params.deviceProperties == null) {
      return;
    }
    var deviceProperties = props.route.params.deviceProperties;
    // console.log(
    //   "==========setScheduleScreen==========" +
    //     JSON.stringify(props.route.params)
    // );

    if (props.route.params.accObject.name != null) {
      setName(props.route.params.accObject.name);
    }

    if (deviceProperties.date_start != null) {
      if (deviceProperties.date_start != "") {
        setStartDate(deviceProperties.date_start);
      }
    }
    if (deviceProperties.date_end != null) {
      if (deviceProperties.date_end != "") {
        setEndDate(deviceProperties.date_end);
      }
    }
    if (deviceProperties.time_all_day != null) {
      if (deviceProperties.time_all_day != "") {
        if (deviceProperties.time_all_day == "1") {
          console.log("Setting allday true");
          setAllDay(true);
        }
      }
    }
    if (deviceProperties.access_type != null) {
      if (deviceProperties.access_type != "") {
        if (deviceProperties.access_type == "1") {
          setAccessType("On");
          setAccessDigit("1");
        }
        if (deviceProperties.access_type == "2") {
          setAccessType("Schedule");
          setAccessDigit("2");
        }
      }
    }
  }, []);

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
      <TouchableOpacity onPress={() => handleAccessType()}>
        <View style={styles.propertyChip}>
          <Image
            style={styles.propertyBadge}
            source={require("../../assets/icons/user.png")}
          />
          <Text style={styles.propertyText}> {accessType}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const WeekDays = () => {
    return (
      <View style={styles.time}>
        <Text style={styles.timeText}>Week Days</Text>
        <DropDownPicker
          zIndex={10000}
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
          modalContentContainerStyle={{ zIndex: 100000 }}
          dropDownContainerStyle={{
            zIndex: 100000,
            borderWidth: 0,
          }}
          containerStyle={{
            width: 170,
            borderColor: "white",

            zIndex: 100000,
          }}
          selectedItemContainerStyle={{
            backgroundColor: "#5F9EE950",
            zIndex: 100000,
          }}
        />
      </View>
    );
  };

  // AllDay swtich component
  const AllDay = (props) => {
    return (
      <View style={styles.time}>
        <Text style={styles.timeText}>All Day</Text>
        <Switch
          thumbColor={allDay ? "#7DEA7B" : "white"}
          trackColor={{ false: "#767577", true: "#caedca" }}
          value={allDay}
          onValueChange={(val) => {
            setAllDay(val);
          }}
          style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
        />
      </View>
    );
  };

  // Start Time component
  // Button calls time picker

  const StartTime = () => {
    const showTimePicker = () => {
      setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
      setTimePickerVisibility(false);
    };

    const handleConfirm = (startTime) => {
      console.warn("A start time has been picked: ", startTime);
      setStartTime(
        startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
      console.log(xtype.type(startTime));
      hideTimePicker();
    };

    return (
      <View style={styles.time}>
        <Text style={styles.timeText}>Start Time</Text>
        <TouchableOpacity
          onPress={showTimePicker}
          title="Start Time"
          style={styles.timeBtn}
        >
          <Text style={styles.timeBtnText}>
            {startTime == null ? "Set Time!" : startTime}
          </Text>
        </TouchableOpacity>
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

    const handleConfirm = (endTime) => {
      console.warn("A end time has been picked: ", endTime);
      setEndTime(
        endTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );

      hideTimePicker();
    };

    return (
      <View style={styles.time}>
        <Text style={styles.timeText}>End Time</Text>

        <TouchableOpacity
          onPress={showTimePicker}
          title="Start Time"
          style={styles.timeBtn}
        >
          <Text style={styles.timeBtnText}>
            {endTime == null ? "Set Time!" : endTime}
          </Text>
        </TouchableOpacity>

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

    const handleConfirm = (startDate) => {
      console.warn("A time has been picked: ", startDate);
      setStartDate(startDate.toLocaleDateString());
      hideDatePicker();
    };
    return (
      <View style={styles.time}>
        <Text style={styles.timeText}>Start Date</Text>
        <TouchableOpacity style={styles.dateBtn} onPress={showDatePicker}>
          <Text style={styles.dateBtnText}>
            {startDate == null ? "Set Start" : startDate}
          </Text>
          <View style={styles.dateIcon}>
            <Icon name="calendar" type="feather" size={31} color="white" />
          </View>
        </TouchableOpacity>

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

    const handleConfirm = (endDate) => {
      console.warn("A time has been picked: ", endDate);
      setEndDate(endDate.toLocaleDateString());
      hideDatePicker();
    };
    return (
      <View style={styles.time}>
        <Text style={styles.timeText}>End Date</Text>

        <TouchableOpacity style={styles.dateBtn} onPress={showDatePicker}>
          <Text style={styles.dateBtnText}>
            {endDate == null ? "Set End" : endDate}
          </Text>
          <View style={styles.dateIcon}>
            <Icon name="calendar" type="feather" size={31} color="white" />
          </View>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      {/* <Header title="Set Schedule" /> */}
      <View style={styles.info}>
        <NameBadge name={name} />
        <PropertyBadge />
      </View>
      <View style={styles.setTime}>
        <WeekDays />
        <AllDay val={allDay} zIndex={-1000} />
        <StartTime />
        <StartDate />
        <EndTime />
        <EndDate />
      </View>

      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveBtn} onPress={() => handleSave()}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
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
    flex: 0.78,
    flexDirection: "column",
    width: "95%",
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
    paddingLeft: 60,
    fontSize: 14,
    fontWeight: "bold",
  },
  picker: {
    paddingLeft: 10,
    borderColor: "white",
    elevation: 6,
    width: 170,
    height: 40,
    zIndex: 10000,
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
  timeBtn: {
    backgroundColor: "white",
    width: 110,
    height: 45,
    elevation: 10,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: -10000,
  },
  timeBtnText: {
    fontSize: 22,
    zIndex: -10000,
  },
  dateBtn: {
    backgroundColor: "white",
    width: 160,
    height: 45,
    elevation: 10,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  dateIcon: {
    backgroundColor: "#44ABFF",
    width: "25%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },
  dateBtnText: {
    width: "75%",
    height: "60%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 20,
  },
  saveBtn: {
    width: "25%",
    height: 50,
    backgroundColor: "#44ABFF",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
  saveText: {
    fontSize: 20,
    color: "white",
  },

  saveContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});

export default SetScheduleScreen;

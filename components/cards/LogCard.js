import React, { useState, useEffect } from "react";
import { TouchableOpacity, TextInput } from "react-native";
import { View, StyleSheet, Text, Image } from "react-native";
import appStyle from "../../styles/AppStyle"; // Remove soon to new CSS file
import LogStyle from "../../styles/LogStyle";
import AppHeaderText from "../app/AppHeaderText";
import LogEntry from "./ListEntries/LogEntry";
import Modal from "react-native-modal";
import Collapsible from "react-native-collapsible";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
{
  /* 
Props [access] {
    "date": "2/16/2021",
    "operation": "Accept",
    "primary_user": "Mamtaj Akter1",
    "time": "8:57:36 PM",
  }
*/
}

function LogCard(props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isGuestsVisible, setIsGuestsVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [collapsedGuests, setCollapsedGuests] = useState(true);
  const [guestToMap, setGuestToMap] = useState(null);
  const [filterSel, setFilterSel] = useState("None");
  const [truePersonFil, setTruePersonFil] = useState("");

  useEffect(() => {
    if (props.type == "Access") {
      const key = "primary_user";

      const arrayUniqueByKey = [
        ...new Map(props.logs.map((item) => [item[key], item])).values(),
      ];

      // console.log("NEW ARRAY", arrayUniqueByKey);
      setGuestToMap(arrayUniqueByKey);
    } else {
      const key = "secondary_user";

      const arrayUniqueByKey = [
        ...new Map(props.logs.map((item) => [item[key], item])).values(),
      ];

      // console.log("NEW ARRAY", arrayUniqueByKey);
      setGuestToMap(arrayUniqueByKey);
    }
  }, [props.logs]);

  // console.log("LOG CARD", props)
  const openModal = () => {
    // setSelected(false);

    setIsVisible(!isVisible);
  };

  const alterDevices = () => {
    setCollapsed(!collapsed);
  };

  const alterGuests = () => {
    // console.log("YOU PRESSED THE DROP DOWN", guestToMap);
    setCollapsedGuests(!collapsedGuests);
  };

  let modal2 = (
    <Modal
      isVisible={isVisible}
      transparent={true}
      onBackdropPress={() => setIsVisible(false)}
      backdropColor={"#00000090"}
      hasBackdrop={true}
      backdropOpacity={10}
    >
      <View style={styles.addGuestmodal}>
        <View style={styles.addGuestHeader}>
          <Text style={{ marginLeft: 0, fontSize: 20, fontWeight: "bold" }}>
            Filter
          </Text>
        </View>

        {props.type === "Activity" && (
          <View>
            <View style={styles.textHeader}>
              <Icon name="codesandbox" type="feather" color="black" />
              <Text style={styles.textHeader}>Devices</Text>
            </View>

            <View style={styles.filterheader}>
              <Text style={styles.middleText}>None</Text>

              <TouchableOpacity
                style={styles.dropDownButtom}
                onPress={alterDevices}
              >
                <Icon name="chevron-down" type="feather" color="white" />
              </TouchableOpacity>
            </View>

            {props.logs.map((entry, i) => (
              <Collapsible
                collapsed={collapsed}
                style={styles.expanded}
                key={i}
              >
                <View style={styles.input}>
                  <Text>
                    {" "}
                    {props.type == "Access" ? entry.device_name : "TODO"}{" "}
                  </Text>
                </View>
              </Collapsible>
            ))}
          </View>
        )}

        <View style={styles.textHeader}>
          <Icon name="users" type="feather" color="black" />
          {props.type === "Access" ? (
            <Text style={styles.textHeader}>Home Owners</Text>
          ) : (
            <Text style={styles.textHeader}>Guests</Text>
          )}
        </View>
        <View style={styles.filterheader}>
          <Text style={styles.middleText}>{filterSel}</Text>

          <TouchableOpacity style={styles.dropDownButtom} onPress={alterGuests}>
            <Icon name="chevron-down" type="feather" color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView>
          {guestToMap != null &&
            guestToMap.map((entry, i) => (
              <TouchableOpacity
                key={i}
                onPress={() =>
                  props.type === "Access"
                    ? setFilterSel(entry.primary_user)
                    : setFilterSel(entry.secondary_user)
                }
              >
                <Collapsible
                  collapsed={collapsedGuests}
                  style={styles.expanded}
                >
                  <View style={styles.input}>
                    <Text>
                      {props.type === "Access"
                        ? entry.primary_user
                        : entry.secondary_user}
                    </Text>
                  </View>
                </Collapsible>
              </TouchableOpacity>
            ))}
        </ScrollView>

        <TouchableOpacity onPress={() => setTruePersonFil(filterSel)}>
          <View style={styles.submitButton}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 22,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Apply
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => openModal()}>
          <View style={styles.button}>
            <Icon name="sliders" type="feather" color="#008CFF" />
            <Text style={{ marginLeft: 8 }}>Filter</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View>
        {/* Need function to seperate by time */}
        {props.logs && props.type == "Access"
          ? props.logs
              .filter((guest) => guest.primary_user.includes(truePersonFil))
              .map((entry, index) => {
                return <LogEntry log={entry} key={index} />;
              })
          : props.logs
              .filter((guest) => guest.secondary_user.includes(truePersonFil))
              .map((entry, index) => {
                return <LogEntry log={entry} key={index} />;
              })}

        {modal2}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    height: 50,
    width: 100,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    fontWeight: "bold",
    flexDirection: "row",
  },

  middleText: {
    alignItems: "center",
    alignSelf: "center",
    marginLeft: 0,
    marginTop: 13,
  },
  buttonContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  expanded: {
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    width: 255,
    height: 40,
  },
  modal: {
    backgroundColor: "#F1F1F1",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    width: 300,
    height: 500,
    alignSelf: "center",
    alignItems: "center",
  },
  addGuestmodal: {
    backgroundColor: "#F1F1F1",
    elevation: 6,
    borderRadius: 10,
    width: 300,
    maxHeight: 450,
    alignSelf: "center",
    alignItems: "center",
  },

  textHeader: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginLeft: 10,
    marginTop: 5,
    flexDirection: "row",
    fontWeight: "bold",
    fontSize: 14,
  },
  input: {
    alignSelf: "center",
    alignItems: "center",
  },

  addGuestHeader: {
    marginTop: 25,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  submitButton: {
    marginTop: 35,
    backgroundColor: "#289EFF",
    borderRadius: 10,
    marginBottom: 25,
    width: 120,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  filterheader: {
    alignSelf: "stretch",
    flexDirection: "column",
    borderRadius: 8,
    elevation: 5,
    backgroundColor: "#FFFFFF",
    paddingLeft: 0,
    height: 48,
    fontSize: 16,
    marginTop: 21,
    marginHorizontal: 20,
  },

  dropDownButtom: {
    backgroundColor: "#44ABFF",
    position: "absolute",
    right: 0,
    borderRadius: 8,
    height: "100%",
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default LogCard;

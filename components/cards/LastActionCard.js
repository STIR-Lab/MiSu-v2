import React, { useState, useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Icon } from "react-native-elements";

function LastActionCard(props) {
  // Will indicate whether this component is rendered in the devices or the guests screen
  const [screen, setScreen] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [selected, setSelected] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    // console.log("LastActionCard: " + JSON.stringify(props));
    if (props.lastAction != null && props.lastAction.length > 0) {
      setLastAction(props.lastAction[0]);
    }
  }, [props]);

  const checkIcon = (type) => {
    if (type == "lock") {
      return "lock";
    } else if (type == "unlock") {
      return "unlock";
    } else if (type == "script") {
      return "file-text";
    } else {
      return "zap";
    }
  };

  const checkIconScripts = (name) => {
    let temp = name.toLowerCase();
    if (temp.includes("bulb")) {
      return "lightbulb";
    } else if (name.includes("lock")) {
      return "lock";
    } else if (name.includes("unlock")) {
      return "unlock";
    } else {
      return "file";
    }
  };

  const checkColor = (action) => {
    if (action == "lock") {
      return "#57E455";
    } else if (action == "unlock") {
      return "#FF5722";
    } else return "black";
  };

  const checkColorScripts = (name) => {
    let temp = name.toLowerCase();
    if (temp.includes("lock") || temp.includes("turn on")) {
      return "#57E455";
    } else if (temp.includes("unlock") || temp.includes("turn off")) {
      return "#FF5722";
    } else return "black";
  };

  const capitalize = (string) => {
    if (string == null) return null;
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerStyle}>
        <Text style={styles.headerText}>Last Action</Text>
        <View style={styles.activityView}>
          <TouchableOpacity onPress={() => props.navigation.navigate("Logs")}>
            <Text style={styles.lastActivityText}>View Activity</Text>
          </TouchableOpacity>
        </View>
      </View>

      {lastAction != null && (
        <View style={styles.headerStyle}>
          {lastAction.device_action != null && (
            <React.Fragment>
              <View
                style={
                  // props.screen == "GuestCard"
                  true
                    ? [
                        styles.squareIconHolder,
                        { borderColor: checkColor(lastAction.device_action) },
                      ]
                    : styles.iconHolder
                }
              >
                <Icon
                  name={checkIcon(lastAction.device_action)}
                  type="feather"
                  size={32}
                  color={checkColor(lastAction.device_action)}
                />
              </View>
              {props.screen == "GuestCard" ? (
                <View>
                  <Text style={styles.text}>
                    {" "}
                    {capitalize(lastAction.device_action)}ed the{" "}
                    {lastAction.device_name}{" "}
                  </Text>
                  <Text style={styles.dateText}>
                    {" "}
                    {lastAction.date} at {lastAction.time}{" "}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.text}>
                    {" "}
                    {lastAction.secondary_user} {lastAction.device_action}ed the{" "}
                    {lastAction.device_name}{" "}
                  </Text>
                  <Text style={styles.dateText}>
                    {" "}
                    {lastAction.date} at {lastAction.time}{" "}
                  </Text>
                </View>
              )}
            </React.Fragment>
          )}

          {/* Handles scripts [completley different log type] */}
          {lastAction.device_action == null && (
            <React.Fragment>
              <View
                style={
                  props.screen == "GuestCard"
                    ? [
                        styles.squareIconHolder,
                        {
                          borderColor: checkColorScripts(
                            lastAction.device_name
                          ),
                        },
                      ]
                    : styles.iconHolder
                }
              >
                <Icon
                  name={checkIconScripts(lastAction.device_name)}
                  type="font-awesome-5"
                  size={32}
                  color={checkColorScripts(lastAction.device_name)}
                />
              </View>
              <View>
                <Text style={styles.text}>
                  {" "}
                  {capitalize(lastAction.device_name)}
                </Text>
                <Text style={styles.dateText}>
                  {" "}
                  {lastAction.date} at {lastAction.time}{" "}
                </Text>
              </View>
            </React.Fragment>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
  },

  iconHolder: {
    marginLeft: 27,
    backgroundColor: "green",
    borderRadius: 41,
    width: 50,
    height: 50,
    flexDirection: "row",
  },

  squareIconHolder: {
    marginLeft: 27,
    // backgroundColor: "green",
    borderRadius: 5,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 45,
    height: 45,
    flexDirection: "row",
  },

  text: {
    fontSize: 14,
    marginLeft: 7,
    color: "#515151",
    textAlign: "left",
  },

  dateText: {
    fontSize: 10,
    marginLeft: 8,
    marginTop: 5,
    marginBottom: 5,
    textAlign: "left",
    color: "#5E5E5E",
  },

  headerText: {
    fontWeight: "700",
    fontSize: 18,
    color: "#404040",
    padding: 15,
  },

  headerStyle: {
    flexDirection: "row",
    alignItems: "center",
  },

  lastActivityText: {
    textAlign: "center",
    fontSize: 12,
  },
  activityView: {
    position: "absolute",
    right: 15,
  },
});

export default LastActionCard;

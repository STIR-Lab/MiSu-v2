import React, { useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import appStyle from "../../styles/AppStyle"; // Remove soon to new CSS file
import LogStyle from "../../styles/LogStyle";
import AppHeaderText from "../app/AppHeaderText";
import LogEntry from "./ListEntries/LogEntry";

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

const LogCard = (props) => {
  return (
    <View>
      <Text style={LogStyle.rowLeft}>Today</Text>

      {/* Need function to seperate by time */}
      {props.logs
        ? props.logs.map((entry, index) => {
            return <LogEntry log={entry} key={index} />;
          })
        : null}

      <Text style={LogStyle.rowLeft}>This Week</Text>
    </View>
  );
};

export default LogCard;

import { Auth } from "aws-amplify";
import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { connect } from "react-redux";
import { getHubInfoAction } from "../../redux/Action/getHubInfoAction";
import { registerHubAction } from "../../redux/Action/registerHubAction";
import appStyle from "../../styles/AppStyle";
import LogCard from "../../components/cards/LogCard";
import AppText from "../../components/app/AppText";
import AppHeaderText from "../../components/app/AppHeaderText";

function LogScreen(props) {
  const isFocused = useIsFocused();
  const [usageLogs, setUsageLogs] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAccessLogs();
    getUsageLogs();

    console.log("LogScreen" + JSON.stringify(props));
  }, [props]);

  // Gets the logs for the devices the user has shared
  async function getUsageLogs() {
    console.log("Fetching usageLogs");
    await fetch(
      "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getusagelogs",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + props.sessionData.idToken,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        //console.log("%j", "Usage Logs", data.message);
        if (data.message.length > 0) {
          var sortedLogs = data.message.sort((a, b) =>
            a.date < b.date
              ? 1
              : a.date === b.date
              ? a.time < b.time
                ? 1
                : -1
              : -1
          );
          setUsageLogs(sortedLogs);
          setLoading(false);
          console.log("Successful usageLogs");
        }
      })
      .catch((error) => {
        //console.error('getUsageLogs error:', error);
        setError(error);
      });
  }

  // Gets the logs for the access which may have been granted or revoked to the user
  async function getAccessLogs() {
    console.log("Fetching accessLogs");
    await fetch(
      "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getaccesslogs",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + props.sessionData.idToken,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        //console.log("%j", "Access Logs", data.message);
        if (data.message.length > 0) {
          var sortedLogs = data.message.sort((a, b) =>
            a.date < b.date
              ? 1
              : a.date === b.date
              ? a.time < b.time
                ? 1
                : -1
              : -1
          );
          setAccessLogs(sortedLogs);
          setLoading(false);
          console.log("Successful accessLogs");
        }
      })
      .catch((error) => {
        //console.error('getAccessLogs error:', error);
        setError(error);
      });
  }

  const renderLogs = () => {
    if (props.hubInfoData.user_type == 1) {
      return <LogCard type="Activity" logs={usageLogs} />;
    } else {
      return <LogCard type="Access" logs={accessLogs} />;
    }
  };

  return (
    <View
      style={[
        appStyle.container,
        { alignItems: "stretch", marginHorizontal: -5 },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          style={appStyle.spinner}
          size="large"
          color="#5BD3FF"
        />
      ) : (
        <ScrollView style={appStyle.scrollView}>{renderLogs()}</ScrollView>
      )}
    </View>
  );
}

const mapStateToProps = (state) => {
  const { hubInfoData, sessionData, sharedAccountsData, registerData } = state;
  return { hubInfoData, sessionData, sharedAccountsData, registerData };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (data, idToken) => dispatch(registerHubAction(data, idToken)),
    getHub: (idToken) => dispatch(getHubInfoAction(idToken)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogScreen);

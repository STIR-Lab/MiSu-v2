import { Auth } from "aws-amplify";
import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, ScrollView, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { getHubInfoAction } from "../../redux/Action/getHubInfoAction";
import { registerHubAction } from "../../redux/Action/registerHubAction";
import appStyle from "../../styles/AppStyle"; // Soon to be removed
import LogStyle from "../../styles/LogStyle";
import LogCard from "../../components/cards/LogCard";
import AppText from "../../components/app/AppText";
import AppHeaderText from "../../components/app/AppHeaderText";

function LogScreen(props) {
  const [usageLogs, setUsageLogs] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [errors, setError] = useState([]);

  // Sets the usage logs
  useEffect(() => {
    let requestPending = true;

    fetch(
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
        //console.log('%j', 'Usage Logs', data.message);
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
          if (requestPending) {
            setUsageLogs(sortedLogs);
          }
        }
      })
      .catch((error) => {
        console.error("getUsageLogs error:", error);
        setError(error);
      });
    return () => {
      requestPending = false;
    };
  }, []);

  // Sets the access logs
  useEffect(() => {
    let requestPending = true;

    fetch(
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
        //console.log('%j', 'Access Logs', data.message);
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
          if (requestPending) {
            setAccessLogs(sortedLogs);
          }
        }
      })
      .catch((error) => {
        console.error("getAccessLogs error:", error);
        setError(error);
      });
    return () => {
      requestPending = false;
    };
  }, []);

  const renderLogs = () => {
    if (usageLogs.length > 0 && accessLogs <= 0) {
      return <LogCard type="Activity" logs={usageLogs} />;
    } else if (accessLogs.length > 0 && usageLogs <= 0) {
      return <LogCard type="Access" logs={accessLogs} />;
    } else if (accessLogs.length > 0 && usageLogs > 0) {
      return (
        <View>
          <LogCard type="Activity" logs={usageLogs} />
          <LogCard type="Access" logs={accessLogs} />
        </View>
      );
    } else
      return (
        <View>
          <AppHeaderText style={{ fontSize: 18, marginLeft: 10 }}>
            Loading...
          </AppHeaderText>
        </View>
      );
  };

  return (
    <View style={LogStyle.container}>
      <View>
        <ScrollView>{renderLogs()}</ScrollView>
      </View>
    </View>
  );
}

// LogScreen.navigationOptions = (navigation) => ({
//   headerTitle: navigation.navigation.getParam('device', '').name,
// });

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

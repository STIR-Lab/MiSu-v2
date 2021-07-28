import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { shareAction } from "../../../redux/Action/shareAction";
import UserAvatar from "react-native-user-avatar";
import { Avatar, Badge, withBadge } from "react-native-elements";

const NotificationsList = (props) => {
  const [userData, setUserData] = useState([]);
  //const [data, setData] = useState(["nada"]);
  //console.log("NotList: " + JSON.stringify(props));
  //const [response, setResponse] = useState("");

  useEffect(() => {
    setUserData(props.data);
    // console.log("==Noti List Props==" + JSON.stringify(props));
  }, [props]);

  async function handleResponse(answer, id, bearer) {
    const state = await fetch(
      "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/invitation",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + bearer,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: id,
          accepted: answer,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        props.Share("ds", "sd", "d", "sds", "s", "f", true);
        props.toggle();
      })
      .catch((err) => console.log(err));
  }

  const Item = ({ sharer_name, id }) => (
    <View style={styles.item} key={id}>
      <View style={styles.icon}>
        <UserAvatar size={45} borderRadius={30} name={sharer_name} />
      </View>

      <View>
        <Text style={styles.name}>{sharer_name}</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleResponse(1, id, props.bearer)}
        >
          <Icon name="check" size={45} color="#57E455" id={id} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleResponse(0, id, props.bearer)}
        >
          <Icon name="close" size={45} color="#F36464" id={id} />
        </TouchableOpacity>
      </View>
    </View>
  );
  const renderItems = userData.map((user, index) => {
    return (
      <Item
        sharer_name={user.sharer_name}
        id={user.login_credentials_id}
        key={user.login_credentials_id}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Requests</Text>
      {renderItems}
    </View>
  );
};

const mapStateToProps = (state) => {
  const {
    devicesData,
    sharedAccountsData,
    sessionData,
    shareState,
    AccessState,
  } = state;
  return {
    devicesData,
    sharedAccountsData,
    sessionData,
    shareState,
    AccessState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ModifyAccess: (title, value) => {
      dispatch(ModifyAccessStateAction(title, value));
    },
    Share: (
      idToken,
      email,
      device,
      accounts,
      properties,
      options,
      usedOnlyForRefreshing
    ) => {
      dispatch(
        shareAction(
          idToken,
          email,
          device,
          accounts,
          properties,
          options,
          usedOnlyForRefreshing
        )
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsList);

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 0.5,
    backgroundColor: "#F1F1F1",
    elevation: 12,
    borderRadius: 10,
    flexWrap: "wrap",
    paddingBottom: 15,
  },

  item: {
    backgroundColor: "white",
    marginTop: 5,
    flex: 0.3,
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
    elevation: 5,
  },
  buttons: {
    flexDirection: "row",

    flex: 1,
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    elevation: 4,
    marginRight: 13,
  },
  name: {
    fontSize: 23,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    margin: 15,
  },
  icon: {
    flexBasis: 65,
    alignItems: "center",
  },
});

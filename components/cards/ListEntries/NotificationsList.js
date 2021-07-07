import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Avatar, Badge, withBadge } from "react-native-elements";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    name: "Sam Smith",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    name: "Alex Ruiz",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    name: "Timmy Jones",
  },
];

const NotificationsList = () => {
  const [data, setData] = useState("");

  getInvites = async (idToken, account, acceptedVal) => {
    await fetch(
      "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/invitation",
      {
        method: "POST",
        header: {
          Authorization: "Bearer" + idToken,
          "Content-type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          account: account,
          accepted: acceptedVal,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => setData(data));
  };
  const Item = ({ name }) => (
    <View style={styles.item}>
      <View style={styles.icon}>
        <Icon name="account-circle" size={50} color="#ffcb5c" />
      </View>

      <View>
        <Text style={styles.name}>{name}</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button}>
          <Icon name="check" size={45} color="#57E455" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Icon name="close" size={45} color="#F36464" />
        </TouchableOpacity>
      </View>
    </View>
  );
  const renderItems = data.map((user) => {
    return <Item name={user.name} />;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hub Requests</Text>
      {renderItems}
    </View>
  );
};

export default NotificationsList;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 0.8,
    backgroundColor: "#F1F1F1",
    elevation: 12,
    borderRadius: 10,
  },

  item: {
    backgroundColor: "white",
    marginTop: 5,
    flex: 0.15,
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
    elevation: 7,
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
    fontSize: 35,
    textAlign: "center",
    margin: 15,
  },
  icon: {
    flexBasis: 65,
    alignItems: "center",
  },
});

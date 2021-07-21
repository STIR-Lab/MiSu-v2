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
import { Icon } from 'react-native-elements';
import appStyle from '../../styles/AppStyle';
import LastActionCard from '../../components/cards/LastActionCard';
//Import Header Component
import Header from "../../components/app/Header.js";

const GuestRemoveScreen = (props) => {
  const [deviceList, setDeviceList] = useState(props.route.params.user.devices);

    useEffect(() => {
        // console.log('==Guest Remove Screen== ', props.route.params.user);
        // console.log('==Guest Remove Screen DeviceList= ', props.route.params.user.devices);
      });
    return (
        <View style={appStyle.container}>
          <View style={styles.rowInformation}>
            <View style={styles.infoLine}>  
              <Text style={styles.name}>{props.route.params.user.name}</Text>         
            </View>
          </View>
          <View style={{width:"100%", maxHeight: 500}}>
            <ScrollView>
            {
              deviceList.map((entry, i) =>
              <View style={styles.deviceDisplay} key={i}>
                <View style={styles.devIcon2}>
                  <Icon name="lock" type="feather" size={45} />
                </View>
                <Text>{entry.name}</Text>
              </View>
              )
            }
            </ScrollView>
          </View>
          {/* <LastActionCard screen={'GuestCard'} /> */}
          <TouchableOpacity
            style={styles.redButton}
            onPress={() => console.log("TODO")}
          >
            <Text style={styles.redButtonText}>Revoke Access</Text>
          </TouchableOpacity>
        </View>
      );
  };

const styles = StyleSheet.create({
  name: {
      fontSize: 26,
      fontWeight: 'bold',
      marginLeft: 8,
    },
  rowInformation:{
      flexDirection: "row",
      height: 60,
      width: "100%",
      marginBottom: 5,
      justifyContent: "center",
      alignItems: "center"
  },
  infoLine: {
    flexDirection: "column", 
  },
  deviceDisplay: {
    borderBottomWidth: 1,
    borderBottomColor:"gray",
    height: 80,
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
  },
  devIcon2: {
    height: 46,
    width: 46,
    marginHorizontal: 15,
    borderRadius: 6,
  },
  redButton: {
    backgroundColor: '#ea5f5f',
    marginTop: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: "50%",
    shadowColor: '#000',
    shadowOffset: {
      width: 20,
      height: 5,
    },
    shadowOpacity: 0.9,
    shadowRadius: 2.62,
    borderWidth: 1.4,
    borderColor: '#cc9797',
    elevation: 6,
  },
  redButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default GuestRemoveScreen;
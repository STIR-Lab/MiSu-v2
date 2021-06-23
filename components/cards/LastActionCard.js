import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';

function LastActionCard(props) {
    // Will indicate whether this component is rendered in the devices or the guests screen
  const [screen, setScreen] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [selected, setSelected] = useState(false);
  const [actionList, setDeviceList] = useState({
    actions: [
      // Grab Device Name, Device Picture, And device Actions here. Determine what format the database has them in.
      {
        deviceName: 'Google Home',
        deviceActions: ['useAssitant', 'speaker'],
        time: '9:48 PM',
        day: 'Thurs',
        id: 1,
      },
 
    ],
  });

  // Have a Last Device Object
  // Passed directy from the caller
  // Fetched from an array, and then some logic is required to find the last action 
  // If DB has last action field, then just call it from there
  const [lastAction, setLastAction] = useState({
    action: 
      // Grab Device Name, Device Picture, And device Actions here. Determine what format the database has them in.
      {
        guest: 'Paul Smith',
        deviceName: 'Google Home',
        deviceActions: ['useAssitant', 'speaker'],
        time: '9:48 PM',
        day: 'Thurs',
        id: 1,
      },
  });


    return (
        <View style={styles.container}>
          <View style={styles.headerStyle}>
            <Text style = {styles.headerText}>Last Action</Text>
            <View style = {styles.activityView}>
              <Text style = {styles.lastActivityText}>View Activity</Text>
            </View>
          </View>
            
            <View style={styles.headerStyle}>
              <View style = {props.screen == 'GuestCard' ? styles.squareIconHolder : styles.iconHolder}>
              </View>
              <View>
                <Text style = {styles.text}> {props.screen == 'GuestCard' ? 'T' : lastAction.action.guest + ' t'}urned on {lastAction.action.deviceName} </Text>
                <Text style = {styles.dateText}> {lastAction.action.day} at {lastAction.action.time} </Text>
              </View>
            </View>
        </View>     
    );
}

const styles = StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: 15,
    },

    iconHolder: {
    marginLeft: 27,
    backgroundColor: 'green',
    borderRadius: 41,
    width: 50,
    height: 50,
    flexDirection: "row"
    },

    squareIconHolder: {
      marginLeft: 27,
      backgroundColor: 'green',
      borderRadius: 0,
      width: 50,
      height: 50,
      flexDirection: "row"
    }, 

    text: {
      fontSize: 14,
      marginLeft: 7, 
      color: "#515151", 
      textAlign: 'left'
    },

    dateText: {
      fontSize: 10, 
      marginLeft: 8, 
      marginTop: 5,
      marginBottom: 5, 
      textAlign: 'left',
      color: '#5E5E5E'
    }, 

    headerText: {
      fontWeight: '700',
      fontSize: 18,
      color: '#404040',
      padding: 15,
    },

    headerStyle:
    {
      flexDirection: "row",
      alignItems: "center",
      
    },
    
    lastActivityText:
    {
      textAlign: 'center',
      fontSize: 12,
      
    },
    activityView:
    {
      position: "absolute",
      right: 15,
    }
  });


export default LastActionCard;
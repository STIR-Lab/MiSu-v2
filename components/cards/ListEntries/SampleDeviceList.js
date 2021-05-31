import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';

function SampleDeviceList(props) {
    const [deviceList, setDeviceList] = useState({
        devices : [
            // Grab Device Name, Device Picture, And device Actions here. Determine what format the database has them in. 
            {deviceName: "Google Home", deviceActions: ["useAssitant", "speaker"], lastAction: "Tom used this", id:1},
            {deviceName: "Ring Doorbell", id:2},
            {deviceName: "Sengled Lightbulb", id:3},
            {deviceName: "Wyze Smart Camera", id:4}
        ]
    });

    return (
        <View style={styles.container}>
            {deviceList.devices.map((d) => 
                <Text key={d.id}>{d.deviceName}</Text>
            )}
        </View>     
    );
}

const styles = StyleSheet.create({
    container: {
 
    }
  });


export default SampleDeviceList;
import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, Text, Button} from 'react-native';
import Modal from 'react-native-modal';
import DeviceElement from '../../DeviceElement';
import GuestElement from '../../GuestElement';

function SampleDeviceList(props) {
    const [deviceList, setDeviceList] = useState({
        devices : [
            // Grab Device Name, Device Picture, And device Actions here. Determine what format the database has them in. 
            {deviceName: "Google Home", deviceActions: ["useAssitant", "speaker"], lastAction: "Tom used this", id:1},
            {deviceName: "Ring Doorbell", id:2},
            {deviceName: "Sengled Lightbulb", id:3},
            {deviceName: "Wyze Smart Camera", id:4},
            // {deviceName: "Schlate Smart Lock", id:5},
            // {deviceName: "Ring Doorbell", id:2},
            // {deviceName: "Sengled Lightbulb", id:3},
            // {deviceName: "Wyze Smart Camera", id:4},
            // {deviceName: "Schlate Smart Lock", id:5},
            // {deviceName: "Ring Doorbell", id:2},
            // {deviceName: "Sengled Lightbulb", id:3},
            // {deviceName: "Wyze Smart Camera", id:4},
            // {deviceName: "Schlate Smart Lock", id:5},
            // {deviceName: "Ring Doorbell", id:2},
            // {deviceName: "Sengled Lightbulb", id:3},
            // {deviceName: "Wyze Smart Camera", id:4},
            // {deviceName: "Schlate Smart Lock", id:5},
            // {deviceName: "Schlate Smart Lock", id:5},
        ]
    });

    // Will indicate whether this component is rendered in the devices or the guests screen
    const [screen, setScreen] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (props.screen == "Guests")
            setScreen("Guests");
        else if (props.screen == "Devices")
            setScreen("Devices");
        else
            console.log("Invalid screen prop passed.");
    });

    closeModal = () => {
        setIsVisible(!isVisible);
    }

    openModal = () => {
        setIsVisible(!isVisible);
    }

    let addButton = (
        <View style={styles.iconAndName}>
            <TouchableOpacity onPress={() => openModal()}>
                <View style={(screen == "Devices") ? styles.addGuest : styles.addDevice}/>
            </TouchableOpacity>
            <Text>{screen == "Devices" ? "Add Guest" : "Add Device"}</Text>
        </View>
    );

    let modal = (
        <Modal visible={isVisible} transparent={true} onBackdropPress={() => setIsVisible(false)}>
            <View style={styles.modal}>
                <Text>I am the modal</Text>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container} transparent={true}>
            {deviceList.devices.map((d) => 
                <View style={styles.iconAndName} key={d.id}>
                    <GuestElement deviceName={d.deviceName}/>
                </View>
            )}
            {addButton}
            {modal}
        </View>     
    );
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        width: "94%",
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",

    },
    iconHolder: {
        backgroundColor: "green",
        width: 70,
        height: 70
    },
    iconAndName: {
        backgroundColor: "transparent",
        marginVertical: 8,
        marginHorizontal: 10,
    },
    text: {
        fontSize: 10,
        width: 70,
        textAlign: "center"
    },
    addGuest: {
        backgroundColor: "#57E455",
        borderRadius: 41,
        width: 70,
        height: 70
    },
    addDevice: {
        backgroundColor: "#57E455",
        borderRadius: 5,
        width: 70,
        height: 70
    },
    modal: {
        backgroundColor: 'red',
        width: 300,
        height: 500,
        alignSelf: 'center',
        alignItems: 'center'
    }
  });


export default SampleDeviceList;
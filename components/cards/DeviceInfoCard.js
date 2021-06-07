import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text, TouchableWithoutFeedback } from 'react-native';
import Collapsible from 'react-native-collapsible';
import SampleDeviceList from '../../components/cards/ListEntries/SampleDeviceList';
import LastActionCard from '../../components/cards/LastActionCard';


function DeviceInfoCard(props) {
    const [expanded, setExpanded] = useState(true);

    const alter = () => {
        setExpanded(!expanded);
    }
    
    let list;
    if (props.type == "GuestCard")
        list = <SampleDeviceList />
    else
        list = <Text>Render Guests Here</Text>

    
    const panel = (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.devIcon}>

                </View>
                <View>
                    <Text>{props.title}</Text>
                </View>
                <TouchableOpacity
                        style={styles.dropDownButtom}
                        onPress={alter} >
                    <Text>A</Text>
                </TouchableOpacity>
            </View>
            <Collapsible collapsed={expanded} style={styles.expanded}>
                <View style={styles.activeGuests}>
                    <Text style={styles.text}>{props.type == "GuestCard" ? "Devices" : "Active Guests"}</Text>
                </View>
                <View style={styles.guestList}>
                    {list}
                </View>
                <LastActionCard/>
            </Collapsible>
        </View>);

    return (
        <View>
            <TouchableWithoutFeedback>
                {panel}
            </TouchableWithoutFeedback>
        </View>     
    );
}

const styles = StyleSheet.create({
    activeGuests: {
        alignContent: "center",
        padding: 15
    },
    text: {
        fontWeight: "700",
        fontSize: 18,
        color: "#404040"
    },
    container: {
        width: "100%",
        marginBottom: 15,
    },
    header: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        height: 80,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        flexDirection: 'row',
        alignItems: "center",
        shadowColor: '#000',
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 6
    },
    guestList: {
        width: "100%",
        backgroundColor: "white",
        alignItems: "center"
    },
    dropDownButtom: {
        backgroundColor: "#FFFFFF",
        position: "absolute",
        right: 0,
        borderTopRightRadius: 5,
        height: "100%",
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
        borderLeftWidth: .5
    },
    expanded: {
        backgroundColor: "#FFFFFF",
        // height: 300,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    devIcon: {
        backgroundColor: "#EEEEEE",
        height: 46,
        width: 46,
        marginHorizontal: 15,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#60B8FF"
    }
  });


export default DeviceInfoCard;
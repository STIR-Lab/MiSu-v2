import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SetScheduleCard = () => {
    return (
            <View
                  style={{
                    height: 150,
                    marginTop: 10,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    flexDirection: "row"
                  }}
            >
                  <View  style={styles.contentContainer}>
                    <View style={styles.contentRow}>
                        <Icon name="schedule" size={25} style={styles.icons}/>
                        <Text style={styles.font}>
                          Mon, Tues, Wed
                        </Text>
                    </View>
                    <View style={styles.contentRow}>
                      <Icon name="replay" size={25} style={styles.icons}/>
                      <Text style={styles.font}>Bi-Weekly</Text>
                    </View>
                    <View style={styles.contentRow}>
                        <Icon name="date-range" size={25} style={styles.icons}/>
                        <Text style={styles.font}>4/23/2021 - 5/31/2021</Text>
                    </View>
                  </View >
                  <View style = {{flexGrow: 0, flexBasis: 85}}>
                   
                   <TouchableOpacity style={styles.editButton}>
                     <Text style={{ fontSize: 25, color: "white"}}>Edit</Text>
                   </TouchableOpacity>
                  </View>
                 

            </View>
    )
}

export default SetScheduleCard

const styles = StyleSheet.create({
    editButton: {
        backgroundColor: "#44ABFF", 
        alignItems: "center", 
        justifyContent: "center", 
        height: "100%", 
        borderRadius: 12, 
        elevation: 4
    },
    contentContainer: {
        flexDirection: "column",
        flexGrow: 1,
        backgroundColor: 'white',
        borderRadius:12


    },
    contentRow: {
        flexDirection: "row",
        marginTop: 20
    },
    icons: {
        flexBasis:50,
        marginLeft: 15
    },
    font: {
        fontSize: 16
    }

})
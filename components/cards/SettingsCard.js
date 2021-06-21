import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

function SettingsCard(props) {

    return (
        <View style={styles.container}>
            <View style={styles.headerLine}>
                <Text style={styles.header}>Settings</Text>
                
            </View>
            <View style= {styles.setting} >
                <Text style={styles.settingFont}>Change Password</Text>
                
                <View style={styles.icon}>
                <Icon 
                  
                  name="chevron-right"
                  size={32}
                  style={{ }}/>
                    </View>
                
            </View>
            <View style= {styles.setting} >
            <Text style={styles.settingFont}>Modify Geofencing Radius</Text>
                
                <View style={styles.icon}>
                <Icon 
                  
                  name="chevron-right"
                  size={32}
                  style={{ }}/>
                    </View>

            </View>
            <View style= {styles.setting} >
            <Text style={styles.settingFont}>Modify Role</Text>
                
                <View style={styles.icon}>
                <Icon 
                  
                  name="chevron-right"
                  size={32}
                  style={{ }}/>
                    </View>

            </View>
        </View>       
    );
}

const styles = StyleSheet.create({
    container: {
        flex: .25,
        flexDirection: "column",
        width: "100%",
        paddingTop: 0
    },
    setting:
    {
        flexDirection: "row",
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingRight: 30,
        paddingLeft: 30,
        paddingTop: 5
    },
    settingFont: {
        fontSize: 16
    },
    icon:
    {
        backgroundColor: "transparent",
        flexGrow: 1,
        alignItems: "flex-end"
    },
    header: {
      color: "gray",
      fontSize: 22,
      paddingLeft: 12,
      fontWeight: "bold"
    },
    headerLine: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    }
});

export default SettingsCard;
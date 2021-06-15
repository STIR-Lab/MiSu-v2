import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Header = ({title}) => 
{
    return (
        <View style={styles.header}>
            <View style={styles.image}>
                <Image
                style={styles.tinyLogo}
                source={require('../../assets/MISUv2.png')}
                />
            
            </View>
            <View style={styles.title}>
                <Text style={styles.headerText}>
                    {title}
                </Text>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    title: {
        flex: 1,
        backgroundColor: "transparent",
        justifyContent: "flex-end",
        alignItems: "center",

        flexGrow: 1,
        height: "100%"
    },
    header: {
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        
    },
    headerText: {
        fontSize: 28,
        fontWeight: "bold",



     
        backgroundColor:"transparent"
    },
    tinyLogo: {

        width: 90,
        height: 90,
      },

    image: {
        backgroundColor:"transparent",
        position: "absolute",
        zIndex: 1000,
        left: -10,
       bottom: -15
      
    
    }
    
})


export default Header
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Header = ({title}) => 
{
    return (
        <View style={styles.header}>
            <View>
            <Image
                style={styles.tinyLogo}
                source={require('../../assets/MISUv2.png')}
            />
            
            </View>
            <Text style={styles.headerText}>
                {title}
            </Text>
        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        flex: .14,
        backgroundColor: "white",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        flexDirection: "row",
    },
    headerText: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginLeft: 25
    },
    tinyLogo: {
        marginBottom: -10,
        marginLeft: 10,
        width: 90,
        height: 90,
      },
    
})


export default Header
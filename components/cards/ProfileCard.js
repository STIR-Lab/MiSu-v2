import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';

function ProfileCard(props) {

    return (
        <View style={style.container}>
            <View style={style.headerLine}>
                <Text style={style.header}>Account</Text>
                <View style={style.editBox}>
                    <Image style={style.gear} source={require('../../assets/icons/Setting.png')}/>
                    <Text>Edit</Text>
                </View>
            </View>

            <View style={style.infoLine}>
                <Text style={style.subHeader}>Email</Text>
                <Text style={style.info}>{props.user.email}</Text>
            </View>

            <View style={style.infoLine}>
                <Text style={style.subHeader}>Phone</Text>
                <Text style={style.info}>{props.user.phone}</Text>
            </View>

            <View style={style.infoLine}>
                <Text style={style.subHeader}>Address</Text>
                <Text style={style.info}>
                    {props.user.address === undefined ? (
                    <></>
                    ) : (
                    props.user.address
                    )}
                </Text>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: .25,
        width: "100%",
        flexDirection: "column",
        borderBottomColor: "#828282",
        borderBottomWidth: .9,
        marginBottom: 10
    },
    editBox: {
      position: "absolute",
      flexDirection: "row",
      alignItems: "center",
      right: 15,
      justifyContent: "flex-end",
      width: 50,
      height: 25,
    },
    gear: {
        height: 16,
        width: 16,
        marginRight: 5
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
        marginBottom: 10,
        width: "100%"

    },
    subHeader : {
        fontWeight: "bold",
        fontSize: 15,
        width: 100,
        paddingLeft: 15
    },
    info: {
      marginLeft: 10,
      fontSize: 15.5
    },
    infoLine: {
      width: "75%",
      flexDirection: "row",
      marginHorizontal: 15,
      marginVertical: 7,
  
    }
  });


export default ProfileCard;
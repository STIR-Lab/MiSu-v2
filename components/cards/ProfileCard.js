import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';

function ProfileCard(props) {

    return (
        <View style={style.container}>
            <View style={style.headerLine}>
                <Text style={style.header}>Profile</Text>
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
        flex: .28,
        width: "100%",
        flexDirection: "column",
        borderBottomColor: "gray",
        borderBottomWidth: 2,
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
      fontSize: 20
    },
    headerLine: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    subHeader : {
        fontWeight: "bold",
        width: 100
    },
    info: {
      marginLeft: 10
    },
    infoLine: {
      flexDirection: "row",
      marginHorizontal: 15,
      marginVertical: 7
    }
  });


export default ProfileCard;
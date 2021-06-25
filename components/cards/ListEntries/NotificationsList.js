import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";

const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      name: 'Sam Smith',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      name: 'Alex Ruiz',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      name: 'Timmy Jones',
    },
  ];

const Item = ({name}) => (

        <View style={styles.item}>
            <View>
                <Icon name="account-circle" size={50}/>
            </View>

            <View>
                <Text style={styles.name}>{name}</Text>
            </View>

            <View >
                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.button}>
                        <Icon name="check" size={45} color="green"/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Icon name="close" size={45}  color="red"/>
                    </TouchableOpacity>

                </View>
            </View>
        </View>

);
const renderItems = DATA.map((data)=> {   
    return( <Item name={data.name}/>)     
   
}) 

const NotificationsList = () => {
    


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hub Requests</Text>
            {renderItems}
            
        </View>
    )
}

export default NotificationsList

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        flex:.8,

        backgroundColor: "#F1F1F1",
        elevation: 100
    }, 

    item: {
        backgroundColor: 'white',
        marginTop:10,
        flex: .17,
        flexDirection: "row",
        alignItems: "center",
        margin: 10,
        borderRadius: 10,
        elevation: 7


      },
      buttons: {
          flexDirection: "row",

      },
      button: {
          backgroundColor: "#F6F6F6",
          borderRadius: 10,
          elevation: 4

      },
      name:{
          fontSize: 25
      },
      title: {
          fontSize: 35,
          textAlign: "center"
      }



})
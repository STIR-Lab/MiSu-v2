import React, {setState, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Feather";
import Modal from "react-native-modal";
const Header = ({title}) => 
{
    const [toggled, setToggled] = useState(false);

    const toggleBell =() => {
        setToggled(!toggled)
    }

    let notificationsModal = (
        <Modal backgroundColor={'red'}
        visible={toggled}
        onBackdropPress={() => toggleBell}>
            <View >
                <Text>
                    Meow
                </Text>
            </View>
        </Modal>
    );
    
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
            <TouchableOpacity onPress={toggleBell}  style={styles.bell}>
                    <Icon  name="bell" size={38}/>  
                
            </TouchableOpacity>
            {notificationsModal}

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
    ,
    bell: {
        position: "absolute",
        right: 10, 
        top: -20,

    }
    
})


export default Header
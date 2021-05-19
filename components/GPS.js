import React, {useEffect, useState} from 'react'
import { Switch, Text, TouchableOpacity, ToastAndroid, View, Image } from 'react-native';
import * as Location from 'expo-location';
import MapView, {
    PROVIDER_GOOGLE,
    ProviderPropType,
    Marker,
    Polyline,
    AnimatedRegion,
    Callout,
  } from "react-native-maps";
import haversine from "haversine";


const GPS = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    //Lat and Long

    const [latitude, setLatitude] = useState(null);
    const [longitude , setLongitude]= useState(null);


    useEffect(() => {
    (
      async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission Denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      //Changes
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
            
    })();
  }, []);


    return (
       <View>
           <Text>This is GPS</Text>
           <Switch/>
           <Text>Latitude: {latitude}</Text>
           <Text>Longitude: {longitude}</Text>
       </View>
    )
}

export default GPS

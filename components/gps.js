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

    const[hubLong, sethubLong] = useState(-85.802324);
    const[hubLat, setHubLat] = useState(10.304313);

    const [distance, setDistance] = useState(null);

    /*
    calcDistance = () => {
      console.log(latitude + " " + longitude);
      console.log(hubLat + " " + hubLong)
      console.log(haversine([hubLat, hubLong], [latitude, longitude], {unit: 'mile'}));
      return haversine([hubLat, hubLong], [latitude, longitude]) / 1.6 || 0;
    };
*/

    useEffect(() => {
    (
      async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission Denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      //Changes
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);


      const calcDistance = async () => {
        try{
          //console.log(latitude + " " + longitude);
          //console.log(hubLat + " " + hubLong);
          setDistance(haversine({"latitude": hubLat, "longitude":hubLong}, {"latitude":latitude,"longitude": longitude}, {unit: 'mile'}));
          console.log("Distance: " + distance + "miles");
        }
        catch (error) {
          console.log(error)
        }
      }
  

      calcDistance();

    })();
  });


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

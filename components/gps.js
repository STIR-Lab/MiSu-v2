import React, { useEffect, useState } from "react";
import {
  Switch,
  Text,
  TouchableOpacity,
  ToastAndroid,
  View,
  Image,
} from "react-native";
import * as Location from "expo-location";

import haversine from "haversine";

const GPS = ({ token, hubLong, hubLat }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  //Lat and Long

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  //const [hubLong, sethubLong] = useState(-85.802324);
  //const [hubLat, setHubLat] = useState(10.304313);

  const [theDistance, setTheDistance] = useState(null);

  /*
    calcDistance = () => {
      console.log(latitude + " " + longitude);
      console.log(hubLat + " " + hubLong)
      console.log(haversine([hubLat, hubLong], [latitude, longitude], {unit: 'mile'}));
      return haversine([hubLat, hubLong], [latitude, longitude]) / 1.6 || 0;
    };
*/

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission Denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      //Changes
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);

      const calcDistance = async () => {
        try {
          //console.log(latitude + " " + longitude);
          //console.log(hubLat + " " + hubLong);
          setTheDistance(
            haversine(
              { latitude: hubLat, longitude: hubLong },
              { latitude: latitude, longitude: longitude },
              { unit: "mile" }
            )
          );
          //console.log("Distance: " + theDistance + " miles");

          //============================================================
          // Request

          const postDistance = async () => {
            const state = await fetch(
              "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/gps",
              {
                method: "POST",
                headers: {
                  Authorization: "Bearer " + token,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  distance: theDistance,
                }),
              }
            )
              .then((response) => response.json())
              .then((data) => {
                //console.log(data);
              })
              .catch((err) => console.log(err));
          };

          setInterval(() => {
            postDistance();
          }, 7000);

          //
          // END REQUEST
        } catch (error) {
          console.log(error);
        }
      };

      calcDistance();

      // const interval = setTimeout(() => {
      //   calcDistance();
      // }, 10000);

      // return () => {
      //   clearInterval(interval);
      // };
    })();
  });

  return null;
};

export default GPS;

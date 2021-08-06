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
  const [prevDistance, setPrevDistance] = useState(null);

  /*
    calcDistance = () => {
      console.log(latitude + " " + longitude);
      console.log(hubLat + " " + hubLong)
      console.log(haversine([hubLat, hubLong], [latitude, longitude], {unit: 'mile'}));
      return haversine([hubLat, hubLong], [latitude, longitude]) / 1.6 || 0;
    };
*/

  useEffect(() => {
    setInterval(() => {
      getLocation()
        .then(() => {
          calcDistance();
        })
        .then(() => {
          postDistance();
        });
      // calcDistance();
    }, 8000);
  }, []);

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    let { a } = await Location.getBackgroundPermissionsAsync();
    console.log("PERMISSSSSIONSSS=================", a);

    if (status !== "granted") {
      setErrorMsg("Permission Denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setLocation(location);
    console.log(location.coords);
    let backPerm = await Location.requestBackgroundPermissionsAsync();
    // console.log(backPerm);

    //Changes
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    calcDistance();
    return;
  }

  function calcDistance() {
    console.log("Calculating distance");
    if (prevDistance != null && prevDistance == theDistance) {
      console.log("prevDistance = theDistance on calc");
      return;
    }
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
      console.log("Distance: " + theDistance + " miles");
    } catch (error) {
      console.log(error);
    }
    return;
  }

  async function postDistance() {
    console.log("postDistance");
    if (theDistance == null) {
      return;
    }
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
        setPrevDistance(theDistance);
        console.log(data);
      })
      .catch((err) => console.log(err));
    return;
  }
  return null;
};

export default GPS;

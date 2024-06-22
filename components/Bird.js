
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Images from "@/assets/Images";

const Bird = (props) => {
  // const width = props.body.bounds.max.x - props.body.bounds.min.x;
  // const height = props.body.bounds.max.y - props.body.bounds.min.y;
  const width = 50; // Example: Width of the bird
  const height = 34; // Example: Height of the bird
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  return (
    <Image
      style={[styles.image, { left: x, top: y, width: width, height: height }]}
      resizeMode="stretch"
      source={Images.bird}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    position: "absolute",
  },
});

export default Bird;

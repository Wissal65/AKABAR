import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Images from '@/assets/Images';

const Floor = props => {
    const width = props.body.bounds.max.x - props.body.bounds.min.x;
    const height = props.body.bounds.max.y - props.body.bounds.min.y;
    const x = props.body.position.x - width / 2;
    const y = props.body.position.y - height / 2;
    const imageIterations = Math.ceil(width / height);

    return (
        <View style={[styles.container, { left: x, top: y, width: width, height: height }]}>
                 {Array.from({ length: imageIterations }).map((_, idx) => {
                return (
                    <Image
                        style={[styles.image,{width: height, height: height }]}
                        resizeMode="stretch"
                        source={Images.floor}
                        key={idx} 
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        overflow: "hidden",
        flexDirection: "row",
    },
    image: {
    },
});

export default Floor;

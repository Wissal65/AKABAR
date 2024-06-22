
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Images from '@/assets/Images';

const Pipe = (props) => {
    const width = props.body.bounds.max.x - props.body.bounds.min.x;
    const height = props.body.bounds.max.y - props.body.bounds.min.y;
    const x = props.body.position.x - width / 2;
    const y = props.body.position.y - height / 2;

const pipeRatio = 160 / width;
const pipeHeight = 33* pipeRatio;
const pipeIterations = Math.ceil(height / pipeHeight)

    return (
        <View style={[styles.container, { left: x, top: y, width: width, height: height }]}>
               {Array.from({ length: pipeIterations }).map((_, idx) => {
                return (
                    <Image
                        style={[styles.image,{width: width, height: pipeHeight}]}
                        resizeMode="stretch"
                        source={Images.pipeCore}
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
        flexDirection: "column",
    },
    image: {
    },
});

export default Pipe;














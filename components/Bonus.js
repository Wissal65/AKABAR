import React from 'react';
import { Image } from 'react-native';
import Images from '@/assets/Images';

const Bonus = ({ body, type }) => {
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;
  const imageUrl = Images.bonuses[type].uri;
  return (
    <Image
      style={{ position: 'absolute', left: x, top: y, width : width, height: height,
        borderColor: 'red',  }}
      resizeMode="stretch"
    //  source={imageUrl}
    source={imageUrl}
    />
  );


};

export default Bonus;




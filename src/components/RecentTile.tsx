import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, Text } from 'react-native';


type Props ={
    title:string;
    imageUrl: string;
    onPress?: () => void;
}

export default memo(function RecentTile({title,imageUrl,onPress}:Props){
    return (
        <Pressable
        onPress = {onPress}
        style={{
            width: '48%',
            backgroundColor: '#2a2a2a',
            borderRadius: 6,
            marginBottom:12,
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center',
        }}>
        <Image source= {{uri:imageUrl}} style={{width:56,height:56}}/>
        <Text numberOfLines={1} style= {{color: 'white',marginLeft: 10,fontWeight: '600', flex:1}}>{title}</Text>
        </Pressable>
    );
});
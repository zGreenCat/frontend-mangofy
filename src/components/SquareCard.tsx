import { Image } from 'expo-image';
import { memo } from "react";
import { Pressable, Text } from "react-native";
type Props = {
    title: string;
    subtitle: string;
    imageUrl: string;
    onPress?: () => void;
};

export default memo(function SquareCard({ title, subtitle, imageUrl, onPress }: Props) {
    return (
        <Pressable onPress={onPress} style= {{width: 140, marginRight: 12}}>
            <Image 
            source = {{uri: imageUrl}} 
            style = {{width: 140, height: 140, borderRadius: 8,backgroundColor: '#1f1f1f'}}
            contentFit = "cover"
            transition={200}/>
            <Text 
            numberOfLines={1}
            style={{color: "white", marginTop: 8, fontWeight: '600'}}>{title}</Text>
            {!!subtitle && <Text numberOfLines={1} style={{color: '#b3b3b3',marginTop: 2, fontSize: 12}}>{subtitle}</Text>}
        </Pressable>
    );
});
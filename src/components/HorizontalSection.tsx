import { FlatList, Text, View } from 'react-native';
import SquareCard from './SquareCard';

type Item = {id:string;title:string;subtitle:string;imageUrl:string};
type Props = {
    title: string;
    data: Item[];
    onPressItem?: (id:string) => void;
};


export default function HorizontalSection({ title, data, onPressItem }: Props) {
    return (
        <View style= {{marginTop: 16}}>
            <Text style={{color:'white',fontSize:20,fontWeight:'700',marginBottom: 10,paddingHorizontal:16}}>
                {title}
            </Text>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data}
                keyExtractor={(it) => it.id}
                contentContainerStyle={{paddingHorizontal:16}}
                renderItem={({item})=> (
                    <SquareCard
                        title={item.title}
                        subtitle= {item.subtitle}
                        imageUrl = {item.imageUrl}
                        onPress= {() => onPressItem?.(item.id)} 
                    />
                )}>
            </FlatList>
        </View>
    );
   
}
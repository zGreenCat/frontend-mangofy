import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import HorizontalSection from '../components/HorizontalSection';
import RecentTile from '../components/RecentTile';
const mockRecent = [
  { id: 'r1', title: 'Daily Mix 1', imageUrl: 'https://i.scdn.co/image/ab67616d00001e02...' },
  { id: 'r2', title: 'Top 50 Global', imageUrl: 'https://i.scdn.co/image/ab67616d00001e02...' },
  { id: 'r3', title: 'Focus Flow', imageUrl: 'https://i.scdn.co/image/ab67616d00001e02...' },
  { id: 'r4', title: 'EDM Hits', imageUrl: 'https://i.scdn.co/image/ab67616d00001e02...' },
];

const mockRecs = [
  { id: 'a1', title: 'After Hours', subtitle: 'The Weeknd', imageUrl: 'https://i.scdn.co/image/ab67616d...' },
  { id: 'a2', title: 'folklore', subtitle: 'Taylor Swift', imageUrl: 'https://i.scdn.co/image/ab67616d...' },
  { id: 'a3', title: 'Un Verano Sin Ti', subtitle: 'Bad Bunny', imageUrl: 'https://i.scdn.co/image/ab67616d...' },
];

const mockArtists = [
  { id: 'ar1', title: 'Arctic Monkeys', subtitle: 'Artista', imageUrl: 'https://i.scdn.co/image/ab676161...' },
  { id: 'ar2', title: 'Feid', subtitle: 'Artista', imageUrl: 'https://i.scdn.co/image/ab676161...' },
  { id: 'ar3', title: 'ROSALÍA', subtitle: 'Artista', imageUrl: 'https://i.scdn.co/image/ab676161...' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style= {{flex:1, backgroundColor: "#000"}}>
      <View style= {{paddingHorizontal:16,paddingTop:4,paddingBottom:12}}>
        <Text style= {{color: '#fff', fontSize: 24, fontWeight: '800'}}>Buenos dias</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flexDirection: 'row',flexWrap: 'wrap',justifyContent:'space-between',paddingHorizontal:16}}>
          {mockRecent.map((it)=>(
            <RecentTile key={it.id} title={it.title} imageUrl={it.imageUrl} onPress={()=>{}}/>
          ))}
        </View>
        <HorizontalSection title="Recomendado para ti" data={mockRecs} onPressItem={(id) => {}}/>
        <HorizontalSection title="Artistas similares" data={mockArtists} onPressItem={(id) => {}}/>
        <HorizontalSection title="Novedades" data={mockRecs} onPressItem={(id) => {}}/>

        <View style = {{height:24}} />
      </ScrollView>
    </SafeAreaView>
  );
}

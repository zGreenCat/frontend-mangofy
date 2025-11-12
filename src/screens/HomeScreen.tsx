import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
import HorizontalSection from '../components/HorizontalSection';
import NewReleaseCard from '../components/NewReleaseCard';
import RecentTile from '../components/RecentTile';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.86);
const CARD_HEIGHT = Math.round(CARD_WIDTH * 0.56);
const SPACING = 16;

const mockCarousel = [
  { id: 'c1', title: 'Blissful Nights', artist: 'Mango Band', imageUrl: 'https://picsum.photos/800/480?random=1' },
  { id: 'c2', title: 'Tropical Vibes', artist: 'DJ Mango', imageUrl: 'https://picsum.photos/800/480?random=2' },
  { id: 'c3', title: 'Sunset Drive', artist: 'La Playa', imageUrl: 'https://picsum.photos/800/480?random=3' },
];

const mockNewReleases = [
  { id: 'n1', artist: 'Ego Apartment', track: 'New Release', imageUrl: 'https://picsum.photos/800/480?random=31' },
  { id: 'n2', artist: 'Mango Band', track: 'Summer Love', imageUrl: 'https://picsum.photos/800/480?random=32' },
  { id: 'n3', artist: 'La Playa', track: 'Ocean Breeze', imageUrl: 'https://picsum.photos/800/480?random=33' },
];

const mockRecent = [
  { id: 'r1', title: 'Daily Mix 1', imageUrl: 'https://picsum.photos/200/200?random=11' },
  { id: 'r2', title: 'Top 50 Global', imageUrl: 'https://picsum.photos/200/200?random=12' },
  { id: 'r3', title: 'Focus Flow', imageUrl: 'https://picsum.photos/200/200?random=13' },
  { id: 'r4', title: 'EDM Hits', imageUrl: 'https://picsum.photos/200/200?random=14' },
];

const mockRecs = [
  { id: 'a1', title: 'After Hours', subtitle: 'The Weeknd', imageUrl: 'https://picsum.photos/200/200?random=21' },
  { id: 'a2', title: 'folklore', subtitle: 'Taylor Swift', imageUrl: 'https://picsum.photos/200/200?random=22' },
  { id: 'a3', title: 'Un Verano Sin Ti', subtitle: 'Bad Bunny', imageUrl: 'https://picsum.photos/200/200?random=23' },
];

export default function HomeScreen() {
  function renderCarouselItem({ item }: { item: typeof mockCarousel[0] }) {
    return (
      <TouchableOpacity activeOpacity={0.85} style={{ marginRight: SPACING }}>
        <ImageBackground
          source={{ uri: item.imageUrl }}
          style={styles.cardImage}
          imageStyle={styles.cardImageRadius}
        >
          <View style={styles.cardOverlay}>
            <Text numberOfLines={1} style={styles.cardTitle}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.cardArtist}>{item.artist}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  function renderNewRelease({ item }: { item: typeof mockNewReleases[0] }) {
    return (
      <NewReleaseCard
        imageUrl={item.imageUrl}
        artist={item.artist}
        track={item.track}
        onPress={() => {
    
        }}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.beige }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Buenos dias</Text>
        <View style={styles.headerIcons}>
           <TouchableOpacity>
          <Ionicons name="notifications" size={24} color={Colors.orange} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings" size={24} color={Colors.orange} />
        </TouchableOpacity>
        </View>
       
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
 
        <View style={styles.carouselWrapper}>
          <FlatList
            data={mockCarousel}
            renderItem={renderCarouselItem}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + SPACING}
            contentContainerStyle={{ paddingHorizontal: SPACING }}
          />
        </View>


        <View style={[styles.sectionRow, { marginBottom: 10 }]}>
          <Text style={styles.sectionTitle}>Lanzamientos</Text>
          <FlatList
            data={mockNewReleases}
            renderItem={renderNewRelease}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SPACING }}
            style={{ marginTop: 6 }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Buenos días</Text>

          <View style={styles.recentRow}>
            {mockRecent.map((it) => (
              <RecentTile key={it.id} title={it.title} imageUrl={it.imageUrl} onPress={() => {}} />
            ))}
          </View>

          <HorizontalSection title="Recomendado para ti" data={mockRecs} onPressItem={() => {}} />
          <HorizontalSection title="Artistas similares" data={mockRecs} onPressItem={() => {}} />
          <HorizontalSection title="Novedades" data={mockRecs} onPressItem={() => {}} />
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
    marginBottom: 6,
    zIndex: 2,
    marginLeft: 12,
  },
  title: { fontSize: 28, fontWeight: '800', color: Colors.red, textAlign: 'center' },
  subtitle: { fontSize: 13, color: Colors.textDark, marginTop: 4 },
  headerIcons: {
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'center',
    marginRight: 12,
    width: 80,
    justifyContent: 'space-between',
  },

  scrollContent: {
    paddingTop: 6,
    paddingBottom: 24,
  },


  carouselWrapper: {
    marginTop: 8,
    marginBottom: 18,
  },
  cardImage: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  cardImageRadius: {
    borderRadius: 14,
  },
  cardOverlay: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cardArtist: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    marginTop: 4,
  },

 
  sectionRow: {
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginLeft: SPACING,
  },


  card: {
    marginHorizontal: SPACING,
    borderRadius: 12,
    padding: 14,
    backgroundColor: Colors.beige,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,179,102,0.18)',
  },

  recentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
});
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchCard from "../components/SearchCard";

const TOP_GENRES = [
  { id: "g1", title: "Pop", imageUrl: "https://picsum.photos/400/300?random=11" },
  { id: "g2", title: "Indie", imageUrl: "https://picsum.photos/400/300?random=12" },
  { id: "g3", title: "Rock", imageUrl: "https://picsum.photos/400/300?random=13" },
  { id: "g4", title: "R&B", imageUrl: "https://picsum.photos/400/300?random=14" },
];

const BROWSE = [
  { id: "b1", title: "Podcasts", imageUrl: "https://picsum.photos/400/300?random=21" },
  { id: "b2", title: "Made for you", imageUrl: "https://picsum.photos/400/300?random=22" },
  { id: "b3", title: "New Releases", imageUrl: "https://picsum.photos/400/300?random=23" },
  { id: "b4", title: "Chill", imageUrl: "https://picsum.photos/400/300?random=24" },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#666" style={styles.iconLeft} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Artists, songs, or podcasts"
            style={styles.input}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.iconRight}>
            <Ionicons name="mic" size={18} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Top genres - horizontal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your top genres</Text>
          <FlatList
            data={TOP_GENRES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <SearchCard title={item.title} imageUrl={item.imageUrl} onPress={() => {}} />
            )}
            contentContainerStyle={{ paddingLeft: 12, paddingTop: 8 }}
          />
        </View>

        {/* Browse all - grid 2 columns */}
        <View style={[styles.section, { marginTop: 8 }]}>
          <Text style={styles.sectionTitle}>Browse all</Text>
          <FlatList
            data={BROWSE}
            numColumns={2}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <SearchCard compact title={item.title} imageUrl={item.imageUrl} onPress={() => {}} />
            )}
            contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 8 }}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, paddingTop: 12 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 44,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
  },
  iconLeft: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, paddingVertical: 8, color: "#111" },
  iconRight: { paddingLeft: 8 },

  section: { marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginLeft: 12, marginBottom: 6 },
});
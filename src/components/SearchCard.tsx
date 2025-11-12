import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SearchCard({
  title,
  imageUrl,
  compact = false,
  onPress,
}: {
  title: string;
  imageUrl?: string;
  compact?: boolean; // true -> tarjeta pequeña para grid
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.card, compact && styles.cardCompact]} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.content}>
        <Text numberOfLines={1} style={[styles.title, compact && styles.titleCompact]}>
          {title}
        </Text>
        <Image
          source={imageUrl ? { uri: imageUrl } : require("../../assets/images/mango.png")}
          style={[styles.thumb, compact && styles.thumbCompact]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#eee",
    overflow: "hidden",
    marginRight: 12,
    justifyContent: "flex-end",
  },
  cardCompact: {
    width: "48%",
    height: 120,
    marginRight: 0,
    marginBottom: 12,
  },
  content: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    flex: 1,
    paddingRight: 8,
  },
  titleCompact: {
    fontSize: 14,
    fontWeight: "700",
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  thumbCompact: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
});
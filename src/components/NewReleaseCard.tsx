import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';

export default function NewReleaseCard({
  imageUrl,
  artist,
  track,
  onPress,
}: {
  imageUrl: string;
  artist: string;
  track: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.container} onPress={onPress}>
      <View style={styles.avatarWrap}>
        <Image source={{ uri: imageUrl }} style={styles.avatar} />
      </View>

      <Text numberOfLines={1} style={styles.artist} accessibilityLabel={`Artista ${artist}`}>
        {artist}
      </Text>

      <Text numberOfLines={1} style={styles.track} accessibilityLabel={`Canción ${track}`}>
        {track}
      </Text>
    </TouchableOpacity>
  );
}

const AVATAR = 96;

const styles = StyleSheet.create({
  container: {
    width: 140,
    alignItems: 'center',
    marginRight: 14,
  },
  avatarWrap: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    overflow: 'hidden',
    backgroundColor: Colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    // ligera sombra
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  artist: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
  },
  track: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(43,31,18,0.7)', // color más suave
    textAlign: 'center',
  },
});
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    GestureResponderEvent,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ART_SIZE = Math.round(SCREEN_WIDTH * 0.86);

export default function PlayerScreen() {
  const [playing, setPlaying] = useState(true);
  const [position, setPosition] = useState(45); // segundos (demo)
  const [duration] = useState(249); // segundos (demo)
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (playing) {
      tickRef.current = setInterval(() => {
        setPosition((p) => {
          if (p >= duration) {
            clearInterval(tickRef.current as number);
            return duration;
          }
          return p + 1;
        });
      }, 1000) as unknown as number;
    } else {
      if (tickRef.current) clearInterval(tickRef.current as number);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current as number);
    };
  }, [playing, duration]);

  function togglePlay() {
    setPlaying((v) => !v);
  }

  function seekTo(evt: GestureResponderEvent) {
    const { locationX } = evt.nativeEvent;
    const width = SCREEN_WIDTH - 48; // mismo ancho que la barra en estilos
    const pct = Math.max(0, Math.min(1, locationX / width));
    setPosition(Math.round(pct * duration));
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${sec}`;
  }

  const progressPct = Math.max(0, Math.min(1, position / duration));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.bgYellow }]}>
      {/* gran forma decorativa (opcional) */}
      <View style={styles.bgCircle} />

      <View style={styles.header}>
        <Text style={styles.appTitle}>MangoFy</Text>
      </View>

      <View style={styles.artWrap}>
        <ImageBackground
          source={{ uri: 'https://picsum.photos/800/800?random=99' }}
          style={styles.art}
          imageStyle={styles.artRadius}
        >
          <View style={styles.artOverlay}>
            <Text numberOfLines={1} style={styles.songTitle}>Song Title</Text>
            <Text numberOfLines={1} style={styles.songArtist}>Artist Name</Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.meta}>
        <View style={styles.progressRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeTextRight}>{formatTime(duration)}</Text>
        </View>

        <TouchableOpacity activeOpacity={0.9} onPress={seekTo} style={styles.progressBarWrap}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct * 100}%` }]} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="heart-outline" size={22} color={Colors.red} />
        </TouchableOpacity>

        <View style={styles.playControls}>
          <TouchableOpacity style={styles.smallBtn}>
            <Ionicons name="play-skip-back" size={26} color={Colors.textDark} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
            <Ionicons name={playing ? 'pause' : 'play'} size={32} color={Colors.textDark} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.smallBtn}>
            <Ionicons name="play-skip-forward" size={26} color={Colors.textDark} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="ellipsis-horizontal" size={22} color={Colors.textDark} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 18 },
  bgCircle: {
    position: 'absolute',
    width: SCREEN_WIDTH * 1.6,
    height: SCREEN_WIDTH * 1.6,
    borderRadius: SCREEN_WIDTH * 0.8,
    backgroundColor: Colors.green,
    opacity: 0.12,
    top: -SCREEN_WIDTH * 0.6,
    right: -SCREEN_WIDTH * 0.4,
    zIndex: 0,
  },

  header: { width: '100%', alignItems: 'center', zIndex: 2, marginBottom: 8 },
  appTitle: { fontSize: 18, fontWeight: '800', color: Colors.red },

  artWrap: {
    width: ART_SIZE,
    height: ART_SIZE,
    marginTop: 10,
    zIndex: 2,
  },
  art: {
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: Colors.inputBg,
  },
  artRadius: {
    borderRadius: 16,
  },
  artOverlay: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.36)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  songTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  songArtist: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4 },

  meta: { width: '100%', paddingHorizontal: 24, marginTop: 18 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { color: Colors.textDark, opacity: 0.7, fontSize: 12 },
  timeTextRight: { color: Colors.textDark, opacity: 0.7, fontSize: 12 },

  progressBarWrap: { marginTop: 8, height: 28, justifyContent: 'center' },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.inputBg,
    overflow: 'hidden',
  },progressFill: {
    height: '100%',
    backgroundColor: Colors.orange,
  },

  controls: {
    width: '100%',
    paddingHorizontal: 28,
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.beige,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  playControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  smallBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.inputBg,
  },

  playBtn: {
    width: 78,
    height: 78,
    borderRadius: 999,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
    marginHorizontal: 6,
  },
});
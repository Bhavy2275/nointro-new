import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
} from 'react-native-reanimated';
import { projects } from './projects';

// Card and spacing dimensions
const CARD_WIDTH = 160;
const CARD_HEIGHT = 220;
const GAP = 12;
const ITEM_WIDTH = CARD_WIDTH + GAP;
const ROW_WIDTH = projects.length * ITEM_WIDTH;

// Component representing a single infinite scrolling row
const AutoScrollingRow = ({ items, direction, speed = 60, onCardPress }) => {
  // Translate Row 1 to the left (starts at 0) and Row 2 to the right (starts at -ROW_WIDTH)
  const translationX = useSharedValue(direction === 'left' ? 0 : -ROW_WIDTH);
  const isPaused = useSharedValue(false);

  // High performance frame callback running directly on the UI thread
  useFrameCallback((frameInfo) => {
    'worklet';
    if (isPaused.value || !frameInfo.timeSincePreviousFrame) return;

    // Convert milliseconds since last frame to seconds for frame-rate independence
    const deltaTime = frameInfo.timeSincePreviousFrame / 1000;
    const step = speed * deltaTime;

    if (direction === 'left') {
      translationX.value -= step;
      // Seamlessly wrap around when the first set of items has scrolled completely out of view
      if (translationX.value <= -ROW_WIDTH) {
        translationX.value += ROW_WIDTH;
      }
    } else {
      translationX.value += step;
      // Seamlessly wrap around when the translation reaches 0
      if (translationX.value >= 0) {
        translationX.value -= ROW_WIDTH;
      }
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }));

  // Duplicate elements to create a contiguous double-buffered sequence
  const duplicatedItems = [...items, ...items];

  return (
    <View
      onTouchStart={() => {
        isPaused.value = true;
      }}
      onTouchEnd={() => {
        isPaused.value = false;
      }}
      onTouchCancel={() => {
        isPaused.value = false;
      }}
      style={styles.rowWrapper}
    >
      <Animated.View style={[styles.rowContainer, animatedStyle]}>
        {duplicatedItems.map((project, index) => (
          <Pressable
            key={`${project.id}-${index}`}
            onPress={() => onCardPress(project)}
            style={styles.card}
          >
            {({ pressed }) => (
              <View style={styles.cardInner}>
                <Image
                  source={{ uri: project.image }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                {/* Asymmetric dark overlay on press revealing title & subtitle */}
                <View
                  style={[
                    styles.overlay,
                    { opacity: pressed ? 1 : 0 },
                  ]}
                >
                  <Text style={styles.cardTitle}>{project.title}</Text>
                  <Text style={styles.cardSubtitle}>{project.subtitle}</Text>
                </View>
              </View>
            )}
          </Pressable>
        ))}
      </Animated.View>
    </View>
  );
};

export default function PortfolioScreen({ navigation }) {
  // Reverse row items to create visual variance between Row 1 and Row 2
  const row1Items = projects;
  const row2Items = [...projects].reverse();

  const handleCardPress = (project) => {
    navigation.navigate('ProjectDetail', { project });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Editorial Header */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>ANTI GRAVITY</Text>
        <Text style={styles.headerSubtitle}>Creative Portfolio Showcase</Text>
      </View>

      {/* Showcase Grid */}
      <View style={styles.showcaseContainer}>
        {/* Row 1: Leftward Auto Scroll */}
        <AutoScrollingRow
          items={row1Items}
          direction="left"
          speed={55}
          onCardPress={handleCardPress}
        />

        {/* Row 2: Rightward Auto Scroll */}
        <AutoScrollingRow
          items={row2Items}
          direction="right"
          speed={55}
          onCardPress={handleCardPress}
        />
      </View>

      {/* Editorial Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Pinch or touch any row to pause. Tap a card to inspect details.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  headerLogo: {
    fontWeight: '900',
    fontSize: 28,
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  headerSubtitle: {
    fontWeight: '500',
    fontSize: 11,
    color: '#888888',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 6,
  },
  showcaseContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  rowWrapper: {
    width: '100%',
    overflow: 'hidden',
    paddingVertical: 8,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: GAP,
  },
  cardInner: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#111111',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardSubtitle: {
    color: '#AAAAAA',
    fontSize: 10,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  footerText: {
    color: '#666666',
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

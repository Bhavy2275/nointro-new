import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';

export default function ProjectDetailScreen({ route, navigation }) {
  const { project } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Floating Minimal Back Button */}
      <Pressable 
        onPress={() => navigation.goBack()} 
        style={styles.backButton}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Text style={styles.backButtonText}>← BACK</Text>
      </Pressable>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        {/* Top Hero Image with entrance fade animation */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.imageContainer}>
          <Image
            source={{ uri: project.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Text details container */}
        <View style={styles.detailsContainer}>
          {/* Category Tag */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <Text style={styles.categoryTag}>{project.category}</Text>
          </Animated.View>

          {/* Project Title */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)}>
            <Text style={styles.title}>{project.title}</Text>
          </Animated.View>

          {/* Subtitle */}
          <Animated.View entering={FadeInDown.delay(300).duration(500)}>
            <Text style={styles.subtitle}>{project.subtitle}</Text>
          </Animated.View>

          {/* Horizontal Divider Line */}
          <View style={styles.divider} />

          {/* Metadata Grid */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(500)} 
            style={styles.metaGrid}
          >
            <View style={styles.metaColumn}>
              <Text style={styles.metaLabel}>CLIENT</Text>
              <Text style={styles.metaValue}>{project.client}</Text>
            </View>
            <View style={styles.metaColumn}>
              <Text style={styles.metaLabel}>YEAR</Text>
              <Text style={styles.metaValue}>{project.year}</Text>
            </View>
          </Animated.View>

          {/* Extended Description */}
          <Animated.View entering={FadeInDown.delay(500).duration(600)}>
            <Text style={styles.description}>{project.description}</Text>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 380,
    backgroundColor: '#111111',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  categoryTag: {
    fontWeight: '500',
    fontSize: 10,
    color: '#888888',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontWeight: '900',
    fontSize: 36,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 24,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  metaColumn: {
    flex: 1,
  },
  metaLabel: {
    fontWeight: '500',
    fontSize: 10,
    color: '#666666',
    letterSpacing: 2,
    marginBottom: 4,
  },
  metaValue: {
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
});

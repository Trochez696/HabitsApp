import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
  <ParallaxScrollView
    headerBackgroundColor={{ light: '#4CAF50', dark: '#1B5E20' }}
    headerImage={
      <Image
        source={require('@/assets/images/partial-react-logo.png')}
        style={styles.reactLogo}
      />
    }>

    <ThemedView style={styles.titleContainer}>
      <ThemedText type="title">Habit Tracker</ThemedText>
      <HelloWave />
    </ThemedView>

    <ThemedView style={styles.stepContainer}>
      <ThemedText type="subtitle">Organiza tu día</ThemedText>
      <ThemedText>
        Crea, gestiona y mejora tus hábitos diarios de forma sencilla.
      </ThemedText>
    </ThemedView>

    <ThemedView style={styles.stepContainer}>
      <ThemedText type="subtitle">¿Qué puedes hacer?</ThemedText>
      <ThemedText>✔ Agregar hábitos</ThemedText>
      <ThemedText>✔ Marcar como completados</ThemedText>
      <ThemedText>✔ Llevar control diario</ThemedText>
    </ThemedView>

    <ThemedView style={styles.stepContainer}>
      <Link href="/(tabs)/explore" style={styles.button}>
        <ThemedText style={styles.buttonText}>
          Empezar
        </ThemedText>
      </Link>
    </ThemedView>

  </ParallaxScrollView>
);
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

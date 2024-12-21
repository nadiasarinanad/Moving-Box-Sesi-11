import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, View, Button, Text, Easing } from 'react-native';

const App = () => {
  const moveAnimX = useRef(new Animated.Value(0)).current; // Pergerakan horizontal (X)
  const moveAnimY = useRef(new Animated.Value(0)).current; // Pergerakan vertikal (Y)
  const scaleAnim = useRef(new Animated.Value(1)).current; // Animasi perubahan ukuran
  const rotateAnim = useRef(new Animated.Value(0)).current; // Animasi rotasi
  const fadeAnim = useRef(new Animated.Value(1)).current; // Animasi opacity
  const [animating, setAnimating] = useState(false); // Menyimpan status animasi
  const [boxPosition, setBoxPosition] = useState({ x: 0, y: 0 }); // Menyimpan posisi kotak

  // Fungsi untuk memulai semua animasi
  const startAnimation = () => {
    setAnimating(true); // Menandakan animasi sedang berjalan

    // Pergerakan Horizontal dan Vertikal dengan Easing (gerakan melengkung)
    Animated.loop(
      Animated.sequence([ // Menambahkan urutan pergerakan yang teratur
        Animated.timing(moveAnimX, {
          toValue: 250, // Posisi target ke kanan
          duration: 1500,
          useNativeDriver: false,
          easing: Easing.ease, // Easing untuk efek halus
        }),
        Animated.timing(moveAnimY, {
          toValue: 250, // Posisi target ke bawah
          duration: 1500,
          useNativeDriver: false,
          easing: Easing.ease, // Easing untuk efek halus
        }),
        Animated.timing(moveAnimX, {
          toValue: 0, // Kembali ke posisi awal (kiri)
          duration: 1500,
          useNativeDriver: false,
          easing: Easing.ease, // Easing untuk efek halus
        }),
        Animated.timing(moveAnimY, {
          toValue: 0, // Kembali ke posisi awal (atas)
          duration: 1500,
          useNativeDriver: false,
          easing: Easing.ease, // Easing untuk efek halus
        }),
      ])
    ).start(); // Animasi bergerak bolak-balik di sumbu X dan Y

    // Perubahan Ukuran dengan Easing
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 500,
          useNativeDriver: false,
          easing: Easing.ease, // Easing halus
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
          easing: Easing.ease, // Easing halus
        }),
      ])
    ).start(); // Animasi perubahan ukuran berulang

    // Rotasi 3D
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
        easing: Easing.linear, // Easing untuk rotasi yang halus
      })
    ).start(); // Animasi rotasi berulang

    // Opacity dengan Easing
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: false,
          easing: Easing.ease, // Easing untuk efek opacity halus
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
          easing: Easing.ease, // Easing untuk efek opacity halus
        }),
      ])
    ).start(); // Animasi opacity berulang
  };

  // Fungsi untuk menghentikan animasi
  const stopAnimation = () => {
    setAnimating(false); // Menandakan animasi dihentikan
    moveAnimX.stopAnimation((value) => {
      setBoxPosition((prev) => ({ ...prev, x: value })); // Menyimpan posisi X terakhir
    }); // Hentikan animasi pergerakan X
    moveAnimY.stopAnimation((value) => {
      setBoxPosition((prev) => ({ ...prev, y: value })); // Menyimpan posisi Y terakhir
    }); // Hentikan animasi pergerakan Y
    scaleAnim.stopAnimation(); // Hentikan animasi perubahan ukuran
    rotateAnim.stopAnimation(); // Hentikan animasi rotasi
    fadeAnim.stopAnimation(); // Hentikan animasi opacity
  };

  // Interpolasi untuk rotasi
  const rotateXInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // Rotasi penuh di sumbu X
  });

  const rotateYInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // Rotasi penuh di sumbu Y
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Moving Cube Animation</Text>
      <Animated.View
        style={[
          styles.cube,
          {
            marginLeft: moveAnimX, // Pergerakan Horizontal
            marginTop: moveAnimY, // Pergerakan Vertikal
            transform: [
              { scale: scaleAnim }, // Perubahan Ukuran
              { rotateX: rotateXInterpolate }, // Rotasi 3D di sumbu X
              { rotateY: rotateYInterpolate }, // Rotasi 3D di sumbu Y
            ],
            opacity: fadeAnim, // Opacity
            backgroundColor: moveAnimX.interpolate({
              inputRange: [0, 150, 250],
              outputRange: ['#FF6347', '#FFD700', '#32CD32'], // Perubahan warna kotak saat bergerak
            }),
          },
        ]}
      />
      <View style={styles.buttonContainer}>
        {!animating ? (
          <Button title="Mulai Animasi" onPress={startAnimation} />
        ) : (
          <Button title="Stop Animasi" onPress={stopAnimation} />
        )}
      </View>
      {/* Menampilkan posisi kotak saat animasi dihentikan */}
      <Text style={styles.positionText}>
        {`Posisi Kotak: X = ${Math.round(boxPosition.x)} px, Y = ${Math.round(
          boxPosition.y
        )} px`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4e73df', // Latar belakang berwarna biru
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // Warna teks putih
  },
  cube: {
    width: 150,
    height: 150,
    backgroundColor: '#FF6347', // Warna awal kubus
    marginBottom: 30,
    borderRadius: 10, // Sudut melengkung pada kubus (optional)
    shadowColor: '#000', // Bayangan kotak
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5, // Efek bayangan di Android
    perspective: 1000, // Menambahkan perspektif agar terlihat 3D
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
  },
  positionText: {
    marginTop: 20,
    fontSize: 16,
    color: '#fff', // Warna teks putih
  },
});

export default App;

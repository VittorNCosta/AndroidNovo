import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps"; // <-- IMPORTANTE

export default function Cinema() {
  const navigation = useNavigation();

  const cinemas = [
  {
    id: 1,
    nome: "Shopping São José – Cinemark",
    endereco:
      "Rua Dona Izabel A. Redentora, 1434 - Loja 206 - Centro, São José dos Pinhais - PR, 83005-010",
    imagem:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/95/ae/1e/cinemark.jpg?w=1400&h=800&s=1",
    latitude: -25.538583687718944,
    longitude: -49.20469109130198,
  },
  {
    id: 2,
    nome: "Shopping Cidade – Cinesystem",
    endereco:
      "Av. Mal. Floriano Peixoto, 4984 - Hauer, Curitiba - PR, 81630-000",
    imagem:
      "https://mcities.com.br/curitiba/wp-content/uploads/sites/3/2018/03/cinesystem.jpg",
    latitude: -25.472342602524538,
    longitude: -49.252437731171156,
  },
  {
    id: 3,
    nome: "Shopping Palladium – UCI",
    endereco:
      "Av. Presidente Kennedy, 4121 - Portão, Curitiba - PR, 80610-905",
    imagem:
      "https://palladiumcuritiba.com.br/wp-content/uploads/2024/10/hl-8410823505-1.jpg",
    latitude: -25.47747206602864,
    longitude: -49.290902175120664,
  },
];



  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="menu-outline" size={28} color="#000" />
        <Text style={styles.headerTitle}>Cinemas Próximos</Text>
        <View style={{ flexDirection: "row", gap: 15 }}>
          <Ionicons name="notifications-outline" size={26} color="#000" />
          <Image
            source={{
              uri: "https://i.imgur.com/1XKzE7D.png",
            }}
            style={styles.profileImage}
          />
        </View>
      </View>

      {/* LISTA + MAPA */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {cinemas.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.imagem }} style={styles.cinemaImage} />

            <Text style={styles.cinemaName}>{item.nome}</Text>
            <Text style={styles.cinemaEndereco}>{item.endereco}</Text>
          </View>
        ))}

        {/* MAPA AQUI */}
        <Text style={styles.mapTitle}>Localização dos Cinemas</Text>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -25.45,
            longitude: -49.25,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
          showsUserLocation={true}
        >
          {cinemas.map((cinema) => (
            <Marker
              key={cinema.id}
              coordinate={{
                latitude: cinema.latitude,
                longitude: cinema.longitude,
              }}
              title={cinema.nome}
              description={cinema.endereco}
            />
          ))}
        </MapView>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home-outline" size={22} color="#777" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate("Favoritos")}
        >
          <Ionicons name="heart-outline" size={22} color="#777" />
          <Text style={styles.footerText}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="film" size={22} color="red" />
          <Text style={[styles.footerText, { color: "red" }]}>Cinemas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Ionicons name="person-outline" size={22} color="#777" />
          <Text style={styles.footerText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "red",
  },

  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  card: {
    marginHorizontal: 20,
    marginBottom: 25,
  },

  cinemaImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },

  cinemaName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },

  cinemaEndereco: {
    color: "#444",
    fontSize: 13,
  },

  mapTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },

  map: {
    width: "100%",
    height: 300,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  footerItem: {
    justifyContent: "center",
    alignItems: "center",
  },

  footerText: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },
});

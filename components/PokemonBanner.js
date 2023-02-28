import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

const PokemonBanner = ({ navigation, dex, name, imageUrl, caught }) => {
  function capitalizeWords(str) {
    return str.replace(/\b\w/g, function (l) {
      return l.toUpperCase();
    });
  }

  const handlePress = () => {
    navigation.navigate("Pokemon Information", { dex });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.largeContainer}>
        <View style={styles.smallContainer}>
          <Text style={styles.valueText}>#{dex}</Text>
          <Text style={styles.valueText}>{capitalizeWords(name)}</Text>
          <Image
            style={{ width: "20%", aspectRatio: 3 / 3 }}
            source={{ uri: imageUrl }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  largeContainer: {
    flex: 4,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
    padding: 3,
    backgroundColor: "black",
    borderRadius: 17,
  },
  smallContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 2,
    padding: 3,
    backgroundColor: "darkred",
    borderRadius: 20,
    width: "100%",
  },
  titleText: {
    fontSize: 24,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#FF6A00",
    margin: 15,
  },
  valueText: {
    fontSize: 24,
    fontFamily: "Roboto",
    margin: 3,
    textAlign: "left",
    color: "white",
  },
});

export default PokemonBanner;

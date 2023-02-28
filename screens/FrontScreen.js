import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import PokemonBanner from "../components/PokemonBanner";

const FrontScreen = ({ navigation }) => {
  const [pokemons, setPokemons] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");

  const fetchPokemons = async () => {
    try {
      await fetch("https://pokeapi.co/api/v2/pokemon?limit=135&offset=251")
        .then((response) => response.json())
        .then((data) => setPokemons(data));
      setIsLoading(false);
      setLoadingText("Loading...");
    } catch (err) {
      console.log("Error: " + err);
      setLoadingText("Error: " + err);
      setErrorOccurred(true);
    }
  };

  function extractDexNumberFromUrl(url) {
    const urlParts = url.split("/");
    const pokemonId = urlParts[urlParts.length - 2];
    return pokemonId.toString();
  }

  useEffect(() => {
    fetchPokemons();
  }, []);

  return (
    <View
      style={{ flex: 1, flexDirection: "column", backgroundColor: "darkgrey" }}
    >
      {isLoading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Text style={styles.textTitle}>{loadingText}</Text>
          {errorOccurred && (
            <Pressable
              style={styles.button}
              onPress={() => fetchPokemons(false)}
            >
              <Text style={styles.text}>Try Again</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <View>
          <FlatList
            data={pokemons.results}
            renderItem={({ index, item }) => (
              <PokemonBanner
                navigation={navigation}
                dex={extractDexNumberFromUrl(item.url)}
                name={item.name}
                imageUrl={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${extractDexNumberFromUrl(
                  item.url
                )}.png`}
                caught={false}
              ></PokemonBanner>
            )}
          ></FlatList>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  textTitle: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  textEntries: {
    fontSize: 12,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default FrontScreen;

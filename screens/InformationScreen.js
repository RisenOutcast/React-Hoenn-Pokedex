import React, { useState, useEffect } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

const InformationScreen = ({ route, navigation }) => {
  const [isLoadingPokemon, setIsLoadingPokemon] = useState(true);
  const [isLoadingSpecies, setIsLoadingSpecies] = useState(true);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const [pokemonData, setPokemonData] = useState();
  const [speciesData, setSpeciesData] = useState();
  const { dex } = route.params;
  const [dexNumber, setDexNumber] = useState(parseInt(dex));

  const fetchPokemonData = async (dexNumber) => {
    try {
      await fetch("https://pokeapi.co/api/v2/pokemon/" + dexNumber)
        .then((response) => response.json())
        .then((data) => {
          setPokemonData(data);
          setIsLoadingPokemon(false);
          setLoadingText("Loading...");
        });
    } catch (err) {
      console.log("Error: " + err);
      setLoadingText("Error: " + err);
      setErrorOccurred(true);
    }
  };

  const fetchSpeciesData = async (dexNumber) => {
    try {
      await fetch("https://pokeapi.co/api/v2/pokemon-species/" + dexNumber)
        .then((response) => response.json())
        .then((data) => {
          setSpeciesData(data);
          setIsLoadingSpecies(false);
          setLoadingText("Loading...");
        });
    } catch (err) {
      console.log("Error: " + err);
      setLoadingText("Error: " + err);
      setErrorOccurred(true);
    }
  };

  const getAbilities = () => {
    let abilities = uppercaseFirstLetter(
      fixMultiWord(pokemonData.abilities[0].ability.name)
    );
    if (pokemonData.abilities.length > 1) {
      abilities += ` / ${uppercaseFirstLetter(
        fixMultiWord(pokemonData.abilities[1].ability.name)
      )}`;
    }
    return abilities;
  };

  const uppercaseFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const fixMultiWord = (str) => {
    let words = str.split("-");
    str = "";
    for (let i = 0; i < words.length; i++) {
      if (i > 0) {
        str += " ";
      }
      str += uppercaseFirstLetter(words[i]);
    }
    return str;
  };

  function getEntry() {
    let entry = "";
    let finalEntry = "";
    const flavorTexts = speciesData.flavor_text_entries;
    for (let i = 0; i < flavorTexts.length; i++) {
      if (flavorTexts[i].language.name === "en") {
        entry = flavorTexts[i].flavor_text;
        break;
      }
    }
    const splitEntry = entry.split(/\r?\n/);
    for (let i = 0; i < splitEntry.length; i++) {
      finalEntry += splitEntry[i] + " ";
    }
    return finalEntry;
  }

  const getStats = () => {
    let stats = "";
    const statsArray = pokemonData.stats;
    for (let i = 0; i < statsArray.length; i++) {
      stats += `${uppercaseFirstLetter(
        fixMultiWord(statsArray[i].stat.name)
      )}: `;
      stats += `${statsArray[i].base_stat}\n`;
    }
    return stats;
  };

  useEffect(() => {
    fetchPokemonData(dexNumber);
    fetchSpeciesData(dexNumber);
  }, []);

  function reloadPokemon() {
    fetchPokemonData(dexNumber);
    fetchSpeciesData(dexNumber);
  }

  const nextPokemon = async (previous) => {
    let newDex;
    if (previous) newDex = dexNumber - 1;
    else newDex = dexNumber + 1;
    setDexNumber(newDex);
    setIsLoadingPokemon(true);
    setIsLoadingSpecies(true);
    fetchPokemonData(newDex);
    fetchSpeciesData(newDex);
  };

  return (
    <View style={styles.container}>
      {isLoadingPokemon || isLoadingSpecies ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={styles.textTitle}>{loadingText}</Text>
          {errorOccurred && (
            <Pressable style={styles.button} onPress={() => reloadPokemon()}>
              <Text style={styles.text}>Try Again</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View style={{ flex: 5 }}>
            <Text style={{ fontSize: 30, color: "white" }}>
              #{pokemonData?.id} {uppercaseFirstLetter(pokemonData.name)}
            </Text>
            <Image
              style={{ width: "50%", aspectRatio: 3 / 3 }}
              source={{
                uri: pokemonData.sprites.other["official-artwork"]
                  .front_default,
              }}
            />
          </View>
          <View style={styles.entryContainer}>
            <Text style={styles.textTitle}>Entry</Text>
            <Text style={styles.textEntries}>{getEntry()}</Text>
          </View>
          <View style={styles.typeContainer}>
            <Text style={styles.textTitle}>Type</Text>
            <Text style={styles.textEntries}>
              {uppercaseFirstLetter(pokemonData.types[0].type.name)}
            </Text>
          </View>
          <View style={styles.typeContainer}>
            <Text style={styles.textTitle}>Abilities</Text>
            <Text style={styles.textEntries}>{getAbilities()}</Text>
          </View>
          <View style={styles.typeContainer}>
            <Text style={styles.textTitle}>Height & Weight</Text>
            <Text style={styles.textEntries}>{`${pokemonData.height / 10} m & ${
              pokemonData.weight / 10
            } kg`}</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.textTitle}>Stats</Text>
            <Text style={styles.textEntries}>{getStats()}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <Pressable style={styles.button} onPress={() => nextPokemon(true)}>
              <Text style={styles.text}>Previous</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => nextPokemon(false)}>
              <Text style={styles.text}>Next</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#9C0001",
  },
  entryContainer: {
    flex: 2,
    backgroundColor: "#363636",
    width: 400,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    margin: 3,
  },
  typeContainer: {
    flex: 1,
    backgroundColor: "#363636",
    width: 400,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    margin: 3,
  },
  statsContainer: {
    flex: 3,
    backgroundColor: "#363636",
    width: 400,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    margin: 3,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    width: 400,
    alignItems: "center",
    justifyContent: "space-around",
  },
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

export default InformationScreen;

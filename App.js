import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';

const Stack = createStackNavigator();
const API_KEY = '15cb9e11'; // Ваш API ключ OMDb

// Екран пошуку фільмів
function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);

  const searchMovies = async () => {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
    const data = await response.json();
    if (data.Search) {
      setMovies(data.Search);
    } else {
      setMovies([]);
    }
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a movie..."
        value={query}
        onChangeText={setQuery}
        placeholderTextColor="#888"
      />
      <Button title="Search" onPress={searchMovies} color="#333" />
      <FlatList
        data={movies}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Details', { imdbID: item.imdbID })}
            style={styles.movieItem}
          >
            <Text style={styles.movieTitle}>{item.Title} ({item.Year})</Text>
          </TouchableOpacity>
        )}
        style={styles.movieList}
      />
    </View>
  );
}

// Екран з деталями фільму
function DetailsScreen({ route }) {
  const { imdbID } = route.params;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
      const data = await response.json();
      setMovie(data);
    };
    fetchMovieDetails();
  }, [imdbID]);

  if (!movie) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.detailsContainer}>
      <Text style={styles.movieTitle}>{movie.Title}</Text>
      <Image
        source={{ uri: movie.Poster }}
        style={styles.poster}
        resizeMode="contain"
      />
      <Text style={styles.movieDetail}>Year: {movie.Year}</Text>
      <Text style={styles.movieDetail}>Genre: {movie.Genre}</Text>
      <Text style={styles.movieDetail}>Director: {movie.Director}</Text>
      <Text style={styles.movieDetail}>Actors: {movie.Actors}</Text>
      <Text style={styles.movieDetail}>Plot: {movie.Plot}</Text>
      <Text style={styles.movieDetail}>IMDB Rating: {movie.imdbRating}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Мінімалістичні стилі для екрану пошуку
  searchContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  movieList: {
    marginTop: 20,
  },
  movieItem: {
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  movieTitle: {
    fontSize: 18,
    color: '#333',
  },


  detailsContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  poster: {
    width: 250,
    height: 375,
    marginBottom: 20,
    borderRadius: 8,
  },
  movieDetail: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Search">
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Movie Browser' }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Movie Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

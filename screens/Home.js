import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { getFamilyMovies, getPopularMovies, getPopularTv, getUpcomingMovies } from '../services/services';
import { SliderBox } from "react-native-image-slider-box";
import react from 'react';
import List from '../components/List';
import Error from '../components/Error';

const dimensions = Dimensions.get('screen');

const Home = ({navigation}) => {
  const [movieImages, setMovieImages] = useState();
  const [popularMovies, setPopularMovies] = useState();
  const [popularTv, setPopularTv] = useState();
  const [familyMovies, setFamilyMovies] = useState()
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const getData = () => {
    return Promise.all([
      getUpcomingMovies(),
      getPopularMovies(),
      getPopularTv(),
      getFamilyMovies()
    ]);
  };

  useEffect(() => {
    getData().then(([upcomingMoviesData, popularMoviesData, popularTvData, familyMoviesData]) => {
      const movieImagesArray = [];
      upcomingMoviesData.forEach(movie => {
        movieImagesArray.push('https://image.tmdb.org/t/p/w500' + movie.poster_path);
      });
      setMovieImages(movieImagesArray);
      setPopularMovies(popularMoviesData);
      setPopularTv(popularTvData);
      setFamilyMovies(familyMoviesData);
    }).catch(err => {
      setError(true);
    }).finally(() => {
      setLoaded(true);
    });
  }, []);
  
  return (
    <react.Fragment>
      {loaded && !error && (
        <ScrollView>
          {movieImages && (
            <View style={styles.sliderContainer}>
              <SliderBox 
                images={movieImages} 
                dotStyle={styles.sliderStyle}
                sliderBoxHeight={dimensions.height / 1.5} 
                autoplay={true} 
                circleLoop={true} 
              />
            </View>
          )}
          {/* Popular Movies */}
          {popularMovies && (
            <View style={styles.carousel}>
              <List navigation={navigation} title="Popular Movies" content={popularMovies} />
            </View>
          )}
          {/* Popular TV Shows */}
          {popularTv && (
            <View style={styles.carousel}>
              <List navigation={navigation} title="Popular TV Shows" content={popularTv} />
            </View>
          )}
          {/* Family Movies */}
          {familyMovies && (
            <View style={styles.carousel}>
              <List navigation={navigation} title="Family Movies" content={familyMovies} />
            </View>
          )}
        </ScrollView>
      )}
      {!loaded && (<ActivityIndicator size="large" />)}
      {error && (<Error />)}
    </react.Fragment>
  )
}

const styles = StyleSheet.create({
  sliderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderStyle: {
    height: 0
  },
  carousel: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});

export default Home;
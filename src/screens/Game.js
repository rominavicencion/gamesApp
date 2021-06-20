import React, { useState } from 'react';
import { useRoute } from '@react-navigation/core';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import ImagesSlider from './../components/ImagesSlider';
import Message from './../components/Message';
import FavoriteButton from './../components/FavoriteButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { favoritesGamesAsyncStorageKey } from './../utils/constants';
import { useEffect } from 'react/cjs/react.development';

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#341f97',
    },
    container: {
        margin: 15,
    },
    title: {
        textAlign: 'center',
        color: '#ee5253',
        fontSize: 25,
        fontWeight: 'bold',
        paddingBottom: 10,
    },
    image: {
        width: 400,
        height: 200,
        borderRadius: 5,
        alignSelf: 'center',
        marginBottom: 15,
    },
    containerInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 412,
        backgroundColor: '#222f3e',
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
    },
    containerInfoLeft: {
        alignItems: 'flex-start',
        width: 190,
    },
    containerInfoRight: {
        alignItems: 'flex-end',
        width: 190,
    },
    text: {
        color: '#ee5253',
        fontSize: 18,
        fontWeight: 'bold',
        paddingBottom: 10,
    },
    textInfo: {
        color: '#c8d6e5',
        fontSize: 16,
        marginTop: 3,
        paddingBottom: 10,
    },
});

const Game = () => {
    const routes = useRoute();
    const [game] = useState(routes.params.data);

    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteGames, setFavoriteGames] = useState([]);

    const veryfiedIsFavorites = async () => {
        const asyncStorageSavedData = JSON.parse(
            await AsyncStorage.getItem(favoritesGamesAsyncStorageKey),
        );

        if (asyncStorageSavedData !== null) {
            if (asyncStorageSavedData.length > 0) {
                try {
                    setFavoriteGames(asyncStorageSavedData)
                    const isFavGame = favoriteGames.filter((favoriteGame) => 
                        favoriteGame.title.includes(game.title)
                    );
        
                    if (isFavGame.length > 0) {
                        setIsFavorite(true);
                    } else {
                        setIsFavorite(false);
                    }
                } catch (err) {
                    console.log(err)
                }
            } else {
                setIsFavorite(false);
            }
        } else {
            setIsFavorite(false);
        }
    };

    useEffect(() => {
        veryfiedIsFavorites();
    }, [favoriteGames, isFavorite]);

    return (
        <SafeAreaView style={styles.background}>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}> 🎮 {game.title} 🎮 </Text>
                    <Image style={styles.image} source={{uri: game.thumbnail}} />
                    <FavoriteButton isFavorite={isFavorite} game={game} />
                    <View style={styles.containerInfo}>
                        <View style={styles.containerInfoLeft}>
                            <Text style={styles.text}>Platform: </Text>
                            <Text style={styles.text}>Genre: </Text>
                            <Text style={styles.text}>Publisher: </Text>
                            <Text style={styles.text}>Developer: </Text>
                            <Text style={styles.text}>Release date: </Text>
                            <Text style={styles.text}>Resume: </Text>
                        </View>

                        <View style={styles.containerInfoRight}>
                            <Text style={styles.textInfo}>{game.platform}</Text>
                            <Text style={styles.textInfo}>{game.genre}</Text>
                            <Text style={styles.textInfo}>{game.publisher}</Text>
                            <Text style={styles.textInfo}>{game.developer}</Text>
                            <Text style={styles.textInfo}>{game.release_date}</Text>
                            <Text style={styles.textInfo}>{game.short_description}</Text>
                        </View>
                    </View>

                    { 
                        !game.screenshots ? <Message text="Este juego no tiene screenshots." /> : <ImagesSlider screenshots={game.screenshots} text="Screenshots:" /> 
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Game;

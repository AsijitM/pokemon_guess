'use client';

import axios from 'axios';
import Image from 'next/image';
import { useEffect } from 'react';
import { useState } from 'react';
import PokemonCard from './components/Pokecard';

export default function Home() {
  const [pokemon, setPokemon] = useState(null);
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  const getPokemon = async () => {
    setLoading(true);
    try {
      const data = await axios.get('/api/pokemon');
      console.log(data);
      setPokemon(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setIsError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPokemon();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!guess) return;
    if (guess.toLowerCase() === currentPokemon.name) {
      setScore(score + 1);
      setGuess('');
      setIsCorrect(true);
      setTimeout(() => {
        setIsCorrect(false);
        getPokemon();
      }, 2000);
    } else {
      setGuess('');
    }
  };
  useEffect(() => {
    if (pokemon && !isError && !loading && pokemon.results) {
      console.log(pokemon.results);
      const randomPokemon = Math.floor(Math.random() * pokemon.results.length);
      setCurrentPokemon(pokemon.results[randomPokemon]);
    }
  }, [pokemon]);

     useEffect(() => {
       console.log(currentPokemon);
     }, [currentPokemon]);

    if (loading) {
      const statusMessage = loading ? 'Loading...' : 'Error!';
      return (
        <main className="flex flex-col items-center justify-center min-h-screen py-2 h-screen">
          <h1 className="text-6xl font-bold">{statusMessage}</h1>
        </main>
      );
    }

  return (
    <main className="flex  min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-red-700">
          Welcome to the Pokemon Game!
        </h1>

        <h3 className="text-3xl text-blue-300 pt-10">Who's that Pokemon?</h3>
      </div>

      <p className="text-2xl font-semibold">Score:{score}</p>

      <PokemonCard pokemon={currentPokemon} isCorrect={isCorrect} />
      <form
        className="w-full max-w-sm"
        onSubmit={handleSubmit}
        style={{ marginTop: '2rem' }}
      >
        <div className="flex items-center border-b border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Which Pokemon is this?"
            aria-label="Full name"
            onChange={(e) => setGuess(e.target.value)}
            value={guess}
          />
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Submit
          </button>
          <button
            className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded"
            type="button"
            onClick={() => {
              setGuess('');
              getPokemon();
            }}
          >
            Skip
          </button>
        </div>
      </form>
    </main>
  );
}

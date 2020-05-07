import React, { useState, useEffect } from "react";
import "./styles.css";

function PokemonInfo({ pokemonName }) {
  const [pokemon, setPokemon] = useState(null);
  // Fetch request is a asynchronous function,
  // should be written in useEffect for handling side effects.
  useEffect(() => {
    if (!pokemonName) {
      return;
    }
    fetchPokemon(pokemonName).then(pokemonData => {
      setPokemon(pokemonData);
    });
  }, [pokemonName]);

  if (!pokemonName) {
    return "Submit a Pokemon";
  }

  if (!pokemon) {
    return "...";
  }

  return <pre>{JSON.stringify(pokemon, null, 2)}</pre>;
}

export default function App() {
  const [pokemonName, setPokemonName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setPokemonName(event.target.elements.pokemonName.value);
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label htmlFor="pokemonName">Pokemon Name</label>
        <div>
          <input id="pokemonName" />
          <button type="submit">Submit</button>
        </div>
      </form>
      <PokemonInfo pokemonName={pokemonName} />
    </div>
  );
}

function fetchPokemon(name) {
  const pokemonQuery = `
    query ($name: String) {
      pokemon(name: $name) {
        id
        number
        name
        attacks {
          special {
            name
            type
            damage
          }
        }
      }
    }
  `;

  return window
    .fetch("https://graphql-pokemon.now.sh", {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8"
      },
      body: JSON.stringify({
        query: pokemonQuery,
        variables: { name }
      })
    })
    .then(r => r.json())
    .then(response => response.data.pokemon);
}

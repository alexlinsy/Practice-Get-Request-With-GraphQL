import React, { useState, useEffect } from "react";
import "./styles.css";

function PokemonInfo({ pokemonName }) {
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");
  // Fetch request is a asynchronous function,
  // should be written in useEffect for handling side effects.
  useEffect(() => {
    if (!pokemonName) {
      return;
    }
    setStatus("Pending");
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setStatus("Resolved");
        setPokemon(pokemonData);
      },
      errorData => {
        setStatus("Rejected");
        setError(errorData);
      }
    );
  }, [pokemonName]);

  if (status === "idle") {
    return "Submit a Pokemon";
  }

  if (error && status === "Rejected") {
    return "Oh no...";
  }

  if (status === "Pending") {
    return "...";
  }

  if (status === "Resolved") {
    return <pre>{JSON.stringify(pokemon, null, 2)}</pre>;
  }
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

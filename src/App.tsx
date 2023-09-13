import { useRef } from 'react';

import './App.css';

import Pokebox from 'components/Pokebox/Pokebox';
import Gameboard from 'components/Gameboard/Gameboard';
import Info from 'components/Info/Info';
import Stats from 'components/Stats/Stats';

import poke_data from 'data/poke_data.json';

function App() {
    const statsButton: any = useRef();
    const infoButton: any = useRef();
    let origin_time = new Date('9/1/2023');
    let current_time = new Date();
    let day_idx = Math.floor(
        (current_time.getTime() - origin_time.getTime()) / (1000 * 3600 * 24),
    );
    let curr_pokemon = poke_data[day_idx];
    let pokemon_list = poke_data.map((pokemon) => pokemon.name);

    const pokeData = {
        dayOffset: day_idx,
        currPokemon: curr_pokemon,
        pokeList: pokemon_list,
    };

    return (
        <>
            <header>
                <svg
                    ref={infoButton}
                    id="info-button"
                    className="header-button"
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"></path>
                </svg>
                squirdle
                <svg
                    ref={statsButton}
                    id="stats-button"
                    className="header-button"
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z"></path>
                </svg>
            </header>
            <main>
                <Pokebox {...pokeData.currPokemon} />
                <Gameboard
                    dayOffset={pokeData.dayOffset}
                    currPokemon={pokeData.currPokemon.name}
                    pokeList={pokeData.pokeList}
                />
                <Info ref={infoButton} />
                <Stats ref={statsButton} />
            </main>
        </>
    );
}

export default App;

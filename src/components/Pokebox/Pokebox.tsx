import romanize from 'util/romanize';
import './Pokebox.css';

function Pokebox(currPokemon: {
    id: number;
    gen: number;
    species: string;
    height: number;
    weight: number;
    types: string[];
}) {
    const url =
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' +
        currPokemon.id +
        '.png';

    return (
        <div id="pokebox">
            <img
                className="pokeimg img-hidden placeholder"
                src={url}
                loading="eager"
            />
            <table className="pokeinfo">
                <tbody>
                    <tr>
                        <td className="property">GEN</td>
                        <td className="property-value">
                            {romanize(currPokemon.gen)}
                        </td>
                    </tr>
                    <tr>
                        <td className="property">SPECIES</td>
                        <td className="property-value property-hidden r-1">
                            {currPokemon.species}
                        </td>
                    </tr>
                    <tr>
                        <td className="property">HT., WT.</td>
                        <td className="property-value property-hidden r-2">
                            {currPokemon.height / 10} m,{' '}
                            {currPokemon.weight / 10} kg
                        </td>
                    </tr>
                    <tr>
                        <td className="property">TYPE</td>
                        <td className="property-value property-hidden r-3">
                            {currPokemon.types.map((type, i: number) => (
                                <span
                                    key={i}
                                    className={`poke-type type-${type}`}
                                >
                                    {type.toUpperCase()}
                                </span>
                            ))}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Pokebox;

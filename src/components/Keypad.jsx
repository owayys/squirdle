import './Keypad.css';
import { MdOutlineBackspace, MdOutlineKeyboardReturn } from 'react-icons/md';

const Keypad = ({ handleClick }) => {

    const keys = [
        [{ key: 'Q', id: 'Q' }, { key: 'W', id: 'W' }, { key: 'E', id: 'E' }, { key: 'R', id: 'R' }, { key: 'T', id: 'T' }, { key: 'Y', id: 'Y' }, { key: 'U', id: 'U' }, { key: 'I', id: 'I' }, { key: 'O', id: 'O' }, { key: 'P', id: 'P' }],
        [{ key: 'A', id: 'A' }, { key: 'S', id: 'S' }, { key: 'D', id: 'D' }, { key: 'F', id: 'F' }, { key: 'G', id: 'G' }, { key: 'H', id: 'H' }, { key: 'J', id: 'J' }, { key: 'K', id: 'K' }, { key: 'L', id: 'L' }],
        [{ key: <MdOutlineKeyboardReturn />, id: 'Enter' }, { key: 'Z', id: 'Z' }, { key: 'X', id: 'X' }, { key: 'C', id: 'C' }, { key: 'V', id: 'V' }, { key: 'B', id: 'B' }, { key: 'N', id: 'N' }, { key: 'M', id: 'M' }, { key: <MdOutlineBackspace />, id: 'Backspace' }]
    ]

    return (
        <div className='keyboard-cont'>
            {keys.map((row, row_i) => {
                return (
                    <div key={row_i} className='keyboard-row'>
                        {row.map((letter, letter_i) => {
                            return (
                                <button id={letter.id} key={letter_i} className='keyboard-button' onClick={(e) => handleClick(e.currentTarget)}>{letter.key}</button>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default Keypad;
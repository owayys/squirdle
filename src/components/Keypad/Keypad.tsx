import './Keypad.css';

function Keypad({ handleKey, currBoard, rightGuessString }: any) {
    console.log(currBoard, rightGuessString);

    const rightGuess: string[] = Array.from(rightGuessString);

    let keyColors: { [key: string]: string } = {};

    for (let i = 0; i < currBoard.length; i++) {
        for (let j = 0; j < rightGuess.length; j++) {
            if (currBoard[i][j] === rightGuess[j]) {
                keyColors[rightGuess[j]] = 'green';
            } else if (rightGuessString.includes(currBoard[i][j])) {
                if (keyColors[rightGuess[j]] !== 'green') {
                    keyColors[rightGuess[j]] = '#FFC800';
                }
            } else {
                keyColors[currBoard[i][j]] = '#303F47';
            }
        }
    }

    const keys = [
        [
            { key: 'Q', id: 'Q' },
            { key: 'W', id: 'W' },
            { key: 'E', id: 'E' },
            { key: 'R', id: 'R' },
            { key: 'T', id: 'T' },
            { key: 'Y', id: 'Y' },
            { key: 'U', id: 'U' },
            { key: 'I', id: 'I' },
            { key: 'O', id: 'O' },
            { key: 'P', id: 'P' },
        ],
        [
            { key: 'A', id: 'A' },
            { key: 'S', id: 'S' },
            { key: 'D', id: 'D' },
            { key: 'F', id: 'F' },
            { key: 'G', id: 'G' },
            { key: 'H', id: 'H' },
            { key: 'J', id: 'J' },
            { key: 'K', id: 'K' },
            { key: 'L', id: 'L' },
        ],
        [
            {
                key: (
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path fill="none" d="M0 0h24v24H0V0z"></path>
                        <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7h-2z"></path>
                    </svg>
                ),
                id: 'Enter',
            },
            { key: 'Z', id: 'Z' },
            { key: 'X', id: 'X' },
            { key: 'C', id: 'C' },
            { key: 'V', id: 'V' },
            { key: 'B', id: 'B' },
            { key: 'N', id: 'N' },
            { key: 'M', id: 'M' },
            {
                key: (
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path fill="none" d="M0 0h24v24H0V0z"></path>
                        <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
                    </svg>
                ),
                id: 'Backspace',
            },
        ],
    ];

    return (
        <div className="keyboard-cont">
            {keys.map((row, row_i) => {
                return (
                    <div key={row_i} className="keyboard-row">
                        {row.map((letter, letter_i) => {
                            return (
                                <button
                                    id={letter.id}
                                    key={letter_i}
                                    className="keyboard-button"
                                    style={{
                                        backgroundColor: `${
                                            letter.id.toLowerCase() in keyColors
                                                ? keyColors[
                                                      letter.id.toLowerCase()
                                                  ]
                                                : ''
                                        }`,
                                    }}
                                    onClick={() => handleKey(letter.id)}
                                >
                                    {letter.key}
                                </button>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default Keypad;

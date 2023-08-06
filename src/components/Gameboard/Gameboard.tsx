import { useState, useEffect } from 'react';
import Keypad from 'components/Keypad/Keypad';
import './Gameboard.css';

interface gameData {
    game: {
        boardState: [string, string, string, string, string];
        currentRowIndex: number;
        status: string;
    };
    dayOffset: number;
    stats: {
        averageGuesses: number;
        currentStreak: number;
        gamesPlayed: number;
        gamesWon: number;
        guesses: {
            [key: string | number]: number;
        };
        isOnStreak: boolean;
        maxStreak: number;
        winPercentage: number;
    };
}

const Gameboard = ({
    dayOffset,
    currPokemon,
    pokeList,
}: {
    dayOffset: number;
    currPokemon: string;
    pokeList: string[];
}) => {
    const [data, setData] = useState<gameData>(
        JSON.parse(localStorage.getItem('squirdle') || '{}'),
    );

    let tempData: gameData = {
        game: {
            boardState: ['', '', '', '', ''],
            currentRowIndex: 0,
            status: 'ONGOING',
        },
        dayOffset: dayOffset,
        stats: {
            averageGuesses: 0,
            currentStreak: 0,
            gamesPlayed: 0,
            gamesWon: 0,
            guesses: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                fail: 0,
            },
            isOnStreak: false,
            maxStreak: 0,
            winPercentage: 0,
        },
    };

    if (Object.keys(data).length === 0 || data.dayOffset !== dayOffset) {
        setData(tempData);
        localStorage.setItem('squirdle', JSON.stringify(tempData));
    }

    const NUMBER_OF_GUESSES = 5;
    let guessesRemaining = data
        ? data.game.status === 'WIN'
            ? 0
            : NUMBER_OF_GUESSES - data.game.currentRowIndex
        : NUMBER_OF_GUESSES;
    let currentGuess: string[] = [];
    let nextLetter = 0;
    let rightGuessString = currPokemon;
    let rightGuess = Array.from(rightGuessString);
    let maxLetters = rightGuessString.length;

    let currBoard = data.game.boardState.map((word) =>
        word !== '' ? word.split('') : Array(maxLetters).join('.').split('.'),
    );

    useEffect(() => {
        if (data.game.status === 'WIN') {
            revealHints(5);
        }
        revealHints(data.game.currentRowIndex);
    }, []);

    const insertLetter = (pressedKey: string) => {
        if (nextLetter === maxLetters) {
            return;
        }
        pressedKey = pressedKey.toLowerCase();

        let row =
            document.querySelectorAll<HTMLElement>('.letter-row')[
                5 - guessesRemaining
            ];
        if (row) {
            let box = row.children[nextLetter];
            box.textContent = pressedKey;
            box.classList.add('filled-box');
            currentGuess.push(pressedKey);
            nextLetter += 1;
        }
    };

    const deleteLetter = () => {
        let row =
            document.getElementsByClassName('letter-row')[5 - guessesRemaining];
        let box = row.children[nextLetter - 1];
        box.textContent = '';
        box.classList.remove('filled-box');
        currentGuess.pop();
        nextLetter -= 1;
    };

    const shadeKeyBoard = (letter: string, color: string) => {
        const keyboardButtons =
            document.querySelectorAll<HTMLElement>('.keyboard-button');

        for (const elem of keyboardButtons) {
            if (elem.textContent !== null) {
                if (elem.textContent.toLowerCase() === letter.toLowerCase()) {
                    let oldColor = elem.style.backgroundColor;
                    if (oldColor === 'green') {
                        return;
                    }

                    if (oldColor === '#FFC800' && color !== 'green') {
                        return;
                    }

                    elem.style.backgroundColor = color;
                    break;
                }
            }
        }
    };

    function revealHints(n: number) {
        let r1 = document.getElementsByClassName('r-1')[0];
        let r2 = document.getElementsByClassName('r-2')[0];
        let r3 = document.getElementsByClassName('r-3')[0];
        let pokeImg = document.getElementsByClassName('pokeimg')[0];

        if (n >= 1) {
            r1.classList.remove('property-hidden');
            r1.classList.add('property-revealed');
        }
        if (n >= 2) {
            r2.classList.remove('property-hidden');
            r2.classList.add('property-revealed');
        }
        if (n >= 3) {
            r3.classList.remove('property-hidden');
            r3.classList.add('property-revealed');
        }
        if (n >= 4) {
            pokeImg.classList.remove('placeholder');
            pokeImg.classList.add('property-revealed');
        }
        if (n >= 5) {
            pokeImg.classList.remove('img-hidden');
            pokeImg.classList.add('property-revealed');
        }
    }

    const checkGuess = () => {
        let row =
            document.querySelectorAll<HTMLElement>('.letter-row')[
                5 - guessesRemaining
            ];

        if (!row) {
            console.log('no row');
            return;
        }

        let guessString = '';
        let rightGuess = Array.from(rightGuessString);

        for (const val of currentGuess) {
            guessString += val;
        }

        if (guessString.length != maxLetters) {
            // alert("Not enough letters!")
            row.classList.add('shake');

            // Buttons stops to shake after 2 seconds
            setTimeout(() => {
                row.classList.remove('shake');
            }, 300);
            return;
        }

        if (!pokeList.includes(guessString)) {
            row.classList.add('shake');

            // Buttons stops to shake after 2 seconds
            setTimeout(() => {
                row.classList.remove('shake');
            }, 300);
            return;
        }

        for (let i = 0; i < maxLetters; i++) {
            let letterColor = '';
            let box = row.children[i] as HTMLElement;
            let letter = currentGuess[i];

            let letterPosition = rightGuess.indexOf(currentGuess[i]);
            if (letterPosition === -1) {
                letterColor = '#303F47';
            } else {
                if (currentGuess[i] === rightGuess[i]) {
                    letterColor = 'green';
                } else {
                    letterColor = '#FFC800';
                }

                rightGuess[letterPosition] = '#';
            }

            let delay = 250 * i;
            setTimeout(() => {
                box.style.backgroundColor = letterColor;
                box.style.borderColor = letterColor;
                box.classList.add('box-revealed');
                shadeKeyBoard(letter, letterColor);
            }, delay);
        }

        if (guessString === rightGuessString) {
            // alert("You guessed right! Game over!")
            revealHints(5);
            data.game.status = 'WIN';
            data.game.boardState[data.game.currentRowIndex] = guessString;
            data.game.currentRowIndex = NUMBER_OF_GUESSES - guessesRemaining;
            data.stats.currentStreak += 1;
            data.stats.gamesWon += 1;
            data.stats.guesses[NUMBER_OF_GUESSES - guessesRemaining + 1] += 1;
            setData(data);

            localStorage.setItem('squirdle', JSON.stringify(data));
            guessesRemaining = 0;

            return;
        } else {
            guessesRemaining -= 1;
            currentGuess = [];
            nextLetter = 0;

            if (guessesRemaining > 1) {
                let currReveal = document.getElementsByClassName(
                    `r-${5 - guessesRemaining}`,
                )[0];
                currReveal.classList.remove('property-hidden');
                currReveal.classList.add('property-revealed');
            } else {
                let pokeImg = document.getElementsByClassName('pokeimg')[0];
                pokeImg.classList.remove('placeholder');
                pokeImg.classList.add('property-revealed');
            }

            if (guessesRemaining === 0) {
                revealHints(5);

                data.stats.currentStreak = 0;
                data.stats.guesses['fail'] += 1;
            }
        }

        data.game.boardState[data.game.currentRowIndex] = guessString;
        data.game.currentRowIndex = NUMBER_OF_GUESSES - guessesRemaining;

        localStorage.setItem('squirdle', JSON.stringify(data));
    };

    function handleKey(pressedKey: string) {
        console.log(pressedKey);

        if (guessesRemaining === 0) {
            return;
        }

        if (pressedKey === 'Backspace' && nextLetter !== 0) {
            deleteLetter();
            return;
        }

        if (pressedKey === 'Enter') {
            checkGuess();
            return;
        }

        let found = pressedKey.match(/[a-z]/gi);
        if (!found || found.length > 1) {
            return;
        } else {
            insertLetter(pressedKey);
        }
    }

    document.addEventListener('keyup', (e) => {
        handleKey(e.key);
    });

    return (
        <>
            <div id="game-board">
                {currBoard.map((x, i) => (
                    <div key={i} className="letter-row">
                        {x.map((y, j) => {
                            let letterColor =
                                y !== ''
                                    ? rightGuess.indexOf(y) !== -1
                                        ? rightGuess[j] === y
                                            ? 'green'
                                            : '#FFC800'
                                        : '#303F47'
                                    : '';
                            return (
                                <div
                                    key={j}
                                    className={`letter-box ${
                                        y !== '' ? 'box-revealed' : ''
                                    }`}
                                    style={{
                                        borderColor: letterColor,
                                        backgroundColor: letterColor,
                                    }}
                                >
                                    {y}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            <Keypad handleKey={handleKey} />
        </>
    );
};

export default Gameboard;

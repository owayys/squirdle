import { useState, useEffect } from 'react';
import Keypad from 'components/Keypad/Keypad';
import './Gameboard.css';

import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

interface gameData {
    game: {
        boardState: [string, string, string, string, string];
        currentRowIndex: number;
        status: string;
        timestamps: {
            lastCompleted: number;
            lastPlayed: number;
        };
    };
    dayOffset: number;
    stats: {
        currentStreak: number;
        gamesPlayed: number;
        gamesWon: number;
        guesses: {
            [key: string | number]: number;
        };
        maxStreak: number;
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
            timestamps: {
                lastCompleted: 0,
                lastPlayed: 0,
            },
        },
        dayOffset: dayOffset,
        stats: {
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
            maxStreak: 0,
        },
    };

    if (Object.keys(data).length === 0) {
        setData(tempData);
        localStorage.setItem('squirdle', JSON.stringify(tempData));
        window.dispatchEvent(new Event('storage'));
    } else if (data.dayOffset !== dayOffset) {
        localStorage.setItem(
            'squirdle',
            JSON.stringify({
                game: {
                    boardState: ['', '', '', '', ''],
                    currentRowIndex: 0,
                    status: 'ONGOING',
                    timestamps: data.game.timestamps,
                },
                dayOffset: dayOffset,
                stats: data.stats,
            }),
        );
        window.dispatchEvent(new Event('storage'));
        window.location.reload();
    } else {
        useEffect(() => {
            if (data.game.status === 'WIN' && data.dayOffset === dayOffset) {
                revealHints(5);
            }
            revealHints(data.game.currentRowIndex);
        }, []);
    }

    document.addEventListener('keydown', (e) => {
        e.stopImmediatePropagation();
        if (
            !(
                e.key.match(/^[a-z]$/) ||
                e.key === 'Enter' ||
                e.key === 'Backspace'
            )
        ) {
            return;
        } else if (e.repeat) {
            return;
        } else {
            console.log('key!');
            handleKey(e.key);
        }
    });

    const NUMBER_OF_GUESSES = 5;
    let guessesRemaining = NUMBER_OF_GUESSES;
    let currentGuess: string[] = [];
    let nextLetter = 0;
    let rightGuessString = currPokemon;
    let rightGuess = Array.from(rightGuessString);
    let maxLetters = rightGuessString.length;

    let currBoard = data.game.boardState.map((word) =>
        word !== '' ? word.split('') : Array(maxLetters).join('.').split('.'),
    );

    useEffect(() => {
        currBoard = data.game.boardState.map((word) =>
            word !== ''
                ? word.split('')
                : Array(maxLetters).join('.').split('.'),
        );
        guessesRemaining =
            data.game.status === 'WIN'
                ? 0
                : NUMBER_OF_GUESSES - data.game.currentRowIndex;
    }, [data]);

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
            toastNotif('Not enough letters', 1500);
            row.classList.add('shake');

            setTimeout(() => {
                row.classList.remove('shake');
            }, 300);
            return;
        }

        if (!pokeList.includes(guessString)) {
            toastNotif('Not in Pokémon list', 1500);
            row.classList.add('shake');

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
            toastNotif('Well done!', 1500);
            revealHints(5);

            data.game.status = 'WIN';
            data.game.boardState[data.game.currentRowIndex] = guessString;
            data.game.currentRowIndex = NUMBER_OF_GUESSES - guessesRemaining;

            if (
                (new Date().getTime() - data.game.timestamps.lastPlayed) /
                    (1000 * 3600 * 24) <
                    1 ||
                data.game.timestamps.lastPlayed === 0
            ) {
                data.stats.currentStreak += 1;
            } else {
                data.stats.currentStreak = 0;
            }

            if (data.stats.currentStreak > data.stats.maxStreak) {
                data.stats.maxStreak = data.stats.currentStreak;
            }

            data.stats.gamesWon += 1;
            data.stats.gamesPlayed += 1;
            data.stats.guesses[NUMBER_OF_GUESSES - guessesRemaining + 1] += 1;
            data.game.timestamps.lastCompleted = new Date().getTime();
            data.game.timestamps.lastPlayed = new Date().getTime();

            setData(data);

            localStorage.setItem('squirdle', JSON.stringify(data));
            window.dispatchEvent(new Event('storage'));
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
                toastNotif(rightGuessString.toUpperCase(), -1);

                revealHints(5);

                data.game.status = 'LOSE';
                data.stats.currentStreak = 0;
                data.stats.guesses['fail'] += 1;
                data.stats.gamesPlayed += 1;
                data.game.timestamps.lastPlayed = new Date().getTime();
            }
        }

        data.game.boardState[data.game.currentRowIndex] = guessString;
        data.game.currentRowIndex = NUMBER_OF_GUESSES - guessesRemaining;

        localStorage.setItem('squirdle', JSON.stringify(data));
        window.dispatchEvent(new Event('storage'));
    };

    function handleKey(pressedKey: string) {
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

    function toastNotif(msg: string, dur: number) {
        Toastify({
            text: msg,
            className: 'toast',
            duration: dur,
            newWindow: true,
            gravity: 'top', // `top` or `bottom`
            position: 'center', // `left`, `center` or `right`
        }).showToast();
    }

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
            <Keypad
                handleKey={handleKey}
                currBoard={currBoard}
                rightGuessString={rightGuessString}
            />
        </>
    );
};

export default Gameboard;

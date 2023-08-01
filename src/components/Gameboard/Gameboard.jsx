import { useState, useEffect } from "react";
import Keypad from '../Keypad/Keypad.jsx';
import './Gameboard.css'

const Gameboard = ({ dayOffset, currPokemon, pokeList }) => {
    const [data, setData] = useState(JSON.parse(localStorage.getItem('squirdle')))

    if (data === null || data.dayOffset !== dayOffset) {
        setData({ game: { boardState: ["", "", "", "", ""], currentRowIndex: 0, status: "ONGOING" }, dayOffset: dayOffset })
        localStorage.setItem('squirdle', JSON.stringify({ game: { boardState: ["", "", "", "", ""], currentRowIndex: 0, status: "ONGOING" }, dayOffset: dayOffset }))
    }

    const NUMBER_OF_GUESSES = 5;
    let guessesRemaining = data ? NUMBER_OF_GUESSES - data.game.currentRowIndex : NUMBER_OF_GUESSES;
    let currentGuess = [];
    let nextLetter = 0;
    let rightGuessString = currPokemon;
    let rightGuess = Array.from(rightGuessString)
    let maxLetters = rightGuessString.length;

    let currBoard = data.game.boardState.map((word) => word !== "" ? word.split('') : Array(maxLetters).join(".").split("."))

    console.log(data.game.currentRowIndex)
    revealHints(data.game.currentRowIndex)

    const handleClick = (e) => {
        handleKey(e.id)
    }

    const insertLetter = (pressedKey) => {
        if (nextLetter === maxLetters) {
            return
        }
        pressedKey = pressedKey.toLowerCase()

        let row = document.getElementsByClassName("letter-row")[5 - guessesRemaining]
        let box = row.children[nextLetter]
        box.textContent = pressedKey
        box.classList.add("filled-box")
        currentGuess.push(pressedKey)
        nextLetter += 1
    }

    const deleteLetter = () => {
        let row = document.getElementsByClassName("letter-row")[5 - guessesRemaining]
        let box = row.children[nextLetter - 1]
        box.textContent = ""
        box.classList.remove("filled-box")
        currentGuess.pop()
        nextLetter -= 1
    }

    const shadeKeyBoard = (letter, color) => {
        for (const elem of document.getElementsByClassName("keyboard-button")) {
            if (elem.textContent.toLowerCase() === letter.toLowerCase()) {
                let oldColor = elem.style.backgroundColor
                if (oldColor === 'green') {
                    return
                }

                if (oldColor === '#FFC800' && color !== 'green') {
                    return
                }

                elem.style.backgroundColor = color
                break
            }
        }
    }

    function revealHints(n) {
        let r1 = document.getElementsByClassName('r-1')[0]
        let r2 = document.getElementsByClassName('r-2')[0]
        let r3 = document.getElementsByClassName('r-3')[0]
        let pokeImg = document.getElementsByClassName('pokeimg')[0];

        if (n >= 1) {
            r1.classList.remove('property-hidden')
            r1.classList.add('property-revealed')
        }
        if (n >= 2) {
            r2.classList.remove('property-hidden')
            r2.classList.add('property-revealed')
        }
        if (n >= 3) {
            r3.classList.remove('property-hidden')
            r3.classList.add('property-revealed')
        }
        if (n >= 4) {
            pokeImg.classList.remove('placeholder')
            pokeImg.classList.add('property-revealed')
        }
        if (n >= 5) {
            pokeImg.classList.remove('img-hidden')
            pokeImg.classList.add('property-revealed')
        }
    }

    const checkGuess = () => {
        let row = document.getElementsByClassName("letter-row")[5 - guessesRemaining]
        let guessString = ''
        let rightGuess = Array.from(rightGuessString)

        for (const val of currentGuess) {
            guessString += val
        }

        if (guessString.length != maxLetters) {
            // alert("Not enough letters!")
            row.classList.add('shake')

            // Buttons stops to shake after 2 seconds
            setTimeout(() => {
                row.classList.remove('shake')
            }, 300);
            return
        }

        if (!pokeList.includes(guessString)) {
            row.classList.add('shake')

            // Buttons stops to shake after 2 seconds
            setTimeout(() => {
                row.classList.remove('shake')
            }, 300);
            return
        }

        for (let i = 0; i < maxLetters; i++) {
            let letterColor = ''
            let box = row.children[i]
            let letter = currentGuess[i]

            let letterPosition = rightGuess.indexOf(currentGuess[i])
            if (letterPosition === -1) {
                letterColor = '#202f36'
            } else {
                if (currentGuess[i] === rightGuess[i]) {
                    letterColor = 'green'
                } else {
                    letterColor = '#FFC800'
                }

                rightGuess[letterPosition] = "#"
            }

            let delay = 250 * i
            setTimeout(() => {
                box.style.backgroundColor = letterColor
                box.style.borderColor = letterColor
                box.classList.add('box-revealed')
                shadeKeyBoard(letter, letterColor)
            }, delay)
        }

        if (guessString === rightGuessString) {
            // alert("You guessed right! Game over!")
            revealHints(5)
            guessesRemaining = 0
            data.game.status = "WIN"
            data.game.boardState[data.game.currentRowIndex] = guessString
            data.game.currentRowIndex = NUMBER_OF_GUESSES - guessesRemaining
            setData(data)

            localStorage.setItem('squirdle', JSON.stringify(data))

            return
        } else {
            guessesRemaining -= 1;
            currentGuess = [];
            nextLetter = 0;

            if (guessesRemaining > 1) {
                let currReveal = document.getElementsByClassName(`r-${5 - guessesRemaining}`)[0]
                currReveal.classList.remove('property-hidden')
                currReveal.classList.add('property-revealed')
            } else {
                let pokeImg = document.getElementsByClassName('pokeimg')[0];
                pokeImg.classList.remove('placeholder')
                pokeImg.classList.add('property-revealed')
            }

            if (guessesRemaining === 0) {
                revealHints(5)
            }
        }

        data.game.boardState[data.game.currentRowIndex] = guessString
        data.game.currentRowIndex = NUMBER_OF_GUESSES - guessesRemaining
        setData(data)

        localStorage.setItem('squirdle', JSON.stringify(data))
    }

    const handleKey = (pressedKey) => {
        if (guessesRemaining === 0) {
            return
        }

        if (pressedKey === "Backspace" && nextLetter !== 0) {
            deleteLetter()
            return
        }

        if (pressedKey === "Enter") {
            checkGuess()
            return
        }

        let found = pressedKey.match(/[a-z]/gi)
        if (!found || found.length > 1) {
            return
        } else {
            insertLetter(pressedKey)
        }
    }

    document.addEventListener("keyup", (e) => {
        handleKey(e.key)
    })

    return (
        <>
            <div id="game-board">
                {
                    currBoard.map((x, i) =>
                        <div key={i} className="letter-row">
                            {
                                x.map((y, j) => {
                                    let letterColor = y !== "" ? (rightGuess.indexOf(y) !== -1 ? (rightGuess[j] === y ? 'green' : '#FFC800') : '#202f35') : ""
                                    return (<div key={j} className={`letter-box box-revealed`} style={{ borderColor: letterColor, backgroundColor: letterColor }}>{y}</div>)
                                }
                                )
                            }
                        </div>
                    )
                }
            </div>
            <Keypad handleClick={handleClick} />
        </>
    )
}

export default Gameboard;
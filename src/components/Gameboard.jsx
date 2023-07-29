// import { useState } from "react";
import Keypad from './Keypad';
import './Gameboard.css'

const Gameboard = ({ currPokemon, pokeList }) => {
    const NUMBER_OF_GUESSES = 5;
    let guessesRemaining = NUMBER_OF_GUESSES;
    let currentGuess = [];
    let nextLetter = 0;
    let rightGuessString = currPokemon;
    let currLetters = rightGuessString.length;

    const handleClick = (e) => {
        handleKey(e.id)
    }

    const insertLetter = (pressedKey) => {
        if (nextLetter === currLetters) {
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

    const checkGuess = () => {
        let row = document.getElementsByClassName("letter-row")[5 - guessesRemaining]
        let guessString = ''
        let rightGuess = Array.from(rightGuessString)

        for (const val of currentGuess) {
            guessString += val
        }

        if (guessString.length != currLetters) {
            // alert("Not enough letters!")
            return
        }

        if (!pokeList.includes(guessString)) {
            alert("pokemon not in list!")
            return
        }

        for (let i = 0; i < currLetters; i++) {
            let letterColor = ''
            let box = row.children[i]
            let letter = currentGuess[i]

            let letterPosition = rightGuess.indexOf(currentGuess[i])
            if (letterPosition === -1) {
                letterColor = '#202f35'
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
                shadeKeyBoard(letter, letterColor)
            }, delay)
        }

        if (guessString === rightGuessString) {
            // alert("You guessed right! Game over!")
            guessesRemaining = 0
            return
        } else {
            guessesRemaining -= 1;
            currentGuess = [];
            nextLetter = 0;

            if (guessesRemaining === 0) {
                // alert("You've run out of guesses! Game over!")
                // alert(`The right word was: "${rightGuessString}"`)
            }
        }
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
                {[...Array(NUMBER_OF_GUESSES)].map((x, i) =>
                    <div key={i} className="letter-row">
                        {[...Array(currLetters)].map((y, j) =>
                            <div key={j} className="letter-box"></div>
                        )}
                    </div>
                )}
            </div>
            <Keypad handleClick={handleClick} />
        </>
    )
}

export default Gameboard;
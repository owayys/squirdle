import { useRef, useEffect } from "react"
import "./Info.css"

function Info () {
    let infoButton: any = document.getElementById('info-button')
    let infoModal: any = useRef().current

    infoButton.addEventListener('click', () => {
        infoModal.current.showModal()
    })

    const closeModal = () => {
        infoModal.current.close();
        infoModal.current.classList.remove('close');
        infoModal.current.removeEventListener('animationend', closeModal);
    }

    useEffect(() => {
        if (infoModal && infoModal.current) {
            infoModal.current.addEventListener('click', (e: MouseEvent) => {
                const dialogDimensions = infoModal.current.getBoundingClientRect()
                if (
                    e.clientX < dialogDimensions.left ||
                    e.clientX > dialogDimensions.right ||
                    e.clientY < dialogDimensions.top ||
                    e.clientY > dialogDimensions.bottom
                ) {
                    infoModal.current.addEventListener('animationend', closeModal);
                    infoModal.current.classList.add('close');
                }
            })
        }
    }, [infoModal])

    return (
        <dialog ref={infoModal} id="info-modal" open={false} >
            <div id="info-div">
                <h1 className="info-heading">How To Play</h1>
                <h2 className="info-heading">Guess the Pokémon in 5 tries.</h2>
                <ul>
                    <li>Each guess must be a valid Pokémon.</li>
                    <li>The color of the tiles will change to show how close your guess was to the Pokémon.</li>
                </ul>
                <p><strong>Examples</strong></p>
                <div className="letter-row info-row">
                    <div className="letter-box box-revealed" style={{ borderColor: 'green', backgroundColor: 'green' }}>C</div>
                    <div className="letter-box">E</div>
                    <div className="letter-box">L</div>
                    <div className="letter-box">E</div>
                    <div className="letter-box">B</div>
                    <div className="letter-box">I</div>
                </div>
                <div className="info-text"><strong>C</strong> is in the Pokémon and in the correct spot.</div>
                <div className="letter-row info-row">
                    <div className="letter-box">P</div>
                    <div className="letter-box">I</div>
                    <div className="letter-box box-revealed" style={{ borderColor: '#FFC800', backgroundColor: '#FFC800' }}>K</div>
                    <div className="letter-box">A</div>
                    <div className="letter-box">C</div>
                    <div className="letter-box">H</div>
                    <div className="letter-box">U</div>
                </div>
                <div className="info-text"><strong>K</strong> is in the Pokémon but in the wrong spot.</div>
                <div className="letter-row info-row">
                    <div className="letter-box">D</div>
                    <div className="letter-box">I</div>
                    <div className="letter-box">A</div>
                    <div className="letter-box">L</div>
                    <div className="letter-box box-revealed" style={{ borderColor: '#303F47', backgroundColor: '#303F47' }}>G</div>
                    <div className="letter-box">A</div>
                </div>
                <div className="info-text"><strong>G</strong> is not in the Pokémon in any spot.</div>
                {/* <hr color="#303F47"></hr> */}
            </div>
        </dialog>
    )
}

export default Info;
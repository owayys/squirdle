import { useRef, useEffect, forwardRef } from 'react';
import './Stats.css';

const Stats = forwardRef(function stats(props, ref) {
    let statsButton: any = ref;
    let statsModal: any = useRef();

    useEffect(() => {
        if (statsButton.current) {
            statsButton.current.addEventListener('click', () => {
                if (!statsModal.current.open) {
                    statsModal.current.showModal();
                }
            });
        }
    }, []);

    function closeModal() {
        statsModal.current.close();
        statsModal.current.classList.remove('close');
        statsModal.current.removeEventListener('animationend', closeModal);
    }

    useEffect(() => {
        if (statsModal && statsModal.current) {
            statsModal.current.addEventListener('click', (e: MouseEvent) => {
                const dialogDimensions =
                    statsModal.current.getBoundingClientRect();
                if (
                    e.clientX < dialogDimensions.left ||
                    e.clientX > dialogDimensions.right ||
                    e.clientY < dialogDimensions.top ||
                    e.clientY > dialogDimensions.bottom
                ) {
                    statsModal.current.addEventListener(
                        'animationend',
                        closeModal,
                    );
                    statsModal.current.classList.add('close');
                }
            });
        }
    }, [statsModal]);

    return (
        <dialog ref={statsModal} id="stats-modal" open={false}>
            <div id="stats-div">
                <h1 className="stats-heading">How To Stats</h1>
                <h2 className="stats-heading">Guess the Pokémon in 5 tries.</h2>
                <ul>
                    <li>Each guess must be a valid Pokémon.</li>
                    <li>
                        The color of the tiles will change to show how close
                        your guess was to the Pokémon.
                    </li>
                </ul>
                <p>
                    <strong>Examples</strong>
                </p>
                <div className="letter-row stats-row">
                    <div
                        className="letter-box box-revealed"
                        style={{
                            borderColor: 'green',
                            backgroundColor: 'green',
                        }}
                    >
                        C
                    </div>
                    <div className="letter-box">E</div>
                    <div className="letter-box">L</div>
                    <div className="letter-box">E</div>
                    <div className="letter-box">B</div>
                    <div className="letter-box">I</div>
                </div>
                <div className="stats-text">
                    <strong>C</strong> is in the Pokémon and in the correct
                    spot.
                </div>
                <div className="letter-row stats-row">
                    <div className="letter-box">P</div>
                    <div className="letter-box">I</div>
                    <div
                        className="letter-box box-revealed"
                        style={{
                            borderColor: '#FFC800',
                            backgroundColor: '#FFC800',
                        }}
                    >
                        K
                    </div>
                    <div className="letter-box">A</div>
                    <div className="letter-box">C</div>
                    <div className="letter-box">H</div>
                    <div className="letter-box">U</div>
                </div>
                <div className="stats-text">
                    <strong>K</strong> is in the Pokémon but in the wrong spot.
                </div>
                <div className="letter-row stats-row">
                    <div className="letter-box">D</div>
                    <div className="letter-box">I</div>
                    <div className="letter-box">A</div>
                    <div className="letter-box">L</div>
                    <div
                        className="letter-box box-revealed"
                        style={{
                            borderColor: '#303F47',
                            backgroundColor: '#303F47',
                        }}
                    >
                        G
                    </div>
                    <div className="letter-box">A</div>
                </div>
                <div className="stats-text">
                    <strong>G</strong> is not in the Pokémon in any spot.
                </div>
                {/* <hr color="#303F47"></hr> */}
            </div>
        </dialog>
    );
});

export default Stats;

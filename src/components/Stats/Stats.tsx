import { useRef, useEffect, useState, forwardRef, Ref } from 'react';
import './Stats.css';

const Stats = forwardRef(function stats(_: unknown, ref: Ref<HTMLDivElement>) {
    let statsButton: any = ref;
    let statsModal: any = useRef();

    let tempStorage = JSON.parse(localStorage.getItem('squirdle') || '{}');

    const [stats, setStats] = useState(
        tempStorage.stats || {
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
    );

    window.addEventListener('storage', () => {
        console.log('Change to local storage!');
        tempStorage = JSON.parse(localStorage.getItem('squirdle') || '{}');

        setStats(tempStorage.stats);
    });

    const [maxGuesses, setMaxGuesses] = useState(0);

    useEffect(() => {
        setMaxGuesses(
            Math.max(
                stats.guesses[1],
                stats.guesses[2],
                stats.guesses[3],
                stats.guesses[4],
                stats.guesses[5],
            ),
        );
    }, [stats]);

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
                <h1 className="stats-heading">Statistics</h1>
                <div className="stats-cont">
                    <div className="stat-box">
                        <div className="stat-value">{stats.gamesPlayed}</div>
                        <div className="stat-name">PLAYED</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-value">
                            {stats.gamesPlayed > 0
                                ? (stats.gamesWon / stats.gamesPlayed) * 100
                                : 0}
                        </div>
                        <div className="stat-name">WIN %</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-value">{stats.currentStreak}</div>
                        <div className="stat-name">CURR STREAK</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-value">{stats.maxStreak}</div>
                        <div className="stat-name">MAX STREAK</div>
                    </div>
                </div>
                <div className="guess-cont">
                    <p>
                        <strong>Guess distribution</strong>
                    </p>
                    {Array.from({ length: 5 }, (_, k) => k + 1).map((n, i) => {
                        return (
                            <div key={i} className="guess-box">
                                <div className="guess-value">{n}</div>
                                <div className="guess-bar-outer">
                                    <div
                                        className={`guess-bar-inner ${
                                            stats.guesses[n] === maxGuesses &&
                                            maxGuesses > 0
                                                ? 'max-guess'
                                                : ''
                                        }`}
                                        style={{
                                            width: `${
                                                stats.guesses[n] > 0
                                                    ? (stats.guesses[n] /
                                                          maxGuesses) *
                                                      100
                                                    : 7
                                            }%`,
                                        }}
                                    >
                                        <div className="guess-count">
                                            {stats.guesses[n]}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </dialog>
    );
});

export default Stats;

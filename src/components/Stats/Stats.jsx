import { useRef, useEffect } from "react"
import "./Stats.css"

const Stats = () => {
    let statsButton = document.getElementById('stats-button')
    let statsModal = useRef()

    statsButton.addEventListener('click', () => {
        statsModal.current.showModal()
    })

    useEffect(() => {
        if (statsModal && statsModal.current) {
            statsModal.current.addEventListener('click', (e) => {
                const dialogDimensions = statsModal.current.getBoundingClientRect()
                if (
                    e.clientX < dialogDimensions.left ||
                    e.clientX > dialogDimensions.right ||
                    e.clientY < dialogDimensions.top ||
                    e.clientY > dialogDimensions.bottom
                ) {
                    statsModal.current.close()
                }
            })
        }
    }, [statsModal])

    return (
        <dialog ref={statsModal} id="stats-modal" open={false} >
            <div id="stats-div">yo</div>
        </dialog>
    )
}

export default Stats;
import React from 'react'
import './styles.scss'

function PassEye(props: { eyeSlash: boolean, cb: () => void }) {
    return (
        <div
            onClick={props.cb}
            className="eye-slash"
        >
            <span><i className={`fas ${props.eyeSlash ? 'fa-eye' : 'fa-eye-slash'}`}/></span>
        </div>
    )
}

export default PassEye

import React, {useState} from 'react'
import OldInput          from "../OldInput"
import PasswordStrength  from "./PasswordStrength"

interface IPassword {
    type: string,
    eyeSlash: boolean
}

function Password(props: { passStr?: boolean, data: { password: string } }) {

    const [state, setState] = useState<IPassword>({
        type    : 'password',
        eyeSlash: false
    })

    const showPasswordHandler = (): void => {
        setState({
            type    : (state.type === 'password') ? 'text' : 'password',
            eyeSlash: !state.eyeSlash
        })
    }


    const inputProps = {
        ...props,
        type: state.type
    }

    return (
        <div style={{position: 'relative'}}>
            <OldInput {...inputProps}/>
            <div
                onClick={showPasswordHandler}
                className="eye-slash"
                style={{
                    position: 'absolute',
                    right   : 15,
                    top     : 12,
                    fontSize: 20
                }}
            >
                <span><i className={`fas ${state.eyeSlash ? 'fa-eye' : 'fa-eye-slash'}`}/></span>
            </div>
            {props.passStr && <PasswordStrength val={props.data.password}/>}
        </div>
    )
}

export default Password

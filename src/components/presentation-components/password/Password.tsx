import React, {useState} from 'react'
import './styles.scss'
import PassEye           from "./pass-eye/PassEye"

interface IPassword {
    type: string,
    eyeSlash: boolean
}

function Password(props: { data: { name: string, val: string }, onChange: (e: React.ChangeEvent) => void }) {

    const [state, setState] = useState<IPassword>({
        type    : 'password',
        eyeSlash: false
    })

    const showPasswordHandler = (): void => {
        let type = (state.type === 'password') ? 'text' : 'password'
        setState({
            type    : type,
            eyeSlash: !state.eyeSlash
        })
    }

    return (
        <div className={'password'}>
            <input
                value={props.data.val}
                name={props.data.name}
                type={state.type}
                // @ts-ignore
                onKeyPress={props.onChange}
                onChange={props.onChange}
            />
            <PassEye eyeSlash={state.eyeSlash} cb={showPasswordHandler}/>
        </div>
    )
}

export default Password


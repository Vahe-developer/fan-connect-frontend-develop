import React, {useEffect} from 'react'
import './text-input.scss'
import {object}           from '@myfan/commons'
import {ErrorsV2}         from '../../errors/ErrorsV2'
import {withStore}        from '@myfan/store'

interface ITextInput {
    name: string,
    placeholder: string,
    onChange: () => void,
    defaultValue: string,
    type?: string,
    required?: string[],
    data?: string,
    readOnly?: boolean,
    errors: { [key: string]: any }
}

const TextInput = ({
                       name,
                       placeholder,
                       onChange,
                       defaultValue,
                       type = 'text',
                       required,
                       data = '',
                       readOnly = false,
                       errors,
                   }: ITextInput) => {

    useEffect(() => {
        if (object.isEmpty(errors)) return

        if (document.getElementsByClassName('errors')[0]) {
            document
                .getElementsByClassName('errors')[0]
                .scrollIntoView(false)
        }

    })

    const ifRequired = (required && required.includes(name) && !data)
    const isErrorNew = !object.isEmpty(errors[name])

    return (
        <React.Fragment>
            <div className={'simple-input-parent sub-title ' + ((isErrorNew) ? 'border-red' : '')}>
                <input
                    className={'simple-input ' + (ifRequired ? 'color-red' : '')}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    onChange={onChange} autoComplete={'off'}
                    readOnly={readOnly}
                />
            </div>
            { /*
            // @ts-ignore */}
            {isErrorNew && <ErrorsV2 errors={errors[name]}/>}
        </React.Fragment>
    )
}

export default withStore(TextInput, (state: { errors: any; }) => ({errors: state.errors}))

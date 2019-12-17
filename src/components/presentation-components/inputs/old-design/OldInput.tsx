import React, {useEffect} from 'react'
import {Progress}         from 'reactstrap'
import './old-input.scss'
import {ErrorsV2}         from '../../errors/ErrorsV2'
import {isEmpty}          from '@myfan/commons/dist/object'
import {withStore}        from '@myfan/store'

type Props = {
    type: string,
    name: string,
    data: any,
    autoFocus: boolean,
    onChange: () => any,
    currentStep: number,
    maxStep: number,
    refEl: any,
    style: any,
    errors: any
}

const OldInput = ({
                      type = 'text',
                      name,
                      data,
                      autoFocus = false,
                      onChange,
                      currentStep = 1,
                      maxStep = 1,
                      refEl = null,
                      style = {},
                      errors,
                  }: Props) => {

    const isError = !isEmpty(errors[name])

    useEffect(() => {
        if (!isEmpty(errors)) {
            document.getElementsByClassName('errors')[0] &&
            document
                .getElementsByClassName('errors')[0]
                .scrollIntoView(false)
        }

    })

    return (
        <div className={'old-input text'}>
            <span className="error-sign">
                     <input
                         ref={refEl}
                         autoFocus={autoFocus}
                         value={data[name]}
                         name={name}
                         type={type}
                         onKeyUp={onChange}
                         onChange={onChange}
                         style={style}

                     />
                {errors[name] && name !== 'password' && (
                    <i className="fas fa-exclamation-triangle"/>

                )}
             </span>
            <Progress value={currentStep} max={maxStep}/>
            <Progress value={currentStep} max={maxStep}/>
            {maxStep > 1 ? <p className="text-right steps">{currentStep} / {maxStep}</p> :
                <p style={{margin: '8px'}}></p>}
            {isError && <ErrorsV2 errors={errors[name]}/>}
        </div>
    )
}

export default withStore(OldInput, (state: { errors: any; }) => ({errors: state.errors}))

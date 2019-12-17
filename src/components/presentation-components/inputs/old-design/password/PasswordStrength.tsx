import React      from 'react'
import './style.scss'
import {IntlText} from '../../../../intl/IntlText'
import {
    isContainsCapitalLetter,
    isContainsLowercaseLetter,
    isContainsNumber,
    isContainSpeacialChars,
}                 from '@myfan/validation/dist/validations'

export const validate = (val: string): [number, boolean] => {

    let i = 0

    if (val.length >= 8) i += 1
    if (isContainsNumber(val)) i += 1
    if (isContainsCapitalLetter(val) && isContainsLowercaseLetter(val)) i += 1
    if (isContainSpeacialChars(val)) i += 1


    return [i, i === 4]
}

const PasswordStrength = ({
                              val, onValidate = () => {
    },
                          }: { val: string, onValidate?: (valid: boolean) => void }) => {

    let [i, valid] = validate(val)
    onValidate(valid)

    let bgc = 'none'

    if (i === 1) bgc = 'red-bg'
    if (i === 2 || i === 3) bgc = 'orange-bg'
    if (valid) bgc = 'green-bg'

    const createSpans = (): JSX.Element[] => {

        const spans = []

        for (let count = 1; count < 5; count++) {
            spans.push(<span key={count} className={`strength-blocks ${i >= count ? bgc : 'none'}`}></span>)
        }

        return spans
    }

    return (
        <div className={'password-strength text'}>
            <p>{IntlText('password.strength')}</p>
            {createSpans()}
            <p className={` ${(val && val.length >= 8) ? 'green' : ''}`}>
                <i className={`fas fa-check`}/>
                <span>{IntlText('must.be.number.chars.min', {number: 8})}</span>
            </p>
            <p className={`${(val && isContainsNumber(val)) ? 'green' : ''}`}>
                <i className={`fas fa-check `}/>
                <span>{IntlText('must.contain.number')}</span>
            </p>
            <p className={`${(val && isContainsCapitalLetter(val) && isContainsLowercaseLetter(val)) ? 'green' : ''}`}>
                <i className={`fas fa-check `}/>
                <span>{IntlText('must.contain.low.up.letter')}</span>
            </p>
            <p className={`${(val && isContainSpeacialChars(val)) ? 'green' : ''}`}>
                <i className={`fas fa-check`}/>
                <span>{IntlText('must.contain.special.char')}</span>
            </p>
        </div>
    )
}

export default PasswordStrength

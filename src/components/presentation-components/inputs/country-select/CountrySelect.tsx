import React       from 'react'
import DropDown    from '../../../dropdown/DropDown'
// @ts-ignore
import de          from '../../../../locales/de'
import './styles.scss'
import {object}    from '@myfan/commons'
import {ErrorsV2}  from '../../errors/ErrorsV2'
import {withStore} from '@myfan/store'

const countries = require('i18n-iso-countries')
countries.registerLocale(require('i18n-iso-countries/langs/de.json'))

interface ICountrySelect {
    defValue: string,
    placeholder: string,
    required?: string[],
    onChange: () => void,
    errors: { country: any }
}

const CountrySelect = ({defValue, placeholder, required, onChange, errors}: ICountrySelect) => {

    const dropDownList = Object.keys(countries.getNames('de')).map(key => {
        return {id: key, title: countries.getName(key, 'de'), selected: key.toUpperCase() === defValue.toUpperCase()}

    })

    // @ts-ignore
    const countiresGermanOntop = (countries) => {
        const germanKey = countries.findIndex((val: { id: string; }) => {
            return val.id === 'DE'
        })

        const german = countries[germanKey]
        countries.splice(germanKey, 1)
        countries.unshift(german)
        return countries
    }

    const ifRequired = (required && required.includes('country') && !defValue)
    const isError    = !object.isEmpty(errors['country'])

    return (
        <React.Fragment>
            <div
                style={{padding: '1px'}}
                className={(
                    (isError) ? ' border-red ' : ' ') +
                (defValue ? ' black ' : ' color-grey ') +
                (ifRequired ? ' color-red ' : ' ')}
            >
                <DropDown
                    className={'country-select'}
                    name={'country'}
                    data={countiresGermanOntop(dropDownList)}
                    title={defValue ? de[defValue] : placeholder}
                    onSelect={onChange}
                />
            </div>
            {isError && <ErrorsV2 errors={errors['country']}/>}
        </React.Fragment>
    )
}

export default withStore(CountrySelect, (state: { errors: any; }) => ({errors: state.errors}))

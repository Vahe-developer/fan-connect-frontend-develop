import React, {useLayoutEffect, useState}           from 'react'
import './phone.scss'
import './flag.scss'
// @ts-ignore
import countriesWithPhoneCodes                      from "../../../../locales/phone-codes"
import {NationalNumber, parsePhoneNumberFromString} from 'libphonenumber-js'
import DropDown                                     from "../../../dropdown/DropDown"
import {IInput}                                     from "../../../interfaces/interfaces"
import {ErrorsV2}                                   from "../../errors/ErrorsV2"
import {object}                                     from "@myfan/commons"
import {withStore}                                  from "@myfan/store"

interface IPhone {
    code: string,
    number: NationalNumber
}

interface ICounty {
    id: string | number,
    name?: string,
    title: () => any,
    selected: boolean
}

interface IPhoneProps {
    value: string,
    onChange: (e: any) => void,
    placeholder: string,
    required: string[],
    errors: any
}


function Phone(props: IPhoneProps) {

    const [phone, setPhone] = useState<IPhone>({
        code  : "",
        number: ""
    })

    useLayoutEffect(() => {
        setPhone(
            parsedPhone(props.value)
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const parsedPhone = (value: string | null): IPhone => {

        const parsedPhone = parsePhoneNumberFromString(value || '')

        if (parsedPhone === undefined) return {code: "+49", number: ""}

        return {
            code  : "+" + parsedPhone.countryCallingCode,
            number: parsedPhone.nationalNumber
        }
    }

    const handleOnChange = (value: IInput): void => {

        const val = value.target.value

        let code
        let number


        if (typeof val !== "number" && val.includes("+")) {
            code   = val
            number = phone.number
        } else if (val) {
            code   = phone.code
            number = val
        } else {
            code   = "+49"
            number = val
        }

        const phoneNumber = number ? code + number : ''

        // @ts-ignore
        setPhone({
            code  : code,
            number: number
        })
        // @ts-ignore
        props.onChange({target: {name: "phone", value: phoneNumber}})
    }

    const prepareCountries = (): ICounty[] => {

        const prepareCountry = (country: string) => {
            const name = countriesWithPhoneCodes[country]
                    .name
                    .toLowerCase()
                    .charAt(0)
                    .toUpperCase() +
                countriesWithPhoneCodes[country]
                    .name
                    .toLowerCase()
                    .slice(1)

            const code = countriesWithPhoneCodes[country].code
            return {
                id      : "+" + code,
                name    : country,
                title   : () => {
                    return (
                        <div className={'phone-with-flags'}>
                           <span className={`flag ${country.toLowerCase()}`}>

                           </span>
                            <span className={'country-with-code'}>
                               {name + " +" + code}
                           </span>
                        </div>

                    )
                },
                selected: code === phone.code.replace('+', '')
            }
        }

        const german    = prepareCountry("DE")
        const countries = Object.keys(countriesWithPhoneCodes).map(country => prepareCountry(country))

        countries.unshift(german)

        return countries
    }

    const countries = prepareCountries()

    const getSelected = () => {

        let code = "+49"
        let name = "DE"

        const selectedCountry = countries.find(country => country.selected)

        if (selectedCountry !== undefined) {
            // @ts-ignore
            code = selectedCountry.id
            // @ts-ignore
            name = selectedCountry.name
        }

        return (
            <div className={'phone-with-flags'}>
                <div className={`flag ${name ? name.toLowerCase() : ''}`}>

                </div>
                <div className={'country-with-code'}>
                    {code}
                </div>
            </div>
        )
    }

    const {placeholder, value, required, errors} = props
    const ifRequired                             = (required && required.includes('phone') && !value)
    const isError                                = !object.isEmpty(errors['phone'])

    return (
        <React.Fragment>
            <div
                className={'phone-input ' +
                (isError ? ' border-red ' : '') +
                (ifRequired ? ' color-red ' : '')}
            >
                <DropDown
                    name={'phone'}
                    data={countries}
                    title={''}
                    externalSelected={getSelected()}
                    onSelect={handleOnChange}
                />

                <div className={'custom-phone-input ' + (ifRequired ? ' color-red ' : '')}>
                    <input
                        type="text"
                        // @ts-ignore
                        value={phone.number}
                        // @ts-ignore
                        onChange={handleOnChange}
                        placeholder={placeholder}
                    />
                </div>
            </div>
            {isError && <ErrorsV2 errors={errors['phone']}/>}
        </React.Fragment>
    )
}

export default withStore(Phone, (state: { errors: any; }) => ({errors: state.errors}))

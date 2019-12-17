import React, {useEffect, useState} from 'react'
import moment                       from 'moment'
import './birthday.scss'
import 'moment/locale/de'
import UtilsDate                    from '@myfan/commons/dist/utilsDate'
import {IInput}                     from '../../../interfaces/interfaces'
import DropDown                     from '../../../dropdown/DropDown'
import {MonthsShort}                from './moths-sort'
import {withContext, withStore}     from '@myfan/store'
import {ErrorsV2}                   from '../../errors/ErrorsV2'
import {object, string, Types}      from '@myfan/commons'

const STARTDATE = 1900
const ENDDATE   = UtilsDate.currentYear

type IBirthday = {
    year: string,
    month: string,
    day: string
}

interface IBirthdayProps {
    value: string,
    onChange: (e: { target: { name: string; value: string } }) => void,
    placeholder: string,
    required: string [],
    errors: { birthday: any },
    intl: Types.IntlShape
}

function Birthday(props: IBirthdayProps) {

    // @ts-ignore
    const initialDate       = string.isFalsy(props.value) ? UtilsDate.emptyObject : new UtilsDate(props.value).dateObject
    // @ts-ignore
    const [state, setState] = useState<IBirthday>(initialDate)

    const years = () => {
        const years = []
        for (let year = ENDDATE; year >= STARTDATE; year--) {
            years.push(year)
        }

        return years
    }

    const DropDownDays = () => {
        let endDay = 31
        if (state.year && state.month) {
            endDay = moment(state.year + '-' + state.month).daysInMonth()
        }

        const days = []

        for (let day = 1; day <= endDay; day++) {
            days.push(day <= 9 ? '0' + day : day)
        }

        return days.map((value, index) => ({
            title   : value,
            id      : index < 9 ? '0' + (index + 1) : index + 1,
            selected: value === state.day,
        }))
    }

    const DropDownMonths = () => {
        return MonthsShort.map((value, index) => ({
            title   : value,
            id      : index < 9 ? '0' + (index + 1) : index + 1,
            // @ts-ignore
            selected: index + 1 === state.month,
        }))
    }

    const DropDownYears = () => {
        return years().map((value, index) => ({
            title   : value,
            id      : index,
            // @ts-ignore
            selected: value === state.year,
        }))
    }

    const handleChange = (e: IInput) => {

        let value = e.target.value

        if (e.target.name === 'year') {
            // @ts-ignore
            value = years()[e.target.value]
        }

        // @ts-ignore
        setState(prev => ({
            ...prev,
            [e.target.name]: value,
        }))
    }

    useEffect(() => {
        const e        = {target: {name: '', value: ''}}
        e.target.name  = 'birthday'
        e.target.value = UtilsDate.dateToString(state)
        props.onChange(e)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])

    const {value, placeholder, required, errors, intl} = props
    const isRequired                                   = (required && required.includes('birthday') && !value)
    const isError                                      = !object.isEmpty(errors['birthday'])

    const DropDownFields = [
        {
            name       : 'day',
            options    : DropDownDays(),
            placeholder: intl.formatMessage({id: 'day'}),
            selected   : state.day,
            error      : (isError && !state.day),
        },
        {
            name       : 'month',
            options    : DropDownMonths(),
            placeholder: intl.formatMessage({id: 'month'}),
            selected   : MonthsShort[parseInt(state.month) - 1],
            error      : (isError && !state.month),
        },
        {
            name       : 'year',
            options    : DropDownYears(),
            placeholder: intl.formatMessage({id: 'year'}),
            selected   : state.year,
            error      : (isError && !state.year),
        },
    ]

    return (
        <React.Fragment>
            <div
                className={'birthday-input-block ' +
                ((isError) ? ' border-red ' : '') +
                (isRequired ? ' color-red ' : ' ') +
                (value ? ' color-black ' : ' color-grey ')}
            >
                <div className={`birthday-name sub-title ${(value ? '' : ' color-grey ')}`}>
                    {placeholder}
                </div>
                <div className={'birthday-dropdown-wrapper'}>
                    {DropDownFields.map((item, index) => {
                        return (
                            <div key={index} className={`birthday-dropdown ${item.error ? 'color-red ' : ' '}`}>
                                <DropDown
                                    name={item.name}
                                    data={item.options}
                                    onSelect={handleChange}
                                    title={item.placeholder}
                                    externalSelected={item.selected}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
            {isError && <ErrorsV2 errors={errors['birthday']}/>}
        </React.Fragment>
    )
}

export default withContext(withStore(Birthday, (state: { errors: any; }) => ({errors: state.errors})))

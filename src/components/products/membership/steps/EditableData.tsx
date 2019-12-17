import * as React                             from 'react'
import {withContext, withStore, useDispatch}  from '@myfan/store'
import {actions, GlobalState, GlobalContextT} from 'Redux'
import {styled}                               from '@myfan/web-components'
import {Types}                                from '@myfan/commons'

import {
    MaterialInput,
    MaterialCountrySelect,
    PhoneInputFacade,
    MaterialSelect,
    Birthday,
} from '@myfan/web-components'

const Field = styled.div`
`

const InlineField = styled.div`
    display: inline-block
`

type TEditableData = {
    intl: Types.IntlShape,
    data: any,
    setState: (data: any) => void
    errors: { birthday: any }
}

const EditableData: React.FC<TEditableData> = ({intl: {formatMessage}, data: state, setState, errors}) => {

    const dispatch = useDispatch()

    const {
              address: {
                  gender,
                  firstName,
                  middleName,
                  lastName,
                  birthDate,
                  phone,
                  country,
                  city,
                  street,
                  houseNumber,
                  additionalAddress,
                  postalCode,
              },
          } = state

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const name = e.target.name

        setState({
            ...state,
            address: {
                ...state.address,
                [name]: e.target.value,
            },
        })

        dispatch(
            actions.errors.remove(
                {
                    name: name,
                },
            ),
        )
    }

    return (
        <section>
            <Field style={{marginBottom: 20}}>
                <MaterialSelect
                    required
                    value={gender}
                    label={formatMessage({id: 'gender'})}
                    inputProps={{
                        required: true,
                        name    : 'gender',
                        id      : 'gender',
                    }}
                    items={[
                        {value: 'd', label: formatMessage({id: 'diverse'})},
                        {value: 'm', label: formatMessage({id: 'man'})},
                        {value: 'f', label: formatMessage({id: 'woman'})},
                    ]}
                    handleChange={handleChange}
                    errors={errors}
                />
            </Field>
            <Field>
                <MaterialInput
                    materialProps={{
                        required: true,
                        value   : firstName,
                        onChange: handleChange,
                    }}
                    label={formatMessage({id: 'firstName'})}
                    name={'firstName'}
                    errors={errors}
                />
            </Field>
            <Field>
                <MaterialInput
                    materialProps={{
                        required: false,
                        value   : middleName,
                        onChange: handleChange,
                    }}
                    label={formatMessage({id: 'middleName'})}
                    name={'middleName'}
                    errors={errors}
                />
            </Field>
            <Field>
                <MaterialInput
                    materialProps={{
                        required: true,
                        value   : lastName,
                        onChange: handleChange,
                    }}
                    label={formatMessage({id: 'lastName'})}
                    name={'lastName'}
                    errors={errors}
                />
            </Field>
            <Field style={{marginBottom: 12}}>
                <Birthday
                    required
                    name={'birthDate'}
                    onChange={handleChange}
                    value={birthDate}
                    errors={errors}
                />
            </Field>
            <Field style={{marginBottom: 12}}>
                <PhoneInputFacade
                    required
                    onChange={handleChange}
                    data={phone}
                    errors={errors}
                />
            </Field>
            <Field>
                <InlineField style={{width: '75%'}}>
                    <MaterialInput
                        materialProps={{
                            required: true,
                            value   : street,
                            onChange: handleChange,
                        }}
                        label={formatMessage({id: 'street'})}
                        name={'street'}
                        errors={errors}
                    />
                </InlineField>
                <InlineField style={{width: '20%', marginLeft: '4%'}}>
                    <MaterialInput
                        materialProps={{
                            required: true,
                            value   : houseNumber,
                            onChange: handleChange,
                        }}
                        label={formatMessage({id: 'house.number'})}
                        name={'houseNumber'}
                        errors={errors}
                    />
                </InlineField>
            </Field>
            <Field>
                <MaterialInput
                    materialProps={{
                        value   : additionalAddress,
                        onChange: handleChange,
                    }}
                    label={formatMessage({id: 'additional.address'})}
                    name={'additionalAddress'}
                    errors={errors}
                />
            </Field>
            <Field>
                <MaterialInput
                    materialProps={{
                        required: true,
                        value   : postalCode,
                        onChange: handleChange,
                    }}
                    label={formatMessage({id: 'zip'})}
                    name={'postalCode'}
                    errors={errors}
                />
            </Field>
            <Field>
                <MaterialInput
                    materialProps={{
                        required: true,
                        value   : city,
                        onChange: handleChange,
                    }}
                    label={formatMessage({id: 'city'})}
                    name={'city'}
                    errors={errors}
                />
            </Field>
            <Field>
                <MaterialCountrySelect
                    required
                    label={formatMessage({id: 'country'})}
                    handleChange={handleChange}
                    defaultValue={country}
                    errors={errors}
                />
            </Field>
        </section>
    )
}

export default withContext(
    withStore(
        EditableData, (state: GlobalState) => ({errors: state.errors})),
    (ctx: GlobalContextT) => ({intl: ctx.intl}),
)


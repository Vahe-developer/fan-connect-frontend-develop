import React         from 'react'
import {Col, Row}    from 'reactstrap'
import Radio         from '../../../presentation-components/radio-checkbox/Radio'
import TextInput     from '../../../presentation-components/inputs/text/TextInput'
import CountrySelect from '../../../presentation-components/inputs/country-select/CountrySelect'
import {IntlText}    from '../../../intl/IntlText'
import Button        from '../../../presentation-components/buttons/auth/Button'
import Phone         from '../../../presentation-components/inputs/phone/Phone'
import {withContext} from '@myfan/store'
import {Types}       from '@myfan/commons'

interface IClientForm {
    onChange: () => void,
    onClick: () => void,
    required: string[],
    placeholders: { [key: string]: string },
    data: { [key: string]: string },
    fields: string[],
    intl: Types.IntlShape
}

function ClientForm({onChange, onClick, required, placeholders, data, fields, intl}: IClientForm) {

    return (
        <React.Fragment>
            {fields.includes('community') && (
                <Radio
                    title={'Ich bin'}
                    options={[
                        {name: intl.formatMessage({id: 'business.customer'}), value: 'b'},
                        {name: intl.formatMessage({id: 'private.customer'}), value: 'p'},
                    ]}
                    onChange={onChange}
                    data={data.community}
                    name={'community'}
                    required={required}
                />
            )}
            {fields.includes('email') && (
                <Row>
                    <Col>
                        <TextInput
                            name={'email'}
                            type={'email'}
                            placeholder={placeholders.email}
                            onChange={onChange}
                            defaultValue={data.email}
                        />
                    </Col>
                </Row>
            )}
            <Row>
                <Col>
                    <TextInput
                        name={'password'}
                        placeholder={placeholders.password}
                        onChange={onChange}
                        type={'password'}
                        defaultValue={''}
                    />
                </Col>
            </Row>
            {fields.includes('phone') && (
                <Row>
                    <Col>
                        <Phone
                            placeholder={placeholders.phone}
                            value={data.phone}
                            onChange={onChange}
                            required={required}
                            reset={false}
                        />
                    </Col>
                </Row>
            )}

            {fields.includes('birthday') && (
                <Row>
                    <Col>
                        <TextInput
                            name={'birthday'}
                            placeholder={placeholders.birthday}
                            onChange={onChange}
                            defaultValue={data.birthday}
                        />
                    </Col>
                </Row>
            )}

            {fields.includes('gender') && (
                <Radio
                    options={[
                        {name: intl.formatMessage({id: 'woman'}), value: 'f'},
                        {name: intl.formatMessage({id: 'man'}), value: 'm'},
                        {name: intl.formatMessage({id: 'diverse'}), value: 'd'},
                    ]}
                    onChange={onChange}
                    data={data.gender}
                    name={'gender'}
                    required={required}
                />
            )}

            {fields.includes('firstname') && (
                <Row>
                    <Col>
                        <TextInput
                            name={'firstname'}
                            placeholder={placeholders.firstname}
                            onChange={onChange}
                            defaultValue={data.firstname}
                        />
                    </Col>
                </Row>
            )}

            {fields.includes('lastname') && (
                <Row>
                    <Col md={12}>
                        <TextInput
                            name={'lastname'}
                            placeholder={placeholders.lastname}
                            onChange={onChange}
                            defaultValue={data.lastname}
                        />
                    </Col>
                </Row>
            )}

            {(fields.includes('street') && fields.includes('housenumber')) && (
                <Row>
                    <Col md={7} xs={7}>
                        <TextInput
                            name={'street'}
                            placeholder={placeholders.street}
                            onChange={onChange}
                            defaultValue={data.street}
                        />
                    </Col>
                    <Col md={5} xs={5}>
                        <TextInput
                            name={'housenumber'}
                            placeholder={placeholders.housenumber}
                            onChange={onChange}
                            defaultValue={data.housenumber}
                        />
                    </Col>
                </Row>
            )}
            {(fields.includes('street') && !fields.includes('housenumber')) && (
                <Row>
                    <Col>
                        <TextInput
                            name={'street'}
                            placeholder={placeholders.street}
                            onChange={onChange}
                            defaultValue={data.street}
                        />
                    </Col>
                </Row>
            )}

            {fields.includes('city') && !fields.includes('zip') && (
                <Row>
                    <Col>
                        <TextInput
                            name={'city'}
                            placeholder={placeholders.city}
                            onChange={onChange}
                            defaultValue={data.city}
                        />
                    </Col>
                </Row>
            )}

            {!fields.includes('city') && fields.includes('zip') && (
                <Row>
                    <Col>
                        <TextInput
                            name={'zip'}
                            placeholder={placeholders.zip}
                            onChange={onChange}
                            defaultValue={data.zip}
                        />
                    </Col>
                </Row>
            )}

            {fields.includes('city') && fields.includes('zip') && (
                <Row>
                    <Col md={5} xs={5}>
                        <TextInput
                            name={'zip'}
                            placeholder={placeholders.zip}
                            onChange={onChange}
                            defaultValue={data.zip}
                        />
                    </Col>
                    <Col md={7} xs={7}>
                        <TextInput
                            name={'city'}
                            placeholder={placeholders.city}
                            onChange={onChange}
                            defaultValue={data.city}
                        />
                    </Col>
                </Row>
            )}

            {fields.includes('country') && (
                <Row>
                    <Col>
                        <CountrySelect
                            onChange={onChange}
                            defValue={data.country}
                            placeholder={placeholders.country}
                        />
                    </Col>
                </Row>
            )}

            <Button
                onClick={onClick}
                className={'client-reg-form-btn'}
            >
                {IntlText('register.btn')}
            </Button>
        </React.Fragment>
    )
}

export default withContext(ClientForm)

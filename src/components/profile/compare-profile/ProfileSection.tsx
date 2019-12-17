import React, {useState}        from 'react'
import {Col, Row}               from 'reactstrap'
import FieldNames               from '../../presentation-components/fields/FieldNames'
import {request, User}          from '@myfan/base'
import {FCSPID}                 from './constants'
import {IntlText}               from '../../intl/IntlText'
import Button                   from '../../presentation-components/buttons/auth/Button'
import {IFields}                from '../../presentation-components/fields/FieldNames'
import {redirect, url}          from '@myfan/commons/dist/url1'
import {ClientSteps, ClientApp} from '@myfan/clients'

const countries = require('i18n-iso-countries')
countries.registerLocale(require('i18n-iso-countries/langs/de.json'))

const className = {
    up  : 'fas fa-caret-up',
    down: 'fas fa-caret-down',
}

interface IProfileSection {
    requiredFields: any,
    diffFields: any,
    fields: any,
    header: string,
    client: boolean
}

function ProfileSection(props: IProfileSection) {

    const [showAll, setShowAll] = useState<boolean>(false)

    const handleClick = (): void => {
        setShowAll(prev => !prev)
    }

    const isRequiredFieldsFilled = (fields: any): boolean => {
        const {requiredFields} = props
        for (let key of requiredFields) {
            if (requiredFields.includes(key) && !fields[key]) return false
        }
        return true
    }

    const handleSubmit = async (client: string | boolean): Promise<any> => {

        const data = JSON.parse(JSON.stringify(props.fields))

        ClientApp.removeMergingData()

        if (!isRequiredFieldsFilled(data)) {
            if (client === FCSPID) url.addParam('showFcspIdProfile', 'true')
            redirect('/profile', {params: {requiredFields: '1'}})
            return
        }

        delete data.email
        delete data.password
        delete data.hash

        data.access_token = User.session.getAccessToken().getJwtToken()

        await request.put('/profile', data)

        url.addParam('update_data', '1')
        ClientApp.redirectFactory(ClientSteps.CHECK_DATA_PERMISSION)
    }

    const printValue = (fields: IFields, name: string): string => {
        if (fields) {

            if (name === 'gender' && fields[name]) {
                if (fields[name] === 'f') return 'Frau'
                if (fields[name] === 'm') return 'Herr'
                if (fields[name] === 'd') return 'Divers'
            }

            if (name === 'country') return countries.getName(fields[name], 'de')

            // @ts-ignore
            if (fields[name]) return fields[name]

        }
        return ''
    }


    const onlyDiffFields = () => {

        const {fields, diffFields} = props

        if (diffFields) {

            return diffFields.map((name: string, key: number) => {
                return common(key, fields, name)
            })
        }
    }

    const withoutDiffFields = () => {

        const {diffFields, fields} = props

        return Object.keys(FieldNames).filter(name => !diffFields.includes(name) && fields[name]).map((name, key) => {
            return common(key, fields, name)
        })
    }

    const common = (key: number, fields: any, name: string) => {

        // @ts-ignore
        const fielName = FieldNames[name]

        return <p key={key}>
            <span className={'field-name'}>{fielName}: </span>
            <span className={'field-value'}>{printValue(fields, name)}</span>
        </p>
    }

    const {header, client} = props

    return (
        <Row>
            <Col md={12} className={'button-section'} onClick={handleClick}>
                <button>{header}</button>
                <i className={showAll ? className.up : className.down}></i>
            </Col>
            <Col md={12} className={'fields-section'} style={{height: showAll ? '' : '128px'}}>
                {!showAll ? (
                    onlyDiffFields()
                ) : (
                    <React.Fragment>
                        {onlyDiffFields()}
                        {withoutDiffFields()}
                    </React.Fragment>
                )}

            </Col>
            <Col className={'select-profile-section'}>
                <Button
                    onClick={() => handleSubmit(client)}
                >
                    {IntlText('use.this.profile')}
                </Button>
            </Col>
        </Row>
    )
}


export default ProfileSection

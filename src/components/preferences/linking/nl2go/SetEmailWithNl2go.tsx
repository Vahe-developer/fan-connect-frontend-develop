import React                  from 'react'
import {Col, Input, Row}      from 'reactstrap'
import './nl2go-linking.scss'
import LinkLayout             from '../LinkLayout'
import {IntlHtmlText}         from '../../../intl/IntlText'
import Button                 from '../../../presentation-components/buttons/auth/Button'
import {withContext}          from '@myfan/store'
import {Types as CommonTypes} from '@myfan/commons'

interface Props {
    intl: CommonTypes.IntlShape,
    error: any

    handleChange(): void,

    handleClick(): void,
}

const SetEmailWithNl2go = ({intl: {formatMessage: intl}, handleChange, handleClick, error}: Props) => {
    return (
        <LinkLayout
            text={intl({id: 'nl2go.linking.content.text'})}
            policyText={IntlHtmlText('nl2go.policy.text')}
        >
            <div className={'set-email-nl2go'}>
                <div className="error-sign">
                    <Input onChange={handleChange} placeholder="Email Adresse" name='email'/>
                    {error.length !== 0 && (
                        <i className="fas fa-exclamation-triangle"/>
                    )}
                </div>
                <Row className={'subscribe-button-section'}>
                    <Col className="subscribe-button-container">
                        <Button
                            style={{maxWidth: '100px'}}
                            onClick={handleClick}
                        >
                            Abonnieren
                        </Button>
                    </Col>
                </Row>
                {error.length !== 0 && (
                    <div className={'error'}>
                        <p style={{color: 'red'}}>{error}</p>
                    </div>
                )}
            </div>
        </LinkLayout>
    )
}

export default withContext(SetEmailWithNl2go)

import React      from 'react'
import {Row, Col} from 'reactstrap'
import {IntlText} from '../../../intl/IntlText'
import OldInput   from './Register'
import Password   from '../../../presentation-components/inputs/old-design/password/Password'


type RegisterPresentation = {
    config: {
        titleID: string,
        name: string,
        button: any
    },
    buttonProps: any,
    inputProps: any,
    subscriptionEmail: any
}


const RegisterPresentation = ({config, buttonProps, inputProps, subscriptionEmail}: RegisterPresentation) => {
    return (
        <div className={'register-input-button-block center'}>
            <Row>
                <Col>
                    <h6>
                        {IntlText(config.titleID)}
                    </h6>
                    <div className={'email-input'}
                         style={{
                             display: config.name === 'email' ? 'initial' : 'none',
                         }}>
                        <OldInput
                            {...inputProps}
                            style={{
                                pointerEvents: subscriptionEmail ? 'none' : 'initial',
                                background   : subscriptionEmail ? '#DCDCDC' : 'initial',
                            }}
                        />
                    </div>
                    <div className={'password-input'}
                         style={{display: config.name === 'password' ? 'initial' : 'none'}}>
                        <Password passStr {...inputProps} />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    {config.button(buttonProps)}
                </Col>
            </Row>
        </div>
    )

}


export default RegisterPresentation

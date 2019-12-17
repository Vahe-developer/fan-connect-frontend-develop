import React                     from 'react'
import {IntlHtmlText, IntlText}  from '../../intl/IntlText'
import {Link}                    from 'react-router-dom'
import {Container, Col, Row}     from 'reactstrap'
import {url}                     from '@myfan/commons/dist/url1'
import OldInput                  from '../../presentation-components/inputs/old-design/OldInput'
import Password                  from '../../presentation-components/inputs/old-design/password/Password'
import {StepConfig}              from './StepConfigs'
import {ButtonProps, InputProps} from './Login'

interface ILoginPresentation {
    config: StepConfig,
    emailProps: InputProps,
    passProps: InputProps,
    buttonProps: ButtonProps,
    showRegisterLink: boolean
}

function LoginPresentation({
                               config,
                               emailProps,
                               passProps,
                               buttonProps,
                               showRegisterLink,
                           }: ILoginPresentation) {

    return (
        <Container>
            <div className={'login-block'}>
                <Row>
                    <Col>
                        <div className={'login-header title'}>
                            {IntlHtmlText('login.header')}
                        </div>
                    </Col>
                </Row>
                <div className={'login-input-button-block center'}>
                    <Row>
                        <Col>
                            <form autoComplete={'on'}>
                                <h6 className={'sub-title'}>
                                    {IntlText(config.titleID)}
                                </h6>
                                <div className={'email-input'}
                                     style={{display: config.name === 'email' ? 'initial' : 'none'}}>
                                    <OldInput {...emailProps} />
                                </div>
                                <div className={'password-input'}
                                     style={{display: config.name === 'password' ? 'initial' : 'none'}}>
                                    <Password {...passProps} />
                                </div>
                            </form>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {config.button(buttonProps)}
                        </Col>
                    </Row>
                </div>
                <div className="other-suggestions">
                    <div className={'sub-title'}>
                        <Link to={'/forgot-password'}>
                            {IntlText('forgot.pass')}
                        </Link>
                    </div>
                    {showRegisterLink && (
                        <div className={'sub-title'}>
                            <Link to={{pathname: '/register', search: url.search}}>
                                {IntlText('register.new.account')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    )
}

export default React.memo<ILoginPresentation>(LoginPresentation)

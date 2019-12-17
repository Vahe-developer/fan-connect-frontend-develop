import {url, Types, RoutesEnum}                     from '@myfan/commons'
import {Container, Password, MaterialInput, styled} from '@myfan/web-components'
import React, {CSSProperties}                       from 'react'
import {Link}                                       from 'react-router-dom'
import {GlobalState}                                from 'Redux'
import {InputProps, ButtonProps}                    from './Login'
import {StepConfig}                                 from './StepConfigsV2'
import {Club}                                       from '@myfan/base'
import {withStore}                                  from '@myfan/store'

interface ILoginPresentation {
    config: StepConfig,
    inputProps: InputProps,
    buttonProps: ButtonProps,
    data: {
        email: string,
        password: string
    }
    onChange: (event: any) => void
    classes: any,
    intl: Types.IntlShape
    errors: {}
}

const ForgotPSWDWrapper = styled.div`
    margin: 32px 0 8px;
`

const MaterialInputWrapper = styled.div`
    margin-bottom:16px;
`

const InputVisibility = styled.div`
    margin-bottom: 16px;
    &.hide{
        display: none;
    }
`

const LoginPresentationv2: React.FC<ILoginPresentation> = ({
                                                               config,
                                                               inputProps,
                                                               onChange,
                                                               data,
                                                               buttonProps,
                                                               intl,
                                                               errors,
                                                           }) => {
    const passswordStyle: CSSProperties = {
        position: config.name === 'password' ? 'static' : 'absolute',
        top     : '-9999px',
        left    : '-9999px',
    }

    return (
        <Container size="extrasmall">
            <InputVisibility className={`${config.name !== 'email' ? 'hide' : ''}`}>
                <MaterialInput
                    materialProps={{
                        variant: 'outlined',
                    }}
                    name={'email'}
                    onChange={onChange}
                    value={data['email']}
                    label={intl.formatMessage({id: 'login.title'})}
                    errors={errors}
                />
            </InputVisibility>
            <MaterialInputWrapper
                style={passswordStyle}>
                <Password
                    materialProps={{
                        variant: 'outlined',
                    }}
                    onChange={onChange}
                    label={intl.formatMessage({id: 'enter.your.pass'})}
                    data={data['password']}
                    errors={errors}
                />
            </MaterialInputWrapper>
            <div>
                {config.button(buttonProps)}
            </div>
            <ForgotPSWDWrapper className={'text'}>
                <Link
                    style={{
                        color: Club.navbarBg,
                    }}
                    className={'bold'}
                    to={{pathname: RoutesEnum.FORGOT_PASSWORD, search: url.search}}
                >
                    {intl.formatMessage({id: 'forgot.pass'})}
                </Link>
            </ForgotPSWDWrapper>

            <div className={'text'}>
             <span style={{marginRight: '8px'}}>
                {intl.formatMessage({id: 'register.new.account'})}
            </span>
                <Link
                    style={{
                        color: Club.navbarBg,
                    }}
                    className={'bold'}
                    to={{pathname: '/authorization/register', search: url.search}}
                >
                    {intl.formatMessage({id: 'register.btn'})}
                </Link>
            </div>
        </Container>
    )
}

export default withStore(LoginPresentationv2, (store: GlobalState) => ({errors: store.errors}))

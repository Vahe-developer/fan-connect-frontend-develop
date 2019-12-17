import React, {CSSProperties}        from 'react'
import {Password, MaterialInput}     from '@myfan/web-components'
import {withContext, withStore}      from '@myfan/store'
import {GlobalState, GlobalContextT} from 'Redux'
import {TStepConfig}                 from './StepConfigs'
import {InputProps, ButtonProps}     from './Register'
import {Types}                       from '@myfan/commons'

interface ILoginPresentation {
    config: TStepConfig,
    emailProps: InputProps,
    passProps: InputProps,
    buttonProps: ButtonProps,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    intl: Types.IntlShape,
    errors: {
        email: { id: string, values: {} },
        password: { id: string, values: {} }
    },
}

const RegisterPresentationv2: React.FC<ILoginPresentation> = ({
                                                                  intl,
                                                                  config,
                                                                  passProps,
                                                                  emailProps,
                                                                  onChange,
                                                                  buttonProps,
                                                                  errors,
                                                              }) => {
    const passswordStyle: CSSProperties = {
        position: config.name === 'password' ? 'static' : 'absolute',
        top     : '-9999px',
        left    : '-9999px',
    }

    return (
        <>
            <div
                style={{
                    display: config.name === 'email' ? 'initial' : 'none',
                }}>
                <MaterialInput
                    materialProps={{
                        variant: 'outlined',
                    }}
                    name={'email'}
                    onChange={onChange}
                    value={emailProps.data['email']}
                    label={intl.formatMessage({id: 'login.title'})}
                    errors={errors}
                />
            </div>
            <div
                style={passswordStyle}>
                <Password
                    materialProps={{
                        variant: 'outlined',
                    }}
                    onChange={onChange}
                    label={intl.formatMessage({id: 'enter.your.pass'})}
                    data={passProps.data['password']}
                    errors={errors}
                    showRules
                />
            </div>
            <div style={{margin: '16px auto'}}>
                {config.button(buttonProps)}
            </div>
        </>
    )
}

export default withContext(
    withStore(RegisterPresentationv2, (state: GlobalState) => ({errors: state.errors})),
    (ctx: GlobalContextT) => ({intl: ctx.intl}))

import React                       from 'react'
import {STEP_PASSWORD, STEP_EMAIL} from './register-step-constants'
import OldInput                    from '../../../presentation-components/inputs/old-design/OldInput'
import Password                    from '../../../presentation-components/inputs/old-design/password/Password'
import Button                      from '../../../presentation-components/buttons/auth/Button'
import {IntlText}                  from '../../../intl/IntlText'
import {Club}                      from '@myfan/base'

type TButton = {
    onClick(): void,
    goBack(): void,
    disabled: boolean,
}

export type TStepConfig = {
    name: string,
    type: string,
    titleID: string,
    button(Button: TButton): React.FC
}


const StepConfigs = {
    [STEP_EMAIL]   : {
        name     : 'email',
        type     : 'email',
        autoFocus: false,
        input    : (props: any) => <OldInput {...props} />,
        // @ts-ignore
        button   : ({onClick, disabled}) => {
            return (
                <Button
                    onClick={onClick}
                    style={{
                        background: disabled ? 'rgb(162, 163, 170)' : Club.btnBg,
                        color     : disabled ? 'white' : Club.btnC,
                    }}
                >
                    {IntlText('next.step')}
                </Button>
            )
        },
        titleID  : 'login.title',
    },
    [STEP_PASSWORD]: {
        name     : 'password',
        type     : 'password',
        autoFocus: true,
        input    : (props: any) => <Password {...props} passStr/>,
        titleID  : 'enter.your.pass',
        // @ts-ignore
        button   : ({onClick, goBack, disabled}) => {
            return (
                <div>
                    <Button
                        className={'go-back-button ghost'}
                        onClick={goBack}
                    >
                        {IntlText('go.back')}
                    </Button>
                    <Button
                        className={'register-button'}
                        onClick={onClick}
                        style={{
                            background: disabled ? 'rgb(162, 163, 170)' : Club.btnBg,
                            color     : disabled ? 'white' : Club.btnC,
                        }}
                    >
                        {IntlText('register.btn')}
                    </Button>

                </div>
            )
        },
    },
}

export default StepConfigs

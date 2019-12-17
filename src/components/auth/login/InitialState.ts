import {STEP_EMAIL} from './login-step-constants'
import {url}        from '@myfan/commons/dist/url1'

const email = url.getParams()['account_link[email]'] || ''

export interface ILogin {
    data: {
        email: string,
        password: string
    };
    showRegisterLink: boolean,
    disabled: boolean,
    showPolicy: boolean,
    step: number,
    maxStep: number,
    validation: {
        email: string,
        password: string
    }
}

export const InitialState: ILogin = {
    data            : {
        email   : email,
        password: '',
    },
    showRegisterLink: !email,
    disabled        : !email,
    showPolicy      : false,
    step            : STEP_EMAIL,
    maxStep         : 2,
    validation      : {
        email   : 'required|email',
        password: 'required|min:6',
    },
}

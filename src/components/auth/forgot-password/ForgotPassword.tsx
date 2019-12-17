import React, {useState}                      from 'react'
import {
    styled,
    Container,
    MaterialInput,
    MaterialButton,
    PageTitle,
}                                             from '@myfan/web-components'
import {Link}                                 from 'react-router-dom'
import {forgotPassword}                       from '@myfan/auth'
import {Validator}                            from '@myfan/validation'
import {useDispatch, withContext, withStore}  from '@myfan/store'
import {actions, GlobalContextT, GlobalState} from 'Redux'
import {Types}                                from '@myfan/commons'

import './forgot-password.scss'

interface IForgotPassword {
    email: string;
    success: boolean;
    validation: { email: string };
}

type Props = {
    intl: Types.IntlShape,
    errors: {}
}

const MaterialInputWrapper = styled.div`
    margin-bottom:16px;
`

const UpperCasePageTitle = styled(PageTitle)`
    text-transform : uppercase;
`

const ForgotPassword: React.FC<Props> = ({intl, errors}: Props) => {

    const [state, setState] = useState<IForgotPassword>({
        email     : '',
        success   : false,
        validation: {
            email: 'required|email',
        },
    })

    const dispatch = useDispatch()

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const name  = e.target.name
        const value = e.target.value

        setState(prev => ({
            ...prev,
            [name]: value,
        }))

        dispatch(
            actions.errors.remove(
                {
                    name: name,
                },
            ),
        )

    }

    const validate = (): boolean => {

        const {email, validation} = state

        const [errors, isEmpty] = Validator(validation, {email: email})
        if (isEmpty) return true

        actions.errors.set(errors, dispatch)

        return false

    }

    const handleSubmit = (): void => {
        if (!validate()) return
        forgotPassword({email: state.email.toLowerCase()})
            .then(() => setState(prev => ({
                ...prev,
                success: true,
            })))
            .catch(err => actions.errors.set({
                email: {error: intl.formatHTMLMessage({id: err.data.messageId})},
            }, dispatch))
    }

    const successContent = () => {
        return (
            <div>
                <div style={{textAlign: 'center', marginTop: '30px'}} className="success-message title">
                    <p>
                        {intl.formatHTMLMessage({id: 'password.change.success'})}
                    </p>
                    <p>
                        {intl.formatHTMLMessage({id: 'check.your.email'})}
                    </p>
                </div>
            </div>
        )
    }

    const formContent = (props: any) => {
        return (
            <>
                <UpperCasePageTitle
                    className={'bold'}
                    // @ts-ignore
                    dangerouslySetInnerHTML={{__html: intl.formatHTMLMessage({id: 'forgot.password'})}}
                />
                <Container>
                    <MaterialInputWrapper>
                        <MaterialInput
                            materialProps={{
                                variant: 'outlined',
                            }}
                            name={'email'}
                            onChange={onChange}
                            value={state.email}
                            label={intl.formatMessage({id: 'enter.your.email'})}
                            errors={errors}
                        />
                    </MaterialInputWrapper>
                    <MaterialButton
                        onClick={handleSubmit}
                    >
                        {intl.formatHTMLMessage({id: 'send.reset.link'})}
                    </MaterialButton>
                </Container>
            </>
        )
    }

    const {success, email} = state
    const inputProps       = {
        onChange: onChange,
        name    : 'email',
        data    : email,
    }

    const content = success ? successContent() : formContent(inputProps)

    return (
        <Container size="extrasmall">
            <div>
                {content}
                <div className={'center'}>
                    <Link to={'/authorization/login'}>
                        {intl.formatMessage({id: 'go.back'})}
                    </Link>
                </div>
            </div>
        </Container>
    )
}

export default withContext(
    withStore(ForgotPassword, (state: GlobalState) => ({errors: state.errors})),
    (ctx: GlobalContextT) => ({intl: ctx.intl}))

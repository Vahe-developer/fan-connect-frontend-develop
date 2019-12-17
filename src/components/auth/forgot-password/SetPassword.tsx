import React, {useEffect, useState}           from 'react'
import {setPassword}                          from '@myfan/auth'
import {Link}                                 from 'react-router-dom'
import {Password}                             from '@myfan/web-components'
import {request}                              from '@myfan/base'
import {Validator}                            from '@myfan/validation'
import {useDispatch, withContext, withStore}  from '@myfan/store'
import {actions, GlobalContextT, GlobalState} from 'Redux'
import {Types, navigate}                      from '@myfan/commons'
import {
    Container,
    styled,
    MaterialButton,
    PageTitle,
}                                             from '@myfan/web-components'

type TSetPasswordProps = {
    intl: Types.IntlShape,
    errors: {}
    match: { params: any }
    setPassword(data: {
        username: string,
        password: string,
        confirmationCode: string
    }): Promise<{}>,
}

const StatedButton = styled.div`
    margin-top: 24px;
    &.disabled button{
        background-color: rgb(162, 163, 170);
        color: #ffffff;
    }
`

function SetPassword({match, intl, errors}: TSetPasswordProps) {

    const [state, setState] = useState({
        password  : '',
        username  : '',
        disabled  : true,
        success   : false,
        validation: {
            password: 'required|min:8|containNumber|containLowAndUpLetter|containSpecialChar',
        },
    })

    const dispatch = useDispatch()

    useEffect(() => {

        let hash = match.params.hash

        request.get('/username-hash?hash=' + (hash ? hash : ''))
            .then(res => setState(prev => ({
                ...prev,
                username: res.data.username,
            })))
            .catch(() => navigate('/login?invalidHashLink=1'))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {

        const name  = e.target.name
        const value = e.target.value

        setState(prev => ({
            ...prev,
            [name]  : value,
            // @ts-ignore
            disabled: !Validator.test(state.validation.password, {[name]: value}, name),
        }))

        dispatch(actions.errors.remove(
            {
                name: name,
            }),
        )
    }

    const validate = (): boolean => {

        const {password, validation} = state

        const [errors, isEmpty] = Validator(validation, {password: password})
        if (isEmpty) return true

        actions.errors.set(errors, dispatch)

        return false

    }

    const handleSubmit = async (): Promise<void> => {
        if (!validate()) return

        const hash             = match.params.hash
        const confirmationCode = match.params.confirmationCode
        const {username}       = state
        const password         = state.password.trim()

        try {
            const res = await request.post('/check-username-password', {
                username: username,
                password: password,
            })

            if (res.data.previouslyUsed) {

                actions.errors.set({
                    password: {error: intl.formatHTMLMessage({id: 'pass.must.be.diff'})},
                }, dispatch)
                return
            }

            await setPassword({
                username        : username,
                password        : password,
                confirmationCode: confirmationCode ? confirmationCode : '',
            })

            request.post('/store-username-password', {username: username, password: password})
            request.delete('/username-hash', {data: {hash: hash}})
            navigate('/login?passwordChanged=1')

        } catch {
            dispatch(
                actions.notification.set(
                    {
                        msg  : intl.formatHTMLMessage({id: 'something.went.wrong'}),
                        color: 'danger',
                    }),
            )
        }
    }

    const {password, disabled} = state
    const inputProps           = {
        onChange: onChange,
        name    : 'password',
        data    : {password},
    }

    return (
        <>
            <Container size="extrasmall">
                <PageTitle
                    className={'bold'}
                    // @ts-ignore
                    dangerouslySetInnerHTML={{__html: intl.formatHTMLMessage({id: 'set.password'})}}
                />
                <Password
                    materialProps={{
                        variant: 'outlined',
                    }}
                    onChange={inputProps.onChange}
                    label={intl.formatMessage({id: 'please.type.new.password'})}
                    data={inputProps.data.password}
                    errors={errors}
                    showRules
                />
                <StatedButton className={`${disabled && 'disabled'}`}>
                    <MaterialButton
                        onClick={handleSubmit}
                    >
                        {intl.formatHTMLMessage({id: 'submit'})}
                    </MaterialButton>
                </StatedButton>
                <div className={'center'}>
                    <Link to={'/'}>
                        {intl.formatHTMLMessage({id: 'back.to.login'})}
                    </Link>
                </div>
            </Container>
        </>
    )
}

export default withContext(
    withStore(SetPassword, (state: GlobalState) => ({errors: state.errors})),
    (ctx: GlobalContextT) => ({intl: ctx.intl}))

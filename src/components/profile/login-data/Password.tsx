import {User, request}                        from '@myfan/base'
import {withStore, withContext, useDispatch}  from '@myfan/store'
import {Validator}                            from '@myfan/validation'
import React, {useState}                      from 'react'
import {Password, MaterialButton, styled}     from '@myfan/web-components'
import {actions, GlobalState, GlobalContextT} from 'Redux'
import {Types}                                from '@myfan/commons'

interface Props {
    intl: Types.IntlShape
    email: {
        title: string,
        value: string
    }
    errors: {
        oldPass: string
        newPass: string
        repeatPass: string
    }
}

const Section = styled.div`
    margin : 16px 0;
`

const PasswordComponent = ({intl: {formatMessage}, email, errors}: Props) => {

    const validation = {
        oldPass   : 'required',
        newPass   : 'required|min:8|containNumber|containLowAndUpLetter|containSpecialChar',
        repeatPass: `required|match:newPass(${formatMessage({id: 'new.pass'})})`,
    }

    const validationOptions = {
        aliases: {
            oldPass   : formatMessage({id: 'old.password'}),
            newPass   : formatMessage({id: 'password'}),
            repeatPass: formatMessage({id: 'repeat.password'}),
        },
    }

    const dispatch = useDispatch()

    const [state, setState] = useState({
        oldPass   : '',
        newPass   : '',
        repeatPass: '',
    })

    const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {

        const name  = e.target.name
        const value = e.target.value

        setState({
            ...state, [name]: value,
        })

        dispatch(actions.errors.remove({name}))
    }

    const validate = () => {

        const [errors, isEmpty]: any = Validator(validation, state, validationOptions)

        if (isEmpty) return true

        actions.errors.set(errors, dispatch)
        return false
    }

    const onSave = async () => {

        if (!validate()) return

        const userData = {
            username: User.getData()['cognito:username'],
            password: state.newPass.trim(),
        }

        const res = await request.post('/check-username-password', userData)

        if (res.data.previouslyUsed) {
            actions.errors.set({
                newPass: {
                    diff: formatMessage({id: 'pass.must.be.diff'}),
                },
            }, dispatch)
            return
        }

        request.post('/change-password', {
            oldPassword: state.oldPass.trim(),
            newPassword: state.newPass.trim(),
            accessToken: User.session.getAccessToken().getJwtToken(),
        })
            .then(() => {
                request.post('/store-username-password', userData)
                setState({
                    oldPass   : '',
                    newPass   : '',
                    repeatPass: '',
                })
                dispatch(actions.notification.set({
                    msg  : formatMessage({id: 'pass.change.successfully'}),
                    color: 'success',
                }))
            })
            .catch(err => {
                let messageID = ''
                switch (err.data.code) {
                    case 'LimitExceededException':
                        messageID = 'pass.change.limit.exceeded'
                        break
                    default:
                        messageID = 'wrong.password'
                }
                actions.errors.set({
                    oldPass: {
                        diff: formatMessage({id: messageID}),
                    },
                }, dispatch)

            })

    }

    return (
        <>
            <Section>
                <div>
                    <i
                        style={{
                            color      : 'grey',
                            marginRight: 8,
                        }}
                        className={'fas fa-lock'}/>
                    {email.title}
                </div>
                <div className={'disabled'}>
                    {email.value}
                </div>
            </Section>
            <Section>
                <Password
                    materialProps={{}}
                    name={'oldPass'}
                    errors={errors}
                    onChange={onChange}
                    label={formatMessage({id: 'old.password'})}
                    data={state.oldPass}
                />
            </Section>
            <Section>
                <Password
                    materialProps={{}}
                    errors={errors}
                    name={'newPass'}
                    onChange={onChange}
                    label={formatMessage({id: 'new.password'})}
                    data={state.newPass}
                    showRules
                />
            </Section>
            <Section>
                <Password
                    materialProps={{}}
                    name={'repeatPass'}
                    errors={errors}
                    onChange={onChange}
                    label={formatMessage({id: 'repeat.password'})}
                    data={state.repeatPass}
                />
            </Section>
            <MaterialButton
                onClick={onSave}
            >
                {formatMessage({id: 'save.changes'})}
            </MaterialButton>
        </>
    )
}

export default withContext(
    withStore(PasswordComponent, (state: GlobalState) => ({errors: state.errors})),
    (ctx: GlobalContextT) => ({intl: ctx.intl}))

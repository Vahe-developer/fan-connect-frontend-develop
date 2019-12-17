import React, {useState}                     from 'react'
import {IntlText}                            from '../../intl/IntlText'
import Button                                from '../../presentation-components/buttons/auth/Button'
import './styles.scss'
import Popup                                 from 'reactjs-popup'
import {Container, Row, Col}                 from 'reactstrap'
import PasswordStrength
                                             from '../../presentation-components/inputs/old-design/password/PasswordStrength'
import {User, request, Club}                 from '@myfan/base'
import {Validator}                           from '@myfan/validation'
import Password                              from '../../presentation-components/password/Password'
import {useDispatch, withContext, withStore} from '@myfan/store'
import {actions, GlobalState}                from 'Redux'
import {object, Types}                       from '@myfan/commons'
import {ErrorsV2}                            from '../../presentation-components/errors/ErrorsV2'

interface IPasswordState {
    oldPassword: string,
    newPassword: string,
    repeatPassword: string
}

function ChangePassword({intl, errors}: {
    intl: Types.IntlShape,
    errors: {
        oldPassword: any,
        newPassword: any,
        repeatPassword: any
    }
}) {


    const [passwordState, setPasswordState] = useState<IPasswordState>({
        oldPassword   : '',
        newPassword   : '',
        repeatPassword: '',
    })

    const validation = {
        oldPassword   : 'required',
        newPassword   : 'required|min:8|containNumber|containLowAndUpLetter|containSpecialChar',
        repeatPassword: `required|match:newPassword(${intl.formatMessage({id: 'new.pass'})})`,
    }

    const [disabled, setDisabled] = useState(true)
    const dispatch                = useDispatch()

    const onChange = (e: any): void => {

        const name  = e.target.name
        const value = e.target.value

        setPasswordState({
            ...passwordState, [name]: value,
        })

        dispatch(
            actions.errors.remove(
                {
                    name: name,
                },
            ),
        )
    }

    const onSave = async (close: () => void): Promise<void> => {

        if (!validate()) return

        const userData = {
            username: User.getData()['cognito:username'],
            password: passwordState.newPassword.trim(),
        }

        const res = await request.post('/check-username-password', userData)

        if (res.data.previouslyUsed) {
            actions.errors.set({
                newPassword: {
                    diff: IntlText('pass.must.be.diff'),
                },
            }, dispatch)
            return
        }

        request.post('/change-password', {
            oldPassword: passwordState.oldPassword.trim(),
            newPassword: passwordState.newPassword.trim(),
            accessToken: User.session.getAccessToken().getJwtToken(),
        })
            .then(() => {
                request.post('/store-username-password', userData)
                close()
                setPasswordState({
                    oldPassword   : '',
                    newPassword   : '',
                    repeatPassword: '',
                })
                dispatch(actions.notification.set({msg: IntlText('pass.change.successfully'), color: 'success'}))
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
                    oldPassword: {
                        diff: IntlText(messageID),
                    },
                }, dispatch)

            })

    }

    const validate = (): boolean => {

        // @ts-ignore
        const [errors, isEmpty] = Validator(validation, passwordState)

        if (isEmpty) return true

        actions.errors.set(errors, dispatch)
        return false

    }

    const onValidate = (valid: boolean): void => {
        if (valid && passwordState.repeatPassword === passwordState.newPassword) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }

    return (
        <Popup
            trigger={
                <Button
                    className={'ghost mediaMax'}
                >
                    {IntlText('change.password')}
                </Button>
            }
            lockScroll
            modal
            className={'pw-popup-content'}
            closeOnDocumentClick
            contentStyle={{
                border      : 'none',
                width       : '400px',
                padding     : '0!important',
                borderRadius: '16px',
                overflow    : 'hidden',
            }}
            overlayStyle={{
                overflow: 'scroll',
            }}
        >
            {close => (
                <div className={'password-change'}>
                    <div style={{background: Club.btnBg}} className={'password-change-header title'}>
                        {IntlText('change.password')}
                        <span onClick={close}><i className={'fa fa-times'}></i></span>
                    </div>
                    <Container>
                        <Row>
                            <Col sm={12}>
                                <span className={'sub-title'}>
                                    {IntlText('old.password')}
                                    {!object.isEmpty(errors['oldPassword']) && <span style={{color: 'red'}}>*</span>}
                                </span>
                                <Password
                                    data={
                                        {
                                            name: 'oldPassword',
                                            val : passwordState.oldPassword,
                                        }
                                    }
                                    onChange={onChange}
                                />
                                <div className={'errors'}>
                                    <ErrorsV2 errors={errors['oldPassword']}/>)
                                </div>
                            </Col>
                            <Col sm={12}>
                                <span className={'sub-title'}>
                                    {intl.formatMessage({id: 'new.password'})}
                                    {!object.isEmpty(errors['newPassword']) && <span style={{color: 'red'}}>*</span>}
                                </span>
                                <Password
                                    data={
                                        {
                                            name: 'newPassword',
                                            val : passwordState.newPassword,
                                        }
                                    }
                                    onChange={onChange}
                                />
                                <div className={'errors'}>
                                    <ErrorsV2 errors={errors['newPassword']}/>
                                </div>
                            </Col>
                            <Col sm={12}>
                                <PasswordStrength val={passwordState.newPassword} onValidate={onValidate}/>
                            </Col>
                            <Col sm={12}>
                                <span className={'sub-title'}>
                                    {intl.formatMessage({id: 'repeat.password'})}
                                    {!object.isEmpty(errors['repeatPassword']) && <span style={{color: 'red'}}>*</span>}
                                </span>
                                <Password
                                    data={
                                        {
                                            name: 'repeatPassword',
                                            val : passwordState.repeatPassword,
                                        }
                                    }
                                    onChange={onChange}
                                />
                                <div className={'errors'}>
                                    <ErrorsV2 errors={errors['repeatPassword']}/>
                                </div>
                            </Col>
                            <Col sm={12}>
                                <div className={'save-btn'}>
                                    <Button
                                        className={'mediaMax'}
                                        onClick={() => onSave(close)}
                                        style={{
                                            background: disabled ? 'rgb(162, 163, 170)' : Club.btnBg,
                                            color     : disabled ? 'white' : Club.btnC,
                                        }}
                                    >
                                        {IntlText('save.changes')}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </Popup>
    )
}

export default withContext(withStore(ChangePassword, (state: GlobalState) => ({errors: state.errors})))

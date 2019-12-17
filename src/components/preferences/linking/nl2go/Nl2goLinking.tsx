import React, {useState}                     from 'react'
import {request}                             from '@myfan/base'
import {withRouter}                          from 'react-router-dom'
import SetEmailWithNl2go                     from './SetEmailWithNl2go'
import {IntlHtmlText, IntlText}              from '../../../intl/IntlText'
import LinkLayout                            from '../LinkLayout'
import Button                                from '../../../presentation-components/buttons/auth/Button'
import {User}                                from '@myfan/base'
import {isEmail}                             from '@myfan/validation/dist/validations'
import {url}                                 from '@myfan/commons/dist/url1'
import {IInput}                              from '../../../interfaces/interfaces'
import {useDispatch, withContext, withStore} from '@myfan/store'
import {actions, Types}                      from 'Redux'
import {Types as CommonTypes}                from '@myfan/commons'

interface INl2goLinking {
    match: any,
    club: Types.Channels.IClub,
    intl: CommonTypes.IntlShape
}

interface IState {
    email: string,
    error: string,
    reqComplete: boolean,
    successMessage: boolean
}

function Nl2goLinking(props: INl2goLinking) {

    const [state, setState] = useState<IState>({
        email         : '',
        error         : '',
        reqComplete   : false,
        successMessage: false,
    })

    const {intl, club} = props
    const dispatch     = useDispatch()

    const handleChange = (e: IInput): void => {
        const value = e.target.value
        if (typeof value !== 'number') {
            setState(prev => ({
                ...prev,
                email: value.toLowerCase(),
                error: '',
            }))
        }
    }

    const handleNl2goLinking = () => {

        const {userEmail} = club
        const email       = userEmail ? userEmail : state.email
        const hash        = props.match.params.hash

        if (!isEmail(email)) return setState(prev => ({
            ...prev,
            error: intl.formatMessage({
                id: 'invalid.email.address',
            }),
        }))

        if (!hash && !User.hasValidSession()) {
            return request.post('/create-nl2go-account', {email: email})
                .then(() => {
                    setState(prev => ({
                        ...prev,
                        successMessage: true,
                    }))

                    dispatch(
                        actions.notification.set({
                            msg  : IntlText('successfully.nl2go.created'),
                            color: 'success',
                        }),
                    )
                }).catch(() => setState(prev => ({
                    ...prev,
                    error: intl.formatMessage({
                        id: 'email.already.exists',
                    }),
                })))
        }


        request.post('/link-nl2go-account' + (hash ? '/' + hash : ''), {email: email}).then(() => {

            setState(prev => ({
                ...prev,
                successMessage: true,
            }))

            dispatch(
                actions.notification.set({
                    msg  : IntlText('successfully.nl2go.linked'),
                    color: 'success',
                }),
            )

        }).catch(err => dispatch(
            actions.notification.set({
                msg  : IntlText(err.data.messageId),
                color: 'danger',
            }),
        ))
    }

    const renderLinkingContent = () => {

        return (
            <LinkLayout
                text={IntlText('nl2go.linking.content.text')}
                policyText={IntlHtmlText('nl2go.policy.text')}

            >
                <Button
                    onClick={handleNl2goLinking}
                    className={'sub-title'}
                >
                    <i className={'far fa-envelope  icon'}/>
                    {'E-Mail'} hinzufügen
                </Button>
            </LinkLayout>
        )
    }

    const renderReturn = () => {
        if (state.successMessage && !(url.getParam('hash') || User.hasValidSession())) {
            return (
                <p className={'title'} style={{marginTop: '32px'}}>
                    Vielen Dank für Deine Anmeldung.
                    Wir haben Dir eine Bestätigungsmail geschickt.
                    Bitte überprüfe Dein Postfach und bestätige deine Anmeldung
                </p>
            )
        }

        if (!club.userEmail) {
            return <SetEmailWithNl2go
                handleChange={handleChange}
                handleClick={handleNl2goLinking}
                error={state.error}
                policyText={IntlHtmlText('nl2go.policy.text')}
            />
        }
        return renderLinkingContent()
    }

    return renderReturn()
}


export default withRouter(withContext(withStore(Nl2goLinking, (state: { club: any; }) => ({club: state.club}))))

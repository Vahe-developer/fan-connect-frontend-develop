import React                          from 'react'
import {Col, Container}               from 'reactstrap'
import './data-menagment.scss'
import Button                         from '../../presentation-components/buttons/auth/Button'
import PopupFan                       from '../../popup/Popup'
import {request}                      from '@myfan/base'
import {Global, Types as CommonTypes} from '@myfan/commons'
import {withContext, useDispatch}     from '@myfan/store'
import {actions, Types}               from 'Redux'

const classes: { checked: string, unchecked: string } = {
    checked  : 'far fa-times-circle checked',
    unchecked: 'far fa-circle unchecked',
}


const DataManagement = (
    {
        data,
        removeAppConnection,
        intl,
    }: {
        data: Types.Profile.IApp[],
        removeAppConnection: (id: number, dispatcher: Types.Common.DispatchT) => void,
        intl: CommonTypes.IntlShape
    }) => {

    const dispatch = useDispatch()

    const disconnectApp = (appId: number): void => {
        request.post('/disconnect-app', {appId: appId})
            .then(async () => {
                await removeAppConnection(appId, dispatch)
                dispatch(actions.notification.set({
                    msg  : intl.formatMessage({id: 'successfully.disconnected'}),
                    color: 'success',
                }))
            }).catch(() => dispatch(actions.notification.set({msg: 'Please try later', color: 'danger'})))
    }

    const removeIcon = (app: Types.Profile.IApp) => {

        return (
            <PopupFan
                handleYes={() => disconnectApp(app.id)}
                textId={'disconnect.app'}
                textParam={{appName: app.name}}
            >
                <span className={'checkbox'}><i className={classes.checked}/></span>
            </PopupFan>
        )
    }

    const appAndBtn = (app: Types.Profile.IApp) => {
        return (
            <div className={`app-desc sub-title ${!app.permissionSet ? ' connect ' : ''}`}>
                <div className={`${app.name === 'FCSP Ticketing' ? ' italic ' : ''}`}>
                    {app.name}
                    <p className={'text'}>{intl.formatMessage({id: app.desc})}</p>
                </div>
                <Button
                    className={`${app.permissionSet || app.name === 'FCSP Ticketing' ? '  ghost ' : '  '} go-to-link sub-title`}
                    // @ts-ignore
                    onClick={() => Global.window.open(app.loginUri, '_blank')}
                >
                    {app.permissionSet || app.name === 'FCSP Ticketing' ? (
                        <React.Fragment>
                            {app.name === 'FCSP Ticketing' ? ' Link ' : intl.formatMessage({id: 'got.to.app'})}
                            <i className="fas fa-external-link-alt"/>
                        </React.Fragment>
                    ) : (
                        intl.formatMessage({id: 'connect'})
                    )}

                </Button>
            </div>
        )
    }

    return (
        <Container sm={12}>
            <div className={'data-managment'}>
                {data.map(app =>
                    <Col md={12} key={app.id} className={`apps-section ${!app.permissionSet ? ' connect ' : ''}`}>
                        {appAndBtn(app)}
                        {app.permissionSet && removeIcon(app)}
                    </Col>,
                )}
            </div>
        </Container>
    )
}

export default withContext(DataManagement)

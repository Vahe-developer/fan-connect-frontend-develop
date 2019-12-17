import React, {Suspense, useEffect, useState}  from 'react'
import {withRouter}                            from 'react-router-dom'
import {renderRoutes}                          from 'react-router-config'
import {Club, User}                            from '@myfan/base'
import bugsnag                                 from 'bugsnag-js'
// @ts-ignore
import createPlugin                            from 'bugsnag-react'
import {setPathForHubspot}                     from './components/layout/Tracking'
import {getUsercentricDataAndUpdate}           from './components/usercentrics/Usercentrics'
import {Clientlistener}                        from '@myfan/clients'
import {
    string,
    Global,
    url,
    ReactIntl,
    registerListener,
    Url,
    Types as CommonTypes,
    Intl,
}                                              from '@myfan/commons'
import {GlobalContext, withStore, useDispatch} from '@myfan/store'
import {actions, Types}                        from 'Redux'
import {History}                               from 'history'
import './app.scss'
import {ThemeProvider}                         from '@myfan/web-components'
import {protectedRoutes, routes}               from './routes/Routes'


const bugsnagClient = bugsnag({
    apiKey             : '4b49fe27ae496a80109b51431d9ef346',
    notifyReleaseStages: ['production'],
})

bugsnagClient.user = {emailOrHash: string.isFalsy(User.email) ? User.hash : User.email}

Global.add('bugsnag', bugsnagClient)

const BugsnagErrorBoundary = bugsnagClient.use(createPlugin(React))
const FallbackComponent    = () => (
    <div style={{textAlign: 'center', marginTop: '200px'}}>
        Ooops, Something went wrong !!!
        <button
            style={{marginLeft: '8px'}}
            onClick={() => Global.window.location.reload()}
        >
            Retry
        </button>
    </div>
)

function App({intl, history, auth}: { intl: CommonTypes.IntlShape, history: History, auth: Types.Auth.AuthT }) {

    const dispatch                                  = useDispatch()
    const [usercentricsUpdated, usercentricUpdated] = useState<boolean>(false)
    const [sidebarOpen, toggleSidebar]              = useState(false)
    const [show]                                    = useState(Club.isEnabledNavTabs &&
        ((
            new Url().includes('/p') ||
            User.hasValidSession() ||
            !!url.getParam('page')
        ) || !!auth.isAuthenticated))

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!usercentricsUpdated) {
            getUsercentricDataAndUpdate()
            usercentricUpdated(true)
        }
    })

    useEffect(() => {

        Global.register({intl, history})
        registerListener(Global.window, 'message', Clientlistener)

        const unlisten = history.listen(() => {
            Global.window.scrollTo(0, 0)
            dispatch(actions.errors.clear())
            Club.isEnabledHubspot && setPathForHubspot(url.getPathName(), intl)
        })

        return () => unlisten()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const routesToRender = auth.isAuthenticated ? protectedRoutes : routes

    return (
        <ThemeProvider>
            <GlobalContext.Provider value={{
                intl          : Intl.FanIntl.withNoErrors(intl),
                bugsnag       : bugsnagClient,
                isTablet      : Global.window.innerWidth <= 768,
                isMobile      : Global.window.innerWidth <= 425,
                sidebarOpen   : sidebarOpen,
                showSidebar   : show,
                layoutLeftSide: sidebarOpen ? 240 : 56,
                navBarHeight  : 48,
                toggleSidebar : () => toggleSidebar(!sidebarOpen),
            }}>
                <BugsnagErrorBoundary FallbackComponent={FallbackComponent}>
                    <Suspense fallback={null}>
                        {renderRoutes(routesToRender)}
                    </Suspense>
                </BugsnagErrorBoundary>
            </GlobalContext.Provider>
        </ThemeProvider>
    )
}

// @ts-ignore
export default withRouter(ReactIntl.injectIntl(withStore(App, ctx => ({auth: ctx.auth}))))

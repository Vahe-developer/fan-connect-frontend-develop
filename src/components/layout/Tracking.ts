import {User}               from '@myfan/base'
import {url, Global, Types} from '@myfan/commons'
import {getFirstAfterSlash} from '@myfan/commons/dist/utils'

function Tracking(): null {

    // @ts-ignore
    const _hsq = Global.window._hsq = Global.window._hsq || []

    if (User.email) {
        _hsq.push(['identify', {
            email: User.email,
        }])
    }

    return null

}

type pathMapType = {
    login: string,
    register: string,
    profile: string,
    p: string,
    auth: string,
    confirmEmail: string,
    confirmAccountMerge: string,
    'forgot-password': string,
    'set-password': string,
    impressum: string,
    privacy: string,
    'data-permission': string
}

export function setPathForHubspot(path: string, intl: Types.IntlShape): void {

    const pathMap: pathMapType = {
        login              : intl.formatMessage({id: 'nav.login.btn'}),
        register           : intl.formatMessage({id: 'nav.register.btn'}),
        profile            : intl.formatMessage({id: 'nav.profile'}),
        p                  : intl.formatMessage({id: 'nav.preferences'}),
        auth               : 'Auth',
        confirmEmail       : 'ConfirmEmail',
        confirmAccountMerge: 'ConfirmAccountMerge',
        'forgot-password'  : 'ForgotPassword',
        'set-password'     : 'SetPassword',
        impressum          : 'Impressum',
        privacy            : 'Privacy',
        'data-permission'  : 'DataPermission',
    }


    // @ts-ignore
    const title: string = pathMap[getFirstAfterSlash(url.getPathName())]

    document.title = (title && process.env.REACT_APP_PAGE_TITLE) ? title + ' - ' + process.env.REACT_APP_PAGE_TITLE : process.env.REACT_APP_PAGE_TITLE || ''

    // @ts-ignore
    const _hsq = Global.window._hsq = Global.window._hsq || []

    _hsq.push(['setPath', path])
// Track the page view for the new page
    _hsq.push(['trackPageView'])
}

export default Tracking

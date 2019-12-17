import React, {useEffect, useState}        from 'react'
import './data-permission.scss'
import {request}                           from '@myfan/base'
import {IntlHtmlText, IntlText}            from '../intl/IntlText'
import {redirect}                          from '@myfan/commons/dist/url1'
import {redirect as Redirect, url, Routes} from '@myfan/commons'
import {Loadable}                          from '@myfan/web-components'
import {ClientApp}                         from '@myfan/clients'
import Button                              from '../presentation-components/buttons/auth/Button'

export const handleOnClick = async () => {

    const {redirect_uri} = url.getParams()

    const ClientRip = (url: string, additionalInfo: '' | {}) => {
        ClientApp.rip(url, {
            file  : 'DataPermission',
            method: 'handleOnClick',
            additionalInfo,
        })
    }

    try {
        await request.put(Routes.v2.apps.allowDataPermissions.build(), {redirectUri: redirect_uri})

        const authClient = await request.get('/authorize-client' + url.search)
        ClientRip(authClient.data.redirectUrl, 'Everything is ok')
    } catch (e) {
        ClientRip(redirect_uri, {
            error      : e,
            errorString: e.toString(),
        })
    }
}


interface IClientData {
    name: string,
    title: string,
    backToUrl: string,
    privacyUrl: string,
    privacyUrlText: string,
    requiredFields: string[],
    sharedFields: string[],
    logo: string,
    link: string
}

const withDataPermission = (Component: any) => {

    return () => {
        if (!url.getParam('redirect_uri')) {
            redirect('/profile')
            return null
        }
        return <Component/>
    }
}

const DataPermission = () => {

    const [clientData, setClientData] = useState<IClientData>({
        name          : '',
        title         : '',
        backToUrl     : '',
        privacyUrl    : '',
        privacyUrlText: '',
        requiredFields: [],
        sharedFields  : [],
        logo          : '',
        link          : '',
    })

    const [loading, setLoading] = useState<boolean>(true)

    const getClientData = async (): Promise<any> => {
        const getClientRes = await request.get(Routes.v2.apps.getClientData.build(), {params: {redirectUri: url.getParam('redirect_uri')}})
        setClientData(getClientRes.data.data)
    }

    useEffect(() => {
        getClientData()
            .then(() => setLoading(false))
            .catch(() => redirect('/profile'))
    }, [])

    const reqFields    = clientData.requiredFields //.split(', ')
    const sharedFields = clientData.sharedFields //.split(', ')
    const mergedFields = [...new Set([...sharedFields, ...reqFields])]
    const backToUrl    = clientData.backToUrl

    return (
        <Loadable loading={loading}>
            <section className={'permission-main-content'}>
                <img src={clientData.logo} className='eventim-sport-img' alt={''}/>
                <span className={'data-info'}>
                <h3 className={'title'}>
                    <strong>{clientData.name} </strong>
                    {IntlText('permission.data.gain.access')}
                </h3>
                <p className={'sub-title'}>
                    {mergedFields.map((data, key) => {
                        return (
                            <span
                                className='with-comma'
                                key={key}
                            >
                               {IntlText('permission.data.' + data)}
                                {reqFields.includes(data) && '*'}
                            </span>
                        )
                    })}.
                </p>
           </span>
                <div className={'action-buttons'}>
                    <Button
                        className={'sign-in mediaMax'}
                        onClick={handleOnClick}
                    >
                        {IntlText('sign.in')}
                    </Button>
                    <div className={'cancel-wrapper'}>
                        <Button
                            className={'cancel ghost sub-title'}
                            onClick={() => Redirect(backToUrl)}
                        >
                            {IntlText('cancel')}
                        </Button>
                    </div>
                </div>
                <div className={'data-permission-privacy text'}>
                    {IntlHtmlText('data.permission.privacy', {
                        clientName       : clientData.name,
                        clientLink       : clientData.link,
                        clientPrivacyLink: clientData.privacyUrl,
                    })}
                </div>
            </section>
        </Loadable>
    )
}

export default withDataPermission(DataPermission)

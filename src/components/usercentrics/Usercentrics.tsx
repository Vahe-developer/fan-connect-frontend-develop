import React, {useEffect, useState, useRef} from 'react'
import './usercentric.scss'
import {request}                            from '@myfan/base'
import {url}                                from '@myfan/commons/dist/url1'
import {withContext}                        from '@myfan/store'
import {User}                               from '@myfan/base'
import {Global}                             from '@myfan/commons'

// @ts-ignore
const isUsercentricExists = () => (typeof Global.window.usercentrics !== 'undefined' && Global.window.usercentrics.isInitialized)

export const getUsercentricDataAndUpdate = (): void => {

    if (url.getHostName() !== 'localhost' && (User.hasValidSession() || User.getHashwithSlash())) {
        request.get('/get-usercentrics' + User.getHashwithSlash())
            .then(res => {

                if (res.data.length === 0) return

                const usersentricIsLoaded = setInterval(() => {

                    if (isUsercentricExists()) {

                        const consents = Object
                            .keys(res.data)
                            .reduce((acc, consent) => {
                                // @ts-ignore
                                acc.push({templateId: consent, status: res.data[consent]})
                                return acc
                            }, [])

                        // @ts-ignore
                        Global.window.usercentrics.updateConsents(consents)
                        clearInterval(usersentricIsLoaded)
                    }
                }, 1000)

            })
            .catch(err => Global.bugsnag.notify(JSON.stringify(err)))
    }
}

function Usercentrics({bugsnag}: any) {

    const [loaded, setLoaded]     = useState(false)
    const [dataSent, setDataSent] = useState<NodeJS.Timeout>()
    const timeoutId               = useRef(dataSent)
    timeoutId.current             = dataSent

    const setUsercentricsData = (): void => {
        if (timeoutId.current) clearTimeout(timeoutId.current)

        setDataSent(setTimeout(() => {
            // @ts-ignore
            const consents = Global.window.usercentrics.getConsents()

            // @ts-ignore
            const data = consents.reduce((acc, consent) => {
                acc[consent.templateId] = consent.consentStatus
                return acc
            }, {})

            request.put('/set-usercentrics' + User.getHashwithSlash(), {data})
                .catch(() => bugsnag.notify('Setting usercentrics failed'))
                .catch(() => console.log('failed usercentric'))
        }, 5000))

    }

    useEffect(() => {

        if (isUsercentricExists() && !loaded) {
            // @ts-ignore
            setTimeout(() => Global.window.usercentrics.updateConsentInfoModalIsVisible(false), 0)

            setLoaded(true)
        }
        // eslint-disable-next-line
    }, [loaded])

    useEffect(() => {

        if (
            !loaded ||
            !(
                User.hasValidSession() ||
                url.getParam('hash')
            )
        ) return

        const usersentricIsLoaded = setInterval(() => {

            const cookiesCheckboxs = document.getElementsByClassName('fan-usercentrics')

            if (!cookiesCheckboxs || cookiesCheckboxs.length === 0) return

            clearInterval(usersentricIsLoaded)

            for (let element of cookiesCheckboxs) {
                element.addEventListener('mouseup', setUsercentricsData)
            }

        }, 1000)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded])

    return (
        <div className={'fan-usercentrics'}>
            <div
                className="uc-embed"
                uc-layout="2"
                uc-isselectall="true"
                uc-data="categoryName, description, toggle, toggleLabel">

            </div>
            <div
                className="uc-embed"
                uc-layout="2"
                uc-data="categoryName, description, toggle, toggleLabel">

            </div>
        </div>
    )
}

export default withContext(Usercentrics)

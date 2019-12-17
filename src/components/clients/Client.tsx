import React, {useEffect} from 'react'
import {url, utils}       from '@myfan/commons'
import {Loading}          from '@myfan/web-components'
import {ClientApp}        from '@myfan/clients'


function Client() {

    useEffect(() => {
        ClientApp.redirectFactory()
            .catch(e => {
                utils.withErrLog(e, () => ClientApp.rip(url.getParam('redirect_uri'), {
                    file:           'Client',
                    method:         'useEffect',
                    additionalInfo: {
                        error:       e,
                        errorString: e.toString()
                    },
                }, {}))
            })
    }, [])


    return <Loading/>
}

export default Client

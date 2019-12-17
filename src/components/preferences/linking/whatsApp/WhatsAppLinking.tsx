import React                    from 'react'
import {withRouter}             from 'react-router-dom'
import {request}                from '@myfan/base'
import {IntlHtmlText, IntlText} from '../../../intl/IntlText'
import {isMobile}               from 'react-device-detect'
import LinkLayout               from '../LinkLayout'
import Button                   from '../../../presentation-components/buttons/auth/Button'
import {User}                   from '@myfan/base'
import {withContext}            from '@myfan/store'
import {Global}                 from '@myfan/commons'

const WhatsAppLinking = (props: any) => {

    const {hash} = props.match.params

    const handleWhatsAppLinking = (): void => {

        const newTab = Global.window.open('', '_blank')

        request.get('/get-wb-widget-data?hash=' + (hash || ''))
            .then(res => {

                if (!res.data.numbers || !res.data.numbers[0]) {
                    return props.bugsnag.notify('webhook is not working!')
                }

                const channelNumber = res.data.user_channelnumber || res.data.numbers[0]
                let urlString       = 'https://' + (isMobile ? 'api' : 'web') + '.whatsapp.com/send?phone=' + channelNumber + '&text='

                if (hash) {
                    const text           = props.intl.formatMessage({id: 'whatsapp.linking'}) + 'ID' + hash + ' '
                    // @ts-ignore
                    newTab.location.href = urlString + text
                    return
                }

                if (User.hasValidSession()) {
                    return request.post('/get-user-hash')
                        .then(res => {
                            const text           = props.intl.formatMessage({id: 'whatsapp.linking'}) + 'ID' + res.data.hash + ' '
                            // @ts-ignore
                            newTab.location.href = urlString + text
                        })
                }
                // @ts-ignore
                newTab.location.href = urlString + res.data.public_opt_in_text
            })
    }

    const text = IntlText('whatsapp.linking.text')

    return (
        <LinkLayout
            text={text}
            policyText={IntlHtmlText('whatsapp.policy.text')}
        >
            <Button
                onClick={handleWhatsAppLinking}
                className={'sub-title'}
            >
                <i className={'fab fa-whatsapp'}/>
                {'WhatsApp'} hinzufügen
            </Button>
        </LinkLayout>
    )
}

export default withRouter(withContext(WhatsAppLinking))

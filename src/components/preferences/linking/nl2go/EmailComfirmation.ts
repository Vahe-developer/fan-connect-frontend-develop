import {request} from '@myfan/base'
import {url}     from '@myfan/commons/dist/url1'
import {Global}  from '@myfan/commons'

const EmailConfirmation = (): null => {

    request.post('/confirm-account-merge', {'hash': url.getParam('hash')})
        .then(res => {
            Global.window.location.href = '/p/' + res.data.hash + '?merge=1&from=' + url.getParam('from')
        })
        .catch(res => {
            Global.window.location.href = '/p/' + res.data.hash + '?merge=0&from=' + url.getParam('from')
        })

    return null
}

export default EmailConfirmation

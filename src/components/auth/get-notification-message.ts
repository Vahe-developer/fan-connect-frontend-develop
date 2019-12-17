import {url} from '@myfan/commons'

export default (): { success: boolean, id?: string } => {

    let success = false
    let id

    const urlParams = url.getParams()

    if (urlParams.passwordChanged) {
        if (urlParams.passwordChanged === "1") {
            success = true
            id      = 'password.successfully.changed'
        } else {
            id = 'something.went.wrong.reset.password'
        }
    } else if (urlParams.confirmationSuccess) {
        if (urlParams.confirmationSuccess === "1") {
            success = true
            id      = 'email.successfully.verified'
        } else {
            id = 'something.went.wrong.verifying.email'
        }
    }

    if (urlParams.email_exists) {
        success = true
        id      = 'linking.email.exists'
    }

    if (urlParams.invalidHashLink) id = 'invalid.link'
    if (urlParams.linkExpired) id = 'link.expired'

    return {
        success,
        id
    }
}


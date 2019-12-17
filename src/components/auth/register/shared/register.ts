import {User}                         from '@myfan/base'
import {Url, UrlBuilder, url, Global} from '@myfan/commons'
import {request}                      from '@myfan/base'
import {
    BIRTHDAY,
    CITY, COMMUNITY,
    COMPANY,
    COUNTRY,
    EMAIL,
    FIRSTNAME,
    GENDER, HOUSENUMBER,
    LASTNAME, PHONE,
    STREET,
    ZIP,
}                                     from '../../../constants/Fields'

export type RegData = {
    community?: string,
    email: string,
    password: string,
    firstname?: string,
    lastname?: string,
    gender?: string,
    phone?: string,
    company?: string,
    street?: string,
    city?: string,
    housenumber?: string,
    zip?: string,
    country?: string,
    hash?: string,
    birthday?: string,
    authParams?: string
}

export const register = async (data: RegData): Promise<{ messageId: string, username: string } | void> => {
    let authParams: string = ''

    if (url.get('redirect_uri')) {

        const currentUrl      = new Url()
        let authParamsBuilder = new UrlBuilder(currentUrl)

        if (currentUrl.query.federated) {
            authParamsBuilder.removeQuery('federated')
        }

        authParams = authParamsBuilder.getQuery()
    }

    data.authParams = authParams
    data.email      = data.email.toLowerCase()

    const username      = data.email.replace('@', '.')
    const attributeList = getCognitoUserAttrList(data)

    return new Promise((resolve, reject) => {
        User.userPool.signUp(username, data.password, attributeList, [], async function (err) {
            if (err) {

                Global.get('bugsnag').notify('register : ' + JSON.stringify(err))

                let messageId = 'invalid.register.already.exists'

                // @ts-ignore
                if (err.code === 'UsernameExistsException') {

                    const userStatus = await request.get('/get-user-status', {params: {username}})

                    if (userStatus.data.status === 'UNCONFIRMED') messageId = 'user.unconfirmed'
                }

                reject({messageId, username})
                return
            }

            request.post('/store-username-password', {username: username, password: data.password})
            resolve()
        })
    })
}

const getCognitoUserAttrList = (data: RegData) => {
    const attributeList: any = []

    const fieldsMap = {
        [EMAIL]      : 'email',
        [FIRSTNAME]  : 'name',
        [LASTNAME]   : 'family_name',
        [GENDER]     : 'gender',
        [BIRTHDAY]   : 'birthdate',
        [PHONE]      : 'phone_number',
        [STREET]     : 'custom:street',
        [ZIP]        : 'custom:zip',
        [COUNTRY]    : 'custom:country',
        [CITY]       : 'custom:city',
        [COMPANY]    : 'custom:company',
        [HOUSENUMBER]: 'custom:house_number',
        [COMMUNITY]  : 'custom:community',
        hash         : 'custom:hash',
        authParams   : 'custom:authParams',
    }

    Object.keys(fieldsMap).forEach(field => {
        // @ts-ignore
        User.setCognitoUserAttribute = {Name: fieldsMap[field], Value: data[field]}
        attributeList.push(User.getCognitoAttr)
    })

    return attributeList

}

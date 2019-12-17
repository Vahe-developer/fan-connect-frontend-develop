// import React                                      from 'react'
import moxios                                             from 'moxios'
import {baseUrl, successRes}                              from '../../../components-for-testing/testData'
import {redirect}                                         from '@myfan/commons/dist/url1'
import {redirect as Redirect, Url, url, navigate, Routes} from '@myfan/commons'
import {getRegisterUrlParams}                             from '../../auth/register/getRegisterUrlParams'
import {User, request}                                    from '@myfan/base'
import {ClientSteps, ClientApp}                           from '@myfan/clients'

ClientApp.setData        = jest.fn()
ClientApp.setMergingData = jest.fn()
ClientApp.rip            = jest.fn()

beforeEach(() => {
    moxios.install(request)
    Url.mockClear()
    jest.resetModules()
    redirect.mockClear()
    ClientApp.rip.mockClear()
    User.hasValidSession.mockClear()
    url.addParam.mockClear()
    url.getParams.mockClear()
})


afterEach(() => {
    moxios.uninstall(request)
    User.hasValidSession.mockClear()
})

describe.skip('>>>Authorize -- with all good', () => {

    it('--- without redirect_uri param, and empty params', async () => {
        //new Url().query.mockImplementationOnce(() => ({redirect_uri: ""}))
        Url.mockImplementationOnce(() => ({query: {redirect_uri: ''}}))

        await ClientApp.redirectFactory()
        expect(redirect).toHaveBeenCalledWith('/login')

    })


    it('with params[\'account_link[email]\'] isUserExists : false', done => {

        ClientApp.redirectFactory()

        moxios.wait(async () => {
            expect(moxios.requests.mostRecent().config.params).toEqual({redirect_uri: url.getParams().redirect_uri})
            await moxios.requests.mostRecent().respondWith(successRes)
            expect(ClientApp.setData).toHaveBeenCalledWith('test')
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + 'is-user-exists/true')
            await moxios.requests.mostRecent().respondWith(successRes)
            expect(User.logout).toHaveBeenCalledWith('/register')
            done()
        })
    })

    it('with params[\'account_link[email]\']  -- with isUserExists : true -- with not logged in', done => {

        ClientApp.redirectFactory()

        moxios.wait(async () => {
            await moxios.requests.mostRecent().respondWith(successRes)
            expect(ClientApp.setData).toHaveBeenCalledWith('test')
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + 'is-user-exists/true')
            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {data: 'test', exists: true}
            })
            expect(url.addParam).toHaveBeenCalledWith('email_exists', '1')
            expect(ClientApp.setMergingData).toHaveBeenCalledWith(getRegisterUrlParams(url.getParams()))
            expect(User.logout).toHaveBeenCalledWith('/login')

            done()
        })
    })

    it('with params[\'account_link[email]\']  -- with isUserExists : true -- with logged in', done => {
        User.hasValidSession.mockImplementationOnce(() => true)
        Url.mockImplementation(() => ({query: {redirect_uri: '/dummy', 'account_link[email]': 'testEmail'}}))

        ClientApp.redirectFactory()

        moxios.wait(async () => {

            await moxios.requests.mostRecent().respondWith(successRes)
            expect(ClientApp.setData).toHaveBeenCalledWith('test')
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + 'is-user-exists/testEmail')
            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {data: 'test', exists: true}
            })
            expect(url.addParam).toHaveBeenCalledWith('email_exists', '1')
            expect(ClientApp.setMergingData).toHaveBeenCalledWith(getRegisterUrlParams(url.getParams()))
            done()
        })
    })

    it('without params[\'account_link[email]\'] -- whithout logged in', done => {

        Url.mockImplementationOnce(() => ({query: {redirect_uri: '/dummy', 'account_link[email]': null}}))

        ClientApp.redirectFactory()

        moxios.wait(async () => {
            await moxios.requests.mostRecent().respondWith(successRes)
            expect(navigate).toHaveBeenCalledWith('/login')
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + Routes.v2.apps.getClientData.build())
            done()
        })
    })

    it('--- step resend ', done => {
        User.hasValidSession.mockImplementationOnce(() => true)
        Url.mockImplementation(() => ({query: {redirect_uri: '/dummy', 'account_link[email]': null}}))

        ClientApp.redirectFactory(ClientSteps.RESEND)

        moxios.wait(async () => {
            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {data: {login_uri: '/dummyUrl'}}
            })
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + Routes.v2.apps.getClientData.build())
            expect(Redirect).toHaveBeenCalledWith('/dummyUrl')
            done()
        })
    })

    it('--- ClientSteps.CHECK_REQUIRED_FIELDS -- with is_valid false', done => {
        User.hasValidSession.mockImplementationOnce(() => true)

        ClientApp.redirectFactory(ClientSteps.CHECK_REQUIRED_FIELDS)

        moxios.wait(async () => {
            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {is_valid: false}
            })
            expect(moxios.requests.mostRecent().config.params).toEqual({redirectUri: url.getParams().redirect_uri})
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + Routes.v2.checkRequiredFields.build())
            expect(redirect).toHaveBeenCalledWith('/profile')
            done()
        })
    })

    it('--- ClientSteps.CHECK_REQUIRED_FIELDS -- with is_valid true', done => {
        User.hasValidSession.mockImplementationOnce(() => true)

        ClientApp.redirectFactory(ClientSteps.CHECK_REQUIRED_FIELDS)

        moxios.wait(async () => {
            expect(moxios.requests.mostRecent().config.params).toEqual({redirectUri: url.getParams().redirect_uri})
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + Routes.v2.checkRequiredFields.build())

            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {is_valid: true}
            })

            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {redirect_url: '/dummy_redirect_ur'}
            })
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + 'authorize-client' + url.search)
            expect(ClientApp.rip).toHaveBeenCalledWith('/dummy_redirect_ur')
            done()
        })

    })

    it('--- ClientSteps.CHECK_DATA_PERMISSION -- with is_allowed false', done => {
        User.hasValidSession.mockImplementationOnce(() => true)

        ClientApp.redirectFactory(ClientSteps.CHECK_DATA_PERMISSION)

        moxios.wait(async () => {
            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {is_allowed: false}
            })
            expect(moxios.requests.mostRecent().config.params).toEqual({redirectUri: url.getParams().redirect_uri})
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + Routes.v2.checkDataPermissions.build())
            expect(redirect).toHaveBeenCalledWith('/data-permission')
            done()
        })

    })

    it('--- ClientSteps.CHECK_DATA_PERMISSION -- with is_allowed true', done => {
        User.hasValidSession.mockImplementationOnce(() => true)

        ClientApp.redirectFactory(ClientSteps.CHECK_DATA_PERMISSION)

        moxios.wait(async () => {
            expect(moxios.requests.mostRecent().config.params).toEqual({redirectUri: url.getParams().redirect_uri})
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + Routes.v2.checkDataPermissions.build())

            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {is_allowed: true}
            })

            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {redirect_url: '/dummy_redirect_ur'}
            })
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + 'authorize-client' + url.search)
            expect(ClientApp.rip).toHaveBeenCalledWith('/dummy_redirect_ur')
            done()
        })

    })

    it('--- ClientSteps.CHECK_REQFIELDS_AND_DATA_PERMISSION -- with is_valid false', done => {
        User.hasValidSession.mockImplementationOnce(() => true)

        ClientApp.redirectFactory(ClientSteps.CHECK_REQFIELDS_AND_DATA_PERMISSION)

        moxios.wait(async () => {
            expect(moxios.requests.mostRecent().config.params).toEqual({redirectUri: url.getParams().redirect_uri})
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + Routes.v2.checkRequiredFields.build())

            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {is_valid: false}
            })

            expect(redirect).toHaveBeenCalledWith('/profile')
            done()
        })

    })

    it('--- ClientSteps.CHECK_REQFIELDS_AND_DATA_PERMISSION -- with is_valid true -- with is_allowed = false', done => {
        User.hasValidSession.mockImplementationOnce(() => true)

        ClientApp.redirectFactory(ClientSteps.CHECK_REQFIELDS_AND_DATA_PERMISSION)

        moxios.wait(async () => {
            expect(moxios.requests.mostRecent().config.params).toEqual({redirectUri: url.getParams().redirect_uri})
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + Routes.v2.checkRequiredFields.build())

            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {is_valid: true}
            })

            expect(moxios.requests.mostRecent().config.params).toEqual({redirectUri: url.getParams().redirect_uri})
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + Routes.v2.checkDataPermissions.build())

            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {is_allowed: false}
            })

            expect(redirect).toHaveBeenCalledWith('/data-permission')
            done()
        })

    })

    it('--- ClientSteps.CHECK_REQFIELDS_AND_DATA_PERMISSION -- with is_valid true -- with is_allowed = true', done => {
        User.hasValidSession.mockImplementationOnce(() => true)

        ClientApp.redirectFactory(ClientSteps.CHECK_REQFIELDS_AND_DATA_PERMISSION)

        moxios.wait(async () => {
            expect(moxios.requests.mostRecent().config.params).toEqual({redirectUri: url.getParams().redirect_uri})
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + Routes.v2.checkRequiredFields.build())

            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {is_valid: true}
            })

            expect(moxios.requests.mostRecent().config.params).toEqual({redirectUri: url.getParams().redirect_uri})
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + Routes.v2.checkDataPermissions.build())

            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {is_allowed: true}
            })

            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {redirect_url: '/dummy_redirect_ur'}
            })

            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + 'authorize-client' + url.search)
            expect(ClientApp.rip).toHaveBeenCalledWith('/dummy_redirect_ur')
            done()
        })

    })
})

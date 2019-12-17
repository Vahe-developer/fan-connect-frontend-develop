import {request}                       from '@myfan/base'
import moxios                          from 'moxios'
import {baseUrl, errorRes, successRes} from '../../../components-for-testing/testData'
import {redirect, url}                 from '@myfan/commons/dist/url1'
import {ClientApp}                     from '@myfan/clients'
import {User}                          from '@myfan/base'
import DataPermission, {handleOnClick} from '../DataPermission'
import {Routes}                        from '@myfan/commons'

beforeEach(() => {
    moxios.install(request)
    jest.resetModules()
    redirect.mockClear()
    ClientApp.rip.mockClear()
    User.hasValidSession.mockClear()
    url.addParam.mockClear()
    url.getParams.mockClear()
    Object.defineProperty(ClientApp, 'data', {
        get: jest.fn(() => null)
    })
})

afterEach(() => {
    moxios.uninstall(request)
    User.hasValidSession.mockClear()
})

describe.skip('>>> DataPermission', () => {
    it('whithout ClientApp.data', () => {
        DataPermission()
        expect(redirect).toHaveBeenCalledWith('/profile')
    })

    it('handleOnClick with errors ', async (done) => {

        moxios.wait(async () => {
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + Routes.v2.allowDataPermissions.build())
            await moxios.requests.mostRecent().respondWith(errorRes)
            expect(ClientApp.rip).toHaveBeenCalledWith(url.getParams().redirect_uri, {})
            done()
        })

        await handleOnClick()
    })

    it('handleOnClick with success -- with mergingData', async (done) => {

        moxios.wait(async () => {
            await moxios.requests.mostRecent().respondWith(successRes)
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + Routes.v2.checkRequiredFields.build())
            await moxios.requests.mostRecent().respondWith(successRes)
            expect(redirect).toHaveBeenCalledWith('/profile')
            done()
        })

        await handleOnClick()
    })

    it('handleOnClick with success -- without mergingData -- with !checkReqFields.data.is_valid', async (done) => {
        const mergingdata = jest.spyOn(ClientApp, 'mergingData', 'get')
        mergingdata.mockImplementation(false)

        moxios.wait(async () => {
            await moxios.requests.mostRecent().respondWith(successRes)
            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {is_valid: false}
            })
            expect(redirect).toHaveBeenCalledWith('/profile')
            done()
        })

        await handleOnClick()
    })

    it('handleOnClick with success -- without mergingData -- with checkReqFields.data.is_valid -- with not logged In', async (done) => {

        moxios.wait(async () => {
            await moxios.requests.mostRecent().respondWith(successRes)
            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {is_valid: true}
            })
            expect(redirect).toHaveBeenCalledWith('/login')
            done()
        })

        await handleOnClick()
    })

    it('handleOnClick with success -- without mergingData -- with checkReqFields.data.is_valid -- with logged In', async (done) => {
        User.hasValidSession.mockImplementationOnce(() => true)

        moxios.wait(async () => {
            await moxios.requests.mostRecent().respondWith(successRes)
            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {is_valid: true}
            })
            expect(moxios.requests.mostRecent().config.url).toBe(baseUrl + 'authorize-client' + url.search)
            await moxios.requests.mostRecent().respondWith({
                status:   200,
                response: {redirect_url: '/testRedirectUrl'}
            })
            expect(ClientApp.rip).toHaveBeenCalledWith('/testRedirectUrl', {})
            done()
        })

        await handleOnClick()
    })
})

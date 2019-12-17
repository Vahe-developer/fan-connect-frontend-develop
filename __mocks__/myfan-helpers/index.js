export const redirect = jest.fn()

export const Url: jest.Mock<{}> = jest.fn().mockImplementation(() => {
    return {query: {redirect_uri: "/dummy", "account_link[email]": true}}
})

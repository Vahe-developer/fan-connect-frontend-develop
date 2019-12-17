const Navigation = require('./url')

const Url: jest.Mock<{}> = jest.fn().mockImplementation(() => {
    return {query: {redirect_uri: "/dummy", "account_link[email]": true}}
})

module.exports = {
    ...Navigation,
    Url
}

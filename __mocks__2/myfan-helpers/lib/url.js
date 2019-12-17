const url = {
    addParam:    jest.fn(),
    removeParam: (name) => {
        let url    = new URL(window.location)
        let params = new URLSearchParams(url.search.slice(1))

        params.delete(name)
        window.history.replaceState({}, null, '?' + params.toString())
    },
    get location() {
        return window.location
    },
    get search() {
        return window.location.search
    },
    getParams:   jest.fn(() => ({redirect_uri: "/dummy", "account_link[email]": true}))
}

module.exports = {
    redirect: jest.fn(),
    navigate: jest.fn(),
    url
}

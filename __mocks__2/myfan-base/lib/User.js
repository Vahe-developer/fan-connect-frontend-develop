const User = {
    get userPool() {
        return {
            getCurrentUser: () => {
            },
            signUp:         (username, password, userAttributes, validationData, cb) => {
                cb(this.getError)
            },
            signOut:        () => true
        }

    },
    get getError() {
        return false
    },
    get currentUser() {
        return this.userPool.getCurrentUser()
    },
    isLoggedIn:      false,
    get getIsLoggedIn() {
        return this.isLoggedIn
    },
    hasValidSession: jest.fn(() => false),
    get Session() {
        return this.hasValidSession
    },
    session:         {
        getAccessToken: () => {
            return {
                getJwtToken: () => true
            }
        },
        getIdToken:     () => {
            return {
                getJwtToken: () => true
            }
        }
    },
    set setIdToken(token) {
        return null
    },
    IdToken:         {
        getJwtToken: () => {
        }
    },
    set setAccessToken(token) {
        return null
    },
    AccessToken:     {
        getJwtToken:   () => {
        },
        decodePayload: () => {
            return {
                username: null
            }
        }
    },
    get email() {
        return "testEmail"
    },
    logout:          jest.fn((redirectTo = "/", search = true) => {

    })

}

module.exports = User

const axios = require("axios")
const User  = require("./User")
const Club  = require("./Club")

const request = axios.create({
    baseURL: Club.backendUrl + "/api/",
})

if (User.hasValidSession()) {
    request.defaults.headers.common["Authorization"] = `Bearer ${User.session.getIdToken().getJwtToken()}`
} else {
    request.defaults.headers.common["Authorization"] = null
}

request.interceptors.response.use(
    response => {
        return Promise.resolve(response)
    },
    error => {
        if (
            (error.response &&
                (
                    error.response.status === 401 ||
                    error.response.status === 403
                )) ||
            error.code === "NotAuthorizedException"
        ) {
            User.logout("/")
        }
        return Promise.reject(error.response)
    }
)

module.exports = request


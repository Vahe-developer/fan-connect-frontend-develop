const ClientApp = {
    setData: jest.fn(),
    removeData: () => {
        localStorage.setItem('clientData', '')
    },
    get data() {
        return localStorage.getItem('clientData') ? JSON.parse(localStorage.getItem('clientData')) : null
    },
    get name() {
        return "ClientName"
    },
    setMergingData: jest.fn(),
    removeMergingData: jest.fn(),
    setRequiredFields: jest.fn(),
    get mergingData() {
        return {email: "testEmail"}
    },
    rip: jest.fn()
};

export default ClientApp

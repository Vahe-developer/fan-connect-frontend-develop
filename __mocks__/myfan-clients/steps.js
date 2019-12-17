export const ClientSteps = Object.freeze({
    INIT:                                0,
    RESEND:                              1,
    CHECK_REQUIRED_FIELDS:               2,
    CHECK_DATA_PERMISSION:               3,
    CHECK_REQFIELDS_AND_DATA_PERMISSION: 4
})

export type TClientSteps = 0 | 1 | 2 | 3 | 4

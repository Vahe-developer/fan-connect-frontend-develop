import {
    PaymentStatus,
}                    from '../actions/types'
import {ValidationT} from './commons'

export {PaymentStatus}

export type MembershipT = {
    number: string,
    price: string | null,
    status: string,
    confirmedAt: string,
    nextPayment: string,
    address: {
        gender: string,
        firstName: string,
        middleName: string,
        lastName: string,
        country: string,
        city: string,
        street: string,
        houseNumber: string,
        postalCode: string,
        birthDate: string
    },
    payment: {
        payerName: string,
        iban: string,
    },
    options: {
        membershipType: string,
        sportType: string,
    },
}

export type UserDataServerT = {
    gender: string,
    firstname: string,
    lastname: string,
    birthday: string,
    email: string,
    phone: string,
    company: string,
    street: string,
    housenumber: string,
    city: string,
    zip: string,
    additionalAddress: string,
    country: string,
    playerID: number | string,
    payment: { [key: string]: { status: PaymentStatus, email: string } } | undefined,
    membership: MembershipT,
    [key: string]: any
}

export type UserDataT = {
    gender: string,
    firstName: string,
    lastName: string,
    birthday: string,
    email: string,
    phone: string,
    company: string,
    street: string,
    housenumber: string,
    city: string,
    zip: string,
    additionalAddress: string,
    country: string,
    playerID: number | string,
    payment: { [key: string]: { status: PaymentStatus, email: string } } | undefined,
    membership: MembershipT,
    [key: string]: any
}

export type IApp = {
    id: number,
    name: string,
    desc: string,
    title: string,
    login_uri: string,
    redirect_uri: string,
    permissionSet: boolean
}

export type IPlayer = {
    id: number,
    name: string,
    number: number
}

export type IDDPlayer = {
    id: number | string,
    title: string,
    selected: boolean,
    style?: { [key: string]: string }
}

export type TPollOptions = {
    id: number,
    name: string,
    description: string,
    icon: string,
    image: string,
    position: number,
    enabled: boolean
}

export type TPolls = {
    id: number,
    name: string,
    question: string,
    options: TPollOptions[],
    selected: number | null
}

export type ProfileState = {
    reset: boolean,
    disabled: boolean,
    loading: boolean,
    requiredFields: string[],
    apps: IApp[],
    players: IDDPlayer[],
    prevState: UserDataT,
    userData: UserDataT,
    diffFieldsNames: string[],
    mergingProfileData: any //userDataType | any,
    polls: TPolls[],
    validation: ValidationT
}

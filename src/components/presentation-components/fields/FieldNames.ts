import {IntlText} from "../../intl/IntlText";

export interface IFields {
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
    country: string,
    playerID: number | string,
    additionalAddress: string,
    [key : string] : string | number
}


const FieldNames = {
    gender:            IntlText("gender"),
    firstname:         IntlText("firstname"),
    lastname:          IntlText("lastname"),
    birthday:          IntlText("just.birthday"),
    email:             IntlText("email"),
    phone:             IntlText("phone"),
    company:           IntlText("company"),
    street:            IntlText("street"),
    housenumber:       IntlText("house.number"),
    city:              IntlText("city"),
    zip:               IntlText("zip"),
    country:           IntlText("country"),
    playerID:          IntlText("favorite.player"),
    additionalAddress: IntlText("additional.address")
}

export default FieldNames

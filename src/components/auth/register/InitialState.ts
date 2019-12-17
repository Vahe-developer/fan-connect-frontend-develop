export type RegFields = {
    community: string,
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    gender: string,
    phone: string,
    company: string,
    street: string,
    city: string,
    housenumber: string,
    zip: string,
    country: string
}

export interface IRegisterFormState {
    fields: RegFields;
    successMessage: boolean;
    clientFormFields: string[];
    validation : {
        community:   string,
        email:       string,
        password:    string,
        firstname:   string,
        lastname:    string,
        gender:      string,
        phone:       string,
        company:     string,
        street:      string,
        city:        string,
        housenumber: string,
        zip:         string,
        country:     string
    }
}

export const RegisterFormState = {
    fields:           {
        community:   '',
        email:       '',
        password:    '',
        firstname:   '',
        lastname:    '',
        gender:      '',
        phone:       '',
        company:     '',
        street:      '',
        city:        '',
        housenumber: '',
        zip:         '',
        country:     ''
    },
    successMessage:   false,
    clientFormFields: [],
    validation:       {
        community:   'required|string',
        email:       'required|email',
        password:    'required|min:8|containCapLetter|containNumber|containSpecialChar',
        firstname:   'required|string',
        lastname:    'required|string',
        gender:      'required',
        phone:       'required|int',
        company:     'required',
        street:      'required',
        city:        'required',
        housenumber: 'required',
        zip:         'required',
        country:     'required|string'
    }
}

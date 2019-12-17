import {getClubFromDomain} from '@myfan/commons/dist/utils'
import {Club}              from '@myfan/base'

export const correct = {
    registerData: {
        email:    'davit.galoyan@fouraitch.com',
        password: '12345678A',
    },
    loginData:    {
        identity: 'davit.galoyan+test@fouraitch.com',
        password: 123456
    }
}

export const incorrect = {
    registerData: {},
    loginData:    {
        identity: 'davit.galoyan+test+wrong@fouraitch.com',
        password: 123456
    }
}

export const ProfileData = {
    correctData:   {
        disabled:         true,
        requiredFields:   [],
        apps:             [],
        prevState:        '',
        userData:         {
            birthday:    '1992-01-02',
            city:        '123345',
            clubId:      8,
            company:     'Company',
            country:     'EG',
            email:       'davit.galoyan@fouraitch.com',
            firstname:   'David',
            gender:      'm',
            housenumber: '44/12',
            lastname:    'Galoyan',
            phone:       '123123',
            street:      'Shiraz',
            zip:         '0088'
        },
        validationErrors: {},
        validation:       {
            email:             {rules: {}},
            firstname:         {rules: {}},
            lastname:          {rules: {}},
            gender:            {rules: {}},
            birthday:          {rules: {date: true}},
            phone:             {rules: {number: true}},
            company:           {rules: {}},
            street:            {rules: {}},
            city:              {rules: {}},
            housenumber:       {rules: {}},
            zip:               {rules: {}},
            additionalAddress: {rules: {}},
            country:           {rules: {}}
        }
    },
    incorrectData: {
        birthday:    '2016-03-06g',
        city:        '123345',
        clubId:      8,
        company:     'Company',
        country:     'EG',
        email:       'davit.galoyanfouraitch.com',
        firstname:   'David',
        gender:      'i',
        housenumber: 'wrong',
        lastname:    'Galoyan',
        phone:       'wrong',
        street:      'wrong',
        zip:         'wrong'
    },

    submitRes: {
        apps:            [],
        required_fields: [],
        userData:        {
            birthday:    '1992-01-02',
            city:        '123345',
            clubId:      8,
            company:     'Company',
            country:     'EG',
            email:       'davit.galoyan@fouraitch.com',
            firstname:   'David',
            gender:      'm',
            housenumber: '44/12',
            lastname:    'Galoyan',
            phone:       '123123',
            street:      'Shiraz',
            zip:         '0088'
        }
    }

}

export const errorRes = {
    status:   422,
    response: {data: 'test'}
}

export const successRes = {
    status:   200,
    response: {data: 'test', exists: false}
}

export const baseUrl = Club.backendUrl + '/api/'

export const mergingData = {
    'email':       'testEmail',
    'firstname':   'David',
    'lastname':    'Galoyan',
    'password':    '',
    'gender':      'm',
    'street':      'Löhstraße',
    'city':        'Viersen',
    'housenumber': '2',
    'zip':         '41747',
    'country':     'DE'
}

export const userData = {
    'email':       'testEmail',
    'firstname':   '',
    'lastname':    'Galoyanasd',
    'password':    '',
    'gender':      'm',
    'street':      'Löhstraße',
    'city':        'Viersen',
    'housenumber': '2',
    'zip':         '41747',
    'country':     'DE',
    'phone':       ''
}

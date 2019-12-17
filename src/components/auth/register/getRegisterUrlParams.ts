export type IgetRegisterUrlParams = {
    community: string;
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    gender: string;
    phone: string;
    company: string;
    street: string;
    city: string;
    housenumber: string;
    zip: string;
    country: string;
}

export const getRegisterUrlParams = (urlParams: any): IgetRegisterUrlParams => {
    return {
        community:   urlParams["account_link[community]"] || '',
        email:       urlParams["account_link[email]"] || '',
        firstname:   urlParams["account_link[name]"] || '',
        lastname:    urlParams["account_link[family_name]"] || '',
        password:    '',
        gender:      urlParams["account_link[gender]"] || '',
        phone:       urlParams["account_link[phone]"] || '',
        company:     urlParams["account_link[company]"] || '',
        street:      urlParams["account_link[street]"] || '',
        city:        urlParams["account_link[city]"] || '',
        housenumber: urlParams["account_link[housenumber]"] || '',
        zip:         urlParams["account_link[zip]"] || '',
        country:     urlParams["account_link[country]"] || ''
    }
}

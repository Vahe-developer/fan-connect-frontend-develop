/*
import React from 'react';
import OldRegister from '../Register';
import Enzyme, {shallow, mount} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import {render} from 'react-testing-library'

import {STEP_EMAIL, STEP_PASSWORD} from "../register-step-constants";
import IntlWithRouter from "../../../../../components-for-testing/IntlWithRouter";

Enzyme.configure({adapter: new Adapter()});
let wrapper = shallow(<OldRegister/>);
console.log(wrapper)
const component = wrapper.instance();

jest.mock('../../../../open-id/User');

const {
    data,
    disabled,
    step,
    maxStep,
    errors,
    validation,
} = component.state;

describe.skip('Register', () => {
    describe('>>> Testing Register with initial state', () => {

        it('+++ render the component', () => {
            expect(wrapper.length).toEqual(1)
        });

        it('+++ check state props matches with initialState', () => {
            expect(typeof  data).toEqual('object');
            expect(Object.keys(data)).toEqual([
                'email',
                'password'
            ]);

            expect(typeof disabled).toEqual('boolean');
            expect(disabled).toEqual(true);

            expect(step).toBe(STEP_EMAIL);

            expect(maxStep).toBe(2);

            expect(typeof errors).toEqual('object');
            expect(errors).toEqual({});

            expect(typeof validation).toEqual('object');
            expect(Object.keys(validation)).toEqual([
                'email',
                'password'
            ]);

            expect(checkEmail(validation.email)).toBe(true);
            expect(checkPassword(validation.password)).toBe(true);

        });

    });


    const checkEmail = (email) => {
        return email.rules.required === true && email.rules.email === true
    }

    const checkPassword = (password) => {
        return password.rules.required === true && password.rules.min === 8
    }

    describe.skip('>>> Testing Register with email filled', () => {
        const handleChange = jest.spyOn(OldRegister.prototype, 'handleOnChange');
        const handleSubmit = jest.spyOn(OldRegister.prototype, 'handleSubmit');
        const handleGoBack = jest.spyOn(OldRegister.prototype, 'goBack');
        const validate = jest.spyOn(OldRegister.prototype, 'validate');
        const mockRegister = jest.fn()
        const parentState = jest.fn()
        mockRegister.mockReturnValue({messageId: 'invalid.register.already.exists'})

        wrapper = mount(
            <IntlWithRouter>
                <OldRegister
                    register={async (props) => mockRegister(props)}
                    parentState={parentState}
                    location={{search: ''}}
                />
            </IntlWithRouter>
        );
        const componentInstance = wrapper.find(OldRegister).instance();


        it('if input exists', () => {
            const input = wrapper.find('input');
            expect(input.length).toEqual(1)
        })

        it('Invalid email test', () => {

            wrapper.find('input').simulate('change', {target: {value: 'My invalid email', name: 'email'}});
            componentInstance.forceUpdate();
            expect(handleChange).toHaveBeenCalled()
            expect(componentInstance.state.data.email).toBe('My invalid email');
            wrapper.find('button').simulate('click');
            expect(componentInstance.state.errors.email).toBeTruthy();
            expect(componentInstance.state.step).toBe(STEP_EMAIL);
        })

        it('Valid email test', () => {

            wrapper.find('input').simulate('change', {target: {value: 'davit.galoyan+test@fouraitch.com', name: 'email'}});
            componentInstance.forceUpdate();
            expect(handleChange).toHaveBeenCalled()
            expect(componentInstance.state.data.email).toBe('davit.galoyan+test@fouraitch.com');
            wrapper.find('button').simulate('click');
            expect(componentInstance.state.errors.email).toBeFalsy();
            expect(componentInstance.state.step).toBe(STEP_PASSWORD);
        })

        it('Invalid Password test', () => {

            wrapper.find('input').simulate('change', {target: {value: '12345', name: 'password'}});
            componentInstance.forceUpdate();
            expect(handleChange).toHaveBeenCalled()
            expect(componentInstance.state.data.password).toBe('12345');
            wrapper.find('.register-button').simulate('click');
            expect(componentInstance.state.errors.password).toBeTruthy();
            expect(componentInstance.state.step).toBe(STEP_PASSWORD);
        })

        it('Test goBack func to be called', () => {

            wrapper.find('.go-back-button').simulate('click');
            expect(handleGoBack).toHaveBeenCalled()
            expect(componentInstance.state.step).toBe(STEP_EMAIL);
        })

        it('Test go to password again', () => {

            wrapper.find('button').simulate('click');
            expect(componentInstance.state.step).toBe(STEP_PASSWORD);
        })

        it('Valid Password test', () => {

            wrapper.find('input').simulate('change', {target: {value: '12345678A', name: 'password'}});
            componentInstance.forceUpdate();
            expect(handleChange).toHaveBeenCalled()
            expect(componentInstance.state.data.password).toBe('12345678A');
            wrapper.find('.register-button').simulate('click');
            //expect(componentInstance.state.errors.password).toBeFalsy();

        })

        it('should be called once', () => {
            expect(handleSubmit).toHaveBeenCalled()
            expect(validate).toHaveBeenCalled()
            expect(mockRegister).toHaveBeenCalled()
            expect(parentState).toHaveBeenCalled()
        });

    });
})

*/

describe.skip('deafult',  () => {
    it('empty', () => {})
})

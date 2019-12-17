import React                               from 'react'
import {Col, FormGroup, Input, Label, Row} from "reactstrap"
import './radio.scss'
import {object}                            from "@myfan/commons"
import {ErrorsV2}                          from "../errors/ErrorsV2"
import {withStore}                         from "@myfan/store"

interface IRadio {
    options: { name: any, value: string }[],
    title?: string,
    data: string,
    value?: string,
    name: string,
    onChange: () => void,
    required: string[],
    errors: any
}

const Radio = ({options, title, data, value, name, onChange, required, errors}: IRadio) => {

    const ifRequired = (required && required.includes(name) && !data)
    const isErrorNew = !object.isEmpty(errors[name])

    return (
        <React.Fragment>
            <Row>
                <Col md={12} xs={12}>
                    <div className={'radio-button-container  ' + ((isErrorNew) ? ' border-red ' : '')}>
                        <Row>
                            {title && (
                                <Col md={3} xs={3}>
                                <span
                                    className={'radio-title ' + (ifRequired ? ' color-red ' : '')}>{title}</span>
                                </Col>
                            )}
                            <Col md={title ? 9 : 12} xs={title ? 9 : 12}
                                 className={title ? "text-center text-md-right" : ' '}>
                                {options.map((option, index) => {
                                    return (
                                        <span key={index} className={"gender-checkbox"}>
                                            <FormGroup check>
                                                <Label check>
                                                    <Input
                                                        type="radio"
                                                        name={name}
                                                        value={option.value}
                                                        onChange={onChange}
                                                        checked={data === option.value}
                                                    />{' '}
                                                    <span
                                                        className={'sub-title pointer ' + (ifRequired ? ' color-red ' : '')}>{option.name}</span>
                                                    <span className="checkmark"></span>
                                                </Label>
                                            </FormGroup>
                                        </span>
                                    )
                                })}
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            {isErrorNew && <ErrorsV2 errors={errors[name]}/>}
        </React.Fragment>
    )

}

export default withStore(Radio, (ctx: { errors: any; }) => ({errors: ctx.errors}))


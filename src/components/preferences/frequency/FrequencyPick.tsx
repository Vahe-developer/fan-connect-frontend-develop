import React      from "react"
// @ts-ignore
import Slider     from "rc-slider"
import {Row, Col} from "reactstrap"
import "rc-slider/dist/rc-slider.css"

const FrequencyPick = (props : any) => {

    return (
        <Row className={'frequency-pick'}>
            <Col style={{margin: "0 auto"}} xs="8" sm="6">
                <Slider
                    value={props.value}
                    onChange={(val: any) => props.onChange(val)}
                    included={false}
                    dotStyle={{borderColor: "#ededed"}}
                    activeDotStyle={{
                        borderColor:     "#a2a3aa",
                        backgroundColor: "#000",
                    }}
                    {...props}
                />
            </Col>
        </Row>
    )
}

export default FrequencyPick

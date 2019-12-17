import React            from 'react'
import {Container, Row} from "reactstrap";
import './impressum.scss'
import {IntlHtmlText}   from "../intl/IntlText";
import {Club}           from "@myfan/base";

const Impressum = () => {
    return (
        <div className={'impressum'} style={{color : Club.navbarBg}}>
            <Container>
                <Row>
                    {IntlHtmlText('impressum')}
                </Row>
            </Container>
        </div>
    )
}

export default Impressum

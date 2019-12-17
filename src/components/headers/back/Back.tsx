import React                 from 'react'
import {Col, Container, Row} from 'reactstrap'
import {IntlText}            from '../../intl/IntlText'
import './back.scss'
import {url, redirect}       from '@myfan/commons'
import {Conditional}         from '@myfan/web-components'
import {ClientApp}           from '@myfan/clients'

const Back = (): JSX.Element => {

    const clientData = ClientApp.data
    const urlParams  = url.getParams()

    const redirectUrl   = urlParams.redirect_uri
    const federated     = urlParams.federated
    const shop          = urlParams.shop
    const finalRedirect = (clientData && clientData.back_to_url) ? clientData.back_to_url : redirectUrl

    return (
        <Conditional cond={redirectUrl && clientData && (!federated && !shop)}>
            <section className={'go-back-section'}>
                <Container className={'go-back-container'} onClick={() => redirect(finalRedirect)}>
                    <Row>
                        <Col className={'text-container'}>

                            <i className="fas fa-angle-left"/>
                            {IntlText('header.back.to')} {ClientApp.name}
                        </Col>
                    </Row>
                </Container>
            </section>
        </Conditional>
    )
}

export default Back

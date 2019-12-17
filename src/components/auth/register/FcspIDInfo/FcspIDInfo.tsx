import React      from 'react'
import {Col, Row} from 'reactstrap'
import {IntlText} from '../../../intl/IntlText'
import './fcsp-id.scss'

const FcspIDInfo = () => {
    return (
        <div className={'fcsp-register-header'}>
            {/* <Row className={'fcspid-title'}>
                <Col md={12}>
                    <div className={'fcsp-id-headers fcsp-grey title'}>
                        <div className={'second-header'}>
                            {IntlHtmlText('fcsp.id.header')}
                        </div>
                    </div>
                </Col>
            </Row>*/}
            <Row md={6}>
                <Col md={12}>
                    <div className={'fcsp-id-checkbox-section'}>
                        <i className={'fas fa-check-circle checked'}></i>
                        <div className={'sub-title'}>{IntlText('account.for.everything')}</div>
                        <p className={'text'}>{IntlText('one.click.login.for.all.services')}</p>
                    </div>
                </Col>
                <Col md={12}>
                    <div className={'fcsp-id-checkbox-section'}>
                        <i className={'fas fa-check-circle checked'}></i>
                        <div className={'sub-title'}>{IntlText('manage.your.data')}</div>
                        <p className={'text'}>{IntlText('determine.what.information.share')}</p>
                    </div>
                </Col>
                <Col md={12}>
                    <div className={'fcsp-id-checkbox-section'}>
                        <i className={'fas fa-check-circle checked'}></i>
                        <div className={'sub-title'}>{IntlText('preference.center')}</div>
                        <p className={'text'}>{IntlText('choose.your.personal.communication.settings')}</p>
                    </div>
                </Col>
            </Row>
        </div>
    )
}


export default FcspIDInfo

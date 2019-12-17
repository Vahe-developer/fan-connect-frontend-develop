import React         from 'react'
import './footer.scss'
import {Col, Row}    from 'reactstrap'
import {Link}        from 'react-router-dom'
import {Club}        from '@myfan/base'
import {Conditional} from '@myfan/web-components'
import {withContext} from '@myfan/store'
import {Types}       from '@myfan/commons'

const FooterComponent = ({intl: {formatMessage: intl}}: { intl: Types.IntlShape }) => {

    return (
        <footer className={'footer'}>
            <Conditional cond={Club.isEnabledFooter}>
                <Row>
                    <Col md={4} sm={4}>
                        <Link to={'/impressum'} className={'text'}>
                            {intl({id: 'impressum.text'})}
                        </Link>
                    </Col>
                    <Col md={4} sm={4}>
                        <Link to={'/privacy'} className={'text'}>
                            {intl({id: 'data.protection'})}
                        </Link>
                    </Col>
                    <Col md={4} sm={4}>
                        <a href={Club.termOfUseLink} target={'_blank'} className={'text'}>
                            {intl({id: 'term.of.use'})}
                        </a>
                    </Col>
                </Row>
            </Conditional>
        </footer>
    )
}

export default withContext(FooterComponent)

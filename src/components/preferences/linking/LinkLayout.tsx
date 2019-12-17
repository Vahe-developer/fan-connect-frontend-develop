import React      from 'react'
import {Row, Col} from 'reactstrap'
import './style.scss'
import {url}      from '@myfan/commons/dist/url1'
import {User}     from '@myfan/base'

interface Props {
    text: any,
    policyText: any,
    children: any

}

function LinkLayout({text, policyText = null, children}: Props) {

    //const [disabled, setDisabled] = useState(true)

    /*const scrollFunc = () => {
        const node = ReactDOM.findDOMNode(this);

        if (node instanceof HTMLElement) {
            const child = node.querySelector('.policy-text');
            if (child.scrollHeight - child.scrollTop === child.clientHeight) {
                setDisabled(false)
            }
        }
    }*/

    return (
        <>
            <Row className={'channel-linking-content'}>
                <Col>
                    <p className={'top-text sub-title'}>
                        {text}
                    </p>
                    <span className={'disableable'}>{children}</span>

                    <p className={'policy-text'}>
                        {policyText}
                    </p>
                </Col>
            </Row>
            {(url.getParams().hash || User.hasValidSession()) && (
                <div className="line"/>
            )}
        </>
    )

}

export default LinkLayout

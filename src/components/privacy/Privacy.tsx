import React          from "react";
import {Container}    from "reactstrap";
import {IntlHtmlText} from "../intl/IntlText";
import {Club}         from "@myfan/base";
import "./privacy.scss";

const Privacy = () => {
    return (
        <div className="privacy-policy-content" style={{color: Club.navbarBg}}>
            <Container>
                {IntlHtmlText('privacy.policy')}
            </Container>
        </div>
    );
}

export default Privacy;

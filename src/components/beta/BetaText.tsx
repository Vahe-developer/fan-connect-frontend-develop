import React          from "react"
import "./style.scss"
import {IntlHtmlText} from "../intl/IntlText"
import {url}          from "@myfan/commons"
import {Conditional}  from "@myfan/web-components"
import {Club}         from '@myfan/base'

const BetaText = () => {

    return (
        <Conditional cond={Club.isEnabledBetaText && !(url.getParam('federated') || url.getParam('shop'))}>
            <div className={"beta-text"}>
                <div className={"text"}>
                    <i className="fas fas fa-info-circle"></i>
                    <span>
                        {IntlHtmlText("beta.text")}
                    </span>
                </div>
            </div>
        </Conditional>
    )
}

export default BetaText

import React          from "react"
import {IntlHtmlText} from "../../intl/IntlText";
import './policy.scss'

const Policy = ({action} : {action : string}) => {
    return (
        <p className="privacy-policy">
             {IntlHtmlText('policy', {action})}
        </p>
    )
}

export default Policy

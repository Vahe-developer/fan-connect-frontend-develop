import React              from "react"
import {IntlText}         from "../../../intl/IntlText"
import {resendActivation} from "../../common/ResendActivationEmail"

export const unconfirmedErrMsg = (messageId: string, username: string, dispatch: Function) => {
    return (
        <span>
                {IntlText(messageId)},
            <span
                className={'link-like'}
                onClick={() => resendActivation(username, dispatch)}>
                    {IntlText('user.unconfirmed.link')}
                </span>
            </span>
    )
}

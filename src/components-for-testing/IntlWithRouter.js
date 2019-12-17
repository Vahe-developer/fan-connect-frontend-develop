import React from 'react'
import locale_de from "react-intl/locale-data/de";
import messages_de from "../translations/de.json";
import {addLocaleData, IntlProvider} from "react-intl";
import {BrowserRouter} from "react-router-dom";

addLocaleData([...locale_de]);

function WithRouterAndIntl(props) {
    return (
        <BrowserRouter>
            <IntlProvider locale={"de"} messages={messages_de}>
                {props.children}
            </IntlProvider>
        </BrowserRouter>
    )
}

export default WithRouterAndIntl
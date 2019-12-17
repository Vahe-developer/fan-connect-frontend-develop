import React       from 'react'
import {ReactIntl} from '@myfan/commons'

const {injectIntl, FormattedHTMLMessage} = ReactIntl

// @ts-ignore
const Msg             = injectIntl(({id, intl, values}) => intl.formatMessage({id}, values))
// @ts-ignore
export const IntlText = (id: string, values?: Object) => <Msg id={id} values={values}/>

// @ts-ignore
const Msg2                = injectIntl(({id, values}) => <FormattedHTMLMessage id={id} values={values}/>)
// @ts-ignore
export const IntlHtmlText = (id: string, values?: Object) => <Msg2 id={id} values={values}/>





import {withContext}                                    from '@myfan/store'
import {Container, Containers, styled, MaterialTooltip} from '@myfan/web-components'
import React, {useState}                                from 'react'
import PasswordComponent                                from './Password'
import {GlobalContextT}                                 from 'Redux'
import {Types}                                          from '@myfan/commons'
import {rightIcons, ViewModes}                          from '../commons'


interface Props {
    email: {
        title: string,
        value: string
    }
    password: {
        title: string
    }
    intl: Types.IntlShape
}

const Section = styled.div`
    margin : 16px 0;
`

const LoginData: React.FC<Props> = ({email, intl: {formatMessage}}) => {

    const [viewMode, setViewMode] = useState(ViewModes.SHOW)

    return (
        <Container size={'small'}>
            <Containers.BoxContainer
                header={{
                    left  : <MaterialTooltip content={formatMessage({id: 'contact.data.tooltip'})}/>,
                    center: <span className={'title'}>{formatMessage({id: 'login.data'})}</span>,
                    right : rightIcons({
                        onEditClick: () => setViewMode(ViewModes.SHOW),
                        onShowClick: () => setViewMode(ViewModes.EDIT),
                    })[viewMode],
                }}
                state={viewMode}
                contentShow={<div>
                    <Section>
                        <div>
                            {email.title}
                        </div>
                        <div className={'disabled'}>
                            {email.value}
                        </div>
                    </Section>
                    <Section>
                        <div>
                            {formatMessage({id: 'password'})}
                        </div>
                        <div style={{
                            fontSize: 22,
                        }}>
                            <input
                                style={{
                                    border    : 'none',
                                    color     : '#000',
                                    background: 'none',
                                    padding   : 0,
                                }}
                                type="password"
                                value={'placeholder'}
                                disabled
                            />
                        </div>
                    </Section>
                </div>}
                contentEdit={<PasswordComponent email={email}/>}
            />
        </Container>
    )
}

export default withContext(LoginData, (ctx: GlobalContextT) => ({intl: ctx.intl}))

import React                                          from 'react'
import {navigate, Url, Types, Routes}                 from '@myfan/commons'
import {Container, MaterialButton, PageTitle, styled} from '@myfan/web-components'
import {withRouter}                                   from 'react-router-dom'
import {renderRoutes}                                 from 'react-router-config'
import {withContext}                                  from '@myfan/store'
import {GlobalContextT}                               from 'Redux'

type Props = {
    route: any,
    intl: Types.IntlShape
}

const ButtonContainer = styled.div`
    margin : 0 auto 24px auto;
    background : #e0e0e0;
    display : grid;
    grid-template-columns : repeat(2, 1fr)
`

const Auth: React.FC<Props> = ({route, intl}) => {

    const activePath = new Url().pathname

    return (
        <Container>
            <PageTitle
                className={'title bold'}
                // @ts-ignore
                dangerouslySetInnerHTML={{__html: intl.formatHTMLMessage({id: 'authorization.header'})}}
            />
            <Container size={'extrasmall'}>
                <ButtonContainer>
                    <MaterialButton
                        variant={activePath.includes(Routes.authorization.login.build()) ? 'text' : 'contained'}
                        onClick={() => {
                            navigate('/authorization/login')
                        }}
                    >
                        {intl.formatHTMLMessage({id: 'login.btn'})}
                    </MaterialButton>
                    <MaterialButton
                        variant={activePath.includes(Routes.authorization.register.build()) ? 'text' : 'contained'}
                        onClick={() => {
                            navigate(Routes.authorization.register.build())
                        }}
                    >
                        {intl.formatHTMLMessage({id: 'register.btn'})}
                    </MaterialButton>
                </ButtonContainer>
            </Container>

            {renderRoutes(route.routes)}
        </Container>
    )
}

export default withRouter(
    withContext(
        Auth,
        (ctx: GlobalContextT) => ({intl: ctx.intl})))

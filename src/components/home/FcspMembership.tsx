import * as React        from 'react'
import {withContext}     from '@myfan/store'
import {Club}            from '@myfan/base'
import {navigate, Types} from '@myfan/commons'
import {
    styled,
    Pages,
    TextContainerWithColumns,
}                        from '@myfan/web-components'

type Props = {
    intl: Types.IntlShape,
    data: {
        titleKey: string,
        descKey: string,
        imageUrl: string,
    }
}

const {AppContainer, ImageContainer} = Pages.HomePage.Containers

const DescriptionContainer = styled.div`
        padding : 8px;
`

const Container = styled(AppContainer)`
    width: 25%;
    max-width: 400px;
    min-width: 260px;
    margin: 0 auto;
`

const FcspMembership: React.FC<Props> = ({data, intl: {formatMessage, formatHTMLMessage}}) => {

    return (
        <Container className={'fcsp-membership-container'}>
            <ImageContainer src={`${Club.backendUrl.replace('/api', '')}${data.imageUrl}`}/>
            <DescriptionContainer>
                <TextContainerWithColumns>
                    <div className={'title'}>
                        {formatMessage({id: data.titleKey})}
                    </div>
                    <div className={'text'}>
                        {formatMessage({id: data.descKey})}
                        <span
                            className={'pointer'}
                            onClick={() => navigate('/product/membership/introduction')}
                            // @ts-ignore
                            dangerouslySetInnerHTML={{
                                __html: formatHTMLMessage({id: 'home.membership.description.link'}),
                            }}
                        />
                    </div>
                </TextContainerWithColumns>
            </DescriptionContainer>
        </Container>
    )
}

export default withContext(FcspMembership, (ctx: { intl: any }) => ({intl: ctx.intl}))

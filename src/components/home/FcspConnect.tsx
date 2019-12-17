import {Global, Types} from '@myfan/commons'
import {withContext}   from '@myfan/store'
import * as React      from 'react'
import {
    Slider,
    styled,
    MaterialButton,
    TextContainerWithColumns,
    Pages,
}                      from '@myfan/web-components'
import {Club}          from '@myfan/base'
import {App}           from '@myfan/pages/dist/types/profile'

type Props = {
    apps: App[],
    intl: Types.IntlShape
}

const {AppContainer, ImageContainer, Connection} = Pages.HomePage.Containers

const DescriptionContainer = styled.div`
        padding : 8px;
`

const FcspConnect: React.FC<Props> = ({apps, intl: {formatMessage}}) => {
    return (
        <div>
            <Slider>
                {apps && apps.map((app, key) => {
                    return (
                        <AppContainer key={key} className={'apps-container'}>
                            <ImageContainer
                                connected={!app.permissionSet}
                                src={`${Club.backendUrl.replace('/api', '')}/media/setting/Gary-Moore.png`}
                            >
                                <Connection>
                                    {!app.permissionSet && (
                                        <MaterialButton
                                            variant={'contained'}
                                            onClick={() => {
                                                Global.window.open(app.loginUri, '_blank')
                                            }}
                                        >
                                            Verbiden
                                        </MaterialButton>
                                    )}
                                </Connection>
                            </ImageContainer>
                            <DescriptionContainer>
                                <TextContainerWithColumns>
                                    <div className={'title'}>
                                        {app.name}
                                    </div>
                                    <div className={'text'}>
                                        {formatMessage({id: app.desc})}
                                    </div>
                                </TextContainerWithColumns>
                            </DescriptionContainer>
                        </AppContainer>
                    )
                })}
            </Slider>
        </div>
    )
}

export default withContext(FcspConnect, (ctx: { intl: any }) => ({intl: ctx.intl}))

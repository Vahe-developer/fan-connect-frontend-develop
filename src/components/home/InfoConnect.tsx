import {navigate, Types} from '@myfan/commons'
import * as React        from 'react'
import {
    Slider,
    styled,
    TextContainerWithColumns,
    Pages,
    Carousel,
}                        from '@myfan/web-components'
import {ChannelT}        from '@myfan/pages/dist/types/channel'
import {withContext}     from '@myfan/store'

type Props = {
    channels: ChannelT[],
    intl: Types.IntlShape,
    isTablet: boolean
}

const {AppContainer, IconContainer} = Pages.HomePage.Containers

const DescriptionContainer = styled.div`
        padding : 8px;
`

const ChannelContainer = styled.div`
        text-align : center;
        cursor : pointer;
`

const InfoConnect: React.FC<Props> = ({channels, intl: {formatMessage}, isTablet}) => {

    const Channel = ({channel, width}: { channel: ChannelT, width: string }) => {

        const channelName = channel.name.toLowerCase()

        return (
            <AppContainer
                style={{
                    width,
                    background: 'initial',
                }}
                className={'apps-container'}
                onClick={() => navigate('/p', {
                    params: {
                        page: channelName,
                    },
                })}
            >
                <IconContainer>
                    <i className={channel.icon}></i>
                </IconContainer>
                <DescriptionContainer>
                    <TextContainerWithColumns>
                        <div className={'title'}>
                            {channel.name}
                        </div>
                        <div className={'text'}>
                            {formatMessage({id: channel.descKey})}
                        </div>
                    </TextContainerWithColumns>
                </DescriptionContainer>
            </AppContainer>
        )
    }

    return (
        <ChannelContainer>
            {isTablet ? (
                <Carousel
                    slidesToScroll={1}
                    slidesToShow={1}
                    cellAlign={'center'}
                    renderCenterLeftControls={({previousSlide}) => {
                        return <i onClick={previousSlide} className="fas fa-chevron-left title"
                                  style={{fontSize: '32px'}}/>
                    }}
                    renderCenterRightControls={({nextSlide}) => {
                        return <i onClick={nextSlide} className="fas fa-chevron-right title"
                                  style={{fontSize: '32px'}}/>
                    }}
                >
                    {channels && channels.map((channel, key) => {
                        return <Channel
                            key={key}
                            channel={channel}
                            width={'100%'}
                        />
                    })}
                </Carousel>
            ) : (
                <Slider>
                    {channels && channels.map((channel, key) => {
                        return <Channel
                            key={key}
                            channel={channel}
                            width={'216px'}
                        />
                    })}
                </Slider>
            )}
        </ChannelContainer>
    )
}

export default withContext(InfoConnect, (ctx: { intl: any, isTablet: boolean }) => ({
    intl    : ctx.intl,
    isTablet: ctx.isTablet,
}))

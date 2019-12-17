import {Carousel}        from '@myfan/web-components'
import React, {useState} from 'react'
import {Row, Col}        from 'reactstrap'
import './channel-icons.scss'
import Nl2goLinking      from '../linking/nl2go/Nl2goLinking'
import WhatsAppLinking   from '../linking/whatsApp/WhatsAppLinking'
import {EMAIL, WHATSAPP} from '../../constants/Channels'
import {IChannel}        from '../Channels'
import {withContext}     from '@myfan/store'

const channelLinkingsComponents = {
    [EMAIL]   : <Nl2goLinking/>,
    [WHATSAPP]: <WhatsAppLinking/>,
}

interface IChannelIcons {
    channels: IChannel[]
    selected: IChannel
    isMobile: boolean

    onClick(number: number): void,
}

const iconStyles  = new Map()
const titleStyles = new Map()

titleStyles.set(true, {
    fontSize    : '20px',
    marginBottom: '8px',
})

titleStyles.set(false, {
    fontSize    : '16px',
    marginTop   : '24px',
    marginBottom: 0,
})

iconStyles.set(true, {
    fontSize: '64px',
})

iconStyles.set(false, {
    fontSize: '32px',
})

const transition = 'all 0.3s'

const ChannelIcons = ({channels, onClick, selected, isMobile}: IChannelIcons) => {

    const [slideIndex, setSlideIndex] = useState(channels.findIndex(channel => channel.selected))

    return (
        <React.Fragment>
            <Row>
                <Col md={6} sm={8} xs={12} className="channel-icons">
                    <Carousel
                        slidesToScroll={1}
                        slideIndex={slideIndex}
                        afterSlide={slideIndex => {
                            setSlideIndex(slideIndex)
                            onClick(channels[slideIndex].id)
                        }}
                        speed={100}
                        slidesToShow={isMobile ? 1 : 3}
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
                        {channels.map((channel) => (
                            <div
                                key={channel.id.toString()}
                                className={`channel-item ${channel.selected ? 'active' : ''}`}
                                //onClick={() => {
                                //    setSlideIndex(key)
                                //    onClick(channel.id)
                                //}}
                            >
                                <p
                                    style={{transition, ...titleStyles.get(channel.selected)}}
                                    className={'title'}>{channel.name}</p>
                                <i
                                    style={{transition, ...iconStyles.get(channel.selected)}}
                                    className={channel.icon}
                                />
                            </div>
                        ))}
                    </Carousel>
                </Col>
            </Row>
            <Row>
                <Col md={5} sm={9} xs={11} style={{margin: '0 auto'}}>
                    <div className="line"/>
                </Col>
            </Row>
            <Row>
                <Col className={'channel-linking'}>
                    {selected.disabled && channelLinkingsComponents[selected.name]}
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default withContext(ChannelIcons, (ctx: { isMobile: boolean }) => ({isMobile: ctx.isMobile}))

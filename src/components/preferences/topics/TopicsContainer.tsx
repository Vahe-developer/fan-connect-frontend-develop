import React                                 from 'react'
import Topic                                 from './Topic'
import FrequencyContainer                    from '../frequency/Frequency'
import './topics.scss'
import {Col, Container, Row}                 from 'reactstrap'
import {withContext, withStore, useDispatch} from '@myfan/store'
import {actions, Types}                      from 'Redux'
import {Types as CommonTypes}                from '@myfan/commons'

interface ITopicsContainer {
    disabled: boolean,
    selectedChannel: Types.Channels.IChannel,
    channels: Types.Channels.IChannel[],
    intl: CommonTypes.IntlShape
}

function TopicsContainer(props: ITopicsContainer) {

    const dispatch                                = useDispatch()
    const {channels, intl: {formatMessage: intl}} = props

    const handleClick = (event: React.BaseSyntheticEvent): void => {

        const topicID = parseInt(event.currentTarget.dataset.id, 10)
        const data    = {
            channels: channels,
            topicID : topicID,
        }

        actions.subscriptions.toggleTopics(data, dispatch)
    }

    const getFreqLength = (): boolean => {
        return props.selectedChannel.frequencies.length !== 0
    }


    const channelFrequencyName: { [key: string]: string } = {
        'WhatsApp': intl({id: 'other.features'}),
        'E-mail'  : intl({id: 'other.interests'}),
    }

    return (
        <Row className={'channels-topics disableable'} disabled={props.disabled}>
            {props.selectedChannel.topics.map((topic: Types.Channels.ITopic, index) => (
                <Col md={12} key={index} className={'topic'}>
                    <Topic
                        key={index}
                        topic={topic}
                        onClick={handleClick}
                    />
                    {(getFreqLength() && !index) && (
                        <FrequencyContainer selectedChannel={props.selectedChannel}/>
                    )}
                    {!index && (
                        <>
                            <Container>
                                <div className="frequency line"/>
                            </Container>
                            <p className={'other-features title'}>
                                {channelFrequencyName[props.selectedChannel.name]}
                            </p>
                        </>
                    )}
                </Col>
            ))}
        </Row>
    )
}


export default withContext(withStore(TopicsContainer, (state: { club: { channels: any; }; }) => ({channels: state.club.channels})))

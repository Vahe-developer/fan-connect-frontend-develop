import React                                 from 'react'
import FrequencyPick                         from './FrequencyPick'
import './frequency.scss'
import {UnexpectedError}                     from '../../errors/UnexpectedError'
import {withContext, withStore, useDispatch} from '@myfan/store'
import {actions, Types}                      from 'Redux'
import {Types as CommonTypes}                from '@myfan/commons'

interface IFrequencyProps {
    selectedChannel: Types.Channels.IChannel,
    channels: Types.Channels.IChannel[],
    intl: CommonTypes.IntlShape
}

function Frequency(props: IFrequencyProps) {

    const indexedFrequencies: { id: any; }[] = []

    const dispatch = useDispatch()
    const channels = props.channels

    const getMarksLabels = () => {
        setMarksIndex()
        return props
            .selectedChannel
            .frequencies
            .reduce((labels, freq, index) => {
                // @ts-ignore
                labels[index] = props.intl.formatMessage({id: freq.nameTranslationKey})
                return labels
            }, {})
    }

    const setMarksIndex = (): { id: number }[] => {
        return props.selectedChannel.frequencies.map((freq, index) => {
            return indexedFrequencies[index] = {
                id: freq.id,
            }
        })
    }

    const getMax = (): number => {
        return getFrequenciesLength() - 1
    }

    const handleOnChange = (index: number): void => {

        const freqID = indexedFrequencies[index].id

        const data = {
            channels   : channels,
            frequencyID: freqID,
        }
        actions.subscriptions.getSelectedFrequency(data, dispatch)
    }

    const getFrequenciesLength = (): number => {
        return props.selectedChannel.frequencies.length
    }

    const selectedFrequency = (): number => {

        const frequencies = props.selectedChannel.frequencies

        const frequency = frequencies.find(frequency => frequency.selected) || frequencies[0]

        if (!frequency) throw new UnexpectedError('No frequency')

        const freqIndex = indexedFrequencies
            .map((freq, index) => {
                return {id: index, markIndex: freq.id}
            })
            .find(item => item.markIndex === frequency.id)

        if (!freqIndex) throw new UnexpectedError('No frequency index id')

        return freqIndex.id
    }

    return (
        <FrequencyPick
            marks={getMarksLabels()}
            onChange={handleOnChange}
            min={0}
            max={getMax()}
            value={selectedFrequency()}
        />
    )
}

export default withStore(withContext(Frequency), (state: { club: { channels: any; }; }) => ({channels: state.club.channels}))

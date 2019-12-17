import React      from 'react'
import PopupFan   from '../popup/Popup'
import Button     from '../presentation-components/buttons/auth/Button'
import SaveButton from './SaveButton'

const ChannelButtons = (props: {
    unsubscribe(): void,
    isChannelDisabled(): boolean,
    handleSave(): void,
    onCancel(): void,
    channel: string,
    showSaveButton: boolean
}) => {

    return (
        <div className={'buttons'}>
            {!props.isChannelDisabled() && (
                <PopupFan
                    handleYes={props.unsubscribe}
                    textId={'want.unsubscribe'}
                >
                    <Button
                        className={'ghost'}
                    >
                        {props.channel}
                    </Button>
                </PopupFan>
            )}
            <SaveButton
                showSaveButton={props.showSaveButton}
                onSave={props.handleSave}
                onCancel={props.onCancel}
            />
        </div>
    )
}

export default ChannelButtons

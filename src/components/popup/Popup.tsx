import React      from 'react'
import Popup      from 'reactjs-popup'
import './popup.scss'
import Button     from '../presentation-components/buttons/auth/Button'
import {IntlText} from '../intl/IntlText'

const PopupFan = (
    {
        children,
        handleYes,
        textId,
        textParam = {},
    }: {
        children: any,
        handleYes: () => void,
        textId: string,
        textParam?: { [key: string]: string }
    }) => {

    return (
        <Popup
            trigger={children}
            modal
            closeOnDocumentClick
            contentStyle={{
                borderRadius: '0.25rem',
                border      : '1px solid #171b3a',
                width       : '320px',
                padding     : '24px 8px',
            }}
        >
            {close => (
                <div className={'fan-popup sub-title'}>
                    <p>{IntlText(textId, textParam)}</p>
                    <div className={'popup-buttons'}>
                        <Button
                            className={'ghost'}
                            onClick={close}
                        >
                            {IntlText('cancel')}
                        </Button>
                        <Button
                            onClick={() => {
                                handleYes()
                                close()
                            }}
                        >
                            {IntlText('yes')}
                        </Button>
                    </div>
                </div>
            )}
        </Popup>
    )
}

export default PopupFan

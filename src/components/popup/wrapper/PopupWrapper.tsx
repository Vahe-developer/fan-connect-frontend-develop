import React from 'react'
import Popup from 'reactjs-popup'
import './styles.scss'

const PopupWrapper = (
    {
        children,
        content
    }: {
        children: JSX.Element,
        content: JSX.Element
    }) => {

    return (
        <Popup
            trigger={children}
            modal
            closeOnDocumentClick
            contentStyle={{
                borderRadius: '0.25rem',
                border      : '1px solid #171b3a',
            }}
        >
            {close =>
                <div className={'popup-wrapper'}>
                    <div onClick={close} className="close-icon">
                        &times;
                    </div>
                    {/*  <i className="fas fa-times close-icon"></i>*/}
                    {content}
                </div>
            }

        </Popup>
    )
}

export default PopupWrapper

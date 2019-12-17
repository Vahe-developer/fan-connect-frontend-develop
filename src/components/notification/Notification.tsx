import {Club}                   from '@myfan/base'
import React                    from 'react'
import {Global, Types}          from '@myfan/commons'
import {useDispatch, withStore} from '@myfan/store'
import {actions, GlobalState}   from 'Redux'
import {styled}                 from '@myfan/web-components'

type IPresentational = {
    notification: Partial<Types.NotificationT>
}

const NorificationContainer = styled.div`
    position: fixed;
    min-width: 100px;
    transition : all 0.5s;
    bottom: ${({show}: { show: boolean }) => show ? '16px' : '-124px'};
    right: 16px;
    z-index : 1100; 
    cursor : pointer;
    border-radius: 4px;
    
    @media (max-width : 420px) {
        left : 0;
        right: 0;
        bottom: ${({show}: { show: boolean }) => show ? '0' : '-124px'};  
        border-radius : 0;
    }
`

function Notification({notification: {msg, color, fadeIn, show}}: IPresentational) {

    let timeOutForHide: NodeJS.Timeout
    const dispatch = useDispatch()

    function hideNotificationInSeconds(seconds: number) {
        Global.window.scrollTo({top: 0, behavior: 'smooth'})
        timeOutForHide = setTimeout(() => {
            hideNotification()
        }, seconds * 1000)
    }

    function hideNotification() {
        clearTimeout(timeOutForHide)
        dispatch(actions.notification.set({show: false}))
    }

    return (
        <NorificationContainer
            show={show ? true : false}
            className="text"
            onClick={hideNotification}
        >
            <div
                style={{
                    background: color === 'success' ? Club.navbarBg : '#f8d7da',
                    color     : 'white',
                    padding   : 12,
                    textAlign : 'center',
                }}
            >
                {msg}
            </div>
            {show && (
                hideNotificationInSeconds(fadeIn || 5)
            )}
        </NorificationContainer>
    )
}

export default withStore(Notification, (state: GlobalState) => ({notification: state.notification}))

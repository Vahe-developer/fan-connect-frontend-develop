import React                         from 'react'
import {withStore, useDispatch}      from '@myfan/store'
import {GlobalState, Types, actions} from 'Redux'

type BackButtonT = {
    backButton: Types.BackButton.BackButtonT
}

const BackButton: React.FC<BackButtonT> = ({backButton}) => {

    const dispatch = useDispatch()

    const onClick = () => {
        backButton.stack.pop()

        if (backButton.stack.items.length === 0) {
            dispatch(actions.backButton.reset())
        }
    }

    return (
        <>
            {
                backButton.stack.items.length > 0 ? (
                    <i
                        className="fas fa-arrow-left"
                        style={{color: 'white', marginLeft: '16px', fontSize: '22px'}}
                        onClick={onClick}
                    />
                ) : null
            }
        </>
    )
}

export default withStore(BackButton, (store: GlobalState) => ({backButton: store.backButton}))

import React                    from 'react'
import {MaterialButton, styled} from '@myfan/web-components'
import {withContext}            from '@myfan/store'
import {Types}                  from '@myfan/commons'
import {GlobalContextT}         from 'Redux'

const FixedContainer: any = styled.div`
    position: fixed;
    left : ${(props: any) => props.isTablet ? 0 : props.layoutLeftSide}px;   
    bottom: ${({showSaveButton}: { showSaveButton: boolean }) => showSaveButton ? 0 : '-100px;'};   
    right: 0;
    z-index : 10;
    padding : 16px;
    background : white;
    border-top : 1px solid black;
    transition : all 0.3s;
`

const ButtonContainer = styled.div`
    margin-right : 8px;
    min-width : 120px;
`

const btnStyles = {
    marginTop: 0,
}

type Props = {
    showSaveButton: boolean,
    onSave: () => void,
    onCancel: () => void,
    intl: Types.IntlShape,
    layoutLeftSide: number,
    isTablet: boolean
}

const SaveButton = ({showSaveButton, intl: {formatMessage}, onSave, onCancel, layoutLeftSide, isTablet}: Props) => {

    return (
        <>
            <FixedContainer
                showSaveButton={showSaveButton}
                layoutLeftSide={layoutLeftSide}
                isTablet={isTablet}
            >
                <div style={{
                    margin        : '0 auto',
                    display       : 'flex',
                    justifyContent: 'center',
                }}>
                    <ButtonContainer>
                        <MaterialButton
                            style={btnStyles}
                            variant={'contained'}
                            onClick={onCancel}
                        >
                            {formatMessage({id: 'cancel'})}
                        </MaterialButton>
                    </ButtonContainer>
                    <ButtonContainer>
                        <MaterialButton
                            style={btnStyles}
                            onClick={onSave}
                        >
                            {formatMessage({id: 'save.changes'})}
                        </MaterialButton>
                    </ButtonContainer>
                </div>
            </FixedContainer>
        </>
    )
}

export default withContext(SaveButton, (ctx: GlobalContextT) => ({
    intl          : ctx.intl,
    layoutLeftSide: ctx.layoutLeftSide,
    isTablet      : ctx.isTablet,
}))

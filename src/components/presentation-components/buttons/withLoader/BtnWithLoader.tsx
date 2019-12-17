import React     from 'react'
import {Loading} from "@myfan/web-components"
import "./styles.scss"
import Button    from "../auth/Button"
import {IButton} from "../auth/Button"

function BtnWithLoader(props: IButton & { load: boolean }) {

    return (
        <span className={'with-loader'}>
             <Button {...props}>
                {props.children}
                 {props.load && (
                     <Loading/>
                 )}
            </Button>
        </span>

    )

}

export default BtnWithLoader

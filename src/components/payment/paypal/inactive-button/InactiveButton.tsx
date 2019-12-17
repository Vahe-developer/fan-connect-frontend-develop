import React         from 'react'
import "./styles.scss"
import BtnWithLoader from "../../../presentation-components/buttons/withLoader/BtnWithLoader";

function InactiveButton({onclick, loading = false}: { onclick: () => Promise<void>, loading : boolean}) {

    return (
        <BtnWithLoader className={'paypal-button inactive'} onClick={onclick} load={loading}>
            <img className={'logo'} src="/paypal/logo-inactive.png" alt=""/>
        </BtnWithLoader>
    )
}

export default InactiveButton

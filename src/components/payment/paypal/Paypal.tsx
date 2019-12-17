import React, {useState} from 'react'
import './styles.scss'
import {request}         from '@myfan/base'
import ActiveButton      from './active-button/ActiveButton'
import {redirect}        from '@myfan/commons'
import InactiveButton    from './inactive-button/InactiveButton'
import {withStore}       from '@myfan/store'
import {Types}           from 'Redux'

function Paypal({paypal}: any) {

    const [loading, setLoading] = useState<boolean>(false)
    /*
        useEffect(() => {

             loadDynamicScript({
                 id:  "@myfan/paypal-script",
                 url: "https://www.paypal.com/sdk/js" +
                          "?client-id=AQWfKYye56xjOHhL-fFz9p2OYuApTZ66Tdfw-aYmx2xBehLqXOvEho2OAlaDI_F0ud4_Kc8LZycVQc1x" +
                          "&disable-card=visa,mastercard,amex&commit=false"
             }).then(() => {

                 let shippingAddress;

                 const paypal = getGlobal("paypal")
                 paypal.Buttons({
                     createOrder:      function (data, actions) {
                         // Set up the transaction
                         return actions.order.create({
                             purchase_units: [{
                                 amount: {
                                     value: '137'
                                 }
                             }]
                         });
                     },
                     onShippingChange: function (data) {
                         console.log(data)
                         shippingAddress = data.shipping_address
                     },

                     // Finalize the transaction
                     onApprove: function (data, actions) {
                         console.log("onApprove", data)
                         return actions.order.capture().then(async function (details) {
                             const body = {
                                 ...details, orderId: data.orderID, shippingAddress
                             }

                             console.log('body:', body)
                             //alert('Transaction completed by ' + details.payer.name.given_name + '!');
                             await request.post("/payment/user", {details: body})
                             getProfileData(dispatch)
                         });
                     }

                 }).render('#paypal-button-container')
             })

        }, [])
     */

    const getApprovalUrl = async (): Promise<void> => {
        setLoading(true)
        const res: { data: { agreement: { approvalLink: string } } } = await request.post('/payment/create-agreement')

        redirect(res.data.agreement.approvalLink, {query: false, hash: false})
    }

    return (
        <div className={'paypal'}>
            {paypal.status === Types.Profile.PaymentStatus.ACTIVATED ? (
                <ActiveButton email={paypal.email}/>
            ) : (
                <InactiveButton onclick={getApprovalUrl} loading={loading}/>
            )}
        </div>
    )
}

export default withStore(Paypal, (state: { profile: { userData: { payment: { paypal: any; }; }; }; }) => ({paypal: state.profile.userData.payment.paypal}))

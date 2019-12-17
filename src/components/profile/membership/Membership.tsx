import React                                         from 'react'
import {withContext}                                 from '@myfan/store'
import {IFieldNames}                                 from '../../constants/Fields'
import {Input, Intl, navigate, Types as CommonTypes} from '@myfan/commons'
import {Container, MaterialButton, styled}           from '@myfan/web-components'
import {Club}                                        from '@myfan/base'
import {Types}                                       from 'Redux'

const MEMBERSHIP_STATUS_MISSING  = 'missing'
const MEMBERSHIP_STATUS_CANCELED = 'canceled'
const MEMBERSHIP_STATUS_PENDING  = 'pending'

const MembershipData = ({
                            data,
                            placeholders,
                            lang,
                            intl,
                        }: {
    data: Types.Profile.UserDataT,
    placeholders: IFieldNames,
    lang: string,
    intl: CommonTypes.IntlShape
}): JSX.Element => {

    const {status} = data.membership

    const WithMarginBottom = styled.div`
        margin: 0 auto 24px;
        text-align: center;
    `

    const Button = styled.button`
        width: 64%;
        cursor: pointer;
    `

    const MembershipFactory = ({status}: { status: string }) => {
        switch (status) {
            case MEMBERSHIP_STATUS_MISSING:
            case MEMBERSHIP_STATUS_CANCELED:
                return (
                    <>
                        <WithMarginBottom>
                            {placeholders.registerNewMembershipMessage}
                        </WithMarginBottom>
                        <div style={{width: '90%', margin: '0 auto'}}>
                            <div style={{marginBottom: 16}}>
                                {/*
                                // @ts-ignore */}
                                <MaterialButton
                                    className={'classes.MuiButton'}
                                    onClick={() => {
                                        navigate('/product/membership/introduction')
                                    }}
                                >
                                    {placeholders.registerNewMembershipButton}
                                </MaterialButton>
                            </div>
                            <div style={{textAlign: 'center'}}>
                                <Button
                                    className={'button ghost'}
                                    onClick={() => {
                                        navigate('/product/membership/register-membership')
                                    }}
                                    //style={{background: Club.navbarBg, color: 'white'}}
                                >
                                    {placeholders.linkExistingMembership}
                                </Button>
                            </div>
                        </div>
                    </>
                )
            case MEMBERSHIP_STATUS_PENDING:
                return (
                    <div
                        className={'sub-title'}
                        style={{
                            textAlign: 'center',
                        }}>
                        {placeholders.membershipPendingMessage}
                    </div>
                )
            default:
                return (
                    <>
                        <MembershipContainer>
                            <MembershipDiv>
                                <MembershipHeader>
                                    <PenIcon className='fas fa-pencil-alt' title={'Edit'} onClick={() => {
                                        navigate('/product/membership/edit')
                                    }}/>
                                    {placeholders.membershipMain}
                                </MembershipHeader>

                            </MembershipDiv>
                            <MembershipContent>
                                <MembershipRowWithMargin>{placeholders.membershipNumber}: {number}</MembershipRowWithMargin>
                                <MembershipRowWithMargin>
                                    {intl.formatMessage({id: options.sportType})} &#8226; {intl.formatMessage({id: options.membershipType})}
                                </MembershipRowWithMargin>
                                {/*<MembershipRowWithMargin>&euro;{price} {placeholders.membershipPerMonth}</MembershipRowWithMargin>*/}
                                {/*<MembershipRow>{placeholders.membershipStatus}: {status}</MembershipRow>*/}
                                <MembershipRow>
                                    {placeholders.membershipCreatedAt}: {intl.formatDate(confirmedAt, {
                                    day  : '2-digit',
                                    month: 'long',
                                    year : 'numeric',
                                })}
                                </MembershipRow>
                                {/*<MembershipRow>*/}
                                {/*    {placeholders.membershipNextPayment}: {intl.formatDate(nextPayment, {*/}
                                {/*    day  : '2-digit',*/}
                                {/*    month: 'long',*/}
                                {/*    year : 'numeric'*/}
                                {/*})}*/}
                                {/*</MembershipRow>*/}
                            </MembershipContent>
                        </MembershipContainer>

                        {showMembershipAddress && (<MembershipContainer>
                            <MembershipDiv>
                                <MembershipHeader>{placeholders.membershipMemberAddress}</MembershipHeader>
                            </MembershipDiv>

                            <MembershipContent>
                                <MembershipRow>{`${address.firstName} ${address.middleName} ${address.lastName}`}</MembershipRow>
                                <MembershipRow>{address.houseNumber}</MembershipRow>
                                <MembershipRow>{address.postalCode} {address.city}</MembershipRow>
                                <MembershipRowWithMargin>{country}</MembershipRowWithMargin>

                                <MembershipRow>
                                    <MembershipButton
                                        className='button ghost'>{placeholders.membershipMemberAddressButton}</MembershipButton>
                                </MembershipRow>
                            </MembershipContent>
                        </MembershipContainer>)}
                    </>
                )
        }
    }

    const {number, confirmedAt, address, options} = data.membership

    const MembershipContainer = styled.div`
        font-size: 16px;
        width: 96%;
        margin: 16px auto 24px;
        background-color: #efefef;
        border-radius: 8px;
        box-shadow: 2px 2px 4px grey;
    `

    const MembershipDiv = styled.div`
        text-align: center;
        border-bottom: 1px solid rgb(96, 71, 52);
    `

    const MembershipHeader = styled.h5`
        padding-top: 16px;
        padding-bottom: 8px;
    `

    const MembershipContent = styled.div`
        padding: 24px;
    `

    const MembershipRow = styled.div`
        margin: 0;
    `

    const MembershipRowWithMargin = styled(MembershipRow)`
        margin-bottom: 16px;
    `

    const MembershipButton = styled.button`
        margin: 0 auto;
        width: 100%;
        text-align: center;
        cursor: pointer;
    `

    const PenIcon = styled.i`
        float: right;
        padding: 0 16px 0 0;
        cursor: pointer;
        color: ${Club.navbarBg};
        font-size: 16px;
    `

    const country = Input.setLang(lang).fromValue(address.country, CommonTypes.InputEnum.Country)

    const showMembershipAddress = false

    return (
        <Container>
            <MembershipFactory status={status}/>
        </Container>
    )
}

export default withContext(
    Intl.withIntl(MembershipData),
    (ctx: { intl: any; }) => ({intl: ctx.intl}),
)

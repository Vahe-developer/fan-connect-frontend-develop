import React                 from 'react'
import LogoutButton          from '../../presentation-components/buttons/logout/LogoutButton'
import {FCSPID}              from './constants'
import {Col, Container, Row} from 'reactstrap'
import ProfileSection        from './ProfileSection'
import './section.scss'
import {IntlText}            from '../../intl/IntlText'
import {ClientApp}           from '@myfan/clients'
import {withStore}           from '@myfan/store'
import {Types, GlobalState}  from 'Redux'

export function CompareProfile({profile}: { profile: Types.Profile.ProfileState }) {

    const {userData, mergingProfileData, diffFieldsNames, requiredFields} = profile

    const getProfilesData = () => {

        return [
            {data: userData, client: FCSPID, name: 'FCSP.ID'},
            {newData: mergingProfileData, client: true, name: ClientApp.name},
        ].reduce((newArr, val, key) => {
            newArr[key]                   = {}
            newArr[key]['header']         = val.name
            newArr[key]['fields']         = Object.values(val)[0]
            newArr[key]['client']         = val.client
            newArr[key]['diffFields']     = diffFieldsNames
            newArr[key]['requiredFields'] = requiredFields
            return newArr
        }, ([] as any))
    }

    return (
        <Container>
            <div className={'compare-profile-section'}>
                <h3 className={'center'}>
                    {IntlText('compare.screen.title')}
                </h3>
                <Row className={'justify-content-space-evenly'}>
                    {getProfilesData().map((profileData: any, key: number) =>
                        <Col key={key} sm={5} className={'compare-profile-block'}>
                            <ProfileSection {...profileData} requiredFields={requiredFields}/>
                        </Col>,
                    )}
                </Row>
                <div className={'logout-btn'}>
                    <LogoutButton/>
                </div>
            </div>
        </Container>
    )
}

export default withStore(CompareProfile, (state: GlobalState) => ({profile: state.profile}))

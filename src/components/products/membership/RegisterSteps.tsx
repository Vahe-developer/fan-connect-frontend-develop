import React, {useContext, useEffect, useState} from 'react'
import {string}                                 from '@myfan/commons'
import {withStore, useDispatch}                 from '@myfan/store'
import {actions, Types}                         from 'Redux'
import {ProgressV2, Pages}                      from '@myfan/web-components'
import {MembershipContext}                      from './Membership'
import FinalStep                                from './steps/FinalStep'
import Data                                     from './steps/Data'
import MembershipType                           from './steps/MembershipType'

const {Products: ProductsView} = Pages
const {Membership}             = ProductsView
const {MembershipCtx}          = Membership


interface Progressable {
    finished: boolean,
    component: any
}

type Props = {
    profile: Types.Profile.ProfileState
}

const RegisterSteps = ({profile}: Props) => {

    const dispatch     = useDispatch()
    const {membership} = useContext(MembershipContext)
    const {state}      = membership

    // @ts-ignore
    const [userData, setUserData] = useState<Types.UserData>(profile.userData)

    useEffect(() => {
        setUserData(state)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile.loading])


    // @ts-ignore
    const handleChange = (e: { target: { value: string, name: string } }): void => {

        let targetValue = e.target.value
        const name      = e.target.name

        setUserData({...userData, [name]: string.trimed(targetValue)})

        dispatch(
            actions.errors.remove(
                {
                    name: name,
                },
            ),
        )
    }

    const [stepComponents, setStepComponents] = useState<Progressable[]>([
        {
            component: Data,
            finished : false,
        },
        {
            component: MembershipType,
            finished : false,
        },
        {
            component: FinalStep,
            finished : false,
        },
    ])

    const {currentIndex, setCurrentIndex} = membership

    useEffect(() => {
        setStepComponents(
            // @ts-ignore
            stepComponents.map((component, index) => {
                if (index === currentIndex - 1) {
                    component.finished = true
                }

                return component
            }),
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex])

    return (
        <MembershipCtx.Provider
            value={{
                // @ts-ignore
                handleChange,
                userData,
            }}
        >
            <ProgressV2
                currentIndex={currentIndex}
                onClick={setCurrentIndex}
                components={stepComponents}
            />
        </MembershipCtx.Provider>
    )
}

export default withStore(RegisterSteps, (state: { profile: any; }) => ({profile: state.profile}))


import {useEffect}                                from 'react'
import * as React                                 from 'react'
import {withStore}                                from '@myfan/store'
import {Container, Conditional, SuccessCheckmark} from '@myfan/web-components'
import {navigate, Routes}                         from '@myfan/commons'
import {GlobalState}                              from 'Redux'

const SuccessView = ({message: {msg}}: { message: { msg: string } }) => {

    useEffect(() => {
        if (!msg) {
            navigate(Routes.profile.build())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Conditional cond={msg}>
            <Container className={'title-18'} size={'small'}>
                {msg}
                <SuccessCheckmark styles={{
                    marginTop: '32px',
                }}/>
            </Container>
        </Conditional>
    )
}

export default withStore(
    SuccessView,
    (state: GlobalState) => ({message: state.message}),
)

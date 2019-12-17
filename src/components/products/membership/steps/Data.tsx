import * as React                                                     from 'react'
import {useState, useContext, useEffect}                              from 'react'
import {withContext, useDispatch}                                     from '@myfan/store'
import {actions, Types, GlobalContextT}                               from 'Redux'
import {Intl, Input, Types as CommonTypes}                            from '@myfan/commons'
import {ShadowedContainer, Button, MaterialButton, Container, styled} from '@myfan/web-components'

import EditableData        from './EditableData'
import {Validator}         from '@myfan/validation'
import {MembershipContext} from '../Membership'

const countries = require('i18n-iso-countries')
countries.registerLocale(require('i18n-iso-countries/langs/de.json'))

const Field = styled.div`
    margin : 16px 0;
`
type Data = {
    intl: CommonTypes.IntlShape,
    profile: Types.Profile.ProfileState,
    lang: string,
    currentIndex: number
}

const Data: React.FC<Data> = ({intl, lang}) => {

    const dispatch                                         = useDispatch()
    const {membership}                                     = useContext(MembershipContext)
    const {currentIndex, setCurrentIndex, state, setState} = membership
    const InputWithLang                                    = Input.setLang(lang)
    const [editableScreen, setEditableScreen]              = useState(false)

    const validate = (data: { [key: string]: string; }): [boolean, () => void] => {
        const [errors, isEmpty]: [any, boolean] = Validator({
            gender     : 'required',
            firstName  : 'required|string',
            lastName   : 'required|string',
            birthDate  : 'required|date',
            street     : 'required',
            houseNumber: 'required',
            phone      : 'required|phone',
            city       : 'required',
            postalCode : 'required|containNumber',
            country    : 'required|string',
        }, data)

        return [isEmpty, () => actions.errors.set(errors, dispatch)]
    }

    useEffect(() => {
        const [result] = validate(state.address)
        setEditableScreen(!result)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container size={'extrasmall'}>
            <div>
                {editableScreen ? <EditableData data={state} setState={setState}/> : (
                    <>
                        <Field
                            className={'title-18'}
                        >
                            {`${intl.formatMessage({id: 'my.data'})}:`}
                        </Field>
                        <ShadowedContainer>
                            <Field>
                                {/*{`${intl.formatMessage({id: InputWithLang.fromValue(state.address.gender, InputTypes.Gender)})} `}*/}
                                {`${state.address.firstName} `}
                                {`${state.address.lastName} `}
                            </Field>
                            <Field>
                                {intl.formatDate(state.address.birthDate, {
                                    year : 'numeric',
                                    month: '2-digit',
                                    day  : '2-digit',
                                }).replace(/\./g, '.')}
                            </Field>
                            <Field>
                                {state.address.phone}
                            </Field>
                            <Field>
                                {`${state.address.street} ${state.address.houseNumber}`}
                            </Field>
                            <Field>
                                {`${state.address.postalCode} `}
                                {`${state.address.city} `}
                            </Field>
                            <Field>
                                {
                                    InputWithLang.fromValue(state.address.country ? state.address.country.toLowerCase() : '', CommonTypes.InputEnum.Country)
                                }
                            </Field>
                            <Button
                                onClick={() => setEditableScreen(true)}
                                styles={{
                                    background: 'white',
                                    color     : 'black',
                                    border    : '1px black solid',
                                }}
                            >
                                {intl.formatMessage({id: 'membership.memberAddress.button'})}
                            </Button>
                        </ShadowedContainer>
                    </>
                )}
                <div style={{marginTop: '32px'}}>
                    <MaterialButton
                        onClick={() => {
                            const [success, dispatchErrors] = validate(state.address)

                            if (success) {
                                setCurrentIndex(currentIndex + 1)
                                return
                            }
                            dispatchErrors()
                        }}
                    >
                        {intl.formatMessage({id: 'next.step'})}
                    </MaterialButton>
                </div>
            </div>
        </Container>
    )
}

export default Intl.withIntl(withContext(Data, (ctx: GlobalContextT) => ({intl: ctx.intl})))

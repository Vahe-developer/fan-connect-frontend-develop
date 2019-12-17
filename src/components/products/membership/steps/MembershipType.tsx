import * as React                                    from 'react'
import {useContext, useMemo, useState}               from 'react'
import {Validator}                                   from '@myfan/validation'
import {
    MaterialRadio,
    MaterialButton,
    MaterialCheckbox,
    MaterialSelect,
    MaterialInput,
    MaterialTooltip,
    Dropzone,
}                                                    from '@myfan/web-components'
import {withContext, withStore, useDispatch}         from '@myfan/store'
import {MembershipTypeDropdown}                      from '@myfan/pages/dist/products'
import {MembershipContext}                           from '../Membership'
import {actions, Types, GlobalContextT, GlobalState} from 'Redux'
import {Types as CommonTypes}                        from '@myfan/commons'


type TMembershipType = {
    intl: CommonTypes.IntlShape,
    errors: {}
}

const MembershipType: React.FC<TMembershipType> = ({intl, errors}) => {

    const {membership}                                     = useContext(MembershipContext)
    const {state, setState, currentIndex, setCurrentIndex} = membership

    const [checkbox, setCheckbox] = useState(false)
    const dispatch                = useDispatch()

    /*    useEffect(() => {
            if (!checkbox) {
                setState({
                    ...state,
                    options: {
                        ...state.options,
                        familyMembersMembershipNumber: '',
                    },
                })
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [checkbox])*/

    const {
              options: {
                  discount,
                  discountFileUuid,
                  discountFile,
                  discountFileName,
                  familyMembersMembershipNumber,
                  membershipType,
                  sportType,
              },
          } = state

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name  = e.target.name
        const value = e.target.value

        //TODO make this configurable from BE
        if ('membershipType' === name) {
            if ('afm' === state.options.sportType) {
                return
            }
        } else if ('sportType' === name && 'afm' === value) {
            setState((state: Types.Profile.MembershipT) => ({
                    ...state,
                    options: {
                        ...state.options,
                        membershipType: 'passive',
                    },
                }),
            )
        }

        setState((state: Types.Profile.MembershipT) => ({
                ...state,
                options: {
                    ...state.options,
                    [name]: value,
                },
            }),
        )

        dispatch(
            actions.errors.remove(
                {
                    name: name,
                },
            ),
        )
    }

    const handleDiscountCheckboxChange = (checked: boolean) => {

        setState({
            ...state,
            options: {
                ...state.options,
                discount: checked,
            },
        })
    }

    const convertToDropable = useMemo(() => {

        return MembershipTypeDropdown.map(item => {
            return {
                value: item,
                label: intl.formatMessage({id: item}),
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const validate = (data: any): boolean => {
        const requiredFields: any = {
            membershipType               : 'required|string',
            sportType                    : 'required|string',
            familyMembersMembershipNumber: '',
        }

        if (checkbox) {
            requiredFields['familyMembersMembershipNumber'] = 'required|containsLetterOrNumber|membershipNumberMax:9'
        }

        if (state.options.discount) {
            requiredFields['discountFile']     = 'required'
            requiredFields['discountFileUuid'] = 'required'
        }

        const [errors, isEmpty]: [any, boolean] = Validator(requiredFields, data)

        if (isEmpty) return true

        actions.errors.set(errors, dispatch)

        return false
    }

    const onFileUploadDone = ({uuid, file, name}: { uuid: string, file: any, name: string }) => {

        setState({
            ...state,
            options: {
                ...state.options,
                discountFile    : file,
                discountFileName: name,
                discountFileUuid: uuid,
            },
        })
    }

    const onFileRemove = () => {

        setState({
            ...state,
            options: {
                ...state.options,
                discountFile    : undefined,
                discountFileUuid: undefined,
            },
        })
    }

    return (
        <div style={{padding: '0 16px'}}>
            <MaterialRadio
                label={intl.formatMessage({id: 'membership.type'})}
                name={'membershipType'}
                value={membershipType}
                onChange={handleChange}
                items={[
                    {
                        value: 'active',
                        label: intl.formatMessage({id: 'active'}),
                    },
                    {
                        value: 'passive',
                        label: intl.formatMessage({id: 'passive'}),
                    },
                ]}
            />
            <div>
                <MaterialSelect
                    label={''}
                    value={sportType}
                    handleChange={handleChange}
                    inputProps={{
                        required: true,
                        name    : 'sportType',
                        id      : 'sport',
                    }}
                    items={convertToDropable}
                    errors={errors}
                />
            </div>
            <div style={{
                marginTop: '32px',
            }}>
                <MaterialCheckbox
                    name={'discount'}
                    onChange={handleDiscountCheckboxChange}
                    value={discount}
                    label={intl.formatMessage({id: 'membership.type.discount'})}
                />
                <div style={{display: 'inline-block'}}>
                    <MaterialTooltip content={intl.formatMessage({id: 'membership.type.discount.tooltip'})}/>
                </div>
            </div>
            {state.options.discount && (
                <div style={{marginBottom: 32}}>
                    <Dropzone
                        onDone={onFileUploadDone}
                        initialFile={discountFile}
                        context={'membership_discount'}
                        fileId={discountFileUuid}
                        fileName={discountFileName}
                        onRemove={onFileRemove}
                    />
                </div>
            )}
            <div>
                <MaterialCheckbox
                    name={'familyCheckbox'}
                    onChange={setCheckbox}
                    value={checkbox}
                    label={intl.formatMessage({id: 'has.family.member'})}
                />
            </div>
            {checkbox && (
                <div style={{marginBottom: 32}}>
                    <MaterialInput
                        materialProps={{}}
                        name={'familyMembersMembershipNumber'}
                        onChange={handleChange}
                        label={intl.formatMessage({id: 'membership.family.number.label'})}
                        defaultValue={familyMembersMembershipNumber}
                        errors={errors}
                    />
                </div>
            )}
            <div style={{marginTop: '32px'}}>
                <MaterialButton
                    onClick={() => {
                        const validation = validate(state.options)

                        if (validation) {
                            setCurrentIndex(currentIndex + 1)
                        }
                    }}
                >
                    {intl.formatMessage({id: 'next.step'})}
                </MaterialButton>
            </div>

        </div>
    )
}

export default withContext(
    withStore(MembershipType, (store: GlobalState) => ({errors: store.errors})), (ctx: GlobalContextT) => ({intl: ctx.intl}))

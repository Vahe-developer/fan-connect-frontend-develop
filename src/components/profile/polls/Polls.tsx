import React, {useEffect, useRef, useState}          from 'react'
import './styles.scss'
import Button                                        from '../../presentation-components/buttons/auth/Button'
import {request}                                     from '@myfan/base'
import PopupWrapper                                  from '../../popup/wrapper/PopupWrapper'
import {withContext, withStore, useDispatch}         from '@myfan/store'
import {actions, Types, GlobalState, GlobalContextT} from 'Redux'
import {Types as CommonTypes}                        from '@myfan/commons'

const classNames = {
    checked  : 'fas fa-dot-circle',
    unchecked: 'far fa-circle unchecked',
}

function Polls({name, intl, profile}: { name: string, intl: CommonTypes.IntlShape, profile: Types.Profile.ProfileState }) {

    const pollRef  = useRef(null)
    const dispatch = useDispatch()

    const poll = profile.polls[0]

    const [show, setShow]         = useState<boolean>(poll.selected === null)
    const [disabled, setDisabled] = useState<boolean>(poll.selected !== null)
    const [selected, setSelected] = useState<number | null>(poll.selected)

    const onClick = (e: React.BaseSyntheticEvent): void => {

        const id   = e.currentTarget.getAttribute('data-id') || null
        const name = e.currentTarget.getAttribute('data-name') || null

        if (!id || !name) return

        setSelected(parseInt(id))

    }

    const hidePoll = (e: Event): void => {
        const node = e.target

        if (disabled &&
            pollRef.current
            && node instanceof Node
            // @ts-ignore
            && !pollRef.current.contains(node)) {
            setShow(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', hidePoll, true)

        return () => {
            document.removeEventListener('click', hidePoll, true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled])

    const save = () => {

        setDisabled(true)

        const id = poll.id

        request.post('/poll', {id, selected})
            .then(() => {
                // @ts-ignore
                actions.profile.togglePoll(selected, profile.polls[0].name, dispatch)
                setShow(false)
            })
            .catch(() => setDisabled(false))
    }

    const Poll = () => {
        return (
            <>
                <p className={'sub-title'}>{poll.question}</p>
                <ul>
                    {poll.options.map(poll => {
                        return (
                            <li key={poll.id}>
                                <span className={'poll sub-title'}>
                                    <p className={'poll-name'}>
                                        {poll.icon && (
                                            <i className={poll.icon}></i>
                                        )}
                                        {poll.name}
                                    </p>
                                    <div className={'description text'}>
                                        {poll.description}
                                        <span className={'feature-example-wrapper'}>
                                            {poll.image && (
                                                <PopupWrapper
                                                    content={<img src={'https://fcspdemo.myfan.co' + poll.image}
                                                                  className="feature-example" alt={''}/>}
                                                >
                                                    <span
                                                        className={'link-like'}
                                                    >
                                                        {intl.formatMessage({id: 'feature.example'})}
                                                    </span>
                                                </PopupWrapper>
                                            )}
                                        </span>

                                    </div>
                                </span>
                                <span
                                    onClick={disabled ? void 0 : onClick}
                                    className={'checkbox sub-title'}
                                    data-id={poll.id}
                                    data-name={poll.name}
                                ><i
                                    className={
                                        selected === poll.id ? classNames.checked : classNames.unchecked
                                    }
                                /></span>
                            </li>
                        )
                    })}
                </ul>
                <Button
                    className={'poll-btn'}
                    onClick={disabled ? () => setShow(false) : save}
                >
                    {intl.formatMessage({id: disabled ? 'close' : 'save.changes'})}
                </Button>
            </>
        )
    }

    const PollBtn = () => {
        return (
            <>
                <p>{!poll.selected ? intl.formatMessage({id: 'poll.btn.title'})
                    : intl.formatMessage({id: 'thanks.for.answering.question'})}</p>
                <Button className={'poll-btn'} onClick={() => setShow(true)}>
                    {!poll.selected ? intl.formatMessage({id: 'show.question'}) : intl.formatMessage({id: 'show.my.answer'})}
                </Button>
            </>
        )
    }

    return (
        <div className={'polls'} ref={pollRef}>
            {show ? (
                <Poll/>
            ) : (
                <PollBtn/>
            )}

        </div>
    )
}

export default withContext(
    withStore(Polls, (state: GlobalState) => ({profile: state.profile})),
    (ctx: GlobalContextT) => ({intl: ctx.intl}),
)

import React, {useEffect, useRef, useState} from 'react'
import OutsideClickHandler                  from 'react-outside-click-handler'
import './dropdown.scss'
import {IInput}                             from '../interfaces/interfaces'
import {Conditional}                        from '@myfan/web-components'

export type IDropDown = {
    id: number | string,
    title: any,
    selected: boolean,
    style?: { [key: string]: string }
}

function DropDown(
    {
        name,
        data,
        onSelect,
        title,
        externalSelected,
        className = '',
    }: {
        name: string,
        data: IDropDown[],
        title: string,
        onSelect: (e: IInput) => void,
        externalSelected?: any,
        className?: string
    }) {

    const listRef = useRef(null)

    const [open, setOpen]         = useState<boolean>(false)
    const [dData, setData]        = useState<IDropDown[]>(data)
    const [selected, setSelected] = useState<string | null>(null)


    const toggleList = () => setOpen(!open)

    useEffect(() => {
        if (externalSelected) {
            return setSelected(externalSelected)
        }
        let selectedTitle = data.find(data => data.selected)
        selectedTitle     = selectedTitle ? selectedTitle.title : null
        // @ts-ignore
        setSelected(selectedTitle)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])


    useEffect(() => {
        // @ts-ignore
        if (open) listRef.current && listRef.current.scrollIntoView({
            behavior: 'smooth',
            block   : 'end',
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const onClick = (id: number | string): void => {

        dData.forEach(data => data.selected = (data.id === id))
        setData(dData)

        const selectedData = dData.filter(data => data.id === id)[0]
        setSelected(selectedData.title)

        setOpen(false)

        onSelect({
            // @ts-ignore
            target: {
                name : name,
                value: id,
            },
        })
    }

    const close = (): void => {
        if (open) setOpen(false)
    }

    return (
        <div className={`dd-wrapper ${className}`}>
            <OutsideClickHandler onOutsideClick={close}>
                <div className={`dd-header sub-title ${!selected ? ' color-grey ' : ' color-black '}`}
                     onClick={toggleList}>
                    {selected ? selected : title}
                    <span className={'arrow'}>{open
                        ? <i className="fas fa-caret-up"></i>
                        : <i className="fas fa-caret-down"></i>
                    }
                            </span>
                </div>
                <Conditional cond={open}>
                    <div className="dd-list" ref={listRef}>
                        {dData.map((item, key) => (
                            <div
                                className={`dd-list-item ${item.selected ? 'selected' : ''}`}
                                key={key}
                                onClick={() => onClick(item.id)}
                                style={item.style}
                            >
                                {typeof item.title === 'function' ? item.title() : item.title}
                            </div>
                        ))}
                    </div>
                </Conditional>
            </OutsideClickHandler>
        </div>
    )
}

export default DropDown

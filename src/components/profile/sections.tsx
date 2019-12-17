import React  from 'react'
// import HeaderBlock          from './header-block/HeaderBlock'
import {Club} from '@myfan/base'

interface ISections {
    name: string,
    title: string,
    text: string,
    dataFor: string,
    component: JSX.Element
}

function Sections({sections}: { sections: ISections[] }) {

    return (
        <div
            className={'section-blocks'}
            style={{gridTemplateAreas: Club.profileSectionsGridArea}}
        >
            {sections.map((section, key) => {
                return (
                    <div
                        key={key}
                        className={`section-block block-${section.name}`}
                    >
                        {/*<HeaderBlock*/}
                        {/*    intl={intl}*/}
                        {/*    title={section.title}*/}
                        {/*    text={section.text}*/}
                        {/*    dataFor={section.dataFor}*/}
                        {/*/>*/}
                        {section.component}
                    </div>
                )
            })}
        </div>
    )
}

export default Sections

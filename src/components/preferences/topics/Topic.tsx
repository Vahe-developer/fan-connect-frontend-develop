import React                  from 'react'
import {Row, Col}             from 'reactstrap'
import {withContext}          from '@myfan/store'
import {Types}                from 'Redux'
import {Types as CommonTypes} from '@myfan/commons'

interface ITopicProps {
    topic: Types.Channels.ITopic,
    intl: CommonTypes.IntlShape,

    onClick(e: React.MouseEvent): void
}

export const classNames = {
    checked  : 'fas fa-check-circle checked',
    unchecked: 'far fa-circle unchecked',
}

const Topic = ({topic, onClick, intl}: ITopicProps) => {

    return (
        <Row>
            <Col className="fifth-col" sm="12">
                <p className={'title'}>{intl.formatMessage({id: topic.nameTranslationKey})}</p>
                <p className={'text'}>{intl.formatMessage({id: topic.descTranslationKey})}</p>
                <div data-id={topic.id} className="checkbox-block" onClick={onClick}>
                    <i
                        className={
                            topic.selected ? classNames.checked : classNames.unchecked
                        }
                    />
                </div>
            </Col>
        </Row>
    )
}

export default withContext(Topic)

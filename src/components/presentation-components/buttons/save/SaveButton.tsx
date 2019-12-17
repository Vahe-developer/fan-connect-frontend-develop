import React       from "react";
import {Container} from "reactstrap";
import {IntlText}  from "../../../intl/IntlText";
import './button.scss';

const SaveButton = ({text, onClick, disabled} : any) => (
        <Container className={'button-container'}>
            <button className={'save-button'} onClick={onClick} disabled={disabled}>
                {IntlText(text)}
            </button>
        </Container>
);

export default SaveButton;

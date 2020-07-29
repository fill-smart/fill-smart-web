import styled from "styled-components";
import { palette } from "styled-theme";
import React from "react";

const BackButtonContainer = styled.i`
    font-size: 35px;
    color: ${palette("primary", 1)};
    margin: 0px;
    margin-left: 10px; 
    cursor: pointer;
`;

const BackButton = props => (
    <BackButtonContainer
        {...props}
        className="ion-arrow-left-c"
    />
)

export default BackButton;
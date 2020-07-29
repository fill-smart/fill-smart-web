import React from "react";
import { WidgetWrapper } from "./Widgets.styles";

const IsoWidgetsWrapper = ({ children, ...props }) => {
    return (
        <WidgetWrapper className="isoWidgetsWrapper" {...props}>
            {children}
        </WidgetWrapper>
    );
};

export default IsoWidgetsWrapper;

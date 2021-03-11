import React from "react";
import { WidgetBox } from "./Widgets.styles";

const IsoWidgetBox = ({
    children,
    style,
    height,
    padding
}: {
    children?: any;
    style?: any;
    height?: string;
    padding?: any;
}) => {
    return (
        <WidgetBox
            className="isoWidgetBox"
            height={height}
            padding={padding}
            style={style}
        >
            {children}
        </WidgetBox>
    );
};

export default IsoWidgetBox;

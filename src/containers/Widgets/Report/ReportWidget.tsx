import React from "react";
import { ReportWidgetWrapper } from "./ReportWidget.styles";

const ReportsWidget = ({ label, details, children }) => {
    return (
        <ReportWidgetWrapper className="isoReportsWidget">
            <h3 className="isoWidgetLabel">{label}</h3>

            <div className="isoReportsWidgetBar">{children}</div>

            <p className="isoDescription">{details}</p>
        </ReportWidgetWrapper>
    );
};

export default ReportsWidget;

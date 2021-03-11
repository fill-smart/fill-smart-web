import React from "react";
import CardWidgetWrapper from "./CardWidget.styles";

const CardWidget = ({
    icon,
    iconcolor,
    number,
    text,
    fuelType,
    litres,
    total,
    ago
}) => {
    const iconStyle = {
        color: iconcolor
    };

    return (
        <CardWidgetWrapper className="isoCardWidget">
            <div className="isoIconWrapper">
                <i className={icon} style={iconStyle} />
            </div>

            <div className="isoContentWrapper">
                <h3 className="isoStatNumber">{number}</h3>
                <span className="isoLabel">{text}</span>
            </div>
            <div className="operationWrapper">
                <h3 className="fuelType">
                    {fuelType
                        ? `Ultima Operacion: ${fuelType} - $ ${(total as number).toLocaleString(
                              undefined,
                              {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                              }
                          )}`
                        : ""}
                </h3>
            </div>
            <div className="agoWrapper">
                <h3 className="ago">{fuelType ? ago : ""}</h3>
            </div>
        </CardWidgetWrapper>
    );
};

export default CardWidget;

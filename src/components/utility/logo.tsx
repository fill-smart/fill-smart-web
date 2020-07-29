import React from "react";
import { Link } from "react-router-dom";
import siteConfig from "../../config/site.config";
import * as logo from "../../assets/images/logo_white.png";
import * as logoSmall from "../../assets/images/logo_white_small.png";

export default ({ collapsed }) => {
    return (
        <div className="isoLogoWrapper">
            {collapsed ? (
                <div>
                    <h3>
                        <Link to="/fillsmart">
                            <img style={{
                                width: "30px"
                            }} src={logoSmall as any} />
                        </Link>
                    </h3>
                </div>
            ) : (
                <h3>
                    <Link to="/fillsmart">
                        <img
                            style={{
                                width: "160px"
                            }}
                            src={logo as any}
                        />
                    </Link>
                </h3>
            )}
        </div>
    );
};

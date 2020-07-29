import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Layout } from "antd";
import useWindowSize from "../../library/hooks/useWindowSize";
import appActions from "../../redux/app/actions";
import siteConfig from "../../config/site.config";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import MainLayoutRoutes from "./MainLayoutRoutes";

import { MainLayoutContainer, MainLayoutGlobalStyles } from "./MainLayout.styles";


const { Content, Footer } = Layout;
const { toggleAll } = appActions;
const styles = {
    layout: { flexDirection: "row", overflowX: "hidden" },
    content: {
        padding: "70px 0 0",
        flexShrink: "0",
        background: "#f1f3f6",
        position: "relative"
    },
    footer: {
        background: "#ffffff",
        textAlign: "center",
        borderTop: "1px solid #ededed"
    }
};

export default function Dashboard() {
    //const [user, dispatchUserAction] = useContext(SecurityContext);
    const dispatch = useDispatch();
    const appHeight = useSelector((state: any) => state.App.height);
    const { width, height } = useWindowSize();

    React.useEffect(() => {
        dispatch(toggleAll(width, height));
    }, [width, height, dispatch]);
    return (
        <MainLayoutContainer>
            <MainLayoutGlobalStyles />
            <Layout style={{ height: height }}>
                <Topbar />
                <Layout style={styles.layout as any}>
                    <Sidebar />
                    <Layout
                        className="isoContentMainLayout"
                        style={{
                            height: appHeight
                        }}
                    >
                        <Content
                            className="isomorphicContent"
                            style={styles.content as any}
                        >
                            <MainLayoutRoutes />
                        </Content>
                        <Footer style={styles.footer as any}>
                            {siteConfig.footerText}
                        </Footer>
                    </Layout>
                </Layout>
            </Layout>
        </MainLayoutContainer>
    );
}

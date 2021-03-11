import React, { lazy, Suspense, useContext } from "react";
import {
    Route,
    Redirect,
    BrowserRouter as Router,
    Switch,
    useLocation
} from "react-router-dom";
import { useSelector } from "react-redux";

import ErrorBoundary from "./ErrorBoundary";
import { PUBLIC_ROUTE } from "./route.constants";
import Loader from "./components/utility/loader";
import { SecurityContext } from "./contexts/security.context";

const MainLayout = lazy(() => import("./containers/MainLayout/MainLayout"));

const publicRoutes = [
    {
        path: PUBLIC_ROUTE.LANDING,
        exact: true,
        component: lazy(() => import("./containers/Pages/SignIn/SignIn"))
    },
    {
        path: PUBLIC_ROUTE.SIGN_IN,
        component: lazy(() => import("./containers/Pages/SignIn/SignIn"))
    }
];

function PrivateRoute({ children, ...rest }) {
    let location = useLocation();
    const [authContext] = useContext(SecurityContext);
    const isLoggedIn = authContext.token != "";
    console.log(isLoggedIn);
    if (isLoggedIn) return <Route {...rest}>{children}</Route>;
    return (
        <Redirect
            to={{
                pathname: "/signin",
                state: { from: location }
            }}
        />
    );
}
export default function Routes() {
    return (
        <ErrorBoundary>
            <Suspense fallback={<Loader />}>
                <Router>
                    <Switch>
                        {publicRoutes.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                exact={route.exact}
                            >
                                <route.component />
                            </Route>
                        ))}

                        <PrivateRoute path="/fillsmart">
                            <MainLayout />
                        </PrivateRoute>
                    </Switch>
                </Router>
            </Suspense>
        </ErrorBoundary>
    );
}

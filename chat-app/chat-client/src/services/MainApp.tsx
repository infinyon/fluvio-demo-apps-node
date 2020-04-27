import * as React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';
import AuthRoute from './middleware/AuthRoute';
import Login from './login/Login';
import Logout from './login/Logout';
import Unregister from './login/Unregister';
import RegisterUser from './login/RegisterUser';
import ResetPass from './login/ResetPass';
import { MuiThemeProvider } from '@material-ui/core';
import { mainTheme } from '../styles/MainTheme';
import CssBaseline from '@material-ui/core/CssBaseline';

import ChatApp from './chat/ChatApp';

export default function MainApp() {
    return (
        <Router>
            <MuiThemeProvider theme={mainTheme}>
                <CssBaseline />
                <Switch>
                    // ==================
                    // Protected Routes
                    // ==================
                    <AuthRoute
                        path={'/'}
                        exact={true}
                        Component={ChatApp}
                    />
                    <AuthRoute
                        path={'/logout'}
                        exact={true}
                        Component={Logout}
                    />
                    <AuthRoute
                        path={'/unregister'}
                        exact={true}
                        Component={Unregister}
                    />

                    // ==================
                    // Unprotected Routes
                    // ==================
                    <Route
                        path={'/login'}
                        exact={true}
                        component={Login}
                    />
                    <Route
                        path={'/registerUser'}
                        exact={true}
                        component={RegisterUser}
                    />
                    <Route
                        path={'/resetPassword'}
                        exact={true}
                        component={ResetPass}
                    />
                </Switch>
            </MuiThemeProvider>
        </Router>
    );
}

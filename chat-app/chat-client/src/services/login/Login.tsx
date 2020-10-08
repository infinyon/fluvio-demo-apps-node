import * as React from 'react';
import axios from 'axios';
import { Config } from '../config/Config';
import { setSiteToken } from '../middleware/SiteCookies';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { LoginForm, LoginFields } from './LoginForm';
import { ErrorAlertLogout } from '../components/ErrorAlertLogout';

interface State {
    requestedPath?: string,
}

class Login extends React.Component<RouteComponentProps> {
    constructor(props: RouteComponentProps) {
        super(props);
    }

    public onSubmit = (fields: LoginFields): void => {
        let { name, password } = fields;
        let link = `${Config.ApiServer}/v1/login`;
        const loginParams = {
            name: name,
            password: password,
        }

        axios.post(link, loginParams).then(res => [
            setTimeout(() => {
                if (res.data.token) {
                    setSiteToken(name, res.data.token, res.data.colorCode);
                } else {
                    alert("Internal Error! Invalid token format.");
                }
                this.props.history.push(
                    (this.props.location.state as State)?.requestedPath ?? '/'
                );
            }, 10)
        ]).catch((error) => {
            if (ErrorAlertLogout(error)) {
                this.props.history.push('/');
            }
        });
    }

    public render() {
        return (
            <LoginForm onSubmit={this.onSubmit.bind(this)} />
        );
    }
}

export default withRouter(Login);
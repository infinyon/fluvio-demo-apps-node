import * as React from 'react';
import axios from 'axios';
import { Config } from '../config/Config';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { LoginForm, LoginFields } from './LoginForm';
import { ErrorAlertLogout } from '../components/ErrorAlertLogout';
import { setLocalStorage } from '../middleware/LocalStorage';

interface State {
    requestedPath?: string,
}

class Login extends React.Component<RouteComponentProps> {
    constructor(props: RouteComponentProps) {
        super(props);
    }

    public onSubmit = async (fields: LoginFields) => {
        let { user } = fields;
        let link = `${Config.ApiServer}/login`;
        const loginParams = {
            user: user,
        }

        axios.post(link, loginParams).then(res => [
            setTimeout(() => {
                console.log();
                setLocalStorage(JSON.stringify({
                    user: user,
                }));

                this.props.history.push(
                    (this.props.location.state as State)?.requestedPath ?? '/'
                );
            }, 10)
        ]).catch((error) => {
            if (ErrorAlertLogout(error.response.data)) {
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
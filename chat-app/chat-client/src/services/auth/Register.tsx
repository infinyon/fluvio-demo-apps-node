import * as React from 'react';
import axios from 'axios';
import { Config } from '../config/Config';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { RegisterForm, RegisterFields } from './RegisterForm';
import { ErrorAlertLogout } from '../components/ErrorAlertLogout';

class RegisterUser extends React.Component<RouteComponentProps> {
    constructor(props: RouteComponentProps) {
        super(props);
    }

    public onSubmit = (fields: RegisterFields): void => {
        let { user } = fields;
        let link = `${Config.ApiServer}/register`;
        const registerUserParams = {
            user: user,
        }

        axios.post(link, registerUserParams).then(res => [
            setTimeout(() => {
                this.props.history.push('/login');
            }, 10)
        ]).catch((error) => {
            if (ErrorAlertLogout(error.response.data)) {
                this.props.history.push('/');
            }
        });
    }

    public render() {
        return (
            <RegisterForm onSubmit={this.onSubmit.bind(this)} />
        );
    }
}

export default withRouter(RegisterUser);
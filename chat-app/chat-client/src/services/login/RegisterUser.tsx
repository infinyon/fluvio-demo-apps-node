import * as React from 'react';
import axios from 'axios';
import { Config } from '../config/Config';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { RegisterUserForm, RegisterUserFields } from './RegisterUserForm';
import { ErrorAlertLogout } from '../components/ErrorAlertLogout';

class RegisterUser extends React.Component<RouteComponentProps> {
    constructor(props: RouteComponentProps) {
        super(props);
    }

    public onSubmit = (fields: RegisterUserFields): void => {
        let { name, password } = fields;
        let link = `${Config.ApiServer}/v1/register`;
        const registerUserParams = {
            name: name,
            password: password,
        }

        axios.post(link, registerUserParams).then(res => [
            this.props.history.push('/login')
        ]).catch((error) => {
            if (ErrorAlertLogout(error)) {
                this.props.history.push('/createAccount');
            }
        });
    }

    public render() {
        return (
            <RegisterUserForm onSubmit={this.onSubmit.bind(this)} />
        );
    }
}

export default withRouter(RegisterUser);
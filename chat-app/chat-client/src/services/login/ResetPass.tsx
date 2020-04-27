import * as React from 'react';
import axios from 'axios';
import { Config } from '../config/Config';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ResetPassForm, ResetPassFields } from './ResetPassForm';
import { ErrorAlertLogout } from '../components/ErrorAlertLogout';

class ResetPass extends React.Component<RouteComponentProps> {
    constructor(props: RouteComponentProps) {
        super(props);
    }

    public onSubmit = (fields: ResetPassFields): void => {
        let { name, password } = fields;
        let link = `${Config.ApiServer}/v1/resetPassword`;
        const resetPassParams = {
            name: name,
            password: password,
        }

        axios.post(link, resetPassParams).then(res => [
            this.props.history.push('/login')
        ]).catch((error) => {
            if (ErrorAlertLogout(error)) {
                this.props.history.push('/resetPassword');
            }
        });
    }

    public render() {
        return (
            <ResetPassForm onSubmit={this.onSubmit.bind(this)} />
        );
    }
}

export default withRouter(ResetPass);
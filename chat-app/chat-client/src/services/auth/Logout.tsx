import * as React from 'react';
import axios from 'axios';
import { RouteComponentProps } from 'react-router-dom';
import { Config } from '../config/Config';
import { ErrorAlertLogout } from '../components/ErrorAlertLogout';
import { clearLocalStorage } from '../middleware/LocalStorage';

export default class Logout extends React.Component<RouteComponentProps> {
    constructor(props: RouteComponentProps) {
        super(props);

        this.logout();
        this.props.history.push('/');
    }

    logout = (): void => {
        let link = `${Config.ApiServer}/logout`;

        axios.post(link, {}, { withCredentials: true }).then(_ => {
            clearLocalStorage();
            this.props.history.push('/')
        }).catch((error) => {
            if (ErrorAlertLogout(error.response.data)) {
                this.props.history.push('/');
            }
        });
    }

    public render() {
        return (
            <div></div>
        )
    }
}
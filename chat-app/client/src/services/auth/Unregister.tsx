import * as React from 'react';
import axios from 'axios';
import { RouteComponentProps } from 'react-router-dom';
import { Config } from '../config/Config';
import { ErrorAlertLogout } from '../components/ErrorAlertLogout';
import { clearLocalStorage } from '../middleware/LocalStorage';

export default class Unregister extends React.Component<RouteComponentProps> {
    constructor(props: RouteComponentProps) {
        super(props);

        this.unRegisterUser();
        this.props.history.push('/');
    }

    unRegisterUser = (): void => {
        let link = `${Config.ApiServer}/unregister`;

        axios.post(link, { withCredentials: true }).then(_ => {
            this.props.history.push('/')
        }).catch((error) => {
            if (ErrorAlertLogout(error.response.data)) {
                this.props.history.push('/')
            }
        });

        clearLocalStorage();
    }

    public render() {
        return (
            <div></div>
        )
    }
}
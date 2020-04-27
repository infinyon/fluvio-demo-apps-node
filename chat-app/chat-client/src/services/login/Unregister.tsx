import * as React from 'react';
import axios from 'axios';
import { Config } from '../config/Config';
import { RouteComponentProps } from 'react-router-dom';
import { clearSiteCookie, getSiteToken } from '../middleware/SiteCookies';
import { ErrorAlertLogout } from '../components/ErrorAlertLogout';


export default class Unregister extends React.Component<RouteComponentProps> {
    constructor(props: RouteComponentProps) {
        super(props);

        this.unRegisterUser();
        this.props.history.push('/');
    }

    unRegisterUser = (): void => {
        let link = `${Config.ApiServer}/v1/unregister`;

        console.log(getSiteToken());

        axios.post(link, {}, {
            headers: { Authorization: 'Token ' + getSiteToken() }
        }).then(_ => {
            this.props.history.push('/')
        }).catch((error) => {
            if (ErrorAlertLogout(error)) {
                this.props.history.push('/resetPassword');
            }
        });

        clearSiteCookie();
        this.props.history.push('/');
    }

    public render() {
        return (
            <div></div>
        )
    }
}
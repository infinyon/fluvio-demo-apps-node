import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { clearSiteCookie } from '../middleware/SiteCookies';


export default class Logout extends React.Component<RouteComponentProps> {
    constructor(props: RouteComponentProps) {
        super(props);

        clearSiteCookie();
        this.props.history.push('/');
    }

    public render() {
        return (
            <div></div>
        )
    }
}
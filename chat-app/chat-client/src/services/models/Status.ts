import { UserName } from '../context/WsMessages';

export enum Status {
    Online = "Online",
    Offline = "Offline",
    Unknown = "Unknown",
}

export class UserStatus {
    private online: Map<UserName, Status>;

    constructor() {
        this.online = new Map();
    }

    public initUsers(users: Array<UserName>, onlineUsers: Array<UserName>) {
        var online = new Map();
        users.forEach(user => {
            const status = onlineUsers.indexOf(user) < 0 ?
                Status.Offline :
                Status.Online;
            online.set(user, status);
        })
        this.online = online;
    }

    public getStatus(userName: UserName) {
        const status = this.online.get(userName);
        return status ? status : Status.Unknown;
    }

    public setOnline(userName: UserName) {
        this.online.set(userName, Status.Online);
    }

    public setOffline(userName: UserName) {
        this.online.set(userName, Status.Offline);
    }

    public setUnknown() {
        this.online.clear();
    }
}
import { UserMsg, UserName } from '../context/WsMessages';

export interface User {
    user: string,
    colorCode: string,
}

export class Users {
    private users: Map<UserName, User>;

    constructor(userMsgs?: Array<UserMsg>) {
        this.users = this.toUsers(userMsgs);
    }

    public getUsers() {
        return Array.from(this.users.values());
    }

    public getUserNames() {
        return Array.from(this.users.keys());
    }

    public getColorCode(userName: UserName) {
        const user = this.users.get(userName);
        return (user) ? user.colorCode : "";
    }

    public add(userMsg: UserMsg) {
        this.users.set(userMsg.user, this.toUser(userMsg));
    }

    public remove(userName: UserName) {
        this.users.delete(userName);
    }

    private toUser(userMsg: UserMsg) {
        return <User>{
            user: userMsg.user,
            colorCode: userMsg.colorCode,
        }
    }

    private toUsers(userMsgs?: Array<UserMsg>) {
        var users = new Map();
        if (userMsgs) {
            userMsgs.forEach(userMsg => {
                users.set(userMsg.user, this.toUser(userMsg));
            });
        }
        return users;
    }
}
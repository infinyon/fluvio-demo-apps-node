import { PartitionConsumer } from "@fluvio/client";
import { ToRecords, FromStart, FromEnd } from "./fluvio-util";
import { WsProxyOut } from "./proxy-out";
import {
    SID,
    Token,
    UserName,
    IUser,
    buildWsAllUsers,
    buildAddUser,
    buildRemoveUser,
    parseMessage,
} from "./user-messages";
import { parseFluvioSession } from "./session-messages";

const COLORS = ["lime", "purple", "indigo", "blue", "deepOrange", "amber", "green", "deepPurple", "brown", "cyan", "orange", "lightGreen", "pink", "lightBlue", "yellow", "teal", "red"];

class User implements IUser {
    user: UserName;
    colorCode: string;
    tokens: Array<Token>;

    constructor(obj: Object) {
        Object.assign(this, obj);

        this.tokens = this.tokens || new Array();
    }

    public hasToken(token: Token) {
        return (this.tokens.indexOf(token) > -1);
    }

    public getTokens() {
        return this.tokens;
    }

    public addToken(token: Token) {
        if (!this.hasToken(token)) {
            return this.tokens.push(token);
        }
    }

    public removeToken(token: Token) {
        const index = this.tokens.indexOf(token, 0);
        if (index > -1) {
            this.tokens.splice(index, 1);
        }
    }
}

export class UserController {
    private colorIdx: number;
    private users: Map<UserName, User>;
    private proxyOut: WsProxyOut;
    private userConsumer: PartitionConsumer;
    private sessionConsumer: PartitionConsumer;

    constructor(
        proxyOut: WsProxyOut,
        userConsumer: PartitionConsumer,
        sessionConsumer: PartitionConsumer
    ) {
        this.users = new Map();
        this.proxyOut = proxyOut;
        this.userConsumer = userConsumer;
        this.sessionConsumer = sessionConsumer;
    }

    // Public APIs

    public async init() {
        ToRecords(await this.userConsumer.fetch(FromStart)).forEach(userMsg => {
            this.initializeUser(userMsg);
        });

        this.show();
        this.initColorIndex(this.users.size);

        this.userConsumer.stream(FromEnd, (userMsg: string) => {
            this.processUserMessage(userMsg);
        });
        this.sessionConsumer.stream(FromEnd, (sessionMsg: string) => {
            this.processSessionMessage(sessionMsg);
        });
    }

    public newUser(userName: UserName) {
        return new User({
            user: userName,
            colorCode: this.nextColor(),
        });
    }

    public getUser(userName: UserName) {
        return this.users.get(userName);
    }

    // Private APIs

    private initColorIndex(count: number) {
        this.colorIdx = (count - 1) % COLORS.length;
    }

    private nextColor() {
        this.colorIdx = (this.colorIdx + 1) % COLORS.length;
        return COLORS[this.colorIdx];
    }

    private addUser(userName: UserName, colorCode: string) {
        const user = this.users.get(userName);
        if (!user) {
            const newUser = new User({
                user: userName,
                colorCode: colorCode,
            });
            this.users.set(userName, newUser);

            console.log(`Ok: "${userName}" added`);

            const userMessage = buildAddUser(newUser);
            this.proxyOut.broadcastMessage(JSON.stringify(userMessage));
        } else {
            console.log(`Error: user "${userName}" - already exists`);
        }
    }

    private removeUser(userName: UserName) {
        const user = this.users.get(userName);
        if (user) {
            this.users.delete(userName);

            console.log(`Ok: "${userName}" removed`);

            const userMessage = buildRemoveUser(user);
            this.proxyOut.broadcastMessage(JSON.stringify(userMessage));

        } else {
            console.log(`Error: cannot remove "${userName}" - not found`);
        }
    }

    private loginUser(userName: UserName, token: Token) {
        const user = this.getUser(userName);
        if (user) {
            user.addToken(token);
            console.log(`Ok: "${userName}" logged in - "${token}"`);
        } else {
            console.log(`Error: cannot login "${userName}" - not found`);
        }
    }

    private logoutUser(userName: UserName, token: Token) {
        const user = this.getUser(userName);
        if (user) {
            user.removeToken(token);
            console.log(`Ok: "${userName}" logged out`);
        } else {
            console.log(`Error: logoutUser "${userName}" - not found`);
        }
    }

    private sendAllUsers(sid: SID) {
        const usersMessage = buildWsAllUsers(Array.from(this.users.values()));
        this.proxyOut.sendMessage(JSON.stringify(usersMessage), sid);
    }

    private show() {
        console.log("Users");
        var table = [];
        for (let user of this.users.values()) {
            table.push({
                user: user.user,
                colorCode: user.colorCode,
                tokens: user.tokens.length,
            });
        }
        console.table(table);
    }

    private initializeUser(msgObj: string) {
        const message = parseMessage(msgObj);
        const userName = message.content.user;

        switch (message.kind) {
            case "AddUser":
                this.users.set(userName, new User({
                    user: userName,
                    colorCode: message.content.colorCode,
                }));
                break;

            case "RemoveUser":
                this.users.delete(userName);
                break;

            case "AddToken":
                var user = this.users.get(userName);
                if (user) {
                    user.addToken(message.content.token);
                }
                break;

            case "RemoveToken":
                var user = this.users.get(userName);
                if (user) {
                    user.removeToken(message.content.token);
                }
                break;
        }
    }

    private processUserMessage(msgObj: string) {
        const message = parseMessage(msgObj);
        const userName = message.content.user;

        switch (message.kind) {
            case "AddUser":
                this.addUser(userName, message.content.colorCode);
                break;

            case "RemoveUser":
                this.removeUser(userName);
                break;

            case "AddToken":
                this.loginUser(userName, message.content.token);
                break;

            case "RemoveToken":
                this.logoutUser(userName, message.content.token);
                break;
        }
    }

    private processSessionMessage(msgObj: string) {
        const message = parseFluvioSession(msgObj);

        switch (message.kind) {
            case "Started":
                this.sendAllUsers(message.content.sid);
                break;
        }
    }
}
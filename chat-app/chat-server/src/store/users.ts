import { TOPIC_REPLICATION } from "../config/constants";
import { KV, getDateTime } from "../common/utils";
import {
    randomColorCode,
    getHashedPassword,
    comparePasswords,
    generateUUID,
    sleep,
} from '../common/utils';
import {
    UserEvent,
    Stream,
    Event,
    EventCallback,
    fluvioTopics,
    fluvioStreams,
    sendRegisteredEvent,
    sendUnRegisteredEvent,
    sendTokenUpdatedEvent,
    sendPasswordUpdatedEvent,
    sendOnlineEvent,
    sendOfflineEvent,
} from "../events"
import {
    broadcastAddUser,
    broadcastRemoveUser,
    broadcastUserOnline,
    broadcastUserOffline
} from "../controllers/wsProxy/proxyController";

// nsc => [n]ode [s]imple [c]hat"
const FLUVIO_USER_TOPIC = "nsc-user-events";

export enum UserStatus {
    Online = "Online",
    Offline = "Offline",
}

//==============================
// User Class
// =============================

export class User {
    name: string;
    password: string;
    status: UserStatus;
    colorCode: string;
    token?: string;
    created: string;

    constructor(obj: Object) {
        Object.assign(this, obj)
    }

    public add() {
        sendRegisteredEvent(getUserEventStream(), this);
    }

    public delete() {
        sendUnRegisteredEvent(getUserEventStream(), this.name);
    }

    public isValidPassword(otherPassword: string) {
        return comparePasswords(this.password, otherPassword);
    }

    public updatePassword(newPassword: string) {
        this.password = getHashedPassword(newPassword);

        sendPasswordUpdatedEvent(getUserEventStream(), this.name, this.password);
    }

    public generateToken() {
        this.token = generateUUID();

        sendTokenUpdatedEvent(getUserEventStream(), this.name, this.token);

        return this.token;
    }

    public clearToken() {
        this.token = undefined;

        sendTokenUpdatedEvent(getUserEventStream(), this.name, this.token)
    }

    public setOnline() {
        if (this.status != UserStatus.Online) {
            this.status = UserStatus.Online;

            sendOnlineEvent(getUserEventStream(), this.name);
        };
    }

    public setOffline() {
        if (this.status != UserStatus.Offline) {
            this.status = UserStatus.Offline;

            sendOfflineEvent(getUserEventStream(), this.name);
        };
    }

    public toCleanKV() {
        return {
            name: this.name,
            status: this.status,
            colorCode: this.colorCode,
            created: this.created,
        }
    }
}

//==============================
// Users Class (a singleton)
// =============================

class Users {
    private users: Map<string, User>;
    private static init = true;

    public constructor() {
        this.users = new Map();
    }

    public initCompleted() {
        Users.init = false;
        this.debugDump();
    }

    public inInit() {
        return Users.init;
    }

    public async loadUsers() {
        await createFluvioUserTopic();

        // initialize event stream emitter
        fluvioStreams.subscribeToStream(
            getUserEventStream(),
            'earliest',
            userEventCallback
        )
    }

    public hasUser(userName: string) {
        return this.users.has(userName);
    }

    public getUser(userName: string) {
        let user = this.users.get(userName);
        if (!user) {
            console.error(`User ${userName} not found`);
        }
        return user;
    }

    public getUserByToken(token: string) {
        for (let user of this.users.values()) {
            if (user.token == token) {
                return user;
            }
        }
        return undefined;
    }

    public addUser(userObj: Object) {
        let user = new User(userObj);
        user.password = getHashedPassword(user.password);
        user.status = UserStatus.Offline;
        user.colorCode = randomColorCode();
        user.created = getDateTime();

        // add to local store (through event callback)
        user.add();
    }

    public removeUser(userName: string) {
        const user = this.getUser(userName);
        if (user) {

            // remove from store (through event callback)
            user.delete();
        }
    }

    public generateToken(userName: string) {
        var user = this.getUser(userName);
        if (user) {
            return user.generateToken();
        }
        return undefined;
    }

    public clearToken(userName: string) {
        var user = this.getUser(userName);
        if (user) {
            user.clearToken();
        }
    }

    public getUsers() {
        var usersKV: KV[] = [];
        for (let user of this.users.values()) {
            usersKV.push(user.toCleanKV());
        }
        return usersKV;
    }

    public debugDump() {
        console.table(this.getUsers(), ['name', 'status']);
    }

    // ------------------
    //  Fluvio Callbacks
    // ------------------
    public addUserCallback(userName: string, userObj: Object) {
        let user = new User(userObj);
        this.users.set(userName, user);
        console.log(`[s] users => added  ${userName} `);

        if (!this.inInit()) {
            broadcastAddUser(userName, user.toCleanKV());
        }
    }

    public removeUserCallback(userName: string) {
        const found = this.users.delete(userName);
        if (!found) {
            console.error(`[s] users => ${userName} not found`);
            return;
        }

        console.log(`[s] users => removed ${userName}`);
        if (!this.inInit()) {
            broadcastRemoveUser(userName);
        }
    }
    public updateOnlineCallback(userName: string) {
        let user = this.getUser(userName);
        if (user) {
            if (this.inInit()) {
                user.status = UserStatus.Online;
            } else {
                broadcastUserOnline(userName);
            }
        }
    }

    public updateOfflineCallback(userName: string) {
        let user = this.getUser(userName);
        if (user) {
            if (this.inInit()) {
                user.status = UserStatus.Offline;
            } else {
                broadcastUserOffline(userName);
            }
        }
    }

    public updateTokenCallback(userName: string, token: string) {
        let user = this.getUser(userName);
        if (user) {
            if (this.inInit()) {
                user.token = token;
            } else {
                console.log(`... notify: user ${userName} token`);
            }
        }
    }

    public updatePasswordCallback(userName: string, pass: string) {
        let user = this.getUser(userName);
        if (user) {
            if (this.inInit()) {
                user.password = pass;
            } else {
                console.log(`... notify: user ${userName} pass`);
            }
        }
    }
}

//================================
// Fluvio Topic - user events callback
// ===============================

const userEventCallback: EventCallback = function (event: Event): void {
    console.log("------- S(user) << E(user)");
    console.log(`${JSON.stringify(event.metadata)}`);

    switch (event.metadata.type) {
        case UserEvent.REGISTERED:
            userSingleton.addUserCallback(event.metadata.key, event.params);
            break
        case UserEvent.UNREGISTERED:
            userSingleton.removeUserCallback(event.metadata.key);
            break;
        case UserEvent.ONLINE:
            userSingleton.updateOnlineCallback(event.metadata.key);
            break;
        case UserEvent.OFFLINE:
            userSingleton.updateOfflineCallback(event.metadata.key);
            break;
        case UserEvent.TOKEN_UPDATED:
            userSingleton.updateTokenCallback(event.metadata.key, event.params.token);
            break;
        case UserEvent.PASSWORD_UPDATED:
            userSingleton.updatePasswordCallback(event.metadata.key, event.params.password);
            break;
        default:
            console.error(`Unknown user event type ${event.metadata.type}`);
    }
    console.log("-------");
};

//================================
// Fluvio - user events topic
// ===============================

const createFluvioUserTopic = async () => {
    const topicName = FLUVIO_USER_TOPIC;

    // save to local store
    const created = await fluvioTopics.createTopicIfNotDefined(
        topicName,
        1,
        TOPIC_REPLICATION
    );

    // allow time to propagate
    if (created) {
        await sleep(500);
    }
}

export const getUserEventStream = () => {
    const stream: Stream = {
        topic: FLUVIO_USER_TOPIC,
        partition: 0,
    }
    return stream;
}

const userSingleton = new Users();
Object.freeze(userSingleton);

export default userSingleton;
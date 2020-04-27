import * as React from 'react';
import { useState, useEffect, useMemo, createContext } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { getSiteToken } from '../../middleware/SiteCookies';
import { Config } from '../../config/Config';
import { getWsUserMessage, UserOperation } from '../../wsProtocol';

export enum UserStatus {
    Online = "Online",
    Offline = "Offline",
    Unknown = "Unknown",
}

export interface User {
    name: string,
    colorCode: string,
    status: UserStatus,
    created: string,
}

export interface UserState {
    users: Array<User>,
}

interface Props {
    children: any,
};

export const UserContextProvider = (props: Props) => {
    const socketUrl = `${Config.WsServer}/${getSiteToken()}`;
    const [userState, setUsersState] = useState({ users: [] });
    const STATIC_OPTIONS = useMemo(() => ({
        share: true,
    }), []);
    const [_, lastMessage, readyState] = useWebSocket(socketUrl, STATIC_OPTIONS);

    const addUsers = (newUsers: User[]) => {
        console.log(`connected to server`);
        setUsersState({ users: newUsers });
    }

    const addUser = (newUser: User) => {
        console.log(`add user ${newUser.name}`);
        var users = userState.users;
        if (!users.find(user => user.name == newUser.name)) {
            users.push(newUser);
            setUsersState({ users: users });
        }
    }

    const removeUser = (userName: string) => {
        console.log(`remove user ${userName}`);
        var users = userState.users;
        let user = users.find(user => user.name == userName);
        if (user) {
            var index = users.indexOf(user);
            if (index > -1) {
                users.splice(index, 1);
            }
            setUsersState({ users: users });
        }
    }

    const setUserStatus = (userName: string, status: UserStatus) => {
        console.log(`user ${userName} - ${status}`);

        var users = userState.users;
        users.map((user) => {
            if (user.name == userName) {
                user.status = status;
                return;
            }
        });
        setUsersState({ users: users });
    }

    const setUsersStatusToUnknown = () => {
        var users = userState.users;
        users.map((user) => {
            user.status = UserStatus.Unknown
        });
        setUsersState({ users: users });
    }

    useEffect(() => {
        if (lastMessage !== null) {
            const userMsg = getWsUserMessage(lastMessage.data);
            if (userMsg) {
                switch (userMsg.operation) {
                    case UserOperation.AllUsers:
                        addUsers(userMsg.data as User[]);
                        break;
                    case UserOperation.AddUser:
                        addUser(userMsg.data as User);
                        break;
                    case UserOperation.RemoveUser:
                        removeUser(userMsg.data.userName);
                        break;
                    case UserOperation.Offline:
                        setUserStatus(userMsg.data.userName, UserStatus.Offline);
                        break;
                    case UserOperation.Online:
                        setUserStatus(userMsg.data.userName, UserStatus.Online);
                        break;
                    default:
                        console.error(`user: message handler missing (${userMsg.operation})`);
                        break;
                }
            }
        }
    }, [lastMessage]);

    useEffect(() => {
        switch (readyState) {
            case ReadyState.CLOSED:
                console.log("lost connection to server");
                setUsersStatusToUnknown();
                break;
            default: // ignored
                break;
        }
    }, [readyState]);



    return (
        <UserContext.Provider value={userState}>
            {props.children}
        </UserContext.Provider>
    );
}

export const UserContext = createContext<UserState | null>(null);
export const UserContextConsumer = UserContext.Consumer;
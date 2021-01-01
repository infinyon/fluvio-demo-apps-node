import * as React from 'react';
import { useContext } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { navBkColor, mainColor, otherColor } from '../config/Constants';
import MyAvatar, { AvatarStatus } from '../components/MyAvatar';
import { ChatContext } from '../context/ChatContext';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
        },
        grow: {
            flexGrow: 1,
        },
        inline: {
            display: 'inline',
        },
        listHeader: {
            color: mainColor,
            fontSize: '1.6em',
            textAlign: 'left',
            paddingTop: 5,
            background: navBkColor,
            zIndex: 10,
        },
        userName: {
            color: otherColor,
            textAlign: 'left',
            marginTop: 8,
            marginLeft: 8,
            fontSize: '1.35em',
        },
    }),
);

export default function UsersView() {
    const classes = useStyles();
    const users = useContext(ChatContext).users.getUsers();
    const status = useContext(ChatContext).status;

    return (
        <List
            subheader={
                <ListSubheader className={classes.listHeader}>
                    Users
                </ListSubheader>
            }
            className={classes.root}
        >
            {users.map((user) => (
                <ListItem alignItems="flex-start" key={user.user} dense>
                    <MyAvatar
                        name={user.user}
                        colorCode={user.colorCode}
                        status={(status.getStatus(user.user) as string) as AvatarStatus}
                    />
                    <ListItemText
                        primary={
                            <Typography variant="h5" className={classes.userName}>
                                {user.user}
                            </Typography>
                        }
                    />
                </ListItem>
            ))}
        </List >
    );
}

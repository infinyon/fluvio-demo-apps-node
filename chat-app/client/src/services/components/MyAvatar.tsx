import * as React from 'react';
import { Theme, createStyles, withStyles, makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import {
    red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green,
    lightGreen, lime, yellow, amber, orange, deepOrange, brown
} from '@material-ui/core/colors';

const StyledBadgeOnline = withStyles((theme: Theme) =>
    createStyles({
        badge: {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '1px solid currentColor',
                content: '""',
            },
        },
    }),
)(Badge);

const StyledBadgeOffline = withStyles((theme: Theme) =>
    createStyles({
        badge: {
            backgroundColor: '#ccc',
            color: '#ccc',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '1px solid currentColor',
                content: '""',
            },
        },
    }),
)(Badge);

const StyledBadgeUnknown = withStyles((theme: Theme) =>
    createStyles({
        badge: {
            backgroundColor: 'yellow',
            color: '#ccc',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: '$ripple 1.2s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
            },
        },
        '@keyframes ripple': {
            '0%': {
                transform: 'scale(.8)',
                opacity: 1,
            },
            '100%': {
                transform: 'scale(2.4)',
                opacity: 0,
            },
        },
    }),
)(Badge);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        custom: {
            width: 35,
            height: 35,
        },
        red: {
            color: theme.palette.getContrastText(red[500]),
            backgroundColor: red[500],
        },
        pink: {
            color: theme.palette.getContrastText(pink[500]),
            backgroundColor: pink[500],
        },
        purple: {
            color: theme.palette.getContrastText(purple[500]),
            backgroundColor: purple[500],
        },
        deepPurple: {
            color: theme.palette.getContrastText(deepPurple[500]),
            backgroundColor: deepPurple[500],
        },
        indigo: {
            color: theme.palette.getContrastText(indigo[500]),
            backgroundColor: indigo[500],
        },
        blue: {
            color: theme.palette.getContrastText(blue[500]),
            backgroundColor: blue[500],
        },
        lightBlue: {
            color: theme.palette.getContrastText(lightBlue[500]),
            backgroundColor: lightBlue[500],
        },
        cyan: {
            color: theme.palette.getContrastText(cyan[500]),
            backgroundColor: cyan[500],
        },
        teal: {
            color: theme.palette.getContrastText(teal[500]),
            backgroundColor: teal[500],
        },
        green: {
            color: theme.palette.getContrastText(green[500]),
            backgroundColor: green[500],
        },
        lightGreen: {
            color: theme.palette.getContrastText(lightGreen[500]),
            backgroundColor: lightGreen[500],
        },
        lime: {
            color: theme.palette.getContrastText(lime[500]),
            backgroundColor: lime[500],
        },
        yellow: {
            color: theme.palette.getContrastText(yellow[500]),
            backgroundColor: yellow[500],
        },
        amber: {
            color: theme.palette.getContrastText(amber[500]),
            backgroundColor: amber[500],
        },
        orange: {
            color: theme.palette.getContrastText(orange[500]),
            backgroundColor: orange[500],
        },
        deepOrange: {
            color: theme.palette.getContrastText(deepOrange[500]),
            backgroundColor: deepOrange[500],
        },
        brown: {
            color: theme.palette.getContrastText(brown[500]),
            backgroundColor: brown[500],
        }
    })
);

export enum AvatarStatus {
    Online = "Online",
    Offline = "Offline",
    Unknown = "Unknown",
}

interface Props {
    name: string;
    colorCode: string;
    status?: AvatarStatus;
}

export default function MyAvatar(props: Props) {
    const classes = useStyles();
    const name = props.name;
    const color = props.colorCode;

    let avatar = null;
    switch (color) {
        case "red":
            avatar = < Avatar className={`${classes.custom} ${classes.red}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "pink":
            avatar = < Avatar className={`${classes.custom} ${classes.pink}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "purple":
            avatar = < Avatar className={`${classes.custom} ${classes.purple}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "deepPurple":
            avatar = < Avatar className={`${classes.custom} ${classes.deepPurple}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "indigo":
            avatar = < Avatar className={`${classes.custom} ${classes.indigo}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "blue":
            avatar = < Avatar className={`${classes.custom} ${classes.blue}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lightBlue":
            avatar = < Avatar className={`${classes.custom} ${classes.lightBlue}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "cyan":
            avatar = < Avatar className={`${classes.custom} ${classes.cyan}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "teal":
            avatar = < Avatar className={`${classes.custom} ${classes.teal}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "green":
            avatar = < Avatar className={`${classes.custom} ${classes.green}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lightGreen":
            avatar = < Avatar className={`${classes.custom} ${classes.lightGreen}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lime":
            avatar = < Avatar className={`${classes.custom} ${classes.lime}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "yellow":
            avatar = < Avatar className={`${classes.custom} ${classes.yellow}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "amber":
            avatar = < Avatar className={`${classes.custom} ${classes.amber}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "orange":
            avatar = < Avatar className={`${classes.custom} ${classes.orange}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "deepOrange":
            avatar = < Avatar className={`${classes.custom} ${classes.deepOrange}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "brown":
            avatar = < Avatar className={`${classes.custom} ${classes.brown}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        default:
            avatar = <Avatar className={`${classes.custom}`}> {name.charAt(0).toUpperCase()}</Avatar>;
    };

    return (
        <div className={classes.root}>
            {
                (props.status == undefined) &&
                <div>
                    {avatar}
                </div>
            }
            {
                (props.status == AvatarStatus.Online) &&
                <StyledBadgeOnline
                    overlap="circle"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    variant="dot"
                >
                    {avatar}
                </StyledBadgeOnline>
            }
            {
                (props.status == AvatarStatus.Offline) &&
                <StyledBadgeOffline
                    overlap="circle"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    variant="dot"
                >
                    {avatar}
                </StyledBadgeOffline>
            }
            {
                (props.status == AvatarStatus.Unknown) &&
                <StyledBadgeUnknown
                    overlap="circle"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    variant="dot"
                >
                    {avatar}
                </StyledBadgeUnknown>
            }
        </div>
    );
}

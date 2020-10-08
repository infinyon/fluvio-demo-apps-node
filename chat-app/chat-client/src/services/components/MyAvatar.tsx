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
        red_100: {
            color: theme.palette.getContrastText(red[100]),
            backgroundColor: red[100],
        },
        red_200: {
            color: theme.palette.getContrastText(red[200]),
            backgroundColor: red[200],
        },
        red_300: {
            color: theme.palette.getContrastText(red[300]),
            backgroundColor: red[300],
        },
        red_400: {
            color: theme.palette.getContrastText(red[400]),
            backgroundColor: red[400],
        },
        red_500: {
            color: theme.palette.getContrastText(red[500]),
            backgroundColor: red[500],
        },
        pink_100: {
            color: theme.palette.getContrastText(pink[100]),
            backgroundColor: pink[100],
        },
        pink_200: {
            color: theme.palette.getContrastText(pink[200]),
            backgroundColor: pink[200],
        },
        pink_300: {
            color: theme.palette.getContrastText(pink[300]),
            backgroundColor: pink[300],
        },
        pink_400: {
            color: theme.palette.getContrastText(pink[400]),
            backgroundColor: pink[400],
        },
        pink_500: {
            color: theme.palette.getContrastText(pink[500]),
            backgroundColor: pink[500],
        },
        purple_100: {
            color: theme.palette.getContrastText(purple[100]),
            backgroundColor: purple[100],
        },
        purple_200: {
            color: theme.palette.getContrastText(purple[200]),
            backgroundColor: purple[200],
        },
        purple_300: {
            color: theme.palette.getContrastText(purple[300]),
            backgroundColor: purple[300],
        },
        purple_400: {
            color: theme.palette.getContrastText(purple[400]),
            backgroundColor: purple[400],
        },
        purple_500: {
            color: theme.palette.getContrastText(purple[500]),
            backgroundColor: purple[500],
        },
        deepPurple_100: {
            color: theme.palette.getContrastText(deepPurple[100]),
            backgroundColor: deepPurple[100],
        },
        deepPurple_200: {
            color: theme.palette.getContrastText(deepPurple[200]),
            backgroundColor: deepPurple[200],
        },
        deepPurple_300: {
            color: theme.palette.getContrastText(deepPurple[300]),
            backgroundColor: deepPurple[300],
        },
        deepPurple_400: {
            color: theme.palette.getContrastText(deepPurple[400]),
            backgroundColor: deepPurple[400],
        },
        deepPurple_500: {
            color: theme.palette.getContrastText(deepPurple[500]),
            backgroundColor: deepPurple[500],
        },
        indigo_100: {
            color: theme.palette.getContrastText(indigo[100]),
            backgroundColor: indigo[100],
        },
        indigo_200: {
            color: theme.palette.getContrastText(indigo[200]),
            backgroundColor: indigo[200],
        },
        indigo_300: {
            color: theme.palette.getContrastText(indigo[300]),
            backgroundColor: indigo[300],
        },
        indigo_400: {
            color: theme.palette.getContrastText(indigo[400]),
            backgroundColor: indigo[400],
        },
        indigo_500: {
            color: theme.palette.getContrastText(indigo[500]),
            backgroundColor: indigo[500],
        },
        blue_100: {
            color: theme.palette.getContrastText(blue[100]),
            backgroundColor: blue[100],
        },
        blue_200: {
            color: theme.palette.getContrastText(blue[200]),
            backgroundColor: blue[200],
        },
        blue_300: {
            color: theme.palette.getContrastText(blue[300]),
            backgroundColor: blue[300],
        },
        blue_400: {
            color: theme.palette.getContrastText(blue[400]),
            backgroundColor: blue[400],
        },
        blue_500: {
            color: theme.palette.getContrastText(blue[500]),
            backgroundColor: blue[500],
        },
        lightBlue_100: {
            color: theme.palette.getContrastText(lightBlue[100]),
            backgroundColor: lightBlue[100],
        },
        lightBlue_200: {
            color: theme.palette.getContrastText(lightBlue[200]),
            backgroundColor: lightBlue[200],
        },
        lightBlue_300: {
            color: theme.palette.getContrastText(lightBlue[300]),
            backgroundColor: lightBlue[300],
        },
        lightBlue_400: {
            color: theme.palette.getContrastText(lightBlue[400]),
            backgroundColor: lightBlue[400],
        },
        lightBlue_500: {
            color: theme.palette.getContrastText(lightBlue[500]),
            backgroundColor: lightBlue[500],
        },
        cyan_100: {
            color: theme.palette.getContrastText(cyan[100]),
            backgroundColor: cyan[100],
        },
        cyan_200: {
            color: theme.palette.getContrastText(cyan[200]),
            backgroundColor: cyan[200],
        },
        cyan_300: {
            color: theme.palette.getContrastText(cyan[300]),
            backgroundColor: cyan[300],
        },
        cyan_400: {
            color: theme.palette.getContrastText(cyan[400]),
            backgroundColor: cyan[400],
        },
        cyan_500: {
            color: theme.palette.getContrastText(cyan[500]),
            backgroundColor: cyan[500],
        },
        teal_100: {
            color: theme.palette.getContrastText(teal[100]),
            backgroundColor: teal[100],
        },
        teal_200: {
            color: theme.palette.getContrastText(teal[200]),
            backgroundColor: teal[200],
        },
        teal_300: {
            color: theme.palette.getContrastText(teal[300]),
            backgroundColor: teal[300],
        },
        teal_400: {
            color: theme.palette.getContrastText(teal[400]),
            backgroundColor: teal[400],
        },
        teal_500: {
            color: theme.palette.getContrastText(teal[500]),
            backgroundColor: teal[500],
        },
        green_100: {
            color: theme.palette.getContrastText(green[100]),
            backgroundColor: green[100],
        },
        green_200: {
            color: theme.palette.getContrastText(green[200]),
            backgroundColor: green[200],
        },
        green_300: {
            color: theme.palette.getContrastText(green[300]),
            backgroundColor: green[300],
        },
        green_400: {
            color: theme.palette.getContrastText(green[400]),
            backgroundColor: green[400],
        },
        green_500: {
            color: theme.palette.getContrastText(green[500]),
            backgroundColor: green[500],
        },
        lightGreen_100: {
            color: theme.palette.getContrastText(lightGreen[100]),
            backgroundColor: lightGreen[100],
        },
        lightGreen_200: {
            color: theme.palette.getContrastText(lightGreen[200]),
            backgroundColor: lightGreen[200],
        },
        lightGreen_300: {
            color: theme.palette.getContrastText(lightGreen[300]),
            backgroundColor: lightGreen[300],
        },
        lightGreen_400: {
            color: theme.palette.getContrastText(lightGreen[400]),
            backgroundColor: lightGreen[400],
        },
        lightGreen_500: {
            color: theme.palette.getContrastText(lightGreen[500]),
            backgroundColor: lightGreen[500],
        },
        lime_100: {
            color: theme.palette.getContrastText(lime[100]),
            backgroundColor: lime[100],
        },
        lime_200: {
            color: theme.palette.getContrastText(lime[200]),
            backgroundColor: lime[200],
        },
        lime_300: {
            color: theme.palette.getContrastText(lime[300]),
            backgroundColor: lime[300],
        },
        lime_400: {
            color: theme.palette.getContrastText(lime[400]),
            backgroundColor: lime[400],
        },
        lime_500: {
            color: theme.palette.getContrastText(lime[500]),
            backgroundColor: lime[500],
        },
        yellow_100: {
            color: theme.palette.getContrastText(yellow[100]),
            backgroundColor: yellow[100],
        },
        yellow_200: {
            color: theme.palette.getContrastText(yellow[200]),
            backgroundColor: yellow[200],
        },
        yellow_300: {
            color: theme.palette.getContrastText(yellow[300]),
            backgroundColor: yellow[300],
        },
        yellow_400: {
            color: theme.palette.getContrastText(yellow[400]),
            backgroundColor: yellow[400],
        },
        yellow_500: {
            color: theme.palette.getContrastText(yellow[500]),
            backgroundColor: yellow[500],
        },
        amber_100: {
            color: theme.palette.getContrastText(amber[100]),
            backgroundColor: amber[100],
        },
        amber_200: {
            color: theme.palette.getContrastText(amber[200]),
            backgroundColor: amber[200],
        },
        amber_300: {
            color: theme.palette.getContrastText(amber[300]),
            backgroundColor: amber[300],
        },
        amber_400: {
            color: theme.palette.getContrastText(amber[400]),
            backgroundColor: amber[400],
        },
        amber_500: {
            color: theme.palette.getContrastText(amber[500]),
            backgroundColor: amber[500],
        },
        orange_100: {
            color: theme.palette.getContrastText(orange[100]),
            backgroundColor: orange[100],
        },
        orange_200: {
            color: theme.palette.getContrastText(orange[200]),
            backgroundColor: orange[200],
        },
        orange_300: {
            color: theme.palette.getContrastText(orange[300]),
            backgroundColor: orange[300],
        },
        orange_400: {
            color: theme.palette.getContrastText(orange[400]),
            backgroundColor: orange[400],
        },
        orange_500: {
            color: theme.palette.getContrastText(orange[500]),
            backgroundColor: orange[500],
        },
        deepOrange_100: {
            color: theme.palette.getContrastText(deepOrange[100]),
            backgroundColor: deepOrange[100],
        },
        deepOrange_200: {
            color: theme.palette.getContrastText(deepOrange[200]),
            backgroundColor: deepOrange[200],
        },
        deepOrange_300: {
            color: theme.palette.getContrastText(deepOrange[300]),
            backgroundColor: deepOrange[300],
        },
        deepOrange_400: {
            color: theme.palette.getContrastText(deepOrange[400]),
            backgroundColor: deepOrange[400],
        },
        deepOrange_500: {
            color: theme.palette.getContrastText(deepOrange[500]),
            backgroundColor: deepOrange[500],
        },
        brown_100: {
            color: theme.palette.getContrastText(brown[100]),
            backgroundColor: brown[100],
        },
        brown_200: {
            color: theme.palette.getContrastText(brown[200]),
            backgroundColor: brown[200],
        },
        brown_300: {
            color: theme.palette.getContrastText(brown[300]),
            backgroundColor: brown[300],
        },
        brown_400: {
            color: theme.palette.getContrastText(brown[400]),
            backgroundColor: brown[400],
        },
        brown_500: {
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
        case "red_100":
            avatar = < Avatar className={`${classes.custom} ${classes.red_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "red_200":
            avatar = < Avatar className={`${classes.custom} ${classes.red_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "red_300":
            avatar = < Avatar className={`${classes.custom} ${classes.red_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "red_400":
            avatar = < Avatar className={`${classes.custom} ${classes.red_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "red_500":
            avatar = < Avatar className={`${classes.custom} ${classes.red_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "pink_100":
            avatar = < Avatar className={`${classes.custom} ${classes.pink_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "pink_200":
            avatar = < Avatar className={`${classes.custom} ${classes.pink_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "pink_300":
            avatar = < Avatar className={`${classes.custom} ${classes.pink_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "pink_400":
            avatar = < Avatar className={`${classes.custom} ${classes.pink_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "pink_500":
            avatar = < Avatar className={`${classes.custom} ${classes.pink_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "purple_100":
            avatar = < Avatar className={`${classes.custom} ${classes.purple_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "purple_200":
            avatar = < Avatar className={`${classes.custom} ${classes.purple_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "purple_300":
            avatar = < Avatar className={`${classes.custom} ${classes.purple_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "purple_400":
            avatar = < Avatar className={`${classes.custom} ${classes.purple_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "purple_500":
            avatar = < Avatar className={`${classes.custom} ${classes.purple_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "deepPurple_100":
            avatar = < Avatar className={`${classes.custom} ${classes.deepPurple_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "deepPurple_200":
            avatar = < Avatar className={`${classes.custom} ${classes.deepPurple_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "deepPurple_300":
            avatar = < Avatar className={`${classes.custom} ${classes.deepPurple_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "deepPurple_400":
            avatar = < Avatar className={`${classes.custom} ${classes.deepPurple_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "deepPurple_500":
            avatar = < Avatar className={`${classes.custom} ${classes.deepPurple_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "indigo_100":
            avatar = < Avatar className={`${classes.custom} ${classes.indigo_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "indigo_200":
            avatar = < Avatar className={`${classes.custom} ${classes.indigo_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "indigo_300":
            avatar = < Avatar className={`${classes.custom} ${classes.indigo_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "indigo_400":
            avatar = < Avatar className={`${classes.custom} ${classes.indigo_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "indigo_500":
            avatar = < Avatar className={`${classes.custom} ${classes.indigo_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "blue_100":
            avatar = < Avatar className={`${classes.custom} ${classes.blue_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "blue_200":
            avatar = < Avatar className={`${classes.custom} ${classes.blue_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "blue_300":
            avatar = < Avatar className={`${classes.custom} ${classes.blue_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "blue_400":
            avatar = < Avatar className={`${classes.custom} ${classes.blue_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "blue_500":
            avatar = < Avatar className={`${classes.custom} ${classes.blue_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lightBlue_100":
            avatar = < Avatar className={`${classes.custom} ${classes.lightBlue_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lightBlue_200":
            avatar = < Avatar className={`${classes.custom} ${classes.lightBlue_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lightBlue_300":
            avatar = < Avatar className={`${classes.custom} ${classes.lightBlue_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lightBlue_400":
            avatar = < Avatar className={`${classes.custom} ${classes.lightBlue_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lightBlue_500":
            avatar = < Avatar className={`${classes.custom} ${classes.lightBlue_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "cyan_100":
            avatar = < Avatar className={`${classes.custom} ${classes.cyan_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "cyan_200":
            avatar = < Avatar className={`${classes.custom} ${classes.cyan_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "cyan_300":
            avatar = < Avatar className={`${classes.custom} ${classes.cyan_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "cyan_400":
            avatar = < Avatar className={`${classes.custom} ${classes.cyan_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "cyan_500":
            avatar = < Avatar className={`${classes.custom} ${classes.cyan_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "teal_100":
            avatar = < Avatar className={`${classes.custom} ${classes.teal_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "teal_200":
            avatar = < Avatar className={`${classes.custom} ${classes.teal_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "teal_300":
            avatar = < Avatar className={`${classes.custom} ${classes.teal_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "teal_400":
            avatar = < Avatar className={`${classes.custom} ${classes.teal_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "teal_500":
            avatar = < Avatar className={`${classes.custom} ${classes.teal_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "green_100":
            avatar = < Avatar className={`${classes.custom} ${classes.green_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "green_200":
            avatar = < Avatar className={`${classes.custom} ${classes.green_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "green_300":
            avatar = < Avatar className={`${classes.custom} ${classes.green_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "green_400":
            avatar = < Avatar className={`${classes.custom} ${classes.green_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "green_500":
            avatar = < Avatar className={`${classes.custom} ${classes.green_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lightGreen_100":
            avatar = < Avatar className={`${classes.custom} ${classes.lightGreen_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lightGreen_200":
            avatar = < Avatar className={`${classes.custom} ${classes.lightGreen_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lightGreen_300":
            avatar = < Avatar className={`${classes.custom} ${classes.lightGreen_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lightGreen_400":
            avatar = < Avatar className={`${classes.custom} ${classes.lightGreen_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lightGreen_500":
            avatar = < Avatar className={`${classes.custom} ${classes.lightGreen_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lime_100":
            avatar = < Avatar className={`${classes.custom} ${classes.lime_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lime_200":
            avatar = < Avatar className={`${classes.custom} ${classes.lime_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lime_300":
            avatar = < Avatar className={`${classes.custom} ${classes.lime_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lime_400":
            avatar = < Avatar className={`${classes.custom} ${classes.lime_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "lime_500":
            avatar = < Avatar className={`${classes.custom} ${classes.lime_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "yellow_100":
            avatar = < Avatar className={`${classes.custom} ${classes.yellow_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "yellow_200":
            avatar = < Avatar className={`${classes.custom} ${classes.yellow_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "yellow_300":
            avatar = < Avatar className={`${classes.custom} ${classes.yellow_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "yellow_400":
            avatar = < Avatar className={`${classes.custom} ${classes.yellow_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "yellow_500":
            avatar = < Avatar className={`${classes.custom} ${classes.yellow_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "amber_100":
            avatar = < Avatar className={`${classes.custom} ${classes.amber_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "amber_200":
            avatar = < Avatar className={`${classes.custom} ${classes.amber_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "amber_300":
            avatar = < Avatar className={`${classes.custom} ${classes.amber_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "amber_400":
            avatar = < Avatar className={`${classes.custom} ${classes.amber_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "amber_500":
            avatar = < Avatar className={`${classes.custom} ${classes.amber_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "orange_100":
            avatar = < Avatar className={`${classes.custom} ${classes.orange_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "orange_200":
            avatar = < Avatar className={`${classes.custom} ${classes.orange_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "orange_300":
            avatar = < Avatar className={`${classes.custom} ${classes.orange_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "orange_400":
            avatar = < Avatar className={`${classes.custom} ${classes.orange_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "orange_500":
            avatar = < Avatar className={`${classes.custom} ${classes.orange_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "deepOrange_100":
            avatar = < Avatar className={`${classes.custom} ${classes.deepOrange_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "deepOrange_200":
            avatar = < Avatar className={`${classes.custom} ${classes.deepOrange_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "deepOrange_300":
            avatar = < Avatar className={`${classes.custom} ${classes.deepOrange_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "deepOrange_400":
            avatar = < Avatar className={`${classes.custom} ${classes.deepOrange_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "deepOrange_500":
            avatar = < Avatar className={`${classes.custom} ${classes.deepOrange_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "brown_100":
            avatar = < Avatar className={`${classes.custom} ${classes.brown_100}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "brown_200":
            avatar = < Avatar className={`${classes.custom} ${classes.brown_200}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "brown_300":
            avatar = < Avatar className={`${classes.custom} ${classes.brown_300}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "brown_400":
            avatar = < Avatar className={`${classes.custom} ${classes.brown_400}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        case "brown_500":
            avatar = < Avatar className={`${classes.custom} ${classes.brown_500}`} > {name.charAt(0).toUpperCase()}</Avatar >;
            break;
        default:
            avatar = <Avatar> {name.charAt(0).toUpperCase()}</Avatar>;
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

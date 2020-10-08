import * as React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { mainColor, otherColor } from '../config/Constants';
import { getUserName } from '../middleware/SiteCookies';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        section: {
            paddingTop: 12,
            paddingBottom: 8,
            textAlign: 'center',
        },
        atTag: {
            color: otherColor,
            fontSize: '2.2em',
            marginRight: 5,
        },
        text: {
            fontSize: '2.0em',
            color: mainColor,
        },
        icon: {
            width: 20,
            height: 20,
            display: 'inline-flex',
        }
    }),
);

export default function HeaderUser() {
    const classes = useStyles();
    const userName = getUserName();

    return (
        <div className={classes.section}>
            <Box component="div" display="inline" className={classes.atTag}>
                @
            </Box>
            <Box component="div" display="inline" className={classes.text}>
                {userName}
            </Box>
        </div >
    );
}

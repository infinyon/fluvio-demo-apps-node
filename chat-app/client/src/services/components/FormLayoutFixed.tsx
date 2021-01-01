import * as React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grid: {
            //minHeight: 'calc(100vh - 56px)',
            [theme.breakpoints.down('xs')]: {
                alignItems: 'flex-start',
                paddingTop: theme.spacing(5),
            },
        },
        paper: {
            textAlign: 'center',
            marginBottom: theme.spacing(12),
            paddingTop: theme.spacing(1),
        },
        card: {
            width: 440,
            [theme.breakpoints.down('xs')]: {
                width: 345,
            },
        },
    })
);

interface Props { }

export const FormLayoutFixed: React.FC<Props> = (props) => {
    const classes = useStyles();
    const { children } = props;

    return (
        <Grid container
            justify="center"
            alignItems="center"
            className={classes.grid}
        >
            <Paper className={classes.paper}>
                <Card className={classes.card}>
                    {children}
                </Card>
            </Paper>
        </Grid>
    );
};
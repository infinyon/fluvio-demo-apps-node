import * as React from 'react';
import { withFormik, FormikProps } from 'formik';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { FormLayoutFixed } from '../components/FormLayoutFixed';
import { MyTextField } from '../components/MyTextField';
import MyButton from '../components/MyButton';
import Typography from '@material-ui/core/Typography';
import Account from '@material-ui/icons/PersonOutline';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        icon: {
            width: '140px',
        },
        iconWrapper: {
            textAlign: 'center',
            display: 'block',
            marginTop: theme.spacing(5),
            marginBottom: theme.spacing(5),
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(4),
        },
        title: {
            marginTop: 20,
            minHeight: 50,
        },
        titleFont: {
            fontSize: 30,
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
        },
        logo: {
            fontSize: 38,
            verticalAlign: 'middle',
            marginBottom: 5,
            marginRight: 10,
        },
        container: {
            padding: 0,
        },
        button: {
            width: '100%',
            paddingTop: theme.spacing(1),
        },
        footer: {
            textAlign: 'left',
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            paddingBottom: theme.spacing(1),
            fontSize: 17,
        },
        link: {
            display: 'block',
            float: 'none',
            width: '100%',
            textAlign: 'center',
            paddingTop: theme.spacing(1),
        },
        links: {
            color: theme.palette.text.secondary,
            textDecoration: 'none',
        },
    }),
);

export interface RegisterFields {
    user: string;
}

interface FormProps {
    user?: string;

    onSubmit: (user: RegisterFields) => void;
}

const InnerForm = (props: FormProps & FormikProps<RegisterFields>) => {
    const classes = useStyles();

    return (
        <div>
            <div className={classes.iconWrapper}>
                <img src="/fav/android-chrome-192x192.png" className={classes.icon}></img>
            </div>
            <FormLayoutFixed>
                <form onSubmit={props.handleSubmit} className={classes.form}>
                    <Box className={classes.title}>
                        <Typography className={classes.titleFont} color='textSecondary'>
                            <Account className={classes.logo} />
                        Register User
                </Typography>
                    </Box>
                    <MyTextField
                        id="user"
                        name="Nickname"
                        required
                        hideLabel
                        values={props.values}
                        errors={props.errors}
                        onHandleChange={props.handleChange.bind(this)}
                    />
                    <Container className={classes.container}>
                        <Box className={classes.button} >
                            <MyButton
                                buttonText="Register"
                                variant="contained"
                                type="submit"
                                disabled={props.isSubmitting} />
                        </Box>
                    </Container>
                    <Box className={classes.footer}>
                        <Box component="div" className={classes.link}>
                            <a
                                href="/login"
                                className={classes.links}
                            >
                                I have an account
                    </a>
                        </Box>
                    </Box>
                </form>
            </FormLayoutFixed>
        </div>
    );
}

export const RegisterForm = withFormik<FormProps, RegisterFields>({
    enableReinitialize: true,
    mapPropsToValues: () => ({
        user: '',
    }),
    handleSubmit: (values, { props, setSubmitting }) => {
        props.onSubmit(values);
        setSubmitting(false);
    },
})(InnerForm);

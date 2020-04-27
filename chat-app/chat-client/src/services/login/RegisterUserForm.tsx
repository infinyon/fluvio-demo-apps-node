import * as React from 'react';
import { InjectedFormikProps, withFormik } from 'formik';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { FormLayoutFixed } from '../components/FormLayoutFixed';
import { MyTextField } from '../components/MyTextField';
import MyPassword from '../components/MyPassword';
import MyButton from '../components/MyButton';
import Typography from '@material-ui/core/Typography';
import Account from '@material-ui/icons/PersonOutline';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
            paddingTop: theme.spacing(2),
        },
        links: {
            color: theme.palette.text.secondary,
            textDecoration: 'none',
        },
    }),
);

export interface RegisterUserFields {
    name: string;
    password: string;
}

interface FormProps {
    name?: string;
    password?: string;

    onSubmit: (user: RegisterUserFields) => void;
}

const InnerForm: React.FC<InjectedFormikProps<FormProps, RegisterUserFields>> = (
    props,
) => {
    const classes = useStyles();

    return (
        <FormLayoutFixed>
            <form onSubmit={props.handleSubmit} className={classes.form}>
                <Box className={classes.title}>
                    <Typography className={classes.titleFont} color='textSecondary'>
                        <Account className={classes.logo} />
                        New User
                </Typography>
                </Box>
                <MyTextField
                    id="name"
                    name="Nickname"
                    required
                    hideLabel
                    values={props.values}
                    errors={props.errors}
                    onHandleChange={props.handleChange.bind(this)}
                />
                <MyPassword
                    id="password"
                    name="Password"
                    required
                    hideLabel
                    values={props.values}
                    errors={props.errors}
                    onHandleChange={props.handleChange.bind(this)}
                />
                <Container className={classes.container}>
                    <Box className={classes.button} >
                        <MyButton
                            buttonText="Register User"
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
                            I am Registered
                    </a>
                    </Box>
                </Box>
            </form>
        </FormLayoutFixed>
    );
}

export const RegisterUserForm = withFormik<FormProps, RegisterUserFields>({
    enableReinitialize: true,
    mapPropsToValues: () => ({
        name: '',
        password: '',
    }),
    handleSubmit: (values, { props, setSubmitting }) => {
        props.onSubmit(values);
        setSubmitting(false);
    },
})(InnerForm);

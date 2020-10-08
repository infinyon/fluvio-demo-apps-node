import * as React from 'react';
import { InjectedFormikProps, withFormik } from 'formik';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { FormLayoutFixed } from '../components/FormLayoutFixed';
import { MyTextField } from '../components/MyTextField';
import MyPassword from '../components/MyPassword';
import MyButton from '../components/MyButton';
import Typography from '@material-ui/core/Typography';
import PasswordKey from '@material-ui/icons/VpnKey';
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
    }),
);

export interface ResetPassFields {
    name: string;
    password: string;
}

interface FormProps {
    name?: string;
    password?: string;

    onSubmit: (user: ResetPassFields) => void;
}

const InnerForm: React.FC<InjectedFormikProps<FormProps, ResetPassFields>> = (
    props,
) => {
    const classes = useStyles();

    return (
        <FormLayoutFixed>
            <form onSubmit={props.handleSubmit} className={classes.form}>
                <Box className={classes.title}>
                    <Typography className={classes.titleFont} color='textSecondary'>
                        <PasswordKey className={classes.logo} />
                        Update Password
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
                            buttonText="Update Password"
                            variant="contained"
                            type="submit"
                            disabled={props.isSubmitting} />
                    </Box>
                </Container>
            </form>
        </FormLayoutFixed>
    );
}

export const ResetPassForm = withFormik<FormProps, ResetPassFields>({
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

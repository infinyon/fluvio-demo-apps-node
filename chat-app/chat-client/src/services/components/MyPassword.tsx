import * as React from 'react';
import { Theme, createStyles, withStyles } from '@material-ui/core/styles';
import { InputAdornment } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const styles = (theme: Theme) => createStyles({
    eye: {
        cursor: 'pointer',
        color: '#888',
    },
    textField: {
        [theme.breakpoints.down('xs')]: {
            width: 300,
        },
        width: 380,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
        marginLeft: 10,
        marginRight: 10,
    },
    textInput: {
        padding: theme.spacing(2),
    }
});

interface Props {
    classes: any,
    id: string;
    name: string;
    values: any;
    errors: any;
    required?: boolean;
    disabled?: boolean;
    multiline?: boolean;
    hideLabel?: boolean;
    onHandleChange: () => void;
}

interface State {
    passwordIsMasked: boolean,
}

class MyPassword extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
            passwordIsMasked: true,
        };
    }

    togglePasswordMask = () => {
        this.setState(prevState => ({
            passwordIsMasked: !prevState.passwordIsMasked,
        }));
    };

    render() {
        const { classes } = this.props;
        const { passwordIsMasked } = this.state;
        const {
            id,
            required,
            disabled,
            hideLabel,
            name,
            onHandleChange,
            values,
            errors,
        } = this.props;

        return (
            <TextField
                required={required || false}
                disabled={disabled}
                type={passwordIsMasked ? 'password' : 'text'}
                id={id}
                autoComplete={id}
                variant="outlined"
                label={hideLabel ? undefined : name}
                placeholder={name}
                onChange={onHandleChange}
                value={values[id]}
                helperText={errors[id]}
                error={Boolean(errors[id])}
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {passwordIsMasked ?
                                <VisibilityOff
                                    className={classes.eye}
                                    onClick={this.togglePasswordMask}
                                />
                                :
                                <Visibility
                                    className={classes.eye}
                                    onClick={this.togglePasswordMask}
                                />
                            }
                        </InputAdornment>
                    ),
                    classes: {
                        input: classes.textInput
                    },
                }}

            />
        );
    }
}

export default withStyles(styles)(MyPassword);

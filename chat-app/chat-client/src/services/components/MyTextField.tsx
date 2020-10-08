import * as React from 'react';
import { Theme, createStyles, makeStyles, useTheme, } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            [theme.breakpoints.down('xs')]: {
                width: 300,
            },
            width: 380,
            marginLeft: 10,
            marginRight: 10,
        },
        textInput: {
            padding: theme.spacing(2),
        }
    })
);

interface Props {
    id: string;
    type?: string;
    required?: boolean;
    disabled?: boolean;
    multiline?: boolean;
    hideLabel?: boolean;
    name: string;
    values: any;
    errors: any;
    onHandleChange: () => void;
}

export const MyTextField: React.FC<Props> = ({
    id,
    type,
    required,
    disabled,
    multiline,
    hideLabel,
    name,
    values,
    errors,
    onHandleChange,
}) => {
    const classes = styles(useTheme());

    return (
        <TextField
            required={required || false}
            disabled={disabled}
            type={type || "text"}
            multiline={multiline}
            rowsMax={multiline ? 4 : 1}
            variant="outlined"
            margin="normal"
            id={id}
            autoComplete={id}
            label={hideLabel ? undefined : name}
            placeholder={name}
            onChange={onHandleChange}
            value={values[id]}
            helperText={errors[id]}
            error={Boolean(errors[id])}
            className={classes.textField}
            InputProps={{ classes: { input: classes.textInput } }}
            InputLabelProps={{
                shrink: true,
            }}
        />
    );
}

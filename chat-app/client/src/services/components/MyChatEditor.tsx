import * as React from 'react';
import { createStyles, makeStyles, useTheme, } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = makeStyles(() =>
    createStyles({
        textField: {
            width: `calc(100% - 22px)`,
            marginLeft: 10,
            marginRight: 10,
        },
        textInput: {
            padding: 12,
        },
        notchedOutline: {
            borderWidth: 1,
            borderColor: "#333",
            '&:hover': {
                borderColor: '#333',
                borderWidth: 1
            }
        },
        cssOutlinedInput: {
            '&$cssFocused $notchedOutline': {
                borderColor: '#333',
                borderWidth: 1
            }
        },
        cssFocused: {}
    })
);

interface Props {
    id: string;
    placeholder?: string;
    handleKeyPress: any;
}

export const MyChatEditor = (props: Props) => {
    const { id, placeholder, handleKeyPress } = props;
    const classes = styles(useTheme());

    return (
        <TextField
            variant="outlined"
            margin="normal"
            id={id}
            autoComplete='off'
            placeholder={placeholder}
            className={classes.textField}
            onKeyPress={handleKeyPress}
            InputLabelProps={{
                shrink: true,
            }}
            InputProps={{
                classes: {
                    input: classes.textInput,
                    root: classes.cssOutlinedInput,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline
                }
            }}
        />
    );
}

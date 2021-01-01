import * as React from 'react';
import { Theme, createStyles, withStyles, StyleRules, WithStyles } from '@material-ui/core/styles';
import { ButtonProps } from '@material-ui/core/Button';
import Button from '@material-ui/core/Button';

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        root: {
            margin: theme.spacing(1),
            background: 'linear-gradient(45deg, #535a65 50%, #535a65 50%)',
            color: 'white',
            [theme.breakpoints.down('xs')]: {
                width: 300,
            },
            width: 380,
            height: 48,
            fontSize: 17,
        }
    });

interface OwnProps {
    buttonText: string;
}

type PublicProps = OwnProps & ButtonProps;
type Props = PublicProps & WithStyles<typeof styles>;

/*
 * Usage:
 *  <MyButton buttonText="Hello World" variant="contained" />
 */
const MyButton: React.FC<Props> = ({ classes, buttonText, ...rest }) => {
    return (
        <Button {...rest} className={classes.root} >
            {buttonText}
        </Button >);
};
export default withStyles(styles)(MyButton) as React.ComponentType<PublicProps>;
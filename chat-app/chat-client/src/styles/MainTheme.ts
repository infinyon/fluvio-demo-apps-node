import { createMuiTheme } from '@material-ui/core/styles';

export const mainTheme = createMuiTheme({
    props: {
        MuiButtonBase: {
            disableRipple: true,
        },
    },
    palette: {
        primary: {
            main: '#29323f',
        },
        secondary: {
            main: '#8bf7ff',
        },
        background: {
            default: 'white',
        }
    },
    overrides: {
        MuiAppBar: {
            root: {
                'box-shadow': 'none',
            }
        },
        MuiContainer: {
            root: {
                disableGutters: true,
            }
        },
        MuiTypography: {
            h4: {
                fontSize: 26,
            },
            h5: {
                fontSize: 22,
            },
            h6: {
                fontSize: 18,
            },
        },
        MuiListItem: {
            dense: {
                paddingTop: 0,
                paddingBottom: 0,
            }
        },
    }
});
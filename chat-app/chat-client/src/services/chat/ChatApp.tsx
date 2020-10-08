import * as React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { RouteComponentProps } from 'react-router-dom';
import { CSSProperties } from '@material-ui/styles'
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChatViewWrapper from './ChatViewWrapper';
import UserHeaderBox from './UserHeaderBox';
import UsersView from './UsersView';
import { UserContextProvider } from './context/UserContext';

import {
    toolbarHeight,
    bkChatColor,
    otherColor,
    drawerWidth,
    navBkColor,
} from '../config/Constants';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        grow: {
            flexGrow: 1,
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
            },
        },
        drawerPaper: {
            width: drawerWidth,
            background: navBkColor,
        },
        appBar: {
            [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: drawerWidth,
            },
        },
        content: {
            flexGrow: 1,
            background: bkChatColor,
            [theme.breakpoints.up('sm')]: {
                flexGrow: 0,
                width: `calc(100% - ${drawerWidth}px)`
            }
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        },
        usersButton: {
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },
        toolbar: theme.mixins.toolbar as CSSProperties,
        customToolbar: {
            height: toolbarHeight,
        },
        hashTag: {
            color: otherColor,
            paddingRight: 5,
            fontSize: '2.5em',
        },
        iconSize: {
            fontSize: 38,
            color: otherColor,
        },
    }),
);

export default function ChatApp(props: RouteComponentProps) {
    const classes = useStyles();
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [userEl, setUserEl] = React.useState<null | HTMLElement>(null);
    const isUserMenuOpen = Boolean(userEl);
    const menuId = 'account-menu';

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setUserEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserEl(null);
    };

    const handleLogout = () => {
        props.history.push('/logout');
        handleUserMenuClose();
    }

    const handleUnregister = () => {
        props.history.push('/unregister');
        handleUserMenuClose();
    }

    const renderAppBar = (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    className={classes.menuButton}
                >
                    <MenuIcon />
                </IconButton>
                <Typography className={classes.hashTag} variant="h4">#</Typography>
                <Typography color="secondary" variant="h4">default</Typography>
                <div className={classes.grow} />
                <IconButton
                    edge="end"
                    aria-label="account"
                    aria-haspopup="true"
                    aria-controls={menuId}
                    color="inherit"
                    onClick={handleUserMenuOpen}
                >
                    <AccountCircle className={classes.iconSize} />
                </IconButton>
            </Toolbar>
        </AppBar >
    );

    const renderUserMenu = (
        <Menu
            anchorEl={userEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isUserMenuOpen}
            onClose={handleUserMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
            <Divider />
            <MenuItem onClick={handleUnregister}>Unregister</MenuItem>
        </Menu>
    );

    const renderDrawer = (
        <nav className={classes.drawer} aria-label="folders">
            <Hidden smUp implementation="css">
                <Drawer
                    variant="temporary"
                    anchor="left"
                    open={drawerOpen}
                    onClose={handleDrawerToggle}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    <div className={classes.customToolbar}>
                        <UserHeaderBox />
                        <UsersView />
                    </div >
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                >
                    <div className={classes.customToolbar}>
                        <UserHeaderBox />
                        <UsersView />
                    </div >
                </Drawer>
            </Hidden>
        </nav>
    );

    const renderContent = (
        <div className={classes.content}>
            <div className={classes.customToolbar} />
            <ChatViewWrapper />
        </div>
    );

    return (
        <UserContextProvider>
            <div className={classes.root}>
                {renderAppBar}
                {renderUserMenu}
                {renderDrawer}
                {renderContent}
            </div >
        </UserContextProvider>
    );
}

import { checkToken } from '../../middleware/checkToken';
import {
    validateUserName,
    validatePassword,
} from "./apiValidator";
import {
    registerUser,
    getUsers,
    loginUser,
    logoutUser,
    resetPassword,
    unregisterUser,
} from "./apiController";

// header:
// body:
//  name
//  password
const registerUserRoute = {
    path: "/api/v1/register",
    method: "post",
    handler: [
        validateUserName,
        validatePassword,
        registerUser,
    ]
};

// header:
// body:
//  name
//  password
const loginUserRoute = {
    path: "/api/v1/login",
    method: "post",
    handler: [
        validateUserName,
        validatePassword,
        loginUser,
    ]
};

// header:
// body:
//  name
//  password
const resetPasswordRoute = {
    path: "/api/v1/resetPassword",
    method: "post",
    handler: [
        validateUserName,
        validatePassword,
        resetPassword,
    ]
};

// logout:
//  token
// body:
const logoutUserRoute = {
    path: "/api/v1/logout",
    method: "post",
    handler: [
        checkToken,
        logoutUser,
    ]
};

// header:
//  token
// body:
const unregisterUserRoute = {
    path: "/api/v1/unregister",
    method: "post",
    handler: [
        checkToken,
        unregisterUser,
    ]
};

// logout:
//  token
// body:
const getUsersRoute = {
    path: "/api/v1/getUsers",
    method: "get",
    handler: [
        checkToken,
        getUsers,
    ]
};

export default [
    registerUserRoute,
    loginUserRoute,
    logoutUserRoute,
    resetPasswordRoute,
    unregisterUserRoute,
    getUsersRoute,
];
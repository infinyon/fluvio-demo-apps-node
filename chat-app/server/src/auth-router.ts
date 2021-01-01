import crypto from 'crypto';
import { TopicProducer } from "@fluvio/client";
import { Router, Request, Response } from "express";
import { UserController } from "./user-controller";
import {
    buildAddUser,
    buildRemoveUser,
    buildFluvioAddToken,
    buildFluvioRemoveToken
} from "./user-messages";

const TOKEN_COOKIE = "Fluvio-Simple-Chat-Token";
const MAX_AGE = 365 * 24 * 60 * 60 * 1000;  // 1 year

export class AuthRouter {
    private userProducer: TopicProducer;

    constructor(userProducer: TopicProducer) {
        this.userProducer = userProducer;
    }

    public init(userController: UserController) {
        const authRouter = Router();

        authRouter.post('/api/register', async ({ body }: Request, res: Response) => {
            console.log(`Register: "${body.user}"`);

            const userName = body.user;
            if (!userName) {
                return res.status(400).send("invalid user name");
            }

            if (userController.getUser(userName)) {
                return res.status(404).send("user already exists");
            }

            const user = userController.newUser(userName);
            const fluvioMessage = buildAddUser(user);
            await this.userProducer.sendRecord(JSON.stringify(fluvioMessage), 0);

            res.cookie(TOKEN_COOKIE, "", { maxAge: MAX_AGE, httpOnly: true });

            return res.status(200).send("ok");
        });

        authRouter.post('/api/unregister', async ({ cookies }: Request, res: Response) => {
            console.log(`Unregister: "${JSON.stringify(cookies)}"`);

            const cookie = cookies[TOKEN_COOKIE];
            if (typeof cookie === "undefined" || cookie.length == 0) {
                return res.status(400).send("login to unregister");
            }

            const [userName] = cookie.split(",");
            const user = userController.getUser(userName);
            if (!user) {
                return res.status(400).send("user not found");
            }

            const fluvioMessage = buildRemoveUser(user);
            await this.userProducer.sendRecord(JSON.stringify(fluvioMessage), 0);

            return res.status(200).send("ok");
        });

        authRouter.post('/api/login', async ({ body, cookies }: Request, res: Response) => {
            console.log(`Login: "${body.user}" - ${JSON.stringify(cookies)}`);

            const userName = body.user || "";
            const user = userController.getUser(userName)
            if (!user) {
                return res.status(400).send("user not found");
            }

            const cookie = cookies[TOKEN_COOKIE];
            if (typeof cookie !== "undefined" && cookie.length > 0) {
                const [userName] = cookie.split(",");
                const tokenUser = userController.getUser(userName);
                if (tokenUser) {
                    return res.status(400).send("user already logged in");
                }
            }

            const token = crypto.randomBytes(20).toString("hex");
            const fluvioMessage = buildFluvioAddToken(user.user, token);
            await this.userProducer.sendRecord(JSON.stringify(fluvioMessage), 0);

            const setCookie = `${user.user},${token}`;
            res.cookie(TOKEN_COOKIE, setCookie, { maxAge: MAX_AGE, httpOnly: true });
            res.status(200).send("ok");
        });

        authRouter.post('/api/logout', async ({ cookies }: Request, res: Response) => {
            console.log(`Logout: ${JSON.stringify(cookies)}`);

            const cookie = cookies[TOKEN_COOKIE];
            if (typeof cookie === "undefined" || cookie.length == 0) {
                return res.status(400).send("already logged out");
            }

            const [userName, token] = cookie.split(",");
            const fluvioMessage = buildFluvioRemoveToken(userName, token);
            await this.userProducer.sendRecord(JSON.stringify(fluvioMessage), 0);

            res.cookie(TOKEN_COOKIE, "", { maxAge: MAX_AGE, httpOnly: true });
            return res.status(200).send("ok");
        });

        return authRouter;
    }
}
import BaseController from '../../common/BaseController';
import { Request, Response } from "express";
import { IUserLogin, IUserLoginValidator } from './dto/IUserLogin';
import ITokenData from './dto/ITokenData.interface';
import * as jwt from "jsonwebtoken";
import Config from '../../config/dev';
import { IRefreshToken, IRefreshTokenValidator } from './dto/IRefreshToken';
import * as bcrypt from 'bcrypt';

export default class AuthController extends BaseController {
    public async userLogin(req: Request, res: Response) {
        if (!IUserLoginValidator(req.body)) {
            return res.status(400).send(IUserLoginValidator.errors);
        }

        const data = req.body as IUserLogin;

        const user = await this.services.userService.getByUsername(data.username);
        if (user === null) return res.sendStatus(404);        

        if (!bcrypt.compareSync(data.password, user.passwordHash)) {
            // Anti-brute-force mera: sacekati 1s pre slanja odgovora da lozinka nije dobra
            await new Promise(resolve => setTimeout(resolve, 1000));
            return res.status(403).send("Invalid user password.");
        }

        const authTokenData: ITokenData = {
            id: user.userId,
            identity: user.username,
            role: "user",
        };

        const refreshTokenData: ITokenData = {
            id: user.userId,
            identity: user.username,
            role: "user",
        };

        const authToken = jwt.sign(
            authTokenData,
            Config.auth.user.auth.private,
            {
                algorithm: Config.auth.user.algorithm,
                issuer: Config.auth.user.issuer,
                expiresIn: Config.auth.user.auth.duration,
            },
        );

        const refreshToken = jwt.sign(
            refreshTokenData,
            Config.auth.user.refresh.private,
            {
                algorithm: Config.auth.user.algorithm,
                issuer: Config.auth.user.issuer,
                expiresIn: Config.auth.user.refresh.duration,
            },
        );

        res.send({
            authToken: authToken,
            refreshToken: refreshToken,
        });
    }

    

    async userRefresh(req: Request, res: Response) {
        this.refreshTokenByRole("user")(req, res);
    }

   

    private refreshTokenByRole(role: "user" ): (req: Request, res: Response) => void {
        return (req: Request, res: Response) => {
            if (!IRefreshTokenValidator(req.body)) {
                return res.status(400).send(IRefreshTokenValidator.errors);
            }
    
            const tokenString: string = (req.body as IRefreshToken).refreshToken;
    
            try {
                const existingData = jwt.verify(tokenString, Config.auth[role].auth.public) as ITokenData;
    
                const newTokenData: ITokenData = {
                    id: existingData.id,
                    identity: existingData.identity,
                    role: existingData.role,
                }

                const authToken = jwt.sign(
                    newTokenData,
                    Config.auth[role].auth.private,
                    {
                        algorithm: Config.auth[role].algorithm,
                        issuer: Config.auth[role].issuer,
                        expiresIn: Config.auth[role].auth.duration,
                    },
                );
    
                res.send({
                    authToken: authToken,
                    refreshToken: null,
                });
            } catch (e) {
                return res.status(400).send("Invalid refresh token: " + e?.message);
            }
        }
    }

    public sendOk(req: Request, res: Response) {
        res.send("OK");
    }
}
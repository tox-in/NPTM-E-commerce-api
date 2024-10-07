import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from 'bcrypt';
import { JWT_SECRET } from "../secrets";
import * as jwt from 'jsonwebtoken';
import { BadRequestsException } from "../exceptions/bad-requests";
import { errorCode } from "../exceptions/root";
import { SignUpSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/notFound";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
        SignUpSchema.parse(req.body);
        const { email, password, name } = req.body;

    let user = await prismaClient.user.findFirst({where: {email}})
    if(user) {
        new BadRequestsException('User Already exists!', errorCode.USER_ALREADY_EXISTS)
    }
    user = await prismaClient.user.create({
        data: {
            name,
            email,
            password: hashSync(password, 10)
        }
    })
    res.json(user)
}

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    let user = await prismaClient.user.findFirst({where: {email}})
    if(!user) {
        throw new NotFoundException("User not found", errorCode.USER_NOT_FOUND)
    }
    if(!compareSync(password, user.password)) {
        throw new BadRequestsException("Incorrect password",errorCode.INCORRECT_PASSWORD)
    }

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    res.json({user,token})
}
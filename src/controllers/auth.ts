import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from 'bcrypt';
import { JWT_SECRET } from "../secrets";
import * as jwt from 'jsonwebtoken';
import { BadRequestsException } from "../exceptions/bad-requests";
import { errorCode } from "../exceptions/root";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body;

    let user = await prismaClient.user.findFirst({where: {email}})
    if(user) {
        next(new BadRequestsException('User Already exists!', errorCode.USER_ALREADY_EXISTS))
    }
    user = await prismaClient.user.create({
        data: {
            name,
            email,
            password: hashSync(password, 10)
        }
    })
    res.json(user)
    } catch (error) {
        
    }
}

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    let user = await prismaClient.user.findFirst({where: {email}})
    if(!user) {
        throw Error('User is not registered')
    }
    if(!compareSync(password, user.password)) {
        throw Error("One of the credentials is incorrect!")
    }

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    res.json({user,token})
}
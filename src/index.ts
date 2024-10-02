import express, {Express, Request, Response} from 'express';
import { PORT } from './secrets';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errors';
import { SignUpSchema } from './schema/users';

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
    log:['query']
}).$extends({
    query: {
        user: {
            create({args,  query}) {
                args.data = SignUpSchema.parse(args.data)
                return query(args)
            }
        }
    }
})

app.use(errorMiddleware)

app.listen(PORT, () => {console.log(`App running on http://localhost:${PORT}`);
})
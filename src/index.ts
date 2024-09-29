import express, {Express, Request, Response} from 'express';
import { PORT } from './secrets';

const app = express();

app.get('/', (req:Request, res: Response) => {
    res.send('Working')
})

app.listen(PORT, () => {console.log(`App running on http://localhost:${PORT}`);
})
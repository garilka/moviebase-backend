import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port: number = 4001;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

import express from 'express';
import cors from 'cors';
import fileRouter from './routes/file.js';
import userRouter from './routes/user.js';
import projectRouter from './routes/project.js';
import taskRouter from './routes/task.js';
import reportRoutes from './routes/report.js';
import teamRoutes from './routes/team.js';


const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/file', fileRouter);
app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);
app.use('/api/task',taskRouter);
app.use('/api/report', reportRoutes);
app.use('/api/team',teamRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

export default app;

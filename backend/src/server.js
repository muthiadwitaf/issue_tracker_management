require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRouter = require('./routes/auth');
const projectsRouter = require('./routes/projects');
const issuesRouter = require('./routes/issues');
const usersRouter = require('./routes/users');
const dashboardRouter = require('./routes/dashboard');
const labelsRouter = require('./routes/labels');
const notificationsRouter = require('./routes/notifications');
const searchRouter = require('./routes/search');
const { uploadsDir } = require('./middleware/upload');
const auth = require('./middleware/auth');

const app = express();

// Vite auto-increments the dev server port (5173, 5174, ...) whenever the default
// is already taken, which used to get silently blocked by CORS. Allow any
// localhost/127.0.0.1 port in dev; set CORS_ORIGIN explicitly to lock this down.
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;

app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRouter);

app.use('/api/projects', auth, projectsRouter);
app.use('/api/issues', auth, issuesRouter);
app.use('/api/users', auth, usersRouter);
app.use('/api/dashboard', auth, dashboardRouter);
app.use('/api/labels', auth, labelsRouter);
app.use('/api/notifications', auth, notificationsRouter);
app.use('/api/search', auth, searchRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Issue tracker API listening on http://localhost:${port}`);
});

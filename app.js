const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config()
const config = require('./config/config');
const { sequelize } = require('./models');
global.__basedir = __dirname + "/";

// Setting the directory where the template files are located
app.use('/uploads', express.static('uploads')).set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'technogazwersecret', // Use environment variable for session secret
  resave: false,
  saveUninitialized: false,
}));

// Routers (Assuming these are your router definitions)
const UsersRouter = require('./routers/UsersRouter');
const AuthRouter = require('./routers/AuthRouter');
const SaleTeamRouter = require('./routers/SaleTeamRouter');
const TelecallerTeamRouter = require('./routers/TelecallerTeamRouter');
const RoleRouter = require('./routers/RoleRouter');
const UserPermissionDepartmentRouter = require('./routers/UserPermissionRouter');
const FrontdeskRouter = require('./routers/FrontDeskRouter');
const CoursesRouter = require('./routers/CoursesRouter');
const CounselorDepartmentRouter = require('./routers/CounselorDepartmentRouter');
const TeachersRouter = require('./routers/TeachersRouter');
const StudentsRouter = require('./routers/StudentsRouter');
const BatchRouter = require('./routers/BatchRouter');
const QuizzeRouter = require('./routers/QuizzeRouter');
const CategoriesRouter = require('./routers/CategoriesRouter');
const TopicRouter = require('./routers/TopicRouter');
const LessionRouter = require('./routers/LessionRouter');
const VideoRouter = require('./routers/VideoRouter');
const QuestionsRouter = require('./routers/QuestionsRouter');
const QuestionCategoriesRouter = require('./routers/QuestionCategoriesRouter');
const StutenetQuizeRouter = require('./routers/StutenetQuizeRouter');
// Serve static files from public folder
app.use(express.static('public'));

// Use routers
app.use('/api', UsersRouter);
app.use('/api', AuthRouter);
app.use('/api', SaleTeamRouter);
app.use('/api', TelecallerTeamRouter);
app.use('/api', RoleRouter);
app.use('/api', UserPermissionDepartmentRouter);
app.use('/api', CoursesRouter);
app.use('/api', FrontdeskRouter);
app.use('/api', CounselorDepartmentRouter);
app.use('/api', TeachersRouter);
app.use('/api', StudentsRouter);
app.use('/api', BatchRouter);
app.use('/api', QuizzeRouter);
app.use('/api', CategoriesRouter);
app.use('/api', TopicRouter);
app.use('/api', LessionRouter);
app.use('/api', VideoRouter);
app.use('/api', QuestionsRouter);
app.use('/api', QuestionCategoriesRouter);
app.use('/api', StutenetQuizeRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the API'); // Replace with your desired response
});


const PORT = process.env.PORT || 8080;  // Use environment variable for port or default to 8080
const HOST = process.env.HOST || '0.0.0.0';  // Use environment variable for host or default to '0.0.0.0'

// Starting a server
app.listen(PORT, HOST, async () => {
  console.log(`App listening at http://${HOST}:${PORT}`);
  try {
    await sequelize.sync(); // Ensure database is synced
    console.log('DATABASE SYNCED!',process.env.NODE_ENV);
  } catch (error) {
    console.error('Error syncing database:', error);
  }
});

module.exports = app;

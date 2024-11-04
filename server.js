const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATABASE_FILE = path.join(__dirname, 'database.bat');

// load the initial data from the .bat file.
function readData() {
  if (!fs.existsSync(DATABASE_FILE)) {
    return { calculator: [], notes: [], todolist: [], routeStatus: {} };
  }
  const fileContent = fs.readFileSync(DATABASE_FILE, 'utf8');
  const dataMatch = fileContent.match(/DATA="(.*)"/);
  return dataMatch ? JSON.parse(dataMatch[1] || '{}') : {};
}

// write the data back to the .bat file.
function writeData(data) {
  const fileContent = `@echo off\nSET DATA="${JSON.stringify(data)}"`;
  fs.writeFileSync(DATABASE_FILE, fileContent, 'utf8');
}

// use middleware to check if a route is active.
const checkRouteActive = (routeName) => (req, res, next) => {
  const data = readData();
  if (!data.routeStatus || !data.routeStatus[routeName]) {
    return res.status(403).json({ error: `${routeName} is currently disabled` });
  }
  next();
};

// initialize the data and the statuses of the routes.
const initializeRoutes = () => {
  const data = readData();
  if (!data.routeStatus) {
    data.routeStatus = {
      calculator: true,
      notes: true,
      todolist: true,
    };
    writeData(data);
  }
};

// create a route to get the status of all routes.
app.get('/api/status', (req, res) => {
  const data = readData();
  res.json(data.routeStatus || {});
});

//set up a route to toggle the status of a route.
app.post('/api/toggle', (req, res) => {
  const { route, status } = req.body;
  const data = readData();
  if (data.routeStatus.hasOwnProperty(route)) {
    data.routeStatus[route] = status;
    writeData(data);
    res.json({ success: true, status: data.routeStatus });
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

// include existing routes along with the route check middleware and a message.
app.get('/api/calculator', checkRouteActive('calculator'), (req, res) => {
  const data = readData();
  res.json({
    message: "This is the calculator API, which handles calculator entries.",
    data: data.calculator
  });
});

app.get('/api/notes', checkRouteActive('notes'), (req, res) => {
  const data = readData();
  res.json({
    message: "This is the notes API, which manages notes.",
    data: data.notes
  });
});

app.get('/api/todolist', checkRouteActive('todolist'), (req, res) => {
  const data = readData();
  res.json({
    message: "This is the todolist API, which manages your tasks.",
    data: data.todolist
  });
});

// initialize the route statuses when the server starts up
initializeRoutes();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

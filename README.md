# Express Bat Storage API

This project is an Express.js application that uses a `.bat` file for data storage. It provides APIs for managing calculators, notes, and todo lists, along with the ability to toggle the status of these routes.

## Features
- Simple API routes for managing:
  - Calculator entries
  - Notes
  - Todo lists
- Route status management via a `.bat` file

## Getting Started

1. Clone the repository:
bash
   git clone https://github.com/kaviraj-m/express-api-with-bat-storage
   
2. Navigate to the project directory:
bash
   cd Express-Bat-Storage-API
   
3. Install dependencies:
bash
   npm install
   
4. Run the server:
bash
   node server.js
   
## Usage

The `.bat` file (`database.bat`) is used to store the data in a simple format, allowing for easy access and modification. Ensure the file is present in the project directory.

## API Endpoints
- `GET /api/calculator`
- `GET /api/notes`
- `GET /api/todolist`
- `GET /api/status`
- `POST /api/toggle`

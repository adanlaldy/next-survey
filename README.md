# Survey System with MongoDB

## Project Overview

This project is a survey system that allows users to create, manage, and respond to surveys. The backend is built with
Node.js and Express, while the frontend is developed using Next.js with TypeScript. MongoDB is used as the database for
storing surveys and responses.

## Requirements

This project is based on the following requirements:

- Survey creation, modification, deletion, and updating.
- Users can respond to surveys.
- Responses are stored in MongoDB and linked to surveys.
- Users can view published surveys and see responses from others.
- Authentication ensures that only survey creators can modify or delete their surveys.

For the original project requirements, refer to the 
[Project Guidelines](https://github.com/MadzMed/mongodb-exercices/blob/master/TP/TP_web_application.md).

## Technologies Used

### Frontend:

- **Next.js** (React Framework)
- **TypeScript**
- **Tailwind CSS** (for styling)

### Backend:

- **Node.js**
- **Express.js**
- **MongoDB** (Mongoose for schema modeling)

## Installation

### Prerequisites:

- Node.js installed
- MongoDB instance running

### Backend Setup:

1. Clone the repository and enable submodule:
   ```bash
   git clone https://github.com/adanlaldy/next-survey.git
   git submodule init
   git submodule update
   cd next-survey/api-next-survey
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   ```
4. Start the server:
   ```bash
   npx nodemon server.js 
   ```
### Frontend Setup:
1. Navigate to the frontend directory and install dependencies:
   ```bash
   cd ..
   npm install
   ```
2. Start the Next.js app:
   ```bash
   npm run dev 
   ```
### Database Seeding

To populate the database with test data, you can use the provided seeding script. Follow these steps:

1. Ensure your MongoDB server is running and the connection string is correctly set in the .env file.

2. Run the following command from the root of the backend directory:
    ```bash
    npx nodemon seed/seed.js
   ```
   
    This will execute the seeding script and populate the database with sample surveys, users, and responses.

## API Endpoints
### Surveys

    GET /api/surveys - Retrieve all surveys

    GET /api/surveys/:id - Get a single survey

    POST /api/surveys - Create a new survey

    PUT /api/surveys/:id - Update a survey

    DELETE /api/surveys/:id - Delete a survey

### Responses

    POST /api/answers - Submit answers to a survey

    GET /api/answers/:survey_id - Retrieve responses for a survey

### Users

    GET /api/users/:id - Retrieve user by ID

    POST /api/users/register - Register a new user

    POST /api/users/login - Login a user

## Features

- Create Surveys: Users can create surveys with open-ended or multiple-choice questions.

- Manage Surveys: Surveys can be edited or deleted by their creators.

- Respond to Surveys: Users can submit responses which are saved in MongoDB.

- View Responses: Responses are accessible to view results.

## Future Enhancements

- Add user authentication with JWT.
 
- Enhance UI/UX with animations and better state management.

- Export survey results as CSV or JSON.
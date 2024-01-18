# learn-english-app

## Overview

Learn English is an application with the purpose of making learning english or finnish easy.
The enduser can try to correctly translate each word from finnish to english or vice versa.
Scores are saved into the databse for the enduser to track down their progress.

The application runs with a database from where it gets its data for the words and scores.
This application also provides the opportunity for the enduser to create more words, delete or edit the existing words.

## Project Structure

The whole application is split into two pieces -> frontend and backend.
Frontend handles the overall style and implementation of the application.
Backend handles the calls that the frontend makes to the database.

```plaintext
project-root
|-- frontend
|   |-- src
|   |   |-- pages
|   |   |   |-- all the different components ->
|   |   |-- App.jsx
|   |   |-- main.jsx
|-- backend
|   |-- src
|   |   |-- database
|   |   |   |-- all the necessary functions for database ->
|   |   |-- routes
|   |   |   |-- words-router
<   |   |   |-- scores-router
|   |   |-- index.js
|-- docs
```

## Installation

First download the repository to your computer.

After that you can then simply install the app and run it with these commands

Install dependencies:

```plaintext
npm run install-all
```

Run the app:

```plaintext
npm run start
```

Or if you want to run frontend and backend separately:

```plaintext
npm run start-frontend
npm run start-backend
```

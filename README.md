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

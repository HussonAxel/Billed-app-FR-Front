
# Billed App Setup Guide

This document summarizes the setup process for the Billed app, including both frontend and backend components.

## Project Architecture

The project is split into a frontend part, which is connected to a backend API service. Both need to be launched locally for the application to work correctly.

### Backend Repository
- URL: [Billed-app-FR-Back](https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-back)

### Frontend Repository
- URL: [Billed-app-FR-Front](https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Front.git)

## Workspace Organization

It's recommended to create a root directory named `bill-app` and clone both projects inside this directory as follows:

1. **Clone the Backend**
   ```
   git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Back.git
   ```

2. **Clone the Frontend**
   ```
   git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Front.git
   ```

Directory structure should be:
```
bill-app/
   - Billed-app-FR-Back
   - Billed-app-FR-Front
```

## Launching the Application Locally

### Step 1: Launch the Backend

- Follow the README instructions in the backend project repository.

### Step 2: Launch the Frontend

- Navigate to the cloned frontend repo:
  ```
  cd Billed-app-FR-Front
  ```
- Install npm packages:
  ```
  npm install
  ```
- Install live-server:
  ```
  npm install -g live-server
  ```
- Launch the application:
  ```
  live-server
  ```
- Access the application at http://127.0.0.1:8080/

## Running Tests Locally with Jest

- To run all tests:
  ```
  npm run test
  ```
- To run a single test:
  ```
  npm i -g jest-cli
  jest src/__tests__/your_test_file.js
  ```
- Test coverage can be viewed at http://127.0.0.1:8080/coverage/lcov-report/

## Accounts and Users

- **Administrator**:
  - Username: admin@test.tld
  - Password: admin
- **Employee**:
  - Username: employee@test.tld
  - Password: employee

## Backend Setup

### Running the API Locally

- Clone the project and ensure you are using a compatible Node version (e.g., v16 or v18). Instructions for managing Node versions on Windows and Mac are provided, including the use of NVM.

### Accessing the API

- The API is accessible locally on port 5678 (http://localhost:5678).

# Toothless

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Fast and Extensible Build System**

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/getting-started/intro)

[Mental model is a good starting point for those who like to understand things theoretically first.](https://nx.dev/concepts/mental-model)

[Interactive Tutorial](https://nx.dev/getting-started/angular-tutorial)

## How to run app locally

- Make sure you have installed docker on your machine
- Run `docker-compose up`
- Angular app will be running on http://localhost:4200/ and api will be running on http://localhost:3333/api

---

## What is done ?

USER STORY 1: Upload Users ✅

- User should able to upload single csv file to `POST /api/users/upload`
- If more than one file or file is empty, api will throw an error.
- Using transaction thus all success or all failed, there will be no partial user created
- User document are being validated.

USER STORY 2: Employee Dashboard Feature ✅

- List user with pagination and filter capabilities
- User should able to sort (asc/desc) in any of the fields in the table and filter user by the salary

USER STORY 3: CRUD Feature ███████▒▒▒ 70%

- API for CURD operation is ready
- Haven't implement the in the frontend

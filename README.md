# CUMA (Course Unit Mapping Automation)

CUMA is a tool that helps course directors facilitate students' transition between universities and allows students to explore options for studying abroad by providing information on mapped/similar units between universities.



## Table of Contents

1. [CUMA Usage](#cuma-usage)
    - [Features](#features)
    - [How to access the CUMA website](#how-to-access-the-cuma-website)
2. [Development Team](#development-team)
3. [Development Guide](#development-guide)
    - [Setting up](#setting-up)
    - [How to run the server](#how-to-run-the-server)
    - [How to run the web](#how-to-run-the-web)
4. [Project Structure](#project-structure)
    - [Root Directory](#root-directory)
    - [cuma Directory](#cuma-directory)



## CUMA Usage

### Features
- Search for units within your course
- View a unit's information, including its mapped units from other universities
- Create your own (pending) unit mapping between a domestic unit and a foreign unit
- Send your pending unit mapping to a course director through email for approval
- Add, modify and delete a unit and its mapped units, if you are an authenticated course director


### How to access the CUMA website

Deployment is done using AWS. To access it, visit: https://cumamonash.xyz



## Development Team

**FIT3170 - Project 6**

| Member                 | Email                       |
| ---------------------- | --------------------------- |
| Zilei Chen             | zche0160@student.monash.edu |
| David Batonda          | dbat0014@student.monash.edu |
| Michael Sigal          | msig0003@student.monash.edu |
| Jasmine See            | jsee0012@student.monash.edu |
| Mark Song              | mson0024@student.monash.edu |
| Maddy Prazeus          | tpra0008@student.monash.edu |
| Mishal FAOA Alhaidar   | malh0009@student.monash.edu |
| Jamie Gary Harrison    | jhar0038@student.monash.edu |
| Changheng Li           | clii0078@student.monash.edu |
| Sean Heng Keh          | skeh0003@student.monash.edu |
| Melvin Pramode         | mpra0021@student.monash.edu |
| Tharith Yeak           | tyea0002@student.monash.edu |
| Cheuk Lam Winnie Chui  | cchu0061@student.monash.edu |
| Sok Huot Ear           | sear0002@student.monash.edu |
| Niroshan Sivaneeswaran | nsiv0005@student.monash.edu |


## Technical Requirements

- Node.js 12.x or higher
- NPM 6.x or higher
- Modern web browser with JavaScript enabled

## Development Guide

### Setting up

#### 1. Install Node.js and npm

https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

#### 2. Setup Local Repository and install dependencies.

Clone the repository: `git clone https://github.com/Monash-FIT3170/CUMA.git`

Open command prompt or terminal in the root directory (CUMA), and run the following command: `npm install`.

#### 3. Allow Database Access

Download the .env file and remove the `_`, then place into the root directory (CUMA).

https://drive.google.com/file/d/1e6VIRL7H7DyVEynzhhJdyUZeMOqH9g1s/view?usp=drive_link


### How to run the server

In the root directory (CUMA), run the following command: `npm run server`


### How to run the web

#### 1. Install Live Server

Install "Live Server" extension on VS Code

#### 2. Run the web

Navigate to `index.html`.
This file is located in `/cuma/front-end/index.html`

Open this html using Live Server.

The server runs the API and connects to mongoDB. Therefore, this command must be run first
before npm install can be queried.



## Project structure


### Root Directory

The root directory is defined to be in the same hierarchy as app.js and package.json.


### cuma Directory

`cuma` directory is separated as:

- `front-end`: contains the View and Controller. For example, `index.html` (view) will have a matching `index.js` file (for the controller logic).
- `back-end`: Contains the interaction with the API tier
- `api`: Contains the API logics, route handlers and the connection to the database.

This web is designed to be a three-tier application, where `front-end` makes a call to `backend`. `backend` will then make a fetch request to the API. The API is handled by `api` where it will query the database.

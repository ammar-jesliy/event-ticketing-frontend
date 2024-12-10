# **Real-Time Event Ticketing System - Frontend**

This is the frontend of the Real-Time Event Ticketing System, developed using Angular. It provides a user-friendly interface for customers, vendors, and administrators to interact with the system.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Development server](#development-server)
  - [Build](#build)
  - [Running unit tests](#running-unit-tests)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)
  - [Debugging Tips](#debugging-tips)
  - [Getting Help](#getting-help)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

---

## **Project Overview**

The frontend serves as the client-side application for the Real-Time Event Ticketing System. It enables:

- Customers to browse events, purchase tickets, and manage their profiles.
- Vendors to create ticket pools, release tickets, and view analytics.
- Administrators to monitor ticketing activities and manage events.

---

## **Features**

- Responsive and intuitive user interface.
- Separate dashboards for vendors, and administrators.
- Real-time updates for ticket availability.
- Integration with a backend API for data handling.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [Angular CLI](https://github.com/angular/angular-cli) (version 18.2.9)
- A running instance of the backend API ([Backend README](https://github.com/ammar-jesliy/event-ticketing-backend/blob/main/README.md))

---

## Getting Started

### Installation

Clone the repository:

```bash
git clone https://github.com/ammar-jesliy/event-ticketing-frontend.git
cd event-ticketing-frontend
```

Install the dependencies:

```bash
npm install
```

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

---

## **Folder Structure**

The following is the folder structure of the Angular frontend project:

```plaintext
├── public/                     # Public assets with image files
├── src/                        # Main source directory
│   ├── app/                    # Application-specific code
│   │   ├── components/         # Reusable UI components and page level components
│   │   ├── services/           # Services for API interactions and business logic
│   │   ├── util/               # Type models and interfaces
│   │   ├── app.component.css   # Styles for the root component
│   │   ├── app.component.html  # Template for the root component
│   │   ├── app.component.ts    # Logic for the root component
│   │   ├── app.config.ts       # Global application configuration
│   │   ├── app.routes.ts       # Application routes configuration
│   │   ├── auth.guard.spec.ts  # Unit tests for authentication guard
│   │   ├── auth.guard.ts       # Authentication guard
│   ├── index.html              # Application entry point HTML file
│   ├── main.ts                 # Bootstrap file for the Angular app
│   ├── styles.css              # Global styles for the application
├── .gitignore                  # Specifies files to be ignored by Git
├── README.md                   # Documentation for the project
├── angular.json                # Angular CLI configuration file
├── package-lock.json           # Lockfile for npm dependencies
├── package.json                # Project metadata and npm scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.app.json           # TypeScript configuration for the application
├── tsconfig.json               # Global TypeScript configuration
├── tsconfig.spec.json          # TypeScript configuration for unit tests


```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

---

## Troubleshooting

### Common Issues

#### 1. Application not starting

- **Error Message**: `Cannot find module '@angular/core'`

  - **Solution**: Ensure that all dependencies are installed by running `npm install`.

- **Error Message**: `Port 4200 is already in use`
  - **Solution**: Either stop the process using port 4200 or run the application on a different port using `ng serve --port 4300`.

#### 2. Styles not loading

- **Error Message**: No specific error, but the application appears unstyled.
  - **Solution**: Verify that the styles are correctly imported in `angular.json` and that there are no errors in the console related to CSS files.

#### 3. API calls failing

- **Error Message**: `Failed to load resource: the server responded with a status of 404 (Not Found)`
  - **Solution**: Ensure that the backend API is running and the endpoints are correctly configured in the service files.

### Debugging Tips

- Use the Angular CLI command `ng serve --open` to automatically open the application in your default browser with live reload enabled.
- Check the browser console for any runtime errors and stack traces.
- Use the Angular DevTools extension for Chrome or Firefox to inspect the component tree and state.

### Getting Help

- For Angular-specific issues, refer to the [Angular documentation](https://angular.io/docs).
- For issues related to the backend API, consult the backend's README and documentation.
- If you encounter a bug, please open an issue on the [GitHub repository](https://github.com/ammar-jesliy/event-ticketing-frontend/issues).

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Ammar Jesliy - [ammarjc1@gmail.com](mailto:ammarjc1@email.com)

Project Link: [https://github.com/ammar-jesliy/event-ticketing-frontend](https://github.com/ammarjesliy/event-ticketing-frontend)

## Acknowledgements

- [Angular](https://angular.io/)
- [Karma](https://karma-runner.github.io)
- [Node.js](https://nodejs.org/)
- [Angular CLI](https://github.com/angular/angular-cli)
- [GitHub](https://github.com/)
- [MIT License](https://opensource.org/licenses/MIT)

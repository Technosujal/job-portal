# Career-Connect

Career-Connect is a modern job portal and career management platform designed to connect job seekers with recruiters efficiently. It features AI-powered job matching and a streamlined application process.

## Features

- **Job Seekers**:
  - Browse and search for job listings.
  - Apply for jobs with profiles.
  - AI-powered job recommendations based on skills and experience.
- **Recruiters**:
  - Post and manage job listings.
  - Track and manage job applications.
  - Insights and statistics dashboard.
- **Authentication**: Secure user registration and login for both seekers and recruiters.
- **Local Setup**: Zero-configuration development environment using a local SQLite database.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion (for animations).
- **Backend**: Express (Node.js), Passport.js (authentication).
- **Database**: SQLite with Drizzle ORM.
- **AI Integration**: Custom matching logic for job recommendations.

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm

### Installation

1.  Clone the repository:

    ```bash
    git clone <your-repo-url>
    cd Career-Connect
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Initialize the database:

    ```bash
    npm run db:push
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5000`.

## License

MIT

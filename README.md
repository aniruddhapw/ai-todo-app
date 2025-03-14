## Overview

This project is an AI-powered to-do list application that allows users to create, read, update, and delete to-do list items using natural language commands. The application leverages OpenAI's API to interpret user commands and interact with a PostgreSQL database to manage the to-do items.

## Features

- **Create To-Do**: Add new tasks to your to-do list.
- **Read To-Do**: View all tasks in your to-do list.
- **Update To-Do**: Modify existing tasks.
- **Delete To-Do**: Remove tasks from your to-do list.
- **Search To-Do**: Search for tasks using keywords.

## Setup

### Prerequisites

- Node.js
- Docker
- Docker Compose

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/ai-todo-app.git
    cd ai-todo-app
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:
    ```env
    DATABASE_URL=postgresql://admin:admin@localhost:5431/postgres
    OPENAI_API_KEY=your_openai_api_key
    ```

4. Start the PostgreSQL database using Docker Compose:
    ```sh
    docker-compose up -d
    ```

5. Generate the database schema:
    ```sh
    npm run genrate
    ```

6. Run the migrations:
    ```sh
    npm run migrate
    ```

## Usage

1. Start the application:
    ```sh
    node index.js
    ```

2. Follow the prompts to interact with the to-do list using natural language commands.

## Project Structure

- `.env`: Environment variables.
- `docker-compose.yaml`: Docker Compose configuration for PostgreSQL.
- `drizzle.config.js`: Drizzle ORM configuration.
- `db/schema.js`: Database schema definition.
- `db/index.js`: Database connection setup.
- `index.js`: Main application logic.
- `package.json`: Project dependencies and scripts.
- `.gitignore`: Files and directories to be ignored by Git.

## License


# Medium Clone API 🚀

This is a REST API for a Medium clone, built with NestJS and PostgreSQL.

## Requirements 📋

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation 🛠️

1. Clone the repository:

```bash
git clone https://github.com/your-username/mediumclone_nestjs.git
cd mediumclone_nestjs
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

   > **Note**: All database connection settings are in the `src/ormconfig.ts` file.
   > Make sure the values in this file match your PostgreSQL settings.

   a. Install PostgreSQL:

   - For Windows:
     - Download the installer from the [official PostgreSQL website](https://www.postgresql.org/download/windows/)
     - Run the installer and follow the instructions
     - Remember the password you set for the postgres user
     - After installation, PostgreSQL will be available on port 5432
     - Make sure the PostgreSQL path is added to your system PATH variable:
       - Default: `C:\Program Files\PostgreSQL\{version}\bin`
       - You can verify with: `where psql`

   b. Connect to PostgreSQL using psql:

   - Open Command Prompt (CMD) or PowerShell
   - There are several ways to connect:

     ```bash
     # Standard connection
     psql -U postgres

     # Connection with host and port specified
     psql -h localhost -p 5432 -U postgres

     # Connection with database specified
     psql -U postgres -d postgres
     ```

   - After entering the command, the system will ask for a password
   - Useful psql commands:

     ```sql
     # Show all databases
     \l

     # Connect to a specific database
     \c database_name

     # Show all tables
     \dt

     # Exit psql
     \q
     ```

   c. Create the database:

   - Connect to PostgreSQL as the postgres user:

   ```bash
   psql -U postgres
   ```

   - Enter the password you set during installation
   - Create a new database:

   ```sql
   CREATE DATABASE mediumclone;
   ```

   - Verify the database was created:

   ```sql
   \l
   ```

   - Exit psql:

   ```sql
   \q
   ```

4. Run migrations:

```bash
npm run db:migrate
```

5. Run seeds (optional):

```bash
npm run db:seed
```

6. Start the project:

```bash
npm run start
```

The server will be available at: `http://localhost:3000`

## API Documentation 📚

### Authentication 🔐

#### User Registration

```http
POST /api/users
Content-Type: application/json

{
  "user": {
    "username": "jake",
    "email": "jake@example.com",
    "password": "jakejake"
  }
}
```

Authentication: Not required

Response:

```json
{
  "user": {
    "email": "jake@example.com",
    "token": "jwt.token.here",
    "username": "jake",
    "bio": null,
    "image": null
  }
}
```

#### User Login

```http
POST /api/users/login
Content-Type: application/json

{
  "user": {
    "email": "jake@example.com",
    "password": "jakejake"
  }
}
```

Authentication: Not required

Response:

```json
{
  "user": {
    "email": "jake@example.com",
    "token": "jwt.token.here",
    "username": "jake",
    "bio": null,
    "image": null
  }
}
```

### Profile 👤

#### Get Profile

```http
GET /api/profiles/:username
Authorization: Token jwt.token.here
```

Authentication: Optional. If token is provided, response will include additional information about subscription status (following)

Response:

```json
{
  "profile": {
    "username": "jake",
    "bio": "I work at statefarm",
    "image": "https://static.productionready.io/images/smiley-cyrus.jpg",
    "following": false
  }
}
```

#### Follow User

```http
POST /api/profiles/:username/follow
Authorization: Token jwt.token.here
```

Authentication: Required. Token of authenticated user needed

Response:

```json
{
  "profile": {
    "username": "jake",
    "bio": "I work at statefarm",
    "image": "https://static.productionready.io/images/smiley-cyrus.jpg",
    "following": true
  }
}
```

### Articles 📝

#### Create Article

```http
POST /api/articles
Authorization: Token jwt.token.here
Content-Type: application/json

{
  "article": {
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "Very carefully.",
    "tagList": ["dragons", "training"]
  }
}
```

Authentication: Required. Token of authenticated user needed

Response:

```json
{
  "article": {
    "slug": "how-to-train-your-dragon",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "Very carefully.",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": null,
      "image": null,
      "following": false
    }
  }
}
```

#### Get Article

```http
GET /api/articles/:slug
Authorization: Token jwt.token.here
```

Authentication: Optional. If token is provided, response will include additional information about favorite status (favorited) and author subscription (following)

Response:

```json
{
  "article": {
    "slug": "how-to-train-your-dragon",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "Very carefully.",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": null,
      "image": null,
      "following": false
    }
  }
}
```

#### Update Article

```http
PUT /api/articles/:slug
Authorization: Token jwt.token.here
Content-Type: application/json

{
  "article": {
    "title": "Did you train your dragon?",
    "description": "No, not really.",
    "body": "It takes a Jacobian"
  }
}
```

Authentication: Required. Token of article author needed

Response:

```json
{
  "article": {
    "slug": "did-you-train-your-dragon",
    "title": "Did you train your dragon?",
    "description": "No, not really.",
    "body": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": null,
      "image": null,
      "following": false
    }
  }
}
```

#### Delete Article

```http
DELETE /api/articles/:slug
Authorization: Token jwt.token.here
```

Authentication: Required. Token of article author needed

Response: 204 No Content

### Comments 💬

#### Add Comment

```http
POST /api/articles/:slug/comments
Authorization: Token jwt.token.here
Content-Type: application/json

{
  "comment": {
    "body": "His name was my name too."
  }
}
```

Authentication: Required. Token of authenticated user needed

Response:

```json
{
  "comment": {
    "id": 1,
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:22:56.637Z",
    "body": "His name was my name too.",
    "author": {
      "username": "jake",
      "bio": null,
      "image": null,
      "following": false
    }
  }
}
```

#### Get Comments

```http
GET /api/articles/:slug/comments
Authorization: Token jwt.token.here
```

Authentication: Optional. If token is provided, response will include additional information about comment author subscription (following)

Response:

```json
{
  "comments": [
    {
      "id": 1,
      "createdAt": "2016-02-18T03:22:56.637Z",
      "updatedAt": "2016-02-18T03:22:56.637Z",
      "body": "His name was my name too.",
      "author": {
        "username": "jake",
        "bio": null,
        "image": null,
        "following": false
      }
    }
  ]
}
```

#### Delete Comment

```http
DELETE /api/articles/:slug/comments/:id
Authorization: Token jwt.token.here
```

Authentication: Required. Token of comment author or article author needed

Response: 204 No Content

### Tags 🏷️

#### Get All Tags

```http
GET /api/tags
```

Authentication: Not required

Response:

```json
{
  "tags": ["reactjs", "angularjs"]
}
```

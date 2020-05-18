# User Sessions Microservice

A simple image that creates and destroys user sessions for a given domain.
Must be placed behind a reverse proxy.

## Architecture

This api has 2 endpoints:

- /login
- /logout

### Login

Two required fields: email, password.
Data must be sent in x-www-form-urlencoded format.

### Logout

Logout endpoint closes all active sessions for a user. User data retrieved
from session, not from client.

### Database

User data is stored in a mongodb database. Connection string stored in docker secret.
Secret must be named 'db_url'.

### User schema

User data must contain an email field with a unique index. Roles are defined by
a document in the following format :

`{resource: // e.g. 'articles' role: //e.g. 'readWrite'}`

Example valid user document:

`{ email: example@email.com password: examplepassword roles: [{resource: articles, role: 'read'}] }`

### Session Store

Sessions are stored in Redis. Redis service must be called 'sessions_store' in docker/kubernetes network.

### Reverse Proxy

Api only accepts requests from a single whitelisted ip.
Reverse proxy must be a docker servie named 'reverse_proxy'.

### Docker build arguments

Requires the following build args:

- HOST
- DOMAIN
- NODE_ENV
- LOG_LEVEL

### Docker Secrets

- db_url: mongodb connection string
- jwt_secret: secret for encrypting jwt tokens
- session_secret: Session encryption key. Minimum 32 characters long.

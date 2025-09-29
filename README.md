# DevTinder - Developer Matching Platform

## Test Accounts

Use these test accounts to explore the application:

| Email | Password |
|-------|----------|
| salik@gmail.com | Salik@511 |
| amaan@gmail.com | Amaan@511 |
| fardeen@gmail.com | Fardeen@511 |
| muqasid@gmail.com | Muqasid@511 |

## API Documentation

### Authentication
- **POST** `/register` - Register a new user
- **POST** `/login` - User login
- **POST** `/logout` - User logout
- **GET** `/me` - Get current user profile

### User Profiles
- **GET** `/profile/view` - View current user profile
- **PATCH** `/profile/edit` - Update profile
- **PATCH** `/profile/password` - Change password
- **GET** `/user/feed` - Get profiles of other users on the platform

### Connections
- **GET** `/user/connections` - List all connections
- **GET** `/user/requests/received` - List received connection requests
- **POST** `/request/send/:userId` - Send connection request
- **POST** `/request/review/accepted/:requestId` - Accept connection request
- **POST** `/request/review/rejected/:requestId` - Reject connection request

### Tasks
- **GET** `/api/tasks` - List all tasks
- **POST** `/api/tasks` - Create new task
- **PUT** `/api/tasks/:id` - Update task
- **DELETE** `/api/tasks/:id` - Delete task

### Status Types
- `ignore` - User passed on the profile
- `interested` - User liked the profile
- `accepted` - Connection request accepted
- `rejected` - Connection request rejected

## Production Scaling Guide

### Backend Scaling
1. **Containerization**
   - Dockerize the application with `Dockerfile` and `docker-compose.yml`
   - Use PM2 or Kubernetes for process management

2. **Load Balancing**
   - Set up Nginx as a reverse proxy
   - Implement horizontal scaling with multiple Node.js instances

3. **Database**
   - Use MongoDB Atlas for managed database
   - Implement connection pooling and read replicas
   - Add appropriate indexes for frequently queried fields

4. **Caching**
   - Implement Redis for session storage and caching
   - Cache frequent database queries

### Frontend Optimization
1. **Performance**
   - Implement code splitting and lazy loading
   - Serve static assets through a CDN
   - Optimize images and assets

2. **Security**
   - Enforce HTTPS in production
   - Implement proper CORS configuration
   - Add security headers (helmet.js)

3. **Monitoring**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor performance with tools like Lighthouse
   - Implement logging and alerting

### CI/CD Pipeline
1. **Automated Testing**
   - Unit and integration tests
   - End-to-end testing

2. **Deployment**
   - Set up GitHub Actions for CI/CD
   - Implement blue-green or canary deployments

3. **Environment Management**
   - Use different environment configurations
   - Manage secrets securely with environment variables

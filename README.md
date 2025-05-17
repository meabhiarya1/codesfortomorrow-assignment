# 🔐 Authentication API

This project provides a RESTful API for user authentication, including features such as user signup, login, profile access, password reset via email, and secure token handling.

## 📍 Base URL
```
http://localhost:5000/api/auth
```

## 📌 API Endpoints

### 1. 📝 Signup
**Endpoint:** `POST /signup`  
**Description:** Registers a new user.

#### Request Body
```
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "your_password"
}
```

### 2. 🔐 Login
**Endpoint:** `POST /login`  
**Description:** Authenticates user and returns a JWT token.

#### Request Body
```
{
  "email": "john@example.com",
  "password": "your_password"
}
```

#### Sample Response
```
{
  "token": "your_jwt_token",
  "user": {
    "id": "user_id",
    "email": "john@example.com"
  }
}
```

### 3. 👤 Get Current User
**Endpoint:** `GET /me`  
**Description:** Retrieves currently logged-in user’s information.

#### Headers
```
Authorization: Bearer <token>
```

### 4. 📧 Forgot Password
**Endpoint:** `POST /forgot-password`  
**Description:** Sends a reset password email with a token.

#### Request Body
```
{
  "email": "john@example.com"
}
```

### 5. 🔁 Reset Password
**Endpoint:** `POST /reset-password/:token`  
**Description:** Resets the user's password using a token.

#### URL Parameter
```
:token - Token received in email
```

#### Request Body
```
{
  "password": "new_password"
}
```

## 🧪 Postman Usage

1. Open Postman.
2. Use the above endpoint definitions to create and test your requests.
3. Use the JWT token from the login response in the `Authorization` header for protected routes.

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)
- Nodemailer

## ⚙️ Environment Variables

Create a `.env` file and include the following:

```
PORT=5000
DB_NAME=codesfortomorrow
DB_USER=root
DB_PASS=root
DB_HOST=localhost
JWT_SECRET=secret
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

## ▶️ Running the Server

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📄 License

This project is licensed under the MIT License.
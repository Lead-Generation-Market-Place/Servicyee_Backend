# How to Get JWT Token for API Testing

## Step 1: Get JWT Token via Login

### Login Request
**Method:** `POST`  
**URL:** `http://localhost:4000/api/v1/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Response will include:**
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "user": {
    "id": "user_id",
    "email": "your-email@example.com"
  }
}
```

## Step 2: Use the Access Token

**Copy the `accessToken` value** from the login response and use it in your FAQ requests:

### Authorization Header Format:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Test FAQ Request

Now try the FAQ request with the valid token:

**Method:** `POST`  
**URL:** `http://localhost:4000/api/v1/professionals/faq/questions`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ACTUAL_JWT_TOKEN_HERE
```

**Body:**
```json
{
  "question": "What should the customer know about your pricing (e.g., discounts, fees)?"
}
```

## Alternative: Register First

If you don't have an account, register first:

**Method:** `POST`  
**URL:** `http://localhost:4000/api/v1/auth/register`

**Body:**
```json
{
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User"
}
```

Then login with those credentials to get your JWT token.

## Quick Test with curl

Replace `YOUR_EMAIL` and `YOUR_PASSWORD` with actual values:

```bash
# Step 1: Login to get token
TOKEN=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"YOUR_EMAIL","password":"YOUR_PASSWORD"}' \
  | jq -r '.accessToken')

# Step 2: Use token to create FAQ question
curl -X POST http://localhost:4000/api/v1/professionals/faq/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"question":"What should the customer know about your pricing (e.g., discounts, fees)?"}'
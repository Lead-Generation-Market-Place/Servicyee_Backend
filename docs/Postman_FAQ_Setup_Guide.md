# Postman FAQ Questions Setup Guide

## Step-by-Step Postman Configuration

### 1. Create New Request
1. Open Postman
2. Create a new request
3. Set method to `POST`
4. URL: `http://localhost:4000/api/v1/professionals/faq/questions`

### 2. Set Headers
Click on the **Headers** tab and add:
```
Key: Authorization
Value: Bearer YOUR_JWT_TOKEN

Key: Content-Type  
Value: application/json
```

### 3. Set Body
1. Click on the **Body** tab
2. Select **"raw"** radio button
3. Select **"JSON"** from the dropdown (next to raw)
4. Paste this JSON:
```json
{
  "question": "What should the customer know about your pricing (e.g., discounts, fees)?"
}
```

### 4. Send Request
Click **Send** button

## Complete FAQ Questions List

Use this same setup for each question:

### Question 1
```json
{
  "question": "What should the customer know about your pricing (e.g., discounts, fees)?"
}
```

### Question 2
```json
{
  "question": "What is your typical process for working with a new customer?"
}
```

### Question 3
```json
{
  "question": "What education and/or training do you have that relates to your work?"
}
```

### Question 4
```json
{
  "question": "How did you get started doing this type of work?"
}
```

### Question 5
```json
{
  "question": "What type of customer have you worked with?"
}
```

### Question 6
```json
{
  "question": "Describe a recent project you are fond of. How long did it take?"
}
```

### Question 7
```json
{
  "question": "What advice you would give a customer looking to hire a provider in your area of work?"
}
```

### Question 8
```json
{
  "question": "What questions should customers think through before talking to professionals about their project?"
}
```

## Verify All Questions
**Method:** GET  
**URL:** `http://localhost:4000/api/v1/professionals/faq/questions`  
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Troubleshooting
If you still get the same error:
1. Make sure you're selecting "JSON" format in Body tab (not "Text")
2. Verify Content-Type header is set to "application/json"
3. Check that your server is running on port 4000
4. Ensure you have a valid JWT token
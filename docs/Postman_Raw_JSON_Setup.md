# Postman Raw JSON Setup - Step by Step

## Step-by-Step Raw JSON Configuration

### 1. Create New Request
- **Method:** `POST`
- **URL:** `http://localhost:4000/api/v1/professionals/faq/questions`

### 2. Headers Tab Setup
Click **Headers** tab and add these two headers:

**Header 1:**
- **Key:** `Authorization`
- **Value:** `Bearer YOUR_JWT_TOKEN`

**Header 2:**
- **Key:** `Content-Type`
- **Value:** `application/json`

### 3. Body Tab Setup (CRITICAL!)
Click **Body** tab and do this **EXACTLY**:

1. **Select the "raw" radio button** (NOT form-data, NOT x-www-form-urlencoded)
2. **In the dropdown next to "raw"** → Select **"JSON"** (NOT "Text", NOT "HTML", NOT "XML")
3. **In the text area below**, paste this **EXACTLY**:

```json
{
  "question": "What should the customer know about your pricing (e.g., discounts, fees)?"
}
```

### 4. Complete Request Setup

Your Postman should look like this:

**URL:** `http://localhost:4000/api/v1/professionals/faq/questions`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Body (raw/JSON):**
```json
{
  "question": "What should the customer know about your pricing (e.g., discounts, fees)?"
}
```

### 5. Send Request
Click **Send** button

## Troubleshooting

### If you still get "req.body is undefined":
1. **Check Body tab shows "JSON" selected** (not "Text")
2. **Verify JSON is properly formatted** (no extra spaces, correct brackets)
3. **Ensure Headers tab has Content-Type: application/json**
4. **Try copying/pasting the JSON exactly as shown above**

### Visual Check:
- ✅ Body tab: "raw" radio button selected
- ✅ Dropdown: "JSON" selected  
- ✅ Headers: Content-Type = application/json
- ✅ JSON format: proper brackets and quotes

## All 8 Questions for Copy-Paste

Replace the body with each of these:

**Question 1:**
```json
{"question":"What should the customer know about your pricing (e.g., discounts, fees)?"}
```

**Question 2:**
```json
{"question":"What is your typical process for working with a new customer?"}
```

**Question 3:**
```json
{"question":"What education and/or training do you have that relates to your work?"}
```

**Question 4:**
```json
{"question":"How did you get started doing this type of work?"}
```

**Question 5:**
```json
{"question":"What type of customer have you worked with?"}
```

**Question 6:**
```json
{"question":"Describe a recent project you are fond of. How long did it take?"}
```

**Question 7:**
```json
{"question":"What advice you would give a customer looking to hire a provider in your area of work?"}
```

**Question 8:**
```json
{"question":"What questions should customers think through before talking to professionals about their project?"}
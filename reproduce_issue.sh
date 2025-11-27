#!/bin/bash

# Login to get token and user ID
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@acentra.com","password":"Ok4Me2bhr!"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo $LOGIN_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ] || [ -z "$USER_ID" ]; then
  echo "Login failed. Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "Logged in. User ID: $USER_ID"
echo "Token: $TOKEN"

# Try to update preferences
echo "Updating preferences..."
UPDATE_RESPONSE=$(curl -s -X PATCH http://localhost:3001/api/users/$USER_ID/preferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"preferences":{"theme":"auroraDark"}}')

echo "Update Response: $UPDATE_RESPONSE"

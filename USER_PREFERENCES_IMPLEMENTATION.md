# User Preferences Implementation Summary

## Overview
Implemented backend-driven user preferences system to store and retrieve user settings (starting with theme preference) from the database instead of localStorage.

## Changes Made

### Backend Changes

#### 1. User Entity (`apps/acentra-backend/src/entity/User.ts`)
- Added `preferences` column of type `jsonb` to store key-value pairs
- Column is nullable to support existing users

#### 2. User Controller (`apps/acentra-backend/src/controller/UserController.ts`)
- Added `getPreferences(req, res)` - GET endpoint to retrieve user preferences
- Added `updatePreferences(req, res)` - PATCH endpoint to update user preferences
- Preferences are merged with existing values (not replaced entirely)

#### 3. Routes (`apps/acentra-backend/src/routes.ts`)
- Added `GET /api/users/:id/preferences` - Retrieve user preferences
- Added `PATCH /api/users/:id/preferences` - Update user preferences
- Both routes require authentication

#### 4. Migration (`apps/acentra-backend/src/migration/1732701600000-AddUserPreferences.ts`)
- Created migration to add preferences column to existing databases
- Supports rollback via down() method

### Frontend Changes

#### 1. API Layer (`apps/acentra-frontend/src/api.ts`)
- Added `getUserPreferences(userId)` - Fetch user preferences from backend
- Added `updateUserPreferences(userId, preferences)` - Update user preferences on backend

#### 2. Theme Context (`apps/acentra-frontend/src/context/ThemeContext.tsx`)
- Refactored to use backend-driven preferences instead of localStorage
- Added `loadUserPreferences(userId)` method to fetch preferences from backend
- Modified `setTheme()` to automatically save to backend when user is logged in
- Default theme is "aurora" for non-authenticated users (login page)
- Removed localStorage dependency for theme persistence

#### 3. Login Page (`apps/acentra-frontend/src/pages/Login.tsx`)
- Added call to `loadUserPreferences()` after successful login
- Ensures user's saved theme is applied immediately after authentication

#### 4. App Component (`apps/acentra-frontend/src/App.tsx`)
- Added useEffect to load user preferences on app initialization
- Handles page refreshes by checking localStorage for existing user session
- Loads preferences if user is already authenticated

#### 5. Preference Settings (`apps/acentra-frontend/src/components/settings/PreferenceSettings.tsx`)
- Updated to use async theme change handler
- Added error handling for failed preference updates
- Updated description to reflect backend persistence across devices

## User Flow

### Login Flow
1. User enters credentials on login page (default "aurora" theme shown)
2. Upon successful authentication:
   - Token and user data saved to localStorage
   - `loadUserPreferences()` called with user ID
   - Backend fetches user's saved preferences
   - Theme is applied if found in preferences
3. User is redirected to dashboard with their preferred theme

### Page Refresh Flow
1. App initializes and checks localStorage for existing user session
2. If user is found, `loadUserPreferences()` is called automatically
3. User's saved theme is applied before any components render

### Theme Change Flow
1. User navigates to Settings > Preferences
2. User selects a new theme from dropdown
3. Theme is immediately applied to UI
4. `setTheme()` automatically saves preference to backend
5. Success/error message is shown to user

## Database Schema

```sql
ALTER TABLE "user" ADD COLUMN "preferences" jsonb NULL;
```

### Example Preferences Data
```json
{
  "theme": "auroraDark"
}
```

## API Endpoints

### GET /api/users/:id/preferences
**Authentication:** Required  
**Response:**
```json
{
  "preferences": {
    "theme": "auroraDark"
  }
}
```

### PATCH /api/users/:id/preferences
**Authentication:** Required  
**Request Body:**
```json
{
  "preferences": {
    "theme": "auroraLight"
  }
}
```
**Response:**
```json
{
  "preferences": {
    "theme": "auroraLight"
  }
}
```

## Benefits

1. **Cross-Device Sync**: User preferences persist across all devices
2. **Centralized Management**: All user settings stored in one place
3. **Extensible**: Easy to add new preference types (language, notifications, etc.)
4. **Secure**: Preferences tied to authenticated user account
5. **Default Behavior**: Login page always shows default theme for consistency

## Future Enhancements

The preferences system is designed to be extensible. Future additions could include:
- Language preference
- Notification settings
- Display density
- Date/time format
- Dashboard layout preferences
- Email notification preferences

## Testing Recommendations

1. Test login with new user (no preferences set)
2. Test login with existing user (preferences already set)
3. Test theme change and verify backend persistence
4. Test page refresh maintains theme
5. Test logout and login maintains theme
6. Test multiple devices with same account
7. Test migration on existing database
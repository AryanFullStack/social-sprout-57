# LinkedIn OAuth Setup Guide

## Overview

LinkedIn OAuth integration allows users to connect their LinkedIn profiles and company pages for automated posting. This guide covers the complete setup process.

## 1. Create Your LinkedIn App & Request Products/Scopes

### LinkedIn Developer Portal Setup
1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com)
2. Create a new app
3. Add a valid OAuth Redirect URL: `https://lsxlvinbnpxculazowih.supabase.co/functions/v1/oauth-callback/linkedin`

### Required Products/Permissions

#### For Authentication & Profile Access:
- **Sign In with LinkedIn using OpenID Connect** (for login + profile basics)
- Scopes: `openid profile email`
- Alternative legacy scopes: `r_liteprofile r_emailaddress`

#### For Posting Capabilities:
- **Member Posts**: `w_member_social` (post as individual user)
- **Organization Posts**: `w_organization_social` (post as company page)
- **Reading Organization Posts**: `r_organization_social`

> **Important**: For Company Page posting, the authenticating user must be an Admin, Content Admin, or DSC Poster on that Page.

## 2. OAuth 2.0 Authorization Code Flow

### Authorization URL (Member Posting Example)
```
GET https://www.linkedin.com/oauth/v2/authorization
  ?response_type=code
  &client_id=YOUR_CLIENT_ID
  &redirect_uri=https://lsxlvinbnpxculazowih.supabase.co/functions/v1/oauth-callback/linkedin
  &scope=openid%20profile%20email%20w_member_social
  &state=RANDOM_CSRF_TOKEN
```

### Token Exchange
```http
POST https://www.linkedin.com/oauth/v2/accessToken
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=THE_CODE_FROM_QUERY&
redirect_uri=YOUR_REDIRECT_URI&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET
```

> **Note**: LinkedIn tokens commonly expire in ~60 days. Store them securely and be ready to re-authorize users.

## 3. Get User Identity & Available Accounts

### Get Member's Person URN (for posting as user)

**Option A (OIDC - Recommended):**
```http
GET https://api.linkedin.com/v2/userinfo
Authorization: Bearer <token>
```

**Option B (Legacy):**
```http
GET https://api.linkedin.com/v2/me
Authorization: Bearer <token>
```

### List Company Pages (for posting as organization)
```http
GET https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&state=APPROVED&count=10&start=0
Authorization: Bearer <token>
```

## 4. Posts API Implementation

### Required Headers for REST Endpoints
```http
Authorization: Bearer <token>
LinkedIn-Version: 202506
X-Restli-Protocol-Version: 2.0.0
Content-Type: application/json
```

### A) Text-Only Post
```http
POST https://api.linkedin.com/rest/posts
```

```json
{
  "author": "urn:li:person:YOUR_PERSON_ID",
  "commentary": "Hello from my app 👋",
  "visibility": "PUBLIC",
  "distribution": {
    "feedDistribution": "MAIN_FEED",
    "targetEntities": [],
    "thirdPartyDistributionChannels": []
  },
  "lifecycleState": "PUBLISHED",
  "isReshareDisabledByAuthor": false
}
```

### B) Image Post (3-Step Process)

#### Step 1: Initialize Upload
```http
POST https://api.linkedin.com/rest/images?action=initializeUpload
```

```json
{
  "initializeUploadRequest": {
    "owner": "urn:li:person:YOUR_PERSON_ID"
  }
}
```

#### Step 2: Upload Binary
Upload raw file bytes to the `uploadUrl` returned from Step 1.

#### Step 3: Create Post with Image
```json
{
  "author": "urn:li:person:YOUR_PERSON_ID",
  "commentary": "Here's an image from our app 📸",
  "visibility": "PUBLIC",
  "distribution": {
    "feedDistribution": "MAIN_FEED",
    "targetEntities": [],
    "thirdPartyDistributionChannels": []
  },
  "content": {
    "media": {
      "id": "urn:li:image:C4E10AQF..."
    }
  },
  "lifecycleState": "PUBLISHED"
}
```

## 5. Current Implementation Status

### ✅ Completed
- OAuth Connect function configured for LinkedIn
- OAuth Callback function ready to handle LinkedIn responses
- Supabase secrets configured (LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET)
- Database tables and RLS policies set up
- Frontend integration in AccountsPage.tsx

### ⏳ Next Steps for Full Implementation
1. **Enhanced Token Storage**: Store LinkedIn-specific metadata (person URN, organization URNs)
2. **Posts API Integration**: Create edge function for LinkedIn posting
3. **Organization Support**: Add UI for selecting between personal profile and company pages
4. **Image Upload**: Implement 3-step image upload process
5. **Error Handling**: Add LinkedIn-specific error messages and retry logic

## 6. Common Gotchas & Best Practices

### Headers Requirements
- `LinkedIn-Version` and `X-Restli-Protocol-Version` are **required** on `rest/*` APIs
- Legacy `/v2/` endpoints don't need these headers

### Organization Roles
- Even with `w_organization_social` scope, the member must hold a qualifying Page role
- Always check organization permissions before attempting to post

### Image Upload
- Two-step process: register upload → binary upload → reference in post
- Upload URL is pre-signed and doesn't require auth headers

### Token Management
- Plan for ~60 days expiry
- Refresh token support is limited
- Implement re-authorization flow

### API Evolution
- Use newer **Posts API** instead of deprecated `ugcPosts`
- Monitor LinkedIn's API documentation for updates

## 7. Testing Your Integration

1. Set up LinkedIn app with correct callback URL
2. Add required products and scopes
3. Test OAuth flow through `/accounts` page
4. Monitor edge function logs for debugging
5. Test posting functionality once implemented

## Useful Links

- [LinkedIn Developer Portal](https://developer.linkedin.com)
- [OAuth Documentation](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow)
- [Posts API Documentation](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/posts-api)
- [Organization ACLs API](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/organization-access-control)

## Monitoring & Debugging

- [OAuth Connect Logs](https://supabase.com/dashboard/project/lsxlvinbnpxculazowih/functions/oauth-connect/logs)
- [OAuth Callback Logs](https://supabase.com/dashboard/project/lsxlvinbnpxculazowih/functions/oauth-callback/logs)
- [Authentication Providers](https://supabase.com/dashboard/project/lsxlvinbnpxculazowih/auth/providers)
# Facebook OAuth Setup Guide

## Problem: "Can't Load URL - Domain not included in app's domains"

This error occurs because Facebook requires specific callback URLs to be whitelisted in your Facebook App settings.

## Required Facebook App Configuration

### 1. App Domains
In your Facebook App settings, add these domains to **App Domains**:
- `lsxlvinbnpxculazowih.supabase.co` (your Supabase project domain)

### 2. Valid OAuth Redirect URIs
In **Facebook Login** → **Settings**, add these exact callback URLs:

**For Facebook:**
```
https://lsxlvinbnpxculazowih.supabase.co/functions/v1/oauth-callback/facebook
```

**For Instagram:**
```
https://lsxlvinbnpxculazowih.supabase.co/functions/v1/oauth-callback/instagram
```

### 3. Products Required
Make sure these Facebook products are added to your app:
- **Facebook Login**
- **Instagram Basic Display** (for Instagram integration)

### 4. App Review & Permissions
For production use, you'll need to submit your app for review to get these permissions:
- `pages_manage_posts`
- `pages_read_engagement` 
- `pages_manage_metadata`
- `pages_show_list`
- `instagram_basic`
- `instagram_content_publish`

## Current Configuration Status

✅ **OAuth Connect Function**: Configured with proper callback URLs
✅ **OAuth Callback Function**: Ready to handle Facebook/Instagram responses  
✅ **Supabase Secrets**: Facebook App ID and Secret are configured
✅ **Database**: Tables and RLS policies are set up

## Testing the Integration

1. Make sure your Facebook App has the correct callback URLs
2. Visit `/accounts` page (requires authentication)
3. Click "Connect Facebook" or "Connect Instagram"
4. Complete the OAuth flow

## Troubleshooting

If you still get domain errors:
1. Double-check the callback URLs in Facebook App settings
2. Make sure App Domains includes `lsxlvinbnpxculazowih.supabase.co`
3. Check the edge function logs for detailed error messages
4. Verify your Facebook App ID and Secret are correct in Supabase secrets

## Edge Function Logs

You can monitor the OAuth process in real-time:
- [OAuth Connect Logs](https://supabase.com/dashboard/project/lsxlvinbnpxculazowih/functions/oauth-connect/logs)
- [OAuth Callback Logs](https://supabase.com/dashboard/project/lsxlvinbnpxculazowih/functions/oauth-callback/logs)
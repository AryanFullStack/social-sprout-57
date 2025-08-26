import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const platform = url.pathname.split('/').pop() as 'facebook' | 'instagram' | 'linkedin';
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return new Response(`OAuth Error: ${error}`, { status: 400 });
    }

    if (!code || !state) {
      throw new Error('Missing required parameters');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Verify state and get user info
    const { data: stateData, error: stateError } = await supabaseClient
      .from('oauth_states')
      .select('*')
      .eq('state', state)
      .eq('provider', platform)
      .single();

    if (stateError || !stateData) {
      throw new Error('Invalid state parameter');
    }

    // Clean up expired states
    await supabaseClient.from('oauth_states').delete().lt('expires_at', new Date().toISOString());

    const userId = stateData.user_id;
    const redirectUrl = stateData.redirect_url;
    const baseCallbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-callback`;

    let tokenData: any;
    let accountInfo: any;

    switch (platform) {
      case 'facebook':
      case 'instagram': {
        // Exchange code for access token
        const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: Deno.env.get('FACEBOOK_APP_ID')!,
            client_secret: Deno.env.get('FACEBOOK_APP_SECRET')!,
            redirect_uri: `${baseCallbackUrl}/${platform}`,
            code,
          }),
        });

        tokenData = await tokenResponse.json();
        if (tokenData.error) {
          throw new Error(`Token exchange failed: ${tokenData.error.message}`);
        }

        // Get user info
        const userResponse = await fetch(`https://graph.facebook.com/me?access_token=${tokenData.access_token}&fields=id,name,email`);
        const userData = await userResponse.json();

        if (platform === 'facebook') {
          // Get pages for Facebook
          const pagesResponse = await fetch(`https://graph.facebook.com/me/accounts?access_token=${tokenData.access_token}`);
          const pagesData = await pagesResponse.json();
          
          // For now, use the first page or create a personal account entry
          if (pagesData.data && pagesData.data.length > 0) {
            const page = pagesData.data[0];
            accountInfo = {
              account_id: page.id,
              account_name: page.name,
              page_id: page.id,
              page_access_token: page.access_token,
            };
          } else {
            accountInfo = {
              account_id: userData.id,
              account_name: userData.name,
            };
          }
        } else {
          // Instagram business account
          accountInfo = {
            account_id: userData.id,
            account_name: userData.name,
          };
        }
        break;
      }

      case 'linkedin': {
        const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: Deno.env.get('LINKEDIN_CLIENT_ID')!,
            client_secret: Deno.env.get('LINKEDIN_CLIENT_SECRET')!,
            redirect_uri: `${baseCallbackUrl}/${platform}`,
          }),
        });

        tokenData = await tokenResponse.json();
        if (tokenData.error) {
          throw new Error(`LinkedIn token exchange failed: ${tokenData.error_description}`);
        }

        // Get LinkedIn profile
        const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
          headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
        });
        const profileData = await profileResponse.json();

        accountInfo = {
          account_id: profileData.id,
          account_name: `${profileData.localizedFirstName} ${profileData.localizedLastName}`,
        };
        break;
      }


      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    // Get user's organization
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('organization_id')
      .eq('user_id', userId)
      .single();

    if (!profile) {
      throw new Error('User profile not found');
    }

    // Store the connected account
    const { error: insertError } = await supabaseClient
      .from('social_accounts')
      .upsert({
        organization_id: profile.organization_id,
        platform,
        account_id: accountInfo.account_id,
        account_name: accountInfo.account_name,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: tokenData.expires_in ? 
          new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
        page_id: accountInfo.page_id,
        page_access_token: accountInfo.page_access_token,
        is_active: true,
        last_sync_at: new Date().toISOString(),
      }, {
        onConflict: 'organization_id,platform,account_id'
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to save account connection');
    }

    // Clean up the oauth state
    await supabaseClient.from('oauth_states').delete().eq('state', state);

    // Redirect back to the app
    const redirectWithSuccess = new URL(redirectUrl);
    redirectWithSuccess.searchParams.set('connected', platform);
    redirectWithSuccess.searchParams.set('account', accountInfo.account_name);

    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectWithSuccess.toString(),
      },
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    
    // Try to redirect back with error
    const errorUrl = new URL(req.headers.get('referer') || 'http://localhost:3000/accounts');
    errorUrl.searchParams.set('error', error.message);
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': errorUrl.toString(),
      },
    });
  }
});
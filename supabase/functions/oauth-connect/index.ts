import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConnectRequest {
  platform: 'facebook' | 'instagram' | 'linkedin';
  redirectUrl?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Set auth for the client
    const token = authHeader.replace('Bearer ', '');
    await supabaseClient.auth.setSession({ access_token: token, refresh_token: '' });

    const { data: userData } = await supabaseClient.auth.getUser();
    if (!userData.user) {
      throw new Error('Unauthorized');
    }

    const { platform, redirectUrl = `${req.headers.get('origin')}/accounts` }: ConnectRequest = await req.json();

    // Generate secure state parameter
    const state = crypto.randomUUID();
    const userId = userData.user.id;

    // Store state in database for verification
    await supabaseClient.from('oauth_states').insert({
      state,
      provider: platform,
      user_id: userId,
      redirect_url: redirectUrl,
    });

    let authUrl: string;
    const baseCallbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-callback`;

    switch (platform) {
      case 'facebook': {
        const facebookAppId = Deno.env.get('FACEBOOK_APP_ID');
        const scope = 'pages_manage_posts,pages_read_engagement,pages_manage_metadata,pages_show_list';
        authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
          `client_id=${facebookAppId}&` +
          `redirect_uri=${encodeURIComponent(baseCallbackUrl)}/${platform}&` +
          `scope=${encodeURIComponent(scope)}&` +
          `state=${state}&` +
          `response_type=code`;
        break;
      }
      case 'instagram': {
        const facebookAppId = Deno.env.get('FACEBOOK_APP_ID');
        const scope = 'instagram_basic,instagram_content_publish';
        authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
          `client_id=${facebookAppId}&` +
          `redirect_uri=${encodeURIComponent(baseCallbackUrl)}/${platform}&` +
          `scope=${encodeURIComponent(scope)}&` +
          `state=${state}&` +
          `response_type=code`;
        break;
      }
      case 'linkedin': {
        const linkedinClientId = Deno.env.get('LINKEDIN_CLIENT_ID');
        const scope = 'w_member_social,r_liteprofile,r_emailaddress';
        authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
          `response_type=code&` +
          `client_id=${linkedinClientId}&` +
          `redirect_uri=${encodeURIComponent(baseCallbackUrl)}/${platform}&` +
          `state=${state}&` +
          `scope=${encodeURIComponent(scope)}`;
        break;
      }
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    return new Response(JSON.stringify({ authUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('OAuth connect error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
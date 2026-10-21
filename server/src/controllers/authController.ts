import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

export const getAuthConfig = (_req: Request, res: Response) => {
  return res.json({
    configured: !!GOOGLE_CLIENT_ID,
    clientId: GOOGLE_CLIENT_ID ? `${GOOGLE_CLIENT_ID.slice(0, 12)}...` : null,
  });
};

export const verifyGoogleAuth = async (req: Request, res: Response) => {
  try {
    const { credential, code, redirectUri } = req.body;

    if (!credential && !code) {
      return res.status(400).json({
        success: false,
        message: 'Missing credential or code in request body.',
      });
    }

    let email = '';
    let name = '';
    let picture = '';

    if (credential) {
      // 1. Verify Google ID Token (from Google Sign In button / One Tap)
      if (GOOGLE_CLIENT_ID) {
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
          throw new Error('Invalid token payload or missing email.');
        }
        email = payload.email;
        name = payload.name || '';
        picture = payload.picture || '';
      } else {
        // Fallback tokeninfo verification if GOOGLE_CLIENT_ID is not set in env yet
        const tokenInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        const tokenInfo = await tokenInfoRes.json();
        if (!tokenInfoRes.ok || !tokenInfo.email) {
          throw new Error(tokenInfo.error_description || 'Failed to verify token with Google.');
        }
        email = tokenInfo.email;
        name = tokenInfo.name || '';
        picture = tokenInfo.picture || '';
      }
    } else if (code) {
      // 2. Exchange OAuth Authorization Code (Authorization Code Flow)
      if (!GOOGLE_CLIENT_SECRET) {
        return res.status(400).json({
          success: false,
          message: 'GOOGLE_CLIENT_SECRET is required on server to exchange authorization code.',
        });
      }

      const oAuth2Client = new OAuth2Client(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        redirectUri || 'postmessage'
      );

      const { tokens } = await oAuth2Client.getToken(code);
      if (!tokens.id_token) {
        throw new Error('No id_token returned from token exchange.');
      }

      const ticket = await oAuth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new Error('Invalid token payload or missing email.');
      }

      email = payload.email;
      name = payload.name || '';
      picture = payload.picture || '';
    }

    console.log(`[Auth Server] Verified Google account: ${email} (${name})`);

    return res.json({
      success: true,
      email,
      name,
      picture,
      message: 'Google identity verified successfully.',
    });
  } catch (error: any) {
    console.error('[Auth Server Error]', error);
    return res.status(401).json({
      success: false,
      message: error.message || 'Google token verification failed.',
    });
  }
};

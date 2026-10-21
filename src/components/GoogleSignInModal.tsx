import React, { useState, useEffect } from 'react';
import { Check, LogOut, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { surveyApi } from '../services/api';

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleSignInProps {
  currentEmail: string;
  onSelectAccount: (email: string, name?: string) => void;
  onUseManualEmail: () => void;
}

export const GoogleSignInModal: React.FC<GoogleSignInProps> = ({
  currentEmail,
  onSelectAccount,
  onUseManualEmail,
}) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(currentEmail || '');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  // Load Google Identity Services (GIS) SDK script dynamically
  useEffect(() => {
    if (window.google?.accounts?.id) {
      setIsGsiLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGsiLoaded(true);
    script.onerror = () => setErrorMsg('Failed to load Google Sign-In SDK.');
    document.head.appendChild(script);
  }, []);

  // Initialize GIS and handle backend token verification
  useEffect(() => {
    if (!isGsiLoaded || !clientId) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
      });

      // Render official Google Sign-In button if element exists
      const btnContainer = document.getElementById('gsi-button-container');
      if (btnContainer) {
        btnContainer.innerHTML = '';
        window.google.accounts.id.renderButton(btnContainer, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: 250,
        });
      }
    } catch (err) {
      console.warn('GIS initialization notice:', err);
    }
  }, [isGsiLoaded, clientId, isSignedIn]);

  // Handle Google Credential Response from Google GIS
  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response || !response.credential) {
      setErrorMsg('No credential returned from Google.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Send token to backend Express endpoint for server-side verification
      const result = await surveyApi.verifyGoogleAuth({ credential: response.credential });

      if (result.success && result.email) {
        setIsSignedIn(true);
        setUserEmail(result.email);
        setUserName(result.name || '');
        onSelectAccount(result.email, result.name);
      } else {
        throw new Error(result.message || 'Server verification failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to verify Google account identity.');
    } finally {
      setIsLoading(false);
    }
  };

  // Launch Google OAuth account switcher with prompt='select_account'
  const handleSwitchAccount = () => {
    setErrorMsg(null);

    if (!clientId) {
      // Direct notification if environment variable is not configured yet
      setErrorMsg('Google OAuth Client ID is missing. Please set VITE_GOOGLE_CLIENT_ID in .env.');
      return;
    }

    if (window.google?.accounts?.oauth2) {
      setIsLoading(true);
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        prompt: 'select_account',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            setIsLoading(false);
            if (tokenResponse.error !== 'popup_closed_by_user') {
              setErrorMsg(`Google sign-in error: ${tokenResponse.error}`);
            }
            return;
          }

          // Fetch userinfo from Google using access token
          try {
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            const userInfo = await userInfoRes.json();

            if (userInfo && userInfo.email) {
              setIsSignedIn(true);
              setUserEmail(userInfo.email);
              setUserName(userInfo.name || '');
              onSelectAccount(userInfo.email, userInfo.name);
            } else {
              throw new Error('Could not fetch email from selected Google account.');
            }
          } catch (err: any) {
            setErrorMsg(err.message || 'Failed to switch Google account.');
          } finally {
            setIsLoading(false);
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } else if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setErrorMsg('Google Sign-In script is loading. Please try again in a moment.');
    }
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setUserEmail('');
    setUserName('');
    setErrorMsg(null);
    onUseManualEmail();
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-4 sm:p-5 mb-6 transition-all">
      {/* Header bar matching Google Forms Account section styling */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          {/* Google Icon SVG */}
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="text-sm font-semibold text-slate-800">Google Account</span>
        </div>

        {isSignedIn ? (
          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Verified
          </span>
        ) : (
          <span className="text-xs text-slate-500 font-medium">Optional Sign-In</span>
        )}
      </div>

      {/* Main Body */}
      <div className="pt-3 space-y-3">
        {isLoading ? (
          <div className="flex items-center space-x-2 text-xs font-medium text-indigo-600 py-2">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Verifying Google identity...</span>
          </div>
        ) : isSignedIn && userEmail ? (
          /* Google Forms Style Authenticated User Banner */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                {userName ? userName.charAt(0).toUpperCase() : userEmail.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {userEmail} {userName && <span className="font-normal text-slate-500">({userName})</span>}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center mt-0.5">
                  <Check className="w-3 h-3 text-emerald-600 mr-1" /> Verified email prefilled in survey
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs flex-shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200">
              <button
                type="button"
                onClick={handleSwitchAccount}
                className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
              >
                Switch account
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-slate-500 hover:text-rose-600 font-medium flex items-center"
                title="Disconnect Google account"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" /> Disconnect
              </button>
            </div>
          </div>
        ) : (
          /* Signed Out / Not Authenticated Google Forms Banner */
          <div className="space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Sign in with your Google account to automatically record your verified email address and speed up submission, or type your email manually in the field below.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {/* Official Google GIS Button Container */}
              <div id="gsi-button-container" className="min-h-[40px]"></div>

              {/* Explicit Fallback Trigger for Switch Account / Sign In */}
              <button
                type="button"
                onClick={handleSwitchAccount}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs font-semibold text-slate-700 transition-all shadow-xs"
              >
                Sign in or Switch account
              </button>
            </div>

            {!clientId && (
              <div className="text-[11px] text-slate-500 bg-amber-50/80 border border-amber-200/80 p-2.5 rounded-lg text-amber-800">
                💡 <strong>Google OAuth Setup Note:</strong> Set <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">VITE_GOOGLE_CLIENT_ID</code> in your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">.env</code> file to enable live sign-in. Manual email entry below works anytime.
              </div>
            )}
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center space-x-1.5 text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};

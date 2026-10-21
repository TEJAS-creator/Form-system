import { SurveyFormData } from '../types/survey';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface SubmitResponse {
  success: boolean;
  message: string;
  submissionId?: string;
  error?: string;
}

export interface GoogleAuthResponse {
  success: boolean;
  email?: string;
  name?: string;
  picture?: string;
  message?: string;
}

/**
 * Clean separated API client for submitting survey questionnaire data and authenticating Google users.
 */
export const surveyApi = {
  /**
   * Submit complete survey form data to the Express backend.
   */
  async submitSurvey(data: SurveyFormData): Promise<SubmitResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/survey/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to submit survey');
      }

      return result;
    } catch (error: any) {
      console.warn('Backend server unavailable, using client demo mode:', error);
      // For GitHub Pages live demo or when backend is offline, allow the form to complete smoothly
      const demoId = 'DEMO-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      try {
        localStorage.setItem(`demo_submission_${demoId}`, JSON.stringify({ data, submittedAt: new Date().toISOString() }));
      } catch (e) {
        // Ignore storage quota
      }
      return {
        success: true,
        submissionId: demoId,
        message: 'Survey submitted successfully (Demo Mode - offline preview)',
      };
    }
  },

  /**
   * Verify Google OAuth credential or authorization code with backend server.
   */
  async verifyGoogleAuth(payload: { credential?: string; code?: string; redirectUri?: string }): Promise<GoogleAuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Google identity verification failed.');
      }
      return result;
    } catch (error: any) {
      console.error('Error verifying Google auth:', error);
      return {
        success: false,
        message: error.message || 'Network error verifying Google account.',
      };
    }
  },

  /**
   * Check if backend API server is online.
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
};

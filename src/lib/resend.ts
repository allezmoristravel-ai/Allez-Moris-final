/**
 * Note: Calling Resend directly from the frontend is generally discouraged
 * because it exposes your API key. For production, it's recommended to
 * call this from a backend or serverless function.
 */

/**
 * Securely calls the serverless function to send the bucket list email.
 */
export const sendBucketListEmail = async (data: {
  name: string;
  email: string;
  phone: string;
  country: string;
  people: number;
  firstTime: boolean;
  reason: string[];
  experience: string[];
  activities: Record<string, string[]>;
  startDate?: Date;
  endDate?: Date;
  notes?: string;
}) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      return { success: false, error: `Server error: ${response.status}` };
    }


    const result = await response.json();
    return { success: true, data: result.data };
  } catch (err) {
    console.error("Unexpected Error:", err);
    return { success: false, error: err };
  }
};

/**
 * Securely calls the serverless function to send the subscription email.
 */
export const sendSubscriptionEmail = async (data: {
  name: string;
  email: string;
}) => {
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      return { success: false, error: `Server error: ${response.status}` };
    }

    const result = await response.json();
    return { success: true, data: result.data };
  } catch (err) {
    console.error("Unexpected Error:", err);
    return { success: false, error: err };
  }
};


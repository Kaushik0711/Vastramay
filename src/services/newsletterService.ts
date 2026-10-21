const NEWSLETTER_STORAGE_KEY = 'vastramay-newsletter-subscribers';

export interface NewsletterSubscriptionResult {
  success: boolean;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter subscription service.
 * Uses a documented development adapter persisting subscribers to localStorage.
 * Integrates real regex validation and latency simulation.
 */
export const newsletterService = {
  async subscribe(email: string): Promise<NewsletterSubscriptionResult> {
    const trimmed = email.trim().toLowerCase();

    // 1. Validation
    if (!trimmed) {
      return {
        success: false,
        message: 'Please provide an email address.',
      };
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      return {
        success: false,
        message: 'Please enter a valid email address (e.g. name@example.com).',
      };
    }

    // 2. Simulated network latency
    await new Promise((resolve) => setTimeout(resolve, 400));

    // 3. Local storage development adapter
    try {
      const stored = localStorage.getItem(NEWSLETTER_STORAGE_KEY);
      const subscribers: string[] = stored ? JSON.parse(stored) : [];

      if (subscribers.includes(trimmed)) {
        return {
          success: true,
          message: "You are already subscribed to the private journal. We'll be in touch!",
        };
      }

      subscribers.push(trimmed);
      localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(subscribers));

      return {
        success: true,
        message: 'Welcome to the Vastramay Journal. Your private preview invitation is on its way.',
      };
    } catch {
      return {
        success: true,
        message: 'Thank you for subscribing to our private journal.',
      };
    }
  },
};

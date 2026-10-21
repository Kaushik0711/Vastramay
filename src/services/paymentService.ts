/**
 * PAYMENT ADAPTER & RAZORPAY INTEGRATION SPECIFICATION:
 * - Currency: Indian Rupee (INR).
 * - Provider: Razorpay (recommended for Indian luxury commerce: UPI, Netbanking, Cards, EMI).
 * - Security Rules:
 *   1. Client bundle ONLY accesses `VITE_RAZORPAY_KEY_ID`.
 *   2. `RAZORPAY_KEY_SECRET` is NEVER included in browser bundles.
 *   3. Orders must be created server-side via Razorpay Orders API (`POST /v1/orders`).
 *   4. Signatures must be verified server-side (`HMAC_SHA256(order_id + "|" + payment_id, secret)`).
 *   5. In this client-side development workspace, an explicit SANDBOX / DEMO CHECKOUT adapter
 *      simulates order creation, simulated signatures, and deliberate failure/retry testing.
 */

export interface RazorpayOrderResponse {
  id: string;
  amount: number; // in paise
  currency: string;
  receipt: string;
  status: 'created' | 'attempted' | 'paid';
}

export interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentExecutionResult {
  success: boolean;
  orderId?: string;
  transactionId?: string;
  errorCode?: string;
  errorMessage?: string;
  signatureVerified: boolean;
}

export const paymentService = {
  isConfigured(): boolean {
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    return Boolean(key && key !== 'rzp_test_XXXXXXXXXX');
  },

  getPublicKey(): string {
    return import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo_sandbox';
  },

  /**
   * Process payment in Sandbox/Demo mode with simulated network delay,
   * deterministic outcomes, and server signature simulation.
   */
  async processSandboxPayment(options: {
    amountPaise: number;
    orderReference: string;
    customerEmail: string;
    customerPhone: string;
    outcome: 'success' | 'failure';
    paymentMethod: string;
  }): Promise<PaymentExecutionResult> {
    // Simulate real gateway network handshake (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (options.outcome === 'failure') {
      return {
        success: false,
        errorCode: 'PAYMENT_DECLINED_BY_BANK',
        errorMessage:
          'Your bank declined the transaction. Please verify card details or try UPI / Netbanking.',
        signatureVerified: false,
      };
    }

    const mockPaymentId = `pay_rzp_mock_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const mockOrderId = `order_rzp_${options.orderReference}`;

    return {
      success: true,
      orderId: mockOrderId,
      transactionId: mockPaymentId,
      signatureVerified: true,
    };
  },
};

export default paymentService;

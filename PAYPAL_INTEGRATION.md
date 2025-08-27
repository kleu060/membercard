# PayPal Integration Documentation

This document provides a comprehensive guide to the PayPal integration implemented in the Next.js application.

## Overview

The PayPal integration allows users to make payments for subscription plans and other services through PayPal's secure payment system. The integration uses PayPal's sandbox environment for testing and can be easily switched to production mode.

## Features Implemented

### 1. Backend API Endpoints

- **Create Order**: `/api/paypal/create-order` - Creates a PayPal payment order
- **Capture Order**: `/api/paypal/capture-order` - Captures and completes the payment
- **Get Order Details**: `/api/paypal/get-order` - Retrieves order information
- **Webhook Handler**: `/api/paypal/webhook` - Handles PayPal webhook notifications

### 2. Frontend Components

- **PayPalPayment**: A reusable React component for PayPal payments
- **PaymentModal**: A modal component for payment flow integration
- **PayPal Test Page**: A dedicated testing page at `/paypal-test`

### 3. Integration Points

- **Pricing Page**: Integrated with subscription plans
- **Test Page**: Complete testing environment

## Configuration

### Environment Variables

Add the following to your `.env` file:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_ENVIRONMENT=sandbox  # Change to 'live' for production
NEXT_PUBLIC_PAYPAL_CLIENT_ID=sb  # Use 'sb' for sandbox testing

# PayPal Webhook Configuration
PAYPAL_WEBHOOK_URL=http://localhost:3000/api/paypal/webhook
PAYPAL_WEBHOOK_ID=your_webhook_id
```

### PayPal Developer Setup

1. **Create PayPal Developer Account**
   - Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
   - Create a business account

2. **Create Application**
   - Navigate to "Apps & Credentials"
   - Create a new REST API app
   - Get your Client ID and Client Secret

3. **Sandbox Testing**
   - Use sandbox credentials for testing
   - Create sandbox test accounts in the dashboard

## Usage

### Basic Payment Component

```tsx
import PayPalPayment from '@/components/payments/PayPalPayment';

function MyComponent() {
  const handlePaymentSuccess = (details: any) => {
    console.log('Payment successful:', details);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
  };

  return (
    <PayPalPayment
      amount="10.00"
      currency="USD"
      description="Test Payment"
      onSuccess={handlePaymentSuccess}
      onError={handlePaymentError}
    />
  );
}
```

### API Usage

#### Create Order

```typescript
const response = await fetch('/api/paypal/create-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: '10.00',
    currency: 'USD',
    description: 'Payment description',
  }),
});

const data = await response.json();
const orderId = data.orderId;
```

#### Capture Order

```typescript
const response = await fetch('/api/paypal/capture-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    orderId: 'ORDER_ID_FROM_PAYPAL',
  }),
});

const captureData = await response.json();
```

## Testing

### Test Page

Visit `/paypal-test` to access the comprehensive testing interface:

1. **Configuration Panel**: Set amount, currency, and description
2. **Payment Panel**: Complete actual PayPal transactions
3. **Result Display**: View payment results and transaction details
4. **Instructions**: Complete testing guide

### Sandbox Test Accounts

Use these PayPal sandbox test credentials:

- **Buyer Account**: buyer@example.com / password
- **Seller Account**: seller@example.com / password

### Test Scenarios

1. **Successful Payment**: Complete a full payment flow
2. **Failed Payment**: Test error handling
3. **Different Currencies**: Test USD, EUR, GBP, etc.
4. **Different Amounts**: Test various payment amounts

## Webhook Integration

### Supported Events

- `PAYMENT.CAPTURE.COMPLETED` - Payment successfully completed
- `PAYMENT.CAPTURE.DENIED` - Payment was denied
- `PAYMENT.CAPTURE.PENDING` - Payment is pending
- `PAYMENT.CAPTURE.REFUNDED` - Payment was refunded

### Webhook Setup

1. **Create Webhook in PayPal Dashboard**
   - Go to PayPal Developer Dashboard
   - Navigate to Webhooks
   - Create new webhook
   - Set URL: `https://yourdomain.com/api/paypal/webhook`
   - Select event types to monitor

2. **Configure Environment**
   - Set `PAYPAL_WEBHOOK_URL` in your environment
   - Set `PAYPAL_WEBHOOK_ID` to your webhook ID

## Security Considerations

### Environment Variables

- Never commit real PayPal credentials to version control
- Use different credentials for development and production
- Keep Client Secret secure and never expose it client-side

### Webhook Verification

- All webhook requests are verified using PayPal's signature verification
- Ensure your webhook URL uses HTTPS in production
- Monitor webhook logs for suspicious activity

### Error Handling

- Comprehensive error handling in both frontend and backend
- User-friendly error messages
- Detailed logging for debugging

## Production Deployment

### Steps

1. **Update Environment Variables**
   ```env
   PAYPAL_ENVIRONMENT=live
   PAYPAL_CLIENT_ID=your_live_client_id
   PAYPAL_CLIENT_SECRET=your_live_client_secret
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_live_client_id
   ```

2. **Update Webhook URL**
   ```env
   PAYPAL_WEBHOOK_URL=https://yourdomain.com/api/paypal/webhook
   ```

3. **Configure PayPal Live App**
   - Switch your PayPal app from sandbox to live mode
   - Update webhook URL to production URL
   - Test with live credentials (small amounts)

### Testing in Production

1. Start with small test amounts ($1.00)
2. Verify webhook notifications are received
3. Check payment processing and database updates
4. Monitor for any errors or issues

## Troubleshooting

### Common Issues

#### 1. PayPal Buttons Not Loading
- **Cause**: Missing or incorrect Client ID
- **Solution**: Verify `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set correctly

#### 2. Order Creation Failed
- **Cause**: Invalid credentials or server configuration
- **Solution**: Check PayPal credentials and server logs

#### 3. Payment Capture Failed
- **Cause**: Order expired or invalid order ID
- **Solution**: Ensure order is captured within the valid time window

#### 4. Webhook Not Working
- **Cause**: Incorrect webhook URL or SSL issues
- **Solution**: Verify webhook configuration and use HTTPS

### Debugging

1. **Check Browser Console** for JavaScript errors
2. **Monitor Network Tab** for API requests and responses
3. **Review Server Logs** for backend errors
4. **Check PayPal Dashboard** for transaction history

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── paypal/
│   │       ├── create-order/route.ts
│   │       ├── capture-order/route.ts
│   │       ├── get-order/route.ts
│   │       └── webhook/route.ts
│   └── paypal-test/page.tsx
├── components/
│   └── payments/
│       ├── PayPalPayment.tsx
│       └── PaymentModal.tsx
└── lib/
    └── paypal.ts
```

## Dependencies

### Server-side
- `@paypal/paypal-server-sdk` - PayPal server SDK for API calls

### Client-side
- `@paypal/react-paypal-js` - React components for PayPal buttons
- `@paypal/paypal-js` - PayPal JS SDK loader

## Support

For issues related to:
- **PayPal API**: [PayPal Developer Support](https://developer.paypal.com/support/)
- **Integration Code**: Check the implementation and troubleshooting sections
- **Sandbox Testing**: Use the test page at `/paypal-test`

## Future Enhancements

1. **Subscription Management**: Implement recurring payments
2. **Multiple Payment Methods**: Add credit card direct processing
3. **Payment History**: User dashboard with transaction history
4. **Refund Processing**: Automated refund handling
5. **Multi-currency Support**: Dynamic currency conversion
6. **Mobile Optimization**: Enhanced mobile payment experience
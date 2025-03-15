
// Fix by ensuring all properties match PaymentAccount interface 
// and account_type matches expected values
is_active: true,
is_verified: false,
account_type: 'bank' as 'bank' | 'paypal' | 'stripe' | 'applepay' | 'individual' | 'business',

// Replace all other instances of string with properly typed account_type
account_type: data.accountType as 'bank' | 'paypal' | 'stripe' | 'applepay' | 'individual' | 'business',

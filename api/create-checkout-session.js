const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],   // ← UNIQUEMENT carte
  mode: 'payment',
  line_items: [
    {
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Commande StyleShop',
          description: items.map(i => `${i.name} x${i.qty}`).join(', '),
        },
        unit_amount: Math.round(total * 100),
      },
      quantity: 1,
    }
  ],
  shipping_address_collection: {
    allowed_countries: ['FR', 'BE', 'CH', 'LU', 'DE', 'IT', 'ES', 'GB', 'MA']
  },
  phone_number_collection: { enabled: true },
  metadata: { /* ... */ },
  success_url: `${baseUrl}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/?cancel=true`,
});

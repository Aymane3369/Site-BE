const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Taux de conversion (1 EUR = 10.5 MAD) – ajuste selon le marché
const EUR_TO_MAD_RATE = 10.5;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, total, clientEmail, promoCode, discount, orderId, country } = req.body;

    // 🌍 Détection du pays (par défaut FR si non renseigné)
    const userCountry = country || 'FR';

    // 🔁 Détermination de la devise et du montant
    let currency, unitAmount;
    if (userCountry === 'MA') {
      currency = 'mad';
      unitAmount = Math.round(total * EUR_TO_MAD_RATE * 100);
    } else {
      currency = 'eur';
      unitAmount = Math.round(total * 100);
    }

    // 💳 Klarna uniquement pour les pays où c'est dispo (hors Maroc)
    const paymentMethods = ['card'];
    if (userCountry !== 'MA') {
      paymentMethods.push('klarna');
    }

    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'https://boutiqueflechy.vercel.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethods, // ✅ Dynamique
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: currency, // ✅ 'eur' ou 'mad'
            product_data: {
              name: 'Commande StyleShop',
              description: items.map(i => `${i.name} x${i.qty}`).join(', '),
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        }
      ],
      success_url: `${baseUrl}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?cancel=true`,

      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'DE', 'IT', 'ES', 'GB', 'MA']
      },

      phone_number_collection: {
        enabled: true
      },

      metadata: {
        order_id: orderId || `ORD-${Date.now().toString(36).toUpperCase()}`,
        client_email: clientEmail,
        promo_code: promoCode || '',
        discount: String(discount || 0),
        items: JSON.stringify(items.map(i => ({
          productId: i.productId,
          variantId: i.variantId || null,
          qty: i.qty,
          price: i.price,
          name: i.name
        }))),
        country: userCountry,
        currency_used: currency,
      },
    });

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('❌ Erreur:', error);
    return res.status(500).json({ error: error.message });
  }
};

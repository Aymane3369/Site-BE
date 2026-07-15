// Exemple : appel fetch vers ton API
const response = await fetch('/api/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: cartItems,
    total: totalPrice,
    clientEmail: userEmail,
    promoCode: appliedPromo,
    discount: discountAmount,
    orderId: orderId,
    // 🌍 Récupération du pays de l'utilisateur (via IP ou géolocalisation)
    country: await getUserCountry() // voir fonction ci-dessous
  })
});

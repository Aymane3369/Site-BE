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
    country: await getUserCountry() // 👈 À implémenter
  })
});

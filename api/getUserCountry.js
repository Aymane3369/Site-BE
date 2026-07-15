// utils/getUserCountry.js
export async function getUserCountry() {
  try {
    // Appel gratuit à ip-api.com (limité à 45 requêtes/min)
    const response = await fetch('http://ip-api.com/json/');
    const data = await response.json();
    return data.countryCode; // ex: 'MA', 'FR', 'BE', etc.
  } catch (error) {
    console.warn('⚠️ Géolocalisation échouée, pays par défaut: FR');
    return 'FR'; // valeur par défaut
  }
}

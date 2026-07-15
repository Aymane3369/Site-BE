export async function getUserCountry() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return data.country_code; // 'FR', 'MA', 'BE', etc.
  } catch {
    return 'FR'; // valeur par défaut
  }
}

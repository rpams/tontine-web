// Test simple pour vérifier que l'API fonctionne
const testData = {
  username: "test_user_" + Date.now(),
  gender: "male",
  address: "Test Address",
  phone: "+22901234567",
  avatarUrl: "/avatars/avatar-1.svg",
  showUsernameByDefault: true
};

console.log("Test des nouveaux champs du profil...");
console.log("Données de test:", testData);

// Test avec fetch (simulation)
fetch('http://localhost:3000/api/profile/complete', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(result => {
  console.log("✅ Test réussi:", result);
})
.catch(error => {
  console.log("❌ Erreur attendue (pas d'auth):", error.message);
});
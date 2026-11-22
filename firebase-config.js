/* Configuração do Firebase do Fimapa.
   Como preencher (uma vez só):
   1. console.firebase.google.com → seu projeto → ⚙ Configurações do projeto → Seus apps → app Web (</>).
   2. Copie só o bloco  { apiKey: "...", authDomain: "...", projectId: "...", ... }
   3. Aqui no GitHub, clique no lápis (Edit), troque a palavra  null  abaixo pelo bloco copiado e salve (Commit changes).
   Esses dados identificam o projeto e são públicos por natureza; a proteção vem das regras do Firestore.
   Enquanto estiver  null, o Fimapa funciona normalmente, só sem a nuvem. */
const firebaseConfig = {
  apiKey: "AIzaSyDmGip5T0W2MZtPGHFMiurdFAQFhvdKrMo",
  authDomain: "fimapa-80557.firebaseapp.com",
  projectId: "fimapa-80557",
  storageBucket: "fimapa-80557.firebasestorage.app",
  messagingSenderId: "50895709940",
  appId: "1:50895709940:web:3c6e10a82cfd51133ee0a1"
};

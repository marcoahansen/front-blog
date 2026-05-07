export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

const API_URL = import.meta.env.VITE_API_URL;

const form = document.getElementById("registerForm") as HTMLFormElement;

form.addEventListener("submit", async (e: Event) => {
  e.preventDefault();
  const firstName = (document.getElementById("nome") as HTMLInputElement).value;
  const lastName = (document.getElementById("sobrenome") as HTMLInputElement)
    .value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const phone = (document.getElementById("telefone") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement)
    .value;

  const role = UserRole.USER;

  try {
    const response = await fetch(`${API_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
      }),
    });
    if (response.ok) {
      alert("Conta criada com sucesso! Agora faça seu login.");
      window.location.href = "login.html";
    } else {
      const data = await response.json();
      alert(`Erro no cadastro: ${data.message || "Verifique os dados"}`);
    }
  } catch (error) {
    alert("Erro ao conectar com o sevidor.");
  }
});

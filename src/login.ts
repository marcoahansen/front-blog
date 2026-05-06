const form = document.getElementById("loginForm") as HTMLFormElement;

form.addEventListener("submit", async (e: Event) => {
  e.preventDefault();
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement)
    .value;
  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error("Credenciais inválidas");
    }
    const data = await response.json();
    localStorage.setItem("@token", data.token);
    localStorage.setItem("@user", JSON.stringify(data.user));
    window.location.href = "/index.html";
  } catch (err) {
    alert(err instanceof Error ? err.message : "Erro ao conectar com a api");
  }
});

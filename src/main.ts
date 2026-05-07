import { createIcons, Trash2, LogOut } from "lucide";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
}
interface Post {
  id: number;
  title: string;
  content: string;
  user: User;
}

enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

const API_URL = import.meta.env.VITE_API_URL;

const getAuthData = () => {
  const token = localStorage.getItem("@token");
  const userStorage = JSON.parse(localStorage.getItem("@user"));
  const user = userStorage ? userStorage : null;
  return { token, user };
};

const navArea = document.getElementById("nav-area")!;
const postContainer = document.getElementById("post-container")!;

const setupHeader = () => {
  const { token, user } = getAuthData();
  if (token && user) {
    navArea.innerHTML = /*html*/ `
    <div class="flex items-center gap-4">
      <span class="text-gray-600">Olá, <strong>${user.name}</strong></span>
      <button id="btnLogout" class="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all">
        <i data-lucide="log-out" class="w-5 h-5"></i>
      </button>
    </div>
    `;
    const btnLogout = document.getElementById("btnLogout");
    btnLogout.addEventListener("click", handleLogout);
  } else {
    navArea.innerHTML = /*html*/ `
    <a href="/login.html" class="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded">Login</a>
    `;
  }
};

const handleLogout = () => {
  localStorage.removeItem("@token");
  localStorage.removeItem("@user");

  setupHeader();
  fetchPosts();
};

const fetchPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/api/posts`);
    const posts = (await response.json()) as Post[];
    renderPosts(posts);
  } catch (error) {
    postContainer.innerHTML = /*html*/ `
    <p class="text-red-500">Erro ao carregar posts</p>
    `;
  }
};

const renderPosts = (posts: Post[]) => {
  const { user } = getAuthData();
  postContainer.innerHTML = "";
  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className =
      "bg-white p-4 rounded shadow flex justify-between items-center";

    const isOwner = user && user.id === post.user.id;
    const isAdmin = user && user.role === UserRole.ADMIN;
    const canDelete = isOwner || isAdmin;

    card.innerHTML = /*html*/ `
      <div>
        <h3 class="font-bold text-lg">${post.title}</h3>
        <p class="text-gray-600">${post.content}</p>
        <span class="text-sm text-gray-400">${post.user.firstName}</span>
      </div>
      <div id="btn-container-${post.id}"></div>
    `;
    if (canDelete) {
      const btn = document.createElement("button");
      btn.className = "group p-2 rounded-lg hover:bg-red-50 hover:text-red-600";
      btn.innerHTML = /*html*/ `<i data-lucide="trash-2" class="w-5 h-5"></i>`;
      btn.addEventListener("click", () => deletePost(post.id));
      card.querySelector(`#btn-container-${post.id}`)?.appendChild(btn);
    }
    postContainer.appendChild(card);
    createIcons({
      icons: {
        Trash2,
        LogOut,
      },
    });
  });
};

const deletePost = async (id: number) => {
  const { token } = getAuthData();
  if (!confirm("Deseja realmente apagar este post?")) return;

  try {
    const response = await fetch(`${API_URL}/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      fetchPosts();
    } else {
      const error = await response.json();
      alert(`Erro: ${error.message || "Sem permissão para deletar."}`);
    }
  } catch (error) {
    alert("Erro de conexão com o servidor.");
  }
};

setupHeader();
fetchPosts();

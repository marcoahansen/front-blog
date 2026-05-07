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

const API_URL = import.meta.env.VITE_API_URL;

const token = localStorage.getItem("@token");
const userStorage = JSON.parse(localStorage.getItem("@user"));
const user = userStorage ? userStorage : null;

const navArea = document.getElementById("nav-area")!;
const postContainer = document.getElementById("post-container")!;

const setupHeader = () => {
  if (token && user) {
    navArea.innerHTML = /*html*/ `
    <span class="mr-4 text-gray-600">Olá, <strong>${user.name}</strong></span>
    <button id="btnLogout" class="text-red-500 hover:text-red-600 hover:underline font-bold">Sair</button>
    `;
  } else {
    navArea.innerHTML = /*html*/ `
    <a href="/login.html" class="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded">Login</a>
    `;
  }
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
  postContainer.innerHTML = "";
  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className =
      "bg-white p-4 rounded shadow flex justify-between items-center";

    card.innerHTML = /*html*/ `
      <div>
        <h3 class="font-bold text-lg">${post.title}</h3>
        <p class="text-gray-600">${post.content}</p>
        <span class="text-sm text-gray-400">${post.user.firstName}</span>
      </div>
    `;
    postContainer.appendChild(card);
  });
};

setupHeader();
fetchPosts();

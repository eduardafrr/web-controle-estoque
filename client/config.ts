
export const BACKEND_URL = "http://localhost:36380";
export const GOOGLE_LOGIN_URL = `${BACKEND_URL}/auth/login`;
export const LOGOUT_URL = `${BACKEND_URL}/auth/logout`;

export const ENDPOINTS = {
	categorias: `${BACKEND_URL}/categoria`,
	produtos: `${BACKEND_URL}/produto`,
	novoProduto: `${BACKEND_URL}/produto/novo`,
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = async (url, method = "GET", body = null, token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

    let data;
    try {
      data = await res.json();
    } catch {
      data = null;  // fallback if no JSON body
    }

    if (!res.ok) throw new Error(data?.detail || "API Error");

    return data;
};

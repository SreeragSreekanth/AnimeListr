const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = async (
  url,
  method = "GET",
  body = null,
  token = null,
  isMultipart = false
) => {
  const headers = {};

  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    body: body ? (isMultipart ? body : JSON.stringify(body)) : null,
  });

  let data;
  try {
    // Handle 204 No Content and other empty responses
    data = await response.text();
    data = data ? JSON.parse(data) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      (typeof data === "object"
        ? Object.values(data).flat().join(" ")
        : "API Error");

    const error = new Error(message);
    error.data = data;
    throw error;
  }

  return data;
};

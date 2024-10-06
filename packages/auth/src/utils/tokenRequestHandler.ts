import { ApiError } from "../Api";

export async function tokenRequestHandler(
  method: string = "GET",
  url: string,
  token?: string
): Promise<any> {
  try {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method,
      headers,
      credentials: "include",
      ...(token ? { body: JSON.stringify({ token }) } : {}),
    });

    if (!response.ok) {
      throw new ApiError(response, "Failed Api Request for " + url);
    }

    return response.json();
  } catch (error) {
    console.error(`Error with ${method} request:`, error);
  }
}

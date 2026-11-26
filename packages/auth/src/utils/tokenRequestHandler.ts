export async function tokenRequestHandler(
  method: string = "GET",
  url: string,
  token?: string
): Promise<any> {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...(token ? { body: JSON.stringify({ token }) } : {}),
  });

  // The app's GET endpoint returns 400 when the session cookie is absent.
  if (method === "GET" && response.status === 400) {
    const body = (await response.text()).trim();
    const missingCookie = ["no cookie header", "ec-token not found"];
    if (
      missingCookie.some(
        (reason) => body === reason || body === JSON.stringify(reason)
      )
    ) {
      return null;
    }
  }
  if (!response.ok) {
    throw new Error(
      `Session cookie ${method} failed (HTTP ${response.status}).`
    );
  }
  return response.json();
}

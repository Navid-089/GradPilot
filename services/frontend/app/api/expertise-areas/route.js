export async function GET() {
  try {
    const response = await fetch("http://login-reg:8082/api/expertise-areas");

    if (!response.ok) {
      throw new Error("Failed to fetch expertise areas");
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching expertise areas:", error);
    return Response.json(
      { error: "Failed to fetch expertise areas" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch("http://login-reg:8082/api/universities");

    if (!response.ok) {
      throw new Error("Failed to fetch universities");
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching universities:", error);
    return Response.json(
      { error: "Failed to fetch universities" },
      { status: 500 }
    );
  }
}

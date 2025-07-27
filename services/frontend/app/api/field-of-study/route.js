export async function GET() {
  try {
    const response = await fetch("http://login-reg:8082/api/fields-of-study");

    if (!response.ok) {
      throw new Error("Failed to fetch fields of study");
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching fields of study:", error);
    return Response.json(
      { error: "Failed to fetch fields of study" },
      { status: 500 }
    );
  }
}

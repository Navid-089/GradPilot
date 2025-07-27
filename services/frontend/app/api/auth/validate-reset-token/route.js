const API_URL = "https://gradpilot.me"; // Update with your actual API URL
// const API_URL = "http://localhost:8082"; // Use the correct backend URL
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(false, { status: 400 });
    }

    const response = await fetch(
      `http://login-reg:8082/api/v1/auth/validate-reset-token?token=${encodeURIComponent(
        token
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const isValid = await response.json();

    return NextResponse.json(isValid, { status: 200 });
  } catch (error) {
    console.error("Validate reset token API error:", error);
    return NextResponse.json(false, { status: 500 });
  }
}

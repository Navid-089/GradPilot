import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(
      "http://login-reg:8082/api/v1/mentor/auth/mentor-forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.text();

    if (response.ok) {
      return NextResponse.json({ message: data }, { status: 200 });
    } else {
      return NextResponse.json({ error: data }, { status: response.status });
    }
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

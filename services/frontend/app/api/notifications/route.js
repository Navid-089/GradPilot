import { NextResponse } from "next/server";

export async function GET(req) {
  const { search } = new URL(req.url);
  // Change this URL to your backend's notifications endpoint
  const backendUrl = `http://forum:8085/api/notifications${search}`;

  // Forward cookies for authentication if needed
  const headers = {};
  if (req.headers.get("cookie")) {
    headers["cookie"] = req.headers.get("cookie");
  }

  try {
    const response = await fetch(backendUrl, {
      method: "GET",
      headers,
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

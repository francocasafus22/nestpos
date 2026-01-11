import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  const page = request.nextUrl.searchParams.get("page");

  const url = `${process.env.API_URL}/transactions?date=${date}&page=${page}`;
  const req = await fetch(url);
  const response = await req.json();

  return Response.json(response);
}

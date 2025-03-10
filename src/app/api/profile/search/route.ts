import { NextResponse } from "next/server";
import { searchProfiles } from "@/app/hladat/actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    const profiles = await searchProfiles(query);
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error searching profiles:', error);
    return NextResponse.json(
      { error: "Nastala chyba pri vyhľadávaní" },
      { status: 500 }
    );
  }
}

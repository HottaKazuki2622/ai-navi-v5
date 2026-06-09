import { NextRequest, NextResponse } from "next/server";
import { generate, GenerateInput } from "@/lib/generator";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.whatToBuild !== "string") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const input: GenerateInput = {
    whatToBuild: body.whatToBuild?.trim() ?? "",
    techStack: body.techStack?.trim() ?? "",
    currentSituation: body.currentSituation?.trim() ?? "",
  };

  if (!input.whatToBuild) {
    return NextResponse.json({ error: "「作りたいもの」は必須です" }, { status: 422 });
  }

  const result = generate(input);
  return NextResponse.json(result);
}

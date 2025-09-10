import { authClient } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, name, role } = body;

  try {
    // 1. Création via Better Auth
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    const userId = data?.user?.id;

    // 2. Mise à jour du user avec des champs personnalisés
    await prisma.user.update({
      where: { id: userId },
      data: {
        role,
      },
    });

    return NextResponse.json({success: true});
  } catch (e) {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { cache } from "react";

// Utilisation de cache() pour éviter de répéter les requêtes identiques dans une même page
export const getUser = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session?.user;
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return null;
  }
});

export const getSession = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session;
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return null;
  }
});
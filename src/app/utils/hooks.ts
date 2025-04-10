import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function requireUser() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function getUserData(){
  const session = await auth();
  return {
    userId:session?.user?.id
  }
}
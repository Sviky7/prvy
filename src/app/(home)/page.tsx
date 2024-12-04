import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import NonAuthHomeView from "@/sections/HomeViews/NonAuthHomeView";
import HomeLoader from "@/components/Loader";

export const metadata = { title: "Domov | ZoškaSnap" };

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  session ? redirect("/prispevok") : null;

  return (
    // todo loading component
    <Suspense fallback={<HomeLoader />}>
      <NonAuthHomeView />
    </Suspense>
  );
}








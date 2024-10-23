import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/authOptions"
import AuthHomeView from "@/sections/HomeViews/AuthHomeView"
import NonAuthHomeView from "@/sections/HomeViews/NonAuthHomeView"

export const metadata = { title: "Domov | ZoškaSnap" }

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return session ? <AuthHomeView /> : <NonAuthHomeView />
}











import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/authOptions"
import AuthHomeView from "@/sections/HomeViews/AuthHomeView"
import NonAuthHomeView from "@/sections/HomeViews/NonAuthHomeView"
import { Suspense } from "react"

export const metadata = { title: "Domov | ZoškaSnap" }

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return(
    <>
    <Suspense fallback={<div>Loading...</div>}>
    {session ? <AuthHomeView/> : <NonAuthHomeView/> }
    </Suspense>
    </>
  )
}




  








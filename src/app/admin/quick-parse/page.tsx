import type { Metadata } from "next"
import QuickParseTester from "./QuickParseTester"

export const metadata: Metadata = {
  title: "Test inserimento rapido",
}

export default function QuickParsePage() {
  return <QuickParseTester />
}

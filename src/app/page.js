import { redirect } from "next/navigation";

export default function RootIndex() {
  redirect("/en"); // 307 (temporal) por defecto
}
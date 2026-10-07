import { redirect } from "next/navigation";

/**
 * `/countdown` was where this lived while it was a prototype. It is the site
 * root now, so this keeps old links and bookmarks working.
 */
export default function CountdownPage() {
  redirect("/");
}

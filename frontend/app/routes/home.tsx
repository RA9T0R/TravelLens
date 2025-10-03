import type { Route } from "./+types/home";
import { Main } from "~/page/main";
import { ShowData } from "~/page/show_data";

import api from "~/components/api";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <div>
    <Main/>
   
  </div>;
}

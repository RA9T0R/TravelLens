import type { Route } from "./+types/home";
// import { Predict } from "~/page/predict";
// import { ShowData } from "~/page/show_data";
// import UploadData from "~/page/upload_data";
import { Link } from "react-router";
import api from "~/components/api";
import Navbar from "~/components/Navbar";
import Welcome from "~/page/Welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="bg-gray-100">
      <Welcome />
    </div>
  );
}

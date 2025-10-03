import type { Route } from "./+types/home";
import Welcome from "~/routes/Welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Travel Lens" },
    { name: "Machine Learning Project", content: "Content based image retrieval​" },
  ];
}

export default function Home() {
  return (
    <div className="bg-gray-100">
      <Welcome />
    </div>
  );
}

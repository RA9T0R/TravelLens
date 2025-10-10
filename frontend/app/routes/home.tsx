import type { Route } from "./+types/home";
import Welcome from "~/routes/Welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TravelLens" },
    { name: "Machine Learning Project", content: "Content based image retrieval​" },
  ];
}

export default function Home() {
  return (
    <div>
      <Welcome />
    </div>
  );
}

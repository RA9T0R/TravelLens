import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),          // Home page
  route("/predict", "routes/predict.tsx"),      // Predict page
  route("/AllImage", "routes/show_data.tsx"),  // All Images page
  route("/upload_data", "routes/upload_data.tsx"), // Upload Data page
  route("/description", "routes/description.tsx"), // Description page
] satisfies RouteConfig;

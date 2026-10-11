import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/HomePage/index.js";
import ApodContentPage from "../pages/ApodContentPage/index.js";
import { ROUTES } from "../constants/routes";

export const router = createBrowserRouter([
  { path: ROUTES.HOME, element: <HomePage /> },
  { path: ROUTES.CONTENT, element: <ApodContentPage /> },
]);

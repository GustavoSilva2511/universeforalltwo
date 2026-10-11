import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/HomePage";
import ApodContentPage from "../pages/ApodContentPage";
import { ROUTES } from "../constants/routes";

export const router = createBrowserRouter([
  { path: ROUTES.HOME, element: <HomePage /> },
  { path: ROUTES.CONTENT, element: <ApodContentPage /> },
]);

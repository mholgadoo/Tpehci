import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Espacios } from "./components/Espacios";
import { Ajustes } from "./components/Ajustes";
import { Escenas } from "./components/Escenas";
import { SpaceDetail } from "./components/SpaceDetail";
import { Shortcuts } from "./components/Shortcuts";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Espacios },
      { path: "espacio/:homeId/:spaceId", Component: SpaceDetail },
      { path: "espacio/:spaceId", Component: SpaceDetail },
      { path: "ajustes", Component: Ajustes },
      { path: "escenas", Component: Escenas },
      { path: "shortcuts", Component: Shortcuts },
    ],
  },
]);

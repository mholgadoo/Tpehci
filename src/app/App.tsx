import { RouterProvider } from "react-router";
import { AccountProvider } from "./context/account-context";
import { HomeProvider } from "./context/home-context";
import { router } from "./routes";

export default function App() {
  return (
    <AccountProvider>
      <HomeProvider>
        <RouterProvider router={router} />
      </HomeProvider>
    </AccountProvider>
  );
}

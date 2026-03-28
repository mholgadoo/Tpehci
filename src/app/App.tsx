import { RouterProvider } from "react-router";
import { AccountProvider } from "./context/account-context";
import { HomeProvider } from "./context/home-context";
import { Toaster } from "./components/ui/sonner";
import { router } from "./routes";

export default function App() {
  return (
    <AccountProvider>
      <HomeProvider>
        <RouterProvider router={router} />
        <Toaster />
      </HomeProvider>
    </AccountProvider>
  );
}

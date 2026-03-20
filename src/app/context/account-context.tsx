import { createContext, useContext, useState, type ReactNode } from "react";

export interface Account {
  id: string;
  name: string;
  email: string;
}

const accountOptions: Account[] = [
  { id: "matias", name: "Matías Ibarra", email: "matias@mihogar.app" },
  { id: "sofia", name: "Sofía Costa", email: "sofia@mihogar.app" },
  { id: "invitado", name: "Cuenta Invitada", email: "invitado@mihogar.app" },
];

interface AccountContextValue {
  accountOptions: Account[];
  selectedAccount: Account;
  setSelectedAccount: (account: Account) => void;
  sessionClosed: boolean;
  setSessionClosed: (closed: boolean) => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [selectedAccount, setSelectedAccount] = useState(accountOptions[0]);
  const [sessionClosed, setSessionClosed] = useState(false);

  return (
    <AccountContext.Provider
      value={{
        accountOptions,
        selectedAccount,
        setSelectedAccount,
        sessionClosed,
        setSessionClosed,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }

  return context;
}

export const getAccountInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

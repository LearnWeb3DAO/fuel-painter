import { Dispatch, SetStateAction } from "react";

interface NavbarProps {
  account: string;
  setAccount: Dispatch<SetStateAction<string>>;
}

export default function Navbar({ account, setAccount }: NavbarProps) {
  async function connect() {
    if (!!account) return null;

    if (window.fuel) {
      try {
        await window.fuel.connect();
        const [account] = await window.fuel.accounts();
        setAccount(account);
      } catch (err) {
        console.log("error connecting: ", err);
      }
    }
  }

  return (
    <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-900">
      <p className="text-2xl font-medium">Fuel Painter</p>

      <button
        className="bg-green-400 hover:bg-green-500 transition-all rounded-lg px-4 py-2 text-slate-900 font-medium"
        onClick={connect}
      >
        {!account
          ? "Connect Wallet"
          : `Hello, ${account.substring(0, 8)}...${account.substring(59)}`}
      </button>
    </div>
  );
}

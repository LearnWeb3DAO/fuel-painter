import { PainterContractID } from "@/constants";
import { PainterContractAbi__factory } from "@/contracts/factories/PainterContractAbi__factory";
import { Dispatch, SetStateAction, useEffect } from "react";

interface InitContractProps {
  account: string;
  initialized: boolean;
  setInitialized: Dispatch<SetStateAction<boolean>>;
}

export default function InitContract({
  account,
  initialized,
  setInitialized,
}: InitContractProps) {
  async function initialize() {
    if (window.fuel) {
      const wallet = await window.fuel.getWallet(account);
      const contract = PainterContractAbi__factory.connect(
        PainterContractID,
        wallet
      );
      try {
        await contract.functions
          .initialize_pixels()
          .txParams({ gasPrice: 50 })
          .call();
        await getInitialized();
      } catch (err) {
        console.log("error sending transaction...", err);
      }
    }
  }

  async function getInitialized() {
    if (window.fuel) {
      const wallet = await window.fuel.getWallet(account);
      const contract = PainterContractAbi__factory.connect(
        PainterContractID,
        wallet
      );
      const { value } = await contract.functions.is_initialized().simulate();
      setInitialized(value);
    }
  }

  useEffect(() => {
    if (account) {
      getInitialized();
    }
  }, [account]);

  if (!account) return null;

  if (!initialized) {
    return (
      <div className="flex mx-auto flex-col gap-4">
        <p>
          The contract hasn&apos;t been initialized yet. Please initialize the
          contract first.
        </p>

        <button
          className="bg-green-400 hover:bg-green-500 transition-all rounded-lg px-4 py-2 text-slate-900 font-medium"
          onClick={initialize}
        >
          Initialize Contract
        </button>
      </div>
    );
  }

  return null;
}

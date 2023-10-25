import InitContract from "@/components/init-contract";
import Navbar from "@/components/navbar";
import PaintGrid from "@/components/paint-grid";
import { PainterContractID } from "@/constants";
import { ColorOutput } from "@/contracts/PainterContractAbi";
import { useEffect, useState } from "react";
import { PainterContractAbi__factory } from "../contracts";

export default function Home() {
  const [account, setAccount] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [pixels, setPixels] = useState<ColorOutput[][]>([[]]);

  async function getPixels() {
    if (window.fuel && initialized) {
      const wallet = await window.fuel.getWallet(account);
      const contract = PainterContractAbi__factory.connect(
        PainterContractID,
        wallet
      );
      try {
        const { value } = await contract.functions.get_pixels().simulate();
        setPixels(value);
        console.log({ value });
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    if (account && initialized) {
      getPixels();
    }
  }, [account, initialized]);

  return (
    <div className="flex flex-col w-full">
      <Navbar account={account} setAccount={setAccount} />
      {account ? (
        <div className="flex flex-col gap-4">
          <InitContract
            account={account}
            initialized={initialized}
            setInitialized={setInitialized}
          />
          {pixels && <PaintGrid pixels={pixels} account={account} />}
        </div>
      ) : (
        <p className="text-lg mx-auto font-medium p-4">
          Please connect your wallet.
        </p>
      )}
    </div>
  );
}

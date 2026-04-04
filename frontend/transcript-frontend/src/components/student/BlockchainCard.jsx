import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle } from "lucide-react";

const BlockchainCard = ({ status, txId }) => {

  const isVerified = status === "VERIFIED";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`p-6 rounded-2xl shadow-md text-white hover:shadow-lg transition
        ${isVerified
          ? "bg-gradient-to-r from-green-500 to-emerald-600"
          : "bg-gradient-to-r from-red-500 to-pink-600"}`}
    >

      <div className="flex items-center gap-3">

        {isVerified ? (
          <ShieldCheck size={28} />
        ) : (
          <AlertTriangle size={28} />
        )}

        <h2 className="text-xl font-semibold">
          {isVerified ? "Verified on Blockchain" : "Tampered Data"}
        </h2>

      </div>

      <p className="text-sm mt-2 opacity-90 break-all">
        Tx: {txId}
      </p>

      <a
        href={`https://sepolia.etherscan.io/tx/${txId}`}
        target="_blank"
        className="inline-block mt-3 underline text-sm"
      >
        View on Etherscan →
      </a>

    </motion.div>
  );
};

export default BlockchainCard;
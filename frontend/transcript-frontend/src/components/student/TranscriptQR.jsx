import { QRCodeCanvas } from "qrcode.react";

const TranscriptQR = ({ id }) => {

  const verifyUrl = `${window.location.origin}/verify?id=${id}`;

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">

      <h2 className="text-lg font-semibold mb-4">
        Verify Transcript
      </h2>

      <QRCodeCanvas
        value={verifyUrl}
        size={160}
        className="mx-auto"
      />

      <p className="text-sm text-slate-500 mt-3">
        Scan to verify authenticity
      </p>

    </div>
  );
};

export default TranscriptQR;
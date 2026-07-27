import React from "react";

export default function QRCodeImage({ data, size = 400, className = "" }) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&bgcolor=ffffff&color=1a4d2e`;
  return (
    <img
      src={url}
      alt={`QR code for ${data}`}
      className={`rounded-2xl bg-white p-4 ${className}`}
      width={size}
      height={size}
    />
  );
}
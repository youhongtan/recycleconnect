import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import QRCodeImage from "@/components/qr/QRCodeImage";
import { Download, QrCode, Loader2 } from "lucide-react";

export default function QRManagement() {
  const [centres, setCentres] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.RecyclingCentre.list().then((c) => { setCentres(c); setLoading(false); });
  }, []);

  const generate = async (c) => {
    const qrId = c.name.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8) + "_" + c.id.slice(-4).toUpperCase();
    const updated = await base44.entities.RecyclingCentre.update(c.id, { qr_code_id: qrId });
    setCentres((prev) => prev.map((x) => (x.id === c.id ? updated : x)));
    setSelected(updated);
  };

  const checkInUrl = selected ? `${window.location.origin}/check-in?centre=${selected.id}` : "";

  if (loading) return <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">QR Code Management</h1>
        <p className="text-muted-foreground mt-1">Generate QR codes for recycling centre check-ins.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass orbital p-4 space-y-2 max-h-[600px] overflow-auto">
          {centres.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className={`w-full text-left p-3 rounded-2xl transition ${selected?.id === c.id ? "bg-primary/12 ring-2 ring-primary" : "hover:bg-primary/5"}`}
            >
              <p className="font-medium text-sm truncate">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.qr_code_id ? `✓ ${c.qr_code_id}` : "No QR code yet"}</p>
            </button>
          ))}
        </div>
        <div className="glass orbital p-6">
          {selected ? (
            <div className="text-center space-y-4">
              <h2 className="font-bold text-lg">{selected.name}</h2>
              {selected.qr_code_id ? (
                <>
                  <QRCodeImage data={checkInUrl} size={320} className="mx-auto" />
                  <p className="text-sm font-mono text-muted-foreground">{selected.qr_code_id}</p>
                  <p className="text-xs text-muted-foreground break-all">{checkInUrl}</p>
                  <a
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(checkInUrl)}&bgcolor=ffffff&color=1a4d2e`}
                    download={`${selected.qr_code_id}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-primary text-primary-foreground font-semibold"
                  >
                    <Download className="w-4 h-4" /> Download QR
                  </a>
                </>
              ) : (
                <div className="py-12">
                  <QrCode className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No QR code generated yet.</p>
                  <button onClick={() => generate(selected)} className="h-12 px-6 rounded-full bg-primary text-primary-foreground font-semibold">Generate QR Code</button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-muted-foreground">
              <QrCode className="w-12 h-12 mx-auto mb-3" />
              <p>Select a centre to manage its QR code.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
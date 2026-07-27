import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, Loader2, Recycle } from "lucide-react";
import { Image } from "@/components/ui/image";

const SCHEMA = {
  type: "object",
  properties: {
    item: { type: "string" },
    material: { type: "string" },
    recyclable: { type: "string" },
    instructions: { type: "string" },
    tip: { type: "string" },
  },
};

export default function ScanPanel() {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);
    setLoading(true);
    setPreview(URL.createObjectURL(file));
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const res = await base44.integrations.Core.InvokeLLM({
      prompt:
        "You are a Malaysian recycling expert. Look at this photo and identify the item. Reply with: the item name, its material, whether it is recyclable in Malaysia (and any conditions), step-by-step preparation instructions, and one short environmental tip. Keep language simple and friendly.",
      file_urls: [file_url],
      response_json_schema: SCHEMA,
    });
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="glass orbital soft-shadow p-8">
      <h2 className="text-2xl font-semibold">Scan an item</h2>
      <p className="mt-2 text-muted-foreground text-sm">
        Take or upload a photo and our AI will tell you exactly what to do with it.
      </p>

      <label className="mt-6 flex flex-col items-center justify-center gap-3 h-48 rounded-3xl border-2 border-dashed border-primary/40 cursor-pointer hover:bg-primary/5 transition">
        <Upload className="w-7 h-7 text-primary" aria-hidden="true" />
        <span className="font-medium">Upload or take a photo</span>
        <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={onFile} />
      </label>

      {preview && (
        <div className="mt-6 relative overflow-hidden rounded-3xl">
          <img src={preview} alt="Item you uploaded" className="w-full h-56 object-cover" />
          {loading && (
            <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm grid place-items-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {[
            ["Item", result.item],
            ["Material", result.material],
            ["Recyclable?", result.recyclable],
            ["Eco tip", result.tip],
          ].map(([label, value]) => (
            <div key={label} className="glass rounded-3xl p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className="mt-1 font-medium">{value}</p>
            </div>
          ))}
          <div className="glass rounded-3xl p-5 sm:col-span-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Recycle className="w-3.5 h-3.5" /> How to recycle it
            </p>
            <p className="mt-1 whitespace-pre-line">{result.instructions}</p>
          </div>
        </div>
      )}

      {!preview && (
        <Image
          src="https://media.base44.com/images/public/6a67017a886f99eed0748a3d/1965cd0ea_generated_052a74bb.png"
          alt="Abstract 3D neural network made of glowing green leaves"
          className="mt-8 w-full h-48 orbital"
          fittingType="fit"
        />
      )}
    </div>
  );
}
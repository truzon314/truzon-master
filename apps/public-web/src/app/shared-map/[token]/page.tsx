"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getSharedMapDetails } from "@/modules/properties/api";
import { PropertyLocationMap } from "@/modules/properties/PropertyLocationMap";
import { Lock, MapPin, ShieldAlert, KeyRound, Loader2 } from "lucide-react";

export default function SharedMapPage() {
  const params = useParams();
  const token = params?.token as string;

  const [password, setPassword] = useState("");
  const [mapData, setMapData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMap = async (pwd?: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await getSharedMapDetails(token, pwd);
      if (res?.project) {
        setMapData(res);
        setRequiresPassword(false);
      } else {
        setErrorMsg("Shared map not found or link has expired.");
      }
    } catch (err: any) {
      if (err.message?.includes("Password required") || err.message?.includes("Incorrect password")) {
        setRequiresPassword(true);
        if (pwd) setErrorMsg("Incorrect password. Please try again.");
      } else {
        setErrorMsg(err.message || "Failed to load shared map.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMap();
    }
  }, [token]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) fetchMap(password);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 gap-3">
        <Loader2 className="h-8 w-8 text-[#d4af37] animate-spin" />
        <span className="text-sm font-medium">Loading Shared GIS Map...</span>
      </div>
    );
  }

  if (requiresPassword) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-[#d4af37]/10 text-[#d4af37] rounded-full border border-[#d4af37]/30">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold">Password Protected Shared Map</h2>
            <p className="text-xs text-slate-400">
              This interactive map requires a security password to view.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-xs text-red-400">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enter Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#d4af37] hover:bg-[#c29f2d] text-slate-950 font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-all"
            >
              <KeyRound className="h-4 w-4" /> Unlock Map
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (errorMsg || !mapData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 text-center space-y-3 shadow-xl">
          <ShieldAlert className="h-10 w-10 text-red-400 mx-auto" />
          <h3 className="font-bold text-base text-slate-100">Map Unavailable</h3>
          <p className="text-xs text-slate-400">{errorMsg || "Invalid map link."}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col space-y-4">
      {/* Top Banner */}
      <header className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-[#d4af37]/10 text-[#d4af37] rounded-lg border border-[#d4af37]/30">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-bold text-lg text-slate-100">{mapData.project.name}</h1>
            {mapData.project.description && (
              <p className="text-xs text-slate-400">{mapData.project.description}</p>
            )}
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-start md:self-auto">
          <span>
            Layers: <strong className="text-slate-200">{mapData.layers.length}</strong>
          </span>
          <span>•</span>
          <span>Truzon GIS Platform</span>
        </div>
      </header>

      {/* Main Map Viewport */}
      <div className="flex-1 min-h-[600px] rounded-xl overflow-hidden border border-slate-800">
        <PropertyLocationMap projectId={mapData.project.id} />
      </div>
    </main>
  );
}

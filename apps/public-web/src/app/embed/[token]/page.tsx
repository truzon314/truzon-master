"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getSharedMapDetails } from "@/modules/properties/api";
import { PropertyLocationMap } from "@/modules/properties/PropertyLocationMap";
import { Loader2 } from "lucide-react";

export default function EmbedMapPage() {
  const params = useParams();
  const token = params?.token as string;

  const [mapData, setMapData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) return;
    getSharedMapDetails(token)
      .then((res) => {
        if (res?.project) {
          setMapData(res);
        } else {
          setErrorMsg("Embedded map not available.");
        }
      })
      .catch((err) => {
        setErrorMsg(err.message || "Failed to load embedded map.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-2">
        <Loader2 className="h-6 w-6 text-[#d4af37] animate-spin" />
        <span className="text-xs">Loading embedded GIS map...</span>
      </div>
    );
  }

  if (errorMsg || !mapData) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center p-4 text-slate-400 text-xs">
        {errorMsg || "Map unavailable"}
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950">
      <PropertyLocationMap projectId={mapData.project.id} />
    </div>
  );
}

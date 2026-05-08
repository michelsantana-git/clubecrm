"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Importar o CRM dinamicamente para evitar problemas de SSR
const CRMApp = dynamic(() => import("./crm-app"), { 
  ssr: false,
  loading: () => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#f0f4f8", fontFamily:"sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:40, height:40, border:"3px solid #1d6aff30", borderTopColor:"#1d6aff", borderRadius:"50%", animation:"spin 0.7s linear infinite", margin:"0 auto 16px" }} />
        <div style={{ fontSize:14, color:"#6b7f99" }}>Carregando ClubeCRM...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
});

interface Props {
  userEmail: string;
  userName: string;
  userId: string;
}

export default function CRMWrapper({ userEmail, userName, userId }: Props) {
  return <CRMApp userEmail={userEmail} userName={userName} userId={userId} />;
}

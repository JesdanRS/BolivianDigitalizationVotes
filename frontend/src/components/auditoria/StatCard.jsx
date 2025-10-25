import React from 'react';
const StatCard = ({ label, value, hint }) => (
  <div style={{
    background:'#fff',border:'1px solid #e5e7eb',borderRadius:14,padding:18,minWidth:180
  }}>
    <div style={{fontSize:12,color:'#6b7280'}}>{label}</div>
    <div style={{fontSize:28,fontWeight:800,marginTop:4,color:'#111'}}>{value}</div>
    {hint && <div style={{fontSize:12,color:'#9ca3af',marginTop:6}}>{hint}</div>}
  </div>
);
export default StatCard;

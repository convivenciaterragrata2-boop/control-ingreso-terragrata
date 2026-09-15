const KEY="nfc_access_v1";
let db=JSON.parse(localStorage.getItem(KEY)||'{"vehicles":[],"logs":[]}');
const $=id=>document.getElementById(id);
function save(){localStorage.setItem(KEY,JSON.stringify(db)); renderAll()}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function toast(t){$("toast").textContent=t;$("toast").style.display="block";setTimeout(()=>$("toast").style.display="none",2200)}
function show(screen){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$(""+screen).classList.add("active");document.querySelectorAll("nav button").forEach(x=>x.classList.toggle("active",x.dataset.screen===screen));renderAll()}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>show(b.dataset.screen));

function normalizeNfc(id){return String(id||"").trim().toUpperCase().replace(/\s+/g,"")}
function lookup(id){
  id=normalizeNfc(id);
  return db.vehicles.find(v=>normalizeNfc(v.nfc)===id);
}
function processChip(id){
  id=normalizeNfc(id);
  const v=lookup(id), now=new Date();
  const log={id:crypto.randomUUID(),time:now.toISOString(),nfc:id,plate:v?.plate||"",apto:v?.apto||"",resident:v?.resident||"",result:v&&v.status==="activo"?"AUTORIZADO":"DENEGADO"};
  db.logs.unshift(log); db.logs=db.logs.slice(0,2000); save();
  if(v&&v.status==="activo"){
    $("result").className="result ok";
    $("result").innerHTML=`🟢 ACCESO AUTORIZADO<br><br><b>Placa:</b> ${esc(v.plate)}<br><b>Apartamento:</b> ${esc(v.apto)}<br><b>Residente:</b> ${esc(v.resident)}<br><b>Vehículo:</b> ${esc(v.type)} ${esc(v.color)}<br><b>Hora:</b> ${now.toLocaleString("es-CO")}<br><br>✓ Registrar y levantar talanquera manualmente.`;
  }else{
    $("result").className="result no";
    $("result").innerHTML=`🔴 ACCESO DENEGADO<br><br>${v?"Vehículo/chip bloqueado.":"Chip no registrado."}<br><br><b>ID:</b> ${esc(id)}<br><br>No permitir ingreso hasta verificar con administración.`;
  }
}
$("scanBtn").onclick=async()=>{
  if(!("NDEF" in window)){toast("Este navegador no ofrece Web NFC. Usa Chrome en Android compatible.");return}
  try{
    const ndef=new NDEFReader();
    await ndef.scan();
    toast("Acerca ahora el chip NFC al celular");
    ndef.onreading=event=>{
      let id=event.serialNumber||"";
      if(!id && event.message?.records?.length) id=event.message.records[0].data?.toString()||"";
      processChip(id);
    };
  }catch(e){toast("No fue posible iniciar NFC: "+e.message)}
};
$("demoBtn").onclick=()=>{
  const v=db.vehicles[0];
  processChip(v?.nfc||"04-DEMO-001");
};
$("vehicleForm").onsubmit=e=>{
  e.preventDefault();
  const v={id:crypto.randomUUID(),apto:$("apto").value.trim(),resident:$("resident").value.trim(),plate:$("plate").value.trim().toUpperCase(),type:$("type").value.trim(),color:$("color").value.trim(),nfc:normalizeNfc($("nfc").value),status:$("status").value};
  const idx=db.vehicles.findIndex(x=>x.id===v.id);
  db.vehicles.push(v);save();e.target.reset();toast("Vehículo guardado");
};
$("vehicleSearch").oninput=renderVehicles;
function renderVehicles(){
  const q=($("vehicleSearch")?.value||"").toLowerCase();
  const arr=db.vehicles.filter(v=>[v.apto,v.resident,v.plate,v.nfc].join(" ").toLowerCase().includes(q));
  $("vehicleList").innerHTML=arr.length?arr.map(v=>`<div class="item"><b>${esc(v.plate)}</b> — Apto ${esc(v.apto)} <span class="tag ${v.status==="activo"?"ok":"no"}">${esc(v.status)}</span><br>${esc(v.resident)} · ${esc(v.type)} ${esc(v.color)}<br><small>NFC: ${esc(v.nfc)}</small><br><button class="secondary" onclick="toggleVehicle('${v.id}')">${v.status==="activo"?"Bloquear":"Activar"}</button> <button class="danger" onclick="deleteVehicle('${v.id}')">Eliminar</button></div>`).join(""):"<p>No hay vehículos registrados.</p>";
}
window.toggleVehicle=id=>{const v=db.vehicles.find(x=>x.id===id);if(v){v.status=v.status==="activo"?"bloqueado":"activo";save()}};
window.deleteVehicle=id=>{if(confirm("¿Eliminar este vehículo?")){db.vehicles=db.vehicles.filter(v=>v.id!==id);save()}};
function renderLogs(){
  $("logList").innerHTML=db.logs.length?db.logs.slice(0,100).map(l=>`<div class="item"><span class="tag ${l.result==="AUTORIZADO"?"ok":"no"}">${l.result}</span><br><b>${esc(l.plate||"SIN PLACA")}</b> · Apto ${esc(l.apto||"-")}<br><small>${new Date(l.time).toLocaleString("es-CO")} · NFC ${esc(l.nfc)}</small></div>`).join(""):"<p>No hay registros.</p>";
}
function renderRecent(){
  $("recent").innerHTML=db.logs.slice(0,8).map(l=>`<div class="item"><b>${esc(l.plate||"Sin identificar")}</b> — ${l.result}<br><small>${new Date(l.time).toLocaleString("es-CO")}</small></div>`).join("")||"<p>No hay ingresos registrados.</p>";
}
function renderAll(){renderVehicles();renderLogs();renderRecent()}
$("exportBtn").onclick=()=>{
 const rows=[["Fecha","Hora","Placa","Apartamento","Residente","NFC","Resultado"],...db.logs.map(l=>{const d=new Date(l.time);return[d.toLocaleDateString("es-CO"),d.toLocaleTimeString("es-CO"),l.plate,l.apto,l.resident,l.nfc,l.result]})];
 const csv=rows.map(r=>r.map(x=>`"${String(x??"").replace(/"/g,'""')}"`).join(",")).join("\n");
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}));a.download="historial_accesos.csv";a.click();
};
$("clearLogsBtn").onclick=()=>{if(confirm("¿Borrar todo el historial? Esta acción no se puede deshacer.")){db.logs=[];save()}};
$("seedBtn").onclick=()=>{
 const samples=[
 {id:crypto.randomUUID(),apto:"101",resident:"Residente de prueba 1",plate:"ABC123",type:"Renault Sandero",color:"Gris",nfc:"04-DEMO-001",status:"activo"},
 {id:crypto.randomUUID(),apto:"202",resident:"Residente de prueba 2",plate:"XYZ789",type:"Chevrolet Onix",color:"Blanco",nfc:"04-DEMO-002",status:"activo"}
 ];
 db.vehicles.push(...samples);save();toast("Datos de prueba cargados");
};
$("resetBtn").onclick=()=>{if(confirm("¿Restablecer todos los datos?")){db={vehicles:[],logs:[]};save();}};
let deferredPrompt;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installBtn").classList.remove("hidden")});
$("installBtn").onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null}};
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
renderAll();
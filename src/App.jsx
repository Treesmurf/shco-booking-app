import { useState, useEffect } from "react";
import { db } from "./firebase.js";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";

/* ════════════════════════════════════════════════════════════════
   PROPERTY DATABASE
   ════════════════════════════════════════════════════════════════ */
const PROPERTIES = {
  "Rainbow Beach & Inskip": [
    { name:"Rainbow Beach Surf Side", type:"Resort", ppn:220, desc:"Ocean-view rooms, pool, 2min to beach" },
    { name:"Plantation Resort", type:"Apartments", ppn:185, desc:"Self-contained, central location" },
  ],
  "Southern K'gari": [
    { name:"Kingfisher Bay Resort", type:"Eco Resort", ppn:380, desc:"Award-winning eco resort — base for whole island" },
    { name:"Eurong Beach Resort", type:"Resort", ppn:280, desc:"East coast beachfront — base for whole island" },
    { name:"Sailfish on Fraser", type:"Lodge", ppn:220, desc:"Self-contained units, Happy Valley" },
  ],
  "75 Mile Beach": [
    { name:"Kingfisher Bay Resort", type:"Eco Resort", ppn:380, desc:"Base for whole island" },
    { name:"Eurong Beach Resort", type:"Resort", ppn:280, desc:"Base for whole island" },
    { name:"Sailfish on Fraser", type:"Lodge", ppn:220, desc:"Happy Valley" },
  ],
  "Northern K'gari": [
    { name:"Kingfisher Bay Resort", type:"Eco Resort", ppn:380, desc:"Base for whole island" },
    { name:"Eurong Beach Resort", type:"Resort", ppn:280, desc:"Base for whole island" },
    { name:"Sailfish on Fraser", type:"Lodge", ppn:220, desc:"Happy Valley" },
    { name:"Orchid Beach Retreats", type:"Private Houses", ppn:350, desc:"Remote northern tip" },
  ],
  "Hervey Bay (optional)": [
    { name:"Pier One Hervey Bay", type:"Hotel", ppn:220, desc:"Waterfront, Urangan Pier" },
    { name:"Mantra Hervey Bay", type:"Resort", ppn:260, desc:"Pool, beachfront" },
  ],
  "Cairns": [
    { name:"Riley Cairns", type:"Resort", ppn:320, desc:"Crystal Lagoon pool, CBD" },
    { name:"Crystalbrook Flynn", type:"Boutique Hotel", ppn:280, desc:"Design-led, central" },
    { name:"Alamanda Palm Cove", type:"Luxury Resort", ppn:420, desc:"Beachfront suites" },
  ],
  "Cairns (return)": [
    { name:"Riley Cairns", type:"Resort", ppn:320, desc:"Crystal Lagoon, CBD" },
    { name:"Alamanda Palm Cove", type:"Luxury Resort", ppn:420, desc:"Beachfront, Palm Cove" },
  ],
  "Port Douglas & Mossman Gorge": [
    { name:"QT Port Douglas", type:"Boutique Hotel", ppn:320, desc:"Designer rooms, central" },
    { name:"Sheraton Grand Mirage", type:"Resort", ppn:380, desc:"Lagoon pools, beachfront" },
    { name:"Silky Oaks Lodge", type:"Ultra Luxury", ppn:850, desc:"Treehouse suites — upgrade" },
  ],
  "Daintree Rainforest": [
    { name:"Daintree Eco Lodge", type:"Eco Lodge", ppn:450, desc:"Bayans in canopy, spa" },
    { name:"Daintree Riverview", type:"Lodge", ppn:180, desc:"Riverside cabins" },
    { name:"Silky Oaks Lodge", type:"Ultra Luxury", ppn:850, desc:"Treehouse suites — upgrade" },
  ],
  "Cape Tribulation": [
    { name:"Cape Trib Beach House", type:"Beach Lodge", ppn:250, desc:"Beachfront, rainforest" },
    { name:"Ferntree Rainforest Lodge", type:"Eco Lodge", ppn:220, desc:"Cabins in rainforest" },
  ],
  "Atherton Tablelands": [
    { name:"Mt Quincan Crater Retreat", type:"B&B", ppn:260, desc:"Crater lake views" },
    { name:"Rose Gums Wilderness Retreat", type:"Treehouse", ppn:320, desc:"Luxury treehouses" },
  ],
  "Bundaberg & 1770": [
    { name:"Agnes Water Beach Club", type:"Resort", ppn:200, desc:"Pool, near beach" },
    { name:"1770 Getaway", type:"Villa", ppn:240, desc:"Self-contained villas" },
  ],
  "1770 & Agnes Water": [
    { name:"Agnes Water Beach Club", type:"Resort", ppn:200, desc:"Pool, near beach" },
    { name:"1770 Getaway", type:"Villa", ppn:240, desc:"Self-contained villas" },
  ],
  "Yeppoon": [
    { name:"Salt Yeppoon", type:"Resort", ppn:280, desc:"Lagoon pool, ocean views" },
    { name:"Oshen Apartments", type:"Apartments", ppn:220, desc:"Beachfront" },
  ],
  "Yeppoon & Capricorn Coast": [
    { name:"Salt Yeppoon", type:"Resort", ppn:280, desc:"Lagoon pool, ocean views" },
    { name:"Oshen Apartments", type:"Apartments", ppn:220, desc:"Beachfront" },
  ],
  "Cape Hillsborough": [
    { name:"Cape Hillsborough Nature Resort", type:"Lodge", ppn:220, desc:"Kangaroo sunrise beach" },
  ],
  "Mackay": [
    { name:"Clarion Hotel Mackay Marina", type:"Hotel", ppn:200, desc:"Marina views, pool" },
  ],
  "Airlie Beach": [
    { name:"Coral Sea Resort", type:"Resort", ppn:350, desc:"Infinity pool, Whitsunday views" },
    { name:"Mirage Whitsundays", type:"Apartments", ppn:260, desc:"Lagoon pool" },
    { name:"InterContinental Hayman Island", type:"Ultra Luxury", ppn:900, desc:"Private island — upgrade" },
  ],
  "Airlie Beach & Whitsundays": [
    { name:"Coral Sea Resort", type:"Resort", ppn:350, desc:"Infinity pool" },
    { name:"Mirage Whitsundays", type:"Apartments", ppn:260, desc:"Lagoon pool" },
    { name:"InterContinental Hayman Island", type:"Ultra Luxury", ppn:900, desc:"Private island — upgrade" },
  ],
  "Townsville & Magnetic Island": [
    { name:"The Ville Resort", type:"Resort", ppn:220, desc:"Pool, waterfront" },
    { name:"Peppers Blue on Blue", type:"Resort", ppn:280, desc:"Magnetic Island" },
  ],
  "Mission Beach": [
    { name:"Castaways Resort", type:"Resort", ppn:240, desc:"Beachfront, tropical" },
    { name:"Licuala Lodge", type:"B&B", ppn:200, desc:"Rainforest B&B" },
  ],
  "Toowoomba": [
    { name:"Vacy Hall Guesthouse", type:"Heritage B&B", ppn:220, desc:"Heritage-listed" },
  ],
  "Roma": [
    { name:"Roma Explorers Inn", type:"Motel", ppn:140, desc:"Best in town" },
  ],
  "Mitchell & Charleville": [
    { name:"Hotel Corones", type:"Heritage Pub", ppn:150, desc:"Famous staircase" },
    { name:"Mulga Country Motor Inn", type:"Motel", ppn:130, desc:"Comfortable, pool" },
  ],
  "Blackall": [
    { name:"Acacia Motor Inn", type:"Motel", ppn:130, desc:"Best in town" },
  ],
  "Longreach": [
    { name:"Saltbush Retreat", type:"Station Stay", ppn:280, desc:"Working station" },
    { name:"The Longreach Motor Inn", type:"Motel", ppn:160, desc:"Renovated, pool" },
  ],
  "Longreach (return)": [
    { name:"Saltbush Retreat", type:"Station Stay", ppn:280, desc:"Working station" },
    { name:"The Longreach Motor Inn", type:"Motel", ppn:160, desc:"Renovated, pool" },
  ],
  "Winton": [
    { name:"North Gregory Hotel", type:"Heritage Pub", ppn:130, desc:"Waltzing Matilda" },
    { name:"Boulder Opal Motor Inn", type:"Motel", ppn:140, desc:"Modern, pool" },
  ],
  "Carnarvon Gorge": [
    { name:"Carnarvon Gorge Wilderness Lodge", type:"Lodge", ppn:350, desc:"Luxury at gorge" },
    { name:"Breeze Holiday Parks Cabins", type:"Cabin", ppn:180, desc:"Bush bar" },
  ],
  "Rubyvale & Gemfields": [
    { name:"Rubyvale Gem Gallery Cabins", type:"Cabin", ppn:120, desc:"Near fossicking" },
  ],
  "Emerald & Gemfields": [
    { name:"Quest Emerald", type:"Apartments", ppn:180, desc:"Serviced apartments" },
  ],
  "Rockhampton": [
    { name:"Empire Apartment Hotel", type:"Heritage Hotel", ppn:200, desc:"Heritage-listed" },
  ],
  "Agnes Water & Bundaberg": [
    { name:"Agnes Water Beach Club", type:"Resort", ppn:200, desc:"Pool, near beach" },
  ],
  "Byron Bay": [
    { name:"The Bower Byron Bay", type:"Boutique Hotel", ppn:350, desc:"Rainforest, walk to town" },
    { name:"Byron Bay Hotel & Apartments", type:"Hotel", ppn:250, desc:"Central, rooftop" },
    { name:"Elements of Byron", type:"Ultra Luxury", ppn:580, desc:"Private villas — upgrade" },
  ],
  "Ballina & Air Force Beach": [
    { name:"Ramada Ballina", type:"Hotel", ppn:200, desc:"River views, pool" },
  ],
  "Yamba": [
    { name:"The Cove Yamba", type:"Apartments", ppn:250, desc:"Ocean views" },
    { name:"Yamba Beach Motel", type:"Motel", ppn:180, desc:"Walk to beach" },
  ],
  "Newcastle": [
    { name:"QT Newcastle", type:"Boutique Hotel", ppn:280, desc:"Design-led" },
    { name:"Rydges Newcastle", type:"Hotel", ppn:220, desc:"Waterfront" },
  ],
  "Stockton Beach & Port Stephens": [
    { name:"Bannisters Port Stephens", type:"Boutique Hotel", ppn:350, desc:"Rick Stein, infinity pool" },
    { name:"Anchorage Port Stephens", type:"Resort", ppn:300, desc:"Marina, waterfront" },
  ],
  "Hunter Valley": [
    { name:"Chateau Elan", type:"Resort", ppn:320, desc:"Vineyard, golf, spa" },
    { name:"Oaks Cypress Lakes", type:"Resort", ppn:240, desc:"Villas, families" },
    { name:"Spicers Guesthouse", type:"Ultra Luxury", ppn:500, desc:"Fine dining — upgrade" },
  ],
};

const CAMPSITES = {
  "Rainbow Beach & Inskip": [
    { name:"Inskip Peninsula (MV Sarawak)", type:"QPWS",ppn:0, desc:"Free bush camp, toilets, barge departure point" },
    { name:"Inskip Peninsula (SS Dorrigo)", type:"QPWS",ppn:0, desc:"Free bush camp, toilets" },
  ],
  "Southern K'gari": [
    { name:"Central Station", type:"QPWS",ppn:7, desc:"Flush toilets, showers, fenced, dingo-safe" },
    { name:"Lake McKenzie (Boorangoora)", type:"QPWS",ppn:7, desc:"Walk to lake, toilets, fenced" },
  ],
  "75 Mile Beach": [
    { name:"Dundubara", type:"QPWS",ppn:7, desc:"Flush toilets, showers, fenced, fire rings" },
    { name:"Eli Creek", type:"QPWS",ppn:7, desc:"East coast, near Eli Creek" },
  ],
  "Northern K'gari": [
    { name:"Waddy Point", type:"QPWS",ppn:7, desc:"Flush toilets, showers, fenced, beachfront, fire rings" },
    { name:"Wathumba", type:"QPWS",ppn:7, desc:"Remote west coast, toilets" },
  ],
  "Hervey Bay (optional)": [
    { name:"Hervey Bay Caravan Parks", type:"Caravan Park",ppn:45, desc:"Multiple options, powered sites" },
  ],
  "Cairns": [
    { name:"Ellis Beach Oceanfront", type:"Caravan Park",ppn:55, desc:"Beachfront, toilets, showers" },
    { name:"Cairns Holiday Park", type:"Caravan Park",ppn:50, desc:"Central, pool, camp kitchen" },
  ],
  "Cairns (return)": [
    { name:"Ellis Beach Oceanfront", type:"Caravan Park",ppn:55, desc:"Beachfront, showers" },
  ],
  "Port Douglas & Mossman Gorge": [
    { name:"Wonga Beach Camping", type:"QPWS",ppn:7, desc:"Composting toilets, beachside" },
    { name:"Port Douglas Caravan Park", type:"Caravan Park",ppn:50, desc:"Central, powered" },
  ],
  "Daintree Rainforest": [
    { name:"Daintree Riverview Caravan Park", type:"Caravan Park",ppn:45, desc:"Toilets, showers, riverside" },
  ],
  "Cape Tribulation": [
    { name:"Noah Beach", type:"QPWS",ppn:7, desc:"Composting toilets, 15 sites, book ahead" },
    { name:"Cape Trib Camping", type:"Caravan Park",ppn:40, desc:"Rainforest setting, showers" },
  ],
  "Atherton Tablelands": [
    { name:"Lake Tinaroo — Downfall Creek", type:"QPWS",ppn:7, desc:"Toilets, lakeside" },
  ],
  "Bundaberg & 1770": [
    { name:"1770 Camping Ground", type:"Caravan Park",ppn:40, desc:"Toilets, showers, near beach" },
  ],
  "1770 & Agnes Water": [
    { name:"1770 Camping Ground", type:"Caravan Park",ppn:40, desc:"Toilets, showers" },
  ],
  "Yeppoon": [
    { name:"Farnborough Beach Caravan Park", type:"Caravan Park",ppn:45, desc:"Beachfront, showers" },
  ],
  "Yeppoon & Capricorn Coast": [
    { name:"Farnborough Beach Caravan Park", type:"Caravan Park",ppn:45, desc:"Beachfront, showers" },
  ],
  "Cape Hillsborough": [
    { name:"Cape Hillsborough Nature Tourist Park", type:"Caravan Park",ppn:45, desc:"Beachfront, kangaroo sunrise" },
  ],
  "Mackay": [
    { name:"Mackay Caravan Parks", type:"Caravan Park",ppn:40, desc:"Multiple options" },
  ],
  "Airlie Beach": [
    { name:"BIG4 Adventure Whitsunday", type:"Caravan Park",ppn:55, desc:"Toilets, showers, pool" },
  ],
  "Airlie Beach & Whitsundays": [
    { name:"BIG4 Adventure Whitsunday", type:"Caravan Park",ppn:55, desc:"Toilets, showers, pool" },
  ],
  "Townsville & Magnetic Island": [
    { name:"Rowes Bay Caravan Park", type:"Caravan Park",ppn:45, desc:"Beachfront, showers" },
  ],
  "Mission Beach": [
    { name:"Beachcomber Coconut Village", type:"Caravan Park",ppn:45, desc:"Beachfront, showers" },
  ],
  "Toowoomba": [
    { name:"Toowoomba Showgrounds", type:"Caravan Park",ppn:35, desc:"Central, basic facilities" },
  ],
  "Roma": [
    { name:"Big Rig Tourist Park", type:"Caravan Park",ppn:40, desc:"Toilets, showers, near Big Rig" },
  ],
  "Mitchell & Charleville": [
    { name:"Charleville Bush Caravan Park", type:"Caravan Park",ppn:35, desc:"Toilets, showers" },
  ],
  "Blackall": [
    { name:"Blackall Caravan Park", type:"Caravan Park",ppn:35, desc:"Toilets, showers" },
  ],
  "Longreach": [
    { name:"Longreach Tourist Park", type:"Caravan Park",ppn:40, desc:"Toilets, showers, pool, camp kitchen" },
  ],
  "Longreach (return)": [
    { name:"Longreach Tourist Park", type:"Caravan Park",ppn:40, desc:"Toilets, showers, pool" },
  ],
  "Winton": [
    { name:"Pelican Waters Caravan Park", type:"Caravan Park",ppn:35, desc:"Toilets, showers, pool" },
    { name:"Bladensburg NP — Bough Shed Hole", type:"QPWS",ppn:7, desc:"Toilets, bush camping" },
  ],
  "Carnarvon Gorge": [
    { name:"Breeze Holiday Parks Carnarvon Gorge", type:"Caravan Park",ppn:45, desc:"Toilets, showers, camp kitchen, bush bar" },
  ],
  "Rubyvale & Gemfields": [
    { name:"Rubyvale Gem Caravan Park", type:"Caravan Park",ppn:35, desc:"Near fossicking, showers" },
  ],
  "Emerald & Gemfields": [
    { name:"Emerald Caravan Parks", type:"Caravan Park",ppn:35, desc:"Multiple options" },
  ],
  "Rockhampton": [
    { name:"Rockhampton Caravan Parks", type:"Caravan Park",ppn:40, desc:"Multiple options" },
  ],
  "Agnes Water & Bundaberg": [
    { name:"1770 Camping Ground", type:"Caravan Park",ppn:40, desc:"Toilets, showers" },
  ],
  "Byron Bay": [
    { name:"First Sun Holiday Park", type:"Caravan Park",ppn:65, desc:"Toilets, showers, pool, central" },
    { name:"Suffolk Park Caravan Park", type:"Caravan Park",ppn:55, desc:"Near Tallow Beach" },
  ],
  "Ballina & Air Force Beach": [
    { name:"Ballina Caravan Parks", type:"Caravan Park",ppn:45, desc:"Multiple options" },
  ],
  "Yamba": [
    { name:"Yamba Caravan Parks", type:"Caravan Park",ppn:45, desc:"Near Main Beach" },
  ],
  "Newcastle": [
    { name:"Stockton Beach Holiday Park", type:"Caravan Park",ppn:50, desc:"Near beach, showers" },
  ],
  "Stockton Beach & Port Stephens": [
    { name:"Port Stephens Caravan Parks", type:"Caravan Park",ppn:50, desc:"Multiple options, near beach" },
  ],
  "Hunter Valley": [
    { name:"Hunter Valley Caravan Parks", type:"Caravan Park",ppn:45, desc:"Vineyard region" },
  ],
};

const PACKAGES = {
  kgari: { name:"K'gari Experience", days:5, db:300, stops:["Rainbow Beach & Inskip","Southern K'gari","75 Mile Beach","Northern K'gari","Hervey Bay (optional)"] },
  "tropical-north": { name:"Tropical North", days:7, db:1050, stops:["Cairns","Port Douglas & Mossman Gorge","Daintree Rainforest","Cape Tribulation","Atherton Tablelands","Cairns (return)"] },
  "coastal-explorer": { name:"Coastal Explorer", days:21, db:2900, stops:["Rainbow Beach & Inskip","Southern K'gari","Bundaberg & 1770","Yeppoon & Capricorn Coast","Cape Hillsborough","Airlie Beach & Whitsundays","Townsville & Magnetic Island","Mission Beach","Cairns"] },
  outback: { name:"Red Centre & Outback", days:21, db:2100, stops:["Toowoomba","Roma","Mitchell & Charleville","Blackall","Longreach","Winton","Carnarvon Gorge","Emerald & Gemfields","Rockhampton","Agnes Water & Bundaberg"] },
  whitsundays: { name:"Whitsundays", days:7, db:950, stops:["Airlie Beach","Cape Hillsborough","Mackay"] },
  "outback-taster": { name:"Outback Taster", days:7, db:800, stops:["Longreach","Winton","Longreach (return)"] },
  "capricorn-coast": { name:"Capricorn Coast", days:7, db:900, stops:["Yeppoon","1770 & Agnes Water","Rockhampton"] },
  "carnarvon-gorge": { name:"Carnarvon Gorge", days:7, db:250, stops:["Rubyvale & Gemfields","Carnarvon Gorge","Blackall"] },
  "byron-bay": { name:"Byron Bay", days:5, db:900, stops:["Byron Bay","Ballina & Air Force Beach","Yamba"] },
  "stockton-beach": { name:"Stockton Beach", days:7, db:1100, stops:["Newcastle","Stockton Beach & Port Stephens","Hunter Valley"] },
  custom: { name:"Custom Journey", days:7, db:0, stops:[] },
};

const RATE=1200, BOND=7500;
const GUESTS=["1 adult","2 adults (couple)","3 adults","4 adults","1 adult + 1 child","1 adult + 2 children","1 adult + 3 children","2 adults + 1 child","2 adults + 2 children","2 adults + 3 children"];

const visaCalc = b => {
  if (b.visaFuelOverride !== undefined || b.visaDiningOverride !== undefined) {
    const fuel = b.visaFuelOverride ?? 1000;
    const dining = b.visaDiningOverride ?? 0;
    return { fuel, dining, total: fuel + dining };
  }
  const pk=PACKAGES[b.packageId];
  const tn=b.stops.filter(s=>s.mode==="touring").reduce((a,s)=>a+s.nights,0);
  const an=b.stops.reduce((a,s)=>a+s.nights,0);
  const d=an>0?Math.round((pk?.db||0)*tn/an/50)*50:0;
  return { fuel:1000, dining:d, total:1000+d };
};

/* STYLES */
const sf="'Cormorant Garamond','Georgia',serif";
const sn="'Figtree','Helvetica Neue',sans-serif";
const gd="#C4A265",tl="#0A6B7A",tr="#A04209",dk="#1A1714",md="#57534E",lt="#A8A29E",sd="#F5F0E8",wh="#FFFDF8",bd="#E7E5E4";
const fonts=`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Figtree:wght@300;400;500;600;700&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{background:${wh};font-family:${sn}}`;
const S={
  pg:{fontFamily:sn,background:wh,minHeight:"100vh",color:dk},
  hd:{padding:"20px 32px",borderBottom:`1px solid ${bd}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:wh},
  logo:{fontFamily:sf,fontSize:20,fontWeight:500,color:dk,cursor:"pointer"},
  co:{fontFamily:sn,fontSize:9,fontWeight:700,letterSpacing:3,color:gd,marginLeft:6,textTransform:"uppercase"},
  bg:c=>({fontFamily:sn,fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",padding:"4px 10px",borderRadius:3,
    background:c==="enquiry"?"#FFF3E0":c==="draft"?sd:c==="sent"?`${tl}15`:c==="confirmed"?"#E8F5E9":sd,
    color:c==="enquiry"?"#E65100":c==="draft"?md:c==="sent"?tl:c==="confirmed"?"#2E7D32":md}),
  bt:{fontFamily:sn,fontSize:11,fontWeight:600,letterSpacing:2,textTransform:"uppercase",padding:"13px 28px",border:"none",borderRadius:4,cursor:"pointer",transition:"all .3s"},
  bp:{background:`linear-gradient(135deg,${tl},${tr})`,color:"#fff"},
  bh:{background:"transparent",border:`1px solid ${bd}`,color:md},
  bg2:{background:gd,color:"#fff"},
  ip:{width:"100%",padding:"13px 16px",border:`1px solid ${bd}`,borderRadius:4,fontFamily:sn,fontSize:14,color:dk,outline:"none",background:"#fff"},
  sl:{width:"100%",padding:"13px 16px",border:`1px solid ${bd}`,borderRadius:4,fontFamily:sn,fontSize:14,color:dk,outline:"none",background:"#fff",cursor:"pointer"},
  lb:{fontFamily:sn,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:lt,marginBottom:6,display:"block"},
  cd:{background:"#fff",border:`1px solid ${bd}`,borderRadius:8,padding:"24px"},
  dv:{width:40,height:1,background:gd,margin:"12px 0"},
};

/* ════════════════════════════════════════════════════════════════
   MAIN APP
   ════════════════════════════════════════════════════════════════ */
export default function BookingApp() {
  const [view, setView] = useState("loading");
  const [bks, setBks] = useState([]);
  const [act, setAct] = useState(null);
  const [pw, setPw] = useState("");
  const [ae, setAe] = useState(false);
  const [sending, setSending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // On mount: check for guest booking ID in URL
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const bid = p.get("booking");
    if (bid) {
      loadGuestBooking(bid);
    } else {
      setView("login");
    }
  }, []);

  // Load single booking for guest
  const loadGuestBooking = async (bid) => {
    try {
      const snap = await getDoc(doc(db, "bookings", bid));
      if (snap.exists()) {
        setAct({ id: snap.id, ...snap.data() });
        setView("guest");
      } else {
        setView("login");
      }
    } catch (e) {
      console.error(e);
      setView("login");
    }
  };

  // Load all bookings for admin
  const loadAllBookings = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "bookings"));
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      all.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      setBks(all);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // Create new booking
  const createBk = async () => {
    const id = "SH-" + Date.now().toString(36).toUpperCase();
    const pk = PACKAGES.kgari;
    const nb = {
      status: "draft", createdAt: new Date().toISOString(),
      guestName: "", guestEmail: "", guestPhone: "", guestCount: "2 adults (couple)",
      packageId: "kgari", startDate: "", totalDays: pk.days,
      stops: pk.stops.map(s => ({ name: s, mode: "camping", nights: 1, accomOptions: [], selectedAccom: null })),
      supplements: 0, notes: "", dietary: "", specialNeeds: "", message: "",
    };
    await setDoc(doc(db, "bookings", id), nb);
    setAct({ id, ...nb });
    setView("edit");
  };

  // Update booking in Firestore
  const updBk = async (updated) => {
    const { id, ...data } = updated;
    await updateDoc(doc(db, "bookings", id), data);
    setAct(updated);
    // Update local list
    setBks(prev => prev.map(b => b.id === id ? updated : b));
  };

  // Delete booking
  const delBk = async (id) => {
    await deleteDoc(doc(db, "bookings", id));
    setBks(prev => prev.filter(b => b.id !== id));
    setView("dashboard");
  };

  /* ═══ GUEST VIEW ═══ */
  if (view === "guest" && act) {
    const b = act;
    const pk = PACKAGES[b.packageId] || { name: "Custom", days: b.totalDays, db: 0 };
    const v = visaCalc(b);
    const pomCost = (b.bondOption||"none")==="assurance"?Math.min(38*b.totalDays,380):(b.bondOption||"none")==="complete"?Math.min(55*b.totalDays,550):0;
    const q = { days: b.totalDays, sub: b.totalDays * RATE, sup: b.supplements || 0, pom: pomCost, total: b.totalDays * RATE + (b.supplements || 0) + pomCost };
    const tStops = b.stops.filter(s => s.accomOptions.length > 0);
    const allSel = tStops.length > 0 && tStops.every(s => s.selectedAccom);

    const selAccom = async (si, val) => {
      const updated = { ...b, stops: b.stops.map((s, i) => i === si ? { ...s, selectedAccom: val || null } : s) };
      setAct(updated);
      // Write selection back to Firestore
      const { id, ...data } = updated;
      await updateDoc(doc(db, "bookings", id), { stops: updated.stops });
    };

    const confirmSel = async () => {
      setSending(true);
      await updateDoc(doc(db, "bookings", b.id), {
        status: "confirmed", stops: b.stops,
        bondOption: b.bondOption || "none",
        childSeats: b.childSeats || false,
        childCutlery: b.childCutlery || false,
        bottleKit: b.bottleKit || false,
      });
      setConfirmed(true);
      setSending(false);
    };

    const updGuest = async (field, val) => {
      const updated = { ...b, [field]: val };
      setAct(updated);
      await updateDoc(doc(db, "bookings", b.id), { [field]: val });
    };

    const bondCost = b.bondOption === "assurance" ? Math.min(38 * b.totalDays, 380) : b.bondOption === "complete" ? Math.min(55 * b.totalDays, 550) : 0;
    const bondReduced = b.bondOption === "assurance" ? 5000 : b.bondOption === "complete" ? 3500 : 7500;

    return (
      <div style={S.pg}><style>{fonts}</style>
        <div style={S.hd}>
          <div><span style={{fontFamily:sf,fontSize:18,fontWeight:500,color:dk}}>Southern Horizon</span><span style={S.co}>Co.</span></div>
        </div>
        <div style={{maxWidth:720,margin:"0 auto",padding:"40px 24px 80px"}}>
          <div style={{textAlign:"center",marginBottom:40}}>
            <p style={{fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:gd,marginBottom:10}}>Your Trip</p>
            <h1 style={{fontFamily:sf,fontSize:36,fontWeight:400,color:dk,marginBottom:8}}>{pk.name}</h1>
            <p style={{fontSize:14,color:lt}}>{b.guestName} · {b.totalDays} days · {b.guestCount}</p>
            {b.startDate && <p style={{fontSize:13,color:lt,marginTop:4}}>Starting {b.startDate}</p>}
          </div>

          <h2 style={{fontFamily:sf,fontSize:22,fontWeight:500,color:dk,marginBottom:20}}>Your Itinerary</h2>
          {b.stops.map((stop, si) => {
            const sel = stop.selectedAccom ? stop.accomOptions.find(o => o.name === stop.selectedAccom) : null;
            return (
              <div key={si} style={{marginBottom:20,paddingBottom:20,borderBottom:si<b.stops.length-1?`1px solid ${bd}`:"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <h3 style={{fontFamily:sf,fontSize:18,fontWeight:500,color:dk}}>{stop.name}</h3>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:11,color:lt}}>{stop.nights}n</span>
                    <span style={{fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",padding:"3px 8px",borderRadius:3,
                      background:stop.mode==="camping"?`${tl}12`:`${tr}12`,color:stop.mode==="camping"?tl:tr}}>{stop.mode}</span>
                  </div>
                </div>
                {stop.accomOptions.length > 0 && !confirmed && (
                  <div style={{marginTop:12}}>
                    <label style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:stop.mode==="camping"?tl:gd,marginBottom:6,display:"block"}}>
                      {stop.mode==="camping"?"Select your campsite":"Select your accommodation"}
                    </label>
                    <select value={stop.selectedAccom || ""} onChange={e => selAccom(si, e.target.value)}
                      style={{...S.sl,borderColor:stop.selectedAccom?(stop.mode==="camping"?tl:gd):bd,fontSize:13}}>
                      <option value="">Choose...</option>
                      {stop.accomOptions.map((opt, ai) => (
                        <option key={ai} value={opt.name}>{opt.name} — {opt.type}{opt.ppn>0?` — $${opt.ppn}/night`:""}</option>
                      ))}
                    </select>
                    {sel && <p style={{fontSize:12,color:md,marginTop:6,fontStyle:"italic"}}>{sel.desc}</p>}
                  </div>
                )}
                {stop.selectedAccom && confirmed && (
                  <div style={{marginTop:10,padding:"14px 18px",background:stop.mode==="camping"?`${tl}08`:`${gd}08`,
                    border:`1px solid ${stop.mode==="camping"?`${tl}30`:`${gd}30`}`,borderRadius:6}}>
                    <div style={{fontFamily:sf,fontSize:16,fontWeight:500,color:dk}}>{stop.selectedAccom}</div>
                    {sel && <div style={{fontSize:12,color:lt,marginTop:2}}>{sel.desc}</div>}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{...S.cd,marginBottom:24,marginTop:20}}>
            <h2 style={{fontFamily:sf,fontSize:22,fontWeight:500,marginBottom:4}}>Package Summary</h2>
            <div style={S.dv}/>
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${bd}`}}>
              <span style={{fontSize:13,color:md}}>{q.days} days × $1,200/day</span><span style={{fontSize:13,fontWeight:600}}>${q.sub.toLocaleString()}</span>
            </div>
            {q.sup > 0 && <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${bd}`}}>
              <span style={{fontSize:13,color:md}}>Ultra-luxury upgrades</span><span style={{fontSize:13,fontWeight:600}}>${q.sup.toLocaleString()}</span>
            </div>}
            {q.pom > 0 && <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${bd}`}}>
              <span style={{fontSize:13,color:md}}>Peace of Mind — {(b.bondOption||"none")==="assurance"?"Assurance":"Complete"}</span><span style={{fontSize:13,fontWeight:600}}>${q.pom.toLocaleString()}</span>
            </div>}
            <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",marginTop:4}}>
              <span style={{fontFamily:sf,fontSize:18,fontWeight:500}}>Package Total</span>
              <span style={{fontFamily:sf,fontSize:18,fontWeight:600}}>${q.total.toLocaleString()}</span>
            </div>
            {q.pom > 0 && <p style={{fontSize:11,color:lt,marginTop:4}}>Bond reduced to ${(b.bondOption==="assurance"?5000:3500).toLocaleString()}</p>}
          </div>

          <div style={{...S.cd,marginBottom:24,borderLeft:`3px solid ${gd}`}}>
            <h3 style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:gd,marginBottom:12}}>Pre-loaded Visa Card</h3>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{fontSize:13,color:md}}>Fuel</span><span>${v.fuel.toLocaleString()}</span></div>
            {v.dining > 0 && <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{fontSize:13,color:md}}>Dining</span><span>${v.dining.toLocaleString()}</span></div>}
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginTop:4,borderTop:`1px solid ${bd}`}}>
              <span style={{fontWeight:600}}>Total loaded</span><span style={{fontWeight:600,color:gd}}>${v.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Bond / Peace of Mind */}
          {!confirmed && b.status === "sent" && (
            <div style={{...S.cd,marginBottom:24}}>
              <h3 style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:dk,marginBottom:4}}>Security Bond</h3>
              <p style={{fontSize:12,color:lt,marginBottom:16}}>A $7,500 bond is charged at handover and fully refunded on return. You can reduce it with Peace of Mind Cover:</p>
              {[
                {id:"none",label:"Standard Bond",detail:"$7,500 fully refundable",cost:"No extra cost"},
                {id:"assurance",label:"Peace of Mind — Assurance",detail:`Bond reduced to $5,000`,cost:`$${Math.min(38*b.totalDays,380)} ($38/day, capped at $380)`},
                {id:"complete",label:"Peace of Mind — Complete",detail:`Bond reduced to $3,500`,cost:`$${Math.min(55*b.totalDays,550)} ($55/day, capped at $550)`},
              ].map(opt=>(
                <div key={opt.id} onClick={()=>updGuest("bondOption",opt.id)}
                  style={{padding:"14px 18px",borderRadius:6,marginBottom:8,cursor:"pointer",transition:"all .2s",
                    border:(b.bondOption||"none")===opt.id?`2px solid ${gd}`:`1px solid ${bd}`,
                    background:(b.bondOption||"none")===opt.id?`${gd}08`:"#fff"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontFamily:sf,fontSize:15,fontWeight:500,color:dk}}>{opt.label}</div>
                      <div style={{fontSize:12,color:lt,marginTop:2}}>{opt.detail}</div>
                    </div>
                    <div style={{fontSize:12,fontWeight:600,color:(b.bondOption||"none")===opt.id?gd:md}}>{opt.cost}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Child Equipment */}
          {!confirmed && b.status === "sent" && (b.guestCount||"").includes("child") && (
            <div style={{...S.cd,marginBottom:24}}>
              <h3 style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:dk,marginBottom:4}}>Children's Equipment</h3>
              <p style={{fontSize:12,color:lt,marginBottom:16}}>Select any equipment you need for your trip:</p>
              {[
                {k:"childSeats",label:"Child seats / booster seats",desc:"Arranged via Kidsafe QLD — tell us ages and we'll have the right seats ready"},
                {k:"childCutlery",label:"Children's cutlery & dining sets",desc:"Sea to Summit Delta Camp Sets (plate, bowl, mug, cutlery)"},
                {k:"bottleKit",label:"Toddler dining & bottle kit",desc:"b.box BPA-free dining sets, Milton travel steriliser & tablets, bottle brushes"},
              ].map(item=>(
                <label key={item.k} onClick={()=>updGuest(item.k,!b[item.k])}
                  style={{display:"flex",gap:12,alignItems:"flex-start",cursor:"pointer",padding:"12px 16px",borderRadius:6,marginBottom:8,
                    border:b[item.k]?`2px solid ${gd}`:`1px solid ${bd}`,background:b[item.k]?`${gd}08`:"#fff",transition:"all .2s"}}>
                  <div style={{width:20,height:20,borderRadius:4,flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center",
                    border:b[item.k]?`2px solid ${gd}`:`2px solid ${bd}`,background:b[item.k]?gd:"#fff"}}>
                    {b[item.k] && <span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}
                  </div>
                  <div>
                    <div style={{fontFamily:sf,fontSize:15,fontWeight:500,color:dk}}>{item.label}</div>
                    <div style={{fontSize:12,color:lt,marginTop:2}}>{item.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Confirmed selections summary */}
          {(confirmed || b.status === "confirmed") && (b.bondOption || b.childSeats || b.childCutlery || b.bottleKit) && (
            <div style={{...S.cd,marginBottom:24}}>
              {b.bondOption && b.bondOption !== "none" && (
                <div style={{marginBottom:12}}>
                  <span style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:gd}}>Peace of Mind: </span>
                  <span style={{fontFamily:sf,fontSize:15,fontWeight:500,color:dk}}>{b.bondOption === "assurance" ? "Assurance — bond $5,000" : "Complete — bond $3,500"}</span>
                </div>
              )}
              {(b.childSeats || b.childCutlery || b.bottleKit) && (
                <div>
                  <span style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:gd}}>Children's Equipment: </span>
                  <span style={{fontSize:13,color:dk}}>
                    {[b.childSeats&&"Child seats",b.childCutlery&&"Cutlery sets",b.bottleKit&&"Toddler kit"].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>
          )}

          {!confirmed && b.status === "sent" && (
            <button onClick={confirmSel} disabled={!allSel || sending}
              style={{...S.bt,...(allSel && !sending ? S.bp : S.bh),width:"100%",padding:"16px",opacity:allSel && !sending?1:0.5}}>
              {sending ? "Sending..." : allSel ? "Confirm My Selections" : "Please select your campsite or accommodation at each stop"}
            </button>
          )}
          {(confirmed || b.status === "confirmed") && (
            <div style={{textAlign:"center",padding:"24px",background:`${gd}08`,borderRadius:8,border:`1px solid ${gd}30`}}>
              <div style={{fontFamily:sf,fontSize:24,color:gd,marginBottom:8}}>✓</div>
              <p style={{fontFamily:sf,fontSize:18,color:dk}}>Selections confirmed</p>
              <p style={{fontSize:13,color:lt,marginTop:4}}>Troy or Jess will be in touch with your final booking details.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ═══ LOADING ═══ */
  if (view === "loading") return <div style={{...S.pg,display:"flex",alignItems:"center",justifyContent:"center"}}><style>{fonts}</style><p style={{color:lt}}>Loading...</p></div>;

  /* ═══ LOGIN ═══ */
  if (view === "login") return (
    <div style={{...S.pg,display:"flex",alignItems:"center",justifyContent:"center",padding:28,
      background:`linear-gradient(135deg,#0B3D4E 0%,${tl} 25%,#4BA89A 50%,#B8864A 75%,${tr} 100%)`}}>
      <style>{fonts}</style>
      <div style={{maxWidth:400,width:"100%",textAlign:"center",background:"rgba(255,253,248,0.95)",backdropFilter:"blur(20px)",borderRadius:12,padding:"56px 40px",boxShadow:"0 24px 64px rgba(0,0,0,0.15)"}}>
        <span style={{fontFamily:sf,fontSize:28,fontWeight:400,color:dk}}>Southern Horizon</span><span style={S.co}>Co.</span>
        <div style={S.dv}/><p style={{fontSize:13,color:lt,margin:"16px 0 28px"}}>Booking Manager</p>
        <input type="password" placeholder="Password" value={pw} onChange={e=>{setPw(e.target.value);setAe(false)}}
          onKeyDown={e=>{if(e.key==="Enter"){if(pw==="shco2027"){setView("dashboard");loadAllBookings();setAe(false)}else setAe(true)}}}
          style={{...S.ip,textAlign:"center",marginBottom:12}}/>
        {ae && <p style={{fontSize:12,color:tr,marginBottom:12}}>Incorrect password</p>}
        <button onClick={()=>{if(pw==="shco2027"){setView("dashboard");loadAllBookings();setAe(false)}else setAe(true)}} style={{...S.bt,...S.bp,width:"100%"}}>Enter</button>
      </div>
    </div>
  );

  /* ═══ DASHBOARD ═══ */
  if (view === "dashboard") return (
    <div style={S.pg}><style>{fonts}</style>
      <div style={S.hd}>
        <div><span style={S.logo}>Southern Horizon</span><span style={S.co}>Co.</span></div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={loadAllBookings} style={{...S.bt,...S.bh,padding:"10px 20px",fontSize:10}}>Refresh</button>
          <button onClick={createBk} style={{...S.bt,...S.bp}}>New Booking</button>
        </div>
      </div>
      <div style={{maxWidth:900,margin:"0 auto",padding:"40px 24px"}}>
        <h1 style={{fontFamily:sf,fontSize:28,fontWeight:400,marginBottom:4}}>Bookings</h1>
        <div style={S.dv}/><p style={{fontSize:13,color:lt,marginBottom:32}}>{loading?"Loading...":bks.length+" booking"+(bks.length!==1?"s":"")}</p>
        {bks.length === 0 && !loading ? (
          <div style={{textAlign:"center",padding:"60px 24px",background:sd,borderRadius:8}}>
            <p style={{fontFamily:sf,fontSize:20,color:md,marginBottom:12}}>No bookings yet</p>
            <button onClick={createBk} style={{...S.bt,...S.bg2}}>Create First Booking</button>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {bks.map(b => {
              const pk = PACKAGES[b.packageId];
              const qtotal = b.totalDays * RATE + (b.supplements || 0);
              const picks = b.stops?.filter(s => s.mode === "touring" && s.selectedAccom).length || 0;
              const tTotal = b.stops?.filter(s => s.mode === "touring" && s.accomOptions?.length > 0).length || 0;
              return (
                <div key={b.id} onClick={async () => { const snap = await getDoc(doc(db,"bookings",b.id)); if(snap.exists()) setAct({id:snap.id,...snap.data()}); setView("edit"); }}
                  style={{...S.cd,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",
                    borderLeft:`3px solid ${b.status==="confirmed"?"#2E7D32":b.status==="sent"?tl:b.status==="enquiry"?"#E65100":gd}`,transition:"box-shadow .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.06)"}
                  onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                  <div>
                    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:4}}>
                      <span style={{fontFamily:sf,fontSize:18,fontWeight:500}}>{b.guestName || "Unnamed"}</span>
                      <span style={S.bg(b.status)}>{b.status}</span>
                    </div>
                    <p style={{fontSize:12,color:lt}}>{pk?.name||"Custom"} · {b.totalDays}d · {b.guestCount} · {b.id}</p>
                    {b.status === "enquiry" && b.message && <p style={{fontSize:11,color:md,marginTop:4,fontStyle:"italic"}}>"{b.message.substring(0,80)}{b.message.length>80?"...":""}"</p>}
                    {tTotal > 0 && <p style={{fontSize:11,color:picks===tTotal?"#2E7D32":tr,marginTop:4}}>Accom: {picks}/{tTotal} selected</p>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:sf,fontSize:20,fontWeight:500}}>${qtotal.toLocaleString()}</div>
                    <div style={{fontSize:11,color:lt}}>Visa: ${visaCalc(b).total.toLocaleString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  /* ═══ ADMIN EDIT ═══ */
  if (view === "edit" && act) {
    const b = act, pk = PACKAGES[b.packageId], v = visaCalc(b);
    const pomCost = (b.bondOption||"none")==="assurance"?Math.min(38*b.totalDays,380):(b.bondOption||"none")==="complete"?Math.min(55*b.totalDays,550):0;
    const q = { days:b.totalDays, sub:b.totalDays*RATE, sup:b.supplements||0, pom:pomCost, total:b.totalDays*RATE+(b.supplements||0)+pomCost };
    const upd = (f, val) => updBk({ ...b, [f]: val });

    const chgPkg = pid => {
      const np = PACKAGES[pid];
      updBk({...b, packageId:pid, totalDays:np.days,
        stops:(np.stops||[]).map(s=>({name:s,mode:"camping",nights:1,accomOptions:[],selectedAccom:null}))});
    };

    const updStop = (i, f, val) => {
      const ns = b.stops.map((s, idx) => {
        if (idx !== i) return s;
        const u = { ...s, [f]: val };
        if (f === "mode" && val === "touring" && s.accomOptions.length === 0) u.accomOptions = (PROPERTIES[s.name] || []).map(p => ({ ...p }));
        if (f === "mode" && val === "camping") { u.accomOptions = (CAMPSITES[s.name] || []).map(p => ({ ...p })); u.selectedAccom = null; }
        if (f === "mode" && val === "touring") { u.selectedAccom = null; }
        return u;
      });
      updBk({ ...b, stops: ns });
    };

    const addFromDb = (si, name, mode) => {
      const stop = b.stops[si];
      const dbSource = mode === "camping" ? CAMPSITES : PROPERTIES;
      const prop = (dbSource[stop.name] || []).find(p => p.name === name);
      if (!prop || stop.accomOptions.find(o => o.name === name)) return;
      updBk({...b, stops: b.stops.map((s, i) => i === si ? { ...s, accomOptions: [...s.accomOptions, { ...prop }] } : s)});
    };

    const addCustom = si => {
      updBk({...b, stops: b.stops.map((s, i) => i === si ? { ...s, accomOptions: [...s.accomOptions, { name:"", type:"", ppn:0, desc:"" }] } : s)});
    };

    const updAccom = (si, ai, f, val) => {
      updBk({...b, stops: b.stops.map((s, i) => {
        if (i !== si) return s;
        return { ...s, accomOptions: s.accomOptions.map((o, j) => j === ai ? { ...o, [f]: val } : o) };
      })});
    };

    const rmAccom = (si, ai) => {
      updBk({...b, stops: b.stops.map((s, i) => {
        if (i !== si) return s;
        return { ...s, accomOptions: s.accomOptions.filter((_, j) => j !== ai), selectedAccom: null };
      })});
    };

    const gLink = `${window.location.origin}${window.location.pathname}?booking=${b.id}`;
    const copyLink = () => { navigator.clipboard?.writeText(gLink); setCopied(true); setTimeout(()=>setCopied(false),3000); };

    return (
      <div style={S.pg}><style>{fonts}</style>
        <div style={S.hd}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <span onClick={()=>{setView("dashboard");loadAllBookings()}} style={{cursor:"pointer",fontSize:12,color:lt}}>← Back</span>
            <div><span style={S.logo}>Southern Horizon</span><span style={S.co}>Co.</span></div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <span style={S.bg(b.status)}>{b.status}</span>
            <span style={{fontSize:11,color:lt}}>{b.id}</span>
          </div>
        </div>

        <div style={{maxWidth:900,margin:"0 auto",padding:"32px 24px 80px"}}>
          {/* Enquiry details from website */}
          {b.status === "enquiry" && (
            <div style={{...S.cd,marginBottom:20,borderLeft:`3px solid #E65100`,background:"#FFF3E0"}}>
              <h3 style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#E65100",marginBottom:8}}>Website Enquiry</h3>
              {b.dates && <p style={{fontSize:12,color:md}}>Preferred dates: <strong>{b.dates}</strong></p>}
              {b.duration && <p style={{fontSize:12,color:md}}>Duration: <strong>{b.duration}</strong></p>}
              {b.dietary && <p style={{fontSize:12,color:md}}>Dietary: {b.dietary}</p>}
              {b.specialNeeds && <p style={{fontSize:12,color:md}}>Special requirements: <strong style={{color:dk}}>{b.specialNeeds}</strong></p>}
              {(b.childSeats || b.childCutlery || b.bottleKit) && (
                <div style={{marginTop:6}}>
                  <span style={{fontSize:12,color:md}}>Children's equipment requested: </span>
                  <strong style={{fontSize:12,color:dk}}>
                    {[b.childSeats&&"Child seats",b.childCutlery&&"Cutlery sets",b.bottleKit&&"Toddler bottle kit"].filter(Boolean).join(", ")}
                  </strong>
                </div>
              )}
              {b.message && <p style={{fontSize:13,color:dk,marginTop:8,padding:"10px 14px",background:"rgba(255,255,255,0.6)",borderRadius:6}}>"{b.message}"</p>}
            </div>
          )}

          {/* Show special needs & child equipment for all statuses (not just enquiry) */}
          {b.status !== "enquiry" && (b.specialNeeds || b.childSeats || b.childCutlery || b.bottleKit) && (
            <div style={{...S.cd,marginBottom:20,borderLeft:`3px solid ${gd}`}}>
              <h3 style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:gd,marginBottom:8}}>Guest Requirements</h3>
              {b.specialNeeds && <p style={{fontSize:12,color:md}}>Special requirements: <strong style={{color:dk}}>{b.specialNeeds}</strong></p>}
              {b.dietary && <p style={{fontSize:12,color:md}}>Dietary: {b.dietary}</p>}
              {(b.childSeats || b.childCutlery || b.bottleKit) && (
                <div style={{marginTop:4}}>
                  <span style={{fontSize:12,color:md}}>Children's equipment: </span>
                  <strong style={{fontSize:12,color:dk}}>
                    {[b.childSeats&&"Child seats",b.childCutlery&&"Cutlery sets",b.bottleKit&&"Toddler bottle kit"].filter(Boolean).join(", ")}
                  </strong>
                </div>
              )}
            </div>
          )}

          {/* Guest Details */}
          <div style={{...S.cd,marginBottom:20}}>
            <h2 style={{fontFamily:sf,fontSize:22,fontWeight:500,marginBottom:16}}>Guest Details</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
              <div><label style={S.lb}>Name</label><input style={S.ip} value={b.guestName} onChange={e=>upd("guestName",e.target.value)}/></div>
              <div><label style={S.lb}>Email</label><input style={S.ip} value={b.guestEmail} onChange={e=>upd("guestEmail",e.target.value)}/></div>
              <div><label style={S.lb}>Phone</label><input style={S.ip} value={b.guestPhone} onChange={e=>upd("guestPhone",e.target.value)}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:14,marginTop:14}}>
              <div><label style={S.lb}>Guests</label>
                <select style={S.sl} value={b.guestCount} onChange={e=>upd("guestCount",e.target.value)}>
                  {GUESTS.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div><label style={S.lb}>Package</label>
                <select style={S.sl} value={b.packageId} onChange={e=>chgPkg(e.target.value)}>
                  {Object.entries(PACKAGES).map(([k,v])=><option key={k} value={k}>{v.name}</option>)}
                </select>
              </div>
              <div><label style={S.lb}>Start Date</label><input type="date" style={S.ip} value={b.startDate} onChange={e=>upd("startDate",e.target.value)}/></div>
              <div><label style={S.lb}>Total Days</label><input type="number" min="3" style={S.ip} value={b.totalDays} onChange={e=>upd("totalDays",parseInt(e.target.value)||0)}/></div>
            </div>
          </div>

          {/* Stops */}
          <div style={{...S.cd,marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h2 style={{fontFamily:sf,fontSize:22,fontWeight:500}}>Stops & Accommodation</h2>
              <button onClick={()=>updBk({...b,stops:[...b.stops,{name:"New Stop",mode:"camping",nights:1,accomOptions:[],selectedAccom:null}]})}
                style={{...S.bt,...S.bh,padding:"8px 16px",fontSize:10}}>+ Add Stop</button>
            </div>
            {b.stops.map((stop, si) => {
              const dbSource = stop.mode === "camping" ? CAMPSITES : PROPERTIES;
              const avail = dbSource[stop.name] || [];
              const added = stop.accomOptions.map(o => o.name);
              const unadded = avail.filter(p => !added.includes(p.name));
              return (
                <div key={si} style={{padding:"16px 0",borderBottom:si<b.stops.length-1?`1px solid ${bd}`:"none"}}>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 80px 80px",gap:10,alignItems:"end"}}>
                    <div><label style={S.lb}>Stop</label><input style={S.ip} value={stop.name} onChange={e=>updStop(si,"name",e.target.value)}/></div>
                    <div><label style={S.lb}>Mode</label>
                      <select style={{...S.sl,borderColor:stop.mode==="touring"?tr:tl,color:stop.mode==="touring"?tr:tl}}
                        value={stop.mode} onChange={e=>updStop(si,"mode",e.target.value)}>
                        <option value="camping">Camping</option><option value="touring">Touring</option>
                      </select>
                    </div>
                    <div><label style={S.lb}>Nights</label><input type="number" min="1" style={S.ip} value={stop.nights} onChange={e=>updStop(si,"nights",parseInt(e.target.value)||1)}/></div>
                    <div><button onClick={()=>updBk({...b,stops:b.stops.filter((_,i)=>i!==si)})} style={{...S.bt,...S.bh,padding:"12px",fontSize:10,width:"100%",color:tr}}>Remove</button></div>
                  </div>

                  {stop.mode==="touring" && stop.selectedAccom && (
                    <div style={{marginTop:10,padding:"10px 16px",background:"#E8F5E9",borderRadius:6,borderLeft:"3px solid #2E7D32"}}>
                      <span style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#2E7D32"}}>Guest selected: </span>
                      <span style={{fontFamily:sf,fontSize:15,fontWeight:500}}>{stop.selectedAccom}</span>
                      {(()=>{const s=stop.accomOptions.find(o=>o.name===stop.selectedAccom);return s?<span style={{fontSize:12,color:md}}> · ${s.ppn}/n × {stop.nights}n = ${s.ppn*stop.nights}</span>:null})()}
                    </div>
                  )}

                  {stop.mode==="camping" && stop.selectedAccom && (
                    <div style={{marginTop:10,padding:"10px 16px",background:`${tl}08`,borderRadius:6,borderLeft:`3px solid ${tl}`}}>
                      <span style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:tl}}>Guest selected: </span>
                      <span style={{fontFamily:sf,fontSize:15,fontWeight:500}}>{stop.selectedAccom}</span>
                      {(()=>{const s=stop.accomOptions.find(o=>o.name===stop.selectedAccom);return s&&s.ppn>0?<span style={{fontSize:12,color:md}}> · ${s.ppn}/n × {stop.nights}n = ${s.ppn*stop.nights}</span>:null})()}
                    </div>
                  )}

                  {/* Options for both modes */}
                  {(stop.mode === "touring" || stop.mode === "camping") && (
                    <div style={{marginTop:12,paddingLeft:16,borderLeft:`2px solid ${stop.mode==="touring"?tr:tl}20`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <span style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:stop.mode==="touring"?tr:tl}}>
                          {stop.mode==="touring"?"Accommodation":"Campsite"} Options ({stop.accomOptions.length})
                        </span>
                        <div style={{display:"flex",gap:8}}>
                          {unadded.length > 0 && (
                            <select onChange={e=>{if(e.target.value){addFromDb(si,e.target.value,stop.mode);e.target.value=""}}}
                              style={{padding:"6px 10px",borderRadius:4,border:`1px solid ${bd}`,fontSize:11,color:md,cursor:"pointer"}}>
                              <option value="">+ From database</option>
                              {unadded.map((p,i)=><option key={i} value={p.name}>{p.name}{p.ppn>0?` — $${p.ppn}/n`:""}</option>)}
                            </select>
                          )}
                          <button onClick={()=>addCustom(si)} style={{fontSize:10,fontWeight:600,color:gd,background:"none",border:`1px solid ${gd}40`,borderRadius:4,padding:"6px 12px",cursor:"pointer"}}>+ Custom</button>
                        </div>
                      </div>
                      {stop.accomOptions.map((opt,ai)=>(
                        <div key={ai} style={{display:"grid",gridTemplateColumns:"2fr 1fr 2fr 80px 40px",gap:8,marginBottom:8,alignItems:"end"}}>
                          <div><label style={{...S.lb,fontSize:9}}>Name</label><input style={{...S.ip,padding:"10px 12px",fontSize:12}} value={opt.name} onChange={e=>updAccom(si,ai,"name",e.target.value)}/></div>
                          <div><label style={{...S.lb,fontSize:9}}>Type</label><input style={{...S.ip,padding:"10px 12px",fontSize:12}} value={opt.type} onChange={e=>updAccom(si,ai,"type",e.target.value)}/></div>
                          <div><label style={{...S.lb,fontSize:9}}>Desc</label><input style={{...S.ip,padding:"10px 12px",fontSize:12}} value={opt.desc} onChange={e=>updAccom(si,ai,"desc",e.target.value)}/></div>
                          <div><label style={{...S.lb,fontSize:9}}>$/Night</label><input type="number" style={{...S.ip,padding:"10px 12px",fontSize:12}} value={opt.ppn} onChange={e=>updAccom(si,ai,"ppn",parseInt(e.target.value)||0)}/></div>
                          <button onClick={()=>rmAccom(si,ai)} style={{fontSize:10,color:tr,background:"none",border:`1px solid ${bd}`,borderRadius:4,padding:"10px",cursor:"pointer"}}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Admin Controls — Visa, Bond, Ultra-Luxury */}
          <div style={{...S.cd,marginBottom:20}}>
            <h2 style={{fontFamily:sf,fontSize:22,fontWeight:500,marginBottom:16}}>Admin Controls</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
              <div><label style={S.lb}>Visa — Fuel ($)</label>
                <input type="number" style={S.ip} value={b.visaFuelOverride ?? ""} placeholder="Auto: $1,000"
                  onChange={e=>upd("visaFuelOverride",e.target.value?parseInt(e.target.value):undefined)}/></div>
              <div><label style={S.lb}>Visa — Dining ($)</label>
                <input type="number" style={S.ip} value={b.visaDiningOverride ?? ""} placeholder={`Auto: $${visaCalc({...b,visaFuelOverride:undefined,visaDiningOverride:undefined}).dining}`}
                  onChange={e=>upd("visaDiningOverride",e.target.value?parseInt(e.target.value):undefined)}/></div>
              <div><label style={S.lb}>Peace of Mind</label>
                <select style={{...S.sl,borderColor:(b.bondOption&&b.bondOption!=="none")?gd:bd,color:(b.bondOption&&b.bondOption!=="none")?gd:dk}}
                  value={b.bondOption||"none"} onChange={e=>upd("bondOption",e.target.value)}>
                  <option value="none">Standard Bond — $7,500</option>
                  <option value="assurance">Assurance — ${Math.min(38*q.days,380)} (bond → $5,000)</option>
                  <option value="complete">Complete — ${Math.min(55*q.days,550)} (bond → $3,500)</option>
                </select></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:14,marginTop:14}}>
              <div><label style={S.lb}>Ultra-Luxury Supplements ($)</label>
                <input type="number" style={S.ip} value={b.supplements} onChange={e=>upd("supplements",parseInt(e.target.value)||0)}/></div>
              <div><label style={S.lb}>Notes</label>
                <input style={S.ip} value={b.notes} onChange={e=>upd("notes",e.target.value)} placeholder="Internal notes"/></div>
            </div>
          </div>

          {/* Quote & Visa */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
            <div style={S.cd}>
              <h3 style={{fontFamily:sf,fontSize:20,fontWeight:500,marginBottom:12}}>Quote</h3>
              <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{fontSize:13,color:md}}>{q.days}d × $1,200</span><span style={{fontSize:13,fontWeight:600}}>${q.sub.toLocaleString()}</span></div>
              {q.sup>0 && <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{fontSize:13,color:md}}>Ultra-luxury supplements</span><span style={{fontSize:13,fontWeight:600}}>${q.sup.toLocaleString()}</span></div>}
              {q.pom>0 && <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{fontSize:13,color:gd}}>Peace of Mind — {(b.bondOption||"none")==="assurance"?"Assurance":"Complete"}</span><span style={{fontSize:13,fontWeight:600,color:gd}}>${q.pom.toLocaleString()}</span></div>}
              <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",marginTop:6,borderTop:`1px solid ${bd}`}}>
                <span style={{fontFamily:sf,fontSize:18,fontWeight:500}}>Total</span><span style={{fontFamily:sf,fontSize:18,fontWeight:600}}>${q.total.toLocaleString()}</span>
              </div>
              <div style={{marginTop:12,padding:"10px 14px",background:sd,borderRadius:4}}>
                {(()=>{
                  const opt = b.bondOption || "none";
                  const bondAmt = opt==="assurance"?5000:opt==="complete"?3500:7500;
                  const pomCost = opt==="assurance"?Math.min(38*q.days,380):opt==="complete"?Math.min(55*q.days,550):0;
                  return <>
                    <div style={{fontSize:11,color:md}}>Bond: <strong>${bondAmt.toLocaleString()}</strong></div>
                    {opt!=="none" && <div style={{fontSize:11,color:gd}}>Peace of Mind {opt==="assurance"?"Assurance":"Complete"}: <strong>${pomCost}</strong></div>}
                  </>;
                })()}
              </div>
            </div>
            <div style={{...S.cd,borderLeft:`3px solid ${gd}`}}>
              <h3 style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:gd,marginBottom:12}}>Visa Pre-load</h3>
              <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}>
                <span style={{fontSize:13,color:md}}>Fuel{b.visaFuelOverride!==undefined?<span style={{color:gd}}> (override)</span>:""}</span>
                <span>${v.fuel.toLocaleString()}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}>
                <span style={{fontSize:13,color:md}}>Dining{b.visaDiningOverride!==undefined?<span style={{color:gd}}> (override)</span>:""}</span>
                <span>${v.dining.toLocaleString()}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",marginTop:6,borderTop:`1px solid ${bd}`}}>
                <span style={{fontWeight:600}}>Total</span><span style={{fontWeight:600,color:gd}}>${v.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Guest Selections */}
          {b.stops.some(s => s.selectedAccom) && (
            <div style={{...S.cd,marginBottom:20,borderLeft:`3px solid #2E7D32`}}>
              <h3 style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#2E7D32",marginBottom:12}}>Guest Selections</h3>
              {b.stops.filter(s=>s.selectedAccom).map((s,i,arr)=>{
                const sel=s.accomOptions.find(o=>o.name===s.selectedAccom);
                return <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${bd}`:"none"}}>
                  <span style={{fontSize:13,color:md}}>{s.name}</span>
                  <span style={{fontSize:13,fontWeight:500}}>{s.selectedAccom}{sel?` · $${sel.ppn} × ${s.nights}n = $${sel.ppn*s.nights}`:""}</span>
                </div>;
              })}
              {(()=>{const t=b.stops.filter(s=>s.selectedAccom).reduce((a,s)=>{const sel=s.accomOptions.find(o=>o.name===s.selectedAccom);return a+(sel?sel.ppn*s.nights:0)},0);
                return t>0?<div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",marginTop:6,borderTop:`1px solid ${bd}`}}>
                  <span style={{fontFamily:sf,fontSize:16,fontWeight:500,color:"#2E7D32"}}>Total Accom</span>
                  <span style={{fontFamily:sf,fontSize:16,fontWeight:600,color:"#2E7D32"}}>${t.toLocaleString()}</span>
                </div>:null})()}
            </div>
          )}

          {/* Share */}
          <div style={S.cd}>
            <h3 style={{fontFamily:sf,fontSize:20,fontWeight:500,marginBottom:12}}>Share with Guest</h3>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}>
              <input style={{...S.ip,flex:1,fontSize:12,color:lt}} value={gLink} readOnly onClick={e=>e.target.select()}/>
              <button onClick={copyLink} style={{...S.bt,...S.bg2,padding:"13px 20px",whiteSpace:"nowrap"}}>{copied?"Copied!":"Copy Link"}</button>
            </div>
            <p style={{fontSize:11,color:lt,marginBottom:16}}>This is a short link — safe to email or text to your guest.</p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {b.status !== "sent" && b.status !== "confirmed" && <button onClick={()=>updBk({...b,status:"sent"})} style={{...S.bt,...S.bp}}>Mark as Sent</button>}
              <button onClick={()=>{setView("dashboard");loadAllBookings()}} style={{...S.bt,...S.bh}}>Back</button>
              <button onClick={()=>{if(confirm("Delete?"))delBk(b.id)}} style={{...S.bt,...S.bh,color:tr,borderColor:`${tr}40`}}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

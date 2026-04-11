import { useState, useEffect } from "react";
import { db } from "./firebase.js";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";

/* ════════════════════════════════════════════════════════════════
   PROPERTY DATABASE
   ════════════════════════════════════════════════════════════════ */
const PROPERTIES = {
  "Rainbow Beach & Inskip": [
    { name:"Rainbow Beach Surf Club Resort — Standard Room", type:"Rainbow Beach Surf Club Resort", ppn:180, desc:"Beachfront, surf club dining" },
    { name:"Rainbow Beach Surf Club Resort — Ocean View Room", type:"Rainbow Beach Surf Club Resort", ppn:220, desc:"Beachfront, surf club dining" },
    { name:"Rainbow Beach Surf Club Resort — Suite", type:"Rainbow Beach Surf Club Resort", ppn:280, desc:"Beachfront, surf club dining" },
    { name:"Plantation Resort at Rainbow — 1-Bed Unit", type:"Plantation Resort at Rainbow", ppn:200, desc:"Pool, self-contained" },
    { name:"Plantation Resort at Rainbow — 2-Bed Unit", type:"Plantation Resort at Rainbow", ppn:280, desc:"Pool, self-contained" },
    { name:"Plantation Resort at Rainbow — 3-Bed Unit", type:"Plantation Resort at Rainbow", ppn:350, desc:"Pool, self-contained" },
    { name:"Rainbow Getaway Holiday Apartments — 1-Bed Apartment", type:"Rainbow Getaway Holiday Apartments", ppn:170, desc:"Central, good value" },
    { name:"Rainbow Getaway Holiday Apartments — 2-Bed Apartment", type:"Rainbow Getaway Holiday Apartments", ppn:230, desc:"Central, good value" },
    { name:"Debbie's Place — Studio", type:"Debbie's Place", ppn:150, desc:"Budget-mid option" },
    { name:"Debbie's Place — 1-Bed Apartment", type:"Debbie's Place", ppn:200, desc:"Budget-mid option" },
    { name:"Rainbow Ocean Palms Resort — Studio", type:"Rainbow Ocean Palms Resort", ppn:180, desc:"Pool, close to beach" },
    { name:"Rainbow Ocean Palms Resort — 1-Bed Suite", type:"Rainbow Ocean Palms Resort", ppn:230, desc:"Pool, close to beach" },
    { name:"Rainbow Ocean Palms Resort — 2-Bed Suite", type:"Rainbow Ocean Palms Resort", ppn:300, desc:"Pool, close to beach" },
  ],
  "Southern K'gari": [
    { name:"Kingfisher Bay Resort — Hotel — Resort Room", type:"Kingfisher Bay Resort — Hotel", ppn:200, desc:"West coast, eco-resort, 4 pools" },
    { name:"Kingfisher Bay Resort — Hotel — Spa Room", type:"Kingfisher Bay Resort — Hotel", ppn:280, desc:"West coast, eco-resort, 4 pools" },
    { name:"Kingfisher Bay Resort — Villa — 1-Bed Villa", type:"Kingfisher Bay Resort — Villa", ppn:300, desc:"Self-contained, bushland setting" },
    { name:"Kingfisher Bay Resort — Villa — 2-Bed Villa", type:"Kingfisher Bay Resort — Villa", ppn:400, desc:"Self-contained, bushland setting" },
    { name:"Kingfisher Bay Resort — Villa — 3-Bed Kingfisher House", type:"Kingfisher Bay Resort — Villa", ppn:500, desc:"Self-contained, bushland setting" },
    { name:"Eurong Beach Resort — Standard Room", type:"Eurong Beach Resort", ppn:180, desc:"East coast, 75 Mile Beach access" },
    { name:"Eurong Beach Resort — Beach View Room", type:"Eurong Beach Resort", ppn:250, desc:"East coast, 75 Mile Beach access" },
    { name:"Eurong Beach Resort — Family Room", type:"Eurong Beach Resort", ppn:300, desc:"East coast, 75 Mile Beach access" },
    { name:"K'gari Beach Houses — 2-Bed Beach House", type:"K'gari Beach Houses", ppn:350, desc:"Private houses, beachfront" },
    { name:"K'gari Beach Houses — 3-Bed Beach House", type:"K'gari Beach Houses", ppn:450, desc:"Private houses, beachfront" },
    { name:"Sailfish on Fraser — Apartment", type:"Sailfish on Fraser", ppn:250, desc:"Happy Valley, self-contained" },
    { name:"Sailfish on Fraser — Penthouse", type:"Sailfish on Fraser", ppn:380, desc:"Happy Valley, self-contained" },
  ],
  "75 Mile Beach": [
    { name:"Kingfisher Bay Resort — Hotel — Resort Room", type:"Kingfisher Bay Resort — Hotel", ppn:200, desc:"West coast, eco-resort, 4 pools" },
    { name:"Kingfisher Bay Resort — Hotel — Spa Room", type:"Kingfisher Bay Resort — Hotel", ppn:280, desc:"West coast, eco-resort, 4 pools" },
    { name:"Kingfisher Bay Resort — Villa — 1-Bed Villa", type:"Kingfisher Bay Resort — Villa", ppn:300, desc:"Self-contained, bushland setting" },
    { name:"Kingfisher Bay Resort — Villa — 2-Bed Villa", type:"Kingfisher Bay Resort — Villa", ppn:400, desc:"Self-contained, bushland setting" },
    { name:"Kingfisher Bay Resort — Villa — 3-Bed Kingfisher House", type:"Kingfisher Bay Resort — Villa", ppn:500, desc:"Self-contained, bushland setting" },
    { name:"Eurong Beach Resort — Standard Room", type:"Eurong Beach Resort", ppn:180, desc:"East coast, 75 Mile Beach access" },
    { name:"Eurong Beach Resort — Beach View Room", type:"Eurong Beach Resort", ppn:250, desc:"East coast, 75 Mile Beach access" },
    { name:"Eurong Beach Resort — Family Room", type:"Eurong Beach Resort", ppn:300, desc:"East coast, 75 Mile Beach access" },
    { name:"K'gari Beach Houses — 2-Bed Beach House", type:"K'gari Beach Houses", ppn:350, desc:"Private houses, beachfront" },
    { name:"K'gari Beach Houses — 3-Bed Beach House", type:"K'gari Beach Houses", ppn:450, desc:"Private houses, beachfront" },
    { name:"Sailfish on Fraser — Apartment", type:"Sailfish on Fraser", ppn:250, desc:"Happy Valley, self-contained" },
    { name:"Sailfish on Fraser — Penthouse", type:"Sailfish on Fraser", ppn:380, desc:"Happy Valley, self-contained" },
  ],
  "Northern K'gari": [
    { name:"Kingfisher Bay Resort — Hotel — Resort Room", type:"Kingfisher Bay Resort — Hotel", ppn:200, desc:"West coast, eco-resort, 4 pools" },
    { name:"Kingfisher Bay Resort — Hotel — Spa Room", type:"Kingfisher Bay Resort — Hotel", ppn:280, desc:"West coast, eco-resort, 4 pools" },
    { name:"Kingfisher Bay Resort — Villa — 1-Bed Villa", type:"Kingfisher Bay Resort — Villa", ppn:300, desc:"Self-contained, bushland setting" },
    { name:"Kingfisher Bay Resort — Villa — 2-Bed Villa", type:"Kingfisher Bay Resort — Villa", ppn:400, desc:"Self-contained, bushland setting" },
    { name:"Kingfisher Bay Resort — Villa — 3-Bed Kingfisher House", type:"Kingfisher Bay Resort — Villa", ppn:500, desc:"Self-contained, bushland setting" },
    { name:"Eurong Beach Resort — Standard Room", type:"Eurong Beach Resort", ppn:180, desc:"East coast, 75 Mile Beach access" },
    { name:"Eurong Beach Resort — Beach View Room", type:"Eurong Beach Resort", ppn:250, desc:"East coast, 75 Mile Beach access" },
    { name:"Eurong Beach Resort — Family Room", type:"Eurong Beach Resort", ppn:300, desc:"East coast, 75 Mile Beach access" },
    { name:"K'gari Beach Houses — 2-Bed Beach House", type:"K'gari Beach Houses", ppn:350, desc:"Private houses, beachfront" },
    { name:"K'gari Beach Houses — 3-Bed Beach House", type:"K'gari Beach Houses", ppn:450, desc:"Private houses, beachfront" },
    { name:"Sailfish on Fraser — Apartment", type:"Sailfish on Fraser", ppn:250, desc:"Happy Valley, self-contained" },
    { name:"Sailfish on Fraser — Penthouse", type:"Sailfish on Fraser", ppn:380, desc:"Happy Valley, self-contained" },
  ],
  "Hervey Bay (optional)": [
    { name:"Mantra Hervey Bay — Hotel Room", type:"Mantra Hervey Bay", ppn:180, desc:"Marina, whale watching departure point" },
    { name:"Mantra Hervey Bay — 1-Bed Apartment", type:"Mantra Hervey Bay", ppn:250, desc:"Marina, whale watching departure point" },
    { name:"Mantra Hervey Bay — 2-Bed Apartment", type:"Mantra Hervey Bay", ppn:320, desc:"Marina, whale watching departure point" },
    { name:"Oaks Resort & Spa — 1-Bed Suite", type:"Oaks Resort & Spa", ppn:200, desc:"Beachfront, spa" },
    { name:"Oaks Resort & Spa — 2-Bed Suite", type:"Oaks Resort & Spa", ppn:280, desc:"Beachfront, spa" },
    { name:"Oaks Resort & Spa — Penthouse", type:"Oaks Resort & Spa", ppn:400, desc:"Beachfront, spa" },
    { name:"Ramada Hervey Bay — Standard Room", type:"Ramada Hervey Bay", ppn:160, desc:"Central, good value" },
    { name:"Ramada Hervey Bay — Ocean View", type:"Ramada Hervey Bay", ppn:220, desc:"Central, good value" },
    { name:"Ramada Hervey Bay — Suite", type:"Ramada Hervey Bay", ppn:300, desc:"Central, good value" },
    { name:"Oceans Resort & Spa — Ocean Room", type:"Oceans Resort & Spa", ppn:220, desc:"Beachfront, premium" },
    { name:"Oceans Resort & Spa — Spa Suite", type:"Oceans Resort & Spa", ppn:300, desc:"Beachfront, premium" },
    { name:"Oceans Resort & Spa — Penthouse", type:"Oceans Resort & Spa", ppn:420, desc:"Beachfront, premium" },
    { name:"Akama Resort — Studio", type:"Akama Resort", ppn:150, desc:"Budget-mid, pool" },
    { name:"Akama Resort — 1-Bed Apartment", type:"Akama Resort", ppn:200, desc:"Budget-mid, pool" },
    { name:"Akama Resort — 2-Bed Apartment", type:"Akama Resort", ppn:280, desc:"Budget-mid, pool" },
  ],
  "Cairns": [
    { name:"Riley Crystalbrook — Urban Room", type:"Riley Crystalbrook", ppn:300, desc:"5-star, Esplanade location, rooftop bar" },
    { name:"Riley Crystalbrook — Lagoon Room", type:"Riley Crystalbrook", ppn:380, desc:"5-star, Esplanade location, rooftop bar" },
    { name:"Riley Crystalbrook — Suite", type:"Riley Crystalbrook", ppn:500, desc:"5-star, Esplanade location, rooftop bar" },
    { name:"Pullman Cairns International — Superior Room", type:"Pullman Cairns International", ppn:250, desc:"5-star, CBD, harbour views" },
    { name:"Pullman Cairns International — Deluxe Harbour View", type:"Pullman Cairns International", ppn:320, desc:"5-star, CBD, harbour views" },
    { name:"Pullman Cairns International — Suite", type:"Pullman Cairns International", ppn:450, desc:"5-star, CBD, harbour views" },
    { name:"Shangri-La The Marina — Deluxe Room", type:"Shangri-La The Marina", ppn:280, desc:"5-star, marina views, club lounge" },
    { name:"Shangri-La The Marina — Horizon Club", type:"Shangri-La The Marina", ppn:380, desc:"5-star, marina views, club lounge" },
    { name:"Shangri-La The Marina — Suite", type:"Shangri-La The Marina", ppn:520, desc:"5-star, marina views, club lounge" },
    { name:"Crystalbrook Flynn — Urban Room", type:"Crystalbrook Flynn", ppn:250, desc:"5-star, arts precinct" },
    { name:"Crystalbrook Flynn — Flynn Suite", type:"Crystalbrook Flynn", ppn:350, desc:"5-star, arts precinct" },
    { name:"Crystalbrook Flynn — Penthouse", type:"Crystalbrook Flynn", ppn:500, desc:"5-star, arts precinct" },
    { name:"Alamanda Palm Cove — 1-Bed Apartment", type:"Alamanda Palm Cove", ppn:300, desc:"Beachfront Palm Cove, 20min from Cairns" },
    { name:"Alamanda Palm Cove — 2-Bed Apartment", type:"Alamanda Palm Cove", ppn:400, desc:"Beachfront Palm Cove, 20min from Cairns" },
    { name:"Alamanda Palm Cove — Penthouse", type:"Alamanda Palm Cove", ppn:550, desc:"Beachfront Palm Cove, 20min from Cairns" },
  ],
  "Cairns (return)": [
    { name:"Riley Crystalbrook — Urban Room", type:"Riley Crystalbrook", ppn:300, desc:"5-star, Esplanade location, rooftop bar" },
    { name:"Riley Crystalbrook — Lagoon Room", type:"Riley Crystalbrook", ppn:380, desc:"5-star, Esplanade location, rooftop bar" },
    { name:"Riley Crystalbrook — Suite", type:"Riley Crystalbrook", ppn:500, desc:"5-star, Esplanade location, rooftop bar" },
    { name:"Pullman Cairns International — Superior Room", type:"Pullman Cairns International", ppn:250, desc:"5-star, CBD, harbour views" },
    { name:"Pullman Cairns International — Deluxe Harbour View", type:"Pullman Cairns International", ppn:320, desc:"5-star, CBD, harbour views" },
    { name:"Pullman Cairns International — Suite", type:"Pullman Cairns International", ppn:450, desc:"5-star, CBD, harbour views" },
    { name:"Shangri-La The Marina — Deluxe Room", type:"Shangri-La The Marina", ppn:280, desc:"5-star, marina views, club lounge" },
    { name:"Shangri-La The Marina — Horizon Club", type:"Shangri-La The Marina", ppn:380, desc:"5-star, marina views, club lounge" },
    { name:"Shangri-La The Marina — Suite", type:"Shangri-La The Marina", ppn:520, desc:"5-star, marina views, club lounge" },
    { name:"Crystalbrook Flynn — Urban Room", type:"Crystalbrook Flynn", ppn:250, desc:"5-star, arts precinct" },
    { name:"Crystalbrook Flynn — Flynn Suite", type:"Crystalbrook Flynn", ppn:350, desc:"5-star, arts precinct" },
    { name:"Crystalbrook Flynn — Penthouse", type:"Crystalbrook Flynn", ppn:500, desc:"5-star, arts precinct" },
    { name:"Alamanda Palm Cove — 1-Bed Apartment", type:"Alamanda Palm Cove", ppn:300, desc:"Beachfront Palm Cove, 20min from Cairns" },
    { name:"Alamanda Palm Cove — 2-Bed Apartment", type:"Alamanda Palm Cove", ppn:400, desc:"Beachfront Palm Cove, 20min from Cairns" },
    { name:"Alamanda Palm Cove — Penthouse", type:"Alamanda Palm Cove", ppn:550, desc:"Beachfront Palm Cove, 20min from Cairns" },
  ],
  "Port Douglas & Mossman Gorge": [
    { name:"Sheraton Grand Mirage — Mirage Room", type:"Sheraton Grand Mirage", ppn:350, desc:"5-star, lagoon pools, Four Mile Beach" },
    { name:"Sheraton Grand Mirage — Lagoon Room", type:"Sheraton Grand Mirage", ppn:420, desc:"5-star, lagoon pools, Four Mile Beach" },
    { name:"Sheraton Grand Mirage — Villa Suite", type:"Sheraton Grand Mirage", ppn:550, desc:"5-star, lagoon pools, Four Mile Beach" },
    { name:"QT Port Douglas — QT Room", type:"QT Port Douglas", ppn:280, desc:"Boutique, quirky design, central" },
    { name:"QT Port Douglas — QT Suite", type:"QT Port Douglas", ppn:380, desc:"Boutique, quirky design, central" },
    { name:"QT Port Douglas — Director's Suite", type:"QT Port Douglas", ppn:500, desc:"Boutique, quirky design, central" },
    { name:"Pullman Sea Temple Resort — 1-Bed Apartment", type:"Pullman Sea Temple Resort", ppn:300, desc:"Huge lagoon pool, beachfront" },
    { name:"Pullman Sea Temple Resort — Swim-out Apartment", type:"Pullman Sea Temple Resort", ppn:400, desc:"Huge lagoon pool, beachfront" },
    { name:"Pullman Sea Temple Resort — Penthouse", type:"Pullman Sea Temple Resort", ppn:550, desc:"Huge lagoon pool, beachfront" },
    { name:"Niramaya Villas & Spa — 1-Bed Villa", type:"Niramaya Villas & Spa", ppn:350, desc:"Private rainforest villas, spa" },
    { name:"Niramaya Villas & Spa — 2-Bed Villa", type:"Niramaya Villas & Spa", ppn:450, desc:"Private rainforest villas, spa" },
    { name:"Niramaya Villas & Spa — 3-Bed Villa", type:"Niramaya Villas & Spa", ppn:550, desc:"Private rainforest villas, spa" },
    { name:"Peninsula Boutique Hotel — Pool View Room", type:"Peninsula Boutique Hotel", ppn:280, desc:"Adults only, beachfront, intimate" },
    { name:"Peninsula Boutique Hotel — Ocean View Room", type:"Peninsula Boutique Hotel", ppn:350, desc:"Adults only, beachfront, intimate" },
    { name:"Peninsula Boutique Hotel — Penthouse Suite", type:"Peninsula Boutique Hotel", ppn:500, desc:"Adults only, beachfront, intimate" },
  ],
  "Daintree Rainforest": [
    { name:"Daintree Eco Lodge & Spa — Bayans Room", type:"Daintree Eco Lodge & Spa", ppn:320, desc:"Boutique eco-lodge, rainforest immersion" },
    { name:"Daintree Eco Lodge & Spa — Bayans Deluxe", type:"Daintree Eco Lodge & Spa", ppn:400, desc:"Boutique eco-lodge, rainforest immersion" },
    { name:"Daintree Eco Lodge & Spa — Treehouse", type:"Daintree Eco Lodge & Spa", ppn:480, desc:"Boutique eco-lodge, rainforest immersion" },
    { name:"Daintree Riverview Lodges — Riverview Cabin", type:"Daintree Riverview Lodges", ppn:180, desc:"Budget-luxury, river setting" },
    { name:"Daintree Riverview Lodges — Deluxe Cabin", type:"Daintree Riverview Lodges", ppn:250, desc:"Budget-luxury, river setting" },
    { name:"Heritage Lodge Daintree — Heritage Room", type:"Heritage Lodge Daintree", ppn:200, desc:"Heritage-listed, character property" },
    { name:"Heritage Lodge Daintree — Rainforest Suite", type:"Heritage Lodge Daintree", ppn:280, desc:"Heritage-listed, character property" },
    { name:"Heritage Lodge Daintree — Treehouse", type:"Heritage Lodge Daintree", ppn:350, desc:"Heritage-listed, character property" },
    { name:"Silky Oaks Lodge — Treehouse Retreat", type:"Silky Oaks Lodge", ppn:900, desc:"★ UPGRADE: Baillie Lodges ultra-luxury. Supplement above $550" },
    { name:"Silky Oaks Lodge — Riverhouse", type:"Silky Oaks Lodge", ppn:1200, desc:"★ UPGRADE: Baillie Lodges ultra-luxury. Supplement above $550" },
    { name:"Silky Oaks Lodge — Daintree Pavilion", type:"Silky Oaks Lodge", ppn:1800, desc:"★ UPGRADE: Baillie Lodges ultra-luxury. Supplement above $550" },
    { name:"Red Mill House B&B — Garden Room", type:"Red Mill House B&B", ppn:220, desc:"Birders' paradise, personal hosts" },
    { name:"Red Mill House B&B — Canopy Room", type:"Red Mill House B&B", ppn:280, desc:"Birders' paradise, personal hosts" },
  ],
  "Cape Tribulation": [
    { name:"Cape Trib Beach House — Beachfront Room", type:"Cape Trib Beach House", ppn:250, desc:"Best on Cape Trib, beach + rainforest" },
    { name:"Cape Trib Beach House — Rainforest Suite", type:"Cape Trib Beach House", ppn:320, desc:"Best on Cape Trib, beach + rainforest" },
    { name:"Cape Trib Beach House — Beach Cabin", type:"Cape Trib Beach House", ppn:280, desc:"Best on Cape Trib, beach + rainforest" },
    { name:"Ferntree Rainforest Lodge — Rainforest Room", type:"Ferntree Rainforest Lodge", ppn:180, desc:"Budget-mid, good location" },
    { name:"Ferntree Rainforest Lodge — Treehouse Room", type:"Ferntree Rainforest Lodge", ppn:220, desc:"Budget-mid, good location" },
    { name:"Ferntree Rainforest Lodge — Canopy Suite", type:"Ferntree Rainforest Lodge", ppn:280, desc:"Budget-mid, good location" },
    { name:"Daintree Wilderness Lodge — Eco Cabin", type:"Daintree Wilderness Lodge", ppn:280, desc:"Remote eco experience" },
    { name:"Daintree Wilderness Lodge — Luxury Cabin", type:"Daintree Wilderness Lodge", ppn:380, desc:"Remote eco experience" },
    { name:"Cape Tribulation Camping — Safari Tent", type:"Cape Tribulation Camping", ppn:120, desc:"Budget option if needed" },
    { name:"Cape Tribulation Camping — Cabin", type:"Cape Tribulation Camping", ppn:160, desc:"Budget option if needed" },
    { name:"Epiphyte B&B — Garden Room", type:"Epiphyte B&B", ppn:200, desc:"Boutique B&B, personal touch" },
    { name:"Epiphyte B&B — Rainforest Room", type:"Epiphyte B&B", ppn:250, desc:"Boutique B&B, personal touch" },
  ],
  "Atherton Tablelands": [
    { name:"Mt Quincan Crater Retreat — Crater View Room", type:"Mt Quincan Crater Retreat", ppn:250, desc:"Stunning crater views, birdwatching" },
    { name:"Mt Quincan Crater Retreat — Luxury Suite", type:"Mt Quincan Crater Retreat", ppn:320, desc:"Stunning crater views, birdwatching" },
    { name:"Eden House Retreat & Mountain Spa — Garden Room", type:"Eden House Retreat & Mountain Spa", ppn:220, desc:"Day spa, mountain setting" },
    { name:"Eden House Retreat & Mountain Spa — Spa Room", type:"Eden House Retreat & Mountain Spa", ppn:300, desc:"Day spa, mountain setting" },
    { name:"Eden House Retreat & Mountain Spa — Suite", type:"Eden House Retreat & Mountain Spa", ppn:380, desc:"Day spa, mountain setting" },
    { name:"Rose Gums Wilderness Retreat — Treehouse", type:"Rose Gums Wilderness Retreat", ppn:350, desc:"Elevated treehouses, private, wildlife" },
    { name:"Rose Gums Wilderness Retreat — Luxury Treehouse", type:"Rose Gums Wilderness Retreat", ppn:450, desc:"Elevated treehouses, private, wildlife" },
    { name:"Crater Lakes Rainforest Cottages — Cottage", type:"Crater Lakes Rainforest Cottages", ppn:200, desc:"Near Lake Eacham, self-contained" },
    { name:"Crater Lakes Rainforest Cottages — Deluxe Cottage", type:"Crater Lakes Rainforest Cottages", ppn:280, desc:"Near Lake Eacham, self-contained" },
    { name:"Allumbah Pocket Cottages — Cottage", type:"Allumbah Pocket Cottages", ppn:180, desc:"Yungaburra village, platypus nearby" },
    { name:"Allumbah Pocket Cottages — Deluxe Cottage", type:"Allumbah Pocket Cottages", ppn:240, desc:"Yungaburra village, platypus nearby" },
  ],
  "Bundaberg & 1770": [
    { name:"Lagoons 1770 Beachfront Resort — Resort Room", type:"Lagoons 1770 Beachfront Resort", ppn:220, desc:"Beachfront 1770, pool, restaurant" },
    { name:"Lagoons 1770 Beachfront Resort — 1-Bed Apartment", type:"Lagoons 1770 Beachfront Resort", ppn:280, desc:"Beachfront 1770, pool, restaurant" },
    { name:"Lagoons 1770 Beachfront Resort — 2-Bed Apartment", type:"Lagoons 1770 Beachfront Resort", ppn:350, desc:"Beachfront 1770, pool, restaurant" },
    { name:"Sandcastles 1770 Motel — Standard Room", type:"Sandcastles 1770 Motel", ppn:160, desc:"Central Agnes Water, pool" },
    { name:"Sandcastles 1770 Motel — Deluxe Room", type:"Sandcastles 1770 Motel", ppn:200, desc:"Central Agnes Water, pool" },
    { name:"Sandcastles 1770 Motel — Family Suite", type:"Sandcastles 1770 Motel", ppn:260, desc:"Central Agnes Water, pool" },
    { name:"Agnes Water Beach Club — Studio", type:"Agnes Water Beach Club", ppn:200, desc:"Modern, rooftop pool" },
    { name:"Agnes Water Beach Club — 1-Bed Apartment", type:"Agnes Water Beach Club", ppn:280, desc:"Modern, rooftop pool" },
    { name:"Agnes Water Beach Club — 2-Bed Penthouse", type:"Agnes Water Beach Club", ppn:380, desc:"Modern, rooftop pool" },
    { name:"The Deck at 1770 — Cabin", type:"The Deck at 1770", ppn:180, desc:"Elevated bush setting" },
    { name:"The Deck at 1770 — Eco Villa", type:"The Deck at 1770", ppn:250, desc:"Elevated bush setting" },
    { name:"Kellys Beach Resort Bargara — Studio", type:"Kellys Beach Resort Bargara", ppn:180, desc:"Near Bundaberg, beachfront Bargara" },
    { name:"Kellys Beach Resort Bargara — 1-Bed Apartment", type:"Kellys Beach Resort Bargara", ppn:240, desc:"Near Bundaberg, beachfront Bargara" },
    { name:"Kellys Beach Resort Bargara — 2-Bed Apartment", type:"Kellys Beach Resort Bargara", ppn:320, desc:"Near Bundaberg, beachfront Bargara" },
  ],
  "1770 & Agnes Water": [
    { name:"Lagoons 1770 Beachfront Resort — Resort Room", type:"Lagoons 1770 Beachfront Resort", ppn:220, desc:"Beachfront 1770, pool, restaurant" },
    { name:"Lagoons 1770 Beachfront Resort — 1-Bed Apartment", type:"Lagoons 1770 Beachfront Resort", ppn:280, desc:"Beachfront 1770, pool, restaurant" },
    { name:"Lagoons 1770 Beachfront Resort — 2-Bed Apartment", type:"Lagoons 1770 Beachfront Resort", ppn:350, desc:"Beachfront 1770, pool, restaurant" },
    { name:"Sandcastles 1770 Motel — Standard Room", type:"Sandcastles 1770 Motel", ppn:160, desc:"Central Agnes Water, pool" },
    { name:"Sandcastles 1770 Motel — Deluxe Room", type:"Sandcastles 1770 Motel", ppn:200, desc:"Central Agnes Water, pool" },
    { name:"Sandcastles 1770 Motel — Family Suite", type:"Sandcastles 1770 Motel", ppn:260, desc:"Central Agnes Water, pool" },
    { name:"Agnes Water Beach Club — Studio", type:"Agnes Water Beach Club", ppn:200, desc:"Modern, rooftop pool" },
    { name:"Agnes Water Beach Club — 1-Bed Apartment", type:"Agnes Water Beach Club", ppn:280, desc:"Modern, rooftop pool" },
    { name:"Agnes Water Beach Club — 2-Bed Penthouse", type:"Agnes Water Beach Club", ppn:380, desc:"Modern, rooftop pool" },
    { name:"The Deck at 1770 — Cabin", type:"The Deck at 1770", ppn:180, desc:"Elevated bush setting" },
    { name:"The Deck at 1770 — Eco Villa", type:"The Deck at 1770", ppn:250, desc:"Elevated bush setting" },
    { name:"Kellys Beach Resort Bargara — Studio", type:"Kellys Beach Resort Bargara", ppn:180, desc:"Near Bundaberg, beachfront Bargara" },
    { name:"Kellys Beach Resort Bargara — 1-Bed Apartment", type:"Kellys Beach Resort Bargara", ppn:240, desc:"Near Bundaberg, beachfront Bargara" },
    { name:"Kellys Beach Resort Bargara — 2-Bed Apartment", type:"Kellys Beach Resort Bargara", ppn:320, desc:"Near Bundaberg, beachfront Bargara" },
  ],
  "Agnes Water & Bundaberg": [
    { name:"Lagoons 1770 Beachfront Resort — Resort Room", type:"Lagoons 1770 Beachfront Resort", ppn:220, desc:"Beachfront 1770, pool, restaurant" },
    { name:"Lagoons 1770 Beachfront Resort — 1-Bed Apartment", type:"Lagoons 1770 Beachfront Resort", ppn:280, desc:"Beachfront 1770, pool, restaurant" },
    { name:"Lagoons 1770 Beachfront Resort — 2-Bed Apartment", type:"Lagoons 1770 Beachfront Resort", ppn:350, desc:"Beachfront 1770, pool, restaurant" },
    { name:"Sandcastles 1770 Motel — Standard Room", type:"Sandcastles 1770 Motel", ppn:160, desc:"Central Agnes Water, pool" },
    { name:"Sandcastles 1770 Motel — Deluxe Room", type:"Sandcastles 1770 Motel", ppn:200, desc:"Central Agnes Water, pool" },
    { name:"Sandcastles 1770 Motel — Family Suite", type:"Sandcastles 1770 Motel", ppn:260, desc:"Central Agnes Water, pool" },
    { name:"Agnes Water Beach Club — Studio", type:"Agnes Water Beach Club", ppn:200, desc:"Modern, rooftop pool" },
    { name:"Agnes Water Beach Club — 1-Bed Apartment", type:"Agnes Water Beach Club", ppn:280, desc:"Modern, rooftop pool" },
    { name:"Agnes Water Beach Club — 2-Bed Penthouse", type:"Agnes Water Beach Club", ppn:380, desc:"Modern, rooftop pool" },
    { name:"The Deck at 1770 — Cabin", type:"The Deck at 1770", ppn:180, desc:"Elevated bush setting" },
    { name:"The Deck at 1770 — Eco Villa", type:"The Deck at 1770", ppn:250, desc:"Elevated bush setting" },
    { name:"Kellys Beach Resort Bargara — Studio", type:"Kellys Beach Resort Bargara", ppn:180, desc:"Near Bundaberg, beachfront Bargara" },
    { name:"Kellys Beach Resort Bargara — 1-Bed Apartment", type:"Kellys Beach Resort Bargara", ppn:240, desc:"Near Bundaberg, beachfront Bargara" },
    { name:"Kellys Beach Resort Bargara — 2-Bed Apartment", type:"Kellys Beach Resort Bargara", ppn:320, desc:"Near Bundaberg, beachfront Bargara" },
  ],
  "Yeppoon": [
    { name:"Salt Yeppoon — 1-Bed Apartment", type:"Salt Yeppoon", ppn:250, desc:"Waterfront, modern, premium" },
    { name:"Salt Yeppoon — 2-Bed Apartment", type:"Salt Yeppoon", ppn:350, desc:"Waterfront, modern, premium" },
    { name:"Salt Yeppoon — Penthouse", type:"Salt Yeppoon", ppn:500, desc:"Waterfront, modern, premium" },
    { name:"Coral Inn Boutique Resort — Resort Room", type:"Coral Inn Boutique Resort", ppn:180, desc:"Central, boutique feel" },
    { name:"Coral Inn Boutique Resort — Spa Room", type:"Coral Inn Boutique Resort", ppn:250, desc:"Central, boutique feel" },
    { name:"Coral Inn Boutique Resort — Suite", type:"Coral Inn Boutique Resort", ppn:320, desc:"Central, boutique feel" },
    { name:"Villa Mar Colina — Villa", type:"Villa Mar Colina", ppn:200, desc:"Mediterranean-style, pool" },
    { name:"Villa Mar Colina — Deluxe Villa", type:"Villa Mar Colina", ppn:280, desc:"Mediterranean-style, pool" },
    { name:"Oshen Apartments — 1-Bed Apartment", type:"Oshen Apartments", ppn:220, desc:"Modern, ocean views" },
    { name:"Oshen Apartments — 2-Bed Apartment", type:"Oshen Apartments", ppn:300, desc:"Modern, ocean views" },
    { name:"Oshen Apartments — 3-Bed Apartment", type:"Oshen Apartments", ppn:400, desc:"Modern, ocean views" },
    { name:"Capricorn Palms Holiday Park — Cabin", type:"Capricorn Palms Holiday Park", ppn:140, desc:"Family-friendly, pool" },
    { name:"Capricorn Palms Holiday Park — Deluxe Cabin", type:"Capricorn Palms Holiday Park", ppn:190, desc:"Family-friendly, pool" },
    { name:"Capricorn Palms Holiday Park — Villa", type:"Capricorn Palms Holiday Park", ppn:250, desc:"Family-friendly, pool" },
  ],
  "Yeppoon & Capricorn Coast": [
    { name:"Salt Yeppoon — 1-Bed Apartment", type:"Salt Yeppoon", ppn:250, desc:"Waterfront, modern, premium" },
    { name:"Salt Yeppoon — 2-Bed Apartment", type:"Salt Yeppoon", ppn:350, desc:"Waterfront, modern, premium" },
    { name:"Salt Yeppoon — Penthouse", type:"Salt Yeppoon", ppn:500, desc:"Waterfront, modern, premium" },
    { name:"Coral Inn Boutique Resort — Resort Room", type:"Coral Inn Boutique Resort", ppn:180, desc:"Central, boutique feel" },
    { name:"Coral Inn Boutique Resort — Spa Room", type:"Coral Inn Boutique Resort", ppn:250, desc:"Central, boutique feel" },
    { name:"Coral Inn Boutique Resort — Suite", type:"Coral Inn Boutique Resort", ppn:320, desc:"Central, boutique feel" },
    { name:"Villa Mar Colina — Villa", type:"Villa Mar Colina", ppn:200, desc:"Mediterranean-style, pool" },
    { name:"Villa Mar Colina — Deluxe Villa", type:"Villa Mar Colina", ppn:280, desc:"Mediterranean-style, pool" },
    { name:"Oshen Apartments — 1-Bed Apartment", type:"Oshen Apartments", ppn:220, desc:"Modern, ocean views" },
    { name:"Oshen Apartments — 2-Bed Apartment", type:"Oshen Apartments", ppn:300, desc:"Modern, ocean views" },
    { name:"Oshen Apartments — 3-Bed Apartment", type:"Oshen Apartments", ppn:400, desc:"Modern, ocean views" },
    { name:"Capricorn Palms Holiday Park — Cabin", type:"Capricorn Palms Holiday Park", ppn:140, desc:"Family-friendly, pool" },
    { name:"Capricorn Palms Holiday Park — Deluxe Cabin", type:"Capricorn Palms Holiday Park", ppn:190, desc:"Family-friendly, pool" },
    { name:"Capricorn Palms Holiday Park — Villa", type:"Capricorn Palms Holiday Park", ppn:250, desc:"Family-friendly, pool" },
  ],
  "Cape Hillsborough": [
    { name:"Ocean International Mackay — Standard Room", type:"Ocean International Mackay", ppn:160, desc:"Waterfront, central Mackay" },
    { name:"Ocean International Mackay — Ocean View Room", type:"Ocean International Mackay", ppn:220, desc:"Waterfront, central Mackay" },
    { name:"Ocean International Mackay — Suite", type:"Ocean International Mackay", ppn:300, desc:"Waterfront, central Mackay" },
    { name:"Clarion Hotel Mackay Marina — Marina Room", type:"Clarion Hotel Mackay Marina", ppn:180, desc:"Marina precinct, restaurants" },
    { name:"Clarion Hotel Mackay Marina — Deluxe Marina", type:"Clarion Hotel Mackay Marina", ppn:250, desc:"Marina precinct, restaurants" },
    { name:"Clarion Hotel Mackay Marina — Suite", type:"Clarion Hotel Mackay Marina", ppn:350, desc:"Marina precinct, restaurants" },
    { name:"Cape Hillsborough Nature Resort — Cabin — Standard Cabin", type:"Cape Hillsborough Nature Resort — Cabin", ppn:180, desc:"Right at kangaroo beach — the spot" },
    { name:"Cape Hillsborough Nature Resort — Cabin — Deluxe Cabin", type:"Cape Hillsborough Nature Resort — Cabin", ppn:230, desc:"Right at kangaroo beach — the spot" },
    { name:"Cape Hillsborough Nature Resort — Cabin — Beachfront Cabin", type:"Cape Hillsborough Nature Resort — Cabin", ppn:280, desc:"Right at kangaroo beach — the spot" },
    { name:"Broken River Mountain Retreat — Eco Cabin", type:"Broken River Mountain Retreat", ppn:200, desc:"Near Eungella, platypus viewing" },
    { name:"Broken River Mountain Retreat — Rainforest Cabin", type:"Broken River Mountain Retreat", ppn:280, desc:"Near Eungella, platypus viewing" },
    { name:"Windmill Motel Mackay — Standard Room", type:"Windmill Motel Mackay", ppn:140, desc:"Good value, central" },
    { name:"Windmill Motel Mackay — Deluxe Room", type:"Windmill Motel Mackay", ppn:180, desc:"Good value, central" },
    { name:"Windmill Motel Mackay — Suite", type:"Windmill Motel Mackay", ppn:240, desc:"Good value, central" },
  ],
  "Mackay": [
    { name:"Ocean International Mackay — Standard Room", type:"Ocean International Mackay", ppn:160, desc:"Waterfront, central Mackay" },
    { name:"Ocean International Mackay — Ocean View Room", type:"Ocean International Mackay", ppn:220, desc:"Waterfront, central Mackay" },
    { name:"Ocean International Mackay — Suite", type:"Ocean International Mackay", ppn:300, desc:"Waterfront, central Mackay" },
    { name:"Clarion Hotel Mackay Marina — Marina Room", type:"Clarion Hotel Mackay Marina", ppn:180, desc:"Marina precinct, restaurants" },
    { name:"Clarion Hotel Mackay Marina — Deluxe Marina", type:"Clarion Hotel Mackay Marina", ppn:250, desc:"Marina precinct, restaurants" },
    { name:"Clarion Hotel Mackay Marina — Suite", type:"Clarion Hotel Mackay Marina", ppn:350, desc:"Marina precinct, restaurants" },
    { name:"Cape Hillsborough Nature Resort — Cabin — Standard Cabin", type:"Cape Hillsborough Nature Resort — Cabin", ppn:180, desc:"Right at kangaroo beach — the spot" },
    { name:"Cape Hillsborough Nature Resort — Cabin — Deluxe Cabin", type:"Cape Hillsborough Nature Resort — Cabin", ppn:230, desc:"Right at kangaroo beach — the spot" },
    { name:"Cape Hillsborough Nature Resort — Cabin — Beachfront Cabin", type:"Cape Hillsborough Nature Resort — Cabin", ppn:280, desc:"Right at kangaroo beach — the spot" },
    { name:"Broken River Mountain Retreat — Eco Cabin", type:"Broken River Mountain Retreat", ppn:200, desc:"Near Eungella, platypus viewing" },
    { name:"Broken River Mountain Retreat — Rainforest Cabin", type:"Broken River Mountain Retreat", ppn:280, desc:"Near Eungella, platypus viewing" },
    { name:"Windmill Motel Mackay — Standard Room", type:"Windmill Motel Mackay", ppn:140, desc:"Good value, central" },
    { name:"Windmill Motel Mackay — Deluxe Room", type:"Windmill Motel Mackay", ppn:180, desc:"Good value, central" },
    { name:"Windmill Motel Mackay — Suite", type:"Windmill Motel Mackay", ppn:240, desc:"Good value, central" },
  ],
  "Airlie Beach": [
    { name:"Coral Sea Resort — Garden Room", type:"Coral Sea Resort", ppn:280, desc:"Absolute waterfront, iconic Airlie" },
    { name:"Coral Sea Resort — Ocean View Room", type:"Coral Sea Resort", ppn:380, desc:"Absolute waterfront, iconic Airlie" },
    { name:"Coral Sea Resort — Waterfront Suite", type:"Coral Sea Resort", ppn:500, desc:"Absolute waterfront, iconic Airlie" },
    { name:"Peppers Airlie Beach — 1-Bed Apartment", type:"Peppers Airlie Beach", ppn:300, desc:"Modern, pool, marina views" },
    { name:"Peppers Airlie Beach — 2-Bed Apartment", type:"Peppers Airlie Beach", ppn:400, desc:"Modern, pool, marina views" },
    { name:"Peppers Airlie Beach — Penthouse", type:"Peppers Airlie Beach", ppn:540, desc:"Modern, pool, marina views" },
    { name:"Mantra Club Croc — Hotel Room", type:"Mantra Club Croc", ppn:220, desc:"Central, walking distance to everything" },
    { name:"Mantra Club Croc — 1-Bed Apartment", type:"Mantra Club Croc", ppn:300, desc:"Central, walking distance to everything" },
    { name:"Mantra Club Croc — 2-Bed Apartment", type:"Mantra Club Croc", ppn:400, desc:"Central, walking distance to everything" },
    { name:"Mirage Whitsundays — 1-Bed Apartment", type:"Mirage Whitsundays", ppn:250, desc:"Lagoon pool, family-friendly" },
    { name:"Mirage Whitsundays — 2-Bed Apartment", type:"Mirage Whitsundays", ppn:350, desc:"Lagoon pool, family-friendly" },
    { name:"Mirage Whitsundays — 3-Bed Apartment", type:"Mirage Whitsundays", ppn:450, desc:"Lagoon pool, family-friendly" },
    { name:"InterContinental Hayman Island — Resort Room", type:"InterContinental Hayman Island", ppn:800, desc:"★ UPGRADE: Ultra-luxury island resort. Supplement above $550" },
    { name:"InterContinental Hayman Island — Pool Access Room", type:"InterContinental Hayman Island", ppn:1000, desc:"★ UPGRADE: Ultra-luxury island resort. Supplement above $550" },
    { name:"InterContinental Hayman Island — Suite", type:"InterContinental Hayman Island", ppn:1500, desc:"★ UPGRADE: Ultra-luxury island resort. Supplement above $550" },
  ],
  "Airlie Beach & Whitsundays": [
    { name:"Coral Sea Resort — Garden Room", type:"Coral Sea Resort", ppn:280, desc:"Absolute waterfront, iconic Airlie" },
    { name:"Coral Sea Resort — Ocean View Room", type:"Coral Sea Resort", ppn:380, desc:"Absolute waterfront, iconic Airlie" },
    { name:"Coral Sea Resort — Waterfront Suite", type:"Coral Sea Resort", ppn:500, desc:"Absolute waterfront, iconic Airlie" },
    { name:"Peppers Airlie Beach — 1-Bed Apartment", type:"Peppers Airlie Beach", ppn:300, desc:"Modern, pool, marina views" },
    { name:"Peppers Airlie Beach — 2-Bed Apartment", type:"Peppers Airlie Beach", ppn:400, desc:"Modern, pool, marina views" },
    { name:"Peppers Airlie Beach — Penthouse", type:"Peppers Airlie Beach", ppn:540, desc:"Modern, pool, marina views" },
    { name:"Mantra Club Croc — Hotel Room", type:"Mantra Club Croc", ppn:220, desc:"Central, walking distance to everything" },
    { name:"Mantra Club Croc — 1-Bed Apartment", type:"Mantra Club Croc", ppn:300, desc:"Central, walking distance to everything" },
    { name:"Mantra Club Croc — 2-Bed Apartment", type:"Mantra Club Croc", ppn:400, desc:"Central, walking distance to everything" },
    { name:"Mirage Whitsundays — 1-Bed Apartment", type:"Mirage Whitsundays", ppn:250, desc:"Lagoon pool, family-friendly" },
    { name:"Mirage Whitsundays — 2-Bed Apartment", type:"Mirage Whitsundays", ppn:350, desc:"Lagoon pool, family-friendly" },
    { name:"Mirage Whitsundays — 3-Bed Apartment", type:"Mirage Whitsundays", ppn:450, desc:"Lagoon pool, family-friendly" },
    { name:"InterContinental Hayman Island — Resort Room", type:"InterContinental Hayman Island", ppn:800, desc:"★ UPGRADE: Ultra-luxury island resort. Supplement above $550" },
    { name:"InterContinental Hayman Island — Pool Access Room", type:"InterContinental Hayman Island", ppn:1000, desc:"★ UPGRADE: Ultra-luxury island resort. Supplement above $550" },
    { name:"InterContinental Hayman Island — Suite", type:"InterContinental Hayman Island", ppn:1500, desc:"★ UPGRADE: Ultra-luxury island resort. Supplement above $550" },
  ],
  "Townsville & Magnetic Island": [
    { name:"The Ville Resort — Casino — Standard Room", type:"The Ville Resort — Casino", ppn:200, desc:"Waterfront, The Strand, casino" },
    { name:"The Ville Resort — Casino — Deluxe Room", type:"The Ville Resort — Casino", ppn:280, desc:"Waterfront, The Strand, casino" },
    { name:"The Ville Resort — Casino — Suite", type:"The Ville Resort — Casino", ppn:400, desc:"Waterfront, The Strand, casino" },
    { name:"Peppers Blue on Blue — Magnetic Is. — 1-Bed Apartment", type:"Peppers Blue on Blue — Magnetic Is.", ppn:250, desc:"Magnetic Island marina, modern" },
    { name:"Peppers Blue on Blue — Magnetic Is. — 2-Bed Apartment", type:"Peppers Blue on Blue — Magnetic Is.", ppn:350, desc:"Magnetic Island marina, modern" },
    { name:"Peppers Blue on Blue — Magnetic Is. — Marina Suite", type:"Peppers Blue on Blue — Magnetic Is.", ppn:450, desc:"Magnetic Island marina, modern" },
    { name:"Rydges Southbank Townsville — Standard Room", type:"Rydges Southbank Townsville", ppn:180, desc:"Palmer St dining precinct" },
    { name:"Rydges Southbank Townsville — City View Room", type:"Rydges Southbank Townsville", ppn:240, desc:"Palmer St dining precinct" },
    { name:"Rydges Southbank Townsville — Suite", type:"Rydges Southbank Townsville", ppn:350, desc:"Palmer St dining precinct" },
    { name:"Grand Hotel Townsville — Heritage Room", type:"Grand Hotel Townsville", ppn:160, desc:"Heritage, central, good dining" },
    { name:"Grand Hotel Townsville — Deluxe Room", type:"Grand Hotel Townsville", ppn:220, desc:"Heritage, central, good dining" },
    { name:"Grand Hotel Townsville — Suite", type:"Grand Hotel Townsville", ppn:300, desc:"Heritage, central, good dining" },
    { name:"Island Leisure Resort — Magnetic Is. — Studio", type:"Island Leisure Resort — Magnetic Is.", ppn:180, desc:"Horseshoe Bay, quiet island vibe" },
    { name:"Island Leisure Resort — Magnetic Is. — 1-Bed Unit", type:"Island Leisure Resort — Magnetic Is.", ppn:250, desc:"Horseshoe Bay, quiet island vibe" },
    { name:"Island Leisure Resort — Magnetic Is. — 2-Bed Unit", type:"Island Leisure Resort — Magnetic Is.", ppn:320, desc:"Horseshoe Bay, quiet island vibe" },
  ],
  "Mission Beach": [
    { name:"Castaways Resort & Spa — Garden Room", type:"Castaways Resort & Spa", ppn:200, desc:"Beachfront, best on Mission Beach" },
    { name:"Castaways Resort & Spa — Beachfront Room", type:"Castaways Resort & Spa", ppn:260, desc:"Beachfront, best on Mission Beach" },
    { name:"Castaways Resort & Spa — Suite", type:"Castaways Resort & Spa", ppn:380, desc:"Beachfront, best on Mission Beach" },
    { name:"Elandra Mission Beach — Rainforest Room", type:"Elandra Mission Beach", ppn:250, desc:"Boutique luxury, stunning views" },
    { name:"Elandra Mission Beach — Ocean View Room", type:"Elandra Mission Beach", ppn:350, desc:"Boutique luxury, stunning views" },
    { name:"Elandra Mission Beach — Penthouse", type:"Elandra Mission Beach", ppn:500, desc:"Boutique luxury, stunning views" },
    { name:"Licuala Lodge — Rainforest Room", type:"Licuala Lodge", ppn:180, desc:"Boutique B&B, cassowary spotting" },
    { name:"Licuala Lodge — Garden Suite", type:"Licuala Lodge", ppn:240, desc:"Boutique B&B, cassowary spotting" },
    { name:"Wongalinga — Beach House", type:"Wongalinga", ppn:280, desc:"Private beach houses" },
    { name:"Wongalinga — Luxury Beach House", type:"Wongalinga", ppn:380, desc:"Private beach houses" },
    { name:"Beachcomber Coconut Holiday Park — Cabin — Cabin", type:"Beachcomber Coconut Holiday Park — Cabin", ppn:140, desc:"Budget option, beachfront" },
    { name:"Beachcomber Coconut Holiday Park — Cabin — Deluxe Cabin", type:"Beachcomber Coconut Holiday Park — Cabin", ppn:190, desc:"Budget option, beachfront" },
  ],
  "Toowoomba": [
    { name:"Vacy Hall Historic Guesthouse — Heritage Room", type:"Vacy Hall Historic Guesthouse", ppn:180, desc:"Heritage B&B, gardens, central" },
    { name:"Vacy Hall Historic Guesthouse — Deluxe Room", type:"Vacy Hall Historic Guesthouse", ppn:230, desc:"Heritage B&B, gardens, central" },
    { name:"Vacy Hall Historic Guesthouse — Suite", type:"Vacy Hall Historic Guesthouse", ppn:300, desc:"Heritage B&B, gardens, central" },
    { name:"Mercure Toowoomba — Standard Room", type:"Mercure Toowoomba", ppn:160, desc:"Central, reliable, restaurant" },
    { name:"Mercure Toowoomba — Superior Room", type:"Mercure Toowoomba", ppn:200, desc:"Central, reliable, restaurant" },
    { name:"Mercure Toowoomba — Suite", type:"Mercure Toowoomba", ppn:280, desc:"Central, reliable, restaurant" },
    { name:"Quest Toowoomba — Studio", type:"Quest Toowoomba", ppn:180, desc:"Self-contained, modern" },
    { name:"Quest Toowoomba — 1-Bed Apartment", type:"Quest Toowoomba", ppn:240, desc:"Self-contained, modern" },
    { name:"Quest Toowoomba — 2-Bed Apartment", type:"Quest Toowoomba", ppn:320, desc:"Self-contained, modern" },
    { name:"Picnic Point Villas — 1-Bed Villa", type:"Picnic Point Villas", ppn:200, desc:"Near Picnic Point lookout" },
    { name:"Picnic Point Villas — 2-Bed Villa", type:"Picnic Point Villas", ppn:280, desc:"Near Picnic Point lookout" },
    { name:"Downs Motor Inn — Standard Room", type:"Downs Motor Inn", ppn:130, desc:"Budget-mid, well-maintained" },
    { name:"Downs Motor Inn — Deluxe Room", type:"Downs Motor Inn", ppn:170, desc:"Budget-mid, well-maintained" },
  ],
  "Roma": [
    { name:"Roma Explorers Inn — Standard Room", type:"Roma Explorers Inn", ppn:140, desc:"Best in Roma, pool, restaurant" },
    { name:"Roma Explorers Inn — Deluxe Room", type:"Roma Explorers Inn", ppn:180, desc:"Best in Roma, pool, restaurant" },
    { name:"Roma Explorers Inn — Family Suite", type:"Roma Explorers Inn", ppn:240, desc:"Best in Roma, pool, restaurant" },
    { name:"Roma Central Motel — Standard Room", type:"Roma Central Motel", ppn:120, desc:"Clean, central, good value" },
    { name:"Roma Central Motel — Queen Room", type:"Roma Central Motel", ppn:150, desc:"Clean, central, good value" },
    { name:"Roma Central Motel — Family Room", type:"Roma Central Motel", ppn:190, desc:"Clean, central, good value" },
    { name:"Overlander Hotel Motel — Standard Room", type:"Overlander Hotel Motel", ppn:130, desc:"Classic outback pub accommodation" },
    { name:"Overlander Hotel Motel — Deluxe Room", type:"Overlander Hotel Motel", ppn:170, desc:"Classic outback pub accommodation" },
    { name:"Roma Big Rig Tourist Park — Cabin — Standard Cabin", type:"Roma Big Rig Tourist Park — Cabin", ppn:100, desc:"Near Big Rig, family-friendly" },
    { name:"Roma Big Rig Tourist Park — Cabin — Deluxe Cabin", type:"Roma Big Rig Tourist Park — Cabin", ppn:150, desc:"Near Big Rig, family-friendly" },
    { name:"StarLodge Motor Inn — Standard Room", type:"StarLodge Motor Inn", ppn:120, desc:"Reliable, clean" },
    { name:"StarLodge Motor Inn — Queen Room", type:"StarLodge Motor Inn", ppn:150, desc:"Reliable, clean" },
  ],
  "Mitchell & Charleville": [
    { name:"Hotel Corones — Heritage Room", type:"Hotel Corones", ppn:160, desc:"Heritage pub, famous staircase, must-stay" },
    { name:"Hotel Corones — Heritage Suite", type:"Hotel Corones", ppn:220, desc:"Heritage pub, famous staircase, must-stay" },
    { name:"Hotel Corones — Corones Suite", type:"Hotel Corones", ppn:300, desc:"Heritage pub, famous staircase, must-stay" },
    { name:"Mulga Country Motor Inn — Standard Room", type:"Mulga Country Motor Inn", ppn:130, desc:"Modern, pool, restaurant" },
    { name:"Mulga Country Motor Inn — Deluxe Room", type:"Mulga Country Motor Inn", ppn:170, desc:"Modern, pool, restaurant" },
    { name:"Charleville Motel — Standard Room", type:"Charleville Motel", ppn:110, desc:"Budget, clean" },
    { name:"Charleville Motel — Queen Room", type:"Charleville Motel", ppn:140, desc:"Budget, clean" },
    { name:"Evening Star Tourist Park — Cabin — Standard Cabin", type:"Evening Star Tourist Park — Cabin", ppn:100, desc:"Near Cosmos Centre" },
    { name:"Evening Star Tourist Park — Cabin — Deluxe Cabin", type:"Evening Star Tourist Park — Cabin", ppn:140, desc:"Near Cosmos Centre" },
    { name:"Warrego Motel — Standard Room", type:"Warrego Motel", ppn:120, desc:"Reliable outback motel" },
    { name:"Warrego Motel — Deluxe Room", type:"Warrego Motel", ppn:150, desc:"Reliable outback motel" },
  ],
  "Blackall": [
    { name:"Acacia Motor Inn — Standard Room", type:"Acacia Motor Inn", ppn:130, desc:"Best in Blackall, pool" },
    { name:"Acacia Motor Inn — Deluxe Room", type:"Acacia Motor Inn", ppn:170, desc:"Best in Blackall, pool" },
    { name:"Acacia Motor Inn — Family Room", type:"Acacia Motor Inn", ppn:200, desc:"Best in Blackall, pool" },
    { name:"Blackall Motor Inn — Standard Room", type:"Blackall Motor Inn", ppn:110, desc:"Clean, central" },
    { name:"Blackall Motor Inn — Queen Room", type:"Blackall Motor Inn", ppn:140, desc:"Clean, central" },
    { name:"Barcoo River Hotel — Pub Room", type:"Barcoo River Hotel", ppn:90, desc:"Classic outback pub stay" },
    { name:"Barcoo River Hotel — Deluxe Room", type:"Barcoo River Hotel", ppn:130, desc:"Classic outback pub stay" },
    { name:"Blackall Woolscour Cabins — Cabin", type:"Blackall Woolscour Cabins", ppn:120, desc:"Near historic woolscour" },
    { name:"Blackall Woolscour Cabins — Deluxe Cabin", type:"Blackall Woolscour Cabins", ppn:160, desc:"Near historic woolscour" },
    { name:"All Seasons Outback Blackall — Standard Room", type:"All Seasons Outback Blackall", ppn:120, desc:"Chain motel, reliable" },
    { name:"All Seasons Outback Blackall — Queen Room", type:"All Seasons Outback Blackall", ppn:150, desc:"Chain motel, reliable" },
  ],
  "Longreach": [
    { name:"Mitchell Grass Retreat — Luxury Tent", type:"Mitchell Grass Retreat", ppn:250, desc:"Luxury glamping, outback views, standout property" },
    { name:"Mitchell Grass Retreat — Premium Tent", type:"Mitchell Grass Retreat", ppn:350, desc:"Luxury glamping, outback views, standout property" },
    { name:"Mitchell Grass Retreat — Homestead Suite", type:"Mitchell Grass Retreat", ppn:450, desc:"Luxury glamping, outback views, standout property" },
    { name:"Albert Park Motor Inn — Standard Room", type:"Albert Park Motor Inn", ppn:150, desc:"Central, pool, good restaurant" },
    { name:"Albert Park Motor Inn — Deluxe Room", type:"Albert Park Motor Inn", ppn:200, desc:"Central, pool, good restaurant" },
    { name:"Albert Park Motor Inn — Family Suite", type:"Albert Park Motor Inn", ppn:260, desc:"Central, pool, good restaurant" },
    { name:"Longreach Motor Inn — Standard Room", type:"Longreach Motor Inn", ppn:130, desc:"Clean, well-maintained, pool" },
    { name:"Longreach Motor Inn — Queen Room", type:"Longreach Motor Inn", ppn:170, desc:"Clean, well-maintained, pool" },
    { name:"Longreach Motor Inn — Family Room", type:"Longreach Motor Inn", ppn:220, desc:"Clean, well-maintained, pool" },
    { name:"Saltbush Retreat — Cabin", type:"Saltbush Retreat", ppn:180, desc:"Bush setting, peaceful" },
    { name:"Saltbush Retreat — Luxury Cabin", type:"Saltbush Retreat", ppn:250, desc:"Bush setting, peaceful" },
    { name:"Longreach Tourist Park — Cabin — Standard Cabin", type:"Longreach Tourist Park — Cabin", ppn:100, desc:"Family-friendly, pool, camp kitchen" },
    { name:"Longreach Tourist Park — Cabin — Deluxe Cabin", type:"Longreach Tourist Park — Cabin", ppn:150, desc:"Family-friendly, pool, camp kitchen" },
    { name:"Longreach Tourist Park — Cabin — Villa", type:"Longreach Tourist Park — Cabin", ppn:200, desc:"Family-friendly, pool, camp kitchen" },
  ],
  "Longreach (return)": [
    { name:"Mitchell Grass Retreat — Luxury Tent", type:"Mitchell Grass Retreat", ppn:250, desc:"Luxury glamping, outback views, standout property" },
    { name:"Mitchell Grass Retreat — Premium Tent", type:"Mitchell Grass Retreat", ppn:350, desc:"Luxury glamping, outback views, standout property" },
    { name:"Mitchell Grass Retreat — Homestead Suite", type:"Mitchell Grass Retreat", ppn:450, desc:"Luxury glamping, outback views, standout property" },
    { name:"Albert Park Motor Inn — Standard Room", type:"Albert Park Motor Inn", ppn:150, desc:"Central, pool, good restaurant" },
    { name:"Albert Park Motor Inn — Deluxe Room", type:"Albert Park Motor Inn", ppn:200, desc:"Central, pool, good restaurant" },
    { name:"Albert Park Motor Inn — Family Suite", type:"Albert Park Motor Inn", ppn:260, desc:"Central, pool, good restaurant" },
    { name:"Longreach Motor Inn — Standard Room", type:"Longreach Motor Inn", ppn:130, desc:"Clean, well-maintained, pool" },
    { name:"Longreach Motor Inn — Queen Room", type:"Longreach Motor Inn", ppn:170, desc:"Clean, well-maintained, pool" },
    { name:"Longreach Motor Inn — Family Room", type:"Longreach Motor Inn", ppn:220, desc:"Clean, well-maintained, pool" },
    { name:"Saltbush Retreat — Cabin", type:"Saltbush Retreat", ppn:180, desc:"Bush setting, peaceful" },
    { name:"Saltbush Retreat — Luxury Cabin", type:"Saltbush Retreat", ppn:250, desc:"Bush setting, peaceful" },
    { name:"Longreach Tourist Park — Cabin — Standard Cabin", type:"Longreach Tourist Park — Cabin", ppn:100, desc:"Family-friendly, pool, camp kitchen" },
    { name:"Longreach Tourist Park — Cabin — Deluxe Cabin", type:"Longreach Tourist Park — Cabin", ppn:150, desc:"Family-friendly, pool, camp kitchen" },
    { name:"Longreach Tourist Park — Cabin — Villa", type:"Longreach Tourist Park — Cabin", ppn:200, desc:"Family-friendly, pool, camp kitchen" },
  ],
  "Winton": [
    { name:"North Gregory Hotel — Heritage Room", type:"North Gregory Hotel", ppn:150, desc:"Where Waltzing Matilda was first performed" },
    { name:"North Gregory Hotel — Deluxe Room", type:"North Gregory Hotel", ppn:200, desc:"Where Waltzing Matilda was first performed" },
    { name:"North Gregory Hotel — Gregory Suite", type:"North Gregory Hotel", ppn:280, desc:"Where Waltzing Matilda was first performed" },
    { name:"Boulder Opal Motor Inn — Standard Room", type:"Boulder Opal Motor Inn", ppn:130, desc:"Best motel in Winton, pool" },
    { name:"Boulder Opal Motor Inn — Deluxe Room", type:"Boulder Opal Motor Inn", ppn:170, desc:"Best motel in Winton, pool" },
    { name:"Boulder Opal Motor Inn — Family Suite", type:"Boulder Opal Motor Inn", ppn:220, desc:"Best motel in Winton, pool" },
    { name:"Matilda Country Tourist Park — Cabin — Standard Cabin", type:"Matilda Country Tourist Park — Cabin", ppn:100, desc:"Family-friendly" },
    { name:"Matilda Country Tourist Park — Cabin — Deluxe Cabin", type:"Matilda Country Tourist Park — Cabin", ppn:140, desc:"Family-friendly" },
    { name:"Pelican Waters Caravan Park — Cabin — Cabin", type:"Pelican Waters Caravan Park — Cabin", ppn:90, desc:"Pool, powered sites" },
    { name:"Pelican Waters Caravan Park — Cabin — Deluxe Cabin", type:"Pelican Waters Caravan Park — Cabin", ppn:130, desc:"Pool, powered sites" },
    { name:"Winton Outback Motel — Standard Room", type:"Winton Outback Motel", ppn:110, desc:"Clean, central" },
    { name:"Winton Outback Motel — Queen Room", type:"Winton Outback Motel", ppn:140, desc:"Clean, central" },
  ],
  "Carnarvon Gorge": [
    { name:"Carnarvon Gorge Wilderness Lodge — Lodge Room", type:"Carnarvon Gorge Wilderness Lodge", ppn:350, desc:"Premium bush lodge, guided walks included" },
    { name:"Carnarvon Gorge Wilderness Lodge — Deluxe Lodge", type:"Carnarvon Gorge Wilderness Lodge", ppn:420, desc:"Premium bush lodge, guided walks included" },
    { name:"Carnarvon Gorge Wilderness Lodge — Premium Suite", type:"Carnarvon Gorge Wilderness Lodge", ppn:500, desc:"Premium bush lodge, guided walks included" },
    { name:"Takarakka Bush Resort — Safari Tent", type:"Takarakka Bush Resort", ppn:150, desc:"Private resort, riverside, wildlife" },
    { name:"Takarakka Bush Resort — Bush Cabin", type:"Takarakka Bush Resort", ppn:200, desc:"Private resort, riverside, wildlife" },
    { name:"Takarakka Bush Resort — Riverside Cabin", type:"Takarakka Bush Resort", ppn:280, desc:"Private resort, riverside, wildlife" },
    { name:"Breeze Holiday Parks — Cabin — Standard Cabin", type:"Breeze Holiday Parks — Cabin", ppn:140, desc:"Camp kitchen, bush bar, year-round" },
    { name:"Breeze Holiday Parks — Cabin — Deluxe Cabin", type:"Breeze Holiday Parks — Cabin", ppn:200, desc:"Camp kitchen, bush bar, year-round" },
    { name:"Breeze Holiday Parks — Cabin — Family Villa", type:"Breeze Holiday Parks — Cabin", ppn:280, desc:"Camp kitchen, bush bar, year-round" },
    { name:"Carnarvon Gorge Discovery Park — Cabin", type:"Carnarvon Gorge Discovery Park", ppn:130, desc:"Basic but functional" },
    { name:"Carnarvon Gorge Discovery Park — Deluxe Cabin", type:"Carnarvon Gorge Discovery Park", ppn:180, desc:"Basic but functional" },
    { name:"Sandstone Park Carnarvon Gorge — Safari Tent", type:"Sandstone Park Carnarvon Gorge", ppn:120, desc:"Eco-focused, intimate" },
    { name:"Sandstone Park Carnarvon Gorge — Eco Cabin", type:"Sandstone Park Carnarvon Gorge", ppn:180, desc:"Eco-focused, intimate" },
  ],
  "Emerald & Gemfields": [
    { name:"Emerald Maraboon Motor Inn — Standard Room", type:"Emerald Maraboon Motor Inn", ppn:140, desc:"Best in Emerald, pool, central" },
    { name:"Emerald Maraboon Motor Inn — Deluxe Room", type:"Emerald Maraboon Motor Inn", ppn:180, desc:"Best in Emerald, pool, central" },
    { name:"Emerald Maraboon Motor Inn — Suite", type:"Emerald Maraboon Motor Inn", ppn:250, desc:"Best in Emerald, pool, central" },
    { name:"Quest Emerald — Studio", type:"Quest Emerald", ppn:170, desc:"Self-contained, modern" },
    { name:"Quest Emerald — 1-Bed Apartment", type:"Quest Emerald", ppn:220, desc:"Self-contained, modern" },
    { name:"Quest Emerald — 2-Bed Apartment", type:"Quest Emerald", ppn:300, desc:"Self-contained, modern" },
    { name:"Emerald Star Hotel — Standard Room", type:"Emerald Star Hotel", ppn:120, desc:"Heritage pub, central" },
    { name:"Emerald Star Hotel — Deluxe Room", type:"Emerald Star Hotel", ppn:160, desc:"Heritage pub, central" },
    { name:"Rubyvale Gem Gallery — Accommodation — Fossicker's Cabin", type:"Rubyvale Gem Gallery — Accommodation", ppn:130, desc:"At the fossicking fields, character" },
    { name:"Rubyvale Gem Gallery — Accommodation — Gem Cabin", type:"Rubyvale Gem Gallery — Accommodation", ppn:170, desc:"At the fossicking fields, character" },
    { name:"Sapphire Retreat — Studio Cabin", type:"Sapphire Retreat", ppn:140, desc:"Near Rubyvale, peaceful" },
    { name:"Sapphire Retreat — Family Cabin", type:"Sapphire Retreat", ppn:200, desc:"Near Rubyvale, peaceful" },
  ],
  "Rubyvale & Gemfields": [
    { name:"Emerald Maraboon Motor Inn — Standard Room", type:"Emerald Maraboon Motor Inn", ppn:140, desc:"Best in Emerald, pool, central" },
    { name:"Emerald Maraboon Motor Inn — Deluxe Room", type:"Emerald Maraboon Motor Inn", ppn:180, desc:"Best in Emerald, pool, central" },
    { name:"Emerald Maraboon Motor Inn — Suite", type:"Emerald Maraboon Motor Inn", ppn:250, desc:"Best in Emerald, pool, central" },
    { name:"Quest Emerald — Studio", type:"Quest Emerald", ppn:170, desc:"Self-contained, modern" },
    { name:"Quest Emerald — 1-Bed Apartment", type:"Quest Emerald", ppn:220, desc:"Self-contained, modern" },
    { name:"Quest Emerald — 2-Bed Apartment", type:"Quest Emerald", ppn:300, desc:"Self-contained, modern" },
    { name:"Emerald Star Hotel — Standard Room", type:"Emerald Star Hotel", ppn:120, desc:"Heritage pub, central" },
    { name:"Emerald Star Hotel — Deluxe Room", type:"Emerald Star Hotel", ppn:160, desc:"Heritage pub, central" },
    { name:"Rubyvale Gem Gallery — Accommodation — Fossicker's Cabin", type:"Rubyvale Gem Gallery — Accommodation", ppn:130, desc:"At the fossicking fields, character" },
    { name:"Rubyvale Gem Gallery — Accommodation — Gem Cabin", type:"Rubyvale Gem Gallery — Accommodation", ppn:170, desc:"At the fossicking fields, character" },
    { name:"Sapphire Retreat — Studio Cabin", type:"Sapphire Retreat", ppn:140, desc:"Near Rubyvale, peaceful" },
    { name:"Sapphire Retreat — Family Cabin", type:"Sapphire Retreat", ppn:200, desc:"Near Rubyvale, peaceful" },
  ],
  "Rockhampton": [
    { name:"Empire Apartment Hotel — Studio", type:"Empire Apartment Hotel", ppn:180, desc:"Heritage building, modern fitout, best in Rocky" },
    { name:"Empire Apartment Hotel — 1-Bed Apartment", type:"Empire Apartment Hotel", ppn:250, desc:"Heritage building, modern fitout, best in Rocky" },
    { name:"Empire Apartment Hotel — 2-Bed Apartment", type:"Empire Apartment Hotel", ppn:350, desc:"Heritage building, modern fitout, best in Rocky" },
    { name:"Quest Rockhampton — Studio", type:"Quest Rockhampton", ppn:170, desc:"Self-contained, CBD" },
    { name:"Quest Rockhampton — 1-Bed Apartment", type:"Quest Rockhampton", ppn:230, desc:"Self-contained, CBD" },
    { name:"Quest Rockhampton — 2-Bed Apartment", type:"Quest Rockhampton", ppn:300, desc:"Self-contained, CBD" },
    { name:"Travelodge Rockhampton — Standard Room", type:"Travelodge Rockhampton", ppn:140, desc:"Reliable, pool, central" },
    { name:"Travelodge Rockhampton — Deluxe Room", type:"Travelodge Rockhampton", ppn:180, desc:"Reliable, pool, central" },
    { name:"Travelodge Rockhampton — Suite", type:"Travelodge Rockhampton", ppn:250, desc:"Reliable, pool, central" },
    { name:"Mercure Rockhampton — Standard Room", type:"Mercure Rockhampton", ppn:150, desc:"Riverfront, restaurant" },
    { name:"Mercure Rockhampton — Superior Room", type:"Mercure Rockhampton", ppn:200, desc:"Riverfront, restaurant" },
    { name:"Mercure Rockhampton — Suite", type:"Mercure Rockhampton", ppn:280, desc:"Riverfront, restaurant" },
    { name:"Heritage Hotel Rockhampton — Heritage Room", type:"Heritage Hotel Rockhampton", ppn:130, desc:"Character, central" },
    { name:"Heritage Hotel Rockhampton — Deluxe Room", type:"Heritage Hotel Rockhampton", ppn:170, desc:"Character, central" },
    { name:"Heritage Hotel Rockhampton — Suite", type:"Heritage Hotel Rockhampton", ppn:230, desc:"Character, central" },
  ],
  "Byron Bay": [
    { name:"Crystalbrook Byron — Byron Room", type:"Crystalbrook Byron", ppn:350, desc:"Rainforest hinterland, spa, luxury" },
    { name:"Crystalbrook Byron — Retreat Room", type:"Crystalbrook Byron", ppn:450, desc:"Rainforest hinterland, spa, luxury" },
    { name:"Crystalbrook Byron — Suite", type:"Crystalbrook Byron", ppn:550, desc:"Rainforest hinterland, spa, luxury" },
    { name:"Elements of Byron — Garden Villa", type:"Elements of Byron", ppn:450, desc:"★ UPGRADE above Garden Villa: Resort with lagoon. Beach Villa at $550 is ceiling" },
    { name:"Elements of Byron — Beach Villa", type:"Elements of Byron", ppn:550, desc:"★ UPGRADE above Garden Villa: Resort with lagoon. Beach Villa at $550 is ceiling" },
    { name:"Elements of Byron — Luxury Pool Villa", type:"Elements of Byron", ppn:750, desc:"★ UPGRADE above Garden Villa: Resort with lagoon. Beach Villa at $550 is ceiling" },
    { name:"The Byron at Byron — Rainforest Room", type:"The Byron at Byron", ppn:400, desc:"★ UPGRADE above Deluxe: Crystalbrook, spa, rainforest" },
    { name:"The Byron at Byron — Deluxe Suite", type:"The Byron at Byron", ppn:550, desc:"★ UPGRADE above Deluxe: Crystalbrook, spa, rainforest" },
    { name:"The Byron at Byron — Byron Suite", type:"The Byron at Byron", ppn:800, desc:"★ UPGRADE above Deluxe: Crystalbrook, spa, rainforest" },
    { name:"Rae's on Wategos — Standard Room", type:"Rae's on Wategos", ppn:400, desc:"Iconic boutique, Wategos Beach" },
    { name:"Rae's on Wategos — Ocean View Room", type:"Rae's on Wategos", ppn:500, desc:"Iconic boutique, Wategos Beach" },
    { name:"Rae's on Wategos — Suite", type:"Rae's on Wategos", ppn:550, desc:"Iconic boutique, Wategos Beach" },
    { name:"Atlantic Byron Bay — Hotel Room", type:"Atlantic Byron Bay", ppn:280, desc:"Central, pool, walk to beach" },
    { name:"Atlantic Byron Bay — Pool Room", type:"Atlantic Byron Bay", ppn:350, desc:"Central, pool, walk to beach" },
    { name:"Atlantic Byron Bay — Suite", type:"Atlantic Byron Bay", ppn:450, desc:"Central, pool, walk to beach" },
  ],
  "Ballina & Air Force Beach": [
    { name:"Ramada Hotel & Suites Ballina — Standard Room", type:"Ramada Hotel & Suites Ballina", ppn:200, desc:"Waterfront, pool, central" },
    { name:"Ramada Hotel & Suites Ballina — Deluxe Room", type:"Ramada Hotel & Suites Ballina", ppn:260, desc:"Waterfront, pool, central" },
    { name:"Ramada Hotel & Suites Ballina — Suite", type:"Ramada Hotel & Suites Ballina", ppn:350, desc:"Waterfront, pool, central" },
    { name:"Ballina Motel — Standard Room", type:"Ballina Motel", ppn:140, desc:"Budget-mid, clean, central" },
    { name:"Ballina Motel — Deluxe Room", type:"Ballina Motel", ppn:180, desc:"Budget-mid, clean, central" },
    { name:"Richmond River Motel — Standard Room", type:"Richmond River Motel", ppn:130, desc:"Riverfront, good value" },
    { name:"Richmond River Motel — Deluxe Room", type:"Richmond River Motel", ppn:170, desc:"Riverfront, good value" },
    { name:"The Henry Rous Tavern — Rooms — Pub Room", type:"The Henry Rous Tavern — Rooms", ppn:120, desc:"Heritage pub, character" },
    { name:"The Henry Rous Tavern — Rooms — Deluxe Room", type:"The Henry Rous Tavern — Rooms", ppn:160, desc:"Heritage pub, character" },
    { name:"Flat Rock Tent Park — Cabin — Cabin", type:"Flat Rock Tent Park — Cabin", ppn:120, desc:"Evans Head, beachfront, basic" },
    { name:"Flat Rock Tent Park — Cabin — Deluxe Cabin", type:"Flat Rock Tent Park — Cabin", ppn:160, desc:"Evans Head, beachfront, basic" },
    { name:"Flat Rock Tent Park — Cabin — Beachfront Cabin", type:"Flat Rock Tent Park — Cabin", ppn:200, desc:"Evans Head, beachfront, basic" },
  ],
  "Yamba": [
    { name:"Angourie Rainforest Resort — Rainforest Room", type:"Angourie Rainforest Resort", ppn:220, desc:"Near Angourie pools, spa, peaceful" },
    { name:"Angourie Rainforest Resort — Suite", type:"Angourie Rainforest Resort", ppn:300, desc:"Near Angourie pools, spa, peaceful" },
    { name:"Angourie Rainforest Resort — Villa", type:"Angourie Rainforest Resort", ppn:400, desc:"Near Angourie pools, spa, peaceful" },
    { name:"Pacific Hotel Yamba — Heritage Room", type:"Pacific Hotel Yamba", ppn:180, desc:"Iconic headland pub, sunset deck" },
    { name:"Pacific Hotel Yamba — Ocean View Room", type:"Pacific Hotel Yamba", ppn:250, desc:"Iconic headland pub, sunset deck" },
    { name:"Pacific Hotel Yamba — Premium Ocean", type:"Pacific Hotel Yamba", ppn:320, desc:"Iconic headland pub, sunset deck" },
    { name:"The Cove Yamba — 1-Bed Apartment", type:"The Cove Yamba", ppn:250, desc:"Waterfront apartments, modern" },
    { name:"The Cove Yamba — 2-Bed Apartment", type:"The Cove Yamba", ppn:350, desc:"Waterfront apartments, modern" },
    { name:"The Cove Yamba — Penthouse", type:"The Cove Yamba", ppn:450, desc:"Waterfront apartments, modern" },
    { name:"Calypso Holiday Park — Villa — Standard Villa", type:"Calypso Holiday Park — Villa", ppn:160, desc:"Family-friendly, pool, park" },
    { name:"Calypso Holiday Park — Villa — Deluxe Villa", type:"Calypso Holiday Park — Villa", ppn:220, desc:"Family-friendly, pool, park" },
    { name:"Calypso Holiday Park — Villa — Premium Villa", type:"Calypso Holiday Park — Villa", ppn:300, desc:"Family-friendly, pool, park" },
    { name:"Yamba Shores Tavern — Rooms — Standard Room", type:"Yamba Shores Tavern — Rooms", ppn:140, desc:"Central, pub dining" },
    { name:"Yamba Shores Tavern — Rooms — Deluxe Room", type:"Yamba Shores Tavern — Rooms", ppn:180, desc:"Central, pub dining" },
  ],
  "Newcastle": [
    { name:"QT Newcastle — QT Room", type:"QT Newcastle", ppn:250, desc:"Boutique, Honeysuckle precinct" },
    { name:"QT Newcastle — QT King", type:"QT Newcastle", ppn:320, desc:"Boutique, Honeysuckle precinct" },
    { name:"QT Newcastle — QT Suite", type:"QT Newcastle", ppn:450, desc:"Boutique, Honeysuckle precinct" },
    { name:"Rydges Newcastle — Standard Room", type:"Rydges Newcastle", ppn:200, desc:"Central, harbour views" },
    { name:"Rydges Newcastle — City View Room", type:"Rydges Newcastle", ppn:260, desc:"Central, harbour views" },
    { name:"Rydges Newcastle — Suite", type:"Rydges Newcastle", ppn:380, desc:"Central, harbour views" },
    { name:"Crystalbrook Kingsley — Urban Room", type:"Crystalbrook Kingsley", ppn:220, desc:"Heritage building, harbour" },
    { name:"Crystalbrook Kingsley — Harbour Room", type:"Crystalbrook Kingsley", ppn:300, desc:"Heritage building, harbour" },
    { name:"Crystalbrook Kingsley — Suite", type:"Crystalbrook Kingsley", ppn:420, desc:"Heritage building, harbour" },
    { name:"Novotel Newcastle Beach — Standard Room", type:"Novotel Newcastle Beach", ppn:200, desc:"Beachfront, modern" },
    { name:"Novotel Newcastle Beach — Ocean View Room", type:"Novotel Newcastle Beach", ppn:280, desc:"Beachfront, modern" },
    { name:"Novotel Newcastle Beach — Suite", type:"Novotel Newcastle Beach", ppn:380, desc:"Beachfront, modern" },
    { name:"The Lucky Hotel — Boutique Room", type:"The Lucky Hotel", ppn:180, desc:"Heritage pub, character, rooftop bar" },
    { name:"The Lucky Hotel — Deluxe Room", type:"The Lucky Hotel", ppn:240, desc:"Heritage pub, character, rooftop bar" },
  ],
  "Stockton Beach & Port Stephens": [
    { name:"Bannisters Port Stephens — Retreat Room", type:"Bannisters Port Stephens", ppn:300, desc:"Waterfront luxury, Rick Stein restaurant" },
    { name:"Bannisters Port Stephens — Marina Room", type:"Bannisters Port Stephens", ppn:400, desc:"Waterfront luxury, Rick Stein restaurant" },
    { name:"Bannisters Port Stephens — Penthouse", type:"Bannisters Port Stephens", ppn:550, desc:"Waterfront luxury, Rick Stein restaurant" },
    { name:"Anchorage Port Stephens — Pool View Room", type:"Anchorage Port Stephens", ppn:250, desc:"Marina, spa, pool, family-friendly" },
    { name:"Anchorage Port Stephens — Marina View Room", type:"Anchorage Port Stephens", ppn:320, desc:"Marina, spa, pool, family-friendly" },
    { name:"Anchorage Port Stephens — Suite", type:"Anchorage Port Stephens", ppn:420, desc:"Marina, spa, pool, family-friendly" },
    { name:"Oaks Pacific Blue Resort — 1-Bed Apartment", type:"Oaks Pacific Blue Resort", ppn:200, desc:"Golf, pools, family resort" },
    { name:"Oaks Pacific Blue Resort — 2-Bed Apartment", type:"Oaks Pacific Blue Resort", ppn:300, desc:"Golf, pools, family resort" },
    { name:"Oaks Pacific Blue Resort — 3-Bed Apartment", type:"Oaks Pacific Blue Resort", ppn:400, desc:"Golf, pools, family resort" },
    { name:"Soldiers Point Marina — Marina Room", type:"Soldiers Point Marina", ppn:220, desc:"Quiet side of port, waterfront" },
    { name:"Soldiers Point Marina — Deluxe Marina", type:"Soldiers Point Marina", ppn:300, desc:"Quiet side of port, waterfront" },
    { name:"Shoal Bay Resort & Spa — Garden Room", type:"Shoal Bay Resort & Spa", ppn:180, desc:"Beachfront Shoal Bay" },
    { name:"Shoal Bay Resort & Spa — Ocean View Room", type:"Shoal Bay Resort & Spa", ppn:250, desc:"Beachfront Shoal Bay" },
    { name:"Shoal Bay Resort & Spa — Suite", type:"Shoal Bay Resort & Spa", ppn:350, desc:"Beachfront Shoal Bay" },
  ],
  "Hunter Valley": [
    { name:"Spicers Vineyards Estate — Estate Room", type:"Spicers Vineyards Estate", ppn:380, desc:"Vineyard luxury, hatted restaurant" },
    { name:"Spicers Vineyards Estate — Luxury Room", type:"Spicers Vineyards Estate", ppn:450, desc:"Vineyard luxury, hatted restaurant" },
    { name:"Spicers Vineyards Estate — Suite", type:"Spicers Vineyards Estate", ppn:550, desc:"Vineyard luxury, hatted restaurant" },
    { name:"Château Élan — Classic Room", type:"Château Élan", ppn:350, desc:"★ UPGRADE above Deluxe: Resort, spa, golf" },
    { name:"Château Élan — Deluxe Room", type:"Château Élan", ppn:450, desc:"★ UPGRADE above Deluxe: Resort, spa, golf" },
    { name:"Château Élan — Vintage Suite", type:"Château Élan", ppn:600, desc:"★ UPGRADE above Deluxe: Resort, spa, golf" },
    { name:"Crowne Plaza Hunter Valley — Standard Room", type:"Crowne Plaza Hunter Valley", ppn:220, desc:"Resort, pool, central" },
    { name:"Crowne Plaza Hunter Valley — Vineyard View", type:"Crowne Plaza Hunter Valley", ppn:300, desc:"Resort, pool, central" },
    { name:"Crowne Plaza Hunter Valley — Suite", type:"Crowne Plaza Hunter Valley", ppn:400, desc:"Resort, pool, central" },
    { name:"Kirkton Park Hotel — Heritage Room", type:"Kirkton Park Hotel", ppn:200, desc:"Heritage estate, gardens" },
    { name:"Kirkton Park Hotel — Garden Room", type:"Kirkton Park Hotel", ppn:280, desc:"Heritage estate, gardens" },
    { name:"Kirkton Park Hotel — Suite", type:"Kirkton Park Hotel", ppn:380, desc:"Heritage estate, gardens" },
    { name:"Mercure Resort Hunter Valley — Standard Room", type:"Mercure Resort Hunter Valley", ppn:180, desc:"Golf course, pool, family" },
    { name:"Mercure Resort Hunter Valley — Superior Room", type:"Mercure Resort Hunter Valley", ppn:240, desc:"Golf course, pool, family" },
    { name:"Mercure Resort Hunter Valley — Suite", type:"Mercure Resort Hunter Valley", ppn:320, desc:"Golf course, pool, family" },
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

const RATE=1500, BOND=7500, ACCOM_CAP=450;
const GUESTS=["1 adult","2 adults (couple)","3 adults","4 adults","1 adult + 1 child","1 adult + 2 children","1 adult + 3 children","2 adults + 1 child","2 adults + 2 children","2 adults + 3 children"];

const visaCalc = b => {
  const touringNights = b.stops.filter(s=>s.mode==="touring").reduce((a,s)=>a+s.nights,0);
  const autoFuel = 1000;
  const autoDining = touringNights * 200;
  if (b.visaFuelOverride !== undefined || b.visaDiningOverride !== undefined) {
    const fuel = b.visaFuelOverride ?? autoFuel;
    const dining = b.visaDiningOverride ?? autoDining;
    return { fuel, dining, total: fuel + dining };
  }
  return { fuel:autoFuel, dining:autoDining, total:autoFuel+autoDining };
};

const accomSupCalc = b => {
  return b.stops.reduce((total, s) => {
    if (s.selectedAccom && s.accomOptions) {
      const opt = s.accomOptions.find(o => o.name === s.selectedAccom);
      if (opt && opt.ppn > ACCOM_CAP) {
        total += (opt.ppn - ACCOM_CAP) * s.nights;
      }
    }
    return total;
  }, 0);
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
        const data = { id: snap.id, ...snap.data() };
        // Auto-populate options for stops with mode set but no options loaded
        if (data.stops) {
          data.stops = data.stops.map(s => {
            if (s.mode && (!s.accomOptions || s.accomOptions.length === 0)) {
              const dbSource = PROPERTIES;
              return { ...s, accomOptions: (dbSource[s.name] || []).map(p => ({ ...p })) };
            }
            return s;
          });
        }
        setAct(data);
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
      stops: pk.stops.map(s => ({ name: s, mode: "touring", nights: 1, accomOptions: [], selectedAccom: null })),
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
    const pomCostCalc = (b.bondOption||"none")==="assurance"?Math.min(38*b.totalDays,380):(b.bondOption||"none")==="complete"?Math.min(55*b.totalDays,550):0;
    const accomSup = accomSupCalc(b);
    const q = { days: b.totalDays, sub: b.totalDays * RATE, sup: b.supplements || 0, accom: accomSup, total: b.totalDays * RATE + (b.supplements || 0) + accomSup };
    const allStopsSelected = b.stops.every(s => s.mode && s.selectedAccom);

    const selMode = async (si, mode) => {
      const stop = b.stops[si];
      const dbSource = PROPERTIES;
      const opts = (dbSource[stop.name] || []).map(p => ({ ...p }));
      const updated = { ...b, stops: b.stops.map((s, i) => i === si ? { ...s, mode, accomOptions: opts, selectedAccom: null } : s) };
      setAct(updated);
      await updateDoc(doc(db, "bookings", b.id), { stops: updated.stops });
    };

    const selAccom = async (si, val) => {
      const updated = { ...b, stops: b.stops.map((s, i) => i === si ? { ...s, selectedAccom: val || null } : s) };
      setAct(updated);
      await updateDoc(doc(db, "bookings", b.id), { stops: updated.stops });
    };

    const updGuest = async (field, val) => {
      const updated = { ...b, [field]: val };
      setAct(updated);
      await updateDoc(doc(db, "bookings", b.id), { [field]: val });
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
      try {
        await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: "service_boynyl6", template_id: "template_kuncasw", user_id: "xioaylu5g4dwl6Xo6",
            template_params: {
              guest_name: "Troy",
              guest_email: "troy.anderson@southernhorizonco.com.au",
              booking_id: b.id,
              package: pk.name + " — " + b.guestName + " has confirmed their selections",
              dates: b.stops.map(s=>`${s.name}: ${s.mode} — ${s.selectedAccom||"none"}`).join(" | "),
            },
          }),
        });
      } catch {}
      setConfirmed(true);
      setSending(false);
    };

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

          <h2 style={{fontFamily:sf,fontSize:22,fontWeight:500,color:dk,marginBottom:6}}>Your Itinerary</h2>
          <p style={{fontSize:12,color:lt,marginBottom:20}}>Select your preferred accommodation at each stop.</p>

          {b.stops.map((stop, si) => {
            const sel = stop.selectedAccom ? stop.accomOptions.find(o => o.name === stop.selectedAccom) : null;
            return (
              <div key={si} style={{marginBottom:20,paddingBottom:20,borderBottom:si<b.stops.length-1?`1px solid ${bd}`:"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <h3 style={{fontFamily:sf,fontSize:18,fontWeight:500,color:dk}}>{stop.name}</h3>
                  <span style={{fontSize:11,color:lt}}>{stop.nights} night{stop.nights>1?"s":""}</span>
                </div>





                {stop.mode && stop.accomOptions.length > 0 && !confirmed && b.status!=="confirmed" && (
                  <div style={{marginTop:6}}>
                    <label style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",
                      color:gd,marginBottom:6,display:"block"}}>
                      "Select your accommodation"
                    </label>
                    <select value={stop.selectedAccom || ""} onChange={e => selAccom(si, e.target.value)}
                      style={{...S.sl,borderColor:stop.selectedAccom?gd:bd,fontSize:13}}>
                      <option value="">Choose...</option>
                      {stop.accomOptions.map((opt, ai) => (
                        <option key={ai} value={opt.name}>{opt.name}{opt.ppn>450?` (+$${opt.ppn-450}/night upgrade)`:""}</option>
                      ))}
                    </select>
                    {sel && <p style={{fontSize:12,color:md,marginTop:6,fontStyle:"italic"}}>{sel.desc}</p>}
                  </div>
                )}

                {stop.selectedAccom && (confirmed || b.status==="confirmed") && (
                  <div style={{padding:"14px 18px",borderRadius:6,
                    background:`${gd}08`,
                    border:`1px solid ${gd}30`}}>
                    <div style={{fontFamily:sf,fontSize:16,fontWeight:500,color:dk}}>{stop.selectedAccom}</div>
                    {sel && <div style={{fontSize:12,color:lt,marginTop:2}}>{sel.desc}</div>}
                  </div>
                )}
              </div>
            );
          })}

          {!confirmed && b.status!=="confirmed" && (
            <div style={{...S.cd,marginBottom:24}}>
              <h3 style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:dk,marginBottom:4}}>Security Bond</h3>
              <p style={{fontSize:12,color:lt,marginBottom:16}}>A bond is charged at handover and fully refunded on return. You can reduce it with Peace of Mind Cover:</p>
              {[
                {id:"none",label:"Standard Bond",detail:"$7,500 fully refundable",cost:"Included"},
                {id:"assurance",label:"Peace of Mind — Assurance",detail:"Bond reduced to $5,000",cost:`+$${Math.min(38*b.totalDays,380)}`},
                {id:"complete",label:"Peace of Mind — Complete",detail:"Bond reduced to $3,500",cost:`+$${Math.min(55*b.totalDays,550)}`},
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

          {!confirmed && b.status!=="confirmed" && (b.guestCount||"").includes("child") && (
            <div style={{...S.cd,marginBottom:24}}>
              <h3 style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:dk,marginBottom:4}}>Children's Equipment</h3>
              <p style={{fontSize:12,color:lt,marginBottom:16}}>Select any equipment you need:</p>
              {[
                {k:"childSeats",label:"Child seats / booster seats",desc:"Arranged via Kidsafe QLD"},
                {k:"childCutlery",label:"Children's cutlery & dining sets",desc:"Sea to Summit Delta Camp Sets"},
                {k:"bottleKit",label:"Toddler dining & bottle kit",desc:"b.box + Milton steriliser"},
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

          <div style={{...S.cd,marginBottom:24}}>
            <h2 style={{fontFamily:sf,fontSize:22,fontWeight:500,marginBottom:4}}>Package Summary</h2>
            <div style={S.dv}/>
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${bd}`}}>
              <span style={{fontSize:13,color:md}}>{q.days} days × $1,500/day</span><span style={{fontSize:13,fontWeight:600}}>${q.sub.toLocaleString()}</span>
            </div>
            {q.sup > 0 && <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${bd}`}}>
              <span style={{fontSize:13,color:md}}>Ultra-luxury upgrades</span><span style={{fontSize:13,fontWeight:600}}>${q.sup.toLocaleString()}</span>
            </div>}
            {q.accom > 0 && <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${bd}`}}>
              <span style={{fontSize:13,color:tr}}>Accommodation upgrades</span><span style={{fontSize:13,fontWeight:600,color:tr}}>${q.accom.toLocaleString()}</span>
            </div>}
            {pomCostCalc > 0 && <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${bd}`}}>
              <span style={{fontSize:13,color:gd}}>Peace of Mind — {(b.bondOption||"none")==="assurance"?"Assurance":"Complete"}</span>
              <span style={{fontSize:13,fontWeight:600,color:gd}}>${pomCostCalc.toLocaleString()}</span>
            </div>}
            <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",marginTop:4}}>
              <span style={{fontFamily:sf,fontSize:18,fontWeight:500}}>Package Total</span>
              <span style={{fontFamily:sf,fontSize:18,fontWeight:600}}>${(q.total + pomCostCalc).toLocaleString()}</span>
            </div>
          </div>

          <div style={{...S.cd,marginBottom:24,borderLeft:`3px solid ${gd}`}}>
            <h3 style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:gd,marginBottom:12}}>Pre-loaded Visa Card</h3>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{fontSize:13,color:md}}>Fuel</span><span>${v.fuel.toLocaleString()}</span></div>
            {v.dining > 0 && <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{fontSize:13,color:md}}>Dining</span><span>${v.dining.toLocaleString()}</span></div>}
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginTop:4,borderTop:`1px solid ${bd}`}}>
              <span style={{fontWeight:600}}>Total loaded</span><span style={{fontWeight:600,color:gd}}>${v.total.toLocaleString()}</span>
            </div>
          </div>

          {(confirmed || b.status === "confirmed") && (
            <div style={{textAlign:"center",padding:"24px",background:`${gd}08`,borderRadius:8,border:`1px solid ${gd}30`}}>
              <div style={{fontFamily:sf,fontSize:24,color:gd,marginBottom:8}}>✓</div>
              <p style={{fontFamily:sf,fontSize:18,color:dk}}>Selections sent to Southern Horizon Co.</p>
              <p style={{fontSize:13,color:lt,marginTop:4}}>Troy or Jess will be in touch with your final booking details within 24 hours.</p>
            </div>
          )}

          {!confirmed && b.status !== "confirmed" && (
            <button onClick={confirmSel} disabled={!allStopsSelected || sending}
              style={{...S.bt,...(allStopsSelected && !sending ? S.bp : S.bh),width:"100%",padding:"16px",
                opacity:allStopsSelected && !sending?1:0.5,cursor:allStopsSelected && !sending?"pointer":"not-allowed"}}>
              {sending ? "Sending..." : allStopsSelected ? "Send My Selections to Southern Horizon Co." : "Please select your accommodation at each stop"}
            </button>
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
              const qtotal = b.totalDays * RATE + (b.supplements || 0) + accomSupCalc(b);
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
    const accomSup = accomSupCalc(b);
    const q = { days:b.totalDays, sub:b.totalDays*RATE, sup:b.supplements||0, pom:pomCost, accom:accomSup, total:b.totalDays*RATE+(b.supplements||0)+pomCost+accomSup };
    const upd = (f, val) => updBk({ ...b, [f]: val });

    const chgPkg = pid => {
      const np = PACKAGES[pid];
      updBk({...b, packageId:pid, totalDays:np.days,
        stops:(np.stops||[]).map(s=>({name:s,mode:"touring",nights:1,accomOptions:(PROPERTIES[s]||[]).map(p=>({...p})),selectedAccom:null}))});
    };

    const updStop = (i, f, val) => {
      const ns = b.stops.map((s, idx) => {
        if (idx !== i) return s;
        const u = { ...s, [f]: val };
        if (f === "mode" && val === "touring" && s.accomOptions.length === 0) u.accomOptions = (PROPERTIES[s.name] || []).map(p => ({ ...p }));
        if (f === "mode") { u.selectedAccom = null; u.accomOptions = (PROPERTIES[s.name] || []).map(p => ({ ...p })); }
        return u;
      });
      updBk({ ...b, stops: ns });
    };

    const addFromDb = (si, name, mode) => {
      const stop = b.stops[si];
      const dbSource = PROPERTIES;
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
              <button onClick={()=>updBk({...b,stops:[...b.stops,{name:"New Stop",mode:"touring",nights:1,accomOptions:[],selectedAccom:null}]})}
                style={{...S.bt,...S.bh,padding:"8px 16px",fontSize:10}}>+ Add Stop</button>
            </div>
            {b.stops.map((stop, si) => {
              const dbSource = PROPERTIES;
              const avail = dbSource[stop.name] || [];
              const added = stop.accomOptions.map(o => o.name);
              const unadded = avail.filter(p => !added.includes(p.name));
              return (
                <div key={si} style={{padding:"16px 0",borderBottom:si<b.stops.length-1?`1px solid ${bd}`:"none"}}>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 80px 80px",gap:10,alignItems:"end"}}>
                    <div><label style={S.lb}>Stop</label><input style={S.ip} value={stop.name} onChange={e=>updStop(si,"name",e.target.value)}/></div>
                    <div><label style={S.lb}>Mode</label>
                      <select style={{...S.sl,borderColor:tr,color:tr}}
                        value={stop.mode} onChange={e=>updStop(si,"mode",e.target.value)}>
                        <option value="touring">Touring</option>
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


                  {/* Accommodation Options */}
                  {stop.mode && (
                    <div style={{marginTop:12,paddingLeft:16,borderLeft:`2px solid ${tr}20`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <span style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:tr}}>
                          "Accommodation Options (" + stop.accomOptions.length + ")"
                        </span>
                        <div style={{display:"flex",gap:8}}>
                          {unadded.length > 0 && (
                            <select onChange={e=>{if(e.target.value){addFromDb(si,e.target.value,"touring");e.target.value=""}}}
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
                <input type="number" style={S.ip} value={b.visaDiningOverride ?? ""} placeholder={`Auto: $${b.stops.filter(s=>s.mode==="touring").reduce((a,s)=>a+s.nights,0) * 200} ($200/day × touring nights)`}
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
              <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{fontSize:13,color:md}}>{q.days}d × $1,500</span><span style={{fontSize:13,fontWeight:600}}>${q.sub.toLocaleString()}</span></div>
              {q.sup>0 && <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{fontSize:13,color:md}}>Ultra-luxury supplements</span><span style={{fontSize:13,fontWeight:600}}>${q.sup.toLocaleString()}</span></div>}
              {q.accom>0 && <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{fontSize:13,color:tr}}>Accommodation upgrades</span><span style={{fontSize:13,fontWeight:600,color:tr}}>${q.accom.toLocaleString()}</span></div>}
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

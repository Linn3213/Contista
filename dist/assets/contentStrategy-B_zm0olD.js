const u=[{id:"pillar-educational",name:"Utbildande guider",emoji:"📚",source:"generated",description:"Skapar tydlighet och bygger expertstatus i din nisch.",funnelPhase:"VARM",formats:["Reel","Karusell"],exampleTopics:["Vanliga misstag","Steg-for-steg","Checklista"],purpose:"utbilda",frequency:"2x/vecka"},{id:"pillar-storytelling",name:"Personliga stories",emoji:"📖",source:"generated",description:"Bygger relation genom erfarenheter, insikter och vardagsnara exempel.",funnelPhase:"VARM",formats:["Story","Caption"],exampleTopics:["Bakom kulisserna","Larande","Vardag"],purpose:"bygga relation",frequency:"1x/vecka"},{id:"pillar-trust",name:"Resultat & bevis",emoji:"🏆",source:"generated",description:"Visar social proof och gor det enklare att ta nasta steg med dig.",funnelPhase:"AG",formats:["Case","Testimonials"],exampleTopics:["Fore efter","Kundresultat","Process"],purpose:"sälja",frequency:"1x/vecka"},{id:"pillar-reach",name:"Räckviddsinnehåll",emoji:"🚀",source:"generated",description:"Attraherar nya personer med tydlig krok och igenkannbara problem.",funnelPhase:"VACK",formats:["Hook reel","Kort video"],exampleTopics:["Mytkross","Snabba tips","Kontraster"],purpose:"inspirera",frequency:"2x/vecka"},{id:"pillar-cta",name:"CTA-fokuserat",emoji:"🎯",source:"generated",description:"Driver direkt mot ditt viktigaste erbjudande eller nasta handling.",funnelPhase:"BJUD_IN",formats:["Story CTA","Säljinlägg"],exampleTopics:["Inbjudan","Erbjudande","Deadline"],purpose:"sälja",frequency:"1x/vecka"}];function y(e){return`contista.contentstrategy.pillars.${e}`}function s(e){return e.toLowerCase().trim().replace(/[^a-z0-9\u00C0-\u024F\s-]/g,"").replace(/\s+/g,"-").slice(0,60)}function B(e){try{const r=localStorage.getItem(y(e));if(!r)return u;const a=JSON.parse(r);return!Array.isArray(a)||a.length===0?u:a}catch{return u}}function E(e,r){try{localStorage.setItem(y(e),JSON.stringify(r))}catch{}}function I(e,r,a="✨"){const i=r.trim();if(!i)return e;const l=i.toLowerCase();return e.some(o=>o.name.toLowerCase()===l)?e:[...e,{id:`pillar-${s(i)}-${Date.now()}`,name:i,emoji:a,source:"manual",description:"Manuellt tillagd contentpelare.",funnelPhase:"VARM",formats:["Valfritt"],exampleTopics:["Exempel 1","Exempel 2","Exempel 3"],purpose:"utbilda",frequency:"1x/vecka"}]}function U(e,r){const a=e.filter(i=>i.id!==r);return a.length>0?a:u}function n(e,r,a){if(r&&r.length>0){const l=r.find(o=>a.some(d=>o.text.toLowerCase().includes(d)));if(l)return(e[l.id]||"").trim()}const i=Object.entries(e).find(([l])=>a.some(o=>l.toLowerCase().includes(o)));return i?(i[1]||"").trim():""}function h(e){return e.split(/,|\n|;|\//g).map(r=>r.trim()).filter(Boolean).slice(0,6)}function K(e){const r=e.toLowerCase();return r.includes("växa")||r.includes("vaxa")||r.includes("organisk")||r.includes("reach")?"VACK":r.includes("relation")||r.includes("förtroende")||r.includes("fortroende")?"VARM":r.includes("försälj")||r.includes("forsalj")||r.includes("sälj")||r.includes("salj")?"AG":r.includes("inspir")?"BJUD_IN":"VARM"}function N(e){return`Du är en expert på content-strategi för personliga varumärken och online-utbildning.

Baserat på följande svar från användaren, generera 5 skräddarsydda content-pelare.

--- ANVÄNDARENS SVAR ---
Kärnbudskap: ${e.karnbudskap||""}
Förändring du vill skapa: ${e.forandring||""}
Tre ord som beskriver varumärket: ${e.treOrd||""}
Primärt mål med content: ${e.mal||""}
Delmål per månad: ${e.delmål||""}
Vanligaste CTA: ${e.cta||""}
Ton: ${e.ton||""}
Hur personlig: ${e.personlighetsnivå||""}
Ord att använda / undvika: ${e.ordlista||""}
Veckoflöde för produktion: ${e.veckoflöde||""}
Prioriterade format per kanal: ${e.format||""}
Hur du återanvänder content: ${e.återanvändning||""}
Nyckeltal: ${e.kpi||""}
Uppföljningsfrekvens: ${e.uppföljning||""}
Content att göra mer av: ${e.merAv||""}
--- SLUT PÅ SVAR ---

Returnera exakt följande JSON-struktur, inget annat:

{
  "pelare": [
    {
      "namn": "Kortfattat pelarnamn (2–4 ord)",
      "emoji": "En passande emoji",
      "beskrivning": "En mening om vad pelaren handlar om och varför den finns",
      "funnel_fas": "VÄCK | VÄRM | ÄG | BJUD IN",
      "format": ["format1", "format2"],
      "exempelämnen": ["ämne 1", "ämne 2", "ämne 3"],
      "syfte": "utbilda | inspirera | sälja | bygga relation | underhålla",
      "frekvens": "t.ex. 2x/vecka"
    }
  ],
  "balans_rekommendation": "En mening om hur pelarna bör roteras för att täcka hela funneln."
}

Regler:
- Pelarna ska täcka ALLA fyra funnel-faser kollektivt
- Minst en pelare ska vara räckvidds-driven (VÄCK)
- Minst en pelare ska driva direkt mot primär CTA
- Varje pelare ska kännas distinkt — ingen överlappning
- Anpassa språk och ton exakt efter användarens svar`}function F(e,r,a){const i=n(e,a,["kärnbudskap","karnbudskap"]),l=n(e,a,["förändring","forandring"]),o=n(e,a,["tre ord"]),d=n(e,a,["mål med ditt content","primärt mål","primart mal"]),$=n(e,a,["delmål","delmal"]),p=n(e,a,["cta"]),g=n(e,a,["ton"]),b=n(e,a,["personlig"]),A=n(e,a,["ord/uttryck","ord att använda","ord att anvanda"]),x=n(e,a,["veckoflöde","veckoflode"]),f=n(e,a,["format"]),j=n(e,a,["återanvänder","ateranvander"]),C=n(e,a,["nyckeltal"]),V=n(e,a,["uppfölj"]),P=n(e,a,["göra mer av","gora mer av"]),T=n(e,a,["ämnen","amnen","pillars","pelare"]),k=h(T),t=k.length>0?k:["Problem","Lösning","Resultat","Relation","Erbjudande"],v=h(f),c=v.length>0?v:["Reel","Karusell"],m=p||"Nästa steg",R=K(d||""),S=[{id:`pillar-${s(`${t[0]||"reach"} mytbrytare`)}`,name:`${t[0]||"Reach"} mytbrytare`,emoji:"🚀",source:"generated",description:`Skapar räckvidd genom att bryta vanliga missuppfattningar hos ${n(e,a,["målgrupp"])||"målgruppen"}.`,funnelPhase:"VACK",formats:c.slice(0,2),exampleTopics:[`Myt om ${t[0]||"din nisch"}`,`Vanligt misstag inom ${t[1]||"området"}`,`Snabb insikt: ${t[2]||"resultat"}`],purpose:"inspirera",frequency:"2x/vecka"},{id:`pillar-${s(`${t[1]||"guide"} steg för steg`)}`,name:`${t[1]||"Guide"} steg för steg`,emoji:"📚",source:"generated",description:`Utbildar i ${t[1]||"nyckelområdet"} med tydlig progression och praktiska exempel.`,funnelPhase:"VARM",formats:c.slice(0,2),exampleTopics:[`${t[1]||"Ämne"} på 3 nivåer`,`Checklista för ${t[2]||"resultat"}`,`Så undviker du fel i ${t[0]||"nischen"}`],purpose:"utbilda",frequency:"2x/vecka"},{id:`pillar-${s(`${t[2]||"story"} bakom kulisserna`)}`,name:`${t[2]||"Story"} bakom kulisserna`,emoji:"💬",source:"generated",description:`Bygger relation med personlig ton (${g||"personlig"}) och vardagsnära berättelser.`,funnelPhase:"VARM",formats:["Story","Caption"],exampleTopics:["Före och efter ett beslut","Lärdom från veckan",`Värdering: ${o||"dina kärnord"}`],purpose:"bygga relation",frequency:"1x/vecka"},{id:`pillar-${s(`${t[3]||"case"} resultat`)}`,name:`${t[3]||"Case"} resultat`,emoji:"🏆",source:"generated",description:`Visar konkreta resultat kopplat till målet "${d||"tillväxt"}" och stärker beslut att agera.`,funnelPhase:"AG",formats:["Case",...c.slice(0,1)],exampleTopics:["Före efter kundresa","Vad vi ändrade och varför","Resultat i siffror"],purpose:"sälja",frequency:"1x/vecka"},{id:`pillar-${s(`${m} fokus`)}`,name:`${m} fokus`,emoji:"🎯",source:"generated",description:`Driver direkt mot din primära CTA (${m}) med tydlig handling och låg friktion.`,funnelPhase:R==="AG"?"AG":"BJUD_IN",formats:["Story CTA",...c.slice(0,1)],exampleTopics:["Inbjudan till nästa steg","Vanlig invändning och svar","Tydlig CTA med tidsram"],purpose:"sälja",frequency:"1x/vecka"}],L=r.filter(D=>D.source==="manual"),M=N({karnbudskap:i,forandring:l,treOrd:o,mal:d,delmål:$,cta:p,ton:g,personlighetsnivå:b,ordlista:A,veckoflöde:x,format:f,återanvändning:j,kpi:C,uppföljning:V,merAv:P});return{pillars:[...S,...L],balanceRecommendation:`Rotera VÄCK -> VÄRM -> ÄG -> BJUD IN varje vecka och låt ${m} vara CTA-spåret 1-2 gånger/vecka för jämn funnel-täckning.`,prompt:M}}export{I as a,F as g,B as l,U as r,E as s};

const MC_CONFIG = {
    categories: [
        { id: 'self-help', name: 'Self-Help', emoji: '🧠', color: '#9b87f5' },
        { id: 'self-care', name: 'Self-Care', emoji: '💆‍♀️', color: '#f5a5c8' },
        { id: 'self-growth', name: 'Self-Growth', emoji: '🌱', color: '#7cd992' },
        { id: 'story', name: 'Story/Personal', emoji: '📖', color: '#fbbf77' },
        { id: 'education', name: 'Education', emoji: '📚', color: '#6eb5e0' },
        { id: 'bts', name: 'Behind the Scenes', emoji: '🎬', color: '#ff9999' },
        { id: 'inspiration', name: 'Inspiration', emoji: '✨', color: '#d4a574' }
    ],
    purposes: [
        { id: 'sell', name: 'Säljande', emoji: '💰' },
        { id: 'inspire', name: 'Inspirerande', emoji: '✨' },
        { id: 'educate', name: 'Utbildande', emoji: '📚' },
        { id: 'story', name: 'Storytelling', emoji: '📖' },
        { id: 'trust', name: 'Relation/Förtroende', emoji: '💙' },
        { id: 'objection', name: 'Invändningshantering', emoji: '🛡️' },
        { id: 'awareness', name: 'Awareness', emoji: '👀' },
        { id: 'value', name: 'Värdeskapande', emoji: '💎' }
    ],
    channels: [
        { id: 'ig-post', name: 'Instagram Inlägg', emoji: '📷' },
        { id: 'ig-reel', name: 'Instagram Reel', emoji: '🎬' },
        { id: 'ig-story', name: 'Instagram Story', emoji: '📱' },
        { id: 'tiktok', name: 'TikTok', emoji: '🎵' },
        { id: 'newsletter', name: 'Nyhetsbrev', emoji: '📧' },
        { id: 'blog', name: 'Blogg', emoji: '✍️' },
        { id: 'linkedin', name: 'LinkedIn', emoji: '💼' },
        { id: 'sales', name: 'Sales Page', emoji: '💫' }
    ],
    formats: [
        { id: 'talking-head', name: 'Talking Head', emoji: '🗣️' },
        { id: 'day-in-life', name: 'Day in the Life', emoji: '📅' },
        { id: 'before-after', name: 'Before/After', emoji: '⚡' },
        { id: 'tips', name: 'Tipslista', emoji: '📝' },
        { id: 'qa', name: 'Q&A', emoji: '❓' },
        { id: 'tutorial', name: 'Tutorial', emoji: '🎓' },
        { id: 'bts', name: 'Behind the Scenes', emoji: '🎬' },
        { id: 'transformation', name: 'Transformation Story', emoji: '✨' }
    ],
    tones: [
        { id: 'professional', name: 'Professionell', emoji: '👔' },
        { id: 'personal', name: 'Personlig', emoji: '💭' },
        { id: 'vulnerable', name: 'Sårbar', emoji: '💔' },
        { id: 'inspiring', name: 'Inspirerande', emoji: '🌟' },
        { id: 'direct', name: 'Direkt', emoji: '🎯' },
        { id: 'luxury', name: 'Lyxig', emoji: '✨' },
        { id: 'friendly', name: 'Vänlig', emoji: '😊' },
        { id: 'empowering', name: 'Empowering', emoji: '💪' }
    ],
    statuses: [
        { id: 'draft', name: 'Utkast', emoji: '📝', color: '#999' },
        { id: 'in-progress', name: 'Pågående', emoji: '🔄', color: '#ff9f43' },
        { id: 'ready', name: 'Klar', emoji: '✅', color: '#10ac84' },
        { id: 'scheduled', name: 'Schemalagd', emoji: '📅', color: '#5f27cd' },
        { id: 'published', name: 'Publicerad', emoji: '🌟', color: '#d4a574' }
    ]
};





function showViralHooks() {
    showPage('library'); // Hooks & CTAs page
}

function showContentStrategy() {
    showPage('strategy'); // Content Strategy page
}

function showAvatarLibrary() {
    showPage('avatars'); // Avatarer page
}

function copyScriptToCaption() {
    let text = '';
    for (let i = 0; i < 20; i++) {
        let f = document.getElementById('scriptStep' + i);
        if (f && f.value) text += (text ? '\n\n' : '') + f.value;
    }
    let c = document.getElementById('postContent') || document.getElementById('captionInput');
    if (c && text) { c.value = text; alert('✅ Kopierat!'); }
    else alert('⚠️ Kunde inte kopiera');
}





// ========================================================================
// LINNARTISTRY V6 - COMPLETE FEATURE SET
// ========================================================================

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let scheduledPosts = {};
let dreamCustomerData = {};
let weeklySchedule = {};
let savedPillars = [];

// ========================================================================
// STORAGE FUNCTIONS
// ========================================================================

function loadScheduledPosts() {
    const saved = localStorage.getItem('linnartistry_scheduled_posts');
    if (saved) scheduledPosts = JSON.parse(saved);
}

function saveScheduledPosts() {
    localStorage.setItem('linnartistry_scheduled_posts', JSON.stringify(scheduledPosts));
}

function loadDreamCustomer() {
    const saved = localStorage.getItem('linnartistry_dream_customer');
    if (saved) dreamCustomerData = JSON.parse(saved);
}

function saveDreamCustomer() {
    localStorage.setItem('linnartistry_dream_customer', JSON.stringify(dreamCustomerData));
    showNotification('✅ Drömkund sparad!', 'success');
}

function loadWeeklySchedule() {
    const saved = localStorage.getItem('linnartistry_weekly_schedule');
    if (saved) weeklySchedule = JSON.parse(saved);
}

function saveWeeklySchedule() {
    localStorage.setItem('linnartistry_weekly_schedule', JSON.stringify(weeklySchedule));
}

function loadSavedPillars() {
    const saved = localStorage.getItem('linnartistry_content_pillars');
    if (saved) savedPillars = JSON.parse(saved);
}

function savePillars() {
    localStorage.setItem('linnartistry_content_pillars', JSON.stringify(savedPillars));
}

// ========================================================================
// 1. ÖVERSIKT MED MÅNADSKALENDER
// ========================================================================

function showOversikt() {
    clearMainContent();
    loadScheduledPosts();

    const main = document.getElementById('mainContent');
    if (!main) return;

    const container = document.createElement('div');
    container.style.cssText = 'padding: 40px;';

    const header = document.createElement('div');
    header.style.cssText = 'margin-bottom: 40px;';
    header.innerHTML = `
        <h1 style="font-size: 2.8em; color: #2c2416; margin: 0 0 12px 0; font-weight: 700;">✨ Översikt</h1>
        <p style="font-size: 1.15em; color: #8b7355; margin: 0;">Din månadskalender och översikt</p>
    `;
    container.appendChild(header);

    const calendarSection = document.createElement('div');
    calendarSection.style.cssText = 'background: white; padding: 35px; border-radius: 20px; box-shadow: 0 4px 20px rgba(139,115,85,0.15); margin-bottom: 40px;';
    calendarSection.innerHTML = '<h2 style="color: #2c2416; margin: 0 0 30px 0; font-size: 1.8em;">📅 Månadskalender</h2><div id="calendarContainer"></div>';
    container.appendChild(calendarSection);

    const statsGrid = document.createElement('div');
    statsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;';

    const totalPosts = Object.values(scheduledPosts).reduce((sum, arr) => sum + arr.length, 0);

    const stats = [
        { label: 'Schemalagda Posts', value: totalPosts, emoji: '📅', gradient: 'linear-gradient(135deg, #d4a574 0%, #e8c298 100%)' },
        { label: 'Hooks', value: '949+', emoji: '🎣', gradient: 'linear-gradient(135deg, #c89f7b 0%, #d4a574 100%)' },
        { label: 'Templates', value: '12', emoji: '📝', gradient: 'linear-gradient(135deg, #e8c298 0%, #f5e6d3 100%)' },
        { label: 'Avatars', value: '8', emoji: '👥', gradient: 'linear-gradient(135deg, #d4a574 0%, #c89f7b 100%)' }
    ];

    stats.forEach(stat => {
        const card = document.createElement('div');
        card.style.cssText = 'background: white; padding: 28px; border-radius: 16px; box-shadow: 0 4px 16px rgba(139,115,85,0.15); border-left: 4px solid #d4a574; transition: all 0.3s;';
        card.innerHTML = `<div style="font-size: 2.2em; margin-bottom: 12px;">${stat.emoji}</div><div style="font-size: 2.2em; font-weight: 700; background: ${stat.gradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 6px;">${stat.value}</div><div style="color: #8b7355; font-size: 0.95em; font-weight: 500;">${stat.label}</div>`;
        statsGrid.appendChild(card);
    });

    container.appendChild(statsGrid);
    main.appendChild(container);

    renderCalendar();
}

function renderCalendar() {
    const calendarContainer = document.getElementById('calendarContainer');
    if (!calendarContainer) return;

    calendarContainer.innerHTML = '';

    const monthNames = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];

    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; background: linear-gradient(135deg, #f5f1eb 0%, #e8dfd5 100%); padding: 24px; border-radius: 16px;';
    header.innerHTML = `<button onclick="previousMonth()" style="padding: 12px 24px; background: white; border: 2px solid #d4a574; color: #2c2416; border-radius: 10px; cursor: pointer; font-weight: 600;">← Förra</button><h2 style="margin: 0; color: #2c2416; font-size: 1.8em; font-weight: 600;">${monthNames[currentMonth]} ${currentYear}</h2><button onclick="nextMonth()" style="padding: 12px 24px; background: white; border: 2px solid #d4a574; color: #2c2416; border-radius: 10px; cursor: pointer; font-weight: 600;">Nästa →</button>`;
    calendarContainer.appendChild(header);

    const grid = document.createElement('div');
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px;';

    const dayNames = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.style.cssText = 'text-align: center; font-weight: 700; color: #8b7355; padding: 12px; font-size: 0.9em;';
        dayHeader.textContent = day;
        grid.appendChild(dayHeader);
    });

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startDay; i++) {
        grid.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.style.cssText = 'aspect-ratio: 1; background: white; border-radius: 12px; padding: 12px; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 8px rgba(139,115,85,0.1); display: flex; flex-direction: column; justify-content: space-between; position: relative; border: 2px solid transparent;';

        const dayNumber = document.createElement('div');
        dayNumber.style.cssText = 'font-weight: 700; color: #2c2416; font-size: 1.1em;';
        dayNumber.textContent = day;
        dayDiv.appendChild(dayNumber);

        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        if (scheduledPosts[dateStr] && scheduledPosts[dateStr].length > 0) {
            const indicator = document.createElement('div');
            indicator.style.cssText = 'position: absolute; bottom: 8px; right: 8px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85em; font-weight: 700; box-shadow: 0 2px 6px rgba(212,165,116,0.4);';
            indicator.textContent = scheduledPosts[dateStr].length;
            dayDiv.appendChild(indicator);
        }

        dayDiv.onclick = () => openDayContentCreator(dateStr);

        dayDiv.onmouseenter = () => {
            dayDiv.style.background = 'linear-gradient(135deg, #f5f1eb 0%, #e8dfd5 100%)';
            dayDiv.style.transform = 'translateY(-3px)';
            dayDiv.style.boxShadow = '0 6px 20px rgba(212,165,116,0.3)';
            dayDiv.style.borderColor = '#d4a574';
        };
        dayDiv.onmouseleave = () => {
            dayDiv.style.background = 'white';
            dayDiv.style.transform = 'translateY(0)';
            dayDiv.style.boxShadow = '0 2px 8px rgba(139,115,85,0.1)';
            dayDiv.style.borderColor = 'transparent';
        };

        grid.appendChild(dayDiv);
    }

    calendarContainer.appendChild(grid);
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function openDayContentCreator(dateStr) {
    showDayContentCreator(dateStr);
}

// ========================================================================
// 2. 29 DRÖMKUND-FRÅGOR
// ========================================================================

const DREAM_CUSTOMER_QUESTIONS = {
    sektion1: { title: "Ditt Kärnlöfte", questions: [{ id: "f1", question: "Om du bara kunde lova ETT huvudresultat till din kund, vad skulle det vara?", placeholder: "T.ex. 'Hjälp nyblivna mammor gå ned i vikt på 90 dagar utan gym'", type: "textarea" }] },
    sektion2: { title: "Din Målgrupp", questions: [{ id: "f2", question: "Beskriv din ideala kund i detalj", placeholder: "Ålder, arbete, livsstil...", type: "textarea" }, { id: "f3", question: "Vilket är det största problemet du hjälper henne att lösa?", placeholder: "Exakt som hon uttrycker det...", type: "textarea" }, { id: "f4", question: "Vad är det mest frustrerande eller känslomässigt svåra med problemet?", placeholder: "Känslor...", type: "textarea" }, { id: "f5", question: "Hur påverkar problemet andra delar av hennes liv?", placeholder: "Hälsa, sömn, relationer...", type: "textarea" }] },
    sektion3: { title: "Brådska och Insats", questions: [{ id: "f6", question: "Varför ska hon agera nu istället för senare?", placeholder: "Kostar väntan tid, pengar?", type: "textarea" }, { id: "f7", question: "Vad är risken om hon väntar?", placeholder: "Förvärras problemet?", type: "textarea" }, { id: "f8", question: "Vad är värsta scenariot om hon aldrig löser problemet?", placeholder: "5 år framåt...", type: "textarea" }, { id: "f9", question: "Vad är det bästa som kan hända om hon löser problemet?", placeholder: "Drömresultatet...", type: "textarea" }] },
    sektion4: { title: "Bevis och Trovärdighet", questions: [{ id: "f10", question: "Vilka specifika fakta, siffror eller resultat bevisar att ditt erbjudande fungerar?", placeholder: "Antal personer...", type: "textarea" }, { id: "f11", question: "Vilken trovärdighet har du?", placeholder: "Kvalifikationer...", type: "textarea" }, { id: "f12", question: "Har du några riktiga kundrecensioner?", placeholder: "Kopiera exakt...", type: "textarea" }] },
    sektion5: { title: "Språk och Kontakt", questions: [{ id: "f13", question: "Vilka ord eller fraser använder kunder för att beskriva sitt problem?", placeholder: "Från DM...", type: "textarea" }, { id: "f14", question: "Vad vill de egentligen, bortom det uppenbara?", placeholder: "Känna sig attraktiv...", type: "textarea" }, { id: "f15", question: "Finns det en gemensam fiende eller frustration?", placeholder: "Dålig service...", type: "textarea" }] },
    sektion6: { title: "Din Bakgrund och Personlighet", questions: [{ id: "f16", question: "Vad är din personliga eller företagshistoria?", placeholder: "Vad fick dig att börja?", type: "textarea" }, { id: "f17", question: "Vilka värderingar styr ditt arbete?", placeholder: "Varför viktiga?", type: "textarea" }, { id: "f18", question: "Hur vill du låta för din publik?", placeholder: "Inspirerande, varm...", type: "text" }] },
    sektion7: { title: "Ditt Erbjudande", questions: [{ id: "f19", question: "Förklara din lösning steg för steg på enkel svenska", placeholder: "Som för ett barn...", type: "textarea" }, { id: "f20", question: "Vad gör ditt arbetssätt bättre eller annorlunda?", placeholder: "Snabbare...", type: "textarea" }, { id: "f21", question: "Lista allt kunden får när hon köper av dig", placeholder: "Bonusar...", type: "textarea" }] },
    sektion8: { title: "Invändningar och Trygghet", questions: [{ id: "f22", question: "Vilka är de tre vanligaste invändningarna?", placeholder: "Lista 3...", type: "textarea" }, { id: "f23", question: "Hur svarar du på varje invändning?", placeholder: "Dina svar...", type: "textarea" }, { id: "f24", question: "Erbjuder du garanti eller trygg testperiod?", placeholder: "Beskriv...", type: "textarea" }] },
    sektion9: { title: "Första Steg och Snabba Vinster", questions: [{ id: "f25", question: "Vad är det första som händer efter köp?", placeholder: "Första steget...", type: "textarea" }, { id: "f26", question: "Vilket snabbt synligt resultat kan de få inom timmar/dagar?", placeholder: "Quick wins...", type: "textarea" }] },
    sektion10: { title: "Ton och Uttryck", questions: [{ id: "f27", question: "Vilka fraser, uttryck eller typiska grejer du säger återkommer ofta?", placeholder: "Catchphrases...", type: "textarea" }, { id: "f28", question: "Vilka ämnen, hobbies eller referenser använder du i dina inlägg?", placeholder: "Dina intressen...", type: "textarea" }, { id: "f29", question: "Något annat viktigt om din ton, stil eller personlighet?", placeholder: "Övrig info...", type: "textarea" }] }
};

function showDromkunden() {
    clearMainContent();
    loadDreamCustomer();

    const main = document.getElementById('mainContent');
    if (!main) return;

    const container = document.createElement('div');
    container.style.cssText = 'padding: 40px;';

    const header = document.createElement('div');
    header.style.cssText = 'margin-bottom: 40px;';
    header.innerHTML = `<h1 style="font-size: 2.5em; color: #2c2416; margin: 0 0 12px 0; font-weight: 700;">🎯 Drömkunden</h1><p style="font-size: 1.1em; color: #8b7355; margin: 0 0 20px 0;">29 djupa frågor för att förstå din idealkund</p><div style="display: flex; gap: 12px;"><button onclick="saveDreamCustomer()" style="padding: 14px 28px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(212,165,116,0.3);">💾 Spara</button><button onclick="exportDreamCustomer()" style="padding: 14px 28px; background: white; color: #2c2416; border: 2px solid #d4a574; border-radius: 10px; font-weight: 600; cursor: pointer;">📥 Exportera</button></div>`;
    container.appendChild(header);

    Object.keys(DREAM_CUSTOMER_QUESTIONS).forEach((key, idx) => {
        const section = DREAM_CUSTOMER_QUESTIONS[key];
        const sectionDiv = document.createElement('div');
        sectionDiv.style.cssText = 'background: white; padding: 32px; border-radius: 16px; box-shadow: 0 4px 16px rgba(139,115,85,0.12); margin-bottom: 24px; border-left: 4px solid #d4a574;';

        let html = `<h2 style="color: #d4a574; margin: 0 0 24px 0; font-size: 1.5em;">Sektion ${idx + 1}: ${section.title}</h2>`;
        section.questions.forEach(q => {
            const value = dreamCustomerData[q.id] || '';
            html += `<div style="margin-bottom: 24px;"><label style="display: block; font-weight: 600; color: #2c2416; margin-bottom: 10px;">${q.question}</label>`;
            if (q.type === 'textarea') {
                html += `<textarea id="${q.id}" placeholder="${q.placeholder}" style="width: 100%; min-height: 120px; padding: 14px; border: 2px solid #e8dfd5; border-radius: 10px; font-family: inherit; font-size: 1em;" onchange="updateDreamCustomerField('${q.id}')">${value}</textarea>`;
            } else {
                html += `<input type="text" id="${q.id}" placeholder="${q.placeholder}" value="${value}" style="width: 100%; padding: 14px; border: 2px solid #e8dfd5; border-radius: 10px; font-size: 1em;" onchange="updateDreamCustomerField('${q.id}')">`;
            }
            html += '</div>';
        });
        sectionDiv.innerHTML = html;
        container.appendChild(sectionDiv);
    });

    main.appendChild(container);
}

function updateDreamCustomerField(fieldId) {
    const el = document.getElementById(fieldId);
    if (el) dreamCustomerData[fieldId] = el.value;
}

function exportDreamCustomer() {
    let text = 'DRÖMKUND-PROFIL\n' + '='.repeat(60) + '\n\n';
    Object.keys(DREAM_CUSTOMER_QUESTIONS).forEach((key, idx) => {
        const section = DREAM_CUSTOMER_QUESTIONS[key];
        text += `SEKTION ${idx + 1}: ${section.title}\n` + '-'.repeat(60) + '\n\n';
        section.questions.forEach(q => {
            text += `${q.question}\n${dreamCustomerData[q.id] || '(Ej ifylld)'}\n\n`;
        });
        text += '\n';
    });
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Drömkund-Profil.txt';
    a.click();
}

// ========================================================================
// 3. CONTENT PILLARS
// ========================================================================

function showContentPillars() {
    showPage('pillars'); // Use existing Content Pillars page
}

function generatePillarsFromDreamCustomer() {
    loadDreamCustomer();

    if (!dreamCustomerData.f1 || !dreamCustomerData.f2) {
        showNotification('⚠️ Fyll i Drömkunden först!', 'error');
        return;
    }

    const generatedPillars = [];
    if (dreamCustomerData.f3) generatedPillars.push({ id: 'pillar_problem', name: 'Problemlösning', description: 'Content som löser kundens största problem', basedOn: 'F3' });
    if (dreamCustomerData.f9) generatedPillars.push({ id: 'pillar_transformation', name: 'Transformation', description: 'Visa vägen till drömresultatet', basedOn: 'F9' });
    if (dreamCustomerData.f14) generatedPillars.push({ id: 'pillar_desire', name: 'Djupare Önskningar', description: 'Det de verkligen längtar efter', basedOn: 'F14' });
    if (dreamCustomerData.f16) generatedPillars.push({ id: 'pillar_story', name: 'Min Story', description: 'Personlig storytelling', basedOn: 'F16-F18' });

    generatedPillars.forEach(pillar => {
        if (!savedPillars.find(p => p.id === pillar.id)) savedPillars.push(pillar);
    });

    savePillars();
    showNotification('✅ ' + generatedPillars.length + ' pillars skapade!', 'success');
    showContentPillars();
}

// ========================================================================
// 4. VECKOPLANNERING (DAGSSCHEMA)
// ========================================================================

function showVeckoplannering() {
    clearMainContent();
    loadWeeklySchedule();

    const main = document.getElementById('mainContent');
    if (!main) return;

    const container = document.createElement('div');
    container.style.cssText = 'padding: 40px;';

    const header = document.createElement('div');
    header.style.cssText = 'margin-bottom: 40px;';
    header.innerHTML = '<h1 style="font-size: 2.5em; color: #2c2416; margin: 0 0 12px 0; font-weight: 700;">📅 Veckoplannering</h1><p style="font-size: 1.1em; color: #8b7355; margin: 0;">Ditt arbetsschema för veckan</p>';
    container.appendChild(header);

    const days = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];

    days.forEach(day => {
        const tasks = weeklySchedule[day] || [];
        const daySection = document.createElement('div');
        daySection.style.cssText = 'background: white; padding: 28px; border-radius: 16px; box-shadow: 0 4px 16px rgba(139,115,85,0.12); margin-bottom: 20px;';

        let html = '<h3 style="color: #2c2416; margin: 0 0 16px 0; font-size: 1.4em;">' + day + '</h3>';
        if (tasks.length > 0) {
            tasks.forEach((task, idx) => {
                html += '<div style="padding: 12px; background: #f5f1eb; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;"><span style="color: #2c2416;">' + task + '</span><button onclick="removeWeeklyTask(\'' + day + '\', ' + idx + ')" style="padding: 6px 12px; background: white; color: #c89f7b; border: 2px solid #c89f7b; border-radius: 6px; font-size: 0.85em; cursor: pointer;">🗑️</button></div>';
            });
        }
        html += '<div style="display: flex; gap: 8px; margin-top: 12px;"><input type="text" id="task_' + day + '" placeholder="Ny uppgift..." style="flex: 1; padding: 12px; border: 2px solid #e8dfd5; border-radius: 8px; font-size: 1em;"><button onclick="addWeeklyTask(\'' + day + '\')" style="padding: 12px 24px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">➕</button></div>';

        daySection.innerHTML = html;
        container.appendChild(daySection);
    });

    main.appendChild(container);
}

function addWeeklyTask(day) {
    const input = document.getElementById('task_' + day);
    if (!input || !input.value.trim()) return;
    if (!weeklySchedule[day]) weeklySchedule[day] = [];
    weeklySchedule[day].push(input.value.trim());
    saveWeeklySchedule();
    showVeckoplannering();
}

function removeWeeklyTask(day, index) {
    if (weeklySchedule[day]) {
        weeklySchedule[day].splice(index, 1);
        saveWeeklySchedule();
        showVeckoplannering();
    }
}

// ========================================================================
// 5. POST-KATEGORIER & CONTENT CREATOR
// ========================================================================

const POST_CATEGORIES = [
    { id: 'min_story', name: '📖 Min Story', description: 'Personlig storytelling', visualGuide: { title: 'Visuellt Material för Min Story', recommendations: ['BTS-bilder från din resa', 'Känslomässiga ögonblick', 'Före & efter', 'Personliga miljöer'], style: 'Autentiskt, personligt, rått' } },
    { id: 'bts_low', name: '🎬 BTS - Low Intensity', description: 'Behind-the-scenes', visualGuide: { title: 'Visuellt Material för BTS', recommendations: ['Mobilfilm arbetsplats', 'Coffee setups', 'Processen', 'Roliga misslyckanden'], style: 'Rått, ofiltrerat' } },
    { id: 'larande', name: '📚 Lärande', description: 'Educational content', visualGuide: { title: 'Visuellt Material för Lärande', recommendations: ['Close-ups tekniker', 'Steg-för-steg', 'Grafik overlays', 'Before/after'], style: 'Tydligt, strukturerat' } },
    { id: 'reach_trend', name: '🔥 Reach - Trendande', description: 'Viralt content', visualGuide: { title: 'Visuellt Material för Reach', recommendations: ['Trending ljud', 'Pattern interrupts', 'Snabba cuts', 'Hook första frame'], style: 'Snabbt, engagerande' } },
    { id: 'amne_karusell', name: '🎠 Ämne - Karusell', description: 'Djupdykning', visualGuide: { title: 'Visuellt Material för Karusell', recommendations: ['Konsekvent design', 'Stor text', 'Ikoner grafik', 'CTA sista slide'], style: 'Clean, branded' } },
    { id: 'low_effort', name: '⚡ Low Effort', description: 'Snabbt skapat', visualGuide: { title: 'Visuellt Material för Low Effort', recommendations: ['Talking head', 'Screenshots text', 'Enkla foton', 'Quick tips'], style: 'Enkelt, snabbt' } },
    { id: 'djup_lang', name: '🎥 Djup - Långt Format', description: 'Omfattande', visualGuide: { title: 'Visuellt Material för Långt Format', recommendations: ['Pro lighting', 'B-roll footage', 'Flera vinklar', 'Interview-style'], style: 'Cinematiskt' } }
];

function showVisualGuideModal(categoryId) {
    const category = POST_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;

    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(44, 36, 22, 0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;';

    const content = document.createElement('div');
    content.style.cssText = 'background: white; padding: 40px; border-radius: 20px; max-width: 600px; max-height: 80vh; overflow-y: auto;';

    let html = '<h2 style="color: #d4a574; margin: 0 0 20px 0;">' + category.visualGuide.title + '</h2>';
    html += '<div style="background: linear-gradient(135deg, #f5f1eb 0%, #e8dfd5 100%); padding: 16px; border-radius: 12px; margin-bottom: 20px;"><strong style="color: #2c2416;">Stil:</strong> ' + category.visualGuide.style + '</div>';
    html += '<h3 style="color: #2c2416; margin: 0 0 16px 0;">Rekommendationer:</h3><ul style="margin: 0; padding-left: 24px;">';
    category.visualGuide.recommendations.forEach(rec => {
        html += '<li style="margin-bottom: 12px; color: #2c2416;">' + rec + '</li>';
    });
    html += '</ul><button onclick="this.parentElement.parentElement.remove()" style="margin-top: 24px; padding: 14px 24px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; width: 100%;">Stäng</button>';

    content.innerHTML = html;
    modal.appendChild(content);
    document.body.appendChild(modal);
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

function showDayContentCreator(dateStr) {
    clearMainContent();

    const main = document.getElementById('mainContent');
    if (!main) return;

    const container = document.createElement('div');
    container.style.cssText = 'padding: 40px;';

    const dateObj = new Date(dateStr);
    const displayDate = dateObj.toLocaleDateString('sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const header = document.createElement('div');
    header.style.cssText = 'margin-bottom: 40px;';
    header.innerHTML = '<h1 style="font-size: 2.5em; color: #2c2416; margin: 0 0 12px 0; font-weight: 700;">✨ Content Creator</h1><p style="font-size: 1.1em; color: #8b7355; margin: 0 0 12px 0;">Skapa content för: <strong>' + displayDate + '</strong></p><button onclick="showOversikt()" style="padding: 10px 20px; background: white; color: #2c2416; border: 2px solid #d4a574; border-radius: 10px; font-weight: 600; cursor: pointer;">← Tillbaka</button>';
    container.appendChild(header);

    const categoriesGrid = document.createElement('div');
    categoriesGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;';

    POST_CATEGORIES.forEach(cat => {
        const card = document.createElement('div');
        card.style.cssText = 'background: white; padding: 28px; border-radius: 16px; box-shadow: 0 4px 16px rgba(139,115,85,0.12); cursor: pointer; transition: all 0.3s; border: 2px solid transparent;';
        card.innerHTML = '<h3 style="color: #2c2416; margin: 0 0 12px 0; font-size: 1.3em;">' + cat.name + '</h3><p style="color: #8b7355; margin: 0 0 16px 0; font-size: 0.95em;">' + cat.description + '</p><button onclick="selectCategoryForDate(\'' + cat.id + '\', \'' + dateStr + '\')" style="padding: 12px 24px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; width: 100%; margin-bottom: 8px;">Välj denna</button><button onclick="showVisualGuideModal(\'' + cat.id + '\')" style="padding: 10px 20px; background: white; color: #2c2416; border: 2px solid #d4a574; border-radius: 10px; font-weight: 600; cursor: pointer; width: 100%;">📸 Se guide</button>';

        card.onmouseenter = () => {
            card.style.borderColor = '#d4a574';
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 8px 24px rgba(212,165,116,0.25)';
        };
        card.onmouseleave = () => {
            card.style.borderColor = 'transparent';
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 16px rgba(139,115,85,0.12)';
        };

        categoriesGrid.appendChild(card);
    });

    container.appendChild(categoriesGrid);
    main.appendChild(container);
}

function selectCategoryForDate(categoryId, dateStr) {
    showFullContentCreator(categoryId, dateStr);
}

function showFullContentCreator(categoryId, dateStr) {
    clearMainContent();

    const category = POST_CATEGORIES.find(c => c.id === categoryId);
    const main = document.getElementById('mainContent');
    if (!main || !category) return;

    const container = document.createElement('div');
    container.style.cssText = 'padding: 40px; max-width: 1000px; margin: 0 auto;';

    const dateObj = new Date(dateStr);
    const displayDate = dateObj.toLocaleDateString('sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const header = document.createElement('div');
    header.style.cssText = 'margin-bottom: 40px;';
    header.innerHTML = '<h1 style="font-size: 2.5em; color: #2c2416; margin: 0 0 12px 0; font-weight: 700;">' + category.name + '</h1><p style="font-size: 1.1em; color: #8b7355; margin: 0 0 8px 0;">Datum: <strong>' + displayDate + '</strong></p><button onclick="showDayContentCreator(\'' + dateStr + '\')" style="padding: 8px 16px; background: white; color: #2c2416; border: 2px solid #d4a574; border-radius: 8px; font-weight: 600; cursor: pointer;">← Välj annan</button>';
    container.appendChild(header);

    const form = document.createElement('div');
    form.style.cssText = 'background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 16px rgba(139,115,85,0.12);';

    let html = '<div style="margin-bottom: 24px;"><label style="display: block; font-weight: 600; color: #2c2416; margin-bottom: 8px;">Syfte:</label><textarea id="postPurpose" placeholder="Vad ska detta inlägg uppnå?" style="width: 100%; min-height: 80px; padding: 14px; border: 2px solid #e8dfd5; border-radius: 10px; font-family: inherit; font-size: 1em;"></textarea></div>';
    html += '<div style="margin-bottom: 24px;"><label style="display: block; font-weight: 600; color: #2c2416; margin-bottom: 8px;">Hook:</label><textarea id="postHook" placeholder="Din hook..." style="width: 100%; min-height: 100px; padding: 14px; border: 2px solid #e8dfd5; border-radius: 10px; font-family: inherit; font-size: 1em;"></textarea></div>';
    html += '<div style="margin-bottom: 24px;"><label style="display: block; font-weight: 600; color: #2c2416; margin-bottom: 8px;">Content:</label><textarea id="postContent" placeholder="Huvudinnehållet..." style="width: 100%; min-height: 200px; padding: 14px; border: 2px solid #e8dfd5; border-radius: 10px; font-family: inherit; font-size: 1em;"></textarea></div>';
    html += '<div style="margin-bottom: 24px;"><label style="display: block; font-weight: 600; color: #2c2416; margin-bottom: 8px;">CTA:</label><input type="text" id="postCTA" placeholder="Call to action..." style="width: 100%; padding: 14px; border: 2px solid #e8dfd5; border-radius: 10px; font-size: 1em;"></div>';
    html += '<button onclick="schedulePostToCalendar(\'' + dateStr + '\', \'' + categoryId + '\')" style="padding: 18px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; width: 100%; font-size: 1.1em; box-shadow: 0 3px 10px rgba(212,165,116,0.3);">📅 Schemalägg</button>';

    form.innerHTML = html;
    container.appendChild(form);
    main.appendChild(container);
}

function schedulePostToCalendar(dateStr, categoryId) {
    const purpose = document.getElementById('postPurpose').value;
    const hook = document.getElementById('postHook').value;
    const content = document.getElementById('postContent').value;
    const cta = document.getElementById('postCTA').value;

    if (!content) {
        showNotification('⚠️ Fyll i content!', 'error');
        return;
    }

    const category = POST_CATEGORIES.find(c => c.id === categoryId);
    const post = { id: 'post_' + Date.now(), date: dateStr, category: category.name, categoryId: categoryId, purpose: purpose, hook: hook, content: content, cta: cta, created: new Date().toISOString() };

    if (!scheduledPosts[dateStr]) scheduledPosts[dateStr] = [];
    scheduledPosts[dateStr].push(post);
    saveScheduledPosts();

    showNotification('✅ Post schemalagd!', 'success');
    setTimeout(() => showPage('calendar30'), 1500);
}

// ========================================================================
// UTILITIES
// ========================================================================

function showNotification(message, type) {
    const colors = { success: 'linear-gradient(135deg, #d4a574 0%, #e8c298 100%)', error: 'linear-gradient(135deg, #c89f7b 0%, #d4a574 100%)', info: 'linear-gradient(135deg, #e8c298 0%, #f5e6d3 100%)' };
    const notification = document.createElement('div');
    notification.style.cssText = 'position: fixed; top: 80px; right: 20px; background: ' + colors[type] + '; color: white; padding: 18px 28px; border-radius: 12px; box-shadow: 0 4px 16px rgba(212,165,116,0.4); z-index: 9999; font-weight: 600;';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

/* logged */


// ========================================================================
// AVATAR SELECTOR SYSTEM
// ========================================================================


// ========================================================================
// FÖRSKAPAT AVATAR-BIBLIOTEK
// ========================================================================

const PREMADE_AVATARS = [
    {
        id: 'young_professional',
        name: '👩‍💼 Ung Professionell',
        emoji: '👩‍💼',
        age: '25-34',
        gender: 'Kvinna',
        location: 'Stockholm',
        profession: 'Kontorsanställd',
        income: '400k-600k',
        pain_points: '1. Har inte tid för makeup på morgonen\n2. Vet inte vilka produkter som passar\n3. Osäker på tekniker',
        desires: '1. Se polerad ut på jobbet\n2. Snabb morgonrutin\n3. Lära sig grunderna',
        interests: 'Mode, Karriär, Fitness'
    },
    {
        id: 'busy_mom',
        name: '👩‍👧 Busy Mamma',
        emoji: '👩‍👧',
        age: '35-44',
        gender: 'Kvinna',
        location: 'Sverige',
        profession: 'Förälder + Jobb',
        income: '200k-400k',
        pain_points: '1. Ingen tid för sig själv\n2. Trötthetsfläckar och ojämn hy\n3. Prioriterar barn före egen vård',
        desires: '1. Känna sig vacker igen\n2. Snabba beauty-rutiner\n3. Känna sig självsäker',
        interests: 'Familj, Wellness, Tid-effektivitet'
    },
    {
        id: 'entrepreneur',
        name: '💼 Företagare',
        emoji: '💼',
        age: '25-34',
        gender: 'Alla',
        location: 'Stockholm/Göteborg/Malmö',
        profession: 'Egen företagare',
        income: '400k-600k+',
        pain_points: '1. Måste se professional ut hela tiden\n2. Mycket kamera-tid (möten, content)\n3. Stressad hud',
        desires: '1. Representera sitt brand väl\n2. Kamera-ready makeup\n3. Professionell look',
        interests: 'Business, Personal branding, Networking'
    },
    {
        id: 'bride_to_be',
        name: '👰 Brudtjej',
        emoji: '👰',
        age: '25-34',
        gender: 'Kvinna',
        location: 'Sverige',
        profession: 'Varierar',
        income: 'Varierar',
        pain_points: '1. Nervös för bröllops-makeup\n2. Vet inte vad som passar\n3. Vill se som sig själv (fast bättre)',
        desires: '1. Drömbröllopslook\n2. Hålla hela dagen\n3. Se stunning på bilder',
        interests: 'Bröllopsplanering, Skönhet, Fotografering'
    },
    {
        id: 'content_creator',
        name: '📱 Content Creator',
        emoji: '📱',
        age: '18-24',
        gender: 'Alla',
        location: 'Sverige',
        profession: 'Influencer/Creator',
        income: '0-200k',
        pain_points: '1. Måste se bra ut på kamera dagligen\n2. Behöver unika looks\n3. Budget-medveten',
        desires: '1. Viral-worthy makeup\n2. Signature look\n3. Växa sin följarskara',
        interests: 'Social media, Trends, Foto/Video'
    },
    {
        id: 'mature_woman',
        name: '👩 Mogen Kvinna (45+)',
        emoji: '👩',
        age: '45-54',
        gender: 'Kvinna',
        location: 'Sverige',
        profession: 'Etablerad karriär',
        income: '600k+',
        pain_points: '1. Ålderstecken (rynkor, pigmentering)\n2. Makeup sätter sig i linjer\n3. Vet inte moderna tekniker',
        desires: '1. Sofistikerad, tidlös look\n2. Lyft utan att överdriva\n3. Känna sig vacker i sin ålder',
        interests: 'Wellness, Kvalitet, Anti-aging'
    },
    {
        id: 'student',
        name: '🎓 Student',
        emoji: '🎓',
        age: '18-24',
        gender: 'Alla',
        location: 'Studentstad',
        profession: 'Student',
        income: '0-200k',
        pain_points: '1. Tajt budget\n2. Sent uppe, trötta ögon\n3. Vill experimentera',
        desires: '1. Budget-vänliga produkter\n2. Versatila looks (dag/kväll)\n3. Lära sig grunderna',
        interests: 'Mode, Socialt, Studier'
    },
    {
        id: 'makeup_enthusiast',
        name: '💄 Makeup-entusiast',
        emoji: '💄',
        age: '25-34',
        gender: 'Alla',
        location: 'Sverige',
        profession: 'Varierar',
        income: '200k-400k',
        pain_points: '1. Vill ta det till nästa nivå\n2. Söker avancerade tekniker\n3. Vill jobba som MUA',
        desires: '1. Pro-level färdigheter\n2. Bygga portfolio\n3. Starta beauty-business',
        interests: 'Makeup, Utbildning, Karriär inom beauty'
    }
];

function renderAvatarLibrary() {
    const leftCol = document.getElementById('masterLeftCol');
    if (!leftCol) return;

    const section = document.createElement('div');
    section.style.cssText = 'background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); margin-bottom: 30px;';

    let html = '<div style="margin-bottom: 24px;">';
    html += '<h3 style="color: #2c2416; margin: 0 0 8px 0; font-size: 1.5em;">🎯 Välj Din Avatar</h3>';
    html += '<p style="color: #6b5d4f; margin: 0 0 16px 0; font-size: 0.95em;">Välj en färdig avatar eller skapa din egen</p>';

    // Toggle buttons
    html += '<div style="display: flex; gap: 12px; margin-bottom: 20px;">';
    html += '<button id="avatarModeCustom" onclick="switchAvatarMode(\'custom\')" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">✏️ Skapa Egen</button>';
    html += '<button id="avatarModePremade" onclick="switchAvatarMode(\'premade\')" style="flex: 1; padding: 12px; background: #f5f1eb; color: #2c2416; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">📚 Välj Färdig</button>';
    html += '</div>';

    html += '</div>';

    // Premade avatars container
    html += '<div id="premadeAvatarsContainer" style="display: none;"></div>';

    // Custom avatar container  
    html += '<div id="customAvatarContainer"></div>';

    section.innerHTML = html;
    leftCol.insertBefore(section, leftCol.firstChild);

    // Render custom form by default
    renderCustomAvatarForm();
}

function switchAvatarMode(mode) {
    const customBtn = document.getElementById('avatarModeCustom');
    const premadeBtn = document.getElementById('avatarModePremade');
    const premadeContainer = document.getElementById('premadeAvatarsContainer');
    const customContainer = document.getElementById('customAvatarContainer');

    if (mode === 'custom') {
        customBtn.style.background = 'linear-gradient(135deg, #d4a574 0%, #e8c298 100%)';
        customBtn.style.color = 'white';
        premadeBtn.style.background = '#f5f1eb';
        premadeBtn.style.color = '#2c2416';
        premadeContainer.style.display = 'none';
        customContainer.style.display = 'block';
        renderCustomAvatarForm();
    } else {
        customBtn.style.background = '#f5f1eb';
        customBtn.style.color = '#2c2416';
        premadeBtn.style.background = 'linear-gradient(135deg, #d4a574 0%, #e8c298 100%)';
        premadeBtn.style.color = 'white';
        premadeContainer.style.display = 'block';
        customContainer.style.display = 'none';
        renderPremadeAvatars();
    }
}

function renderPremadeAvatars() {
    const container = document.getElementById('premadeAvatarsContainer');
    if (!container) return;

    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">';

    PREMADE_AVATARS.forEach(avatar => {
        html += '<div style="padding: 20px; border: 2px solid #e5d4c1; border-radius: 12px; cursor: pointer; transition: all 0.2s;" onclick="selectPremadeAvatar(\'' + avatar.id + '\')" onmouseenter="this.style.borderColor=\'#d4a574\'; this.style.background=\'#faf8f5\';" onmouseleave="this.style.borderColor=\'#e5d4c1\'; this.style.background=\'white\';">';
        html += '<div style="font-size: 2.5em; text-align: center; margin-bottom: 12px;">' + avatar.emoji + '</div>';
        html += '<h4 style="margin: 0 0 8px 0; color: #2c2416; text-align: center;">' + avatar.name + '</h4>';
        html += '<div style="font-size: 0.85em; color: #6b5d4f;">';
        html += '<div><strong>Ålder:</strong> ' + avatar.age + '</div>';
        html += '<div><strong>Yrke:</strong> ' + avatar.profession + '</div>';
        html += '</div>';
        html += '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
}

function selectPremadeAvatar(avatarId) {
    const avatar = PREMADE_AVATARS.find(a => a.id === avatarId);
    if (!avatar) return;

    // Set current avatar
    currentAvatar = {
        age: avatar.age,
        gender: avatar.gender,
        location: avatar.location,
        profession: avatar.profession,
        income: avatar.income,
        pain_points: avatar.pain_points,
        desires: avatar.desires,
        interests: avatar.interests
    };

    // Save
    localStorage.setItem('linnartistry_avatar', JSON.stringify(currentAvatar));

    // Show notification
    const notification = document.createElement('div');
    notification.style.cssText = 'position: fixed; top: 80px; right: 20px; background: linear-gradient(135deg, #5cb85c 0%, #7bc77b 100%); color: white; padding: 16px 24px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 9999; font-weight: 600;';
    notification.innerHTML = avatar.emoji + ' Avatar sparad: ' + avatar.name;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

function renderCustomAvatarForm() {
    const container = document.getElementById('customAvatarContainer');
    if (!container) return;

    let html = '';

    AVATAR_QUESTIONS.forEach(q => {
        html += '<div style="margin-bottom: 20px;">';
        html += '<label style="display: block; font-weight: 600; color: #2c2416; margin-bottom: 8px;">' + q.question + '</label>';

        if (q.type === 'select') {
            html += '<select id="avatar_' + q.id + '" style="width: 100%; padding: 12px; border: 2px solid #e5d4c1; border-radius: 8px; font-size: 1em;">';
            html += '<option value="">Välj...</option>';
            q.options.forEach(opt => {
                html += '<option value="' + opt + '">' + opt + '</option>';
            });
            html += '</select>';
        } else if (q.type === 'textarea') {
            html += '<textarea id="avatar_' + q.id + '" placeholder="' + q.placeholder + '" style="width: 100%; min-height: 100px; padding: 12px; border: 2px solid #e5d4c1; border-radius: 8px; font-size: 1em; font-family: inherit;"></textarea>';
        } else {
            html += '<input type="text" id="avatar_' + q.id + '" placeholder="' + q.placeholder + '" style="width: 100%; padding: 12px; border: 2px solid #e5d4c1; border-radius: 8px; font-size: 1em;">';
        }

        html += '</div>';
    });

    html += '<button onclick="saveAvatar()" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; font-weight: 700; font-size: 1em; cursor: pointer;">✅ Spara Avatar</button>';

    container.innerHTML = html;

    // Load saved values
    loadAvatar();
}

/* avatar library loaded */


const AVATAR_QUESTIONS = [
    {
        id: 'age',
        question: 'Hur gammal är din avatar?',
        type: 'select',
        options: ['18-24', '25-34', '35-44', '45-54', '55+']
    },
    {
        id: 'gender',
        question: 'Kön?',
        type: 'select',
        options: ['Kvinna', 'Man', 'Icke-binär', 'Alla']
    },
    {
        id: 'location',
        question: 'Var bor din avatar?',
        type: 'text',
        placeholder: 'T.ex. Stockholm, Sverige'
    },
    {
        id: 'profession',
        question: 'Yrke/Sysselsättning?',
        type: 'text',
        placeholder: 'T.ex. Företagare, Anställd, Student'
    },
    {
        id: 'income',
        question: 'Inkomstnivå?',
        type: 'select',
        options: ['0-200k', '200k-400k', '400k-600k', '600k+', 'Vet ej']
    },
    {
        id: 'pain_points',
        question: 'Största utmaningar/problem? (3 stycken)',
        type: 'textarea',
        placeholder: '1. Har inte tid att...\n2. Vet inte hur man...\n3. Känner mig...'
    },
    {
        id: 'desires',
        question: 'Drömmar/Mål? (3 stycken)',
        type: 'textarea',
        placeholder: '1. Vill uppnå...\n2. Drömmer om att...\n3. Längtar efter...'
    },
    {
        id: 'interests',
        question: 'Intressen/Hobbies?',
        type: 'text',
        placeholder: 'T.ex. Mode, Träning, Resor'
    }
];

let currentAvatar = {
    age: '',
    gender: '',
    location: '',
    profession: '',
    income: '',
    pain_points: '',
    desires: '',
    interests: ''
};

function renderAvatarSelector_OLD() {
    const leftCol = document.getElementById('masterLeftCol');
    if (!leftCol) return;

    const section = document.createElement('div');
    section.style.cssText = 'background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); margin-bottom: 30px;';

    let html = '<div style="margin-bottom: 24px;">';
    html += '<h3 style="color: #2c2416; margin: 0 0 8px 0; font-size: 1.5em;">🎯 Välj Din Avatar</h3>';
    html += '<p style="color: #6b5d4f; margin: 0; font-size: 0.95em;">Definiera vem du skapar content för</p>';
    html += '</div>';

    AVATAR_QUESTIONS.forEach(q => {
        html += '<div style="margin-bottom: 20px;">';
        html += '<label style="display: block; font-weight: 600; color: #2c2416; margin-bottom: 8px;">' + q.question + '</label>';

        if (q.type === 'select') {
            html += '<select id="avatar_' + q.id + '" style="width: 100%; padding: 12px; border: 2px solid #e5d4c1; border-radius: 8px; font-size: 1em;">';
            html += '<option value="">Välj...</option>';
            q.options.forEach(opt => {
                html += '<option value="' + opt + '">' + opt + '</option>';
            });
            html += '</select>';
        } else if (q.type === 'textarea') {
            html += '<textarea id="avatar_' + q.id + '" placeholder="' + q.placeholder + '" style="width: 100%; min-height: 100px; padding: 12px; border: 2px solid #e5d4c1; border-radius: 8px; font-size: 1em; font-family: inherit;"></textarea>';
        } else {
            html += '<input type="text" id="avatar_' + q.id + '" placeholder="' + q.placeholder + '" style="width: 100%; padding: 12px; border: 2px solid #e5d4c1; border-radius: 8px; font-size: 1em;">';
        }

        html += '</div>';
    });

    html += '<button onclick="saveAvatar()" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; font-weight: 700; font-size: 1em; cursor: pointer;">✅ Spara Avatar</button>';

    section.innerHTML = html;
    leftCol.insertBefore(section, leftCol.firstChild);
}

function saveAvatar() {
    AVATAR_QUESTIONS.forEach(q => {
        const el = document.getElementById('avatar_' + q.id);
        if (el) {
            currentAvatar[q.id] = el.value;
        }
    });

    // Save to localStorage
    localStorage.setItem('linnartistry_avatar', JSON.stringify(currentAvatar));

    // Show success notification
    const notification = document.createElement('div');
    notification.style.cssText = 'position: fixed; top: 80px; right: 20px; background: linear-gradient(135deg, #5cb85c 0%, #7bc77b 100%); color: white; padding: 16px 24px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 9999; font-weight: 600;';
    notification.textContent = '✅ Avatar sparad!';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function loadAvatar() {
    const saved = localStorage.getItem('linnartistry_avatar');
    if (saved) {
        currentAvatar = JSON.parse(saved);

        // Populate fields
        AVATAR_QUESTIONS.forEach(q => {
            const el = document.getElementById('avatar_' + q.id);
            if (el && currentAvatar[q.id]) {
                el.value = currentAvatar[q.id];
            }
        });
    }
}

function getAvatarSummary() {
    if (!currentAvatar.age) return '';

    return `${currentAvatar.age} år, ${currentAvatar.gender}, ${currentAvatar.profession}`;
}

/* logged */


const CONTENT_PILLARS = {
    'self-help': {
        name: 'Self help',
        icon: '💪',
        color: '#90c695',
        subcategories: {
            mindset: {
                name: 'Mindset',
                topics: ['Självkänsla', 'Transformation', 'Självbild', 'Begränsande tankar', 'Självförtroende', 'Positivt tänkande']
            },
            produktivitet: {
                name: 'Produktivitet',
                topics: ['Tidsplanering', 'Fokus', 'Måltips', 'Rutiner', 'Vanor', 'Effektivitet']
            },
            utveckling: {
                name: 'Personlig utveckling',
                topics: ['Självkännedom', 'Tillväxt', 'Lärande', 'Karriär', 'Kompetens', 'Vision']
            }
        }
    },
    'self-care': {
        name: 'Self care',
        icon: '<svg class="icon"><use href="#icon-sparkles"></use></svg>',
        color: '#d4a574',
        subcategories: {
            skönhet: {
                name: 'Skönhet',
                topics: ['Makeup', 'Hudvård', 'Hårvård', 'Produkter', 'Tekniker', 'Styling']
            },
            wellness: {
                name: 'Wellness',
                topics: ['Hälsa', 'Sömn', 'Energi', 'Balans', 'Avkoppling', 'Me-time']
            },
            rutiner: {
                name: 'Rutiner',
                topics: ['Morgonrutin', 'Kvällsrutin', 'Skin care rutin', 'Self care tips', 'Ritualer', 'Daglig omsorg']
            }
        }
    },
    'self-growth': {
        name: 'Self growth',
        icon: '🌟',
        color: '#a8dadc',
        subcategories: {
            företagande: {
                name: 'Företagande',
                topics: ['Affärsutveckling', 'Marknadsföring', 'Strategi', 'Kundfokus', 'Försäljning', 'Tillväxt']
            },
            ekonomi: {
                name: 'Ekonomi',
                topics: ['Pengar', 'Investering', 'Sparande', 'Abundance mindset', 'Ekonomisk frihet', 'Budgetering']
            },
            livsstil: {
                name: 'Livsstil',
                topics: ['Drömmar och mål', 'Vision', 'Manifestering', 'Lifestyle design', 'Värderingar', 'Balans']
            }
        }
    },
    'min-story': {
        name: 'Min Story',
        icon: '💖',
        color: '#ff8e53',
        subcategories: {
            personligt: {
                name: 'Personligt',
                topics: ['Min resa', 'Bakom kulisserna', 'Tankar', 'Erfarenheter', 'Lärdomar', 'Livet just nu']
            },
            transformation: {
                name: 'Transformation',
                topics: ['Före/efter', 'Förändringar', 'Utveckling', 'Utmaningar', 'Framsteg', 'Milstolpar']
            },
            inspiration: {
                name: 'Inspiration',
                topics: ['Vad inspirerar mig', 'Favoriter', 'Rekommendationer', 'Upptäckter', 'Insights', 'Aha-moment']
            }
        }
    }
};

const CONTENT_LIBRARY = {
    story: [
        {
            title: "Min transformation som företagare",
            category: "Min Story",
            text: `För två år sedan hade jag ingen business. På 4 månader har jag vågat tänka större, hittat insikter i hur jag ska marknadsföra mig, zoomat in på vad det är jag vill göra, vad mitt mission är. Jag har tagit flera viktiga steg för att komma närmare mitt mål. Jag kommer fortsätta gå i rätt riktning och våga ta större steg.`
        },
        {
            title: "Vad jag fastnar i",
            category: "Min Story",
            text: `Jag fastnar i tänkandedelen, att jag tänker på allt jag ska göra men det blir väldigt små steg framåt. Det jag lärt mig är att många gör samma resa och att det kanske är en naturlig del på vägen. När det gäller min målgrupp så fastnar jag i att inte veta hur jag ska nå ut till dem.`
        },
        {
            title: "Min största insikt",
            category: "Min Story",
            text: `Det som har förändrats för mig är att jag insett hur många jag kan hjälpa genom att göra materialet tillgängligt och lättsmält. Jag har fått en ny syn på hur mitt liv kan se ut. Vilka möjligheter som finns och att det kommer finnas en plats för mig, jag kommer skapa den och det kommer vara attraktivt för massor av kunder i min målgrupp.`
        },
        {
            title: "Mitt bästa misstag",
            category: "Lärande",
            text: `Det misstag jag gjort som jag är glad över för det lärde mig nåt är att försöka få ihop allt utan en plan och struktur. Jag måste anpassa mig efter att världen ser ut på ett visst sätt där jag för att kunna nå mina resultat måste följa med strömmen till viss del. Jag kommer att skapa mitt unika innehåll och göra det på mitt sätt, för det är så jag vet att kunder relaterar till mig och lär sig av.`
        },
        {
            title: "Vad som inte syns på sociala medier",
            category: "BTS - Low Intensity",
            text: `Ett ögonblick i mitt företagande som inte syns i socmed men som säger mycket om mig som entreprenör: Att jag försöker hålla igång allt samtidigt. Att jag är väldigt kreativ men det kommer inte ut, eller inte syns på rätt sätt. Jag vet att jag måste skapa en plan för mig själv. Jag behöver skapa struktur.`
        },
        {
            title: "Att ta hjälp är styrka",
            category: "Lärande",
            text: `Jag har också lärt mig att det alltid finns vissa svagheter man har och att det är helt ok att våga ta hjälp. Jag kommer också automatisera så mycket som möjligt.`
        }
    ],
    dreamclient: [
        {
            title: "Vad drömmer min drömkund om - egentligen?",
            category: "Drömkunden",
            text: `Hon vill titta sig i spegeln och gilla vad hon ser. Hon vill kunna gå in i ett rum och känna att hon är den snyggaste där. Hon känner sig trygg och självsäker. Hon går efter det hon vill ha, hon tvekar inte att säga vad hon tycker när hon blir tillfrågad, även utan att bli tillfrågad, hon håller på att bygga drömversionen av sig själv. 

Hon har kämpat och slitit, satt andra före sig själv och nu kan hon gå sin egna väg, oavsett vem som följer med på den eller vem som stöttar henne. Hon vet inte allt än och hon är inte framme, men hon är nära. Så nära man någonsin kan komma. Hon har skapat sin väg framåt.`
        },
        {
            title: "Vad håller henne tillbaka?",
            category: "Drömkunden",
            text: `Idag ser hon inte sin potential, hon vet att hon vill mycket, hon blir avundsjuk, men också glad för andras framgång men vill så gärna vara där själv, men hon ser inte tydligt framför sig vad hon behöver göra. Hon känner att hon har verkliga anledningar till varför hon inte kan vara lika framgångsrik som de, hon har barn eller är gift och känner sig blockerad, har hinder som står i vägen.`
        },
        {
            title: "Likheter mellan hennes drömmar och mina",
            category: "Drömkunden",
            text: `Hon är jag för 2 år sedan. Hon drömmer om att jobba för att det är kul, att skapa något som betyder något för människor, att förändra deras liv. Hon vill vara respekterad, köpa dyra kläder och styla sig rätt, hon vill vara snygg och eftertraktad. Hon vill känna, och ha en mening med livet.

Våga mer, våga testa nya saker, våga vara dålig. Sänka pressen på dig själv.`
        },
        {
            title: "Hur jag hjälper henne",
            category: "Drömkunden",
            text: `Jag hjälper henne genom att bistå med mina egna erfarenheter, jag kan berätta för henne vad hon behöver göra för att jag själv har varit där. Jag kan i egenskap som makeupartist och world traveller bidra med mitt synsätt, jag kan hjälpa henne se sig själv med nya ögon. 

Ge konkreta produkter som hjälper henne att ta de nödvändiga stegen för att ta sig i mål, och steg för steg stötta henne i varje beslut som känns för stort, som känns för läskigt för att ta egentligen. Jag kan lära henne hur hon kan göra.`
        },
        {
            title: "Vad ska hon känna efter mina inlägg?",
            category: "Drömkunden",
            text: `Jag vill att hon ska inse att hon begränsat sig själv, att hon faktiskt inte vågat drömma så stort som trott och som hon skulle vilja. Hon ska känna hopp, mod och inspiration. Att hon nu kan påbörja sin förvandling för hon har hittat det hon behöver för att se stegen hon behöver ta. 

Hon har hittat någon som kan vara hennes sanna spegel, hon kan med min hjälp börja jobba med sig själv. Hon ska tänka om vad gäller hennes styling, inse att det är viktigt för hennes framtoning.`
        }
    ],
    questions: [
        {
            title: "Hur ser problem ut för min målgrupp (smink)?",
            category: "Lärande",
            text: `Jag ser många gap, kvinnor vet inte tillräckligt om makeup och hur huden och kroppen fungerar för att förstå hur och vilka produkter de ska använda. Om du inte vet hur du ska anpassa en makeup efter dig själv så kommer allt du ser andra göra kännas out of reach, ouppnåeligt. Du lägger ribban för högt och det slutar med att du inte gör nåt alls.

Du känner hur ditt ansikte ser ut och fungerar bäst, lär dig hur du tar inspiration från det du ser andra göra och anpassar det efter dig.`
        },
        {
            title: "Safe choices jag gjort och kan skratta åt",
            category: "Lärande",
            text: `Jag har inte vågat lyssna på mig själv, men jag trodde att jag gjorde det.

Så här förändrar du ditt liv: sitt i tystnad, för dig själv, helt utan distraktioner. Det kan vara på vilken plats som helst du känner dig trygg. Lägg en hand på ditt hjärta och bara sitt med dig själv. Tänk att du ska lyssna på någon du har kär, vänta på att få höra vad den vill dela med dig. Sitt så länge det behövs.`
        },
        {
            title: "Vad borde fler våga prata om i min bransch?",
            category: "Reach - Trendande",
            text: `Hur skönhetsidealen påverkar människorna i samhället, med fokus på de äldre. Vi får så ofta höra om ungas dåliga mående, och det ska absolut inte förringas. Men hur är det med de äldre kvinnorna?

De som knappt syns i media, de som förpassas som äldre och därför ska ha lagt livet på hyllan. De ska vara nöjda med det de gjort, det de lärt sig och inte begära mer. De ska bli en mormor och farmor och det ska räcka. Men tänk om du ger dig själv samma möjlighet att skapa ditt liv.`
        },
        {
            title: "Om du visste att du skulle nå ditt försäljningsmål",
            category: "Min Story",
            text: `Jag skulle vara mer avslappnad, jag skulle inte titta på min dator eller mobil, jag skulle gå ut och leva livet. Så vad stoppar dig från att leva livet ändå?

Vad stoppar dig egentligen från att leva ditt liv som du vill? Det är bara du som kan styra hur ditt liv ska se ut, alla de du ser upp till som lever sitt drömliv har varit i samma position som du. Men de bestämde sig för att inte låta drömmarna bli liggandes i en ouppackad låda. 

De gjorde plats på livets bokhylla och placerade drömmarna i ögonhöjd, med ansvar och måsten närliggande, och allt som stoppar dem längst ner. Tittar på drömmarna varje dag för att påminna sig själv om vad det är de bär inom sig.`
        },
        {
            title: "Råd jag aldrig skulle ge min drömkund",
            category: "Lärande",
            text: `Jag har försökt passa in, att anpassa mig själv efter hur andra gjorde och vad de tyckte var rätt. Den enda rätta vägen att gå är att vara sig själv.

Svart passar alltid och gör att du ser stilren och smal ut. FEL, det framhäver dig inte, det gömmer dig. Du smälter in i bakgrunden istället för att vara huvudmotivet. Du ska ju vara the main lead!

Ett råd jag fått är att du måste göra en sak i taget. Men det går att göra flera saker samtidigt, om du har passionen för det så kommer det gå.`
        },
        {
            title: "Om din drömkund väntar 6 månader",
            category: "Reach - Trendande",
            text: `Du kommer fortsätta i samma hjulspår, samma frustrationer och tappa all den här tiden när du kunde ha påbörjat din glow up tidigare. Jag önskar att jag hade börjat tidigare, att jag hade tagit hjälp tidigare. 

Så nu uppmanar jag istället dig att inte vänta, starta NU för att du kommer kunna tacka dig själv snabbare. Du kommer ha tappat all den här tiden och nu IDAG kunde du varit nära ditt drömliv.`
        },
        {
            title: "Vad gör mest ont att se?",
            category: "Drömkunden",
            text: `Det som gör mest ont att se är absolut att de inte gör nåt alls, som oftast kommer från att de inte vet vad som är fel. Att de känner att nåt skaver, det känns inte riktigt rätt. De känner sig efter, olycklig, missnöjd med sig själv eller sitt liv. 

De ska ta på sig nåt ur garderoben eller försöka sminka sig och det blir inte rätt. De vill förändra men vet inte var de ska börja. De försöker sminka sig men fastnar alltid och slutar med att de inte vill gå ut eller göra det de vill göra för att de inte får till sminket eller vad de ska ha på sig. De känner sig ful.`
        },
        {
            title: "Självklar grej jag slutat göra",
            category: "Lärande",
            text: `Jag ser många som vill sminka sig på samma sätt som varandra, man följer trender. Detta är nåt jag aldrig gjort, och det är så skönt att gå min egna väg. Att ha ett unikt utseende. Jag ville operera näsan. 

Att våga testa nåt som känns ovant och utanför sin comfortzone, för att det leder till utveckling. Jag har inte fastnat i en version av mig själv, jag har inte låst min identitet till ett yrke, en relation eller en plats.`
        },
        {
            title: "Tråkigaste rådet kunder får",
            category: "Reach - Trendande",
            text: `Att de får frågan hos en frisör, vad vill du göra? Eller ska handla smink och får frågan hur brukar du göra? Ibland behöver du bortse totalt från hur du brukar göra och har gjort, eller vad du tror du vill. 

För att verkligen utvecklas och förändras om du inte vet var du ska börja behöver du ta hjälp av nån som inte försöker vara dig till lags, utan nån som verkligen vill se dig lyckas och bli ditt bästa jag.`
        },
        {
            title: "Vad alla borde sluta låtsas om på Instagram",
            category: "Reach - Trendande",
            text: `Att det är normalt att alltid ha nya kläder/produkter/vara fixad. Att ha 14 steg hudvård. Att dyra produkter är bättre. Eller andra änden av spektrumet, att vilka billiga produkter som helst är okej att använda. 

Att inte ta hänsyn till ingredienser, tillverkning eller ursprungsland i förhållande till marknad. Att du ska vara superfixad varje dag, eller att det inte spelar någon roll om du går ut fixad eller inte, "var bara dig själv" blir till att du bara har en tvål du tvättar allt med och inte tar om ditt utseende.`
        }
    ],
    meriter: [
        {
            title: "Mina meriter som är tillgång för kunder",
            category: "Lärande",
            text: `Jag har gått makeuputbildning så du slipper. Jag har läst dessa böcker så du inte behöver.`
        }
    ]
};

const CATEGORIES = [
    { id: 1, name: 'Min Story', day: 'Måndag', description: 'Personlig transformation och resa' },
    { id: 2, name: 'BTS - Low Intensity', day: 'Tisdag', description: 'Bakom kulisserna, lågintensivt' },
    { id: 3, name: 'Lärande', day: 'Onsdag', description: 'Dela kunskap och insikter' },
    { id: 4, name: 'Reach - nåt trendande', day: 'Torsdag', description: 'Trending topics för räckvidd' },
    { id: 5, name: 'Bryta ner ett ämne - karusell', day: 'Fredag', description: 'Djupdyk i ämne via karusell' },
    { id: 6, name: 'Low effort förtroende', day: 'Lördag', description: 'Enkelt content som bygger förtroende' },
    { id: 7, name: 'Djup - långt videoformat', day: 'Söndag', description: 'Långformat video, djupgående' }
];

let posts = JSON.parse(localStorage.getItem('contentPosts')) || {};
let currentPage = 'overview';
let currentFilter = 'all';
let trends = JSON.parse(localStorage.getItem('trends')) || [];
let inspirationNotes = JSON.parse(localStorage.getItem('inspirationNotes')) || [];
let strategyAnswers = JSON.parse(localStorage.getItem('strategyAnswers')) || {};
let dreamCustomerAnswers = JSON.parse(localStorage.getItem('dreamCustomerAnswers')) || {};
let currentMedia = []; // Array to store uploaded media for current post

const STRATEGY_QUESTIONS = {
    foundation: {
        title: '<svg class="icon"><use href="#icon-target"></use></svg> Grunden - Definiera din strategi',
        icon: '<svg class="icon"><use href="#icon-target"></use></svg>',
        color: '#d4a574',
        questions: [
            'Vad efterfrågar dina följare konkret just nu?',
            'Vilka återkommande frågor får du i DM eller kommentarer?',
            'Vilka teman engagerar mest i din nisch?',
            'Vad inspirerar din drömkund att fortsätta följa dig?',
            'Vilken kunskap sitter du på som de inte hittar någon annanstans?'
        ]
    },
    brand: {
        title: '<svg class="icon"><use href="#icon-sparkles"></use></svg> Varumärke - Vad vill du bli förknippad med?',
        icon: '<svg class="icon"><use href="#icon-sparkles"></use></svg>',
        color: '#b8956a',
        questions: [
            'Vilket huvudområde ska du bli top-of-mind inom?',
            'Vilken känsla vill du att ditt varumärke ska förmedla?',
            'Vilka kärnteman vill du stå för långsiktigt?',
            'Vad är det första du vill att en ny kund tänker när de hör ditt namn?',
            'Vilket expertområde ska alltid vara centralt i ditt content?'
        ]
    },
    offers: {
        title: '<svg class="icon" style="color: #d4a574;"><use href="#icon-target"></use></svg> Erbjudanden - Vad vill du sälja?',
        icon: '<svg class="icon" style="color: #d4a574;"><use href="#icon-target"></use></svg>',
        color: '#90c695',
        questions: [
            'Vilka av dina produkter/tjänster ska du driva trafik till?',
            'Vilket innehåll hjälper följaren att förstå värdet av dina erbjudanden?',
            'Vad behöver din kund veta för att känna sig redo att köpa?',
            'Vilka delar av din expertis stärker konverteringen?',
            'Vad måste du synliggöra för att skapa köplust?'
        ]
    },
    education: {
        title: '<svg class="icon"><use href="#icon-book"></use></svg> Kunskap - Educational pillar',
        icon: '<svg class="icon"><use href="#icon-book"></use></svg>',
        color: '#a8dadc',
        questions: [
            'Vilka tekniker, metoder, principer eller "hemligheter" kan du lära ut?',
            'Vilka vanliga misstag gör din kund — och hur undviker de dem?',
            'Vad behöver de förstå för att lyckas bättre?',
            'Vilka steg-för-steg-metoder kan du bryta ned?',
            'Vad inom din expertis är tidlös kunskap som du kan återanvända ofta?'
        ]
    },
    community: {
        title: '👥 Community & Social Proof',
        icon: '👥',
        color: '#ff8e53',
        questions: [
            'Vad kan du visa bakom kulisserna som bygger relation och förtroende?',
            'Vilka transformationshistorier, före/efter eller kundresor kan du dela?',
            'Hur kan du lyfta fram din community och visa tillhörighet?',
            'Vilka moment i din vardag (studio, process, skapande) stärker relationen?',
            'Vad skapar känslan av "jag vill vara en del av hennes värld"?'
        ]
    },
    conversion: {
        title: '🎁 Konvertering - Från följare till kund',
        icon: '🎁',
        color: '#ff6b6b',
        questions: [
            'Vilka konkreta erbjudanden behöver du förklara mer i detalj?',
            'Hur kan du skapa värde samtidigt som du naturligt leder mot köp?',
            'Vilka funktioner, moduler eller resultat i din kurs/produkt kan visas upp?',
            'Vad måste kunden se för att förstå varför priset är rimligt?',
            'Vilka invändningar kan du avslå direkt genom ditt content?'
        ]
    },
    advanced: {
        title: '<svg class="icon" style="color: #d4a574;"><use href="#icon-target"></use></svg> Avancerad strategi',
        icon: '<svg class="icon" style="color: #d4a574;"><use href="#icon-target"></use></svg>',
        color: '#9b59b6',
        questions: [
            'Vad är ditt huvudlöfte för året? Vilken transformation ska allt content peka mot?',
            'Vem är din drömkund idag, och vem vill hon utvecklas till?',
            'Vad vill hon känna? Vad vill hon slippa känna?',
            'Vad undervisar ingen tillräckligt bra i din nisch? Vilket perspektiv saknas?',
            'Vilka tre områden kan du ta absolut expertposition inom?'
        ]
    },
    pillars: {
        title: '🏛️ Dina Content Pillars',
        icon: '🏛️',
        color: '#d4a574',
        questions: [
            'Kunskap: Vad behöver min drömkund förstå för att nå sin transformation?',
            'Förtroende & Community: Vad kan jag visa som bygger relation, social proof och identitet?',
            'Erbjudande & Konvertering: Vilket innehåll leder naturligt till köp?',
            'Personlighet & Story: Vad gör mig mänsklig och relaterbar?',
            'Lifestyle & Vision: Vad representerar min värld, mina värderingar och framtidsvision?',
            'Transformationsresor: Vilka före/efter, processer eller kundcase kan jag dela?'
        ]
    }
};

const DREAMCUSTOMER_QUESTIONS = {
    karnlofte: {
        title: '<svg class="icon"><use href="#icon-target"></use></svg> Sektion 1: Ditt kärnlöfte',
        icon: '<svg class="icon"><use href="#icon-target"></use></svg>',
        color: '#d4a574',
        questions: [
            'Om du bara kunde lova ETT huvudresultat till din kund, vad skulle det vara? Föreställ dig att du har 10 sekunder på dig att förklara för en främling varför de ska arbeta med dig eller köpa din produkt. Vilket är det största och mest attraktiva resultatet de får?'
        ]
    },
    malgrupp: {
        title: '👥 Sektion 2: Din målgrupp',
        icon: '👥',
        color: '#90c695',
        questions: [
            'Beskriv din ideala kund i detalj. Vem är hon? Beskriv ålder, arbete, livsstil, personlighet, värderingar, vanor och vad hon bryr sig om. Vad läser hon, tittar på eller lyssnar på?',
            'Vilket är det största problemet du hjälper henne att lösa? Om hon satt på ett café med en nära vän och berättade om sin största frustration – vad skulle hon säga?',
            'Vad är det mest frustrerande eller känslomässigt svåra med problemet? Får det henne att känna sig generad, hopplös, arg, stressad eller misslyckad?',
            'Hur påverkar problemet andra delar av hennes liv? Påverkar det hennes hälsa, sömn, relationer eller självförtroende? Beskriv följdeffekterna.'
        ]
    },
    bradska: {
        title: '<svg class="icon" style="color: #d4a574;"><use href="#icon-sparkles"></use></svg> Sektion 3: Brådska och insats',
        icon: '<svg class="icon" style="color: #d4a574;"><use href="#icon-sparkles"></use></svg>',
        color: '#ff6b6b',
        questions: [
            'Varför ska hon agera nu istället för senare? Om hon säger "jag ska tänka på det" – vad skulle du säga för att få henne att agera?',
            'Vad är risken om hon väntar? Kommer problemet att förvärras? Blir det dyrare att lösa?',
            'Vad är värsta scenariot om hon aldrig löser problemet? Föreställ dig fem år framåt om ingenting förändras. Hur ser hennes liv ut då?',
            'Vad är det bästa som kan hända om hon löser problemet? Beskriv drömresultatet. Vad blir möjligt för henne då?'
        ]
    },
    bevis: {
        title: '<svg class="icon"><use href="#icon-sparkles"></use></svg> Sektion 4: Bevis och trovärdighet',
        icon: '<svg class="icon"><use href="#icon-sparkles"></use></svg>',
        color: '#a8dadc',
        questions: [
            'Vilka specifika fakta, siffror eller resultat bevisar att ditt erbjudande fungerar? Exempel: antal personer du hjälpt, tid sparad, pengar tjänade, resultat uppnådda.',
            'Vilken trovärdighet har du? Kvalifikationer, erfarenhetsår, personliga framgångar, press, kunder, case eller egna transformationer.',
            'Har du några riktiga kundrecensioner? Kopiera exakt som de är skrivna. Namn eller ort stärker trovärdigheten.'
        ]
    },
    sprak: {
        title: '💬 Sektion 5: Språk och kontakt',
        icon: '💬',
        color: '#ff8e53',
        questions: [
            'Vilka ord eller fraser använder kunder för att beskriva sitt problem? Hämta från DM, email, recensioner eller samtal.',
            'Vad vill de egentligen, bortom det uppenbara? Det verkliga målet är ofta något djupare – exempelvis känna sig attraktiv, trygg eller mer närvarande.',
            'Finns det en gemensam fiende eller frustration? Dålig service, höga priser, "quick fixes", oseriösa aktörer, trender som lurar dem?'
        ]
    },
    bakgrund: {
        title: '<svg class="icon"><use href="#icon-book"></use></svg> Sektion 6: Din bakgrund och personlighet',
        icon: '<svg class="icon"><use href="#icon-book"></use></svg>',
        color: '#9b59b6',
        questions: [
            'Vad är din personliga eller företagshistoria? Vad fick dig att börja? Vilka vändpunkter har format dig?',
            'Vilka värderingar styr ditt arbete? Varför är de viktiga?',
            'Hur vill du låta för din publik? Inspirerande, varm, direkt, trygg, professionell, självsäker eller som en vän?'
        ]
    },
    erbjudande: {
        title: '🎁 Sektion 7: Ditt erbjudande',
        icon: '🎁',
        color: '#d4a574',
        questions: [
            'Förklara din lösning steg för steg på enkel svenska. Som om du förklarar för ett barn.',
            'Vad gör ditt arbetssätt bättre eller annorlunda? Snabbare, enklare, tryggare, mer personligt, bättre resultat?',
            'Lista allt kunden får när hon köper av dig. Även bonusar, mallar, support, grupper, videos m.m.'
        ]
    },
    invandningar: {
        title: '🤔 Sektion 8: Invändningar och trygghet',
        icon: '🤔',
        color: '#e67e22',
        questions: [
            'Vilka är de tre vanligaste invändningarna från potentiella kunder?',
            'Hur svarar du på varje invändning? Ge konkreta svar.',
            'Erbjuder du garanti eller trygg testperiod? Beskriv den.'
        ]
    },
    forsta_steg: {
        title: '<svg class="icon" style="color: #d4a574;"><use href="#icon-target"></use></svg> Sektion 9: Första steg och snabba vinster',
        icon: '<svg class="icon" style="color: #d4a574;"><use href="#icon-target"></use></svg>',
        color: '#3498db',
        questions: [
            'Vad är det första som händer efter köp? Beskriv hela processen.',
            'Vilket snabbt synligt resultat kan de få inom timmar/dagar? Ge konkreta exempel.'
        ]
    },
    ton: {
        title: '<svg class="icon"><use href="#icon-sparkles"></use></svg> Sektion 10: Ton och uttryck',
        icon: '<svg class="icon"><use href="#icon-sparkles"></use></svg>',
        color: '#2ecc71',
        questions: [
            'Vilka fraser, uttryck eller "typiska grejer du säger" återkommer ofta?',
            'Vilka ämnen, hobbies eller referenser använder du i dina inlägg?',
            'Något annat viktigt om din ton, stil eller personlighet?'
        ]
    }
};

// Speech Recognition setup
let recognition = null;
let isRecording = false;
let currentTextarea = null;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'sv-SE';
}

function initializePosts() {
    CATEGORIES.forEach(cat => {
        if (!posts[cat.id]) posts[cat.id] = [];
    });
    savePosts();
}

// Media Upload Functions
function handleMediaUpload(event) {
    const files = Array.from(event.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB

    files.forEach(file => {
        if (file.size > maxSize) {
            showNotification('⚠️ Fil för stor: ' + file.name + ' (max 10MB)', 'info');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const mediaItem = {
                type: file.type.startsWith('video') ? 'video' : 'image',
                data: e.target.result,
                name: file.name
            };

            currentMedia.push(mediaItem);
            renderMediaPreview();
        };
        reader.readAsDataURL(file);
    });
}

function renderMediaPreview() {
    const preview = document.getElementById('mediaPreview');
    if (!preview) return;

    preview.innerHTML = currentMedia.map((media, index) => `
                <div class="media-item">
                    ${media.type === 'video' ?
            `<video src="${media.data}" controls></video>` :
            `<img src="${media.data}" alt="${media.name}">`
        }
                    <button 
                        type="button"
                        class="media-item-remove" 
                        onclick="removeMedia(${index})"
                        title="Ta bort"
                    >×</button>
                    <div class="media-type-badge">
                        ${media.type === 'video' ? '🎥 Video' : '📸 Bild'}
                    </div>
                </div>
            `).join('');
}

function removeMedia(index) {
    currentMedia.splice(index, 1);
    renderMediaPreview();
}

function renderPostMedia(post) {
    if (!post.media || post.media.length === 0) return '';

    return `
                <div style="margin-bottom: 15px;">
                    <strong style="color: #3d3326;">📸 Media (${post.media.length}):</strong>
                    <div class="media-preview" style="margin-top: 10px;">
                        ${post.media.map(item => `
                            <div class="media-item">
                                ${item.type === 'video' ?
            `<video src="${item.data}" controls style="width: 100%; border-radius: 8px;"></video>` :
            `<img src="${item.data}" alt="${item.name}" style="width: 100%; border-radius: 8px;">`
        }
                                <div class="media-type-badge">
                                    ${item.type === 'video' ? '🎥' : '📸'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
}

function savePosts() {
    localStorage.setItem('contentPosts', JSON.stringify(posts));
}

function toggleMobileMenu() {
    document.getElementById('sidebar').classList.toggle('open');
}

function showPage(page) {
    currentPage = page;
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    // Find and activate the correct nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.onclick && item.onclick.toString().includes(`'${page}'`)) {
            item.classList.add('active');
        }
    });

    if (window.innerWidth <= 1024) {
        document.getElementById('sidebar').classList.remove('open');
    }

    if (page === 'overview') {
        renderOverview();
    } else if (page === 'week') {
        renderWeekPlanning();
    } else if (page === 'pillars') {
        renderPillars();
    } else if (page === 'trends') {
        renderTrends();
    } else if (page === 'inspiration') {
        renderInspiration();
    } else if (page === 'dreamcustomer') {
        renderDreamCustomer();
    } else if (page === 'strategy') {
        renderStrategy();
    } else if (page === 'library') {
        renderLibrary('all');
    } else if (page === 'story') {
        renderLibrary('story');
    } else if (page === 'questions') {
        renderLibrary('questions');
    } else if (page === 'dreamclient') {
        renderLibrary('dreamclient');
    } else if (page.startsWith('cat')) {
        const catId = parseInt(page.replace('cat', ''));
        renderCategory(catId);
    } else if (page === 'creator') {
        showPremiumContentCreator();
    } else if (page === 'avatars') {
        const content = document.getElementById('mainContent');
        content.innerHTML = '<div id="avatars-container"></div>';
        setTimeout(() => AVATARS.init(), 100);
    } else if (page === 'calendar30') {
        const content = document.getElementById('mainContent');
        content.innerHTML = '<div id="calendar30-container"></div>';
        setTimeout(() => CALENDAR_30.init(), 100);
    } else if (page === 'resources') {
        const content = document.getElementById('mainContent');
        content.innerHTML = '<div id="resources-container"></div>';
        setTimeout(() => RESOURCES.init(), 100);
    } else if (page === 'social') {
        const content = document.getElementById('mainContent');
        content.innerHTML = '<div id="social-container"></div>';
        setTimeout(() => SOCIAL_MEDIA.init(), 100);
    } else if (page === 'settings') {
        const content = document.getElementById('mainContent');
        content.innerHTML = '<div id="settings-container"></div>';
        setTimeout(() => SETTINGS.init(), 100);
    }
}

function renderPillars() {
    const content = document.getElementById('mainContent');

    // Count posts per pillar
    const pillarCounts = {};
    Object.values(posts).flat().forEach(post => {
        if (post.pillar) {
            pillarCounts[post.pillar] = (pillarCounts[post.pillar] || 0) + 1;
        }
    });

    content.innerHTML = `
                <div class="header">
                    <h1 class="page-title"><svg class="icon"><use href="#icon-target"></use></svg> Content Pillars</h1>
                    <p class="page-subtitle">Organisera ditt content efter huvudkategorier</p>
                </div>

                <div style="display: grid; gap: 25px;">
                    ${Object.keys(CONTENT_PILLARS).map(pillarKey => {
        const pillar = CONTENT_PILLARS[pillarKey];
        const count = pillarCounts[pillarKey] || 0;

        return `
                            <div class="planner-section" style="border-left: 4px solid ${pillar.color};">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                    <div>
                                        <h2 class="section-title">
                                            <span style="font-size: 2em;">${pillar.icon}</span>
                                            ${pillar.name}
                                        </h2>
                                        <p style="color: #666; margin-top: 8px;">${count} posts i denna kategori</p>
                                    </div>
                                </div>

                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                                    ${Object.keys(pillar.subcategories).map(subKey => {
            const sub = pillar.subcategories[subKey];
            const subPosts = Object.values(posts).flat().filter(p =>
                p.pillar === pillarKey && p.subcategory === subKey
            );

            return `
                                            <div style="background: #faf8f5; padding: 20px; border-radius: 12px; border-top: 3px solid ${pillar.color};">
                                                <h3 style="font-size: 1.2em; color: #3d3326; margin-bottom: 12px; font-weight: 700;">${sub.name}</h3>
                                                <p style="color: #666; font-size: 0.9em; margin-bottom: 12px;">${subPosts.length} posts</p>
                                                
                                                <div style="margin-bottom: 15px;">
                                                    <strong style="font-size: 0.85em; color: #999; text-transform: uppercase;">Topics:</strong>
                                                    <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
                                                        ${sub.topics.map(topic => `
                                                            <span style="padding: 4px 10px; background: white; border-radius: 12px; font-size: 0.85em; color: #666;">${topic}</span>
                                                        `).join('')}
                                                    </div>
                                                </div>

                                                <button class="use-btn" onclick="filterByPillar('${pillarKey}', '${subKey}')" style="width: 100%; margin-top: 10px;">
                                                    Se posts →
                                                </button>
                                            </div>
                                        `;
        }).join('')}
                                </div>
                            </div>
                        `;
    }).join('')}
                </div>
            `;
}

function filterByPillar(pillarKey, subKey) {
    const content = document.getElementById('mainContent');
    const pillar = CONTENT_PILLARS[pillarKey];
    const sub = pillar.subcategories[subKey];

    const filteredPosts = [];
    Object.keys(posts).forEach(catId => {
        posts[catId].forEach((post, index) => {
            if (post.pillar === pillarKey && post.subcategory === subKey) {
                filteredPosts.push({ ...post, catId: parseInt(catId), index });
            }
        });
    });

    content.innerHTML = `
                <div class="header">
                    <button onclick="showPage('pillars')" style="background: none; border: none; color: #d4a574; cursor: pointer; font-size: 1.2em; margin-bottom: 10px;">
                        ← Tillbaka till Content Pillars
                    </button>
                    <h1 class="page-title">
                        ${pillar.icon} ${pillar.name} → ${sub.name}
                    </h1>
                    <p class="page-subtitle">${filteredPosts.length} posts i denna kategori</p>
                </div>

                <div class="posts-list">
                    ${filteredPosts.length === 0 ? `
                        <div class="empty-state">
                            <div class="empty-state-icon"><svg class="icon"><use href="#icon-document"></use></svg></div>
                            <p>Inga posts i denna kategori ännu</p>
                        </div>
                    ` : filteredPosts.map(post => `
                        <div class="post-item">
                            <div class="post-meta">
                                <span class="badge badge-${post.status}">
                                    ${post.status === 'draft' ? 'Ej påbörjad' : post.status === 'progress' ? 'Pågående' : 'Publicerad'}
                                </span>
                                ${getPillarBadge(post)}
                                <span class="badge" style="background: #d4a574; color: white;">${post.format}</span>
                                <span class="badge" style="background: #e8dfd3; color: #3d3326;">${post.material}</span>
                            </div>
                            <div style="font-weight: 700; font-size: 1.2em; margin-bottom: 12px; color: #3d3326;">${post.topic}</div>
                            <div style="color: #666; margin-bottom: 12px; line-height: 1.6;"><strong>Hook:</strong> ${post.hook}</div>
                            ${post.caption ? `<div style="color: #666; white-space: pre-wrap; line-height: 1.6; margin-bottom: 12px;"><strong>Bildtext/Manus:</strong><br>${post.caption}</div>` : ''}
                            ${post.notes ? `<div style="color: #999; font-style: italic; margin-bottom: 12px;"><strong>Anteckningar:</strong> ${post.notes}</div>` : ''}
                            <div class="action-buttons">
                                <button class="edit-btn" onclick="editPost(${post.catId}, ${post.index})">Redigera</button>
                                <button class="delete-btn" onclick="deletePost(${post.catId}, ${post.index})">Ta bort</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
}

function renderTrends() {
    const content = document.getElementById('mainContent');

    content.innerHTML = `
                <div class="header">
                    <h1 class="page-title">🔥 Trendspaning</h1>
                    <p class="page-subtitle">Håll koll på vad som är trendande just nu</p>
                </div>

                <div class="planner-section">
                    <h2 class="section-title"><svg class="icon"><use href="#icon-plus"></use></svg> Lägg till trend</h2>
                    <div class="form-group">
                        <div class="text-area-with-mic">
                            <input 
                                type="text" 
                                class="form-input" 
                                id="trendInput" 
                                placeholder="T.ex. Glass skin, Clean girl aesthetic, AI content..."
                                onkeypress="if(event.key==='Enter') addTrend()"
                            >
                            <button class="mic-input-btn" onclick="startVoiceInput('trendInput')" title="Använd mikrofon">
                                🎤
                            </button>
                        </div>
                    </div>
                    <button class="add-post-btn sparkle" onclick="addTrend()" style="margin-top: 15px;">Lägg till trend</button>
                </div>

                <div class="planner-section">
                    <h2 class="section-title">🔥 Aktiva Trends (${trends.length})</h2>
                    ${trends.length === 0 ? `
                        <div class="empty-state">
                            <div class="empty-state-icon">🔥</div>
                            <p>Inga trends tillagda ännu. Börja spåna vad som är hot just nu!</p>
                        </div>
                    ` : `
                        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                            ${trends.map((trend, index) => `
                                <div class="trend-tag">
                                    ${trend.text}
                                    <button 
                                        onclick="deleteTrend(${index})"
                                        style="background: none; border: none; color: white; margin-left: 8px; cursor: pointer; font-weight: bold;"
                                        title="Ta bort"
                                    >×</button>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            `;
}

function addTrend() {
    const input = document.getElementById('trendInput');
    const text = input.value.trim();

    if (text) {
        trends.push({
            text,
            created: new Date().toISOString()
        });
        localStorage.setItem('trends', JSON.stringify(trends));
        input.value = '';
        renderTrends();
        showNotification('<svg class="icon"><use href="#icon-sparkles"></use></svg> Trend tillagd!', 'success');
    }
}

function deleteTrend(index) {
    if (confirm('Ta bort denna trend?')) {
        trends.splice(index, 1);
        localStorage.setItem('trends', JSON.stringify(trends));
        renderTrends();
    }
}

function renderStrategy() {
    const content = document.getElementById('mainContent');

    // Calculate progress
    const totalQuestions = Object.values(STRATEGY_QUESTIONS).reduce((sum, section) => sum + section.questions.length, 0);
    const answeredQuestions = Object.keys(strategyAnswers).length;
    const progressPercent = Math.round((answeredQuestions / totalQuestions) * 100);

    content.innerHTML = `
                <div class="header">
                    <h1 class="page-title"><svg class="icon"><use href="#icon-target"></use></svg> Content Strategy Guide</h1>
                    <p class="page-subtitle">Bygg din strategiska grund - Besvara frågorna för att skapa kraftfulla content pillars</p>
                </div>

                <div class="progress-indicator">
                    <span style="font-weight: 600; color: #3d3326;">Din framsteg:</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <span style="font-weight: 700; color: #d4a574;">${answeredQuestions}/${totalQuestions} frågor</span>
                </div>

                <div style="background: linear-gradient(135deg, #d4a574 0%, #b8956a 100%); color: white; padding: 25px; border-radius: 16px; margin-bottom: 30px;">
                    <h2 style="font-size: 1.5em; margin-bottom: 15px;">💡 Så här använder du guiden:</h2>
                    <ul style="line-height: 1.8; margin-left: 20px;">
                        <li>Klicka på varje sektion för att expandera frågorna</li>
                        <li>Besvara frågorna med mikrofonen 🎤 eller skriv</li>
                        <li>Dina svar sparas automatiskt</li>
                        <li>Återkom och uppdatera när din strategi utvecklas</li>
                        <li>Använd svaren för att skapa ditt content</li>
                    </ul>
                </div>

                ${Object.keys(STRATEGY_QUESTIONS).map(key => {
        const section = STRATEGY_QUESTIONS[key];
        const sectionAnswered = section.questions.filter(q => strategyAnswers[q]).length;

        return `
                        <div class="strategy-section" style="border-left-color: ${section.color};">
                            <div class="strategy-header" onclick="toggleStrategySection('${key}')">
                                <div class="strategy-title">
                                    <span style="font-size: 1.5em;">${section.icon}</span>
                                    <span>${section.title}</span>
                                    <span style="font-size: 0.9em; color: #999; font-weight: normal;">
                                        (${sectionAnswered}/${section.questions.length})
                                    </span>
                                </div>
                                <span class="expand-icon" id="icon-${key}">▼</span>
                            </div>
                            
                            <div class="strategy-content" id="content-${key}">
                                ${section.questions.map((question, index) => {
            const questionKey = question;
            const answer = strategyAnswers[questionKey] || '';

            return `
                                        <div class="question-item">
                                            <div class="question-text">
                                                ${index + 1}. ${question}
                                            </div>
                                            <div class="text-area-with-mic">
                                                <textarea 
                                                    class="answer-textarea" 
                                                    id="answer-${key}-${index}"
                                                    placeholder="Skriv ditt svar här eller använd mikrofonen..."
                                                    onchange="saveStrategyAnswer('${questionKey}', this.value)"
                                                    style="padding-right: 60px;"
                                                >${answer}</textarea>
                                                <button 
                                                    class="mic-input-btn" 
                                                    onclick="startVoiceInput('answer-${key}-${index}')" 
                                                    title="Använd mikrofon"
                                                    style="top: 15px;"
                                                >🎤</button>
                                            </div>
                                        </div>
                                    `;
        }).join('')}
                            </div>
                        </div>
                    `;
    }).join('')}

                <div style="margin-top: 30px; padding: 25px; background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                    <h2 style="font-size: 1.5em; color: #3d3326; margin-bottom: 15px;">🎉 Nästa steg</h2>
                    <p style="color: #666; line-height: 1.7; margin-bottom: 20px;">
                        När du har besvarat frågorna, använd dina svar för att:
                    </p>
                    <ul style="color: #666; line-height: 1.8; margin-left: 20px; margin-bottom: 20px;">
                        <li>Definiera dina 3-4 huvudsakliga content pillars</li>
                        <li>Skapa content som speglar din strategi</li>
                        <li>Planera posts i Veckoplanering baserat på dina pillars</li>
                        <li>Använd Content Library för inspiration</li>
                    </ul>
                    <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                        <button class="add-post-btn sparkle" onclick="exportStrategyAnswers()">
                            📥 Exportera svar
                        </button>
                        <button class="add-post-btn sparkle" onclick="showPage('pillars')" style="background: white; color: #d4a574; border: 2px solid #d4a574;">
                            <svg class="icon"><use href="#icon-target"></use></svg> Gå till Content Pillars
                        </button>
                    </div>
                </div>
            `;
}

function toggleStrategySection(key) {
    const content = document.getElementById(`content-${key}`);
    const icon = document.getElementById(`icon-${key}`);

    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        icon.classList.remove('expanded');
    } else {
        content.classList.add('expanded');
        icon.classList.add('expanded');
    }
}

function saveStrategyAnswer(question, answer) {
    strategyAnswers[question] = answer;
    localStorage.setItem('strategyAnswers', JSON.stringify(strategyAnswers));

    // Update progress if we're on the strategy page
    if (currentPage === 'strategy') {
        // Recalculate and update progress bar
        const totalQuestions = Object.values(STRATEGY_QUESTIONS).reduce((sum, section) => sum + section.questions.length, 0);
        const answeredQuestions = Object.keys(strategyAnswers).filter(k => strategyAnswers[k].trim()).length;
        const progressPercent = Math.round((answeredQuestions / totalQuestions) * 100);

        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-indicator span:last-child');

        if (progressFill) progressFill.style.width = progressPercent + '%';
        if (progressText) progressText.textContent = `${answeredQuestions}/${totalQuestions} frågor`;
    }
}

function exportStrategyAnswers() {
    let exportText = '# Content Strategy - Dina svar\n\n';
    exportText += `Exporterat: ${new Date().toLocaleDateString('sv-SE')}\n\n`;
    exportText += '---\n\n';

    Object.keys(STRATEGY_QUESTIONS).forEach(key => {
        const section = STRATEGY_QUESTIONS[key];
        exportText += `## ${section.title}\n\n`;

        section.questions.forEach(question => {
            const answer = strategyAnswers[question] || '';
            exportText += `**${question}**\n`;
            exportText += answer ? `${answer}\n\n` : '_Inget svar ännu_\n\n';
        });

        exportText += '---\n\n';
    });

    const blob = new Blob([exportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `content-strategy-svar-${new Date().toISOString().split('T')[0]}.md`;
    link.click();

    showNotification('📥 Strategi exporterad!', 'success');
}

function renderDreamCustomer() {
    const content = document.getElementById('mainContent');

    // Calculate progress
    const totalQuestions = Object.values(DREAMCUSTOMER_QUESTIONS).reduce((sum, section) => sum + section.questions.length, 0);
    const answeredQuestions = Object.keys(dreamCustomerAnswers).filter(k => dreamCustomerAnswers[k].trim()).length;
    const progressPercent = Math.round((answeredQuestions / totalQuestions) * 100);

    content.innerHTML = `
                <div class="header">
                    <h1 class="page-title">💎 Drömkund-profil</h1>
                    <p class="page-subtitle">Lär känna din idealkund på djupet - 29 kraftfulla frågor för att skapa content som säljer</p>
                </div>

                <div class="progress-indicator">
                    <span style="font-weight: 600; color: #3d3326;">Din framsteg:</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <span style="font-weight: 700; color: #d4a574;">${answeredQuestions}/${totalQuestions} frågor</span>
                </div>

                <div style="background: linear-gradient(135deg, #d4a574 0%, #b8956a 100%); color: white; padding: 25px; border-radius: 16px; margin-bottom: 30px;">
                    <h2 style="font-size: 1.5em; margin-bottom: 15px;">💡 Varför är detta viktigt?</h2>
                    <p style="line-height: 1.8; margin-bottom: 15px;">
                        Ju bättre du känner din drömkund, desto enklare blir det att skapa content som resonerar, engagerar och konverterar.
                    </p>
                    <ul style="line-height: 1.8; margin-left: 20px;">
                        <li>Skriv hooks som fångar uppmärksamhet direkt</li>
                        <li>Använd språket din kund faktiskt använder</li>
                        <li>Adressera rätt problem på rätt sätt</li>
                        <li>Skapa erbjudanden som känns skräddarsydda</li>
                        <li>Bygg förtroende genom att visa att du förstår</li>
                    </ul>
                </div>

                ${Object.keys(DREAMCUSTOMER_QUESTIONS).map(key => {
        const section = DREAMCUSTOMER_QUESTIONS[key];
        const sectionAnswered = section.questions.filter(q => dreamCustomerAnswers[q] && dreamCustomerAnswers[q].trim()).length;

        return `
                        <div class="strategy-section" style="border-left-color: ${section.color};">
                            <div class="strategy-header" onclick="toggleDreamCustomerSection('${key}')">
                                <div class="strategy-title">
                                    <span style="font-size: 1.5em;">${section.icon}</span>
                                    <span>${section.title}</span>
                                    <span style="font-size: 0.9em; color: #999; font-weight: normal;">
                                        (${sectionAnswered}/${section.questions.length})
                                    </span>
                                </div>
                                <span class="expand-icon" id="dc-icon-${key}">▼</span>
                            </div>
                            
                            <div class="strategy-content" id="dc-content-${key}">
                                ${section.questions.map((question, index) => {
            const questionKey = question;
            const answer = dreamCustomerAnswers[questionKey] || '';

            return `
                                        <div class="question-item">
                                            <div class="question-text">
                                                ${index + 1}. ${question}
                                            </div>
                                            <div class="text-area-with-mic">
                                                <textarea 
                                                    class="answer-textarea" 
                                                    id="dc-answer-${key}-${index}"
                                                    placeholder="Skriv ditt svar här eller använd mikrofonen..."
                                                    onchange="saveDreamCustomerAnswer('${questionKey.replace(/'/g, "\\'")}', this.value)"
                                                    style="padding-right: 60px;"
                                                >${answer}</textarea>
                                                <button 
                                                    class="mic-input-btn" 
                                                    onclick="startVoiceInput('dc-answer-${key}-${index}')" 
                                                    title="Använd mikrofon"
                                                    style="top: 15px;"
                                                >🎤</button>
                                            </div>
                                        </div>
                                    `;
        }).join('')}
                            </div>
                        </div>
                    `;
    }).join('')}

                <div style="margin-top: 30px; padding: 25px; background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                    <h2 style="font-size: 1.5em; color: #3d3326; margin-bottom: 15px;">🎉 Nästa steg</h2>
                    <p style="color: #666; line-height: 1.7; margin-bottom: 20px;">
                        När du har besvarat frågorna, använd svaren för att:
                    </p>
                    <ul style="color: #666; line-height: 1.8; margin-left: 20px; margin-bottom: 20px;">
                        <li>Skriva hooks som träffar rätt direkt</li>
                        <li>Använda språket din kund använder i ditt content</li>
                        <li>Adressera rätt smärtpunkter och drömmar</li>
                        <li>Skapa erbjudanden baserade på hennes behov</li>
                        <li>Planera content i Veckoplanering med denna kunskap</li>
                    </ul>
                    <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                        <button class="add-post-btn sparkle" onclick="exportDreamCustomerAnswers()">
                            📥 Exportera svar
                        </button>
                        <button class="add-post-btn sparkle" onclick="showPage('week')" style="background: white; color: #d4a574; border: 2px solid #d4a574;">
                            📅 Gå till Veckoplanering
                        </button>
                    </div>
                </div>
            `;
}

function toggleDreamCustomerSection(key) {
    const content = document.getElementById(`dc-content-${key}`);
    const icon = document.getElementById(`dc-icon-${key}`);

    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        icon.classList.remove('expanded');
    } else {
        content.classList.add('expanded');
        icon.classList.add('expanded');
    }
}

function saveDreamCustomerAnswer(question, answer) {
    dreamCustomerAnswers[question] = answer;
    localStorage.setItem('dreamCustomerAnswers', JSON.stringify(dreamCustomerAnswers));

    // Update progress if we're on the dreamcustomer page
    if (currentPage === 'dreamcustomer') {
        const totalQuestions = Object.values(DREAMCUSTOMER_QUESTIONS).reduce((sum, section) => sum + section.questions.length, 0);
        const answeredQuestions = Object.keys(dreamCustomerAnswers).filter(k => dreamCustomerAnswers[k].trim()).length;
        const progressPercent = Math.round((answeredQuestions / totalQuestions) * 100);

        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-indicator span:last-child');

        if (progressFill) progressFill.style.width = progressPercent + '%';
        if (progressText) progressText.textContent = `${answeredQuestions}/${totalQuestions} frågor`;
    }
}

function exportDreamCustomerAnswers() {
    let exportText = '# Drömkund-profil - Dina svar\n\n';
    exportText += `Exporterat: ${new Date().toLocaleDateString('sv-SE')}\n\n`;
    exportText += '---\n\n';

    Object.keys(DREAMCUSTOMER_QUESTIONS).forEach(key => {
        const section = DREAMCUSTOMER_QUESTIONS[key];
        exportText += `## ${section.title}\n\n`;

        section.questions.forEach((question, index) => {
            const answer = dreamCustomerAnswers[question] || '';
            exportText += `**F${getTotalQuestionNumber(key, index)}. ${question}**\n\n`;
            exportText += answer ? `${answer}\n\n` : '_Inget svar ännu_\n\n';
            exportText += '---\n\n';
        });
    });

    const blob = new Blob([exportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dromkund-profil-${new Date().toISOString().split('T')[0]}.md`;
    link.click();

    showNotification('📥 Drömkund-profil exporterad!', 'success');
}

function getTotalQuestionNumber(sectionKey, questionIndex) {
    const sections = Object.keys(DREAMCUSTOMER_QUESTIONS);
    let total = 1;

    for (let i = 0; i < sections.length; i++) {
        if (sections[i] === sectionKey) {
            return total + questionIndex;
        }
        total += DREAMCUSTOMER_QUESTIONS[sections[i]].questions.length;
    }
    return total;
}

function renderInspiration() {
    const content = document.getElementById('mainContent');

    content.innerHTML = `
                <div class="header">
                    <h1 class="page-title">💡 Anteckningsblock</h1>
                    <p class="page-subtitle">Inspiration, idéer och kreativa tankar</p>
                </div>

                <div class="planner-section">
                    <h2 class="section-title">✍️ Ny anteckning</h2>
                    <div class="form-group">
                        <div class="text-area-with-mic">
                            <textarea 
                                class="form-textarea" 
                                id="noteInput" 
                                placeholder="Skriv dina tankar här eller använd mikrofonen för att dikt era..."
                                style="min-height: 150px; padding-right: 60px;"
                            ></textarea>
                            <button class="mic-input-btn" onclick="startVoiceInput('noteInput')" title="Använd mikrofon">
                                🎤
                            </button>
                        </div>
                    </div>
                    <button class="add-post-btn sparkle" onclick="addNote()" style="margin-top: 15px;"><svg class="icon"><use href="#icon-save"></use></svg> Spara anteckning</button>
                </div>

                <div class="planner-section">
                    <h2 class="section-title"><svg class="icon"><use href="#icon-document"></use></svg> Mina anteckningar (${inspirationNotes.length})</h2>
                    ${inspirationNotes.length === 0 ? `
                        <div class="empty-state">
                            <div class="empty-state-icon"><svg class="icon"><use href="#icon-document"></use></svg></div>
                            <p>Inga anteckningar ännu. Börja skriva eller diktera dina idéer!</p>
                        </div>
                    ` : inspirationNotes.slice().reverse().map((note, reverseIndex) => {
        const index = inspirationNotes.length - 1 - reverseIndex;
        const date = new Date(note.created);
        const dateStr = date.toLocaleDateString('sv-SE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

        return `
                            <div class="note-card">
                                <div class="note-header">
                                    <span class="note-date">📅 ${dateStr}</span>
                                    <button 
                                        class="delete-btn" 
                                        onclick="deleteNote(${index})"
                                        style="padding: 6px 12px;"
                                    >Ta bort</button>
                                </div>
                                <div class="note-text">${note.text}</div>
                            </div>
                        `;
    }).join('')}
                </div>
            `;
}

function addNote() {
    const input = document.getElementById('noteInput');
    const text = input.value.trim();

    if (text) {
        inspirationNotes.push({
            text,
            created: new Date().toISOString()
        });
        localStorage.setItem('inspirationNotes', JSON.stringify(inspirationNotes));
        input.value = '';
        renderInspiration();
        showNotification('<svg class="icon"><use href="#icon-sparkles"></use></svg> Anteckning sparad!', 'success');
    }
}

function deleteNote(index) {
    if (confirm('Ta bort denna anteckning?')) {
        inspirationNotes.splice(index, 1);
        localStorage.setItem('inspirationNotes', JSON.stringify(inspirationNotes));
        renderInspiration();
    }
}

// Voice Recognition Functions
function startVoiceInput(targetId) {
    if (!recognition) {
        showMicrophoneHelp();
        return;
    }

    currentTextarea = document.getElementById(targetId);
    const micBtn = event.target;
    const indicator = document.getElementById('speechIndicator');

    if (isRecording) {
        // Stop recording
        recognition.stop();
        isRecording = false;
        micBtn.classList.remove('recording');
        indicator.classList.remove('active');
        return;
    }

    // Start recording
    try {
        recognition.start();
        isRecording = true;
        micBtn.classList.add('recording');
        indicator.classList.add('active');

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                const currentValue = currentTextarea.value;
                currentTextarea.value = currentValue + finalTranscript;

                // Trigger change event to save
                const changeEvent = new Event('change');
                currentTextarea.dispatchEvent(changeEvent);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            isRecording = false;
            micBtn.classList.remove('recording');
            indicator.classList.remove('active');

            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                showMicrophonePermissionError();
            } else if (event.error === 'no-speech') {
                showNotification('🎤 Inget tal upptäckt. Prata lite högre!', 'info');
            } else if (event.error === 'network') {
                showNotification('📡 Internetanslutning krävs för röstinspelning', 'info');
            } else {
                showNotification('😔 Röstinspelning misslyckades. Försök igen!', 'info');
            }
        };

        recognition.onend = () => {
            isRecording = false;
            micBtn.classList.remove('recording');
            indicator.classList.remove('active');
        };

    } catch (error) {
        console.error('Error starting recognition:', error);
        showNotification('😔 Kunde inte starta röstinspelning. Kontrollera att din mikrofon fungerar.', 'info');
    }
}

function showMicrophoneHelp() {
    const modal = document.createElement('div');
    modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
            `;

    modal.innerHTML = `
                <div style="background: white; padding: 35px; border-radius: 20px; max-width: 600px; max-height: 90vh; overflow-y: auto;">
                    <h2 style="color: #3d3326; margin-bottom: 20px; font-size: 1.8em;">🎤 Röstinspelning stöds inte</h2>
                    <p style="color: #666; line-height: 1.7; margin-bottom: 20px;">
                        Din webbläsare stöder tyvärr inte röstinspelning (Web Speech API).
                    </p>
                    <h3 style="color: #d4a574; margin-bottom: 15px; font-size: 1.3em;">✅ Webbläsare som fungerar:</h3>
                    <ul style="color: #666; line-height: 1.8; margin-left: 20px; margin-bottom: 20px;">
                        <li><strong>Chrome</strong> (Desktop & Android)</li>
                        <li><strong>Edge</strong> (Desktop)</li>
                        <li><strong>Safari</strong> (iOS & Mac)</li>
                        <li><strong>Samsung Internet</strong> (Android)</li>
                    </ul>
                    <p style="color: #666; line-height: 1.7; margin-bottom: 25px;">
                        <strong>Tips:</strong> Om du använder en av dessa webbläsare och det ändå inte fungerar, 
                        se till att du har gett tillåtelse till mikrofonen (se instruktioner nedan).
                    </p>
                    <button onclick="this.closest('div[style*=fixed]').remove()" 
                            style="width: 100%; padding: 14px; background: #d4a574; color: white; border: none; border-radius: 8px; font-size: 1em; font-weight: 600; cursor: pointer;">
                        OK, jag förstår
                    </button>
                </div>
            `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function showMicrophonePermissionError() {
    const modal = document.createElement('div');
    modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
            `;

    const isChrome = /Chrome/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isEdge = /Edg/.test(navigator.userAgent);

    let instructions = '';

    if (isChrome || isEdge) {
        instructions = `
                    <h3 style="color: #d4a574; margin-bottom: 15px; font-size: 1.3em;">📍 Så här aktiverar du mikrofonen i Chrome/Edge:</h3>
                    <ol style="color: #666; line-height: 1.8; margin-left: 20px; margin-bottom: 20px;">
                        <li>Leta efter <strong>🔒 låsikonen</strong> eller <strong>🎤 mikrofonikonen</strong> i adressfältet (till vänster om URL:en)</li>
                        <li>Klicka på ikonen</li>
                        <li>Ändra mikrofon från "Blockerad" till <strong>"Tillåt"</strong></li>
                        <li>Ladda om sidan</li>
                        <li>Klicka på mikrofonknappen igen - nu kommer webbläsaren fråga om tillåtelse</li>
                        <li>Klicka <strong>"Tillåt"</strong></li>
                    </ol>
                `;
    } else if (isSafari) {
        instructions = `
                    <h3 style="color: #d4a574; margin-bottom: 15px; font-size: 1.3em;">📍 Så här aktiverar du mikrofonen i Safari:</h3>
                    <ol style="color: #666; line-height: 1.8; margin-left: 20px; margin-bottom: 20px;">
                        <li>Klicka på <strong>Safari</strong> i menyraden</li>
                        <li>Välj <strong>Inställningar</strong></li>
                        <li>Gå till fliken <strong>Webbplatser</strong></li>
                        <li>Välj <strong>Mikrofon</strong> i listan till vänster</li>
                        <li>Hitta denna webbplats och ändra till <strong>"Tillåt"</strong></li>
                        <li>Stäng inställningar och ladda om sidan</li>
                    </ol>
                `;
    } else {
        instructions = `
                    <h3 style="color: #d4a574; margin-bottom: 15px; font-size: 1.3em;">📍 Så här aktiverar du mikrofonen:</h3>
                    <ol style="color: #666; line-height: 1.8; margin-left: 20px; margin-bottom: 20px;">
                        <li>Gå till din webbläsares inställningar</li>
                        <li>Hitta <strong>Sekretess & säkerhet</strong> eller <strong>Behörigheter</strong></li>
                        <li>Välj <strong>Mikrofon</strong></li>
                        <li>Ge tillåtelse för denna webbplats</li>
                        <li>Ladda om sidan</li>
                    </ol>
                `;
    }

    modal.innerHTML = `
                <div style="background: white; padding: 35px; border-radius: 20px; max-width: 650px; max-height: 90vh; overflow-y: auto;">
                    <h2 style="color: #ff6b6b; margin-bottom: 20px; font-size: 1.8em;">🎤 Mikrofon-åtkomst nekad</h2>
                    <p style="color: #666; line-height: 1.7; margin-bottom: 25px;">
                        För att använda röstinspelning behöver du ge tillåtelse till mikrofonen.
                    </p>
                    
                    ${instructions}
                    
                    <div style="background: #fff9e6; padding: 20px; border-radius: 12px; border-left: 4px solid #ffd89b; margin-bottom: 25px;">
                        <strong style="color: #8b6914; display: block; margin-bottom: 10px;">💡 Snabb lösning:</strong>
                        <p style="color: #8b6914; line-height: 1.6; margin: 0;">
                            Leta efter en <strong>mikrofonikon 🎤</strong> eller <strong>låsikon 🔒</strong> i adressfältet 
                            (längst upp till vänster om webbadressen). Klicka där och välj "Tillåt mikrofon".
                        </p>
                    </div>
                    
                    <p style="color: #999; font-size: 0.9em; line-height: 1.6; margin-bottom: 25px;">
                        <strong>Obs:</strong> Du behöver bara göra detta en gång. Därefter kommer mikrofonen alltid fungera på denna sida.
                    </p>
                    
                    <button onclick="this.closest('div[style*=fixed]').remove()" 
                            style="width: 100%; padding: 14px; background: #d4a574; color: white; border: none; border-radius: 8px; font-size: 1em; font-weight: 600; cursor: pointer;">
                        OK, jag förstår
                    </button>
                </div>
            `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}


// ========================================================================
// POSTS STORAGE SYSTEM
// ========================================================================
const POSTS = {
    _storage_key: 'linnartistry_posts',
    _current_key: 'linnartistry_current_post',

    getAll() {
        const data = localStorage.getItem(this._storage_key);
        return data ? JSON.parse(data) : [];
    },

    save(postData) {
        const posts = this.getAll();
        if (!postData.id) {
            postData.id = Date.now();
            postData.createdAt = new Date().toISOString();
        }
        postData.updatedAt = new Date().toISOString();
        const existingIndex = posts.findIndex(p => p.id === postData.id);
        if (existingIndex >= 0) {
            posts[existingIndex] = postData;
        } else {
            posts.push(postData);
        }
        localStorage.setItem(this._storage_key, JSON.stringify(posts));
        return postData;
    },

    getCurrent() {
        const data = localStorage.getItem(this._current_key);
        return data ? JSON.parse(data) : this._createEmpty();
    },

    setCurrent(postData) {
        localStorage.setItem(this._current_key, JSON.stringify(postData));
    },

    _createEmpty() {
        return {
            id: null,
            freeText: '',
            category: null,
            purpose: null,
            channel: null,
            format: null,
            tone: null,
            template: null,
            hook: null,
            content: '',
            status: 'draft',
            scheduledDate: null
        };
    }
};


function renderOverview() {
    const content = document.getElementById('mainContent');
    const totalPosts = Object.values(posts).flat().length;
    const publishedPosts = Object.values(posts).flat().filter(p => p.status === 'published').length;
    const inProgressPosts = Object.values(posts).flat().filter(p => p.status === 'progress').length;
    const draftPosts = Object.values(posts).flat().filter(p => p.status === 'draft').length;

    content.innerHTML = `
                <div class="header">
                    <h1 class="page-title"><svg class="icon"><use href="#icon-dashboard"></use></svg> Dashboard</h1>
                    <p class="page-subtitle">Översikt av ditt content system</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${totalPosts}</div>
                        <div class="stat-label">Totalt Posts</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${publishedPosts}</div>
                        <div class="stat-label">Publicerade</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${inProgressPosts}</div>
                        <div class="stat-label">Pågående</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${draftPosts}</div>
                        <div class="stat-label">Ej påbörjade</div>
                    </div>
                    <div class="stat-card" style="cursor: pointer;" onclick="showPage('trends')">
                        <div class="stat-number">🔥 ${trends.length}</div>
                        <div class="stat-label">Trends</div>
                    </div>
                    <div class="stat-card" style="cursor: pointer;" onclick="showPage('inspiration')">
                        <div class="stat-number">💡 ${inspirationNotes.length}</div>
                        <div class="stat-label">Anteckningar</div>
                    </div>
                </div>

                <div class="planner-section" style="background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); padding: 40px; border-radius: 20px; margin-bottom: 30px; cursor: pointer; box-shadow: 0 8px 24px rgba(212, 165, 116, 0.4); transition: all 0.3s ease;" onclick="showPremiumContentCreator()">
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 30px;">
                        <div style="flex: 1;">
                            <h2 style="font-size: 2.2em; color: white; margin: 0 0 12px 0; font-weight: 700; text-shadow: 0 2px 8px rgba(0,0,0,0.1);">✨ Premium Content Creator</h2>
                            <p style="color: rgba(255,255,255,0.95); font-size: 1.15em; margin: 0 0 20px 0; line-height: 1.6;">Allt du behöver för att skapa perfekt content – på ett ställe</p>
                            <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-top: 16px;">
                                <span style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; color: white; font-size: 0.95em; font-weight: 600; backdrop-filter: blur(10px);">💾 Spara & Schemalägg</span>
                                <span style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; color: white; font-size: 0.95em; font-weight: 600; backdrop-filter: blur(10px);">📚 398 Templates</span>
                                <span style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; color: white; font-size: 0.95em; font-weight: 600; backdrop-filter: blur(10px);">💫 178 Hooks</span>
                            </div>
                        </div>
                        <div style="font-size: 5em; text-shadow: 0 4px 12px rgba(0,0,0,0.1);">🚀</div>
                    </div>
                </div>


                <div class="planner-section">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <div>
                            <h2 class="section-title">📝 Mina Premium Posts</h2>
                            <p style="color: #666;">${typeof POSTS !== 'undefined' ? POSTS.getAll().length : 0} sparade posts</p>
                        </div>
                        <button onclick="showSavedPosts()" style="padding: 12px 24px; background: rgba(212, 165, 116, 0.1); color: #2c2416; border: 2px solid #d4a574; border-radius: 12px; font-weight: 700; cursor: pointer;">Se alla →</button>
                    </div>
                    ${typeof POSTS !== 'undefined' && POSTS.getAll().length > 0 ? `
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                            ${POSTS.getAll().slice(0, 4).map(post => {
        const statusInfo = MC_CONFIG.statuses.find(s => s.id === post.status) || MC_CONFIG.statuses[0];
        const preview = (post.content || post.freeText || '').substring(0, 100);
        const date = new Date(post.updatedAt).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });

        return `
                                    <div onclick="loadPost(${post.id})" style="background: white; padding: 20px; border-radius: 12px; border-left: 4px solid ${statusInfo.color}; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                                            <span style="padding: 4px 10px; background: ${statusInfo.color}20; color: ${statusInfo.color}; border-radius: 6px; font-size: 0.85em; font-weight: 600;">${statusInfo.emoji} ${statusInfo.name}</span>
                                            <span style="color: #999; font-size: 0.85em;">${date}</span>
                                        </div>
                                        <p style="color: #2c2416; line-height: 1.5; margin: 0; font-size: 0.95em;">${preview}${preview.length >= 100 ? '...' : ''}</p>
                                    </div>
                                `;
    }).join('')}
                        </div>
                    ` : `
                        <div style="background: #f5f1eb; padding: 40px; border-radius: 12px; text-align: center;">
                            <p style="color: #666; margin: 0;">Inga posts än. Skapa din första!</p>
                            <button onclick="showPremiumContentCreator()" style="margin-top: 16px; padding: 12px 24px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer;">✨ Skapa post</button>
                        </div>
                    `}
                </div>

                <div class="planner-section">
                    <h2 class="section-title"><svg class="icon"><use href="#icon-target"></use></svg> Content Pillars Översikt</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 20px;">
                        ${Object.keys(CONTENT_PILLARS).map(pillarKey => {
        const pillar = CONTENT_PILLARS[pillarKey];
        const pillarPosts = Object.values(posts).flat().filter(p => p.pillar === pillarKey);

        return `
                                <div style="background: linear-gradient(135deg, ${pillar.color}22 0%, ${pillar.color}11 100%); padding: 20px; border-radius: 12px; border-left: 4px solid ${pillar.color}; cursor: pointer; transition: all 0.3s ease;" onclick="showPage('pillars')">
                                    <div style="font-size: 2.5em; margin-bottom: 10px;">${pillar.icon}</div>
                                    <h3 style="font-size: 1.3em; color: #3d3326; margin-bottom: 8px; font-weight: 700;">${pillar.name}</h3>
                                    <p style="color: #666; font-size: 1.8em; font-weight: 700; margin-bottom: 8px;">${pillarPosts.length}</p>
                                    <p style="color: #666; font-size: 0.9em;">posts</p>
                                </div>
                            `;
    }).join('')}
                    </div>
                    <button class="add-post-btn sparkle" onclick="showPage('pillars')">Se alla Content Pillars →</button>
                </div>

                <div class="planner-section">
                    <h2 class="section-title">📅 Denna vecka</h2>
                    <div class="week-grid">
                        ${CATEGORIES.map(cat => {
        const catPosts = posts[cat.id] || [];
        const latestPost = catPosts.find(p => p.status !== 'published') || catPosts[0];
        return `
                                <div class="day-card" onclick="showPage('cat${cat.id}')">
                                    <div class="day-name">${cat.day}</div>
                                    <div class="day-category">${cat.name}</div>
                                    <div class="day-posts">
                                        ${latestPost ? `
                                            <svg class="icon"><use href="#icon-document"></use></svg> ${latestPost.topic}<br>
                                            <small>${latestPost.format}</small>
                                        ` : 'Ingen post planerad'}
                                    </div>
                                </div>
                            `;
    }).join('')}
                    </div>
                </div>

                <div class="planner-section">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <div>
                            <h2 class="section-title"><svg class="icon"><use href="#icon-book"></use></svg> Content Library</h2>
                            <p style="color: #666;">
                                ${Object.values(CONTENT_LIBRARY).flat().length} färdiga texter och idéer att använda
                            </p>
                        </div>
                        <button class="export-btn" onclick="exportData()">💾 Exportera data</button>
                    </div>
                    <button class="add-post-btn sparkle" onclick="showLibraryFromDashboard()">Utforska Content Library →</button>
                </div>
                
                <div class="planner-section" style="margin-top: 2.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <div>
                            <h2 class="section-title" style="font-family: 'Cormorant Garamond', serif; font-size: 1.8em; color: #2c2416; margin-bottom: 0.5rem;">📅 Dagens Schema</h2>
                            <p style="color: #6b5d4f; font-size: 0.95em;">Din dagliga rutin & aktiviteter</p>
                        </div>
                        <div style="display: flex; gap: 0.75rem;">
                            <button onclick="DAILY_SCHEDULE.addActivity()" style="padding: 12px 24px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3); transition: all 0.3s;">
                                <svg class="icon"><use href="#icon-plus"></use></svg> Lägg till aktivitet
                            </button>
                            <button onclick="DAILY_SCHEDULE.addSuggestions()" style="padding: 12px 24px; background: rgba(212, 165, 116, 0.15); color: #d4a574; border: 2px solid rgba(212, 165, 116, 0.3); border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s;">
                                <svg class="icon"><use href="#icon-refresh"></use></svg> Återställ
                            </button>
                        </div>
                    </div>
                    <div id="daily-schedule-container"></div>
                </div>
            `;

    // Initialize daily schedule
    if (typeof DAILY_SCHEDULE !== 'undefined') {
        setTimeout(() => DAILY_SCHEDULE.init(), 100);
    }
}

function showLibraryFromDashboard() {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.nav-item')[2].classList.add('active');
    renderLibrary('all');
}

function getPillarBadge(post) {
    if (!post.pillar) return '';

    const pillar = CONTENT_PILLARS[post.pillar];
    if (!pillar) return '';

    let html = `<span class="badge" style="background: ${pillar.color}; color: white;">${pillar.icon} ${pillar.name}</span>`;

    if (post.subcategory) {
        const sub = pillar.subcategories[post.subcategory];
        if (sub) {
            html += `<span class="badge" style="background: white; border: 2px solid ${pillar.color}; color: ${pillar.color};">${sub.name}</span>`;
        }
    }

    if (post.topicTag) {
        html += `<span class="badge" style="background: #f5f1eb; color: #3d3326;">${post.topicTag}</span>`;
    }

    return html;
}

function getPlatformBadge(platform) {
    if (!platform) return '';

    const platforms = {
        'Instagram': { icon: '📸', color: '#E4405F' },
        'TikTok': { icon: '🎵', color: '#000000' },
        'YouTube': { icon: '📺', color: '#FF0000' },
        'Facebook': { icon: '👥', color: '#1877F2' },
        'LinkedIn': { icon: '<svg class="icon"><use href="#icon-document"></use></svg>', color: '#0A66C2' },
        'Pinterest': { icon: '📌', color: '#E60023' },
        'X (Twitter)': { icon: '🐦', color: '#000000' },
        'Flera': { icon: '🌐', color: '#6c757d' }
    };

    const p = platforms[platform];
    if (!p) return `<span class="badge" style="background: #999; color: white;">${platform}</span>`;

    return `<span class="badge" style="background: ${p.color}; color: white; font-weight: 600;">${p.icon} ${platform}</span>`;
}

function renderPostBadges(post) {
    return `
                <span class="badge badge-${post.status}">
                    ${post.status === 'draft' ? 'Ej påbörjad' : post.status === 'progress' ? 'Pågående' : 'Publicerad'}
                </span>
                ${getPillarBadge(post)}
                ${getPlatformBadge(post.platform)}
                <span class="badge" style="background: #d4a574; color: white;">${post.format}</span>
                <span class="badge" style="background: #e8dfd3; color: #3d3326;">${post.material}</span>
            `;
}

function renderWeekPlanning() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
                <div class="header">
                    <h1 class="page-title">📅 Veckoplanering</h1>
                    <p class="page-subtitle">En post per dag - sju kategorier</p>
                </div>

                ${CATEGORIES.map(cat => {
        const catPosts = posts[cat.id] || [];
        return `
                        <div class="planner-section">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
                                <div>
                                    <h2 class="section-title">
                                        <span style="background: #d4a574; color: white; width: 40px; height: 40px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">${cat.id}</span>
                                        ${cat.name}
                                    </h2>
                                    <p style="color: #666; margin-left: 52px;">${cat.day} - ${cat.description}</p>
                                </div>
                                <button class="add-post-btn sparkle" onclick="openModal(${cat.id})">+ Lägg till post</button>
                            </div>

                            <div class="posts-list">
                                ${catPosts.length === 0 ? `
                                    <div class="empty-state">
                                        <div class="empty-state-icon"><svg class="icon"><use href="#icon-document"></use></svg></div>
                                        <p>Ingen post skapad ännu</p>
                                    </div>
                                ` : catPosts.map((post, index) => `
                                    <div class="post-item">
                                        <div class="post-meta">
                                            <span class="badge badge-${post.status}">
                                                ${post.status === 'draft' ? 'Ej påbörjad' : post.status === 'progress' ? 'Pågående' : 'Publicerad'}
                                            </span>
                                            ${getPillarBadge(post)}
                                            <span class="badge" style="background: #d4a574; color: white;">${post.format}</span>
                                            <span class="badge" style="background: #e8dfd3; color: #3d3326;">${post.material}</span>
                                        </div>
                                        <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 10px; color: #3d3326;">${post.topic}</div>
                                        <div style="color: #666; margin-bottom: 10px;"><strong>Hook:</strong> ${post.hook}</div>
                                        ${post.caption ? `<div style="color: #666; white-space: pre-wrap;">${post.caption.substring(0, 150)}${post.caption.length > 150 ? '...' : ''}</div>` : ''}
                                        <div class="action-buttons">
                                            <button class="edit-btn" onclick="editPost(${cat.id}, ${index})">Redigera</button>
                                            <button class="delete-btn" onclick="deletePost(${cat.id}, ${index})">Ta bort</button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
    }).join('')}
            `;
}

function renderLibrary(filter = 'all') {
    currentFilter = filter;
    const content = document.getElementById('mainContent');

    let allContent = [];
    if (filter === 'all') {
        allContent = Object.values(CONTENT_LIBRARY).flat();
    } else {
        allContent = CONTENT_LIBRARY[filter] || [];
    }

    const titles = {
        'all': 'Alla texter',
        'story': 'Min Story',
        'questions': 'Frågor & Svar',
        'dreamclient': 'Drömkunden'
    };

    content.innerHTML = `
                <div class="header">
                    <h1 class="page-title"><svg class="icon"><use href="#icon-book"></use></svg> ${titles[filter]}</h1>
                    <p class="page-subtitle">Sök och hitta alla dina färdiga texter och idéer</p>
                </div>

                <div class="search-container">
                    <input 
                        type="text" 
                        class="search-box" 
                        id="searchBox" 
                        placeholder="🔍 Sök i content library..."
                        oninput="searchContent(this.value)"
                    >
                </div>

                ${filter === 'all' ? `
                    <div class="category-filter">
                        <button class="filter-btn active" onclick="filterLibrary('all')">Alla (${allContent.length})</button>
                        <button class="filter-btn" onclick="filterLibrary('story')">Min Story</button>
                        <button class="filter-btn" onclick="filterLibrary('dreamclient')">Drömkunden</button>
                        <button class="filter-btn" onclick="filterLibrary('questions')">Frågor & Svar</button>
                    </div>
                ` : ''}

                <div class="content-grid" id="contentGrid">
                    ${allContent.map((item, index) => `
                        <div class="content-card" data-index="${index}">
                            <div class="content-header">
                                <h3 class="content-title">${item.title}</h3>
                                <span class="content-category">${item.category}</span>
                            </div>
                            <div class="content-text">${item.text}</div>
                            <button class="use-btn" onclick="useContent('${filter}', ${index})">
                                Använd i post →
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
}

function searchContent(query) {
    const cards = document.querySelectorAll('.content-card');
    query = query.toLowerCase();

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterLibrary(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderLibrary(filter);
}

function useContent(libraryType, index) {
    let content;
    if (libraryType === 'all') {
        content = Object.values(CONTENT_LIBRARY).flat()[index];
    } else {
        content = CONTENT_LIBRARY[libraryType][index];
    }

    const categoryMap = {
        'Min Story': 1,
        'BTS - Low Intensity': 2,
        'Lärande': 3,
        'Reach - Trendande': 4,
        'Drömkunden': 1
    };

    const catId = categoryMap[content.category] || 1;

    document.getElementById('topicInput').value = content.title;
    document.getElementById('captionInput').value = content.text;
    document.getElementById('hookInput').value = content.text.substring(0, 100) + '...';

    openModal(catId);
}

function renderCategory(catId) {
    const cat = CATEGORIES.find(c => c.id === catId);
    const catPosts = posts[catId] || [];

    const content = document.getElementById('mainContent');
    content.innerHTML = `
                <div class="header">
                    <h1 class="page-title">
                        <span style="background: #d4a574; color: white; width: 50px; height: 50px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px;">${cat.id}</span>
                        ${cat.name}
                    </h1>
                    <p class="page-subtitle">${cat.day} - ${cat.description}</p>
                </div>

                <div style="margin-bottom: 30px;">
                    <button class="add-post-btn sparkle" onclick="openModal(${catId})">+ Skapa ny post</button>
                </div>

                <div class="posts-list">
                    ${catPosts.length === 0 ? `
                        <div class="empty-state">
                            <div class="empty-state-icon"><svg class="icon"><use href="#icon-document"></use></svg></div>
                            <p>Ingen post skapad ännu. Klicka på "Skapa ny post" för att börja!</p>
                        </div>
                    ` : catPosts.map((post, index) => `
                        <div class="post-item">
                            <div class="post-meta">
                                <span class="badge badge-${post.status}">
                                    ${post.status === 'draft' ? 'Ej påbörjad' : post.status === 'progress' ? 'Pågående' : 'Publicerad'}
                                </span>
                                ${getPillarBadge(post)}
                                <span class="badge" style="background: #d4a574; color: white;">${post.format}</span>
                                <span class="badge" style="background: #e8dfd3; color: #3d3326;">${post.material}</span>
                            </div>
                            <div style="font-weight: 700; font-size: 1.2em; margin-bottom: 12px; color: #3d3326;">${post.topic}</div>
                            <div style="color: #666; margin-bottom: 12px; line-height: 1.6;"><strong>Hook:</strong> ${post.hook}</div>
                            ${post.caption ? `<div style="color: #666; white-space: pre-wrap; line-height: 1.6; margin-bottom: 12px;"><strong>Bildtext/Manus:</strong><br>${post.caption}</div>` : ''}
                            ${post.notes ? `<div style="color: #999; font-style: italic; margin-bottom: 12px;"><strong>Anteckningar:</strong> ${post.notes}</div>` : ''}
                            <div class="action-buttons">
                                <button class="edit-btn" onclick="editPost(${catId}, ${index})">Redigera</button>
                                <button class="delete-btn" onclick="deletePost(${catId}, ${index})">Ta bort</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
}

function updateSubcategories() {
    const pillarSelect = document.getElementById('pillarInput');
    const subcategoryGroup = document.getElementById('subcategoryGroup');
    const subcategorySelect = document.getElementById('subcategoryInput');
    const topicGroup = document.getElementById('topicGroup');

    const pillarKey = pillarSelect.value;

    if (!pillarKey) {
        subcategoryGroup.style.display = 'none';
        topicGroup.style.display = 'none';
        return;
    }

    const pillar = CONTENT_PILLARS[pillarKey];
    subcategorySelect.innerHTML = '<option value="">Välj underkategori...</option>';

    Object.keys(pillar.subcategories).forEach(subKey => {
        const sub = pillar.subcategories[subKey];
        const option = document.createElement('option');
        option.value = subKey;
        option.textContent = sub.name;
        subcategorySelect.appendChild(option);
    });

    subcategoryGroup.style.display = 'block';
    topicGroup.style.display = 'none';
}

function updateTopics() {
    const pillarSelect = document.getElementById('pillarInput');
    const subcategorySelect = document.getElementById('subcategoryInput');
    const topicGroup = document.getElementById('topicGroup');
    const topicSelect = document.getElementById('topicTagInput');

    const pillarKey = pillarSelect.value;
    const subKey = subcategorySelect.value;

    if (!pillarKey || !subKey) {
        topicGroup.style.display = 'none';
        return;
    }

    const topics = CONTENT_PILLARS[pillarKey].subcategories[subKey].topics;
    topicSelect.innerHTML = '<option value="">Välj ämne...</option>';

    topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.textContent = topic;
        topicSelect.appendChild(option);
    });

    topicGroup.style.display = 'block';
}

function openModal(categoryId, postIndex = null) {
    const modal = document.getElementById('modal');
    document.getElementById('categoryId').value = categoryId;
    document.getElementById('postIndex').value = postIndex !== null ? postIndex : '';

    if (postIndex !== null) {
        const post = posts[categoryId][postIndex];
        document.getElementById('modalTitle').textContent = 'Redigera post';
        document.getElementById('statusInput').value = post.status;
        document.getElementById('pillarInput').value = post.pillar || '';

        if (post.pillar) {
            updateSubcategories();
            document.getElementById('subcategoryInput').value = post.subcategory || '';
            if (post.subcategory) {
                updateTopics();
                document.getElementById('topicTagInput').value = post.topicTag || '';
            }
        }

        document.getElementById('formatInput').value = post.format;
        document.getElementById('materialInput').value = post.material;
        document.getElementById('topicInput').value = post.topic;
        document.getElementById('hookInput').value = post.hook;
        document.getElementById('captionInput').value = post.caption || '';
        document.getElementById('notesInput').value = post.notes || '';
    } else {
        document.getElementById('modalTitle').textContent = 'Skapa post';
        if (!document.getElementById('topicInput').value) {
            document.getElementById('postForm').reset();
            document.getElementById('categoryId').value = categoryId;
            document.getElementById('subcategoryGroup').style.display = 'none';
            document.getElementById('topicGroup').style.display = 'none';
        }
    }

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('postForm').reset();
}

function editPost(catId, index) {
    openModal(catId, index);
}

function deletePost(catId, index) {
    if (confirm('Är du säker på att du vill ta bort denna post?')) {
        posts[catId].splice(index, 1);
        savePosts();

        if (currentPage === 'week') {
            renderWeekPlanning();
        } else if (currentPage.startsWith('cat')) {
            renderCategory(parseInt(currentPage.replace('cat', '')));
        } else {
            renderOverview();
        }
    }
}

function exportData() {
    const dataStr = JSON.stringify(posts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `content-kalender-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

//document.getElementById('postForm').addEventListener('submit', function (e) {
//    e.preventDefault();

//    const catId = parseInt(document.getElementById('categoryId').value);
//    const postIndex = document.getElementById('postIndex').value;

//    const post = {
//        status: document.getElementById('statusInput').value,
//        pillar: document.getElementById('pillarInput').value,
//        subcategory: document.getElementById('subcategoryInput').value,
//        topicTag: document.getElementById('topicTagInput').value,
//        format: document.getElementById('formatInput').value,
//        platform: document.getElementById('platformInput').value,
//        material: document.getElementById('materialInput').value,
//        topic: document.getElementById('topicInput').value,
//        hook: document.getElementById('hookInput').value,
//        caption: document.getElementById('captionInput').value,
//        notes: document.getElementById('notesInput').value,
//        media: currentMedia.length > 0 ? [...currentMedia] : [],
//        created: new Date().toISOString()
//    };

//    if (postIndex !== '') {
//        posts[catId][parseInt(postIndex)] = post;
//    } else {
//        posts[catId].push(post);
//    }

//    savePosts();
//    currentMedia = []; // Reset media after saving
//    closeModal();

//    if (currentPage === 'week') {
//        renderWeekPlanning();
//    } else if (currentPage.startsWith('cat')) {
//        renderCategory(catId);
//    } else {
//        renderOverview();
//    }
//});

document.getElementById('modal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});

// PWA Install functionality (only show when installable)
let deferredPrompt;
const installPrompt = document.getElementById('installPrompt');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show install prompt after 3 seconds if not dismissed
    setTimeout(() => {
        const dismissed = localStorage.getItem('installDismissed');
        if (!dismissed) {
            installPrompt.classList.add('show');
        }
    }, 3000);
});

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                /* logged */
                showNotification('🎉 App installerad!', 'success');
            }
            deferredPrompt = null;
            installPrompt.classList.remove('show');
        });
    } else {
        // Manual instructions if prompt not available
        alert('<svg class="icon"><use href="#icon-smartphone"></use></svg> För att installera appen:\n\n' +
            'På datorn: Tryck på ⊕ ikonen i adressfältet\n' +
            'På iPhone: Tryck på Dela → Lägg till på hemskärmen\n' +
            'På Android: Öppna menyn → Installera app');
        installPrompt.classList.remove('show');
    }
}

function dismissInstall() {
    installPrompt.classList.remove('show');
    localStorage.setItem('installDismissed', 'true');
}

// Register Service Worker (only when running locally, not in Claude artifact viewer)
if ('serviceWorker' in navigator && window.location.protocol === 'file:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                /* logged */
                showNotification('<svg class="icon"><use href="#icon-smartphone"></use></svg> Offline mode aktiv!', 'success');
            })
            .catch(error => {
                /* logged */
            });
    });
}

function showNotification(message, type = 'info') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                background: ${type === 'success' ? '#90ee90' : '#a8dadc'};
                color: #2d5016;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000;
                font-weight: 600;
                animation: slideIn 0.3s ease;
            `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}


// ============================================
// DAILY SCHEDULE MODULE - COMPLETE
// ============================================

// ============================================
// DAGENS SCHEMA MODULE - COMPLETE
// ============================================

const DAILY_SCHEDULE = {
    schedule: [],

    suggestions: [
        'Morgonrutin',
        'Frukost & planering',
        'Deep work',
        'Content creation',
        'Möten/samarbeten',
        'Email & DMs',
        'Lunch & paus',
        'Content strategi',
        'Filming/foto',
        'Redigering',
        'Engagement',
        'Admin & planering',
        'Kvällsrutin',
        'Familj/fritid',
        'Reflektion'
    ],

    init() {
        this.loadSchedule();
        this.render();
    },

    loadSchedule() {
        const saved = localStorage.getItem('linnartistry_daily_schedule');
        if (saved) {
            this.schedule = JSON.parse(saved);
        } else {
            // Tom som default
            this.schedule = [];
        }
    },

    saveSchedule() {
        localStorage.setItem('linnartistry_daily_schedule', JSON.stringify(this.schedule));
    },

    render() {
        const container = document.getElementById('daily-schedule-container');
        if (!container) return;

        // Sort by time
        this.schedule.sort((a, b) => a.time.localeCompare(b.time));

        let html = '';

        if (this.schedule.length === 0) {
            html = `
                <div style="text-align: center; padding: 60px 20px; color: #9b8f7e; background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(10px); border-radius: 20px; border: 2px dashed rgba(212, 165, 116, 0.3);">
                    <div style="font-size: 4em; margin-bottom: 20px; opacity: 0.7;">📅</div>
                    <h3 style="color: #2c2416; margin-bottom: 10px;">Ditt schema är tomt</h3>
                    <p style="margin-bottom: 20px;">Klicka "Lägg till aktivitet" för att börja planera din dag</p>
                </div>
            `;
        } else {
            html = this.schedule.map((item, index) => `
                <div class="schedule-item" style="display: flex; align-items: center; padding: 1rem; background: rgba(250, 248, 245, 0.95); backdrop-filter: blur(10px); border-radius: 12px; border-left: 4px solid #d4a574; box-shadow: 0 3px 12px rgba(0,0,0,0.05); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-bottom: 0.75rem;">
                    <div style="font-weight: 700; color: #d4a574; font-family: 'Playfair Display', serif; font-size: 1.1rem; min-width: 80px;">
                        ${item.time}
                    </div>
                    <div style="flex: 1; color: #2c2416; font-weight: 500; padding: 0 1rem;">
                        ${item.activity}
                    </div>
                    <div class="schedule-actions" style="display: flex; gap: 0.5rem; opacity: 0; transition: opacity 0.3s ease;">
                        <button onclick="DAILY_SCHEDULE.editActivity(${index})" style="padding: 0.25rem 0.75rem; border: none; background: rgba(212, 165, 116, 0.15); border-radius: 6px; cursor: pointer; font-size: 0.85rem; transition: all 0.3s ease; color: #d4a574; font-weight: 600;" title="Redigera">
                            ✏️
                        </button>
                        <button onclick="DAILY_SCHEDULE.deleteActivity(${index})" style="padding: 0.25rem 0.75rem; border: none; background: rgba(255, 107, 107, 0.15); border-radius: 6px; cursor: pointer; font-size: 0.85rem; transition: all 0.3s ease; color: #ff6b6b; font-weight: 600;" title="Ta bort">
                            🗑️
                        </button>
                    </div>
                </div>
            `).join('');
        }

        container.innerHTML = html;

        // Add hover effect via CSS
        const style = document.createElement('style');
        style.textContent = `
            .schedule-item:hover {
                transform: translateX(5px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important;
            }
            .schedule-item:hover .schedule-actions {
                opacity: 1 !important;
            }
        `;
        if (!document.getElementById('schedule-styles')) {
            style.id = 'schedule-styles';
            document.head.appendChild(style);
        }
    },

    addActivity() {
        const modal = document.createElement('div');
        modal.id = 'schedule-modal';
        modal.className = 'modal active';
        modal.style.cssText = 'display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(44, 36, 22, 0.75); backdrop-filter: blur(8px); z-index: 1000; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.3s ease;';

        modal.innerHTML = `
            <div class="modal-content" style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(253, 251, 247, 0.98) 100%); backdrop-filter: blur(20px); padding: 40px; border-radius: 24px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(212, 165, 116, 0.1); animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid rgba(212, 165, 116, 0.15);">
                    <h3 style="font-family: 'Playfair Display', serif; font-size: 2em; color: #2c2416; font-weight: 700; letter-spacing: -0.5px; margin: 0;">Lägg till aktivitet</h3>
                    <button onclick="DAILY_SCHEDULE.closeModal()" style="background: rgba(212, 165, 116, 0.1); border: none; font-size: 1.5em; cursor: pointer; color: #d4a574; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">×</button>
                </div>
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #2c2416; font-size: 0.95em; font-family: 'Poppins', sans-serif; letter-spacing: 0.2px;">Tid *</label>
                    <input type="time" id="schedule-time" style="width: 100%; padding: 14px 18px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em; font-family: 'Poppins', sans-serif; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                </div>
                
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #2c2416; font-size: 0.95em; font-family: 'Poppins', sans-serif; letter-spacing: 0.2px;">Aktivitet *</label>
                    <select id="schedule-activity-select" onchange="DAILY_SCHEDULE.handleActivitySelect()" style="width: 100%; padding: 14px 18px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em; font-family: 'Poppins', sans-serif; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 8px rgba(0,0,0,0.04); margin-bottom: 12px;">
                        <option value="">-- Välj från lista eller skriv egen --</option>
                        ${this.suggestions.map(s => `<option value="${s}">${s}</option>`).join('')}
                        <option value="custom">✏️ Egen aktivitet...</option>
                    </select>
                    <input type="text" id="schedule-activity-custom" placeholder="Skriv din aktivitet..." style="width: 100%; padding: 14px 18px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em; font-family: 'Poppins', sans-serif; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: none;">
                </div>
                
                <div style="display: flex; gap: 15px; margin-top: 35px; padding-top: 25px; border-top: 2px solid rgba(212, 165, 116, 0.1);">
                    <button onclick="DAILY_SCHEDULE.closeModal()" style="flex: 1; padding: 16px; border: none; border-radius: 12px; font-size: 1.05em; font-weight: 600; font-family: 'Poppins', sans-serif; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); letter-spacing: 0.3px; background: rgba(232, 223, 211, 0.5); backdrop-filter: blur(10px); color: #2c2416; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                        Avbryt
                    </button>
                    <button onclick="DAILY_SCHEDULE.saveNewActivity()" style="flex: 1; padding: 16px; border: none; border-radius: 12px; font-size: 1.05em; font-weight: 600; font-family: 'Poppins', sans-serif; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); letter-spacing: 0.3px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 50%, #d4a574 100%); background-size: 200% 100%; color: white; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);">
                        Spara
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    handleActivitySelect() {
        const select = document.getElementById('schedule-activity-select');
        const customInput = document.getElementById('schedule-activity-custom');

        if (select.value === 'custom') {
            customInput.style.display = 'block';
            customInput.focus();
        } else {
            customInput.style.display = 'none';
        }
    },

    saveNewActivity() {
        const time = document.getElementById('schedule-time').value;
        const select = document.getElementById('schedule-activity-select');
        const customInput = document.getElementById('schedule-activity-custom');

        let activity = '';
        if (select.value === 'custom') {
            activity = customInput.value.trim();
        } else {
            activity = select.value;
        }

        if (!time || !activity) {
            alert('Fyll i både tid och aktivitet');
            return;
        }

        this.schedule.push({
            time: time,
            activity: activity
        });

        this.saveSchedule();
        this.render();
        this.closeModal();
    },

    editActivity(index) {
        const item = this.schedule[index];

        const modal = document.createElement('div');
        modal.id = 'schedule-modal';
        modal.className = 'modal active';
        modal.style.cssText = 'display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(44, 36, 22, 0.75); backdrop-filter: blur(8px); z-index: 1000; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.3s ease;';

        modal.innerHTML = `
            <div class="modal-content" style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(253, 251, 247, 0.98) 100%); backdrop-filter: blur(20px); padding: 40px; border-radius: 24px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(212, 165, 116, 0.1); animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid rgba(212, 165, 116, 0.15);">
                    <h3 style="font-family: 'Playfair Display', serif; font-size: 2em; color: #2c2416; font-weight: 700; letter-spacing: -0.5px; margin: 0;">Redigera aktivitet</h3>
                    <button onclick="DAILY_SCHEDULE.closeModal()" style="background: rgba(212, 165, 116, 0.1); border: none; font-size: 1.5em; cursor: pointer; color: #d4a574; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">×</button>
                </div>
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #2c2416; font-size: 0.95em;">Tid *</label>
                    <input type="time" id="schedule-time-edit" value="${item.time}" style="width: 100%; padding: 14px 18px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em; font-family: 'Poppins', sans-serif; background: rgba(255, 255, 255, 0.9); transition: all 0.3s;">
                </div>
                
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #2c2416; font-size: 0.95em;">Aktivitet *</label>
                    <input type="text" id="schedule-activity-edit" value="${item.activity}" style="width: 100%; padding: 14px 18px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em; font-family: 'Poppins', sans-serif; background: rgba(255, 255, 255, 0.9); transition: all 0.3s;">
                </div>
                
                <div style="display: flex; gap: 15px; margin-top: 35px; padding-top: 25px; border-top: 2px solid rgba(212, 165, 116, 0.1);">
                    <button onclick="DAILY_SCHEDULE.closeModal()" style="flex: 1; padding: 16px; border: none; border-radius: 12px; font-size: 1.05em; font-weight: 600; cursor: pointer; background: rgba(232, 223, 211, 0.5); color: #2c2416;">
                        Avbryt
                    </button>
                    <button onclick="DAILY_SCHEDULE.updateActivity(${index})" style="flex: 1; padding: 16px; border: none; border-radius: 12px; font-size: 1.05em; font-weight: 600; cursor: pointer; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);">
                        Spara
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    updateActivity(index) {
        const time = document.getElementById('schedule-time-edit').value;
        const activity = document.getElementById('schedule-activity-edit').value.trim();

        if (!time || !activity) {
            alert('Fyll i både tid och aktivitet');
            return;
        }

        this.schedule[index] = {
            time: time,
            activity: activity
        };

        this.saveSchedule();
        this.render();
        this.closeModal();
    },

    deleteActivity(index) {
        if (confirm('Är du säker på att du vill ta bort denna aktivitet?')) {
            this.schedule.splice(index, 1);
            this.saveSchedule();
            this.render();
        }
    },

    addSuggestions() {
        if (confirm('Lägg till alla 15 standard-aktiviteter? Detta kommer ersätta ditt nuvarande schema.')) {
            this.schedule = [
                { time: '06:00', activity: 'Morgonrutin' },
                { time: '07:00', activity: 'Frukost & planering' },
                { time: '08:00', activity: 'Deep work' },
                { time: '09:00', activity: 'Content creation' },
                { time: '10:00', activity: 'Möten/samarbeten' },
                { time: '11:00', activity: 'Email & DMs' },
                { time: '12:00', activity: 'Lunch & paus' },
                { time: '13:00', activity: 'Content strategi' },
                { time: '14:00', activity: 'Filming/foto' },
                { time: '15:00', activity: 'Redigering' },
                { time: '16:00', activity: 'Engagement' },
                { time: '17:00', activity: 'Admin & planering' },
                { time: '18:00', activity: 'Kvällsrutin' },
                { time: '19:00', activity: 'Familj/fritid' },
                { time: '20:00', activity: 'Reflektion' }
            ];
            this.saveSchedule();
            this.render();
        }
    },

    closeModal() {
        const modal = document.getElementById('schedule-modal');
        if (modal) {
            modal.remove();
        }
    }
};

// Add required animations
const scheduleStyles = document.createElement('style');
scheduleStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;
document.head.appendChild(scheduleStyles);

// ============================================
// AVATAR MANAGER MODULE - COMPLETE
// ============================================

const AVATARS = {
    avatars: [],

    init() {
        this.loadAvatars();
        this.render();
    },

    loadAvatars() {
        const saved = localStorage.getItem('linnartistry_avatars');
        if (saved) {
            this.avatars = JSON.parse(saved);
        }
    },

    saveAvatars() {
        localStorage.setItem('linnartistry_avatars', JSON.stringify(this.avatars));
    },

    render() {
        const container = document.getElementById('avatars-container');
        if (!container) return;

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <div>
                    <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5em; color: #2c2416; margin-bottom: 0.5rem;">👥 Avatarer</h2>
                    <p style="color: #6b5d4f; font-size: 1.1em;">Dina drömkunder & målgrupper</p>
                </div>
                <button onclick="AVATARS.showCreateModal()" class="add-post-btn sparkle" style="padding: 14px 32px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 50%, #d4a574 100%); background-size: 200% 100%; color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 1.05em; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3); transition: all 0.4s;">
                    <svg class="icon"><use href="#icon-plus"></use></svg> Skapa Avatar
                </button>
            </div>
        `;

        if (this.avatars.length === 0) {
            html += `
                <div style="text-align: center; padding: 80px 30px; color: #9b8f7e; background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(10px); border-radius: 20px; border: 2px dashed rgba(212, 165, 116, 0.3);">
                    <div style="font-size: 5em; margin-bottom: 24px; opacity: 0.7;">👤</div>
                    <h3 style="color: #2c2416; margin-bottom: 10px; font-size: 1.5em;">Inga avatarer ännu</h3>
                    <p style="margin-bottom: 20px; font-size: 1.1em;">Skapa din första drömkund-avatar för att börja</p>
                </div>
            `;
        } else {
            html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px;">`;

            this.avatars.forEach((avatar, index) => {
                html += `
                    <div class="avatar-card" style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(253, 251, 247, 0.95) 100%); backdrop-filter: blur(20px); padding: 30px; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04); border: 1px solid rgba(212, 165, 116, 0.15); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;" onclick="AVATARS.viewAvatar(${index})">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                            <div>
                                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.8em; color: #2c2416; margin-bottom: 8px; font-weight: 600;">${avatar.name}</h3>
                                ${avatar.age ? `<p style="color: #6b5d4f; font-size: 0.95em; margin-bottom: 4px;">🎂 ${avatar.age} år</p>` : ''}
                                ${avatar.location ? `<p style="color: #6b5d4f; font-size: 0.95em; margin-bottom: 4px;">📍 ${avatar.location}</p>` : ''}
                                ${avatar.occupation ? `<p style="color: #6b5d4f; font-size: 0.95em;"><svg class="icon"><use href="#icon-document"></use></svg> ${avatar.occupation}</p>` : ''}
                            </div>
                            <button onclick="event.stopPropagation(); AVATARS.deleteAvatar(${index})" style="background: rgba(255, 107, 107, 0.15); border: none; color: #ff6b6b; padding: 8px 12px; border-radius: 8px; cursor: pointer; transition: all 0.3s;"><svg class="icon"><use href="#icon-delete"></use></svg></button>
                        </div>
                        
                        ${avatar.mainProblem ? `
                            <div style="background: rgba(212, 165, 116, 0.1); padding: 15px; border-radius: 12px; border-left: 4px solid #d4a574; margin-bottom: 15px;">
                                <div style="font-weight: 600; color: #d4a574; font-size: 0.85em; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">💔 Största Problem</div>
                                <div style="color: #2c2416; line-height: 1.6;">${avatar.mainProblem}</div>
                            </div>
                        ` : ''}
                        
                        ${avatar.dream ? `
                            <div style="background: rgba(144, 198, 149, 0.1); padding: 15px; border-radius: 12px; border-left: 4px solid #90c695; margin-bottom: 15px;">
                                <div style="font-weight: 600; color: #90c695; font-size: 0.85em; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;"><svg class="icon"><use href="#icon-sparkles"></use></svg> Dröm</div>
                                <div style="color: #2c2416; line-height: 1.6;">${avatar.dream}</div>
                            </div>
                        ` : ''}
                        
                        ${avatar.platforms && avatar.platforms.length > 0 ? `
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px;">
                                ${avatar.platforms.map(p => `<span style="background: rgba(212, 165, 116, 0.15); color: #d4a574; padding: 6px 12px; border-radius: 12px; font-size: 0.85em; font-weight: 600;"><svg class="icon"><use href="#icon-smartphone"></use></svg> ${p}</span>`).join('')}
                            </div>
                        ` : ''}
                        
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(212, 165, 116, 0.15); color: #9b8f7e; font-size: 0.85em; text-align: center;">
                            Klicka för att se fullständig profil →
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        }

        container.innerHTML = html;

        // Add hover effects
        const style = document.createElement('style');
        style.textContent = `
            .avatar-card:hover {
                transform: translateY(-6px) scale(1.02);
                box-shadow: 0 16px 40px rgba(0,0,0,0.1), 0 4px 12px rgba(212, 165, 116, 0.2) !important;
                border-color: rgba(212, 165, 116, 0.3) !important;
            }
        `;
        if (!document.getElementById('avatar-styles')) {
            style.id = 'avatar-styles';
            document.head.appendChild(style);
        }
    },

    showCreateModal() {
        const modal = document.createElement('div');
        modal.id = 'avatar-modal';
        modal.className = 'modal active';
        modal.style.cssText = 'display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(44, 36, 22, 0.75); backdrop-filter: blur(8px); z-index: 1000; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.3s ease;';

        modal.innerHTML = `
            <div class="modal-content" style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(253, 251, 247, 0.98) 100%); backdrop-filter: blur(20px); padding: 40px; border-radius: 24px; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid rgba(212, 165, 116, 0.15);">
                    <h3 style="font-family: 'Playfair Display', serif; font-size: 2em; color: #2c2416; margin: 0;">Skapa Avatar</h3>
                    <button onclick="AVATARS.closeModal()" style="background: rgba(212, 165, 116, 0.1); border: none; font-size: 1.5em; cursor: pointer; color: #d4a574; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">×</button>
                </div>
                
                <form id="avatar-form">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c2416;">Namn på Avatar *</label>
                        <input type="text" name="name" required placeholder="T.ex. Emma, 35" style="width: 100%; padding: 14px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em; font-family: 'Poppins', sans-serif;">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c2416;">Ålder</label>
                            <input type="text" name="age" placeholder="35" style="width: 100%; padding: 14px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c2416;">Plats</label>
                            <input type="text" name="location" placeholder="Stockholm" style="width: 100%; padding: 14px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em;">
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c2416;">Yrke/Sysselsättning</label>
                        <input type="text" name="occupation" placeholder="Marknadschef" style="width: 100%; padding: 14px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em;">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c2416;">Största Problem/Utmaning *</label>
                        <textarea name="mainProblem" required rows="3" placeholder="Vad kämpar de med? Vad håller dem vakna på natten?" style="width: 100%; padding: 14px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em; font-family: 'Poppins', sans-serif; resize: vertical;"></textarea>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c2416;">Dröm & Mål</label>
                        <textarea name="dream" rows="2" placeholder="Vad vill de uppnå? Hur ser deras drömscenario ut?" style="width: 100%; padding: 14px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em; font-family: 'Poppins', sans-serif;"></textarea>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c2416;">Språk & Ton</label>
                        <input type="text" name="language" placeholder="Vänlig, personlig, självironisk" style="width: 100%; padding: 14px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em;">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c2416;">Plattformar (kommaseparerade)</label>
                        <input type="text" name="platforms" placeholder="Instagram, TikTok, Facebook" style="width: 100%; padding: 14px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em;">
                    </div>
                    
                    <div style="display: flex; gap: 15px; margin-top: 30px; padding-top: 25px; border-top: 2px solid rgba(212, 165, 116, 0.1);">
                        <button type="button" onclick="AVATARS.closeModal()" style="flex: 1; padding: 16px; border: none; border-radius: 12px; font-size: 1.05em; font-weight: 600; cursor: pointer; background: rgba(232, 223, 211, 0.5); color: #2c2416;">
                            Avbryt
                        </button>
                        <button type="submit" style="flex: 1; padding: 16px; border: none; border-radius: 12px; font-size: 1.05em; font-weight: 600; cursor: pointer; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);">
                            Spara Avatar
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submit
        document.getElementById('avatar-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const avatar = {
                id: 'avatar_' + Date.now(),
                name: formData.get('name'),
                age: formData.get('age'),
                location: formData.get('location'),
                occupation: formData.get('occupation'),
                mainProblem: formData.get('mainProblem'),
                dream: formData.get('dream'),
                language: formData.get('language'),
                platforms: formData.get('platforms') ? formData.get('platforms').split(',').map(p => p.trim()) : [],
                createdAt: new Date().toISOString()
            };

            this.avatars.push(avatar);
            this.saveAvatars();
            this.render();
            this.closeModal();
        });
    },

    viewAvatar(index) {
        const avatar = this.avatars[index];

        const modal = document.createElement('div');
        modal.id = 'avatar-modal';
        modal.className = 'modal active';
        modal.style.cssText = 'display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(44, 36, 22, 0.75); backdrop-filter: blur(8px); z-index: 1000; align-items: center; justify-content: center; padding: 20px;';

        modal.innerHTML = `
            <div class="modal-content" style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(253, 251, 247, 0.98) 100%); backdrop-filter: blur(20px); padding: 40px; border-radius: 24px; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid rgba(212, 165, 116, 0.15);">
                    <h3 style="font-family: 'Playfair Display', serif; font-size: 2em; color: #2c2416; margin: 0;">${avatar.name}</h3>
                    <button onclick="AVATARS.closeModal()" style="background: rgba(212, 165, 116, 0.1); border: none; font-size: 1.5em; cursor: pointer; color: #d4a574; width: 40px; height: 40px; border-radius: 50%;">×</button>
                </div>
                
                <div style="display: grid; gap: 20px;">
                    ${avatar.age || avatar.location || avatar.occupation ? `
                        <div style="background: rgba(212, 165, 116, 0.05); padding: 20px; border-radius: 16px;">
                            <h4 style="color: #d4a574; margin-bottom: 15px; font-weight: 600;">📋 Grundinfo</h4>
                            ${avatar.age ? `<p style="color: #2c2416; margin-bottom: 8px;">🎂 <strong>Ålder:</strong> ${avatar.age}</p>` : ''}
                            ${avatar.location ? `<p style="color: #2c2416; margin-bottom: 8px;">📍 <strong>Plats:</strong> ${avatar.location}</p>` : ''}
                            ${avatar.occupation ? `<p style="color: #2c2416;"><svg class="icon"><use href="#icon-document"></use></svg> <strong>Yrke:</strong> ${avatar.occupation}</p>` : ''}
                        </div>
                    ` : ''}
                    
                    ${avatar.mainProblem ? `
                        <div style="background: rgba(255, 107, 107, 0.05); padding: 20px; border-radius: 16px; border-left: 4px solid #ff6b6b;">
                            <h4 style="color: #ff6b6b; margin-bottom: 15px; font-weight: 600;">💔 Största Problem</h4>
                            <p style="color: #2c2416; line-height: 1.8;">${avatar.mainProblem}</p>
                        </div>
                    ` : ''}
                    
                    ${avatar.dream ? `
                        <div style="background: rgba(144, 198, 149, 0.05); padding: 20px; border-radius: 16px; border-left: 4px solid #90c695;">
                            <h4 style="color: #90c695; margin-bottom: 15px; font-weight: 600;"><svg class="icon"><use href="#icon-sparkles"></use></svg> Dröm & Mål</h4>
                            <p style="color: #2c2416; line-height: 1.8;">${avatar.dream}</p>
                        </div>
                    ` : ''}
                    
                    ${avatar.language ? `
                        <div style="background: rgba(168, 218, 220, 0.05); padding: 20px; border-radius: 16px; border-left: 4px solid #a8dadc;">
                            <h4 style="color: #a8dadc; margin-bottom: 15px; font-weight: 600;">💬 Språk & Ton</h4>
                            <p style="color: #2c2416; line-height: 1.8;">${avatar.language}</p>
                        </div>
                    ` : ''}
                    
                    ${avatar.platforms && avatar.platforms.length > 0 ? `
                        <div style="background: rgba(212, 165, 116, 0.05); padding: 20px; border-radius: 16px;">
                            <h4 style="color: #d4a574; margin-bottom: 15px; font-weight: 600;"><svg class="icon"><use href="#icon-smartphone"></use></svg> Plattformar</h4>
                            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                                ${avatar.platforms.map(p => `<span style="background: rgba(212, 165, 116, 0.2); color: #d4a574; padding: 8px 16px; border-radius: 12px; font-weight: 600;">${p}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div style="margin-top: 30px; padding-top: 25px; border-top: 2px solid rgba(212, 165, 116, 0.1);">
                    <button onclick="AVATARS.closeModal()" style="width: 100%; padding: 16px; border: none; border-radius: 12px; font-size: 1.05em; font-weight: 600; cursor: pointer; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);">
                        Stäng
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    deleteAvatar(index) {
        if (confirm('Är du säker på att du vill ta bort denna avatar?')) {
            this.avatars.splice(index, 1);
            this.saveAvatars();
            this.render();
        }
    },

    closeModal() {
        const modal = document.getElementById('avatar-modal');
        if (modal) {
            modal.remove();
        }
    }
};

// ============================================
// CONTENT CREATOR MODULE - COMPLETE
// 3-STEP WIZARD
// ============================================

const CONTENT_CREATOR = {
    currentStep: 1,
    selectedAvatar: null,
    selectedFormat: null,
    selectedType: null,

    init() {
        this.currentStep = 1;
        this.selectedAvatar = null;
        this.selectedFormat = null;
        this.selectedType = null;
        this.render();
    },

    render() {
        const container = document.getElementById('creator-container');
        if (!container) return;

        let html = `
            <div style="margin-bottom: 40px;">
                <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5em; color: #2c2416; margin-bottom: 0.5rem;"><svg class="icon"><use href="#icon-sparkles"></use></svg> Content Creator</h2>
                <p style="color: #6b5d4f; font-size: 1.1em;">Skapa professionellt content på 3 minuter</p>
            </div>
            
            <!-- Progress Steps -->
            <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 40px;">
                <div style="flex: 1; max-width: 200px; text-align: center;">
                    <div style="width: 50px; height: 50px; margin: 0 auto 10px; border-radius: 50%; background: ${this.currentStep >= 1 ? 'linear-gradient(135deg, #d4a574 0%, #e8c298 100%)' : 'rgba(212, 165, 116, 0.2)'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2em;">1</div>
                    <div style="font-weight: 600; color: ${this.currentStep >= 1 ? '#d4a574' : '#9b8f7e'};">Välj Avatar</div>
                </div>
                <div style="flex: 1; max-width: 200px; text-align: center;">
                    <div style="width: 50px; height: 50px; margin: 0 auto 10px; border-radius: 50%; background: ${this.currentStep >= 2 ? 'linear-gradient(135deg, #d4a574 0%, #e8c298 100%)' : 'rgba(212, 165, 116, 0.2)'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2em;">2</div>
                    <div style="font-weight: 600; color: ${this.currentStep >= 2 ? '#d4a574' : '#9b8f7e'};">Välj Format</div>
                </div>
                <div style="flex: 1; max-width: 200px; text-align: center;">
                    <div style="width: 50px; height: 50px; margin: 0 auto 10px; border-radius: 50%; background: ${this.currentStep >= 3 ? 'linear-gradient(135deg, #d4a574 0%, #e8c298 100%)' : 'rgba(212, 165, 116, 0.2)'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2em;">3</div>
                    <div style="font-weight: 600; color: ${this.currentStep >= 3 ? '#d4a574' : '#9b8f7e'};">Välj Typ</div>
                </div>
            </div>
        `;

        // Step content
        if (this.currentStep === 1) {
            html += this.renderStep1();
        } else if (this.currentStep === 2) {
            html += this.renderStep2();
        } else if (this.currentStep === 3) {
            html += this.renderStep3();
        } else if (this.currentStep === 4) {
            html += this.renderResults();
        }

        container.innerHTML = html;
    },

    renderStep1() {
        const avatars = AVATARS.avatars || [];

        return `
            <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); padding: 40px; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.8em; color: #2c2416; margin-bottom: 20px;">1. Välj din drömkund</h3>
                
                ${avatars.length === 0 ? `
                    <div style="text-align: center; padding: 60px 20px; color: #9b8f7e;">
                        <div style="font-size: 4em; margin-bottom: 20px;">👤</div>
                        <p style="margin-bottom: 20px; font-size: 1.1em;">Du har inga avatarer ännu</p>
                        <button onclick="showPage('avatars')" style="padding: 14px 32px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600;">
                            Skapa Avatar Först
                        </button>
                    </div>
                ` : `
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                        ${avatars.map((avatar, index) => `
                            <div onclick="CONTENT_CREATOR.selectAvatar(${index})" style="padding: 25px; background: ${this.selectedAvatar === index ? 'linear-gradient(135deg, rgba(212, 165, 116, 0.15) 0%, rgba(212, 165, 116, 0.05) 100%)' : 'rgba(250, 248, 245, 0.9)'}; border: 2px solid ${this.selectedAvatar === index ? '#d4a574' : 'rgba(212, 165, 116, 0.2)'}; border-radius: 16px; cursor: pointer; transition: all 0.3s; box-shadow: ${this.selectedAvatar === index ? '0 8px 24px rgba(212, 165, 116, 0.3)' : '0 3px 12px rgba(0,0,0,0.05)'};">
                                <h4 style="color: #2c2416; margin-bottom: 10px; font-size: 1.2em;">${avatar.name}</h4>
                                ${avatar.mainProblem ? `<p style="color: #6b5d4f; font-size: 0.9em; line-height: 1.6; margin-bottom: 10px;">💔 ${avatar.mainProblem.substring(0, 80)}${avatar.mainProblem.length > 80 ? '...' : ''}</p>` : ''}
                                ${this.selectedAvatar === index ? '<div style="color: #d4a574; font-weight: 600; margin-top: 15px;">✓ Vald</div>' : ''}
                            </div>
                        `).join('')}
                    </div>
                    
                    ${this.selectedAvatar !== null ? `
                        <div style="margin-top: 30px; text-align: right;">
                            <button onclick="CONTENT_CREATOR.nextStep()" style="padding: 16px 40px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 1.1em; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);">
                                Nästa Steg →
                            </button>
                        </div>
                    ` : ''}
                `}
            </div>
        `;
    },

    renderStep2() {
        const formats = [
            { id: 'reel', icon: '<svg class="icon"><use href="#icon-sparkles"></use></svg>', name: 'Reel', desc: '15-60 sek video' },
            { id: 'carousel', icon: '<svg class="icon"><use href="#icon-dashboard"></use></svg>', name: 'Karusell', desc: '5-10 slides' },
            { id: 'story', icon: '<svg class="icon"><use href="#icon-smartphone"></use></svg>', name: 'Story', desc: '15 sek story' },
            { id: 'post', icon: '<svg class="icon"><use href="#icon-document"></use></svg>', name: 'Post', desc: 'Text & bild' }
        ];

        return `
            <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); padding: 40px; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.8em; color: #2c2416; margin-bottom: 20px;">2. Välj format</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                    ${formats.map(format => `
                        <div onclick="CONTENT_CREATOR.selectFormat('${format.id}')" style="text-align: center; padding: 30px 20px; background: ${this.selectedFormat === format.id ? 'linear-gradient(135deg, rgba(212, 165, 116, 0.15) 0%, rgba(212, 165, 116, 0.05) 100%)' : 'rgba(250, 248, 245, 0.9)'}; border: 2px solid ${this.selectedFormat === format.id ? '#d4a574' : 'rgba(212, 165, 116, 0.2)'}; border-radius: 16px; cursor: pointer; transition: all 0.3s;">
                            <div style="font-size: 3rem; margin-bottom: 15px;">${format.icon}</div>
                            <h4 style="color: #2c2416; margin-bottom: 8px;">${format.name}</h4>
                            <p style="color: #6b5d4f; font-size: 0.9em;">${format.desc}</p>
                            ${this.selectedFormat === format.id ? '<div style="color: #d4a574; font-weight: 600; margin-top: 15px;">✓ Valt</div>' : ''}
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: 30px; display: flex; justify-content: space-between;">
                    <button onclick="CONTENT_CREATOR.prevStep()" style="padding: 14px 32px; background: rgba(232, 223, 211, 0.5); color: #2c2416; border: none; border-radius: 12px; cursor: pointer; font-weight: 600;">
                        ← Tillbaka
                    </button>
                    ${this.selectedFormat ? `
                        <button onclick="CONTENT_CREATOR.nextStep()" style="padding: 14px 32px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);">
                            Nästa Steg →
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    },

    renderStep3() {
        const types = [
            { id: 'educational', icon: '<svg class="icon"><use href="#icon-book"></use></svg>', name: 'Educational', desc: 'Lär ut något' },
            { id: 'inspiring', icon: '<svg class="icon"><use href="#icon-sparkles"></use></svg>', name: 'Inspirerande', desc: 'Motivera' },
            { id: 'selling', icon: '<svg class="icon" style="color: #d4a574;"><use href="#icon-target"></use></svg>', name: 'Säljande', desc: 'Erbjudande' },
            { id: 'story', icon: '<svg class="icon"><use href="#icon-book"></use></svg>', name: 'Story', desc: 'Personligt' }
        ];

        return `
            <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); padding: 40px; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.8em; color: #2c2416; margin-bottom: 20px;">3. Välj typ & syfte</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                    ${types.map(type => `
                        <div onclick="CONTENT_CREATOR.selectType('${type.id}')" style="text-align: center; padding: 30px 20px; background: ${this.selectedType === type.id ? 'linear-gradient(135deg, rgba(212, 165, 116, 0.15) 0%, rgba(212, 165, 116, 0.05) 100%)' : 'rgba(250, 248, 245, 0.9)'}; border: 2px solid ${this.selectedType === type.id ? '#d4a574' : 'rgba(212, 165, 116, 0.2)'}; border-radius: 16px; cursor: pointer; transition: all 0.3s;">
                            <div style="font-size: 3rem; margin-bottom: 15px;">${type.icon}</div>
                            <h4 style="color: #2c2416; margin-bottom: 8px;">${type.name}</h4>
                            <p style="color: #6b5d4f; font-size: 0.9em;">${type.desc}</p>
                            ${this.selectedType === type.id ? '<div style="color: #d4a574; font-weight: 600; margin-top: 15px;">✓ Valt</div>' : ''}
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: 30px; display: flex; justify-content: space-between;">
                    <button onclick="CONTENT_CREATOR.prevStep()" style="padding: 14px 32px; background: rgba(232, 223, 211, 0.5); color: #2c2416; border: none; border-radius: 12px; cursor: pointer; font-weight: 600;">
                        ← Tillbaka
                    </button>
                    ${this.selectedType ? `
                        <button onclick="CONTENT_CREATOR.generateContent()" style="padding: 14px 32px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);">
                            Generera Content! 🎉
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    },

    renderResults() {
        const avatar = AVATARS.avatars[this.selectedAvatar];
        const problem = avatar.mainProblem || 'detta';

        const hooks = this.getHooks(this.selectedType, problem);
        const ctas = this.getCTAs(this.selectedType);

        return `
            <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); padding: 40px; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 2em; color: #2c2416; margin-bottom: 30px;">🎉 Ditt Content är klart!</h3>
                
                <!-- Hooks -->
                <div style="margin-bottom: 30px; background: rgba(212, 165, 116, 0.05); padding: 25px; border-radius: 16px; border-left: 4px solid #d4a574;">
                    <h4 style="color: #d4a574; margin-bottom: 20px; font-size: 1.3em;"><svg class="icon"><use href="#icon-target"></use></svg> 5 Hooks (välj en)</h4>
                    ${hooks.map((hook, i) => `
                        <div style="padding: 15px; background: white; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                            <div style="flex: 1;">
                                <div style="color: #9b8f7e; font-size: 0.85em; margin-bottom: 5px;">Hook ${i + 1}</div>
                                <div style="color: #2c2416; font-weight: 500;">${hook}</div>
                            </div>
                            <button onclick="navigator.clipboard.writeText('${hook.replace(/'/g, "\\'")}'); alert('Kopierad!')" style="padding: 8px 16px; background: rgba(212, 165, 116, 0.15); border: none; border-radius: 8px; cursor: pointer; color: #d4a574; font-weight: 600;">
                                <svg class="icon"><use href="#icon-copy"></use></svg> Kopiera
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                <!-- CTAs -->
                <div style="margin-bottom: 30px; background: rgba(144, 198, 149, 0.05); padding: 25px; border-radius: 16px; border-left: 4px solid #90c695;">
                    <h4 style="color: #90c695; margin-bottom: 20px; font-size: 1.3em;">💬 4 CTAs (välj en)</h4>
                    ${ctas.map((cta, i) => `
                        <div style="padding: 15px; background: white; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                            <div style="flex: 1;">
                                <div style="color: #9b8f7e; font-size: 0.85em; margin-bottom: 5px;">CTA ${i + 1}</div>
                                <div style="color: #2c2416; font-weight: 500;">${cta}</div>
                            </div>
                            <button onclick="navigator.clipboard.writeText('${cta.replace(/'/g, "\\'")}'); alert('Kopierad!')" style="padding: 8px 16px; background: rgba(144, 198, 149, 0.15); border: none; border-radius: 8px; cursor: pointer; color: #90c695; font-weight: 600;">
                                <svg class="icon"><use href="#icon-copy"></use></svg> Kopiera
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                <div style="display: flex; gap: 15px;">
                    <button onclick="CONTENT_CREATOR.reset()" style="flex: 1; padding: 16px; background: rgba(232, 223, 211, 0.5); color: #2c2416; border: none; border-radius: 12px; cursor: pointer; font-weight: 600;">
                        Skapa Nytt Content
                    </button>
                    <button onclick="alert('Spara-funktionalitet kommer snart!')" style="flex: 1; padding: 16px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);">
                        <svg class="icon"><use href="#icon-save"></use></svg> Spara till Kalender
                    </button>
                </div>
            </div>
        `;
    },

    getHooks(type, problem) {
        const templates = {
            educational: [
                `3 saker jag önskar att jag visste om ${problem}`,
                `Så löste jag ${problem} på 30 dagar`,
                `Här är vad ingen berättar om ${problem}`,
                `${problem}? Gör DETTA istället`,
                `5 misstag jag gjorde med ${problem}`
            ],
            inspiring: [
                `Om du kämpar med ${problem}, läs detta`,
                `Det här förändrade allt för mig när det gäller ${problem}`,
                `Du är inte ensam med ${problem}`,
                `Från ${problem} till framgång - min resa`,
                `Varför ${problem} inte definierar dig`
            ],
            selling: [
                `Vill du lösa ${problem}? Här är hur`,
                `Trött på ${problem}? Jag har lösningen`,
                `Så hjälper jag dig med ${problem}`,
                `${problem}? Det finns en bättre väg`,
                `Sluta kämpa med ${problem} - börja här`
            ],
            story: [
                `Låt mig berätta om när jag hade ${problem}`,
                `Min resa från ${problem} till framgång`,
                `För 2 år sedan trodde jag aldrig att ${problem} skulle försvinna`,
                `Här är sanningen om ${problem} som ingen berättar`,
                `Vad jag lärde mig av ${problem}`
            ]
        };

        return templates[type] || templates.educational;
    },

    getCTAs(type) {
        const ctas = {
            educational: [
                'Spara detta för senare! 📌',
                'Följ för fler tips →',
                'Kommentera din största utmaning 👇',
                'Dela med någon som behöver se detta'
            ],
            inspiring: [
                'Du klarar det! 💪 Kommentera OM du håller med',
                'Tagga någon som behöver höra detta 💖',
                'Följ för daglig motivation →',
                'Spara och kom tillbaka när du behöver påminnelse'
            ],
            selling: [
                'Länk i bio för att boka samtal 📞',
                'DM mig "INTRESSERAD" för mer info',
                'Klicka länken i bio →',
                'Vill du veta mer? Kommentera JA'
            ],
            story: [
                'Kan du relatera? Kommentera 💬',
                'Vad är din story? Dela nedan 👇',
                'Följ mig för mer personliga berättelser',
                'Spara om detta resonerade med dig'
            ]
        };

        return ctas[type] || ctas.educational;
    },

    selectAvatar(index) {
        this.selectedAvatar = index;
        this.render();
    },

    selectFormat(format) {
        this.selectedFormat = format;
        this.render();
    },

    selectType(type) {
        this.selectedType = type;
        this.render();
    },

    nextStep() {
        this.currentStep++;
        this.render();
    },

    prevStep() {
        this.currentStep--;
        this.render();
    },

    generateContent() {
        this.currentStep = 4;
        this.render();
    },

    reset() {
        this.init();
    }
};

// ============================================
// 30-DAY CALENDAR MODULE - COMPLETE
// ============================================

const CALENDAR_30 = {
    currentDate: new Date(),
    posts: {},

    init() {
        this.loadPosts();
        this.render();
    },

    loadPosts() {
        const saved = localStorage.getItem('linnartistry_calendar30');
        if (saved) {
            this.posts = JSON.parse(saved);
        }
    },

    savePosts() {
        localStorage.setItem('linnartistry_calendar30', JSON.stringify(this.posts));
    },

    render() {
        const container = document.getElementById('calendar30-container');
        if (!container) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const monthNames = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        let html = `
            <div style="margin-bottom: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5em; color: #2c2416;">📅 30-Dagars Kalender</h2>
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <button onclick="CALENDAR_30.prevMonth()" style="padding: 12px 20px; background: rgba(212, 165, 116, 0.15); border: none; border-radius: 10px; cursor: pointer; color: #d4a574; font-weight: 600; transition: all 0.3s;">
                            ← Förra
                        </button>
                        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.8em; color: #2c2416; min-width: 200px; text-align: center;">
                            ${monthNames[month]} ${year}
                        </h3>
                        <button onclick="CALENDAR_30.nextMonth()" style="padding: 12px 20px; background: rgba(212, 165, 116, 0.15); border: none; border-radius: 10px; cursor: pointer; color: #d4a574; font-weight: 600; transition: all 0.3s;">
                            Nästa →
                        </button>
                    </div>
                    <button onclick="CALENDAR_30.goToToday()" style="padding: 12px 24px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);">
                        Idag
                    </button>
                </div>
            </div>
            
            <!-- Calendar Grid -->
            <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); padding: 30px; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); border: 1px solid rgba(212, 165, 116, 0.15);">
                <!-- Weekday Headers -->
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-bottom: 12px;">
                    ${['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map(day => `
                        <div style="text-align: center; font-weight: 700; color: #d4a574; font-size: 0.95em; padding: 10px;">
                            ${day}
                        </div>
                    `).join('')}
                </div>
                
                <!-- Calendar Days -->
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px;">
        `;

        // Empty cells for days before month starts
        const startDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
        for (let i = 0; i < startDay; i++) {
            html += '<div style="aspect-ratio: 1; background: transparent;"></div>';
        }

        // Days of the month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
            const dayPosts = this.posts[dateKey] || [];

            html += `
                <div onclick="CALENDAR_30.openDay('${dateKey}')" style="
                    aspect-ratio: 1;
                    background: ${isToday ? 'linear-gradient(135deg, rgba(212, 165, 116, 0.15) 0%, rgba(212, 165, 116, 0.05) 100%)' : 'rgba(250, 248, 245, 0.9)'};
                    border: 2px solid ${isToday ? '#d4a574' : 'rgba(212, 165, 116, 0.15)'};
                    border-radius: 12px;
                    padding: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                " class="calendar-day">
                    <div style="font-weight: ${isToday ? '700' : '600'}; color: ${isToday ? '#d4a574' : '#2c2416'}; font-size: 1.1em; margin-bottom: 4px;">
                        ${day}
                    </div>
                    ${dayPosts.length > 0 ? `
                        <div style="flex: 1; display: flex; flex-direction: column; gap: 3px; overflow: hidden;">
                            ${dayPosts.slice(0, 3).map(post => {
                const colors = {
                    reel: '#ff8e53',
                    carousel: '#a8dadc',
                    story: '#d4a8e4',
                    post: '#90c695'
                };
                return `
                                    <div style="background: ${colors[post.format] || '#d4a574'}; padding: 4px 6px; border-radius: 6px; font-size: 0.7em; color: white; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                        ${post.title.substring(0, 12)}${post.title.length > 12 ? '...' : ''}
                                    </div>
                                `;
            }).join('')}
                            ${dayPosts.length > 3 ? `
                                <div style="font-size: 0.7em; color: #9b8f7e; font-weight: 600; text-align: center;">
                                    +${dayPosts.length - 3} mer
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }

        html += `
                </div>
            </div>
            
            <!-- Legend -->
            <div style="margin-top: 2rem; display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 20px; height: 20px; background: #ff8e53; border-radius: 6px;"></div>
                    <span style="color: #6b5d4f; font-weight: 500;">Reel</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 20px; height: 20px; background: #a8dadc; border-radius: 6px;"></div>
                    <span style="color: #6b5d4f; font-weight: 500;">Karusell</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 20px; height: 20px; background: #d4a8e4; border-radius: 6px;"></div>
                    <span style="color: #6b5d4f; font-weight: 500;">Story</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 20px; height: 20px; background: #90c695; border-radius: 6px;"></div>
                    <span style="color: #6b5d4f; font-weight: 500;">Post</span>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Add hover effect
        const style = document.createElement('style');
        style.textContent = `
            .calendar-day:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 20px rgba(212, 165, 116, 0.2) !important;
                border-color: #d4a574 !important;
            }
        `;
        if (!document.getElementById('calendar-styles')) {
            style.id = 'calendar-styles';
            document.head.appendChild(style);
        }
    },

    openDay(dateKey) {
        const posts = this.posts[dateKey] || [];

        const modal = document.createElement('div');
        modal.id = 'calendar-modal';
        modal.style.cssText = 'display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(44, 36, 22, 0.75); backdrop-filter: blur(8px); z-index: 1000; align-items: center; justify-content: center; padding: 20px;';

        modal.innerHTML = `
            <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(253, 251, 247, 0.98) 100%); backdrop-filter: blur(20px); padding: 40px; border-radius: 24px; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid rgba(212, 165, 116, 0.15);">
                    <h3 style="font-family: 'Playfair Display', serif; font-size: 2em; color: #2c2416; margin: 0;">📅 ${dateKey}</h3>
                    <button onclick="CALENDAR_30.closeModal()" style="background: rgba(212, 165, 116, 0.1); border: none; font-size: 1.5em; cursor: pointer; color: #d4a574; width: 40px; height: 40px; border-radius: 50%;">×</button>
                </div>
                
                <button onclick="CALENDAR_30.addPost('${dateKey}')" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; margin-bottom: 20px; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);">
                    <svg class="icon"><use href="#icon-plus"></use></svg> Lägg till Content
                </button>
                
                ${posts.length === 0 ? `
                    <div style="text-align: center; padding: 60px 20px; color: #9b8f7e;">
                        <div style="font-size: 4em; margin-bottom: 20px; opacity: 0.5;"><svg class="icon"><use href="#icon-document"></use></svg></div>
                        <p>Ingen planerad content för denna dag</p>
                    </div>
                ` : `
                    <div style="display: grid; gap: 15px;">
                        ${posts.map((post, index) => {
            const colors = {
                reel: '#ff8e53',
                carousel: '#a8dadc',
                story: '#d4a8e4',
                post: '#90c695'
            };
            return `
                                <div style="background: rgba(250, 248, 245, 0.9); padding: 20px; border-radius: 12px; border-left: 4px solid ${colors[post.format] || '#d4a574'};">
                                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                                        <h4 style="color: #2c2416; font-size: 1.2em;">${post.title}</h4>
                                        <button onclick="CALENDAR_30.deletePost('${dateKey}', ${index})" style="background: rgba(255, 107, 107, 0.15); border: none; color: #ff6b6b; padding: 6px 12px; border-radius: 8px; cursor: pointer;"><svg class="icon"><use href="#icon-delete"></use></svg></button>
                                    </div>
                                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                                        <span style="background: ${colors[post.format]}; color: white; padding: 6px 12px; border-radius: 8px; font-size: 0.85em; font-weight: 600;">
                                            ${post.format.toUpperCase()}
                                        </span>
                                        <span style="background: rgba(212, 165, 116, 0.2); color: #d4a574; padding: 6px 12px; border-radius: 8px; font-size: 0.85em; font-weight: 600;">
                                            ${post.status || 'planned'}
                                        </span>
                                    </div>
                                    ${post.hook ? `
                                        <div style="margin-top: 12px; padding: 12px; background: rgba(212, 165, 116, 0.05); border-radius: 8px;">
                                            <div style="font-size: 0.85em; color: #9b8f7e; margin-bottom: 4px;">Hook:</div>
                                            <div style="color: #2c2416;">${post.hook}</div>
                                        </div>
                                    ` : ''}
                                </div>
                            `;
        }).join('')}
                    </div>
                `}
            </div>
        `;

        document.body.appendChild(modal);
    },

    addPost(dateKey) {
        const modal = document.createElement('div');
        modal.id = 'calendar-add-modal';
        modal.style.cssText = 'display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(44, 36, 22, 0.85); backdrop-filter: blur(8px); z-index: 1001; align-items: center; justify-content: center; padding: 20px;';

        modal.innerHTML = `
            <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(253, 251, 247, 0.98) 100%); padding: 40px; border-radius: 24px; max-width: 600px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.4);">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 2em; color: #2c2416; margin-bottom: 20px;">Lägg till Content</h3>
                
                <form id="calendar-post-form">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c2416;">Titel *</label>
                        <input type="text" name="title" required placeholder="T.ex. Morgonrutin reel" style="width: 100%; padding: 14px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em;">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c2416;">Format *</label>
                        <select name="format" required style="width: 100%; padding: 14px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em;">
                            <option value="reel"><svg class="icon"><use href="#icon-sparkles"></use></svg> Reel</option>
                            <option value="carousel"><svg class="icon"><use href="#icon-dashboard"></use></svg> Karusell</option>
                            <option value="story"><svg class="icon"><use href="#icon-smartphone"></use></svg> Story</option>
                            <option value="post"><svg class="icon"><use href="#icon-document"></use></svg> Post</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c2416;">Hook (valfritt)</label>
                        <textarea name="hook" rows="3" placeholder="Din hook..." style="width: 100%; padding: 14px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em; font-family: 'Poppins', sans-serif; resize: vertical;"></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 15px; margin-top: 30px;">
                        <button type="button" onclick="CALENDAR_30.closeAddModal()" style="flex: 1; padding: 16px; background: rgba(232, 223, 211, 0.5); color: #2c2416; border: none; border-radius: 12px; cursor: pointer; font-weight: 600;">
                            Avbryt
                        </button>
                        <button type="submit" style="flex: 1; padding: 16px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);">
                            Spara
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('calendar-post-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            if (!this.posts[dateKey]) {
                this.posts[dateKey] = [];
            }

            this.posts[dateKey].push({
                title: formData.get('title'),
                format: formData.get('format'),
                hook: formData.get('hook'),
                status: 'planned',
                createdAt: new Date().toISOString()
            });

            this.savePosts();
            this.closeAddModal();
            this.closeModal();
            this.render();
        });
    },

    deletePost(dateKey, index) {
        if (confirm('Är du säker på att du vill ta bort denna post?')) {
            this.posts[dateKey].splice(index, 1);
            if (this.posts[dateKey].length === 0) {
                delete this.posts[dateKey];
            }
            this.savePosts();
            this.closeModal();
            this.render();
        }
    },

    prevMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        this.render();
    },

    nextMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        this.render();
    },

    goToToday() {
        this.currentDate = new Date();
        this.render();
    },

    closeModal() {
        const modal = document.getElementById('calendar-modal');
        if (modal) modal.remove();
    },

    closeAddModal() {
        const modal = document.getElementById('calendar-add-modal');
        if (modal) modal.remove();
    }
};

// ============================================
// RESOURCES LIBRARY MODULE - COMPLETE
// 100+ Hooks & 50+ CTAs
// ============================================

const RESOURCES = {
    currentTab: 'hooks',
    searchTerm: '',

    hooks: {
        educational: [
            '3 saker jag önskar att jag visste om...',
            '5 misstag jag gjorde när jag...',
            'Här är vad ingen berättar om...',
            'Så löste jag [problem] på 30 dagar',
            'Varför [vanlig metod] inte fungerar',
            'Det här är skillnaden mellan [X] och [Y]',
            'Allt du behöver veta om...',
            'Steg-för-steg guide till...',
            'Vanliga myter om [topic]',
            'Därför fungerar inte [metod]'
        ],
        inspirational: [
            'Om du kämpar med [X], läs detta',
            'Det här förändrade allt för mig',
            'Du är inte ensam med...',
            'Från [struggle] till [success]',
            'Varför [problem] inte definierar dig',
            'För 2 år sedan trodde jag aldrig...',
            'Här är sanningen som förändrade min syn',
            'Det är okej att känna så här',
            'Du förtjänar bättre än...',
            'Låt inte någon säga att du inte kan'
        ],
        story: [
            'Låt mig berätta om gången när...',
            'För 5 år sedan sa någon till mig...',
            'Jag kommer aldrig glömma den dagen',
            'Min resa från [X] till [Y]',
            'Det här är min sanning',
            'Ingen berättade för mig att...',
            'Jag önskar att jag visste detta tidigare',
            'Här är vad som verkligen hände',
            'Min största lektion någonsin',
            'Det här gjorde jag fel i [situation]'
        ],
        selling: [
            'Vill du [resultat]? Här är hur',
            'Trött på [problem]? Jag har lösningen',
            'Så hjälper jag dig med [problem]',
            '[Problem]? Det finns en bättre väg',
            'Sluta kämpa med [X] - börja här',
            'Detta är vad du behöver för att...',
            'Vad du får när du [action]',
            'Innan du [action], läs detta',
            'Därför väljer [X] antal personer detta',
            'Resultaten talar för sig själva'
        ],
        engagement: [
            'Kommentera JA om du håller med',
            'Vad tycker DU? Kommentera nedan',
            'Håller du med eller inte? 👇',
            'Berätta din story i kommentarerna',
            'Vem behöver höra detta? Tagga dem!',
            'Vilket nummer resonerar mest?',
            'Red flag eller green flag? 🚩💚',
            'Unpopular opinion - håller du med?',
            'Hot take: [statement]',
            'Detta är kontroversiellt men...'
        ],
        question: [
            'Har du någonsin känt så här?',
            'Vad skulle du göra i denna situation?',
            'Kan du relatera till detta?',
            'Vilket är värst: [X] eller [Y]?',
            'Varför pratar ingen om detta?',
            'Är det bara jag eller...?',
            'Vad är din åsikt om detta?',
            'Hur skulle du hantera [situation]?',
            'Vad önskar du att du visste tidigare?',
            'Vad är din största utmaning med [X]?'
        ],
        trending: [
            'POV: Du inser att...',
            'Tell me [X] without telling me [X]',
            'Things I wish I knew at [age]',
            'Red flags jag ignorerade',
            'Green flags att leta efter',
            'It\'s giving [vibe]',
            '[X] vs [Y] - vilken är du?',
            'Romanticize your life',
            'Glow up check <svg class="icon"><use href="#icon-sparkles"></use></svg>',
            'That girl energy'
        ],
        listicle: [
            '7 saker jag slutade göra för att...',
            '5 tecken på att du...',
            '10 gratis sätt att...',
            '3 habits som förändrade mitt liv',
            'Saker ingen berättar om [X]',
            'X things I learned from [experience]',
            'Dagliga rutiner för [resultat]',
            'Produkter värd varje krona',
            'Apps som förändrade mitt liv',
            'Böcker du MÅSTE läsa om [topic]'
        ],
        vulnerability: [
            'Ärligt talat har jag kämpat med...',
            'Ingen ser denna sida av mig',
            'Bakom kulisserna ser det ut så här',
            'Detta är min raw & unfiltered truth',
            'Jag är inte perfekt och det är okej',
            'Real talk: [honest confession]',
            'Det här pratar ingen om',
            'Saker jag önskar att jag sa högre',
            'Min biggest insecurity som jag jobbar på',
            'What anxiety/depression looks like for me'
        ],
        transformation: [
            'Glow up: [Before] → [After]',
            'Så förändrades mitt liv på [tid]',
            'One year ago vs today',
            'What changed? Everything.',
            'Min transformation story',
            'Från [negative state] till [positive state]',
            'Bästa beslutet jag någonsin tog',
            'Innan och efter jag började...',
            'Progress > Perfection',
            'Trust the process. Here\'s mine:'
        ],
        behind_scenes: [
            'Vad ni ser vs vad som faktiskt händer',
            'Verkligheten bakom [polerad bild]',
            'A day in my life - råa versionen',
            'Min faktiska morgonrutin (ej Instagram)',
            'Såhär ser det verkligen ut',
            'Expectations vs reality',
            'Insta vs verkliga livet',
            'What really goes into [process]',
            'Behind the scenes av [content]',
            'Nobody talks about this part'
        ]
    },

    ctas: {
        engagement: [
            'Följ för fler tips →',
            'Spara detta för senare! 📌',
            'Kommentera din största utmaning 👇',
            'Dela med någon som behöver se detta',
            'Dubbel-tappa om du håller med <svg class="icon" style="color: #d4a574;"><use href="#icon-star"></use></svg><svg class="icon" style="color: #d4a574;"><use href="#icon-star"></use></svg>',
            'Tagga någon som behöver detta',
            'Håller du med? Kommentera JA',
            'Vad tycker du? Skriv i kommentarerna',
            'Vilket nummer resonerar mest?',
            'Spara och dela med en vän'
        ],
        action: [
            'Länk i bio för att boka samtal 📞',
            'DM mig "INTRESSERAD" för mer info',
            'Klicka länken i bio →',
            'Swipe up för att läsa mer',
            'Besök länken i bio för gratis guide',
            'Boka ditt gratis samtal via länken',
            'Anmäl dig via länken i bion',
            'Ladda ner gratis [resurs] - länk i bio',
            'Boka din plats nu - begränsat antal',
            'Klicka för att komma igång'
        ],
        community: [
            'Gå med i vår community - länk i bio',
            'Följ för daglig inspiration',
            'Bli en del av vår tribe →',
            'Join the movement - länk i bio',
            'Vi ses i [community name]!',
            'Exclusive content in my [platform]',
            'Want more? Join my newsletter',
            'Behind the scenes in min Facebook grupp',
            'Let\'s connect! DM mig',
            'Subscribe för mer content'
        ],
        value: [
            'Spara för senare! 📑',
            'Bookmark detta',
            'Dela med andra som kan ha nytta',
            'Screenshot och påminn dig själv',
            'Spara till din favorit-kollektion',
            'Send this to someone who needs it',
            'Spara och återkom när du behöver',
            'Screenshot och använd som motivation',
            'Dela värdet vidare',
            'Pass this on!'
        ],
        question: [
            'Vad tror du? 🤔',
            'Håller du med eller inte?',
            'Vilket är ditt svar?',
            'Berätta i kommentarerna!',
            'Jag vill höra din story 👇',
            'Din tur - kommentera nedan',
            'What\'s your take?',
            'Relaterar du? Låt mig veta',
            'Hur skulle du göra?',
            'Vad skulle du lägga till?'
        ]
    },

    init() {
        this.render();
    },

    render() {
        const container = document.getElementById('resources-container');
        if (!container) return;

        let html = `
            <div style="margin-bottom: 2rem;">
                <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5em; color: #2c2416; margin-bottom: 0.5rem;"><svg class="icon"><use href="#icon-target"></use></svg> Hooks & CTAs</h2>
                <p style="color: #6b5d4f; font-size: 1.1em;">100+ hooks och 50+ CTAs för alla situationer</p>
            </div>
            
            <!-- Tabs -->
            <div style="display: flex; gap: 15px; margin-bottom: 2rem;">
                <button onclick="RESOURCES.switchTab('hooks')" style="padding: 14px 32px; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s; ${this.currentTab === 'hooks' ? 'background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);' : 'background: rgba(212, 165, 116, 0.15); color: #d4a574;'}">
                    <svg class="icon"><use href="#icon-target"></use></svg> Hooks (100+)
                </button>
                <button onclick="RESOURCES.switchTab('ctas')" style="padding: 14px 32px; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s; ${this.currentTab === 'ctas' ? 'background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);' : 'background: rgba(212, 165, 116, 0.15); color: #d4a574;'}">
                    💬 CTAs (50+)
                </button>
            </div>
            
            <!-- Search -->
            <div style="margin-bottom: 2rem;">
                <input type="text" id="resources-search" placeholder="Sök hooks eller CTAs..." onkeyup="RESOURCES.search(this.value)" style="width: 100%; padding: 16px 20px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em; font-family: 'Poppins', sans-serif; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px);">
            </div>
        `;

        if (this.currentTab === 'hooks') {
            html += this.renderHooks();
        } else {
            html += this.renderCTAs();
        }

        container.innerHTML = html;
    },

    renderHooks() {
        let html = '';

        for (const [category, items] of Object.entries(this.hooks)) {
            const filteredItems = this.searchTerm
                ? items.filter(item => item.toLowerCase().includes(this.searchTerm.toLowerCase()))
                : items;

            if (filteredItems.length === 0) continue;

            const categoryNames = {
                educational: '<svg class="icon"><use href="#icon-book"></use></svg> Educational',
                inspirational: '<svg class="icon"><use href="#icon-sparkles"></use></svg> Inspirational',
                story: '<svg class="icon"><use href="#icon-book"></use></svg> Story/Personal',
                selling: '<svg class="icon" style="color: #d4a574;"><use href="#icon-target"></use></svg> Selling',
                engagement: '💬 Engagement',
                question: '❓ Questions',
                trending: '🔥 Trending',
                listicle: '<svg class="icon"><use href="#icon-document"></use></svg> Listicle',
                vulnerability: '💙 Vulnerability',
                transformation: '🦋 Transformation',
                behind_scenes: '<svg class="icon"><use href="#icon-sparkles"></use></svg> Behind the Scenes'
            };

            html += `
                <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); padding: 30px; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); border: 1px solid rgba(212, 165, 116, 0.15); margin-bottom: 2rem;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.8em; color: #2c2416; margin-bottom: 20px;">${categoryNames[category] || category}</h3>
                    <div style="display: grid; gap: 12px;">
                        ${filteredItems.map(hook => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: rgba(250, 248, 245, 0.9); border-radius: 12px; border-left: 4px solid #d4a574; transition: all 0.3s;" class="resource-item">
                                <div style="flex: 1; color: #2c2416; font-weight: 500;">${hook}</div>
                                <button onclick="navigator.clipboard.writeText('${hook.replace(/'/g, "\\'")}'); this.textContent = '✓ Kopierad!'; setTimeout(() => this.textContent = '<svg class="icon"><use href="#icon-copy"></use></svg> Kopiera', 2000)" style="padding: 8px 16px; background: rgba(212, 165, 116, 0.15); border: none; border-radius: 8px; cursor: pointer; color: #d4a574; font-weight: 600; transition: all 0.3s; white-space: nowrap;">
                                    <svg class="icon"><use href="#icon-copy"></use></svg> Kopiera
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        return html || '<div style="text-align: center; padding: 60px; color: #9b8f7e;">Inga resultat hittades</div>';
    },

    renderCTAs() {
        let html = '';

        for (const [category, items] of Object.entries(this.ctas)) {
            const filteredItems = this.searchTerm
                ? items.filter(item => item.toLowerCase().includes(this.searchTerm.toLowerCase()))
                : items;

            if (filteredItems.length === 0) continue;

            const categoryNames = {
                engagement: '💬 Engagement',
                action: '<svg class="icon"><use href="#icon-target"></use></svg> Action/Conversion',
                community: '👥 Community Building',
                value: '📌 Value/Save',
                question: '❓ Questions'
            };

            html += `
                <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); padding: 30px; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); border: 1px solid rgba(212, 165, 116, 0.15); margin-bottom: 2rem;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.8em; color: #2c2416; margin-bottom: 20px;">${categoryNames[category] || category}</h3>
                    <div style="display: grid; gap: 12px;">
                        ${filteredItems.map(cta => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: rgba(250, 248, 245, 0.9); border-radius: 12px; border-left: 4px solid #90c695; transition: all 0.3s;" class="resource-item">
                                <div style="flex: 1; color: #2c2416; font-weight: 500;">${cta}</div>
                                <button onclick="navigator.clipboard.writeText('${cta.replace(/'/g, "\\'")}'); this.textContent = '✓ Kopierad!'; setTimeout(() => this.textContent = '<svg class="icon"><use href="#icon-copy"></use></svg> Kopiera', 2000)" style="padding: 8px 16px; background: rgba(144, 198, 149, 0.15); border: none; border-radius: 8px; cursor: pointer; color: #90c695; font-weight: 600; transition: all 0.3s; white-space: nowrap;">
                                    <svg class="icon"><use href="#icon-copy"></use></svg> Kopiera
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        return html || '<div style="text-align: center; padding: 60px; color: #9b8f7e;">Inga resultat hittades</div>';
    },

    switchTab(tab) {
        this.currentTab = tab;
        this.searchTerm = '';
        this.render();
    },

    search(term) {
        this.searchTerm = term;
        this.render();
    }
};

// Add hover effect
const resourceStyles = document.createElement('style');
resourceStyles.textContent = `
    .resource-item:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
    }
`;
document.head.appendChild(resourceStyles);

// ============================================
// SOCIAL MEDIA MODULE - COMPLETE
// ============================================

const SOCIAL_MEDIA = {
    platforms: [
        { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E1306C', connected: false },
        { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000', connected: false },
        { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2', connected: false },
        { id: 'youtube', name: 'YouTube', icon: '▶️', color: '#FF0000', connected: false },
        { id: 'linkedin', name: 'LinkedIn', icon: '<svg class="icon"><use href="#icon-document"></use></svg>', color: '#0A66C2', connected: false },
        { id: 'pinterest', name: 'Pinterest', icon: '📌', color: '#E60023', connected: false }
    ],

    init() {
        this.loadConnections();
        this.render();
    },

    loadConnections() {
        const saved = localStorage.getItem('linnartistry_social_connections');
        if (saved) {
            const connections = JSON.parse(saved);
            this.platforms.forEach(platform => {
                platform.connected = connections[platform.id] || false;
            });
        }
    },

    saveConnections() {
        const connections = {};
        this.platforms.forEach(platform => {
            connections[platform.id] = platform.connected;
        });
        localStorage.setItem('linnartistry_social_connections', JSON.stringify(connections));
    },

    render() {
        const container = document.getElementById('social-container');
        if (!container) return;

        let html = `
            <div style="margin-bottom: 2rem;">
                <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5em; color: #2c2416; margin-bottom: 0.5rem;"><svg class="icon"><use href="#icon-smartphone"></use></svg> Social Media</h2>
                <p style="color: #6b5d4f; font-size: 1.1em;">Anslut och hantera dina sociala plattformar</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
                ${this.platforms.map(platform => `
                    <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(253, 251, 247, 0.95) 100%); backdrop-filter: blur(20px); padding: 30px; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); border: 1px solid rgba(212, 165, 116, 0.15); transition: all 0.4s;" class="social-card">
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                            <div style="font-size: 3rem;">${platform.icon}</div>
                            <div style="flex: 1;">
                                <h3 style="color: #2c2416; font-size: 1.4em; margin-bottom: 4px;">${platform.name}</h3>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 10px; height: 10px; border-radius: 50%; background: ${platform.connected ? '#90c695' : '#ff6b6b'};"></div>
                                    <span style="color: ${platform.connected ? '#90c695' : '#ff6b6b'}; font-weight: 600; font-size: 0.9em;">
                                        ${platform.connected ? 'Ansluten' : 'Ej ansluten'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <button onclick="SOCIAL_MEDIA.toggleConnection('${platform.id}')" style="width: 100%; padding: 14px; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s; ${platform.connected ? 'background: rgba(255, 107, 107, 0.15); color: #ff6b6b;' : 'background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);'}">
                            ${platform.connected ? '🔌 Koppla från' : '🔗 Anslut'}
                        </button>
                        
                        ${platform.connected ? `
                            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(212, 165, 116, 0.15);">
                                <div style="display: grid; gap: 8px;">
                                    <button onclick="alert('Post-funktionalitet kommer snart!')" style="padding: 10px; background: rgba(212, 165, 116, 0.1); border: none; border-radius: 8px; cursor: pointer; color: #d4a574; font-weight: 600; transition: all 0.3s; text-align: left;">
                                        <svg class="icon"><use href="#icon-document"></use></svg> Skapa post
                                    </button>
                                    <button onclick="alert('Schemalägg-funktionalitet kommer snart!')" style="padding: 10px; background: rgba(212, 165, 116, 0.1); border: none; border-radius: 8px; cursor: pointer; color: #d4a574; font-weight: 600; transition: all 0.3s; text-align: left;">
                                        📅 Schemalägg
                                    </button>
                                    <button onclick="alert('Statistik kommer snart!')" style="padding: 10px; background: rgba(212, 165, 116, 0.1); border: none; border-radius: 8px; cursor: pointer; color: #d4a574; font-weight: 600; transition: all 0.3s; text-align: left;">
                                        <svg class="icon"><use href="#icon-dashboard"></use></svg> Se statistik
                                    </button>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            
            <!-- Info Box -->
            <div style="margin-top: 3rem; padding: 30px; background: rgba(212, 165, 116, 0.05); border-radius: 16px; border-left: 4px solid #d4a574;">
                <h4 style="color: #d4a574; margin-bottom: 15px; font-size: 1.2em;">ℹ️ Information</h4>
                <p style="color: #2c2416; line-height: 1.8; margin-bottom: 12px;">
                    Anslutning till sociala medier är för närvarande simulerad i detta demo. I en fullständig version skulle du kunna:
                </p>
                <ul style="color: #2c2416; line-height: 1.8; padding-left: 20px;">
                    <li>Posta direkt från appen</li>
                    <li>Schemalägg inlägg i förväg</li>
                    <li>Se engagement och statistik</li>
                    <li>Hantera flera konton per plattform</li>
                    <li>Cross-posta till flera plattformar samtidigt</li>
                </ul>
            </div>
        `;

        container.innerHTML = html;

        const style = document.createElement('style');
        style.textContent = `
            .social-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important;
            }
        `;
        if (!document.getElementById('social-styles')) {
            style.id = 'social-styles';
            document.head.appendChild(style);
        }
    },

    toggleConnection(platformId) {
        const platform = this.platforms.find(p => p.id === platformId);
        if (platform) {
            platform.connected = !platform.connected;
            this.saveConnections();
            this.render();
        }
    }
};

// ============================================
// SETTINGS MODULE - COMPLETE
// ============================================

const SETTINGS = {
    currentTab: 'account',
    userData: {
        name: '',
        email: '',
        profiles: ['LinnArtistry']
    },

    init() {
        this.loadData();
        this.render();
    },

    loadData() {
        const saved = localStorage.getItem('linnartistry_user_data');
        if (saved) {
            this.userData = { ...this.userData, ...JSON.parse(saved) };
        }
    },

    saveData() {
        localStorage.setItem('linnartistry_user_data', JSON.stringify(this.userData));
    },

    render() {
        const container = document.getElementById('settings-container');
        if (!container) return;

        let html = `
            <div style="margin-bottom: 2rem;">
                <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5em; color: #2c2416; margin-bottom: 0.5rem;">⚙️ Inställningar</h2>
                <p style="color: #6b5d4f; font-size: 1.1em;">Hantera ditt konto och preferenser</p>
            </div>
            
            <!-- Tabs -->
            <div style="display: flex; gap: 15px; margin-bottom: 2rem; flex-wrap: wrap;">
                <button onclick="SETTINGS.switchTab('account')" style="padding: 14px 28px; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s; ${this.currentTab === 'account' ? 'background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);' : 'background: rgba(212, 165, 116, 0.15); color: #d4a574;'}">
                    👤 Konto
                </button>
                <button onclick="SETTINGS.switchTab('profiles')" style="padding: 14px 28px; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s; ${this.currentTab === 'profiles' ? 'background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);' : 'background: rgba(212, 165, 116, 0.15); color: #d4a574;'}">
                    <svg class="icon"><use href="#icon-sparkles"></use></svg> Profiler
                </button>
                <button onclick="SETTINGS.switchTab('backup')" style="padding: 14px 28px; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s; ${this.currentTab === 'backup' ? 'background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);' : 'background: rgba(212, 165, 116, 0.15); color: #d4a574;'}">
                    💾 Backup
                </button>
            </div>
            
            <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); padding: 40px; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); border: 1px solid rgba(212, 165, 116, 0.15);">
        `;

        if (this.currentTab === 'account') {
            html += this.renderAccount();
        } else if (this.currentTab === 'profiles') {
            html += this.renderProfiles();
        } else if (this.currentTab === 'backup') {
            html += this.renderBackup();
        }

        html += `</div>`;

        container.innerHTML = html;
    },

    renderAccount() {
        return `
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.8em; color: #2c2416; margin-bottom: 25px;">Konto Information</h3>
            
            <form id="account-form" onsubmit="SETTINGS.saveAccount(event)">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c2416;">Namn</label>
                    <input type="text" name="name" value="${this.userData.name || ''}" placeholder="Ditt namn" style="width: 100%; padding: 14px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em; font-family: 'Poppins', sans-serif;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c2416;">Email</label>
                    <input type="email" name="email" value="${this.userData.email || ''}" placeholder="din@email.com" style="width: 100%; padding: 14px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em; font-family: 'Poppins', sans-serif;">
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c2416;">Lösenord</label>
                    <input type="password" placeholder="••••••••" style="width: 100%; padding: 14px; border: 2px solid rgba(212, 165, 116, 0.25); border-radius: 12px; font-size: 1em; font-family: 'Poppins', sans-serif;">
                    <p style="color: #9b8f7e; font-size: 0.85em; margin-top: 6px;">Lämna tomt för att behålla nuvarande lösenord</p>
                </div>
                
                <button type="submit" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 1.05em; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);">
                    <svg class="icon"><use href="#icon-save"></use></svg> Spara Ändringar
                </button>
            </form>
        `;
    },

    renderProfiles() {
        return `
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.8em; color: #2c2416; margin-bottom: 25px;">Business Profiler</h3>
            
            <p style="color: #6b5d4f; margin-bottom: 25px; line-height: 1.7;">
                Hantera flera business-profiler med separata avatarer, content och scheman för varje verksamhet.
            </p>
            
            <div style="display: grid; gap: 15px; margin-bottom: 25px;">
                ${this.userData.profiles.map((profile, index) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: rgba(250, 248, 245, 0.9); border-radius: 12px; border-left: 4px solid #d4a574;">
                        <div>
                            <h4 style="color: #2c2416; font-size: 1.2em; margin-bottom: 4px;">${profile}</h4>
                            <p style="color: #9b8f7e; font-size: 0.9em;">Aktiv profil</p>
                        </div>
                        ${this.userData.profiles.length > 1 ? `
                            <button onclick="SETTINGS.deleteProfile(${index})" style="padding: 8px 16px; background: rgba(255, 107, 107, 0.15); border: none; border-radius: 8px; cursor: pointer; color: #ff6b6b; font-weight: 600;">
                                🗑️ Ta bort
                            </button>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            
            <button onclick="SETTINGS.addProfile()" style="width: 100%; padding: 16px; background: rgba(212, 165, 116, 0.15); color: #d4a574; border: 2px dashed rgba(212, 165, 116, 0.4); border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 1.05em; transition: all 0.3s;">
                <svg class="icon"><use href="#icon-plus"></use></svg> Lägg till Ny Profil
            </button>
        `;
    },

    renderBackup() {
        return `
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.8em; color: #2c2416; margin-bottom: 25px;">Backup & Export</h3>
            
            <div style="display: grid; gap: 20px;">
                <div style="padding: 25px; background: rgba(144, 198, 149, 0.05); border-radius: 16px; border-left: 4px solid #90c695;">
                    <h4 style="color: #90c695; margin-bottom: 15px; font-size: 1.2em;">💾 Exportera Data</h4>
                    <p style="color: #2c2416; margin-bottom: 20px; line-height: 1.7;">
                        Exportera all din data som JSON-fil. Inkluderar avatarer, schema, content och inställningar.
                    </p>
                    <button onclick="SETTINGS.exportData()" style="padding: 14px 28px; background: linear-gradient(135deg, #90c695 0%, #a8dadc 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 16px rgba(144, 198, 149, 0.3);">
                        📥 Exportera Data
                    </button>
                </div>
                
                <div style="padding: 25px; background: rgba(212, 165, 116, 0.05); border-radius: 16px; border-left: 4px solid #d4a574;">
                    <h4 style="color: #d4a574; margin-bottom: 15px; font-size: 1.2em;">📤 Importera Data</h4>
                    <p style="color: #2c2416; margin-bottom: 20px; line-height: 1.7;">
                        Återställ din data från en tidigare exporterad JSON-fil.
                    </p>
                    <input type="file" id="import-file" accept=".json" style="display: none;" onchange="SETTINGS.importData(this)">
                    <button onclick="document.getElementById('import-file').click()" style="padding: 14px 28px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);">
                        📤 Importera Data
                    </button>
                </div>
                
                <div style="padding: 25px; background: rgba(255, 107, 107, 0.05); border-radius: 16px; border-left: 4px solid #ff6b6b;">
                    <h4 style="color: #ff6b6b; margin-bottom: 15px; font-size: 1.2em;">⚠️ Återställ Allt</h4>
                    <p style="color: #2c2416; margin-bottom: 20px; line-height: 1.7;">
                        Radera ALL data och börja om från början. Denna åtgärd kan INTE ångras.
                    </p>
                    <button onclick="SETTINGS.resetAll()" style="padding: 14px 28px; background: rgba(255, 107, 107, 0.15); color: #ff6b6b; border: 2px solid #ff6b6b; border-radius: 10px; cursor: pointer; font-weight: 600;">
                        🗑️ Återställ Allt
                    </button>
                </div>
            </div>
        `;
    },

    switchTab(tab) {
        this.currentTab = tab;
        this.render();
    },

    saveAccount(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        this.userData.name = formData.get('name');
        this.userData.email = formData.get('email');
        this.saveData();
        alert('✅ Konto uppdaterat!');
    },

    addProfile() {
        const name = prompt('Namn på ny profil:');
        if (name && name.trim()) {
            this.userData.profiles.push(name.trim());
            this.saveData();
            this.render();
        }
    },

    deleteProfile(index) {
        if (confirm('Är du säker på att du vill ta bort denna profil?')) {
            this.userData.profiles.splice(index, 1);
            this.saveData();
            this.render();
        }
    },

    exportData() {
        const data = {
            userData: this.userData,
            avatars: AVATARS.avatars,
            schedule: DAILY_SCHEDULE.schedule,
            calendar: CALENDAR_30.posts,
            socialConnections: SOCIAL_MEDIA.platforms.reduce((acc, p) => {
                acc[p.id] = p.connected;
                return acc;
            }, {}),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `linnartistry-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        alert('✅ Data exporterad!');
    },

    importData(input) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (confirm('Detta kommer ersätta all din nuvarande data. Fortsätt?')) {
                    // Restore data
                    if (data.userData) {
                        this.userData = data.userData;
                        this.saveData();
                    }
                    if (data.avatars) {
                        AVATARS.avatars = data.avatars;
                        AVATARS.saveAvatars();
                    }
                    if (data.schedule) {
                        DAILY_SCHEDULE.schedule = data.schedule;
                        DAILY_SCHEDULE.saveSchedule();
                    }
                    if (data.calendar) {
                        CALENDAR_30.posts = data.calendar;
                        CALENDAR_30.savePosts();
                    }
                    if (data.socialConnections) {
                        SOCIAL_MEDIA.platforms.forEach(platform => {
                            platform.connected = data.socialConnections[platform.id] || false;
                        });
                        SOCIAL_MEDIA.saveConnections();
                    }

                    alert('✅ Data importerad!');
                    location.reload();
                }
            } catch (error) {
                alert('❌ Ogiltig backup-fil');
            }
        };
        reader.readAsText(file);
    },

    resetAll() {
        if (confirm('⚠️ VARNING: Detta raderar ALL data permanent. Är du HELT säker?')) {
            if (confirm('Sista chansen! Detta KAN INTE ångras.')) {
                localStorage.clear();
                alert('✅ All data raderad. Sidan laddas om...');
                location.reload();
            }
        }
    }
};
// Initialize
initializePosts();
renderOverview();


// ======================================================================
// MASTER CONTENT CREATOR MODULE
// ======================================================================

// ========================================================================
// MASTER CONTENT CREATOR SYSTEM - COMPLETE MODULE
// ========================================================================

// Post Object System

// ========================================
// CONTENT TEMPLATES FROM EXCEL
// ========================================


// ========================================================================
// CONTENT TEMPLATES & RESOURCES - FROM EXCEL  
// ========================================================================

const CONTENT_TEMPLATES = {
    'Inspirerande': [
        `Det är något så speciellt med [infoga ämne som relaterar till din produkt eller något du tror på. EXEMPEL: att kunna stödja välgörenhetsorganisationen XYZ genom våra XYZ-produkter].

[infoga känslor eller fördelar. EXEMPEL: känslan av att veta att våra produkter faktiskt hjälper människor, att det finns en avkastning till samhället. Det lämnar mig helt mållös].

Du kommer hitta mig här idag, leende från öra till öra. Och jag hoppas att det här också får DIG att le!`,
        `[XYZ kund/klient.] letade efter [XYZ produkt. EXEMPEL: det perfekta skräddarsydda skrivbordet för deras kontor].

Vad vi istället gav dem? Well, vi gav dem självklart det.

Men vi gav dem också, precis som alltid när vi levererar en produkt, ännu mer och ännu bättre!

Därför såg vi till att också [infoga hur din produkt påverkade din kund genom din unika försäljningspunkt. EXEMPEL: inte bara hade de rätt skrivbord för sitt utrymme, utan det var också en snabb process för att få det till dem så snabbt som möjligt eftersom kunden berättade för oss att det var på grund av kronisk ryggsmärta de behövde detta, så vi ville se till att de inte behövde vänta en extra dag med sitt gamla oergonomiska skrivvbord].

För oss handlar det inte bara om [infoga XYZ produkt/tjänst].

Vi strävar efter att överträffa förväntningar och [infoga ett sätt du gör saker annorlunda].

För det här, det är precis vad som gör oss annorlunda i den här branschen!`,
        `Hemligheten är ute. [Jag/vi] gör saker lite annorlunda här på [företagsnamn]. Men på det BÄSTA sättet!

Så här är det, när du arbetar med mig/oss eller köper från mig/oss kan du förvänta dig några saker

1 [Infoga exempel: Dina videosamtal med mig kommer inte bara att vara fylld av värme och kunskap, utan du kommer också troligen att träffa Evie, den fyrbenta kontorsassistenten.]

2 [Infoga exempel: Priset? Kommer att få dig att dubbelkolla om du läste rätt, för jag ser till att hålla din investering så låg som möjligt eftersom små företag inte har stora budgetar men FÖRTJÄNAR stor support.]

3 [Infoga exempel]

Och listan fortsätter...

Dessa saker - både små och stora - gör [företagsnamn] till vad det är, och de är saker som gör [oss/mig] jäkligt stolta! P

S vill du veta mer om [tjänsten eller produkten]? Besök länken i min bio!`,
        `När jag startade [företagsnamn] var det en sak jag ville ha mer än någonting annat.

Och det var att [infoga din vision, uppdrag eller syfte. EXEMPEL: hjälpa kvinnor att känna sig hemma i sina kroppar genom snygga OCH bekväma kläder till bra pris!].

Och idag? Vaknade jag upp med [något autentiskt du skulle säga: t.ex. mitt hjärta så fullt och tacksamt, en känsla av att befinna mig på toppen av världen, ganska jävla lycklig. EXEMPEL med mitt hjärta fullt av kärlek efter ett fantastiskt kundsamtal igår] och vetskapen att [var är du i ditt företag? Är du på väg att uppnå din vision eller lever du den redan? Prata om det. EXEMPEL: jag har byggt upp ett företag som gör just det]. [du kan utveckla en historia eller upplevelse här om du önskar].

Och jag är tacksam varje dag för er alla, de otroliga [kunder/klienter/gemenskap] som stöttar mig för att förverkliga denna vision.

Nu, om ni ursäktar mig, ska jag iväg och nypa mig själv i armen för att påminna mig om att detta inte bara är en dröm!`,
        `NOTE: para med en karusell med recensioner

---

Har du någonsin funderat på [FAQ om din produkt. EXEMPEL: hur vi kan tillverka så många handgjorda produkter - av så hög kvalitet - men ändå till så förmånliga priser?]

Håll i dig för idag ska jag dela med mig av detaljerna!

[infoga information här för att besvara frågan. EXEMPEL: Här på företagsnamn tillverkar vi våra produkter på det här sättet...].

Och det? Det är varför så många människor också har så många fantastiska saker att säga om [företagsnamn]!

Svep genom inlägget för att se några recensioner från fantastiska [medlemmar/kunder/klienter]!

Har du några frågor om [ämnet. EXEMPEL: våra produkter]? Isåfall, skicka ett DM eller känn dig fri att lämna dem nedan! Jag skulle älska att svara på dem!`,
        `Saken jag ALDRIG skulle göra här på [företagsnamn]?

Är [dela ett ämne som är viktigt för dig. Detta kan vara något från dina varumärkesvärderingar. EXEMPEL: använda material som har stor negativ påverkan på naturen].

För mig? [Infoga vad du står för/vad som är viktigt för dig och varför. EXEMPEL: Är det viktigt att vi gör allt vi kan för att minska vår påverkan på naturen]

[Utveckla mer om det behövs].

Är [ämnet. EXEMPEL: glädje] något som är viktigt för dig i ditt [liv/resa/dag/företag]?`,
        `Jag värderar inte [sak du inte värderar. EXEMPEL: fin förpackning som inte gör något annat än att skapa högre kostnader], jag värderar [företagsvärde/särdrag. EXEMPEL: att lägga fokus på de faktiska produkterna inuti.]

För mig, [autentiskt uppdrag/vision/övertygelse. EXEMPEL: jag vill att du ska ha den bästa hudvården möjligt, där varje öre som går till premiumingredienser som skapar skonsamma resultat].

Därför kommer du på [företagsnamn] att märka att [medan vår förpackning är vacker, håller jag den minimal för att lägga mer inuti de där flaskorna och burkarna, snarare än det yttre lagret de kommer i]. Det är en [värde/skillnad] jag är så stolt över, och jag hoppas att det gör en skillnad även för dig!

[LÄGG TILL EN CTA OM RELEVANT. Exempel: Vill du kolla in våra produkter? Gå till länken i min bio och utforska den nya serien av XYZ som precis har kommit in.]`,
        `NOTE: Dela före- och efterbilder för ditt företag eller något i din nisch (är du hudterapeut kanske det är din egen hudresa, eller om du är en marknadsförare kanske det är ditt företag i början VS ditt företag nu)

\\_\\_\\_\\_

Started from the bottom now we’re here!

Kolla in [din startpunkt inom ett särskilt område, förslagsvis ditt företagande eller din nisch] från [datum här] jämfört med nu! Vilken [förändring/utveckling/skillnad etc] på bara [tidsram].

Idag tackar jag varje person som är en del av min resa!

Så tacksam varje dag för att kunna [infoga vad det är du gör i ditt företag].

‌

Vi glömmer aldrig bort att anledningen till att vi är där vi är är tack vare DIG! Så idag riktar vi ett enormt tack till varje enskild person som är en del av vår resa - i det förflutna, för närvarande och i framtiden!

Så tacksam varje dag för att kunna [infoga det som du gör/din USP/ditt värdeerbjudande].`,
        `Vilka är dina absoluta måsten i livet?

För mig här på [företagsnamn} är en av de saker som aldrig glöms [infoga något som är en värdering i ditt företag. EXEMPEL: punktlighet. Att ge bästa möjliga service]

Vilket innebär [hur speglas detta i ditt företag? EXEMPEL: att se till att varje presentkorg levereras till din mottagare i rätt tid och kommer fram vackert förpackad].

Det är bara ett av DE MÅNGA sätten som jag gör [infoga varumärkesnamn] vackert annorlunda än resten.`,
        `Jag tror att det är dags för en bekännelse.

Jag [infoga något som din drömkund kommer att relatera till. EXEMPEL: har en besatthet av att ändra min heminredning varje säsong].

Men vet du vad? Jag känner mig inte alls dålig för det. Och om du är i samma båt? Ska inte du heller känna det.

Så här är det, [varför din drömkund bör omfamna denna situation. EXEMPEL: vårt hem är vår fristad, där vi spenderar en stor del av tiden. Och vi förtjänar att ha en plats som ger oss energi, representerar oss och gör oss varma och gosiga på insidan.]

Så om det har varit [situation/nisch. EXEMPEL: vad du behöver - att göra små eller stora förändringar i ditt utrymme - för att känna dig ännu mer hemma hemma?]

Se detta som din påminnelse att köra på! Jag vet i alla fall att jag kommer att göra det!`,
        `THAT’S A WRAP [år]! And hello [år]! 👋

Nu när jag går in i det nya året är det ett ord jag tänker på som jag vill embody under hela året när det gäller mitt [din nisch som din drömkund kan relatera till. EXEMPEL: företag, marknadsföring, selfcare, föräldraskap, familj].

Och det ordet är [ORD. Exempel: LEKFULLHET, MOMENTUM, KÄRLEK, EMPOWERMENT].

Jag vill att [år] ska [utveckla: bli det året då jag verkligen blir ännu mer avsiktlig om hur jag driver mitt företag. Så att jag kan erbjuda dig de bästa erbjudandena, det bästa stödet, de bästa resultaten och alltid göra saker i linje med mina värderingar.]

Har du ett ord för det kommande året? En vibe du vill ta med dig genom hela året? Dela det nedan och låt oss hålla varandra accountable!`,
        `NOTE: para med en recension

---

Det här är exakt varför jag gör det jag gör.

Jag gör en liten glädjedans över att min [XYZ produkt] har hjälpt [kundens namn här] genom [sammanfatta hur din tjänst/produkt har hjälpt dem. EXEMPEL: att hjälpa dem att förverkliga sitt bästa liv under de senaste månaderna genom kraften av selfcare och höja sina vibrationer med stärkande XYZ].

Jag lever för detta. Det är min passion.

Och jag är så tacksam för [kunder] som DIG.`,
        `Detta är din påminnelse om att [infoga något din drömkund behöver höra här som är relaterat till din nisch. Något som kommer att få dem att må bättre eller känna sig hörda. EXEMPEL: det kommer att finnas stunder då du känner att du inte gör framsteg på din resa på Instagram. Och även om det suger, är det normalt, och du är INTE ensam].

Du ser, [infoga en historia här om din resa när du hade problem eller en klient om det är lämpligt. EXEMPEL: när jag var i mina första två år av XYZ, ZYX jag.]

Så kom ihåg, det du känner är så normalt. Och även om det inte gör det lättare i stunden, kan det underlätta att veta att det är en del av resan mot [ultimat önskan].

Och om du behöver en hjälpande hand? Finns jag här för att prata. Min DM är alltid öppna!`,
        `När jag först [infoga situation som kommer att koppla ihop din drömkund till din produkt direkt. EXEMPEL: blev mamma, började sträva efter att vara mer hållbar, påbörjade min resa mot mer selfcare], fann jag ofta mig själv [infoga situation som du brukade göra som du har lärt dig av. EXEMPEL: troende att jag måste vara den PERFEKTA 'miljökrigaren'] genom [försöka göra allt perfekt och försöka övertyga alla runt mig att ändra sina sätt].

Detta ledde snabbt till [infoga vad som hände med dig som andra kanske känner igen och vad som skulle hända om du fortsatte på denna väg. EXEMPEL: att jag insåg att detta var ohanterligt och inte bara mådde jag dåligt när jag inte fick det perfekt, utan jag stressade även andra runtomkring mig].

(Låter detta bekant för dig? I så fall, fortsätt läsa)

Men från detta hände något viktigt. Och jag vill dela med mig av detta till dig ifall DU känner så här just nu också.

Jag har lärt mig [sammanfatta lärdomen. EXEMPEL: att även små förändringar varje dag adderas upp!!] och från det har jag kunnat göra vissa förändringar.

[Infoga tips #1: EXEMPEL: Jag fokuserar nu på det goda jag har gjort den dagen, inte blir fixerad vid saker jag kunde ha gjort bättre]

[Infoga tips #2:]

[Infoga tips #3:]

Har detta påverkat mitt [ämne. EXEMPEL: moderskap, resa till hållbarhet, selfcare]? Absolut har det det. På bästa möjliga sätt. Har du upplevt något liknande på din resa? Hur har det påverkat dig?`,
        `Om det är en sak jag skulle kunna berätta för mitt tidigare jag om [ett ämne relaterat till din drömkund som de också kanske möter just nu. EXEMPEL: att börja min resa att använda mer hållbara hudvårdsprodukter], skulle det vara [infoga lärande som är relaterat till drömkund. EXEMPEL: att inte känna att jag måste byta ut allt på en gång!].

Det här kan låta uppenbart, men om jag hade vetat att [utveckla lärdomen. EXEMPEL: att även små förändringar i taget] skulle leda till [infoga bieffekt. EXEMPEL: en enorm skillnad för min hud OCH miljön], då skulle jag förmodligen ha gjort vissa saker annorlunda.

Även om jag generellt sett är en person som 'ser framåt', är det viktigt att vi lär oss att reflektera och implementera förändringar utifrån våra dagliga lärdomar. Det är bokstavligen hur vi växer och utvecklas som människor.

Så hur har jag lärt mig av mina tidigare beteenden? [infoga vad du har lärt dig. EXEMPEL: Att en hållbar livsstil inte sker över en natt. Det är en resa och varje steg i rätt riktning hjälper. Och det är okej att närma sig det på det sättet!]

Det här hjälper mig [infoga utfall EXEMPEL: inte bara med hudvård nu utan med varje del av mitt miljövänliga liv] - för att inte tala om [infoga något relaterat. EXEMPEL: det är lite lättare på budgeten när jag inte försöker köpa allt på en gång.]

Så detta är en LOVE NOTE till mitt tidigare jag.

Kan du relatera? Vad är något du skulle berätta för ditt tidigare jag?

[Valfri CTA om du har ett erbjudande, freebie, lösning som relaterar till detta:]

OH OCH PS: om du, precis som jag, också behöver lära dig att [infoga lärande. EXEMPEL: sakta ner och göra mer tid för DIG], gå då till länken i min bio för att se hur [infoga erbjudande. EXEMPEL: jag kan hjälpa dig att lätta din börda genom att ta på mig några av dina vardagliga affärssysslor!]`,
        `En sak jag får frågor om hela tiden är

[Infoga fråga/uttalande här som relaterar till din drömkund eller produktkategori. EXEMPEL: hur kan jag hitta min perfekta stil när jag övergår till anspråkslöst mode.]

Vill du veta min åsikt om det? Här är den 👇

[Ditt poäng här: För det första är det viktigt att komma åt din personlighet och fråga dig själv hur vill du KÄNNA! Detta kan vara...].

[Din andra punkt. EXEMPEL för det andra? Här är en ledtråd för dig...]

Det viktigaste jag vill att du tar med dig? Är [Infoga den viktigaste/mest positiva lärdomen som är relevant för din drömkund.]

Vad är dina tankar? Är detta något du har frågat dig själv och kände någon av dessa tips resonans med dig?`,
        `Många vet inte det här, men [företagsnamn] startades inte bara för att jag ville [infoga det resultat du hjälper människor att uppnå. EXEMPEL hjälpa människor att hitta det perfekta konstverket för sitt hem], utan också för att [infoga en del av din varumärkeshistoria här. EXEMPEL: jag ville hjälpa kvinnor att uttrycka sig genom färg och känsla och symbolik].

[Utveckla din historia].

Det är en av anledningarna till att jag är så passionerad för [infoga din USP. EXEMPEL: att skapa konst för världen som XYZ] och om du letar efter [sammanfatta historien. EXEMPEL konst som ser bra ut och får dig att må bra också]?

Då [CTA. EXEMPEL skicka ett DM med orden 'KONSTVERK' så pratar vi mer om hur jag kan hjälpa dig hitta det perfekta konstverket för just ditt hem.]`,
        `Hur ser [ något din målgrupp värdesätter eller önskar, längtar efter EXEMPEL: din selfcare-rutin ut?]

Gör du [olika sätt att uppnå det: läser varje kväll innan du går och lägger dig? Eller kanske har du ett glas vin och ett bubbelbad? Eller något helt annat]?

För mig är [ämne] något jag uppnår genom att [infoga något du gör som relaterar till ditt erbjudande. EXEMPEL: sätta mina intentioner för veckan och förbereda måltider så att det inte blir några oplanerade missar.]

Och det här är min påminnelse till mig SJÄLV och till dig att se till att vi [gör ett uttalande som kommer att inspirera din publik. EXEMPEL: gör vad vi än värdesätter när det gäller selfcare, för vi kan inte hälla från en tom kopp].

Skriv hur din [ämne] ser ut i kommentarerna för att hålla dig accountable och inspirera andra!`,
        `FRÅGA: Hur gör du [ämne - antingen utbildande eller personligt som direkt relaterar till din målgrupp. EXEMPEL: för att bestämma dig för den perfekta presenten till din partners födelsedag]?

För mig handlar det om [infoga information. EXEMPEL: upplevelser].

Du förstår, jag [något du inte gör. EXEMPEL: älskar inte att bara "ge" något på deras födelsedag].

Eller [något annat du inte gör. EXEMPEL: ens fråga dem vad de vill ha].

Istället brukar jag [vad du gör som kanske också inspirerar din publik. EXEMPEL: välja en upplevelse "tema" och hittar sedan element som verkligen bygger ut den berättelsen].

[Utveckla vidare om det behövs. EXEMPEL. Till exempel i år har min partner varit besatt av att utforska olika typer av maträtter. Så i år på hans födelsedag skapade jag en presentkort med böcker, kryddor, ingredienser och en presentkupong för valfri restaurang så att han kunde utforska detta ännu mer}.

Hur gör du [upprepa ämnet som du introducerade i början].`,
        `Så första gången jag [situation. EXEMPEL: försökte mig på att måla akvarell efter flera års uppehåll], var det ett totalt misslyckande.

[Förklara varför. EXEMPEL: Jag lyckades på något sätt tippa hela glaset med vatten över mig själv. 😂]

Och självklart, precis som många andra säkert skulle göra, viskade jag för mig själv "well, det där gör jag aldrig om igen".

Och om jag faktiskt hade hållit fast vid det? Om jag inte hade släppt stoltheten och försökt igen nästa dag?

Då [vad skulle ha hänt då. EXEMPEL: Hade jag gått miste om att hitta en hobby sm ger mig så mycket glädje]

Och [en annan påverkan. EXEMPEL: jag hade aldrig upptäckt hur mycket jag älskar att låta min kreativa sida blomma ut.]

Och [en annan påverkan. EXEMPEL: mina väggar skulle inte vara fyllda av så mycket glädje!].

Och det hade varit MYCKET mer tråkigt än den initiala "ögonblicket" där allt gick åt helvete.

Så, this is your reminder att om du har råkat ut för något liknande -

Res dig upp och försök igen! Det är inte bara hemligheten bakom [ämne. EXEMPEL: att återställa din självförtroende] - utan också att [djupt ögonblick. EXEMPEL hitta något som kanske blir din nya favoritgrej] också!`,
        `PÅMINNELSE: Bara för att du kan göra något betyder det inte att du måste.

För mig innebär det här {infoga vad detta betyder för dig som en del av din berättelse som din målgrupp kan relatera till. EXEMPEL: att lära mig säga nej till varje uppdragsförfrågan som kommer in eller evenemang som kommer min väg, att veta att jag inte måste träna varje dag för att nå mina träningsmål.}

Under så lång tid har jag {utöka din historia. EXEMPEL: sagt ja till varje uppragsförfrågan - oavsett hur trött eller överarbetad eller stressad jag redan var}. Men nu vet jag att bara för att jag kan göra det betyder inte att jag borde, eller att jag måste.

Istället, {utöka din historia. EXEMPEL - genom att säga "nej" ibland kan jag istället vara en bättre företagare överalag, ta hand om mig själv och spendera mer tid på att ge mina klienter ännu bättre resultat.}

Jag är nyfiken, vad är det du håller på att lära dig att säga nej till eller inser inte tjänar dig som en {din drömkund. EXEMPEL: soloprenör}?`,
        `Sanningens ögonblick: Jag hatar [sak här som ditt community kanske kan relatera till eller engagera sig i som något kontroversiellt. EXEMPEL: att posta bilder på mig själv ibland.]

Jag förstår att vissa människor älskar det och om det är du är det helt okej, men för mig är det [infoga hur det får dig att känna. EXEMPEL: för mycket, jag har inga problem med hur jag ser ut eller något, det är bara så jobbigt att se mitt eget ansikte så jävla mycket]

Vad jag istället älskar? Är [dela med dig av vad som fungerar för dig istället. EXEMPEL: att posta bilder på mig själv ibland bara.]

Så över till dig, jag är intresserad, är du en [ämne. EXEMPEL selfie-queen] eller blir du också less på dem ibland som jag?`,
        `Någonsin haft en stund där du känner att du har det helt ihop som [sätt in din drömkunds relaterade nisch. EXEMPEL en helt perfekt soloprenör].

Inte jag heller 😂

Men jag KÄNNER att jag är närmare att vara nöjd med var jag är de dagar då [sätt in ditt lyft eller din strategi för att höja dig själv. EXEMPEL: jag påminner mig själv om att jag gör mitt bästa varje dag, att företagandet är en ständig resa].

[Utöka denna strategi eller tanke om möjligt. Dela mer av din erfarenhet, berätta en historia eller utveckla den strategi du använder].

Hur är det för dig? Vad är ditt knep för att [infoga mål. Exempel: påminna dig själv om att du inte behöver vara perfekt för att göra en verklig skillnad]?`,
        `NOTE: OM du inte har en egen historia kan du dela en klienthistoria! T.ex Min klients önskan att XYZ caught fire när hon insåg XYZ.

---

Min önskan att [infoga något relaterat som din drömkund önskar. EXEMPEL: återta mitt självförtroende] tändes till när jag [infoga det du vet är ett invändigt argument mot din tjänst eller produkt, eller som är en begränsande övertygelse. EXEMPEL: insåg att att må bra inte betydde att klä sig som alla andra. Att självförtroendet kom från att hitta mitt EGET uttryck i kläderna].

Och nu? Varje dag? Får jag [infoga den transformation du tror att din drömkund kommer att relatera till. EXEMPEL: dyka upp och känna mig vacker och unapologetically som mig själv. Och det finns ingen bättre känsla alls!]

Den där begränsande övertygelsen du håller fast vid eller det hinder du tror står i din väg? Det är dags att säga adjö till det så att du kan säga hej till [infoga önskan. EXEMPEL: ditt mest självsäkra JAG hittills].

[Infoga CTA. EXEMPEL: Om du vill ta de första stegen mot att kliva in i ditt sanna, djärva, självsäkra JAG, gå till länken i min bio och ladda ner min videoserie om XYZ som kommer att hjälpa dig med XYZ.]`,
        `Vad betyder [ämne som är relaterat till din drömkund eller ditt erbjudande. EXEMPEL vila som småföretagare] för dig?

För mig? Det innebär [infoga vad det betyder för dig. EXEMPEL: Telefonen avstängd, fötterna upp, hunden i knät och förmodligen en bra bok... följt av en tupplur]

Och idag? Försöker jag göra mycket mer av det, tack och lov. Berätta gärna [upprepa ämnet: EXEMPEL vad vila betyder för dig som en upptagen företagare].`,
        `PSSSST: Önskar du att du kunde påskynda din hudvårdsrutin på kvällen? Då är det här för dig.

Vissa dagar känner jag att jag har knäckt koden när det gäller att ta sig från badrummet till sängen på kortast möjliga tid. Men det är verkligen ingen hemlighet som jag vill behålla för mig själv och jag tror att hela världen behöver veta det, så här kommer det.

Här är mina bästa tips för att uppnå den ultimata ENKLA hudvårdsrutinen!

1. [Strippa ner!] Hur länge är egentligen sedan du faktiskt gick igenom din hudvårdsrutin? Visste du att många produkter (som vår 3-i-1-serum) kan ersätta de många, röriga, tidskrävande stegen i din rutin?
2. [Infoga ditt tips.]
3. [Infoga ditt tips.]

Vilket av ovanstående skulle göra störst skillnad för din rutin? För dig?

[VALFRI CTA - om du kan relatera stegen eller resultatet strategiskt till något erbjudande, länka det här. EXEMPEL: Vill du kolla in vårt tidsbesparande, hudälskande serum? Klicka på länken i den här posten!]`,
        `Detta är din påminnelse om att du INTE behöver [infoga något som är en begränsande övertygelse hos din målgrupp eller ett motstånd från deras sida. EXEMPEL: spendera hundratusentals kronor på konstverk för att ha något av värde och kvalitet i ditt hem].

Faktum är att [infoga din kunskap eller historia för att hjälpa människor att se att det du säger är sant. EXEMPEL: några av mina absoluta favoritstycken kommer från 'gräsrots'-konstnärer som målar från själen i sitt arbetsrum och även om ingen kanske känner till deras 'namn', är känslan människor får från deras konst och livet det ger till ett rum ovärderligt].

Hur ofta har du kämpat med [upprepa din målgrupps smärtpunkt - t.ex. kämpat med att tro att du måste spendera hundratusentals kronor på konst för att det ska vara 'kvalitet'?]`,
        `När jag först [dela en berättelse som kommer att få din målgrupp att relatera - t.ex. startade mitt företag, blev mamma, flyttade från X till Z], tittade jag på alla andra [andra som dig - t.ex. företagare, mammor,] och tänkte [prata om en kamp - t.ex. "vilken hemlighet känner de till för att växa så här som jag inte gör?", "hur ser hon inte trött ut, jag är utmattad?"]

Och då visste jag inte vad jag vet nu... och det är att nästan varje [titel - t.ex. företagare, mamma, expat] genomgår någon form av liknande kamp.

Jag minns [utveckla historien för att prata om kampen ytterligare, vad kan du dela med dig av? T.ex. hur jag satt där, håret oborstat, så trött att mina ögon brände, undrandes om jag skulle råka somna medan jag försökte handla mat, råkade stöta in i, inte en utan, TRE andra vagnar den dagen - lyckligtvis gav de alla mig förståelsefulla blickar och försäkrade mig om att det var okej.]

Då trodde jag att saker aldrig skulle förändras men jag berättar den här historien för att berätta en mycket viktig sak...

Saker blir bättre!! Jag lovar.

Ja, det finns alltid utmaningar och svårigheter, men [infoga förändring/förbättring - t.ex. över tiden, bit för bit, kom balansen tillbaka, och även om jag inte är den vilda och fria 20-åringen som skulle vara lycklig över att ens GÖRA matinköpen varje vecka, skulle jag aldrig ha det på något annat sätt].`,
        `Vill du veta en hemlighet?

Jag är besatt av [infoga något relaterat till ditt företag/produkt/nisch. EXEMPEL CANVA]. Och jag tycker att alla som vill [infoga strävan – t.ex. skapa ett riktigt vackert varumärke med bara ett klick utan överväldigande design] också borde vara besatta av det. 😂

Hur ofta har du...

😕 [pain point, t.ex. slösat bort timmar framför datorn och försökt designa det där inlägget?]

😕 [pain point, t.ex. rivit ditt hår försöka komma på nya idéer för grafik på sociala medier?]

😕 [pain point, t.ex. eller undvikit en uppgift eftersom du helt enkelt inte kunde hantera designelementet som följer med den?]

Om ditt svar är antingen "ja, det är jag" eller "[NAMN - T.ex. Madeleine], har du läst min dagbok?" tror jag att du kanske vill [infoga ämne/lösning du kan ge – t.ex. kolla in Canva , börja göra XYZ].

[Ämne – t.ex. Canva ] kommer att hjälpa dig att [infoga fördelar. EXEMPEL - spara tid, ha en professionell designer i fickan för en bråkdel av kostnaden, och även XYZ].

Det är därför jag använder det i mitt eget [företag/liv/familj], och varför jag [rekommenderar det till alla mina kunder, vänner, familj, kommer inte ens titta tillbaka, kommer aldrig någonsin byta till något annat.]

Så nu när jag har erkänt min besatthet, måste jag veta... är det någon annan som är lika besatt som jag är??`,
        `Det är dags för lite kärlek!

Här på [infoga företagsnamn] älskar, älskar, ÄLSKAR vi [Vad älskar du? För ett lokalt företag kan det vara din stadsdel/område, för en onlineverksamhet kan det vara ett värde som medvetna företag, eller en av dina produkter].

Och det senaste [fantastiska företaget/platsen/produkten] på vår radar? [infoga namnet på ett lokalt litet företag eller en plats eller en produkt att dela med din målgrupp som de skulle älska/uppskatta].

Varför vi älskar [dem/det]?

[infoga en anledninf eller några korta punkter om varför du älskar det. EXEMPEL: Inte bara gör de den mest UNDERBARA koppen kaffe du någonsin kommer att ha, men de gör det allt från det trendigaste lilla konstgalleriet som kommer att inspirera dig att skapa för resten av dagen.]

Berätta för oss i kommentarerna nedan [be om förslag på fler sådana företag/platser att belysa. EXEMPEL: vilket kaffeställe vi borde testa nästa gång i våra lokala äventyr]`,
        `Åh, de där dipparna. Vi har alla dem då och då [drömkunds-typ - som mamma, som företagare, som student, när man försöker lära sig XYZ].

Men precis som man säger, det är de tuffa tiderna som verkligen får oss att uppskatta de bra tiderna.

Och även om de här dipparna verkligen kan SUGA, så har de ändå ett syfte och ger oss generellt sett möjligheten att reflektera över hur vi kan göra saker bättre.

Här är mitt snabba "hur man gör" för att övervinna en dipp:

[infoga tips/råd. EXEMPEL: Prova något nytt. Ibland uppstår en dipp bara genom att man fastnat i en dålig rutin. Kom ut och prova den nya konstklassen/mammagruppen/promenadstigen. Inspiration kommer från överallt.]

[infoga tips/råd.]

[infoga tips/råd.]

Jag hoppas detta hjälper, och om du känner dig lite fast i din slumpfas och om du behöver en hand? [CTA. EXEMPEL - skicka ett DM till mig, kolla in XYZ produkt, ladda ner vår gratis XYZ som hjälper till med detta mer.]`,
        `När ett meddelande som det här trillar in i inkorgen kan du vara säker på att det gjordes en happy dance!

Om du också vill kunna lämna ett meddelande likt detta, [CTA. EXEMPEL: spana in vår produkt XYZ!]`,
        `Vill du hellre [infoga något relaterat till din produkt, t.ex kalendrar/klockor. EXEMPEL: dyka upp supertidigt till ett evenemang] eller [infoga något relaterat till ditt företag. EXEMPEL: dyka upp långt efter fashionabelt försenad]?

Oj... det är en tuff fråga, eller hur?

För oss skulle det måste vara [dela ditt svar. EXEMPEL: dyka upp supertidigt. Jag menar, vi kan alltid ge en hjälpande hand med förberedelser. Och låt oss vara ärliga, ingen vill missa all mat och dryck genom att råka komma för sent!]

Som tur är har vi [relatera tillbaka till din produkt/tjänst. EXEMPEL: våra XYZ kalendrar som håller våra dagar på rätt spår så att vi alltid kan vara precis i tid... puh!]

Berätta för oss nedan i kommentarerna vilket alternativ du helst skulle vara!`,
        `Ummmm kan vi ta en sekund att fira tillsammans, snälla? Jag är överlycklig över detta ⬇️

[infoga något kul som hänt i företaget. EXEMPEL: vår senaste XYZ-produktrelease HAR HELT SÅLT SLUT. vår senaste XYZ-produktrelease har fått dessa HÄRLIGA RECENSIONER!]

Det är sådana här "nyp mig i armen"-ögonblick som får min mage att pirra av lycka och komma ihåg varför vi kom in i den här branschen från första början. Och i slutändan handlar det om att [infoga vad du gör. EXEMPEL: hjälpa ER med ER hudvård}.

Så, ni hittar mig här, dansa en liten glädjedans i min stol för resten av dagen [låt oss vara ärliga - förmodligen veckan}!

Tack till denna underbara gemenskap för att ha hjälpt till att göra detta till verklighet!!

[Valfri CTA] OCH PS: Inte för att skryta, men det finns en anledning till varför vi får [siffror/ reaktioner/ försäljning/ recensioner/ resultat/ etc.] som detta. Vill du också vara med i det som [XYZ andra kunder/ klienter/ människor/ gäster/ etc.] är med i? [Infoga CTA. EXEMPEL: Klicka på länken i profilen för mer information.]`,
        `NOTE: Dela före- och efterbilder för ditt företag eller något i din nisch (är du hudterapeut kanske det är din egen hudresa, eller om du är en marknadsförare kanske det är ditt företag i början VS ditt företag nu)

________

Started from the bottom now we’re here!

Kolla in [din startpunkt inom ett särskilt område, förslagsvis ditt företagande eller din nisch] från [datum här] jämfört med nu! Vilken [förändring/utveckling/skillnad etc] på bara [tidsram].

Idag tackar jag varje person som är en del av min resa!

Så tacksam varje dag för att kunna [infoga vad det är du gör i ditt företag].`,
        `Det är något alldeles särskilt med [något du gör i ditt företag kopplat till din drömkund. EXEMPEL: att få hjälpa en annan soloprenörska närmare hennes dröm om att leva på sitt företagande].

[Berätta mer om dina känslor kring ämnet eller fördelar med att jobba med dig].

Om du ser mig gå omkring med världens största flin från öra till öra - oroa dig inte. Det är bara jag som tänker på allt jag får göra tack vare [företag]!`,
        `Något som jag alltid fokuserar på är att skapa saker som jag hoppas att DU kommer att ÄLSKA. Och där har mitt största fokus legat senaste veckorna - samtidigt som kontot har växt! Så jag tänker att det är dags för en riktig presentation!

Så om du är ny här (eller har varit en del av mitt community en längre stund men missat mina tidigare presentations-inlägg) så kommer här lite fun facts about me!

[Fakta 1: Dela lite fun facts, men försök koppla det till företaget/nischen/drömkunden/företagandet på något sätt.]

[Fakta 2]

[Fakta 3]

[Fakta 4]

(Är väldigt glad att jag kan ta det här skrivandes, hade aldrig vågat stå framför [antal följare du har] och säga det högt, hahhahjälpha).

Så nu när jag har presenterat mig tycker jag att det är dags för dig att dela lite fun facts om dig själv! Let me know i kommentarerna!`,
        `NOTE: Para ihop detta med en citat i ditt inlägg som sammanfattar ditt syfte. EXEMPEL: “Purpose fuels Passion”.

____________________

Detta citat är något jag lever efter och helhjärtat tror på.

Mitt syfte här på [företagsnamn] är att [infoga varumärkessyfte/vision/uppgift. EXEMPEL: hjälpa kvinnor att känna att de har full kontroll på sin marknadsföring och säljer regelbundet tack vare den.]

Och genom att ständigt hålla blicken stadigt på mitt syfte med varför jag gör det jag gör - [infoga vad du gör. EXEMPEL: det ger dig självförtroende i din hud!] - tankar jag min passion, vilket sedan pushar mig att göra mitt bästa för mina [klienter, kunder, dig etc.].

Är detta ett citat som resonerar med dig också? Eller finns det något annat citat som lights your soul on fire? Dela gärna med dig i kommentarsfältet!`,
        `IDAG ÄR DET DAGS ATT FIRA!!!!

För idag [Infoga varför du ska dira. Det kan antingen vara en prestation du gjort inom företaget som du reflekterar över eller något för dina kunder. EXEMPEL: lanserade jag den nya serien av XYZ! Jag tog på mig min business woman-byxor och är så glad att meddela att en ny webbplats är på väg till er så snart som möjligt!]

[Utveckla om det behövs. Förklara firandet eller framgången eller tillkännagivandet mer detaljerat och håll inlägget mycket "hypeat" och fokuserat på fördelar. EXEMPEL. Den nya serien är en som så många har frågat mig om - en hudvårdsserie där du kan vara säker på att det inte finns några produkter framtagna i stress eller bara för att tjäna pengar, denna serie är en hög av bra saker för att hjälpa dig med XYZ.]

Så om du vill fira med mig - [CTA. EXEMPEL: håll utkik efter den nya webbplatsen som kommer om 10 dagar. Gå till butiken för att få tag på det begränsade sortimentet. Skynda dig att ladda ner freebien]

Och PS - om det är lite för tidigt att öppna flaskor kan du gärna höja din kopp med kaffe eller te för att fira med mig också!`,
        `Jag värderar inte [sak du inte värderar. EXEMPEL: fin förpackning som inte gör något annat än att skapa högre kostnader], jag värderar [företagsvärde/särdrag. EXEMPEL: att lägga fokus på de faktiska produkterna inuti.]

För mig, [autentiskt uppdrag/vision/övertygelse. EXEMPEL: jag vill att du ska ha den bästa hudvården möjligt, där varje öre som går till premiumingredienser som skapar skonsamma resultat].

Därför kommer du på [företagsnamn] att märka att [medan vår förpackning är vacker, håller jag den minimal för att lägga mer inuti de där flaskorna och burkarna, snarare än det yttre lagret de kommer i]. Det är en [värde/skillnad] jag är så stolt över, och jag hoppas att det gör en skillnad även för dig!

[LÄGG TILL EN CTA OM RELEVANT. Exempel: Vill du kolla in våra produkter? Gå till länken i min bio och utforska den nya serien av XYZ som precis har kommit in.]`,
        `När jag startade [företagsnamn] var det en sak jag ville ha mer än någonting annat.

Och det var att [infoga din vision, uppdrag eller syfte. EXEMPEL: hjälpa kvinnor att planera bröllop fyllda av ögonblick som de kan bära med sig hela livet].

Och idag? Vaknade jag upp med [något autentiskt du skulle säga: t.ex. mitt hjärta så fullt och tacksamt, en känsla av att befinna mig på toppen av världen, ganska jävla lycklig. EXEMPEL med mitt hjärta fullt av kärlek efter ett fantastiskt bröllop i helgen] och vet att [var är du i ditt företag? Är du på väg att uppnå din vision eller lever du den redan? Prata om det. EXEMPEL: jag har byggt upp ett företag som gör just det]. [du kan utveckla en historia eller upplevelse här om du önskar].

Och jag är tacksam varje dag för er alla, de otroliga [kunder/klienter/gemenskap] som stöttar mig för att förverkliga denna vision.

Nu, om ni ursäktar mig, ska jag iväg och nypa mig själv för att påminna mig om att detta inte bara är en dröm. 😂`,
        `Ibland behöver man stanna upp och njuta lite ❤️

‌

Jag är helt [känsla. EXEMPEL: överväldigad av hur många ni är som hittat hit senaste tiden, något jag bara kunnat drömma om innan jag drog igång mitt Instagramkonot]

‌

[Berätta mer om din resa. EXEMPEL: När jag planerade MAD's uppstart var jag så nojig över hur jag skulle göra med allt. Jag kollade runt på "hur alla andra gjorde" men kände ganska snabbt att jag behövde göra det på Mitt sätt. Jag fokuserar på att göra det så enkelt som möjligt för Dig att konsumera mitt innehåll].

‌

Och därför är det så otroligt hjärtevärmande att se att [anledningen till din känsla. EXEMPEL: att ni är över 200 personer som följer mig, och som gillar att jag gör på Mitt sätt!]

‌

Det gör mig ännu mer motiverad att göra detta och att få det att fungera så jag kan [vad är ditt mål? EXEMPEL: ha detta som heltidsjobb framöver. För om det är något jag brinner för så är det just digital marknadsföring]

‌

Jag vet att jag sitter på massa mer kunskap som bara väntar på att få delas med er alla där ute, och viljan att hjälpa så många jag bara kan att [vad är ditt syfte? EXEMPEL: njuta av att skapa en närvaro på sociala medier för ert företag!]

‌

Tack tack tack för att [anledningen till din känsla. EXEMPEL: du följer mig! ❤️❤️❤️]`,
        `NOTE: Para med ett citat som ligger dig varmt om hjärtat och som du tittar på när du behöver extra pepp inom din nisch. Exempel: “Om du tvekar på att göra din grej för att du är rädd för vad andra ska tycka, kom ihåg det här: De flesta om kritiserar andra är ofta de som själva inte haft modet att gå utanför sin comfortzone. Kör på!”

_________________

Spara den här posten så du kan titta tillbaka på den när du behöver lite extra pepp ❤️

‌

Är så [infoga känsla som relaterar till citatet. EXEMPEL: så rädd för vad andra ska tycka om mig 😵‍💫 Tänk om jag misslyckas och så kan de gotta sig i det…. Det tänket har stoppat mig så många gånger innan, men nu är det vara slut med det!]

‌

[Utveckla dina tankar kring citat och skicka med pepp till läsaren. EXEMPEL: Skulle du ta råd från den personen som pratar ner dig? Troligtvis inte. Därför ska du inte ta kritik från den heller 💃]

‌

Våga göra din grej! Jag kommer heja på dig 👏`,
        `NOTE: Para med ett citat som får dig att känna pepp och tacksamhet, exempel “If you don't go after what you want, you'll never have it. If you don't ask, the answer is always no. If you don't step forward, you're always in the same place.”

________________________

BILDTEXT:

Förra veckans känsla var [känsla du kände förra veckan och även inför citat. EXEMPEL: TACKSAMHET, och den följer även med in i den här veckan]

‌

[Fråga om drömkunden kan relatera och ge egna exempel på saker du känner relaterade till känslan. EXEMPEL: Vad är du tacksam över just nu?

Jag är tacksam för de jag får jobba med.

Tacksam för fina kontakter här på Instagram.

Tacksam för familj och vänner.

Tacksam för kärlek.

Tacksam för den här möjligheten.

Tacksam för mig själv som skapat det här livet jag får leva]

‌

[Skriv om autentiska känslor kopplat till det du precis skrivit om som din drömkund kan relatera till. EXEMPEL: Det har varit jobbigt och stressigt och läskigt emellanåt, och är fortfarande, men mest är det pirr i magen varje dag över att jag får göra detta 🙏]`,
        `Mina 4 mest använda [verktyg eller system din drömkund behöver. EXEMPEL: appar]! Har vi samma favoriter? 🥳

‌

1\\. [verktyg eller system som din drömkund behöver. Förklara vad det är och vad du använder det till. EXEMPEL: Canva, Jag gör allt (nästan) i Canva! Alla inlägg, reels-omslag, vissa stories som är förberedda, kundinlägg, vissa reels! Älskar Canva och rekommenderar det till alla jag känner 😅]

2\\. [verktyg eller system som din drömkund behöver. Förklara vad det är och vad du använder det till].

3\\. [verktyg eller system som din drömkund behöver. Förklara vad det är och vad du använder det till].

4\\. [verktyg eller system som din drömkund behöver. Förklara vad det är och vad du använder det till].

‌

Har du [verktyg eller system. EXEMPEL: någon app du använder extra mycket i ditt företagande]? Dela gärna med dig 👇😄`,
        `Jag kanske krossar en dröm nu, förlåt.

‌

Är du en [drömkund och en särskild situation den drömmer om. EXEMPEL: företagare som drömmer om att skapa en video som blir viral?]

‌

Släpp den drömmen. Snabbt.

‌

När [situationen drömkunden längtar efter. EXEMPEL: en video blir viral kommer det en hel drös följare på köpet. Kul! Eller?]

‌

Nja. Riktigt så kul blir det inte alltid. [vad som egentligen händer när situationen uppstår. EXEMPEL: Det följer nämligen med en hel drös människor som inte alls är intresserade av det Du har att erbjuda, utan som bara tyckte det du la upp 1 gång var roligt.]

‌

Självklart kan det bli en succé där [vad drömkunden tror ska hända. EXEMPEL: du får massa följare som är perfekta för dig.] Men chansen är tyvärr liten. Sorry om jag krossar ditt hjärta 💔

‌

Förutom att man ofta [vad som egentligen råkar hända i situationen. EXEMPEL: når fel målgrupp, följer det dessutom med tråkmånsar, elakingar och otrevliga jåbals (som vi säger i min familj)].

‌

Att [vad drömkunden borde sträva efter. EXEMPEL: långsamt bygga upp sitt community där alla är närvarande för att de gillar Dig, det Du gör] - det är något att sträva efter!

‌

Det finns inga vettiga, hälsosamma quickfixes. Gör jobbet direkt från start!`,
        `This is your sign!

Börja [något du tycker din drömkunds ska börja med för att förbättra sin resa mot sina mål. EXEMPEL: filma reels - NU!]

Visst är det [infoga och slå hål på invändning drömkunden kan ha. EXEMPEL: roligt med reels som ser riktigt proffsiga ut! Men du behöver inte en hel uppsjö med produkter för att göra bra reels.]

Om du vill [infoga och slå hål på invändning drömkunden kan ha. EXEMPEL: göra reels men inte kommer igång för att du "inte har rätt utrustning"] så är detta ditt tecken ATT KÖRA ÄNDÅ.

Börja bara! Du sitter säkert [vad gör drömkunden nu? EXEMPEL: på några utkast redan som bara väntar på att få publiceras. Gör det även fast de inte är perfekta i dina ögon!]

Kommande veckor delar jag mina bästa [ämne]-tips! Följ mig för att inte missa något 💃`,
        `PSST... Vill du veta en liten hemlighet om hur jag [infoga ämne som din drömkund har problem med. EXEMPEL: aldrig missar ett steg i min kvällsrutin för hudvård]?

Det är detta:

[Infoga ditt tips, strategi eller hemlighet].

Så om DU har svårt att [infoga vad de har problem med. EXEMPEL: hålla fast vid din hudvårdsrutin men verkligen vet att du behöver göra förändringar]?

Jag skulle rekommendera att testa detta!

Har du några andra [tips/strategier/metoder] som du testat och gillat? Låt mig veta i kommentarerna!

[Valfri CTA] Och om du tänker att du kanske behöver min hemlighet i ditt liv kan du [infoga CTA. EXEMPEL: kolla in min fullständiga kurs om hemligheterna för hudvård som inkluderar XYZ, anmäl dig till mitt nyhetsbrev för fler tips och tricks, boka in en coaching-session för mindset nu].`,
        `Någonsin haft en stund där du känner att du har det helt ihop som [sätt in din drömkunds relaterade nisch. EXEMPEL en helt perfekt soloprenör].

Inte jag heller 😂

Men jag KÄNNER att jag är närmare att vara nöjd med var jag är de dagar då [sätt in ditt lyft eller din strategi för att höja dig själv. EXEMPEL: jag påminner mig själv om att jag gör mitt bästa varje dag, att företagandet är en ständig resa]. [Utöka denna strategi eller tanke om möjligt. Dela mer av din erfarenhet, berätta en historia eller utveckla den strategi du använder].

Vad sägs om dig? Vad är ditt knep för att [infoga mål. Exempel: påminna dig själv om att du inte behöver vara perfekt för att göra en verklig skillnad]?`,
        `PÅMINNELSE: Bara för att du kan göra något betyder det inte att du måste.

För mig innebär det här [infoga vad detta betyder för dig som en del av din berättelse som din målgrupp kan relatera till. EXEMPEL: att lära mig säga nej till varje uppdragsförfrågan som kommer in eller evenemang som kommer min väg, att veta att jag inte måste träna varje dag för att nå mina träningsmål.]

Under så lång tid har jag [utöka din historia. EXEMPEL: sagt ja till varje uppragsförfrågan - oavsett hur trött eller överarbetad eller stressad jag redan var]. Men nu vet jag att bara för att jag kan göra det betyder inte att jag borde, eller att jag måste.

Istället, [utöka din historia. EXEMPEL - genom att säga "nej" ibland kan jag istället vara en bättre företagare överalag, ta hand om mig själv och spendera mer tid på att ge mina klienter ännu bättre resultat.]

Jag är nyfiken, vad är det du håller på att lära dig att säga nej till eller inser inte tjänar dig som en [din drömkund. EXEMPEL: soloprenör]?`,
        `NOTE: Om du inte har en personlig historia att dela kan du använda dig utav en klient. T.ex Min klients önskan att XYZ caught fire när hon insåg XYZ.

---

Min önskan att [infoga något relaterat som din drömkund önskar. EXEMPEL: återta mitt självförtroende] tändes till när jag [infoga det du vet är ett invändigt argument mot din tjänst eller produkt, eller som är en begränsande övertygelse. EXEMPEL: insåg att att må bra inte betydde att klä sig som alla andra. Att självförtroendet kom från att hitta mitt EGET uttryck i kläderna].

Och nu? Varje dag? Får jag [infoga den transformation du tror att din drömkund kommer att relatera till. EXEMPEL: dyka upp och känna mig vacker och unapologetically som mig själv. Och det finns ingen bättre känsla alls!]

Den där begränsande övertygelsen du håller fast vid eller det hinder du tror står i din väg? Det är dags att säga adjö till det så att du kan säga hej till [infoga önskan. EXEMPEL: ditt mest självsäkra JAG hittills].

[Infoga CTA. EXEMPEL: Om du vill ta de första stegen mot att kliva in i ditt sanna, djärva, självsäkra JAG, gå till länken i min bio och ladda ner min videoserie om XYZ som kommer att hjälpa dig med XYZ.]`,
        `NOTE: Du kan göra detta inlägg mycket djupt eller mer allmänt. Det beror på det ämne du väljer och de painpoints du väljer.

---

Detta är din påminnelse om att [infoga något din drömkund behöver höra här som är relaterat till din nisch. Något som kommer att få dem att må bättre eller känna sig hörda. EXEMPEL: det kommer att finnas stunder då du känner att du inte gör framsteg på din resa på Instagram. Och även om det suger, är det normalt, och du är INTE ensam].

Du ser, [infoga en historia här om din resa när du hade problem eller en klient om det är lämpligt. EXEMPEL: när jag var i mina första två år av XYZ, ZYX jag.]

Så kom ihåg, det du känner är så normalt. Och även om det inte gör det lättare i stunden, kan det underlätta att veta att det är en del av resan mot [ultimat önskan]. Och om du behöver en hjälpande hand? Finns jag här för att prata. Min DM är alltid öppna!`,
        `NOTE: You can make this post very deep and vulnerable or more general. It comes down to the topic you pick and the pain points you choose.

---

Det har funnits stunder då jag velat kasta in handduken [när det gäller] [något din drömkund kommer att relatera till: EXEMPEL försöka hitta min egen unika stil att dyka upp med här på instagram].

Dagar då [smärtomoment: EXEMPEL: det har varit för svårt]

Där [smärtomoment: EXEMPEL: jag har känt att jag misslyckas]

Där allt har [smärtomoment: EXEMPEL: tyckts gå fel]

Och jag kände mig [smärtomoment: EXEMPEL: som om ingenting faller på plats]

Och efter att ha pratat med min coach om detta fick det mig att inse att jag verkligen inte är ensam.

Som [nisch. EXEMPEL: solprenör], här är the real talk.

[infoga lite ärligt snack. EXEMPEL: Vi kommer inte alltid ha vårt shit together.]

[infoga lite ärligt snack. EXEMPEL: Tider kommer att vara svåra.]

[infoga lite ärligt snack. EXEMPEL: Ögonblick kommer att vara tuffa.]

Men vad jag alltid påminner mig själv om? [Infoga påminnelse: EXEMPEL. Är att ingenting värt att ha kommer lätt. Och att dessa stunder av att känna sig nere eller frustrerad är normalt sett stunder av tillväxt och utveckling.]

Så [ge ett sista ord av uppmuntran. EXEMPEL: håll huvudet högt. Om idag är en sådan dag, kom ihåg att utan regn växer ingenting. På andra sidan detta regn väntar en period av blomning på dig.]`,
        `Vill du veta en hemlighet?

Jag är besatt av [infoga ämne. EXEMPEL CANVA]. Och jag tycker att alla som vill [infoga strävan – t.ex. skapa ett riktigt vackert varumärke med bara ett klick utan överväldigande design] också borde vara besatta av det. 😂

Hur ofta har du...

😕 [pain point, t.ex. slösat bort timmar framför datorn och försökt designa det där inlägget?]

😕 [pain point, t.ex. rivit ditt hår försöka komma på nya idéer för grafik på sociala medier?]

😕 [pain point, t.ex. eller undvikit en uppgift eftersom du helt enkelt inte kunde hantera designelementet som följer med den?]

Om ditt svar är antingen "ja, det är jag" eller "[NAMN - T.ex. Madeleine], har du läst min dagbok?" tror jag att du kanske vill [infoga ämne/lösning du kan ge – t.ex. kolla in Canva , börja göra XYZ].

[Ämne – t.ex. Canva ] kommer att hjälpa dig att [infoga fördelar. EXEMPEL - spara tid, ha en professionell designer i fickan för en bråkdel av kostnaden, och även XYZ].

Det är därför jag använder det i mitt eget [företag/liv/familj], och varför jag [rekommenderar det till alla mina kunder, vänner, familj, kommer inte ens titta tillbaka, kommer aldrig någonsin byta till något annat.]

Så nu när jag har erkänt min besatthet, måste jag veta... är det någon annan som är lika besatt som jag är??`,
        `När jag först [din relaterade berättelse som kommer att relatera till din drömkund – t.ex. startade mitt företag, blev mamma, flyttade från X till Z], tittade jag på alla de andra [andra som du – t.ex. soloprenörer, mammor] och tänkte [prata om en kamp – t.ex. "vilken hemlighet känner de till för att växa så här som jag inte gör?", "hur ser hon inte trött ut, jag är utmattad?"]

Och då visste jag inte det jag vet nu... och det är att nästan varje [titel – t.ex. soloprenör, mamma] går igenom någon form av liknande kamp!

Jag minns [utveckla historien för att prata mer om kampen, vad kan du dela med dig av? T.ex. sitta där, med oborstat hår, så trött att mina ögon brände, undrade om jag skulle somna medan jag försökte handla mat, stötte på inte en utan TRE andra vagnar den dagen – lyckligtvis gav de alla mig förståelsefulla blickar och försäkrade mig om att det var okej.] Då trodde jag att saker aldrig skulle förändras, men jag berättar den här historien för att dela en mycket viktig sak med dig, och det är att...

Saker blir bättre!! Jag lovar!

Ja, det finns alltid utmaningar och svårigheter, men [infoga transformation – t.ex. med tiden kom balansen tillbaka bit för bit, och även om jag inte är den vilda och fria 20-åringen som skulle vara lycklig att GÖRA matinköp varje vecka, skulle jag aldrig ha det på något annat sätt nu].`,
        `En liten LOVE NOTE: Att du kämpar betyder inte att du är misslyckad. Hur många gånger har du som [din drömkund. EXEMPEL en mamma, en småföretagare, en kvinna, en partner] känt att du [hur de känner sig: EXEMPEL som om du bara inte har ditt shit together? Som om du kunde vara en bättre XYZ eller att du borde uppnå XYZ snabbare]?

Jag önskar att jag kunde säga att det var ovanligt, men jag vill låta dig veta att du inte är ensam. Det finns så många [människor/drömkund EXEMPEL småföretagare] som känner så.

Saken är dock att dessa känslor? De betyder inte att du inte är otrolig. Att du inte gör fantastiska saker. Eller att du inte är på rätt väg.

Dessa saker är alla en del av vår resa [infoga den väg din drömkund är på. EXEMPEL i moderskapet. I företagslivet].

Och även om de kan vara jobbiga vissa dagar, kom ihåg att de är alla lärdomar som driver dig framåt, och för varje kamp finns det hundra saker som du redan lyckas med.

[VALFRI CTA] Och PS - om du känner dessa saker? Tveka inte att skicka ett meddelande till mig. Det är precis därför [varumärkesnamn] finns. För att hjälpa dig att uppnå [deras ultimata önskan/mål] utan [något de vill undvika eller övervinna], och om du har svårt [jag skulle älska att hjälpa/prata]`,
        `Vad betyder [ämne som är relaterat till din drömkunds personlighet eller ditt erbjudande. EXEMPEL vila som småföretagare] för dig?

För mig? Betyder det [infoga vad det betyder för dig. EXEMPEL: Mobil avstängd, fötterna upp, hunden i knät och förmodligen en bra bok... följt av en tupplur]

Och idag? Försöker jag göra mycket mer av det, tack och lov. Berätta gärna [upprepa ämnet: EXEMPEL vad vila betyder för dig som upptagen företagare].`,
        `Sanningens ögonblick: Jag hatar [sak här som ditt community kanske kan relatera till eller engagera sig i som något kontroversiellt. EXEMPEL: att posta bilder på mig själv ibland.]

Jag förstår att vissa människor älskar det och om det är du är det helt okej, men för mig är det [infoga hur det får dig att känna. EXEMPEL: för mycket, jag har inga problem med hur jag ser ut eller något, det är bara så jobbigt att se mitt eget ansikte så jävla mycket]

Vad jag istället älskar? Är [dela med dig av vad som fungerar för dig istället. EXEMPEL: att posta bilder på mig själv ibland bara.]

Så över till dig, jag är intresserad, är du en [ämne. EXEMPEL selfie-queen] eller blir du också less på dem ibland som jag?`,
        `Brukar du [infoga ett problem eller en önskan eller en situation din drömkund kan relatera till som du kan dela en historia kring. EXAMPLE: ha problem med koncentration och motivation?]

För mig är de gånger jag [infoga din story här. EXAMPLE: kämpar mest som en soloprenörska ] när [dela din historia. EXAMPLE: Jag har gjort lite för mycket, och vilat för lite.]

Det är så viktigt att [Infoga den grejen du har lärt dig eller det råd du kan dela. EXEMPEL: vila som småföretagsägare om vi vill vara på vår bästa nivå och hålla koncentrationen och motivationen på topp hela tiden. Jag vet att för mig måste jag XYZ.]

Har du upplevt det här? Eller har du koll på det här?`,
        `FRÅGA: Hur väljer du [ämne - antingen utbildning eller personligt som direkt relaterar till din drömkund. EXEMPEL: det perfekta presentvalet för din partners födelsedag]? För mig handlar det om [infoga information. EXEMPEL: det handlar helt om upplevelser].`,
        `Så första gången jag [situation. EXEMPEL: försökte mig på att måla akvarell efter flera års uppehåll], var det ett totalt misslyckande.

[Förklara varför. EXEMPEL: Jag lyckades på något sätt tippa hela glaset med vatten över mig själv. 😂]

Och självklart, precis som många andra säkert skulle göra, viskade jag för mig själv "well, det där gör jag aldrig om igen".

Och om jag faktiskt hade hållit fast vid det? Om jag inte hade släppt stoltheten och försökt igen nästa dag?

Då [vad skulle ha hänt då. EXEMPEL: Hade jag gått miste om att hitta en hobby sm ger mig så mycket glädje]

Och [en annan påverkan. EXEMPEL: jag hade aldrig upptäckt hur mycket jag älskar att låta min kreativa sida blomma ut.]

Och [en annan påverkan. EXEMPEL: mina väggar skulle inte vara fyllda av så mycket glädje!].

Och det hade varit MYCKET mer tråkigt än den initiala "ögonblicket" där allt gick åt helvete.

Så , this is your reminder att om du har råkat ut för något liknande -

Res dig upp och försök igen! Det är inte bara hemligheten bakom [ämne. EXEMPEL: att återställa din självförtroende] - utan också att [djupt ögonblick. EXEMPEL hitta något som kanske blir din nya favoritgrej] också!`,
        `Jag tror att det är dags för en bekännelse. Jag [infoga något din målgrupp kan relatera till. EXEMPEL: kan verkligen inte skriva ett inlägg utan ett stavfel i det].

Men jag måste berätta något för dig.

Jag känner mig inte alls dålig över det. Och om du är likadan? Borde inte du heller göra det.

För så här är det, som [nisch. EXEMPEL soloprenör] blir vi så ofta programmerade att tro att vi måste [situation/myt. EXEMPEL: vara perfekta hela tiden. Ha allting under kontroll.] Men egentligen? Det vi behöver göra är [råd. EXEMPEL: vara snälla mot oss själva och komma ihåg att vi också är mänskliga. Och människor relaterar till andra människor.].

Så om det har varit något [situation/nisch. EXEMPEL. småföretag] som tynger dig idag? Se detta som din påminnelse att släppa det. Att [sammanfatta situationen/budskapet. EXEMPEL ett stavfel i ditt inlägg kommer inte förstöra ditt företag. Det kommer bara visa hur verklig och mänsklig du är. Vilket är en superkraft i sig. Och, det där stavfelet kanske gör att folk kommer ihåg ditt inlägg mer ;)]`,
        `Real talk. Igår hade jag en av de där fantastiska idéerna om att [infoga professionellt eller personligt hinder. EXEMPEL: jag var övermänsklig och det innebar att jag kunde skriva copy för hela min webbplats under den lediga timmen jag hade mellan klientmöten. Jag vet, jag vet, jag kan redan höra dig säga 'vad fan tänkte jag på'?]

Tack vare detta [infoga vad som gick eller kunde ha gått fel. EXEMPEL: hamnade jag i en stress-spiral den kvällen när jag 'inte fick det gjort jag behövde' - även om jag gav mig själv det mest omöjliga tidsschemat för att göra det.]

Och jag ville dela detta eftersom jag vet att jag inte är ensam när det gäller [det du gjorde]. Det händer. Vi har alla dessa ögonblick. Men ibland krävs det bara lite självreflektion.

Jag tog ett steg tillbaka och insåg snabbt [infoga lärande. EXEMPEL: att det allra bästa rådet som jag skulle ge till en av mina egna klienter är det bästa rådet som jag själv kan ta: vi måste ge oss själva utrymme och tid för att verkligen prestera vårt bästa. Och inget gott kommer någonsin från att planera vår dag för katastrof genom orealistiska förväntningar. Är det inte lite lustigt det där?]

Råkar du också göra något liknande? Eller har du haft andra lärdomar som denna nyligen? Dela med dig och berätta något som du nyligen har lärt dig den hårda vägen i kommentarerna.`,
        `Låt mig presentera [infoga klientens namn]. Innan hon kom till mig hade [infoga klientens namn] kämpat med [infoga pain point för din drömkund. EXEMPEL: självförtroende i deras marknadsföring, vilket till slut ledde till att hon inte alls marknadsförde sig och tappade sälj. Det här kan bero på olika saker för olika personer, men i det här fallet berodde detta på att hon helt enkelt inte förstod vem hon kommunicerade med och hur man gör det på bästa sätt.]

Det är något som händer HELA tiden, och tro mig, jag förstår det! Men genom [infoga din nisch och hur du löste detta klients problem. EXEMPEL: en noggrann analys av företaget, att vi identifierade drömkunden, dennes smärtområden och de möjligheter företaget erbjuder + företagets VARFÖR, kunde vi kommunicera detta till drömkunden genom den marknadsföring hon gör idag]

Och det absolut bästa med [infoga klient och problem som lösts. EXEMPEL: [infoga klientens namn] som har detta självfötroendet i sin marknadsföring]?

Är att hon sedan dess har [infoga framgång och förstärkning av anledning. EXEMPEL: fördubblat sin kundbas tack vare den övertygelse hon har i sin marknadsföring.]

Jag är verkligen så hedrad över att ha hjälpt [namn] att uppnå detta och nyper mig själv i armen varje dag över att jag får äran att hjälpa människor som henne att uppnå saker precis som detta. Vill du också prata om [infoga din nisch. EXEMPEL: få klarhet i din marknadsföring? CTA här]`,
        `Många vet kanske inte detta, men [företagsnamn] startades inte bara för att jag ville [infoga resultatet du hjälper människor att uppnå. EXEMPEL: hjälpa människor att hitta sin drömkarriär], utan också för att [infoga en del av din varumärkeshistoria här. EXEMPEL: jag själv visste hur svårt det kan vara att lämna din trygga anställning, även när den sög själen ur dig].

[Utveckla din historia].

Det är en av anledningarna till att jag är så passionerad över att [infoga ditt varflr. EXEMPEL: hjälpa kvinnor att bryta sig loss från XYZ.] och om du letar efter någon som [sammanfatta historien. EXEMPEL: har känt precis alla samma rädslor som du förmodligen känner just nu]? Då [CTA. EXEMPEL: skicka ett DM med ordet 'HJÄLP', jag skulle älska att prata om hur jag kan hjälpa dig loss från kedjorna!]`,
        `NOTE: Posta med en quote som är betydelsefull för dig om din utveckling. Exempel: “Dream until it’s your reality” eller med en bild på dig.

---

Okej, jag kommer bli lite sentimentalt här, för [idag, den här veckan, den här månaden, det här året] har jag [infoga affärsmål som du nått ELLER något du tänker på just nu. EXEMPEL: nått min 100:e kund, nått 1000 personer i den här fantastiska gemenskapen, fått ett meddelande om XYZ och denna klientens transformation, hjälpt någon att XYZ, kunde lansera min 5:e coachingsomgång för XYZ].

Och även om detta kanske inte verkar storslaget för vissa, är det STORT för mig. För så här är det, [utveckla varför detta mål betyder mycket för dig och ditt företag.

EXEMPEL: att äntligen ha möjlighet att ta in min första anställda innebär inte bara att jag når mina ekonomiska mål, utan att jag också kan ta lite tid koppla av och göra mer av det jag tycker är viktigt i livet; umgås med min familj ELLER att höra att denna tjänst verkligen har hjälpt någon att XYZ, när det bara var en dröm för ett år sedan och inte ens existerade? Det är otroligt.]

Och för det här kan jag inte vara mer tacksam!

Så tack till var och en av er som [vad din gemenskap gör. EXEMPEL: har hjälpt mig att nå denna milstolpe, har trott på mig, har skickat pepp och skickat meddelanden för att låta mig veta hur min tjänst gör en skillnad i världen].

Och kom ihåg; allt börjar med en dröm.`,
        `När jag först [infoga situation som kommer att relatera till din dörmkund direkt. EXEMPEL: blev mamma, startade mitt företag, påbörjade min resa att läka mig själv], fann jag mig själv [infoga situation som du brukade göra men har lärt dig från. EXEMPEL: göra allt i min makt för att behaga potentiella kunder] genom [Hur skulle du göra detta och vad gjorde det ohållbart för ditt företag? EXEMPEL: hitta på omöjliga mål för mig själv att försöka nå, alltid säga ja, överboka kalenderm, inte acceptera hjälp när jag behövde den].

Detta ledde snabbt till [infoga vad som hände dig som andra kanske kan relatera till och vad som skulle hända om du fortsatte på samma sätt. EXEMPEL: jag insåg snabbt att det var ett ohållbart sätt att driva mitt företag och att jag snabbt skulle bli utbränd om jag fortsatte, jag skulle göra fler människor besvikna i det långa loppet om jag inte bara var ärlig från början].

(Låter det här bekant för dig? Isåfall, läs vidare)

Men ur det här kom något viktigt. En lärdom jag vill dela med dig ifall DU känner exakt så här just nu också.

Jag har lärt mig [sammanfatta vad du lärt dig. EXEMPEL: du kan inte vara allt för alla!] och från det? Har jag gjort några förändringar.

[Infoga tips nr 1: EXEMPEL: Jag övar på konsten att säga "NEJ" om något inte får mig bubbla inombords av excitement]

[Infoga tips nr 2:]

[Infoga tips nr 3:]

Så, har detta påverkat mitt [ämne. EXEMPEL: moderskap, företag, läkning]? Det kan du ge dig fan på. På det bästa möjliga sättet!

Har du upplevt något liknande på din resa? Hur har det påverkat dig?`,
        `Nu när slutet av [året. EXEMPEL: 2024] närmar sig är det dags att ta en stund att pausa och reflektera över det år som varit.

Starting on a high, det här året är jag rätt stolt över att [infoga ett mål du uppnådde eller något som hände som fick dig att känna dig stolt - det kan relatera till ditt företag men behöver inte så länge det relaterar till din drömkund. EXEMPEL: som en 'företagsnamn'-gemenskap, nådde vi 2000 personer här som bryr sig om ditt varför lika mycket som vi gör!! nyp mig?!]

Och för varje höjdpunkt under året finns det en curveball. Men dessa motgångar är SÅ viktiga eftersom de lär oss så mycket.

Det här året var det verkligen ett hinder som stack ut mer än andra, och det var [Infoga ett bakslag/hinder/missat mål eller möjlighet som lärde dig något. EXEMPEL: den stora datakraschen i januari 2024 när jag av misstag raderade hela vår webbplats och hade ett mycket panikartat dygn tills webbhotellet kunde få upp den igen. hjälp, det gör jag gärna inte om]

Men vad lärde jag mig? [Infoga lärdom från bakslag. EXEMPEL: Det lönar sig att ha experter till hands för att lösa problem som verkligen inte är inom vårt expertområde. Och att inte trycka på den där stora röda "radera" -knappen igen haha.]

Men oavsett topparna och dalarna är jag så tacksam att vara här med er alla. Att ha denna otroliga gemenskap. Och att kunna [infoga din tjänst. EXEMPEL: hjälpa dig att uppnå XYZ].

Så över till dig - vad kommer du att ta med dig från året som verkligen har format dig som [person/företagsägare/din drömkund]?`,
        `Okej jag har fått nog av [infoga ämne som din drömkund kommer att relatera till. EXEMPEL: folk säger att du har samma antal timmar som Beyoncé på en dag.]

[DET ÄR INTE SANT/DEN STÄMMER INTE]

[Dela varför det inte är sant eller stämmer. EXEMPEL: Visst har Beyoncé samma 24 timmar som oss dödliga, men hon har också ett team, en barnflicka, en manager, en assistent, obegränsad rikedom och ska jag fortsätta?]`,
        `THAT’S A WRAP [år]! And hello [år]! 👋

Nu när jag går in i det nya året är det ett ord jag tänker på som jag vill embody under hela året när det gäller mitt [din nisch som din drömkund kan relatera till. EXEMPEL: företag, marknadsföring, selfcare, föräldraskap, familj].

Och det ordet är [ORD. Exempel: LEKFULLHET, MOMENTUM, KÄRLEK, EMPOWERMENT].

Jag vill att [år] ska [utveckla: bli det året då jag verkligen blir ännu mer avsiktlig om hur jag driver mitt företag. Så att jag kan erbjuda dig de bästa erbjudandena, det bästa stödet, de bästa resultaten och alltid göra saker i linje med mina värderingar.]

Har du ett ord för det kommande året? En vibe du vill ta med dig genom hela året? Dela det nedan och låt oss hålla varandra accountable!`,
        `Tar [infoga ett problem din drömkund har. EXEMPEL: negativt tänkande, din hantering av sociala medier] över ditt [hem, sinne, plats, kontor, kalender, dagar/veckor/månader]?

Det händer de bästa av oss, du är inte ensam!

Och jag kan ärligt säga att det har funnits såå många gånger när detta har orsakat så mycket [infoga känsla förknippad med problem. EXEMPEL: stress, panik].

Det är på grund av detta som jag utvecklade ett sätt att hantera [problemet. EXEMPEL: ett negativt tänkesätt, kalendern för sociala medier].

Här är min guide till [infoga ämne. EXEMPEL: att förbättra ditt tänkesätt, smasha dina sociala medier]:

[infoga praktiskt tips. EXEMPEL: Kom runt ett negativt tankesätt genom att börja dagen med något positivt. Gör det till något litet som blir en enkel vinst, som att vakna tidigt för att ta en 20 minuters promenad med hunden.]

🙌 Hur detta hjälper:
[infoga hur detta tips kommer att hjälpa din drömkund med deras problem. EXEMPEL: Studier visar att att börja din dag med en positiv ton sätter tonen för hela dagen. Du har mycket större chans att förbli positiv hela dagen om du börjar på det sättet.]

[infoga praktiskt tips. EXEMPEL: Jag börjar alltid med att dra en affirmation. Det hjälper mig sätta tonen, som jag sedan bär med mig resten av dagen]

🙌 Hur detta hjälper:
[infoga hur detta tips kommer att hjälpa din drömkund med deras problem.]

[infoga praktiskt tips]

🙌 Hur detta hjälper:
[infoga hur detta tips kommer att hjälpa din drömkund med deras problem.]

Vill du ha fler bra råd och tips som ovan? Gå till [länk i bio/min webbplats/ skicka mig ett DM] för mer information!`,
        `NOTE: Para med en recension

---

Det är sånt här som motiverar mig att göra det jag gör!

Jag gör en liten glädjedans för att fira att min [XYZ-tjänst] har hjälpt [klientnamn här] genom att [sammanfatta hur din produkt har hjälpt dem. EXEMPEL: minska några av hennes dagliga stressmoment som småföretagare - det sparar henne tid och i slutändan pengar som kan användas bättre på andra områden i verksamheten].

Jag lever vekrligen för detta. Det är min passion.

Och jag är så tacksam för [klienter] som DIG! TACK!`,
        `Alright, det är dags att prata om [sätt in ämne. EXEMPEL: varför ditt tankesätt kring innehåll keeps you stuck].

Så ofta ser jag [infoga expertis här om ämnet. Småföretagare som kämpar med innehåll på grund av XYZ. Och det hindrar dem från XYZ på grund av XYZ.]

Och ska jag vara helt ärlig så är det något jag själv har upplevt. [Dela din historia här].

Om du känner igen dig i det här kommer dessa tips för att [sätt in det ultimata målet. AKA bryta cykeln, göra en förändring, uppnå XYZ] verkligen att hjälpa.

[sätt in tips]

[sätt in tips]

[sätt in tips]

Har du testat något av ovanstående? Finns det något du kämpar med? Berätta för mig i kommentarerna!`,
        `This is your sign [Uppmana din drömkund till något du vet att den drar ut på. EXEMPEL: Har du ett utkast som ligger och skräpar på Instagram? Posta det imorgonbitti!]

Jag är övertygad om att [det din drömkund behöver höra för att faktiskt genomföra det. Pepp, tough love, whatever it is. EXEMPEL: det är hur bra som helst, och du kommer med all säkerhet få bättre respons än du tänkt dig 😍 (men skulle du inte få det så är det faktiskt inte hela världen!)]

Jag vill se [vad är det du vill se. EXEMPEL: ditt inlägg som ligger bland dina utkast och bara väääntar på att få bli delat med världen! Tagga mig i ditt inlägg så ger jag det lite kärlek 🥰]`,
    ],
    'Säljande': [
        `[Dela ett nummer från en affärsstatistik som relaterar till din verksamhet från förra året. EXEMPEL: 527] var min [sätt in ämnet för statistiken. EXEMPEL: mängden timmar jag spenderade med att förbereda måltider för mina fantastiska kunder förra året]

Du kanske tänker "herregud, det är mycket [sätta in statistikämne. EXEMPEL: liv spenderat på att laga mat]!"

Och ja, du kanske har rätt.

Men så här ser jag på det, [förklara fördelen med statistiken i förhållande till dig/din verksamhet/din drömkund. EXEMPEL: alla dessa timmar i köket betalar sig tiotalsfalt för mina kunder, vilket gör att de kan ha friskare kroppar och sinnesstämningar, och en MYCKET lyckligare plånbok tack vare betydligt mindre pengar spenderade på hämtmat.]

Och för mig [sätt in något känslufyllt. EXEMPEL: varje enskild timme är värd det med sådana resultat].`,
        `Din lycka = vår främsta prioritet...

Därför har vi på [varumärkesnamn] en [infoga din policy. EXEMPEL: lyckogaranti, passformsgaranti].

[Förklara denna policy. Ge detaljer om policyn och hur den fungerar.]

Så om du oroar dig för [infoga deras oro. EXEMPEL: att det finns en chans att våra klänningar inte passar perfekt på dig], kan du sluta oroa dig eftersom du med denna policy är helt trygg och din lycka garanterad.

Har du några frågor om denna garanti? [CTA. EXEMPEL: Skicka ett DM! Jag skulle gärna hjälpa till].`,
        `Hur många av dessa saker nedan finns på din 'måste-ha' lista när det gäller [din nisch eller bransch. EXEMPEL: att köpa förnödenheter till din XYZ, din hudvårdsrutin, mat till dina husdjur]?

[Något som är viktigt för din drömkund att ditt företag också har EXEMPEL: Produkterna som erbjuds till dina pälskompisar måste vara helt naturliga och fria från skadliga ämnen]

[Något som är viktigt för din drömkund att ditt företag också har. EXEMPEL: Frakten ska vara gratis, för vem vill betala extra fraktkostnader #amiright?]

[Något som är viktigt för din drömkund att ditt företag också har]

Om du kryssade i någon (eller alla) av dessa punkter, är jag så glad att du är här, för dessa saker? Är precis vad [vi, tjänsten/produkten/vårt företagsnamn] handlar om.

[Utöka din varumärkes- och/eller varumärkeslöfte och prata om hur ditt erbjudande möter deras behov ovan. Exempel: På Pets-R-Us tror vi att varje hund förtjänar den bästa maten för de bästa killarna, att ägare inte bör betala mer än nödvändigt för att älska och ta hand om sitt djur, och att XYZ].

Vill du kolla in [erbjudandet/sortimentet/produkten] som uppfyller allt ovan och mer? [CTA - shoppa nu, gå till länken i profilen, skicka ett DM till mig/oss].`,
        `NOTERA: Det här inlägget är bäst att använda när du har en stor satsning på en produkt som du försöker göra slut på/öka försäljningen av eller en tjänst du försöker öka försäljningen av för att framhäva den och ge den lite mer uppmärksamhet. Det förringar inte de andra erbjudandena du har eftersom du tydligt förklarar att du älskar detta för en specifik painpoint/situation.

---

Nu vet jag att jag inte får ha favoriter MEEEEN om du frågade mig om det fanns en [lösningar/produkter] som verkligen var högt upp på min lista för människor som vill [saker de söker/painpoint de har. EXEMPEL: känna sig säkra över sitt innehållsskapande], skulle jag kanske eventuellt berätta för dig att det var [infoga favorit]

Men det är inte för inget! Denna [tjänst/produkt] rankas så högt på min lista för [upprepa painpoint EXEMPEL: säkerhet över sitt innehållsskapande] tack vare [skäl. EXEMPEL: de resultat den ger för klienter som vill uppnå XYA, hur mångsidig den är för att passa varje bransch. Den är inte bara en hjälpsam mikrolösning, utan en helt otrolig lösning för att göra dig till ett proffs på ditt innehållsskapande].

[Utveckla mer här. EXEMPEL: Dessutom, medan AAAALLLLA mina produkter är skapade för att uppnå fantastiska resultat, är denna nära mitt hjärta eftersom den OCKSÅ är bland de första tjänsterna jag tog fram, och den finns fortfarande kvar. The OG. Den har genererat i X antal nöjda kunder och fortsätter göra det regelbundet]

[Infoga en CTA. EXEMPEL: Dörrarna till detta program är öppna JUST NU i några dagar till och om du också vill behärska ditt contentskapande så att du kan tjäna pengar på Instagram, med mig som din lärare, gå till länken i min bio NU för att säkra din plats!].`,
        `[Infoga recension]

Ord som varje företagare ÄLSKAR att se.

[dela mer om ditt företags syfte. EXEMPEL: hjälper dig skapa vackra, tidlösa minnen av din familj] är verkligen min passion, och det är meddelanden som dessa som påminner mig om att jag gör helt rätt grej!`,
        `REAL TALK: Har du funderat på eller spanat in [erbjudande. EXEMPEL: en VIP-dag för att snabbt ta fram en strategi för dina sociala medier?]...

Men kanske har du hållit tillbaka eftersom [infoga drömkundens invändning: du har känt dig lurad av liknande tjänster tidigare, tjänster som lovar världen men som inte levererar.]

Jag förstår det, och jag vill att du ska veta att det är EXAKT den anledningen till att jag har en [infoga garantipolicy här. EXEMPEL: 100% nöjd kund-garanti]!

Japp, du läste rätt! Jag GARANTERAR att [utveckla vad policyn garanterar. EXEMPEL: om du implementerar strategierna från vår session och av någon konstig anledning inte ser resultat? Jag återbetalar jag dig]!

Allt för att du ska kunna investera utan oro, risk eller bekymmer.

Så om det har varit det som har stoppat dig, och eftersom det inte är det längre, [CTA. EXEMPEL: låt oss idag prata om hur jag kan hjälpa dig att [det resultat du erbjuder]. Skicka ett DM eller gå till webbplatsen för att fylla i ansökningsformuläret för att kolla om vi är en perfect match!]`,
        `En liten stolt stund bakom kulisserna från [företagsnamn] huvudkontor fångad här.

Du ser, det är ingen hemlighet att vi här på [varumärkesnamn] brinner för [infoga ämne relaterat till BTS-ögonblicket, EXEMPEL: professionell utveckling och att hålla oss uppdaterade med bästa praxis].

Därför är det precis därför vi [utveckla vidare på ämnet/ögonblicket du delar. EXEMPEL: gör det till vårt mission varje månad att avsätta tid för att hålla oss uppdaterade med vad som förändras inom XYZ-världen för att säkerställa att vi alltid ger DIG den senaste informationen, stödet, utbildningen och mer.].

Så den här bilden? Är verkligen mer än bara en ögonblicksbild. Det är en symbol för vad vi värdesätter. Vad vi står för. Och den tar stolt plats på vår feed eftersom det är något vi tror borde skrikas från hustaken.`,
        `Upp med handen om du någonsin har [infoga invändning eller fråga du får om ditt erbjudande/tjänst. EXEMPEL: undrat som blivande mamma om vår yogastudio tillgodoser dig och din växande mages behov med extra tjocka mattor och yogakuddar för bästa komfort? Undrat om vårt sortiment av hårvårdsprodukter som vi använder i salongen är skonsamma mot XYZ].

Du behöver inte undra längre för svaret är [ja/nej/svar]!

[Infoga information som besvarar och/eller visar trovärdighet, svarar på frågan eller övervinner invändningen. EXEMPEL: Här på företagsnamn har vi en graviditetscertifierad instruktör som håller 3 klasser varje vecka. Så var lugn, du kan (och kommer!) få din träning med någon som har kunskapen att ta hand om dig och ditt växande barns behov. Och dessutom? Yoga som förväntansfull mamma kan också hjälpa dig att FÖRMÅN, FÖRMÅN och FÖRMÅN!]

Har du några frågor om [specifik tjänst som kräver trovärdighet här. EXEMPEL: gravidyoga]? Eller är du redo att [infoga CTA - boka idag, få tag i din första XYZ]? [det du vill att de ska göra - skicka ett DM, besök din webbplats].`,
        `Jag vill inte stressa dig men du VILL INTE missa det här. Om [XYZ dagar/veckor/månader] lanserar vi vår sprillans nya [produkt namn]!

Så, vad är [XYZ produkt] och hur kommer den att hjälpa till?

[XYZ produkt] kommer bokstavligen [infoga transformation av produkten eller ditt produktpromise här].

Inget mer [infoga saker produkten eliminerar från drömkundens liv. EXEMPEL: känna att du är XYZ. Kämpa för att uppnå XYZ. Eller falla platt när du försöker XYZ].

Bara [infoga vad produkten kommer att leverera till drömkund. EXEMPEL: bemästra din XYZ, skapa vågor när det gäller din XYZ och meningsfulla resultat för din XYZ.] Sätt dina påminnelser, för [infoga brådska/brist: begränsade antal kommer att sälja slut snabbt]!

Och om du vill få första tjing, se till att du är [var bör de vara? CTA för din e-postlista, Facebook-grupp, VIP-lista etc.]`,
        `Händerna upp om du någonsin har haft [infoga något din drömkund skulle ha haft/gjort tidigare som din produkt gör enklare/löser. EXEMPEL: problem med att dina babywipes, flaskor och luddtrasor alltid försvinner i skötväskan]?

Eller vad sägs om när [infoga något din drömkund skulle ha haft/gjort tidigare som din produkt gör enklare/löser. EXEMPEL: du har den lyxiga familjeaktiviteten att delta i men barnsakerna inte får plats i dina "ute på stan"-väskor]?

Du kanske blir överraskad att veta att [infoga rolig fakta om din produkt som löser ovanstående problem. EXEMPEL: våra skötväskor är tillverkade av 100% äkta läder för den lyxiga känslan, har 9 olika fack så att dina babywipes aldrig försvinner igen, och är tillräckligt eleganta för att fungera med vilken outfit som helst för vilken händelse som helst].

Faktum är att du inte behöver lyssna på bara oss för att tro på det här. Här kan du se vad en nylig [kund/klient/gäst] har att säga: [infoga kundfeedback för att backa upp dina fakta].

Vill du se själv? [infoga CTA: Gå till länken i bio, besök vår webbplats, skicka mig ett DM]`,
        `THIS IS NOT A DRILL!!!

[Infoga brådskande grej här. EXEMPEL: Endast XYZ kvar, nytt lager har anlänt, en förhandsbokning är på gång!].

[CTA. Exempel - kommentera “XYZ” för att få en länk direkt till XYZ]`,
        `Det är något alldeles speciellt med [infoga ämne som relaterar till din produkt. EXEMPEL: nytvättade lakan en regnig dag]. Doften. Känslan. Och om du orkar - känslan av nykrakade ben mot rena lakan.

Vi vet vad vi kommer att göra när [infoga produkt eller tjänst. EXEMPEL: nya Donna Doona lakan kommer nästa vecka]. Och det är att krypa upp och göra absolut ingenting i sängen.

[Infoga CTA. EXEMPEL: Vill du göra samma sak? Gå till webbshoppen nu för att hitta dessa XYZ].`,
        `Letar du efter [saker din drömkund söker. EXEMPEL det perfekta solskyddet för alla sommaräventyr du ska ge dig ut på?!]?

Då vill du titta HITÅT på [produktens namn/kategorityp].

[Infoga fördelar/funktioner. EXEMPEL: Detta icke-klibbiga, snabbtorkande, semi-färgade solskyddet är den PERFEKTA sommarvännen för att hålla dig maximalt skyddad och samtidigt se ditt absolut bästa ut för alla events och festivaler (och kanske en selfie eller två)].

[CTA. Om du är redo att lägga till detta i din sommargarderob, gå till länken i min bio NU och ange koden SOMMARDAGAR för fri frakt. Endast 2 dagar kvar!!]`,
        `Någon sa [infoga ämne här: EXEMPEL: nya kläder till din fyrbenta vän?]

Perfekt för [infoga fördel. EXEMPEL: att hålla dina små vänner varma, friska och pigga även under vintermånaderna],

[CTA. EXEMPEL: du kan hämta dessa små guldkorn i vår webbshop den här veckan.]`,
        `Visst är vissa saker bättre när de är tillsammans. Precis som våra [infoga två produkter eller din produkt och en perfekt sak att para ihop den med. EXEMPEL: sommarklänningar och söndagsbrunch, långa promenader med vårt säkra hållbara solskydd, vår picknickfilt och picknickryggsäck].

[CTA. EXEMPEL: Skicka ett meddelande för länken för att lägga till denna perfekta kombination i ditt liv nu]`,
        `Vill du att [infoga ämne eller pain point. EXEMPEL: dina svårigheter med att gå till din garderob varje morgon bara för att hitta kläder som inte får dig att känna dig självsäker och fantastisk] ska bli ett minne blott? *_vinkar hejdå_*

I så fall är det här bokstavligen SKAPAT för dig.

[XYZ produkt/paketet] är specifikt för [infoga din drömkund] som vill [strävan/önskan].

För vi vet hur det är att [infoga din drömkunds problem som produkten/lösningen löser. EXEMPEL: inte känna dig som den gudinnan du är på insidan hela vägen till utsidan - att kämpa med kläder som verkligen visar den vackra inre du].

Så vi skapade denna produkt [infoga detaljer. EXEMPEL: så att du enkelt kan inkludera mer livliga färger och sexiga, silkeslena, feminina material tillsammans med en vacker skärning som får dig att känna dig helt fantastisk].

Vill du spana in det själv och säga adjö till dina svårigheter för gott? [CTA. EXEMPEL: Gå till länken i vår bio och shoppa den nya kollektionen nu innan den tar slut]`,
        `FÖRSLAG. Para ihop detta med ett snabbt erbjudande som är begränsat. Lägg till detaljerna i ett karusellinlägg.

\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\__

Du vill inte missa det här!

Det här är en av de mest speciella [särskilda erbjudanden] jag har skapat hittills!

Så varför ville jag göra detta och varför erbjuder jag detta bara för [infoga detaljer. EXEMPEL: månaden december, de första 3 personerna]?

[infoga anledning till att du skapade det här unika specialerbjudande. EXEMPEL: Eftersom jag vet hur bra det kan kännas att starta det nya året med ett BAM och det här erbjudandet kommer att hjälpa dig XYZ]

Om detta låter som något [du vill/ du behöver i ditt liv/ för bra för att missa], gå till [CTA]`,
        `Det perfekta [infoga saken. EXEMPEL: bikinitrosan] finns inte - vänta lite nu. Vad har vi här?!...

[Infoga detaljer om produkt, erbjudande. EXEMPEL: Den här bikinitrosan är inte som andra du kanske har testat tidigare eftersom DENNA har XYZ.]

[CTA. Vill du veta mer och hur detta kan förändra ditt bikini-liv för alltid? Gå till länken i min bio för att läsa mer!]`,
        `Har du någonsin önskat [infoga beskrivning av vad din drömkund önskar. EXEMPEL: en klänning så lätt och sval att du bokstavligen känner som om du bär din favoritmjukisklädsel - samtidigt som du fortfarande ser snygg ut som attan ändå?]

Vet du? Önskningar uppfylls. Kolla in vår nya [infoga produkt/erbjudande/gratishämtning] - gå till [CTA länken i min bio nu].`,
        `Är du redo att bli imponerad!? Vi har spännande nyhet på ingång!

Känner du dig alltid [relevant för din drömkund. EXEMPEL: överväldigad av det galna antalet babybadprodukter på marknaden]?

Är du konstant [relevant för din drömkund. EXEMPEL: orolig för de skadliga ämnen du kanske använder på din lilla bebis hud]?

Är du trött på [relevant för din drömkund]?

Dessa känslor? De är den främsta anledningen till att vi har skapat [infoga produkt här som löser drömkundens känslor. EXEMPEL: en HELT NY hudserie speciellt framtagen för din lilla med känslig hud].

Vad gör [infoga produkt] annorlunda jämfört med andra på marknaden?

[infoga det som är så speciellt med just din produkt. EXEMPEL: Vi fokuserar på att skapa endast de MEST SKONSAMMA formuleringarna som testas av professionella dermatologer]

[infoga det som är så speciellt med just din produkt.]

[infoga det som är så speciellt med just din produkt.]

Kolla in denna sprillans nya [produkt] nu [CTA. EXEMPEL: genom länken i min bio].

PS. Dessa kommer inte att finnas länge!`,
        `NOTE: Para med en recension

---

Ummm, helt sprudlande av lycka över denna otroliga feedback vi fick [infoga tid/ämne. EXEMPEL: om XYZ-produkten].

Denna feedback är EXAKT varför [vi gör det vi gör, vi skapade denna produkt]. Är du fortfarande inte övertygad om att [XYZ-tjänsten] är för dig? [Gå till vår FAQ-sida, skicka ett DM till oss, läs några fler testimonials här].`,
        `NOTE: publicera med 2 olika bilder på produkter som karusell eller sida vid sida

---

1 eller 2? Vilka [produkt här. EXEMPEL: par gummistövlar] är dina favoriter?

[Infoga skillnader här. EXEMPEL: Våra stiliga taupe-stövlar som är gjorda för trädgårdsarbete till dagliga kläder, eller är våra ljusa turkosa stövlar mer din grej? De här skönheterna är gjorda för att synas!]

Berätta din favorit i kommentarerna!

[Valfri CTA]

Vill du veta en liten hemlighet? Båda dessa skönheterna är för närvarande [infoga något lockande. EXEMPEL: på 20% rabatt just nu eller håller på att ta slut i lagret eller helt nya i butiken!] Spring, gå inte, till butiken nu! Länken i min bio.`,
        `Jag vet inte vem som behöver höra det här, men [infoga uppmaning. EXEMPEL: du behöver verkligen, verkligen den där nya outfiten du har spanat in nu i en vecka.]

[Infoga uppmaning. Lägg till denna skönhet i din sommargarderob NU]

[Infoga CTA. EXEMPEL: Skynda dig till webbshoppen direkt!]`,
        `[Unik fördel med din produkt. EXEMPEL: Det mjukaste materialet, handgjort och bra för planeten.]

Den perfekta kombinationen? Är [koppla detta till ditt erbjudande. EXEMPEL: de tre första sakerna du kommer att älska med XYZ-produkten.].

Och det finns en HEL hög med fantastiska fördelar utöver det också. Vill du veta mer?

[Infoga CTA. EXEMPEL - Gå inte, utan SPRING till webbshoppen nu och kolla in demovideon på vår nya unika kollektion!! Länk i bio.]`,
        `Om du inte har sett det än, låt oss ta en stund för att uppskatta [infoga ämne: EXEMPEL: skönheten i XYZ-produkten, glädjen som XYZ kommer att tillföra i ditt hem, sättet som XYZ ser ut mot XYZ].

Och om du vill [infoga önskan: EXEMPEL: lägga till denna skönhet till DITT hem]?

[Infoga uppmaning. DM:a mig för en speciell early bird-länk som kommer med en UNIK rabatt!!]`,
        `Är det någon annan som också är exalterad över att [sak din drömkund ser fram emot. EXEMPEL: förändringen i vårvädret, att se de små återvända till skolan, sommarens utomhusäventyr som är på väg att börja?]

[Situation de kommer att befinna sig i. EXEMPEL: Skicka de små tillbaka till skolan med så mycket självförtroende och leenden på deras glada ansikten] med [Infoga produkten. EXEMPEL: våra Disney-inspirerade ryggsäckar som ser fantastiska ut, håller över tiden och kommer att göra dina barn glada].

[CTA. EXEMPEL: Shoppa nu och gör de där skoldagarna extra speciella. Länk i vår bio]`,
        `NOTE: Para med en recension

---

BRB, ska bara gå iväg för att gråta (glädjetårar) över denna UNDERBARA [kund]recension.

Jag är så tacksam för var och en av er som stöttar mig så att jag kan göra det jag gör varje dag och utforska min passion för [din verksamhetsnisch här. EXEMPEL: att skapa bordsdekorationer som perfekt kompletterar och förhöjer stämningen på dina evenemang.]

Jag lever för feedback som denna... det gör mig så glad att veta att jag har [vad din verksamhet gör. EXEMPEL: bidragit till någons stora dag på ett så meningsfullt sätt.] Så mycket att de kände behovet av att sätta penna till papper för att berätta för mig hur mycket de älskade det.

PS - vill du uppleva samma resultat som [namn eller denna fantastiska kund?].

Du kan [vad kan de göra. EXEMPEL: kolla in våra färdiga eller anpassade bordsdekorationer] genom länken i min bio! Bara [infoga brådska här. EXEMPEL: två dagar kvar för vår “köp tre få en gratis”-erbjudande så skynda dig!]

Och min DM är alltid öppen om du har några frågor eller funderingar!`,
        `Vill du veta vad du kommer att få ut av [produkten. EXEMPEL våra skräddarsydda, unika namnhalsband]? Förutom [uppenbar inkludering. EXEMPEL: ett tidlöst smycke som du kan bära i många år framöver och fyller dig med kärlek och glädje] förstås?

Utöver det? [Infoga förvandling/ett annat resultat. EXEMPEL: Ditt namnhalsband är gjort för att inte bara vara ett vackert tillskott till vilken outfit som helst, utan också en källa till stolthet i vem du är - i din plats i världen. Ett sätt att säga till världen...]

[Förklara vidare om det behövs]

Och jag vet inte hur det är med dig, men för mig? Är det en ganska söt addering till mitt liv. Och om det är något som du skulle vilja lägga till i ditt liv? [CTA: låt oss prata om hur vi kan skapa ett smycke för just dig som fyller ditt liv med skönhet och självförtroende samtidigt.]`,
        `NYHETER JUST NU!

(Har jag din uppmärksamhet? Du kommer vara glad att du slutade scrolla, lita på mig.)

Jag är SÅ exalterad över att meddela att [infoga specialerbjudande. EXEMPEL: rea/rabattkod/ny tjänst/nerladdning eller en brådskande meddelande som "1 stycke kvar"] är tillgängligt [tidsram. EXEMPEL: nu/nästa vecka/imorgon]!

Och om du vill veta mer, så [vart vill du att de ska gå? EXEMPEL: klicka på länken i bio/gå till vår webbplats/skicka mig ett DM]`,
        `Vill du veta skillnaden mellan vår [XYZ] och [XYZ]?

Låt oss gå igenom det! Swipea i inlägget för att se detaljerna.

[Infoga CTA. EXEMPEL: och om du är redo att lägga till en ELLER BÅDA i din värld? Gå till butiken via länken i min bio nu]`,
        `TRÄFFA [erbjudandets namn/beskrivning]!

Den här skönheten är en av våra bästsäljare och för att vara helt ärlig - jag är inte förvånad över det.

[infoga anledningar till varför folk älskar den här - hur funktionerna eller resultaten gynnar deras liv. EXEMPELVIS, den har XYZ-ingrediens för XYZ. Den har en unik formula för XYZ. OCH det är till ett pris som får dig att SPRINGA för att lägga till den i kundvagnen innan rean slutar på fredag]

[infoga uppmaning till handling. Är du redo att se varför människor lämnar XX antal 5-stjärniga recensioner? Klicka på länken i vår bio nu för att lägga till detta i din värld]`,
        `ÅH - så mycket kärlek kommer alltid in för detta [erbjudandets namn].

Kärlek för [funktion/fördel. EXEMPEL ljus, glada mönster som ger så mycket glädje till vilket utrymme som helst]

Kärlek för [funktion/fördel]

Och kärlek för [funktion/fördel]

Vill du vara nästa person att bli förälskad? [Infoga CTA]`,
        `Ta det lugnt, men - det är bara [återstående erbjudande] kvar!!

Och efter det? [infoga detaljer om nästa tillgänglighet. EXEMPEL: vi kommer inte att fylla på lagret förrän om 4 veckor!]

Jag vill inte att du ska lida av ett otäckt fall av FOMO så [CTA].`,
        `OK - berätta - this or that?

Swipa mellan dessa två älsklingarna och låt mig veta i kommentarerna:

[emoji] för [produkt/bild] eller
[emoji] för [produkt/bild]

Och om du vill att THIS or THAT (eller båda) ska vara dina IRL? [Infoga CTA. EXEMPEL: Klicka dig in på hemsida direkt!]`,
        `Påminnelse: Det är okej att [infoga drömkunds pain point. EXEMPEL: känna sig överväldigad, stressad och faktiskt lite vilse].

[Erkänn pain point. EXEMPEL: Dessa är alla giltiga känslor, och vi har alla varit där någon gång eller annat.]

Och om du känner så här just nu? Just detta ögonblick? Eller inte vill känna så här i framtiden? Då har jag ett litet verktyg som kan hjälpa dig.

[infoga freebie och utfall av freebie. EXEMPEL: Vi har nyligen lanserat en e-bok som hjälper dig att arbeta igenom dessa känslor på ett hälsosamt sätt som lämnar dig med ett klart huvud och undrar var den här har varit hela ditt liv.]

Allt du behöver göra är [vad vill du att de ska göra? Gå till länken i bio, anmäl dig till e-postlistan för att få den gratis, skicka mig ett DM, etc] och jag kommer att vara i din inkorg, redo att hjälpa dig på nolltid.`,
        `Alla säger det med mig nu... "Jag kommer inte [drömkunds vanliga misstag som din produkt löser. EXEMPEL: glömma att applicera solkräm innan jag sminkar mig!"]

Och om du undrar exakt hur du kan uppnå detta? Läs vidare!

[Genom våra/vi har precis lanserat vår] [produkt/freebie här. EXEMPEL: helt nya foundation] som [löser kommande misstag/problem här. EXEMPEL: *_trumvirvel_* har solskydd inkluderat i formulan! Säg adjö till att gå ut och bli träffad av hårda UV-strålar och låt din hud se XYZ, XYZ och XYZ ut hela dagen lång!}

Redo att lyfta din [ämne här. EXEMPEL: hudvårdsrutin]?

Då är det bara att gå till länken i vår bio för att [vad vill du att de ska göra? Registrera dig för förhandsbokning, ladda ner e-boken, registrera dig för e-postlistan för rabatt, etc].`,
        `En liten påminnelse om att det bara finns [nummer av platser/produkter/öppningar/saker) kvar [tidsram. EXEMPEL: innan vi stänger förhandsbokningen av den nya boken den här gången]

Så, om du inte vill missa det här - se då till att, inte gå utan, SPRINGA till hemsidan`,
        `PSSSSST: Har du kikat på vår [produkt-/sortimentsnamn] ännu? Inte för att skryta, men det kan mycket väl vara [infoga lockande element - den mest glädjefyllda serien av XYZ vi någonsin har skapat, den snabbast säljande kollektionen vi någonsin har haft!]

Och den väntar på att hjälpa dig [infoga fördel - dvs. lägga till mer glädje i ditt liv] idag med bara ett klick på en knapp. Den knappen är länken i min bio.`,
        `Letar du efter en [sak din drömkund letar efter. EXEMPEL: den perfekta sommarklänningen att para ihop med XYZ]? Tja, du behöver inte leta längre, men du får skynda dig eftersom [produktens namn] bokas [upp/ut] SNABBT!

Gå till länken i min bio för att se varför detta snabbt kommer att bli din [infoga beskrivning. EXEMPEL: favoritoutfit denna sommarsäsong].`,
        `Det här är ditt tecken på att alla dina [infoga ämne: sommarbekymmer, bildtextbehov, önskemål för barnrum] kommer lösa sig! Hur? Gå till länken i min bio för att kolla in [den nya kollektionen] och du kommer att förstå varför.`,
        `NOTE: Para med en recension

\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\__

Det finns inget bättre än att få meddelandne från glada kunder/klienter (förutom kanske [infoga autentiskt element för dig. EXEMPEL kaffe, choklad, vin, valpar] kommer nära, men jag är bara människa, eller hur?)

Så när jag öppnade det här meddelandet? Ja, det är säkert att säga att jag kände ALLT.

Om du ocks¨vill ha resultat som detta, så [infoga CTA. EXEMPEL: gå till länken i min bio och kolla in XYZ-sortimentet, boka ett samtal, shoppa i butiken]`,
        `Föreställ dig hur fantastiskt det skulle kännas att [resultat av din freebie. EXEMPEL: ha en färdig guide för hur man bäst förbereder måltider för veckan framöver - GRATIS! ELLER svep en 10% rabatt på din nästa beställning PLUS kom med på VIP-listan för nya lanseringar!]

Om det låter som något som väcker glädje/nyfikenhet/känsla hos dig, behöver du inte föreställa dig det längre för jag kan göra detta till din verklighet!

Gå till [länken i min bio ELLER sätt in länken för IG/FB] och [vad vill du att de ska göra? Anmäl dig till mailinglistan idag för att få 10% rabatt direkt till din inkorg! Ladda ner min 10-sidiga gratisguide om hur man gör måltidsförberedelser till den enklaste uppgiften på veckan].`,
        `[Infoga pain point som ett citat här. EXEMPEL: "Jag ska inte gå ikväll. Jag har inget att ha på mig!!"]

Är detta något du har sagt till dig själv tidigare??

Om du känner igen dig är jag här för att hjälpa dig att se till att du kan radera den meningen helt från ditt vokabulär och aldrig tänka, säga eller känna det igen!

[Gör ett direkt erbjudande till din tjänst eller produkt. EXEMPEL: Min helt nya lösning 'Arbeta med din garderob' är en kurs och PDF som kommer att hjälpa dig att lära dig att göra det mesta av det du har i din garderob JUST NU för att skapa drömoutfits].

Det kommer att hjälpa dig [fortsätt med fördelar och resultat]

[CTA. EXEMPEL: gå till länken i min bio för att skaffa detta idag och säg adjö till att 'inte ha något att ha på sig' för alltid.]`,
        `Älskar du en bra deal? Ja, det gör jag med. 😍

Därför är jag så exalterad över att erbjuda [erbjudande och tidsram] [insert specialerbjudande här. KOM IHÅG: Det behöver inte vara en rabatt eller rea utan kan vara något som läggs till vid produktsälj, eller en speciell paketerbjudande eller begränsad paket. Tänk utanför boxen och erbjud något lockande].

Men skynda dig! Precis som de säger, alla bra saker måste komma till ett slut och detta är endast tillgängligt [infoga tidsram/brist: för de första 10 personerna. Till och med fredag. Endast i 7 dagar.]`,
        `NOTE: Para med en recension

\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\__

Varför får denna recension mig att dansa av glädje i mitt vardagsrum (mer än vanligt?)

För att [bryt ner recensionen ytterligare. Nämn något som överensstämmer med din vision? Vision? Ett särskilt resultat? Om det finns något särskilt i recensionen, framhäv detta och skapa en bildtext om varför detta är så viktigt för dig.]

PS vill du uppleva resultat som dessa själv? [infoga CTA här för att boka eller köpa från dig]`,
        `PSST: Att [sluta ge din bebis nappen] har just blivit lättare. Mycket lättare.

Inget mer [bekymmer för att din bebis är stressad och gråter efter tröst]

Ingen mer [bekymmer].

Och MASSOR MER av [önskan eller strävan].

Hur?

[Genom vårt nya enkla lugnande produkt].

[Förklara produkterbjudandet och uppmana människor att köpa nu eller boka nu].`,
        `Den senaste [produkttypen] i vårt sortiment, [Perfekt Nattmun], är verkligen en av [våra/mina] favoritlösningar från [varumärkesnamn] NÅGONSIN. Och detta är varför [vi/jag/kunderna] älskar den:

De [funktionerna] innebär att [fördelen för målgruppen]

Genom [funktionerna] kommer du att [fördelen för målgruppen]

[funktionerna] hjälper dig att [fördelen för målgruppen]

Och [funktionerna] [fördelen för målgruppen]

Kolla in [produktnamnet] nu [call to action. GENOM länken i min bio.].

[VALFRI CTA] Och PS - stor chans att den här kommer att sälja slut, så skynda dig att få tag på den!`,
        `Om du funderade på det, är här en vänlig påminnelse om att det nu bara finns [antal, EXEMPEL: tre] av [platser/produktens namn] kvar [tidsram, EXEMPEL för denna månad, någonsin!].

Japp, det här är INTE en övning. Om du vill säkra en av de sista återstående [typer av erbjudande: t.ex. tider, specialpaket, produkter, flaskor], [call to action. EXEMPEL: gå till rean nu genom länken i min bio].`,
        `Det är officiellt: imorgon stänger vi för [förbeställningar, vår försäljning av XYZ, vår vinterspecial]!

Denna [produkt/serie] kommer att göra dig [infoga fördel/transformation]

Har du haft ögonen på [XYZ-produkt]? I så fall vill vi bara meddela, utan stress, att det här är sista chansen att handöa!

[CTA. EXEMPEL: gå till länken i min bio/DM:a mig för att beställa nu]`,
        `POV: Du är [infoga något din målgrupp skulle vilja. EXEMPEL: redo för dejt med STRÅLANDE hy].

Hur får man detta att hända i verkligheten?

Lätt som en plätt. Följ våra enkla steg för [infoga ämne. EXEMPEL: att få strålande, glödande hud]:

[infoga tips #1]

[infoga tips #2]

[infoga tips #3]

Och vill du ha lite extra för att ge din [infoga ämne. EXEMPEL: hud] den hjälpen den kan behöva?

Då ska du lägga vantarna på vår [XYZ produkt/tjänst] [infoga CTA. EXEMPEL: här/på hemsidan/genom att anmäla dig till vårt e-postutskick/DM:a mig/länk i bio/ etc]`,
        `Vill du vara med på [infoga något som genererar leads för dig. EXEMPEL: gratis makeup-tips och råd VARJE vecka]?

Är det ett öronbedövande SJÄLVKLART, jag hör?

Då måste du bege dig till [infoga CTA. EXEMPEL: hemsidan, mina DM, länken i bio] för att [vad måste de göra? EXEMPEL: anmäla dig till vårt veckovisa e-postutskick].

[Varför ska de göra detta? Vad får de? EXEMPEL: Varje vecka fyller vi det med godsaker som hjälper dig att X, Y och Z.]

Missa inte [infoga mer info här. EXEMPEL: veckans nyhetsbrev som skickas ut imorgon! Vi pratar om XYZ och ger en förhandstitt på en helt ny, inte-att-missa produkt].`,
        `Ingen har tid att [infoga sak här som din drömkund inte har tid med. Därför har vi/jag gjort det åt dig!

[CTA. EXEMPEL: skynda dig till hemsidan och ladda ner min guide].`,
        `PSSSSSST: letar du efter [ämne. EXEMPEL. Den perfekta presenten för morsdag? ].

Well, ditt letande är över!

[infoga lösning med fördelar. EXEMPEL: Den här presentkorgen är perfekt för den där spciella kvinnan i ditt liv, och som kommer få henne känna sig älskad tack vare XYZ]

[ Infoga CTA. Vill du skämma bort någon särskild på ett särskilt sätt? Beställ via DM NU!]`,
        `[Något . EXEMPEL: förvaring], men gör det [något. billigt och snyggt].

[infoga lösning med fördelar]

[infoga CTA]`,
        `💛 Om du gillar [infoga ämne. EXEMPEL: att sticka ut från mängden... men göra det stilrent]

💛 Om du gillar [infoga ämne. EXEMPEL: att vara en trendsetter, samtidigt som du stödjer små företag och konstnärer]

💛 Om du gillar [infoga ämne. EXEMPEL: att skydda och styla din teknik]

➡️ då borde du prova [infoga produkt/tips som relaterar. EXEMPEL: våra vackra mobilskal, skapade med unika konstverk från lokala konstnärer]

[Infoga CTA. EXEMPEL: Klicka på länken i bio] för att få tag i [infoga sak. EXEMPEL: ett underbart, unikt mobilskal] så snabbt som möjligt!`,
        `Det finns inget som [infoga ämne. EXEMPEL: nytvättade lakan på en säng].

[Utveckla ämnet, gärna positivt. EXEMPEL: Speciellt när de har tvättats med miljövänligt tvättmedel som inte förstör haven med mikroplaster].

Det är en fantastisk känsla som vi kan lova att du verkligen vill uppleva.

[infoga CTA]`,
        `Sista timmarna att få tag på [XYZ produkt]!

De/Dem säljer snabbt och lita på oss, du VILL INTE missa det för att [varför? EXEMPEL: vi kommer inte att fylla på dessa godingar / vi stänger dörrarna för detta erbjudande för gott]!

[infoga CTA]`,
        `Om du bara fick välja en [infoga sak. EXEMPEL: par stövlar att bära resten av ditt liv, ett sätt att göra XYZ, en typ av XYZ], vad skulle det vara?

Swipa i inlägget för att se vad vi skulle välja!

Och oroa dig inte, vi har alla dina [infoga ämne. EXEMPEL: handgjorda, läderstövlar] sorterade här [infoga CTA].`,
        `Visste du att [infoga ämne och en fördelaktig fakta om din drömkund. EXEMPEL: doftljus spelar en avgörande roll för de fysiologiska effekterna av humör, stress, arbetsförmåga och övergripande mental hälsa]?

Det är fakta, folk. Det är vetenskap.

Så här är din lilla påminnelse om att inte känna dig skyldig när du klickar på [‘lägg till i varukorgen’/boka nu]... du gör [dig själv/din vän/din älskade/dina kunder] en tjänst!`,
        `NOTE: Paras med UGC-bilder/videos eller kundbilder/kundvideos.

---

PSSSSST: Letade du efter [din produkt/lösning. EXEMPEL: den perfekta skötväskan] precis som den här [kunden. EXEMPEL: mamman] gjorde? I så fall behöver du inte leta längre, för vår [produktnamn] är perfekt för dig.

PS. Vi älskar att se \\@[TAGGAPERSONEN] [peka ut något på bilden. EXEMPEL: se så stilig och lycklig ut på sin utflykt med sin lilla Jimmy]`,
        `Har du [situationen personen står inför. EXEMPEL: en semester på gång], men [ett problem de vet att de kan stöta på. EXEMPEL: du är SKRÄCKSLAGEN vid tanken på att förlora ditt pass]?

Oroa dig inte längre!!

[infoga din produkt som lösningen. EXEMPEL: Vår passfodral kommer att se till att du...]

[CTA. EXEMPEL: Shoppa nu och gör semestern till en stressfri dröm med en mindre sak att tänka på. Länk i vår bio]`,
        `Det är officiellt [infoga en situation. EXEMPEL: vinter!!]

[Infoga vad de vill göra. EXEMPEL: Håll dig varm, torr och alltid stilig] med [infoga din lösning. EXEMPEL: vår vackra vinterkollektion av accessoarer tillverkade av hållbara tyger]

[CTA. EXEMPEL Shoppa nu och gör dessa vinterdagar extra speciella. Länk i vår bio]`,
        `Jag får ofta frågan [en vanlig fråga. EXEMPEL: hur får jag ditt content att låta som du när jag inte är du].

Och så här är det. [Prata om dina processer/metoder/system].

Är du redo att [det drömkunden längtar efter eller problem din tjänst löser. EXEMPEL: få hjälp att skriva content som känns som DU? Kontakta mig, för jag skulle älska att få hjälpa en fellow soloprenörska!]

[CTA. EXEMPEL: Kommentera eller skicka ett DM med [emoji] så skickar jag mer info om tjänsten/produkten].`,
        `Idag ska jag dela med mig av en liten hemlighet….

‌

Jag får ibland frågan om det finns en särskild produkt/tjänst som ligger mig extra varmt om hjärtat, och ja det finns en jag gillar extra mycket för just [painpoint som din drömkund har], och det är……

…

…

…

[Tjänst/produkt]

Jag vet, jag vet, jag får inte ha favoriter men den här har en alldeles särskild plats i mitt hjärta. Och det av en särskild anledning.

[Prata om varför du gillar den tjänsten/produkten lite extra. Koppla till drömkundens painpoints eller problem som den löser för din drömkund]

[Om du vill kan du inkludera en punktlista med varför din tjänst/produkt är så bra kan du göra det också!]

Nu slår jag återigen upp dörrarna och ger dig möjligheten att uppleva magin inne i [tjänst/produkt]-värmen! Om du är redo att [förändring din drömkund kommer göra], kika på länken i min bio för att säkra din plats!`,
        `NOTERA: Det här inlägget är bäst att använda när du har en stor satsning på en produkt som du försöker göra slut på/öka försäljningen av eller en tjänst du försöker öka försäljningen av för att framhäva den och ge den lite mer uppmärksamhet. Det förringar inte de andra erbjudandena du har eftersom du tydligt förklarar att du älskar detta för en specifik painpoint/situation.

---

Nu vet jag att jag inte får ha favoriter MEEEEN om du frågade mig om det fanns en [lösningar/produkter] som verkligen var högt upp på min lista för människor som vill [saker de söker/painpoint de har. EXEMPEL: känna sig säkra över sitt innehållsskapande], skulle jag kanske eventuellt berätta för dig att det var [infoga favorit]

Men det är inte för inget! Denna [tjänst/produkt] rankas så högt på min lista för [upprepa painpoint EXEMPEL: säkerhet över sitt innehållsskapande] tack vare[skäl. EXEMPEL: de resultat den ger för klienter som vill uppnå XYA, hur mångsidig den är för att passa varje bransch. Den är inte bara en hjälpsam mikrolösning, utan en helt otrolig lösning för att göra dig till ett proffs på ditt innehållsskapande].

[Utveckla mer här. EXEMPEL: Dessutom, medan AAAALLLLA mina produkter är skapade för att uppnå fantastiska resultat, är denna nära mitt hjärta eftersom den OCKSÅ är bland de första tjänsterna jag tog fram, och den finns fortfarande kvar. The OG. Den har genererat i X antal nöjda kunder och fortsätter göra det regelbundet]

[Infoga en CTA. EXEMPEL: Dörrarna till detta program är öppna JUST NU i några dagar till och om du också vill behärska ditt contentskapande så att du kan tjäna pengar på Instagram, med mig som din lärare, gå till länken i min bio NU för att säkra din plats!].`,
        `NOTE: Det här är grymt som en karusellpost om du har längre recensioner du vill dela. Ha en CTA på sista sidan om att läsaren kan boka/köpa/investera/höra av sig om den också vill ha såna resultat som i recensionen.

---

Har du någonsin undrat [FAQ om din produkt eller tjänst. EXEMPEL: hur Creative Content Club hjälper så många olika tjänstebaserade företag att bli sedda, älskade och sälja från en enda uppsättning mallar?]

Idag delar jag detaljerna om hur!

[Infoga information här för att svara på frågan. EXEMPEL: Creative Content Club hjälper så många småföretagare eftersom den är baserad på en universell strategi som alla tjänsteleverantör kan använda sig utav! Detta inkluderar ... ].

Och det är därför så många människor också har så många fantastiska ord att säga om det! Swipa genom karusellen för att se några vittnesmål från fantastiska [medlemmar/kunder/klienter]!

Har du några frågor om [ämne. EXEMPEL: Creative Content Club]? I så fall, DM:a mig eller ställ dem nedan i kommentarerna! Jag skulle älska att hjälpa dig framåt!`,
        `Ska du [göra något som människor överväger inom din nisch som är något mindre än det du erbjuder. EXEMPEL: få din contentkalender gjord av Chat GPT] ELLER [infoga lösningen som du erbjuder. EXEMPEL: anställa en expert för att göra detta åt dig?].

Det är en fråga folk frågar mig hela tiden - och du ska veta att jag förstår de tankarna!

Jag förstår att [infoga eventuella invändningar folk kan ha eller varför de kanske väljer det andra alternativet. EXEMPEL: att använda en AI-robot gratis istället för att anlita någon att göra jobbet för en dyr peng kan kännas som en bra investering].

Men något jag alltid kommer be dig tänka på när du ska göra ditt val är detta:

När du [arbetar med/köper från din nisch. EXEMPEL: arbetar med en expert inom content], får du [infoga fördelarna eller distinkta skillnader i resultat, service etc. EXEMPEL: inte bara en 'allmän' contentkalender. Eller värre - en lista med content som inte alls är anpassat för din målgrupp. Det du faktiskt får när du jobbar med en expert? Är en contentkalender som stöds av psykologi och känslor ..].

Så även om det alltid finns alternativ tillgängliga, är det viktigt att du hittar rätt alternativ som faktiskt hjälper dig att nå dina mål.

Vill du prata mer om [infoga din nisch: EXEMPEL: att ha en framstående contentkalender med innehåll som talar direkt till din drömkund och får de att vilja investera i dig direkt? CTA här]`,
        `Hemligheten är ute. [Jag/vi] gör saker lite annorlunda här på [företagsnamn]. Men på det BÄSTA sättet!

Så här är det, när du arbetar med mig/oss eller köper från mig/oss kan du förvänta dig några saker

1 [Infoga exempel: Dina videosamtal med mig kommer inte bara att vara fylld av värme och kunskap, utan du kommer också troligen att träffa Evie, den fyrbenta kontorsassistenten.]

2 [Infoga exempel: Priset? Kommer att få dig att dubbelkolla om du läste rätt, för jag ser till att hålla din investering så låg som möjligt eftersom små företag inte har stora budgetar men FÖRTJÄNAR stor support.]

3 [Infoga exempel]

Och listan fortsätter...

Dessa saker - både små och stora - gör [företagsnamn] till vad det är, och de är saker som gör [oss/mig] jäkligt stolta! P

S vill du veta mer om [tjänsten eller produkten]? Besök länken i min bio!`,
        `Resultatet efter [tidsram, EXEMPEL: 3 dagar]!

Det här är vad mina kunder upplevt efter att de aktivt jobbat efter [det du erbjuder i ditt företag. EXEMPEL: den personliga Instagramstrategin jag tagit fram till dem]

‌

👉 [Kundresultat 1. EXEMPEL: En person fick två jobbförfrågningar (inte billiga!) med endast 9 bilder publicerade på sitt nystartade Instagramkonto]

👉 [Kundresultat 2]

👉 [Kundresultat 3]

👉 [Kundresultat 4]

Det här är bara några av resultaten mina kunder fått med [din tjänst. EXEMPEL: strategin]. Du kan också bli en av dem!

Den är [beskriv hur tjänsten/produkten är. EXEMPEL: mastig men kraftfull]. Jobbar du aktivt, lyssnar och följer mina råd, kommer du att få resultat - så är det bara 💃

[Infoga CTA. EXEMPEL: Kommentera ”🥳” eller skicka ett DM så skickar jag en länk där du kan läsa mer]`,
        `Mitt hemliga (inte längre) recept för [det som din freebie/tjänst/produkt handlar om. EXEMPEL: effektiv planering av din Instagram!]

Jag [vad gör du i freebien/tjänsten/produkten? EXEMPEL: tar med dig steg för steg i min process för att planera, skapa och schemalägga över 20 inlägg och stories, på bara en halv dag!]

[Infoga CTA. EXEMPEL: Kommentera ”ja tack” så skickar jag länken i DM 🥳]

[Addera extra CTA: Inte tid att spana in den nu direkt? Spara inlägget så du hittar tillbaka enkelt]`,
        `Mina [klienter/kunder] kommer till mig och [varför kommer de till dig? EXEMPEL: vet att något behöver fixas, och de är redo att göra jobbet som krävs].

‌

☝️ [sak drömkunden behöver göra/höra/veta. EXEMPEL: De vill veta exakt vad de kan göra bättre och hur, inga krusiduller eller linda in fint]

✌️ [sak drömkunden behöver göra/höra/veta: EXEMPEL: De är inte rädda för att ta hjälp]

🤟 [sak drömkunden behöver göra/höra/veta: EXEMPEL: De är redo att släppa på perfektionismen för att göra sina mål lättillgängliga]

‌

Alla som jobbat med mig har sagt att de två bästa sakerna med [vad har du hjälpt dem med? EXEMPEL: strategin har varit]

🧶 [exempel på vad klienter har gillat med din tjänst/produkt/hjälp. EXEMPEL: Den röda tråden som blivit så tydlig, nu råder ingen tvekan om vad de ska fokusera på och hur, på sin Instagram.]

📝 [exempel på vad klienter har gillat med din tjänst/produkt/hjälp. EXEMPEL: Alla konkreta tips på innehåll som direkt och på ett tydligt sätt kopplas till den röda tråden. Det har hjälpt dem att tänka vidare själv 💭]

‌

Tack vare [infoga något som hjälpt dina kunder/klienter. EXEMPEL: guiden för deras nästa steg råder ingen tvekan om hur de jobbar vidare med strategin på egen hand]

Är det dags att [det du hjälper dina klienter/kunder med. EXEMPEL: få ditt konto att växa? Att konvertera dina följare till kunder?] [INFOGA CTA. EXEMPEL: Skicka ett DM så kollar vi om [tjänsten: Instagramstrategin är något för dig]`,
        `BREAKING NEWS!

(Har jag fått din uppmärksamhet? Du kommer att vara glad att du slutade scrolla, lita på mig.)

Jag är SÅ exalterad över att meddela att [infoga specialerbjudande. EXEMPEL: rea/rabattkod/ny tjänst/ladda ner eller ett brådskande tillkännagivande som t.ex 1 sista plats] är tillgängligt [tidsram. EXEMPEL: nu/nästa vecka/imorgon]!

Om du vill veta mer, då [vart vill du att de ska gå? EXEMPEL: klicka på länken i bio/besök min webbplats/skicka ett DM för att veta mer!]`,
        `Varför får denna recension mig att dansa av glädje i mitt vardagsrum (mer än vanligt, om det ens är möjligt 😂)?

Eftersom [bryt ner referensen ytterligare. Nämner den något som överensstämmer med din vision? Mission? Ett specifikt resultat? Om det finns något särskilt i referensen, framhäv detta och skapa en bildtext om varför det är så viktigt för dig.]

‌

PS. Vill du uppleva resultat som dessa själv? [infoga CTA här för att boka eller köpa från dig]`,
        `Hur många av dessa punkter finns på din 'måste ha'-lista när det kommer till [din nisch eller bransch. EXEMPEL: att arbeta med en affärscoach, din hudvårdsrutin, mat till dina husdjur?]

[Något som är viktigt för din dörmkund och som ditt företag OCKSÅ har/gör. EXEMPEL: Maten du erbjuder dina pälsfamiljemedlemmar måste vara helt naturliga ingredienser och får inte innehålla några skadliga ämnen]

[Något som är viktigt för din drömkund och som ditt företag OCKSÅ har/gör. EXEMPEL: Du vill göra deras mat istället för att köpa den, men du vill INTE stå i köket i timmar?]

[Något som är viktigt för din drömkund och som ditt företag OCKSÅ har/gör.]

Om du bockade av något (eller alla) av punkterna, kan jag glatt meddela att du är på helt rätt plats! För detta är precis vad [vi, tjänst/produkt/vårt företag/erbjudandets namn/vår digitala lösning som 'våra receptböcker'] handlar om.

[Utveckla din tjänst/produkt och prata om hur ditt erbjudande möter din drömkunds behov ovan. Exempel: På Pets-R-Us tror vi att varje hund förtjänar den bästa maten för de bästa hundarna, att ägare inte borde betala mer än nödvändigt för att älska och ta hand om sitt husdjur, och det är därför vi skapade vår receptbok som har XYZ].

Vill du kolla in [erbjudandet/utbudet/produkten] som kryssar i alla boxar och mer? [CTA - shoppa nu, gå till länken i bio, skicka ett DM!].`,
        `Om du är redo att [infoga din drömkunds ultimata önskan], då har du kommit rätt!! [infoga tjänst eller produkt eller kursnamn] har skapats bara för dig.

[Funktionerna] innebär att [fördel för drömkunden]

Genom [funktioner] kommer du att [fördel för drömkunden]

[Funktioner] hjälper dig att [fördel för drömkundne]

Och [funktioner] [fördel för drömkunden]

Om du sitter där och nickar med huvudet och tänker "ja, det här är precis vad jag behöver för att äntligen [sak din drömkund vill uppnå eller pain point de vill säga hejdå till]", då [CTA. EXEMPEL boka ditt gratis utforskasamtal genom länken i min bio.].

[VALFRI CTA] Och PS - det finns bara ett begränsat antal platser varje månad, så missa inte det!`,
        `[Infoga recension]

Det här är varför [vi/jag] gör det vi/jag gör. För att hjälpa människor att [infoga hur du hjälper människor att uppnå något de strävar efter eller ta bort en pain point]. Och ord som dessa får alltid [mitt/vårt] hjärta att svämma över eftersom vi vet att [vi/jag] är exakt där [vi/jag] behöver vara.

Om du letar efter [infoga sak din drömkund vill uppnå, känna eller uppleva], då [infoga erbjudande här. EXEMPEL låt oss prata om hur ett snabbt ansiktsbehandlingspaket kan hjälpa dig att återfå ditt självförtroende som det gjorde för kunden i recensionen. Boka idag på XYZ].`,
        `Om du funderar på det, är det här din vänliga påminnelse om att det nu bara finns [nummer, EXEMPEL: tre] av [platser/produktens namn/dagar] kvar [tidsram, EXEMPEL: den här månaden, någonsin!].

This is not a drill. Om du vill säkra en av de sista återstående [typer av erbjudanden, t.ex. bokningar, specialpaket, varor, flaskor, kursplatser innan vi börjar], [CTA, EXEMPEL: gå till bokningsformuläret nu via länken i min bio].`,
        `Älskar du ett bra erbjudande? Ja, det gör jag med. 😍

Därför är jag så exalterad över att erbjuda [tidsram, EXEMPEL: veckans/månadens/dagens] specialdeal [infoga ditt specialerbjudande.]

(KOM IHÅG: Det behöver inte vara en rabatt eller rea utan kan vara något extra till en tjänst eller produkt, eller ett specialpaket eller begränsat erbjudande. Tänk utanför ramarna och erbjuda något lockande).

[Skynda dig dock! Precis som de säger behöver alla bra saker ha ett slut, och detta är endast tillgängligt [infoga tidsram: för de första 10 personerna. Till och med fredag. I bara 7 dagar.]`,
        `PSST: [det personen ville uppnå. EXEMPEL: att uppdatera din Wordpress-webbplats varje gång det finns en uppdatering för att hålla den igång] blev just enklare. SÅ mycket enklare.

Inga fler [pain point. EXEMPEL: dagar fyllda med stress och oro för att din webbplats inte kommer att konvertera eftersom den där pluginen inte är uppdaterad]

Inga fler [pain point. EXEMPEL: dagar spenderandes med att ligga i sängen och känna ditt hjärta hoppa över ett slag eftersom du inte kan komma ihåg när du sist kontrollerade att sidhastigheten laddas bra]

Och MASSOR MER [önskan eller strävan. EXEMPEL: tid att fokusera på dina expertområden i ditt företag medan underhållet av din webbplats tas om hand åt dig].

Hur?

[infoga ditt tjänsterbjudande eller produkterbjudande. EXEMPEL: Genom vårt nya Wordpress Webmaster-prenumeration!].

[Förklara tjänsteerbjudandet/produkterbjudandet och uppmana människor att köpa nu eller boka nu].`,
        `Tänk dig hur fantastiskt det skulle kännas att [resultatet av din freebie eller tjänst. EXEMPEL: ha en färdig plan för hur du bäst förbereder måltider för veckan framöver - GRATIS! ELLER få 10% rabatt på din nästa beställning PLUS hamna på VIP-listan för nya lanseringar!]

Om detta låter som något för dig, behöver du inte leta mer för jag kan göra detta till din verklighet!

Besök [länken i min bio ELLER infoga länk för IG/FB] och [vad vill du att de ska göra? Gå med i mailinglistan idag för att få 10% rabatt direkt till din inkorg! Ladda ner min 10-sidiga freebie om hur du gör måltidsförberedelse till en den lättaste uppgiften på veckan].`,
        `[Infoga pain point som ett citat här. EXEMPEL: "Jag ska inte gå ikväll. Jag har inget att ha på mig!!"]

Är detta något du har sagt till dig själv tidigare??

Om du känner igen dig är jag här för att hjälpa dig att se till att du kan radera den meningen helt från ditt vokabulär och aldrig tänka, säga eller känna det igen!

[Gör ett direkt erbjudande till din tjänst eller produkt. EXEMPEL: Min helt nya lösning 'Arbeta med din garderob' är en kurs och PDF som kommer att hjälpa dig att lära dig att göra det mesta av det du har i din garderob JUST NU för att skapa drömoutfits.

Det kommer att hjälpa dig [fortsätt med fördelar och resultat]

[CTA. EXEMPEL: gå till länken i min bio för att skaffa detta idag och säg adjö till att 'inte ha något att ha på sig' för alltid.]`,
        `Det känns som att alla i [. EXEMPEL: marknadsföringsvärlden] pratar om [ämne. EXEMPEL: lead magnets] och om du inte vet vad det är - då har du kommit rätt! Det här inlägget är till DIG!

[Utveckla ämnet, ge din åsikt. EXEMPEL: Lead magnets är XYZ och anledningen till varför så många älskar det är XYZ. Det kommer att hjälpa dig att XYZ och XYZ så att du aldrig behöver oroa dig för XYZ. OCH grädden på moset är XYZ]

[Om du har ett sätt att direkt koppla detta till ditt erbjudande, nämn det här. EXEMPEL. Och allt detta ovan? Det är precis därför jag håller en gratis webbinar om lead magnets den här veckan och du är inbjuden. Gå till länken i min bio för att säkra din plats!]

Har du några frågor om [saken. EXEMPEL: lead magnets du gärna vill ha täckt i webbinaret också?] LÄMNA DEM NEDAN!`,
        `Vill du veta varför [ämne/lösning/erbjudande. EXEMPEL: Creative Content Club] [infoga resultat. EXEMPEL: kan göra en verklig skillnad för ditt företag]?

Det är inte bara för att [förklara ett värde ämnet/lösningen/erbjudandet ger. EXEMPEL: det hjälper dig att spara tid på dina sociala medier och få bra resultat.]

Eller bara för att [förklara ett värde ämnet/lösningen/erbjudandet ger. EXEMPEL: det finns en hel rad färdiga trainings för att höja hela ditt företags marknadsföring.]

Visst är dessa saker viktiga och värdefulla, men?.. Det är också på grund av detta:

[infoga något djupgående/inspirerande. Exempel: Den största fördelen är den verkliga bördan som lyfts från dina axlar, som kommer med att ha den här typen av support för ditt företag - se det som en liten biz side kick som du kan bolla idéer med. Söka råd från.]

[utveckla om du önskar. EXEMPEL: Så här är det, det är så ofta man som solprenör behöver hjälp med idéer - som vi inte bara kan "Googla" oss till - support. Och utan det? XYZ]

[CTA. Exempel. Och om du vill ha den här typen av support i ditt liv? Var redo, för snart kommer dörrarna att öppnas för Creative Content Club! Så om du vill ha riktigt stöd i ditt företag - samt XYZ - anmäl dig till VIP-listan nu!].`,
        `Det finns inget bättre än att få kärleksfulla meddelanden från nöjda kunder/klienter (förutom kanske [infoga autentiskt element för dig. EXEMPEL: kaffe, choklad, vin, valpar] som kommer nära, men jag är bara människa, eller hur?)

Så när jag öppnade detta kärleksbrev? Det är safe to say att jag fick en liten känslostorm hehe. Om du vill ha resultat som detta, då [infoga CTA. EXEMPEL: gå till länken i min bio och kolla in XYZ-sortimentet, boka ett samtal, shoppa i butiken]`,
        `Det är ingen hemlighet att varje [drömkund. Exempel: Kvinnor som lever i värmen i Australien] behöver lite [ämne. EXEMPEL: lätta loungewearkläder i sitt liv som passar i värmen]

...Det är precis därför [din produkt/tjänst/erbjudande. EXEMPEL: mina loungewearkläder i ljust linne] existerar.

[Diskutera fördelarna med din produkt/tjänst här. Använd produkt-/tjänstbeskrivningarna om det behövs för att lägga till en övertygande text om ditt erbjudande. Exempel: Detta loungewearset får dig att känna dig sval och lugn även när XYZ.]

Redo för lite av denna magi i ditt liv? [CTA. Exempel: gå till länken i min bio och XYZ].`,
        `Påminnelse: Det är okej att [infoga drömkunds painpoint. EXEMPEL: känna sig överväldigad, stressad och faktiskt lite vilse.]

[Uppmärksamma painpoint. EXEMPEL: Dessa är alla giltiga känslor, och vi har alla varit där någon gång.]

Och om du känner så här just nu? I just denna stund? Eller inte vill känna så här i framtiden? Då har jag något som kan bistå med en hjälpande hand.

[infoga freebie/tjänst/produkt och vad den gör. EXEMPEL: Vi har nyligen lanserat en e-bok som hjälper dig att arbeta igenom dessa känslor på ett hälsosamt sätt som lämnar dig klarsynt och med en undran om var detta har varit hela ditt liv.]

Allt du behöver göra är [vad vill du att de ska göra? Gå till länken i bio, anmäl dig till epostlistan för att få den gratis, skicka mig ett DM, etc] och jag kommer vara redo att hjälpa dig på nolltid!`,
        `BRB, ska bara gå iväg och gråta (av glädjetårar) över denna UNDERBARA [kund] feedback en snabbis.

Jag är så tacksam för var och en av er som låter mig göra det jag gör varje dag och utforska min passion för [din företagsnisch här. EXEMPEL: att skapa blomstermagi som perfekt kompletterar och förhöjer era evenemang.]

Jag lever för feedback som denna... det gör mig så lycklig att veta att jag har [vad ditt företag gör. EXEMPEL: bidragit till någons stora dag på ett så meningsfullt sätt.] Så mycket att de ville ta några minuter av sin dag för att berätta för mig hur mycket de älskade det.

PS - vill du uppleva samma resultat som [namn eller denna fantastiska klient?]. Boka [tjänstens namn] genom länken i min bio! Bara [infoga urgency/brådska här. EXEMPEL: två platser kvar för mars, så skynda dig!] Och min DM är alltid öppen om du undrar hur detta skulle kunna fungera för dig!`,
        `REAL TALK: Har du funderat på eller spanat in [erbjudande. EXEMPEL: en VIP-dag för att snabbt ta fram en strategi för dina sociala medier?]...

Men kanske har du hållit tillbaka eftersom [infoga drömkundens invändning: du har känt dig lurad av liknande tjänster tidigare, tjänster som lovar världen men som inte levererar.]

Jag förstår det, och jag vill att du ska veta att det är EXAKT den anledningen till att jag har en [infoga garantipolicy här. EXEMPEL: 100% nöjd kund-garanti]!

Japp, du läste rätt! Jag GARANTERAR att [utveckla vad policyn garanterar. EXEMPEL: om du implementerar strategierna från vår session och av någon konstig anledning inte ser resultat? Jag återbetalar jag dig]!

Allt för att du ska kunna investera utan oro, risk eller bekymmer.

Så om det har varit det som har stoppat dig, och eftersom det inte är det längre, [CTA. EXEMPEL: låt oss idag prata om hur jag kan hjälpa dig att [det resultat du erbjuder]. Skicka ett DM eller gå till webbplatsen för att fylla i ansökningsformuläret för att kolla om vi är en perfect match!]`,
        `Vill du veta vad du kommer att få ut av [tjänst/erbjudande. EXEMPEL: mitt annonseringspaket för ditt företag]?

Förutom [uppenbar inkluderande del i tjänsten. EXEMPEL: det faktum att jag kommer att köra dina annonser för ditt företag som ett proffs, med garanterad avkastning] så klart? 👏

Du kommer dessutom [Infoga transformation/annat resultat. EXEMPEL: aldrig behöva oroa dig för hur du ska hitta tid att göra allt, eller tid i din dag för att se till att din försäljning rör sig framåt. För det är det jag finns här för!]

[Förklara vidare om det behövs.]

Jag vet inte med dig, men jag tycker att detta är en ganska fantastisk möjlighet att minska stressen i ditt företagande!

Och om det är en möjlighet som du skulle vilja lägga till i ditt liv - [CTA: låt oss connecta och prata om hur jag kan hjälpa dig att synas och sälja mer - medan du fortsätter med din dag. Gå till länken i min bio och boka ditt gratis samtal nu. Platserna i april är begränsade.]`,
        `Redo att bli imponerad!? Spännande announcement på gång!

Känner du dig alltid [relevant för din drömkund. EXEMPEL: överväldigad av att försöka få ditt innehåll att sticka ut bland allt brus]?

Lägger du konstant [relevant för din drömkund. EXEMPEL: 2 timmar eller mer bara på eeeett inlägg]?

Är du trött på [relevant för din drömkund]?

De här känslorna? De är EXAKT varför jag har skapat [infoga tjänst eller produkt här som löser drömkundens känslor. EXEMPEL: ett HELT NYTT sociala medie-planeringspaket gjort specifikt för XYZ att XYZ].

Vad gör [tjänsten] annorlunda jämfört med andra på marknaden?

[infoga ditt unika försäljningsargument [USP] för produkt, tjänst. EXEMPEL: Det här paketet inkluderar XYZ så du kan vara säker på att det kommer att ge dig seriösa resultat... inom din budget!]

[infoga din USP för produkt, tjänst.]

[infoga din USP för produkt, tjänst.]

Kolla in den här sprillans nya [tjänsten] nu [CTA. EXEMPEL: genom länken i min bio].

[Valfri CTA]

En snabb påminnelse att detta inte kommer att pågå länge eftersom det bara finns [#] platser tillgängliga!!`,
        `NOTE: Inlägg med recension i grafik eller inled med recension i bildtexten

_____________

Hallååå, jag är helt fylld av glädje över denna otroliga recension jag fick [infoga tid/ämne. EXEMPEL: direkt efter XYZ-webinaret, igår, om XYZ-tjänsten].

Denna feedback är EXAKT varför [jag gör det jag gör, jag skapade denna tjänst].

Och om du vill veta om [XYZ-tjänsten] är för dig? [Besök min FAQ-sida, skicka mig ett meddelande, läs några fler recensioner här].`,
        `OBS! Inlägg med 2 x olika slides. Lägg till ett påstående om en transformation på varje. EXEMPEL:

"Jag stressar inte längre över mitt innehåll" "Mitt företag blir sett, älskat och säljer".

---

1 eller 2? ➡️ Vilket av dessa påståenden skulle DU föredra att vara?

Nåväl, HÄR ÄR GREJEN! Du behöver inte välja. Eftersom min [tjänst/produkt] hjälper dig att uppnå båda.

[Utveckla om tjänsteerbjudandet och transformationen].

[Valfri CTA]

En liten hemlighet från mig till dig - du kan få [sätt in något som lockar. EXEMPEL: 20% rabatt just nu eller vår sista tillgängliga tid i november om du bokar idag!] Gå inte, SPRIIIING till [sätt in hur de kontaktar - min hemsida, min DM] för att få reda på mer!`,
        `FÖRSLAG. Använd detta som ett karusellinlägg med bilder för att visa olika delar av din tjänst.

---

Endast [X] dagar kvar av året... Wow, hur är det ens möjligt? 😱

Med så lite tid kvar är det dags att fråga dig själv: Vill du att detta år ska vara det året då [ämne här. EXEMPEL: du ökar din försäljning på Facebook, du lämnar stress och negativitet bakom dig]?

ELLER markerar du 2024 som ett annat år fyllt av kunde, borde, skulle? Den sista där kommer inte att hända under min vakande ögon, förresten 👀

Om du vill ha [förändring här EXEMPEL: den sinnesförändring du har drömt om som kommer att göra dig redo att uppnå XYZ 2025], är det dags att sluta tveka och sätta [ditt företag/dig själv/dig/dina klienter] först genom att [vad du gör här. EXEMPEL: outsourca dina sociala mediekampanjer till mig, boka mig för mental coachning, anmäla dig till mitt 10 veckors bootcamp, etc].

Swipa här ovan för att se exakt hur jag kan hjälpa dig att nå de magiska målen du har satt och sedan din allra nästa steg! 👉

Besök [webbplatsen/länken i bio] för att [boka din plats/registrera dig/köpa]! [Endast X platser kvar, XYZ tar slut snabbt, bara X dagar tills detta erbjudande avslutas!].`,
        `Vill du att [infoga ämne eller painpoint. EXEMPEL: din stress över att hålla koll på bokföringen samtidigt som du, du vet, driver en HEL företagsverksamhet och försöker ha ett liv också] ska bli något som hör till det förflutna? *_vinkar adjö_*

Om så är fallet är det här bokstavligen SKAPAT FÖR DIG.

[Infoga tjänstens namn] är specifikt för [infoga drömkunder. EXEMPEL upptagna företagsägare] som vill [strävan/önskan. EXEMPEL veta att deras bokföring görs korrekt och i tid, utan att förlora timmar - och hår - genom att försöka göra det själva].

För jag vet hur det är att [infoga drömkundens problem som produkten/tjänsten löser. EXEMPEL: tillbringa timmar och timmar med att försöka spåra kvitton, matcha betalningar, hålla allt i linje för redovisningar till Skatteverket, när den tiden kunde ha spenderats bättre någon annanstans i ditt lilla företag].

Så jag skapade en lösning som [infoga detaljer. EXEMPEL: låter mig sköta din bokföring åt dig digitalt när du behöver hjälp, istället för återkommande varje vecka. Jag vet att inte alla småföretagsägare behöver hjälp med bokföringen på heltid ännu, och jag arbetar efter DINA behov, inte en färdig lösning som INTE skräddarsys.]

Vill du prata mer om att säga adjö till dina [ämne. EXEMPEL: bokförings-] bekymmer och hur detta skulle kunna fungera för dig? Då [CTA. Exempel: gå till länken i min bio och XYZ, DM:a mig idag för att prata mer. DM:a mig för en prisguide och mer information].`,
        `NOTE. Para detta med ett _snabbt_ erbjudande som är tids- eller antalsbegränsat. Lägg till detaljerna i ett karusellinlägg.
____________________________

Du vill inte missa detta!

Detta är ett av de mest speciella [speciella erbjudanden] jag har skapat hittills! Så varför ville jag göra detta och varför i hela friden erbjuder jag detta endast för [infoga detaljer. EXEMPEL: månaden december, de första 3 personerna]?

[Infoga anledning till att skapa ett unikt erbjudande. EXEMPEL: Eftersom jag vet hur fantastiskt det kan kännas att starta det nya året med ett PANG och detta erbjudande kommer att hjälpa dig med XYZ]

Om detta låter som något [du vill/ du behöver i ditt liv/ för bra för att missa], gå till [CTA]`,
        `Den senaste [infoga produkt/tjänst/erbjudandetyp. EXEMPEL Canva-mallarna i min webbshop] är verkligen en av [våra/mina] favoritlösningar från [varumärkesnamn] NÅGONSIN. Och detta är varför [vi/jag/kunderna] älskar det:

[Funktionerna] betyder att [fördel för målgruppen]

Genom [funktionerna] kommer du att [fördel för målgruppen]

[Funktionerna] hjälper dig att [fördel för målgruppen]

Och [funktionerna] [fördel för målgruppen]

‌

Kolla in [produktens namn] nu [CTA. EXEMPEL genom länken i min bio.].

[FRIVILLIG CTA] Och PS - Det finns en stor chans att detta kommer sälja slut snabbt, så var snabb om du vill vara säker på att [fördel för målgruppen]!`,
        `Alla säg det med mig nu... "Jag kommer inte att [drömkunds vanliga misstag som din produkt/tjänst löser. EXEMPEL: kämpa med mitt content idag!"]

Du kanske undrar exakt hur du lyckas med det?

Enkelt.

Genom att [infoga åtgärd. EXEMPEL: ladda ner mitt] [produkt/tjänst/freebie här. EXEMPEL: sprillans nya freebie] som [löser vanligt misstag/problem här. EXEMPEL: beskriver den exakta strategin jag använder om och om igen för att komma på tiotals sociala medieidéer som KONVERTERAR - på mindre än 1 timme!]

Redo att ta ditt [ämne här. EXEMPEL: contentskapande] till nästa nivå? Gå då till länken i min bio för att [vad vill du att de ska göra? Anmäla sig för förhandsbeställning, ladda ner e-bok, anmäla sig till epostlistan för specialerbjudanden, osv.].`,
        `[Infoga det din drömkund tänker. EXEMPEL "Varje gång jag har försökt XYZ tidigare har jag misslyckats. Hur skiljer du dig åt från andra på marknaden?"]

Jag förstår den funderingar. Jag hör det hela tiden.

Och idag kommer jag inte gå in på varför ANDRAS [program, tjänster, erbjudanden] kanske inte har gett dig det resultat du vill ha - det är inte det jag gör.

Men vad jag faktiskt gör? Är att låta dig veta varför [resultat: EXEMPEL: mitt program/tjänst/erbjudande fungerar].

[Infoga anledning till att ditt program eller erbjudande hjälper människor att uppnå framgång]
[Infoga anledning till att ditt program eller erbjudande hjälper människor att uppnå framgång]
[Infoga anledning till att ditt program eller erbjudande hjälper människor att uppnå framgång]

Det är en del av den hemliga formeln som hjälper så många att uppnå [infoga det ultimata resultatet din drömkund är ute efter]. Och jag är så stolt över det!

Om du vill prata mer om hur jag kan hjälpa dig - på ett annat sätt än vad du kanske har upplevt tidigare - [CTA här om hur man kontaktar dig].`,
        `DRÖM-[insert product/service/freebie name. EXAMPLE: CANVAMALLAR] incommmming!!

✅ [infoga funktion/fördel av produkten/tjänsten. EXEMPEL: ljusa färger för de fantastiska skönhetsföretagen, så att du kan sticka ut i flödet och visa upp din strålande personlighet!]
✅ [infoga funktion/fördel med produkten/tjänsten]
✅ [iinfoga funktion/fördel med produkten/tjänsten]
✅ [infoga funktion/fördel med produkten/tjänsten]

[Infoga vittnesmål eller kort klientberättelse om hur produkten/tjänsten gjorde deras liv bättre]

Vill du med i hypen? Skaffa dina canva-mallar idag! Gå till [infoga CTA. EXEMPEL: länken i bio, vår webbplats, vår blogg]`,
        `Ehmmmmm, jag vill inte stressa dig, men du vill VERKLIGEN inte missa detta!

Om [XYZ dagar/veckor/månader] lanserar jag min sprillans nya [tjänstens namn]!

Så, vad är [XYZ-tjänsten] och hur kommer den att hjälpa dig?

[XYZ-tjänsten] kommer bokstavligen [infoga förvandling som kommer av tjänsten eller ditt löfte om tjänsten].

Inget mer [infoga saker som tjänsten tar bort från drömkundens liv. EXEMPEL: känna att du är XYZ. Kämpa för att uppnå XYZ. Eller misslyckas när du försöker XYZ].

Bara [infoga vad tjänsten kommer att leverera till drömkunden. EXEMPEL: Hantera din XYZ, skapa ringar på vattnet när det gäller XYZ och meningsfulla resultat för din XYZ.]

Ställ en påminnelse, för [infoga brådska/brist: platserna fylls snabbt]!

Och om du vill ha första tjing, se till att du är [var borde de vara? CTA för din e-postlista, Facebook-grupp, VIP-lista etc.]`,
        `En hand upp om du någonsin har haft [infoga något din drömkund skulle ha haft/gjort tidigare som din tjänst gör lättare/löser. EXEMPEL: din sminkning klar, bara för att känna att det inte var 'du']?

Eller vad sägs om när [infoga något din drömkund skulle ha haft/gjort tidigare som din tjänst gör lättare/löser. EXEMPEL: du har den perfekta bilden i huvudet för din look på det där evenemanget, men du kan helt enkelt inte hitta rätt bild online för att visa vad du tänker. För att visa vad du VERKLIGEN vill ha]?

Då kanske det gör dig glad att veta att [infoga rolig fakta om din tjänst som löser ovanstående problem. EXEMPEL: innan varje sminksession kan du förvänta dig att vi skapar en mood board för din look. Vibes, färger, människor med din ansiktsform som arbetar med de tekniker vi planerar att använda. Allt för att du ska se ut och känna dig som ditt allra bästa själv!].

Du behöver inte ta mitt ord för det, här är vad en [kund/klient/gäst] har att säga: [infoga recension/kundfeedback för att påvisa dina fakta.]

Vill du se om vi är en match? [infoga CTA: Gå till länken i bio, besök vår webbplats, skicka mig ett DM]`,
        `Åh - det kommer alltid så mycket kärlek för [tjänstens/produktens namn].

Kärlek för [funktion/fördel. EXEMPEL: de ljusa, glada mönster som utgör grunden för mallarna i paketet].

Kärlek för [funktion/fördel]

Och kärlek för [funktion/fördel]

Vill du vara nästa person att förälska sig? [Infoga CTA]`,
        `DET NÄRMAR SIG!

[Infoga en punkt med brådska för din målgrupp. Exempel: min XYZ är nästan fullbokad! ELLER Min försäljning är nästan här och det släpps för min e-postlista allra först! Om du inte är med på listan kommer du att missa det!]

[Infoga CTA]`,
        `Jag vet inte vem som behöver höra detta, men [infoga CTA. EXEMPEL: du förtjänar verkligen att boka in dig för den där kostnadsfria konsultationssamtalet. Och om du tror att du inte har tid? Det har du. Eftersom den här sessionen kan SPARA tid på lång sikt. Timmar faktiskt!].

[Infoga CTA]`,
        `[Unik fördel eller fördel. EXEMPEL: Fantastiska resultat, ökad vinst och en hel del skoj.]

Den perfekta kombinationen!

Det är [koppla tillbaka till ditt erbjudande. EXEMPEL: de tre orden som först kommer upp i tankarna för de som anmäler sig till mitt XYZ-program/tjänst/produkt.].

Och det finns en hel hög med fantastiska saker utöver det också. Vill du veta mer? [Infoga CTA]`,
        `Tänk om du ääääääääntligen hade en lösning för [painpoint/utmaning för din drömkund]?

Den sortens lösning som får dig att dansa en glädjedans och fira, eftersom du inte längre behöver [infoga utmaning. EXEMPEL: fundera på vad du ska laga till middag, eller komma på något för den eviga fruktade frågan "mamma, vad blir det för middag ikväll?"].

Om du är redo att förvandla ditt "tänk om" till din fantastiska verkliget, då har jag något för dig.

Din nya favoritlösning: [Infoga lösningens namn. EXEMPEL: Den upptagna familjens kokbok!]

[Förklara erbjudandet. EXEMPEL: Denna nedladdningsbara lösning har skapats för att hjälpa dig och din familj att snabbt och enkelt välja 7 hälsosamma måltider varje vecka. Det gör du enkelt genom att "bläddra" igenom receptboken och slumpmässigt välja 7 måltider som görs på under 30 minuter. De har dessutom handlingslistor med dem för att göra shoppingen enkel].

Tänk [fördel. EXEMPEL: inte ens behöva TÄNKA på middagsalternativ. Tänk [fördel: EXEMPEL: inte längre stressa med att XYZ]

Och [fördel]

Om du vill ha denna fantastiska lösning i din värld, [CTA. EXEMPEL: Skicka mig ett DM med orden DRÖMMIDDAGAR! Så skickar jag en länk i DM!]`,
        `Jag får ofta frågan [en vanlig fråga. EXEMPEL: hur får jag ditt content att låta som du när jag inte är du].

Och så här är det. [Prata om dina processer/metoder/system].

Är du redo att [det drömkunden längtar efter eller problem din tjänst löser. EXEMPEL: få hjälp att skriva content som känns som DU? Kontakta mig, för jag skulle älska att få hjälpa en fellow soloprenörska!]

[CTA. EXEMPEL: Kommentera eller skicka ett DM med [emoji] så skickar jag mer info om tjänsten/produkten].`,
        `Idag ska jag dela med mig av en liten hemlighet….

‌

Jag får ibland frågan om det finns en särskild produkt/tjänst som ligger mig extra varmt om hjärtat, och ja det finns en jag gillar extra mycket för just [painpoint som din drömkund har], och det är……

…

…

…

[Tjänst/produkt]

Jag vet, jag vet, jag får inte ha favoriter men den här har en alldeles särskild plats i mitt hjärta. Och det av en särskild anledning.

[Prata om varför du gillar den tjänsten/produkten lite extra. Koppla till drömkundens painpoints eller problem som den löser för din drömkund]

[Om du vill kan du inkludera en punktlista med varför din tjänst/produkt är så bra kan du göra det också!]

Nu slår jag återigen upp dörrarna och ger dig möjligheten att uppleva magin inne i [tjänst/produkt]-värmen! Om du är redo att [förändring din drömkund kommer göra], kika på länken i min bio för att säkra din plats!`,
        `NOTERA: Det här inlägget är bäst att använda när du har en stor satsning på en produkt som du försöker göra slut på/öka försäljningen av eller en tjänst du försöker öka försäljningen av för att framhäva den och ge den lite mer uppmärksamhet. Det förringar inte de andra erbjudandena du har eftersom du tydligt förklarar att du älskar detta för en specifik painpoint/situation.

---

Nu vet jag att jag inte får ha favoriter MEEEEN om du frågade mig om det fanns en [lösningar/produkter] som verkligen var högt upp på min lista för människor som vill [saker de söker/painpoint de har. EXEMPEL: känna sig säkra över sitt innehållsskapande], skulle jag kanske eventuellt berätta för dig att det var [infoga favorit]

Men det är inte för inget! Denna [tjänst/produkt] rankas så högt på min lista för [upprepa painpoint EXEMPEL: säkerhet över sitt innehållsskapande] tack vare[skäl. EXEMPEL: de resultat den ger för klienter som vill uppnå XYA, hur mångsidig den är för att passa varje bransch. Den är inte bara en hjälpsam mikrolösning, utan en helt otrolig lösning för att göra dig till ett proffs på ditt innehållsskapande].

[Utveckla mer här. EXEMPEL: Dessutom, medan AAAALLLLA mina produkter är skapade för att uppnå fantastiska resultat, är denna nära mitt hjärta eftersom den OCKSÅ är bland de första tjänsterna jag tog fram, och den finns fortfarande kvar. The OG. Den har genererat i X antal nöjda kunder och fortsätter göra det regelbundet]

[Infoga en CTA. EXEMPEL: Dörrarna till detta program är öppna JUST NU i några dagar till och om du också vill behärska ditt contentskapande så att du kan tjäna pengar på Instagram, med mig som din lärare, gå till länken i min bio NU för att säkra din plats!].`,
        `NOTE: Det här är grymt som en karusellpost om du har längre recensioner du vill dela. Ha en CTA på sista sidan om att läsaren kan boka/köpa/investera/höra av sig om den också vill ha såna resultat som i recensionen.

---

Har du någonsin undrat [FAQ om din produkt eller tjänst. EXEMPEL: hur Creative Content Club hjälper så många olika tjänstebaserade företag att bli sedda, älskade och sälja från en enda uppsättning mallar?]

Idag delar jag detaljerna om hur!

[Infoga information här för att svara på frågan. EXEMPEL: Creative Content Club hjälper så många småföretagare eftersom den är baserad på en universell strategi som alla tjänsteleverantör kan använda sig utav! Detta inkluderar ... ].

Och det är därför så många människor också har så många fantastiska ord att säga om det! Swipa genom karusellen för att se några vittnesmål från fantastiska [medlemmar/kunder/klienter]!

Har du några frågor om [ämne. EXEMPEL: Creative Content Club]? I så fall, DM:a mig eller ställ dem nedan i kommentarerna! Jag skulle älska att hjälpa dig framåt!`,
        `Ska du [göra något som människor överväger inom din nisch som är något mindre än det du erbjuder. EXEMPEL: få din contentkalender gjord av Chat GPT] ELLER [infoga lösningen som du erbjuder. EXEMPEL: anställa en expert för att göra detta åt dig?].

Det är en fråga folk frågar mig hela tiden - och du ska veta att jag förstår de tankarna!

Jag förstår att [infoga eventuella invändningar folk kan ha eller varför de kanske väljer det andra alternativet. EXEMPEL: att använda en AI-robot gratis istället för att anlita någon att göra jobbet för en dyr peng kan kännas som en bra investering].

Men något jag alltid kommer be dig tänka på när du ska göra ditt val är detta:

När du [arbetar med/köper från din nisch. EXEMPEL: arbetar med en expert inom content], får du [infoga fördelarna eller distinkta skillnader i resultat, service etc. EXEMPEL: inte bara en 'allmän' contentkalender. Eller värre - en lista med content som inte alls är anpassat för din målgrupp. Det du faktiskt får när du jobbar med en expert? Är en contentkalender som stöds av psykologi och känslor ..].

Så även om det alltid finns alternativ tillgängliga, är det viktigt att du hittar rätt alternativ som faktiskt hjälper dig att nå dina mål.

Vill du prata mer om [infoga din nisch: EXEMPEL: att ha en framstående contentkalender med innehåll som talar direkt till din drömkund och får de att vilja investera i dig direkt? CTA här]`,
        `Hemligheten är ute. [Jag/vi] gör saker lite annorlunda här på [företagsnamn]. Men på det BÄSTA sättet!

Så här är det, när du arbetar med mig/oss eller köper från mig/oss kan du förvänta dig några saker

1 [Infoga exempel: Dina videosamtal med mig kommer inte bara att vara fylld av värme och kunskap, utan du kommer också troligen att träffa Evie, den fyrbenta kontorsassistenten.]

2 [Infoga exempel: Priset? Kommer att få dig att dubbelkolla om du läste rätt, för jag ser till att hålla din investering så låg som möjligt eftersom små företag inte har stora budgetar men FÖRTJÄNAR stor support.]

3 [Infoga exempel]

Och listan fortsätter...

Dessa saker - både små och stora - gör [företagsnamn] till vad det är, och de är saker som gör [oss/mig] jäkligt stolta! P

S vill du veta mer om [tjänsten eller produkten]? Besök länken i min bio!`,
        `Resultatet efter [tidsram, EXEMPEL: 3 dagar]!

Det här är vad mina kunder upplevt efter att de aktivt jobbat efter [det du erbjuder i ditt företag. EXEMPEL: den personliga Instagramstrategin jag tagit fram till dem]

‌

👉 [Kundresultat 1. EXEMPEL: En person fick två jobbförfrågningar (inte billiga!) med endast 9 bilder publicerade på sitt nystartade Instagramkonto]

👉 [Kundresultat 2]

👉 [Kundresultat 3]

👉 [Kundresultat 4]

Det här är bara några av resultaten mina kunder fått med [din tjänst. EXEMPEL: strategin]. Du kan också bli en av dem!

Den är [beskriv hur tjänsten/produkten är. EXEMPEL: mastig men kraftfull]. Jobbar du aktivt, lyssnar och följer mina råd, kommer du att få resultat - så är det bara 💃

[Infoga CTA. EXEMPEL: Kommentera ”🥳” eller skicka ett DM så skickar jag en länk där du kan läsa mer]`,
        `Mitt hemliga (inte längre) recept för [det som din freebie/tjänst/produkt handlar om. EXEMPEL: effektiv planering av din Instagram!]

Jag [vad gör du i freebien/tjänsten/produkten? EXEMPEL: tar med dig steg för steg i min process för att planera, skapa och schemalägga över 20 inlägg och stories, på bara en halv dag!]

[Infoga CTA. EXEMPEL: Kommentera ”ja tack” så skickar jag länken i DM 🥳]

[Addera extra CTA: Inte tid att spana in den nu direkt? Spara inlägget så du hittar tillbaka enkelt]`,
        `Mina [klienter/kunder] kommer till mig och [varför kommer de till dig? EXEMPEL: vet att något behöver fixas, och de är redo att göra jobbet som krävs].

‌

☝️ [sak drömkunden behöver göra/höra/veta. EXEMPEL: De vill veta exakt vad de kan göra bättre och hur, inga krusiduller eller linda in fint]

✌️ [sak drömkunden behöver göra/höra/veta: EXEMPEL: De är inte rädda för att ta hjälp]

🤟 [sak drömkunden behöver göra/höra/veta: EXEMPEL: De är redo att släppa på perfektionismen för att göra sina mål lättillgängliga]

‌

Alla som jobbat med mig har sagt att de två bästa sakerna med [vad har du hjälpt dem med? EXEMPEL: strategin har varit]

🧶 [exempel på vad klienter har gillat med din tjänst/produkt/hjälp. EXEMPEL: Den röda tråden som blivit så tydlig, nu råder ingen tvekan om vad de ska fokusera på och hur, på sin Instagram.]

📝 [exempel på vad klienter har gillat med din tjänst/produkt/hjälp. EXEMPEL: Alla konkreta tips på innehåll som direkt och på ett tydligt sätt kopplas till den röda tråden. Det har hjälpt dem att tänka vidare själv 💭]

‌

Tack vare [infoga något som hjälpt dina kunder/klienter. EXEMPEL: guiden för deras nästa steg råder ingen tvekan om hur de jobbar vidare med strategin på egen hand]

Är det dags att [det du hjälper dina klienter/kunder med. EXEMPEL: få ditt konto att växa? Att konvertera dina följare till kunder?] [INFOGA CTA. EXEMPEL: Skicka ett DM så kollar vi om [tjänsten: Instagramstrategin är något för dig]`,
        `BREAKING NEWS!

(Har jag fått din uppmärksamhet? Du kommer att vara glad att du slutade scrolla, lita på mig.)

Jag är SÅ exalterad över att meddela att [infoga specialerbjudande. EXEMPEL: rea/rabattkod/ny tjänst/ladda ner eller ett brådskande tillkännagivande som t.ex 1 sista plats] är tillgängligt [tidsram. EXEMPEL: nu/nästa vecka/imorgon]!

Om du vill veta mer, då [vart vill du att de ska gå? EXEMPEL: klicka på länken i bio/besök min webbplats/skicka ett DM för att veta mer!]`,
        `Varför får denna recension mig att dansa av glädje i mitt vardagsrum (mer än vanligt, om det ens är möjligt 😂)?

Eftersom [bryt ner referensen ytterligare. Nämner den något som överensstämmer med din vision? Mission? Ett specifikt resultat? Om det finns något särskilt i referensen, framhäv detta och skapa en bildtext om varför det är så viktigt för dig.]

‌

PS. Vill du uppleva resultat som dessa själv? [infoga CTA här för att boka eller köpa från dig]`,
        `Hur många av dessa punkter finns på din 'måste ha'-lista när det kommer till [din nisch eller bransch. EXEMPEL: att arbeta med en affärscoach, din hudvårdsrutin, mat till dina husdjur?]

[Något som är viktigt för din dörmkund och som ditt företag OCKSÅ har/gör. EXEMPEL: Maten du erbjuder dina pälsfamiljemedlemmar måste vara helt naturliga ingredienser och får inte innehålla några skadliga ämnen]

[Något som är viktigt för din drömkund och som ditt företag OCKSÅ har/gör. EXEMPEL: Du vill göra deras mat istället för att köpa den, men du vill INTE stå i köket i timmar?]

[Något som är viktigt för din drömkund och som ditt företag OCKSÅ har/gör.]

Om du bockade av något (eller alla) av punkterna, kan jag glatt meddela att du är på helt rätt plats! För detta är precis vad [vi, tjänst/produkt/vårt företag/erbjudandets namn/vår digitala lösning som 'våra receptböcker'] handlar om.

[Utveckla din tjänst/produkt och prata om hur ditt erbjudande möter din drömkunds behov ovan. Exempel: På Pets-R-Us tror vi att varje hund förtjänar den bästa maten för de bästa hundarna, att ägare inte borde betala mer än nödvändigt för att älska och ta hand om sitt husdjur, och det är därför vi skapade vår receptbok som har XYZ].

Vill du kolla in [erbjudandet/utbudet/produkten] som kryssar i alla boxar och mer? [CTA - shoppa nu, gå till länken i bio, skicka ett DM!].`,
        `Om du är redo att [infoga din drömkunds ultimata önskan], då har du kommit rätt!! [infoga tjänst eller produkt eller kursnamn] har skapats bara för dig.

[Funktionerna] innebär att [fördel för drömkunden]

Genom [funktioner] kommer du att [fördel för drömkunden]

[Funktioner] hjälper dig att [fördel för drömkundne]

Och [funktioner] [fördel för drömkunden]

Om du sitter där och nickar med huvudet och tänker "ja, det här är precis vad jag behöver för att äntligen [sak din drömkund vill uppnå eller pain point de vill säga hejdå till]", då [CTA. EXEMPEL boka ditt gratis utforskasamtal genom länken i min bio.].

[VALFRI CTA] Och PS - det finns bara ett begränsat antal platser varje månad, så missa inte det!`,
        `[Infoga recension]

Det här är varför [vi/jag] gör det vi/jag gör. För att hjälpa människor att [infoga hur du hjälper människor att uppnå något de strävar efter eller ta bort en pain point]. Och ord som dessa får alltid [mitt/vårt] hjärta att svämma över eftersom vi vet att [vi/jag] är exakt där [vi/jag] behöver vara.

Om du letar efter [infoga sak din drömkund vill uppnå, känna eller uppleva], då [infoga erbjudande här. EXEMPEL låt oss prata om hur ett snabbt ansiktsbehandlingspaket kan hjälpa dig att återfå ditt självförtroende som det gjorde för kunden i recensionen. Boka idag på XYZ].`,
        `Om du funderar på det, är det här din vänliga påminnelse om att det nu bara finns [nummer, EXEMPEL: tre] av [platser/produktens namn/dagar] kvar [tidsram, EXEMPEL: den här månaden, någonsin!].

This is not a drill. Om du vill säkra en av de sista återstående [typer av erbjudanden, t.ex. bokningar, specialpaket, varor, flaskor, kursplatser innan vi börjar], [CTA, EXEMPEL: gå till bokningsformuläret nu via länken i min bio].`,
        `Älskar du ett bra erbjudande? Ja, det gör jag med. 😍

Därför är jag så exalterad över att erbjuda [tidsram, EXEMPEL: veckans/månadens/dagens] specialdeal [infoga ditt specialerbjudande.]

(KOM IHÅG: Det behöver inte vara en rabatt eller rea utan kan vara något extra till en tjänst eller produkt, eller ett specialpaket eller begränsat erbjudande. Tänk utanför ramarna och erbjuda något lockande).

[Skynda dig dock! Precis som de säger behöver alla bra saker ha ett slut, och detta är endast tillgängligt [infoga tidsram: för de första 10 personerna. Till och med fredag. I bara 7 dagar.]`,
        `PSST: [det personen ville uppnå. EXEMPEL: att uppdatera din Wordpress-webbplats varje gång det finns en uppdatering för att hålla den igång] blev just enklare. SÅ mycket enklare.

Inga fler [pain point. EXEMPEL: dagar fyllda med stress och oro för att din webbplats inte kommer att konvertera eftersom den där pluginen inte är uppdaterad]

Inga fler [pain point. EXEMPEL: dagar spenderandes med att ligga i sängen och känna ditt hjärta hoppa över ett slag eftersom du inte kan komma ihåg när du sist kontrollerade att sidhastigheten laddas bra]

Och MASSOR MER [önskan eller strävan. EXEMPEL: tid att fokusera på dina expertområden i ditt företag medan underhållet av din webbplats tas om hand åt dig].

Hur?

[infoga ditt tjänsterbjudande eller produkterbjudande. EXEMPEL: Genom vårt nya Wordpress Webmaster-prenumeration!].

[Förklara tjänsteerbjudandet/produkterbjudandet och uppmana människor att köpa nu eller boka nu].`,
        `Tänk dig hur fantastiskt det skulle kännas att [resultatet av din freebie eller tjänst. EXEMPEL: ha en färdig plan för hur du bäst förbereder måltider för veckan framöver - GRATIS! ELLER få 10% rabatt på din nästa beställning PLUS hamna på VIP-listan för nya lanseringar!]

Om detta låter som något för dig, behöver du inte leta mer för jag kan göra detta till din verklighet!

Besök [länken i min bio ELLER infoga länk för IG/FB] och [vad vill du att de ska göra? Gå med i mailinglistan idag för att få 10% rabatt direkt till din inkorg! Ladda ner min 10-sidiga freebie om hur du gör måltidsförberedelse till en den lättaste uppgiften på veckan].`,
        `[Infoga pain point som ett citat här. EXEMPEL: "Jag ska inte gå ikväll. Jag har inget att ha på mig!!"]

Är detta något du har sagt till dig själv tidigare??

Om du känner igen dig är jag här för att hjälpa dig att se till att du kan radera den meningen helt från ditt vokabulär och aldrig tänka, säga eller känna det igen!

[Gör ett direkt erbjudande till din tjänst eller produkt. EXEMPEL: Min helt nya lösning 'Arbeta med din garderob' är en kurs och PDF som kommer att hjälpa dig att lära dig att göra det mesta av det du har i din garderob JUST NU för att skapa drömoutfits.

Det kommer att hjälpa dig [fortsätt med fördelar och resultat]

[CTA. EXEMPEL: gå till länken i min bio för att skaffa detta idag och säg adjö till att 'inte ha något att ha på sig' för alltid.]`,
        `Det känns som att alla i [. EXEMPEL: marknadsföringsvärlden] pratar om [ämne. EXEMPEL: lead magnets] och om du inte vet vad det är - då har du kommit rätt! Det här inlägget är till DIG!

[Utveckla ämnet, ge din åsikt. EXEMPEL: Lead magnets är XYZ och anledningen till varför så många älskar det är XYZ. Det kommer att hjälpa dig att XYZ och XYZ så att du aldrig behöver oroa dig för XYZ. OCH grädden på moset är XYZ]

[Om du har ett sätt att direkt koppla detta till ditt erbjudande, nämn det här. EXEMPEL. Och allt detta ovan? Det är precis därför jag håller en gratis webbinar om lead magnets den här veckan och du är inbjuden. Gå till länken i min bio för att säkra din plats!]

Har du några frågor om [saken. EXEMPEL: lead magnets du gärna vill ha täckt i webbinaret också?] LÄMNA DEM NEDAN!`,
        `Vill du veta varför [ämne/lösning/erbjudande. EXEMPEL: Creative Content Club] [infoga resultat. EXEMPEL: kan göra en verklig skillnad för ditt företag]?

Det är inte bara för att [förklara ett värde ämnet/lösningen/erbjudandet ger. EXEMPEL: det hjälper dig att spara tid på dina sociala medier och få bra resultat.]

Eller bara för att [förklara ett värde ämnet/lösningen/erbjudandet ger. EXEMPEL: det finns en hel rad färdiga trainings för att höja hela ditt företags marknadsföring.]

Visst är dessa saker viktiga och värdefulla, men?.. Det är också på grund av detta:

[infoga något djupgående/inspirerande. Exempel: Den största fördelen är den verkliga bördan som lyfts från dina axlar, som kommer med att ha den här typen av support för ditt företag - se det som en liten biz side kick som du kan bolla idéer med. Söka råd från.]

[utveckla om du önskar. EXEMPEL: Så här är det, det är så ofta man som solprenör behöver hjälp med idéer - som vi inte bara kan "Googla" oss till - support. Och utan det? XYZ]

[CTA. Exempel. Och om du vill ha den här typen av support i ditt liv? Var redo, för snart kommer dörrarna att öppnas för Creative Content Club! Så om du vill ha riktigt stöd i ditt företag - samt XYZ - anmäl dig till VIP-listan nu!].`,
        `Det finns inget bättre än att få kärleksfulla meddelanden från nöjda kunder/klienter (förutom kanske [infoga autentiskt element för dig. EXEMPEL: kaffe, choklad, vin, valpar] som kommer nära, men jag är bara människa, eller hur?)

Så när jag öppnade detta kärleksbrev? Det är safe to say att jag fick en liten känslostorm hehe. Om du vill ha resultat som detta, då [infoga CTA. EXEMPEL: gå till länken i min bio och kolla in XYZ-sortimentet, boka ett samtal, shoppa i butiken]`,
        `Det är ingen hemlighet att varje [drömkund. Exempel: Kvinnor som lever i värmen i Australien] behöver lite [ämne. EXEMPEL: lätta loungewearkläder i sitt liv som passar i värmen]

...Det är precis därför [din produkt/tjänst/erbjudande. EXEMPEL: mina loungewearkläder i ljust linne] existerar.

[Diskutera fördelarna med din produkt/tjänst här. Använd produkt-/tjänstbeskrivningarna om det behövs för att lägga till en övertygande text om ditt erbjudande. Exempel: Detta loungewearset får dig att känna dig sval och lugn även när XYZ.]

Redo för lite av denna magi i ditt liv? [CTA. Exempel: gå till länken i min bio och XYZ].`,
        `Påminnelse: Det är okej att [infoga drömkunds painpoint. EXEMPEL: känna sig överväldigad, stressad och faktiskt lite vilse.]

[Uppmärksamma painpoint. EXEMPEL: Dessa är alla giltiga känslor, och vi har alla varit där någon gång.]

Och om du känner så här just nu? I just denna stund? Eller inte vill känna så här i framtiden? Då har jag något som kan bistå med en hjälpande hand.

[infoga freebie/tjänst/produkt och vad den gör. EXEMPEL: Vi har nyligen lanserat en e-bok som hjälper dig att arbeta igenom dessa känslor på ett hälsosamt sätt som lämnar dig klarsynt och med en undran om var detta har varit hela ditt liv.]

Allt du behöver göra är [vad vill du att de ska göra? Gå till länken i bio, anmäl dig till epostlistan för att få den gratis, skicka mig ett DM, etc] och jag kommer vara redo att hjälpa dig på nolltid!`,
        `BRB, ska bara gå iväg och gråta (av glädjetårar) över denna UNDERBARA [kund] feedback en snabbis.

Jag är så tacksam för var och en av er som låter mig göra det jag gör varje dag och utforska min passion för [din företagsnisch här. EXEMPEL: att skapa blomstermagi som perfekt kompletterar och förhöjer era evenemang.]

Jag lever för feedback som denna... det gör mig så lycklig att veta att jag har [vad ditt företag gör. EXEMPEL: bidragit till någons stora dag på ett så meningsfullt sätt.] Så mycket att de ville ta några minuter av sin dag för att berätta för mig hur mycket de älskade det.

PS - vill du uppleva samma resultat som [namn eller denna fantastiska klient?]. Boka [tjänstens namn] genom länken i min bio! Bara [infoga urgency/brådska här. EXEMPEL: två platser kvar för mars, så skynda dig!] Och min DM är alltid öppen om du undrar hur detta skulle kunna fungera för dig!`,
        `REAL TALK: Har du funderat på eller spanat in [erbjudande. EXEMPEL: en VIP-dag för att snabbt ta fram en strategi för dina sociala medier?]...

Men kanske har du hållit tillbaka eftersom [infoga drömkundens invändning: du har känt dig lurad av liknande tjänster tidigare, tjänster som lovar världen men som inte levererar.]

Jag förstår det, och jag vill att du ska veta att det är EXAKT den anledningen till att jag har en [infoga garantipolicy här. EXEMPEL: 100% nöjd kund-garanti]!

Japp, du läste rätt! Jag GARANTERAR att [utveckla vad policyn garanterar. EXEMPEL: om du implementerar strategierna från vår session och av någon konstig anledning inte ser resultat? Jag återbetalar jag dig]!

Allt för att du ska kunna investera utan oro, risk eller bekymmer.

Så om det har varit det som har stoppat dig, och eftersom det inte är det längre, [CTA. EXEMPEL: låt oss idag prata om hur jag kan hjälpa dig att [det resultat du erbjuder]. Skicka ett DM eller gå till webbplatsen för att fylla i ansökningsformuläret för att kolla om vi är en perfect match!]`,
        `Vill du veta vad du kommer att få ut av [tjänst/erbjudande. EXEMPEL: mitt annonseringspaket för ditt företag]?

Förutom [uppenbar inkluderande del i tjänsten. EXEMPEL: det faktum att jag kommer att köra dina annonser för ditt företag som ett proffs, med garanterad avkastning] så klart? 👏

Du kommer dessutom [Infoga transformation/annat resultat. EXEMPEL: aldrig behöva oroa dig för hur du ska hitta tid att göra allt, eller tid i din dag för att se till att din försäljning rör sig framåt. För det är det jag finns här för!]

[Förklara vidare om det behövs.]

Jag vet inte med dig, men jag tycker att detta är en ganska fantastisk möjlighet att minska stressen i ditt företagande!

Och om det är en möjlighet som du skulle vilja lägga till i ditt liv - [CTA: låt oss connecta och prata om hur jag kan hjälpa dig att synas och sälja mer - medan du fortsätter med din dag. Gå till länken i min bio och boka ditt gratis samtal nu. Platserna i april är begränsade.]`,
        `Redo att bli imponerad!? Spännande announcement på gång!

Känner du dig alltid [relevant för din drömkund. EXEMPEL: överväldigad av att försöka få ditt innehåll att sticka ut bland allt brus]?

Lägger du konstant [relevant för din drömkund. EXEMPEL: 2 timmar eller mer bara på eeeett inlägg]?

Är du trött på [relevant för din drömkund]?

De här känslorna? De är EXAKT varför jag har skapat [infoga tjänst eller produkt här som löser drömkundens känslor. EXEMPEL: ett HELT NYTT sociala medie-planeringspaket gjort specifikt för XYZ att XYZ].

Vad gör [tjänsten] annorlunda jämfört med andra på marknaden?

[infoga ditt unika försäljningsargument [USP] för produkt, tjänst. EXEMPEL: Det här paketet inkluderar XYZ så du kan vara säker på att det kommer att ge dig seriösa resultat... inom din budget!]

[infoga din USP för produkt, tjänst.]

[infoga din USP för produkt, tjänst.]

Kolla in den här sprillans nya [tjänsten] nu [CTA. EXEMPEL: genom länken i min bio].

[Valfri CTA]

En snabb påminnelse att detta inte kommer att pågå länge eftersom det bara finns [#] platser tillgängliga!!`,
        `NOTE: Inlägg med recension i grafik eller inled med recension i bildtexten

_____________

Hallååå, jag är helt fylld av glädje över denna otroliga recension jag fick [infoga tid/ämne. EXEMPEL: direkt efter XYZ-webinaret, igår, om XYZ-tjänsten].

Denna feedback är EXAKT varför [jag gör det jag gör, jag skapade denna tjänst].

Och om du vill veta om [XYZ-tjänsten] är för dig? [Besök min FAQ-sida, skicka mig ett meddelande, läs några fler recensioner här].`,
        `OBS! Inlägg med 2 x olika slides. Lägg till ett påstående om en transformation på varje. EXEMPEL:

"Jag stressar inte längre över mitt innehåll" "Mitt företag blir sett, älskat och säljer".

---

1 eller 2? ➡️ Vilket av dessa påståenden skulle DU föredra att vara?

Nåväl, HÄR ÄR GREJEN! Du behöver inte välja. Eftersom min [tjänst/produkt] hjälper dig att uppnå båda.

[Utveckla om tjänsteerbjudandet och transformationen].

[Valfri CTA]

En liten hemlighet från mig till dig - du kan få [sätt in något som lockar. EXEMPEL: 20% rabatt just nu eller vår sista tillgängliga tid i november om du bokar idag!] Gå inte, SPRIIIING till [sätt in hur de kontaktar - min hemsida, min DM] för att få reda på mer!`,
        `FÖRSLAG. Använd detta som ett karusellinlägg med bilder för att visa olika delar av din tjänst.

---

Endast [X] dagar kvar av året... Wow, hur är det ens möjligt? 😱

Med så lite tid kvar är det dags att fråga dig själv: Vill du att detta år ska vara det året då [ämne här. EXEMPEL: du ökar din försäljning på Facebook, du lämnar stress och negativitet bakom dig]?

ELLER markerar du 2024 som ett annat år fyllt av kunde, borde, skulle? Den sista där kommer inte att hända under min vakande ögon, förresten 👀

Om du vill ha [förändring här EXEMPEL: den sinnesförändring du har drömt om som kommer att göra dig redo att uppnå XYZ 2025], är det dags att sluta tveka och sätta [ditt företag/dig själv/dig/dina klienter] först genom att [vad du gör här. EXEMPEL: outsourca dina sociala mediekampanjer till mig, boka mig för mental coachning, anmäla dig till mitt 10 veckors bootcamp, etc].

Swipa här ovan för att se exakt hur jag kan hjälpa dig att nå de magiska målen du har satt och sedan din allra nästa steg! 👉

Besök [webbplatsen/länken i bio] för att [boka din plats/registrera dig/köpa]! [Endast X platser kvar, XYZ tar slut snabbt, bara X dagar tills detta erbjudande avslutas!].`,
        `Vill du att [infoga ämne eller painpoint. EXEMPEL: din stress över att hålla koll på bokföringen samtidigt som du, du vet, driver en HEL företagsverksamhet och försöker ha ett liv också] ska bli något som hör till det förflutna? *_vinkar adjö_*

Om så är fallet är det här bokstavligen SKAPAT FÖR DIG.

[Infoga tjänstens namn] är specifikt för [infoga drömkunder. EXEMPEL upptagna företagsägare] som vill [strävan/önskan. EXEMPEL veta att deras bokföring görs korrekt och i tid, utan att förlora timmar - och hår - genom att försöka göra det själva].

För jag vet hur det är att [infoga drömkundens problem som produkten/tjänsten löser. EXEMPEL: tillbringa timmar och timmar med att försöka spåra kvitton, matcha betalningar, hålla allt i linje för redovisningar till Skatteverket, när den tiden kunde ha spenderats bättre någon annanstans i ditt lilla företag].

Så jag skapade en lösning som [infoga detaljer. EXEMPEL: låter mig sköta din bokföring åt dig digitalt när du behöver hjälp, istället för återkommande varje vecka. Jag vet att inte alla småföretagsägare behöver hjälp med bokföringen på heltid ännu, och jag arbetar efter DINA behov, inte en färdig lösning som INTE skräddarsys.]

Vill du prata mer om att säga adjö till dina [ämne. EXEMPEL: bokförings-] bekymmer och hur detta skulle kunna fungera för dig? Då [CTA. Exempel: gå till länken i min bio och XYZ, DM:a mig idag för att prata mer. DM:a mig för en prisguide och mer information].`,
        `NOTE. Para detta med ett _snabbt_ erbjudande som är tids- eller antalsbegränsat. Lägg till detaljerna i ett karusellinlägg.
____________________________

Du vill inte missa detta!

Detta är ett av de mest speciella [speciella erbjudanden] jag har skapat hittills! Så varför ville jag göra detta och varför i hela friden erbjuder jag detta endast för [infoga detaljer. EXEMPEL: månaden december, de första 3 personerna]?

[Infoga anledning till att skapa ett unikt erbjudande. EXEMPEL: Eftersom jag vet hur fantastiskt det kan kännas att starta det nya året med ett PANG och detta erbjudande kommer att hjälpa dig med XYZ]

Om detta låter som något [du vill/ du behöver i ditt liv/ för bra för att missa], gå till [CTA]`,
        `Den senaste [infoga produkt/tjänst/erbjudandetyp. EXEMPEL Canva-mallarna i min webbshop] är verkligen en av [våra/mina] favoritlösningar från [varumärkesnamn] NÅGONSIN. Och detta är varför [vi/jag/kunderna] älskar det:

[Funktionerna] betyder att [fördel för målgruppen]

Genom [funktionerna] kommer du att [fördel för målgruppen]

[Funktionerna] hjälper dig att [fördel för målgruppen]

Och [funktionerna] [fördel för målgruppen]

‌

Kolla in [produktens namn] nu [CTA. EXEMPEL genom länken i min bio.].

[FRIVILLIG CTA] Och PS - Det finns en stor chans att detta kommer sälja slut snabbt, så var snabb om du vill vara säker på att [fördel för målgruppen]!`,
        `Alla säg det med mig nu... "Jag kommer inte att [drömkunds vanliga misstag som din produkt/tjänst löser. EXEMPEL: kämpa med mitt content idag!"]

Du kanske undrar exakt hur du lyckas med det?

Enkelt.

Genom att [infoga åtgärd. EXEMPEL: ladda ner mitt] [produkt/tjänst/freebie här. EXEMPEL: sprillans nya freebie] som [löser vanligt misstag/problem här. EXEMPEL: beskriver den exakta strategin jag använder om och om igen för att komma på tiotals sociala medieidéer som KONVERTERAR - på mindre än 1 timme!]

Redo att ta ditt [ämne här. EXEMPEL: contentskapande] till nästa nivå? Gå då till länken i min bio för att [vad vill du att de ska göra? Anmäla sig för förhandsbeställning, ladda ner e-bok, anmäla sig till epostlistan för specialerbjudanden, osv.].`,
        `[Infoga det din drömkund tänker. EXEMPEL "Varje gång jag har försökt XYZ tidigare har jag misslyckats. Hur skiljer du dig åt från andra på marknaden?"]

Jag förstår den funderingar. Jag hör det hela tiden.

Och idag kommer jag inte gå in på varför ANDRAS [program, tjänster, erbjudanden] kanske inte har gett dig det resultat du vill ha - det är inte det jag gör.

Men vad jag faktiskt gör? Är att låta dig veta varför [resultat: EXEMPEL: mitt program/tjänst/erbjudande fungerar].

[Infoga anledning till att ditt program eller erbjudande hjälper människor att uppnå framgång]
[Infoga anledning till att ditt program eller erbjudande hjälper människor att uppnå framgång]
[Infoga anledning till att ditt program eller erbjudande hjälper människor att uppnå framgång]

Det är en del av den hemliga formeln som hjälper så många att uppnå [infoga det ultimata resultatet din drömkund är ute efter]. Och jag är så stolt över det!

Om du vill prata mer om hur jag kan hjälpa dig - på ett annat sätt än vad du kanske har upplevt tidigare - [CTA här om hur man kontaktar dig].`,
        `DRÖM-[insert product/service/freebie name. EXAMPLE: CANVAMALLAR] incommmming!!

✅ [infoga funktion/fördel av produkten/tjänsten. EXEMPEL: ljusa färger för de fantastiska skönhetsföretagen, så att du kan sticka ut i flödet och visa upp din strålande personlighet!]
✅ [infoga funktion/fördel med produkten/tjänsten]
✅ [iinfoga funktion/fördel med produkten/tjänsten]
✅ [infoga funktion/fördel med produkten/tjänsten]

[Infoga vittnesmål eller kort klientberättelse om hur produkten/tjänsten gjorde deras liv bättre]

Vill du med i hypen? Skaffa dina canva-mallar idag! Gå till [infoga CTA. EXEMPEL: länken i bio, vår webbplats, vår blogg]`,
        `Ehmmmmm, jag vill inte stressa dig, men du vill VERKLIGEN inte missa detta!

Om [XYZ dagar/veckor/månader] lanserar jag min sprillans nya [tjänstens namn]!

Så, vad är [XYZ-tjänsten] och hur kommer den att hjälpa dig?

[XYZ-tjänsten] kommer bokstavligen [infoga förvandling som kommer av tjänsten eller ditt löfte om tjänsten].

Inget mer [infoga saker som tjänsten tar bort från drömkundens liv. EXEMPEL: känna att du är XYZ. Kämpa för att uppnå XYZ. Eller misslyckas när du försöker XYZ].

Bara [infoga vad tjänsten kommer att leverera till drömkunden. EXEMPEL: Hantera din XYZ, skapa ringar på vattnet när det gäller XYZ och meningsfulla resultat för din XYZ.]

Ställ en påminnelse, för [infoga brådska/brist: platserna fylls snabbt]!

Och om du vill ha första tjing, se till att du är [var borde de vara? CTA för din e-postlista, Facebook-grupp, VIP-lista etc.]`,
        `En hand upp om du någonsin har haft [infoga något din drömkund skulle ha haft/gjort tidigare som din tjänst gör lättare/löser. EXEMPEL: din sminkning klar, bara för att känna att det inte var 'du']?

Eller vad sägs om när [infoga något din drömkund skulle ha haft/gjort tidigare som din tjänst gör lättare/löser. EXEMPEL: du har den perfekta bilden i huvudet för din look på det där evenemanget, men du kan helt enkelt inte hitta rätt bild online för att visa vad du tänker. För att visa vad du VERKLIGEN vill ha]?

Då kanske det gör dig glad att veta att [infoga rolig fakta om din tjänst som löser ovanstående problem. EXEMPEL: innan varje sminksession kan du förvänta dig att vi skapar en mood board för din look. Vibes, färger, människor med din ansiktsform som arbetar med de tekniker vi planerar att använda. Allt för att du ska se ut och känna dig som ditt allra bästa själv!].

Du behöver inte ta mitt ord för det, här är vad en [kund/klient/gäst] har att säga: [infoga recension/kundfeedback för att påvisa dina fakta.]

Vill du se om vi är en match? [infoga CTA: Gå till länken i bio, besök vår webbplats, skicka mig ett DM]`,
        `Åh - det kommer alltid så mycket kärlek för [tjänstens/produktens namn].

Kärlek för [funktion/fördel. EXEMPEL: de ljusa, glada mönster som utgör grunden för mallarna i paketet].

Kärlek för [funktion/fördel]

Och kärlek för [funktion/fördel]

Vill du vara nästa person att förälska sig? [Infoga CTA]`,
        `DET NÄRMAR SIG!

[Infoga en punkt med brådska för din målgrupp. Exempel: min XYZ är nästan fullbokad! ELLER Min försäljning är nästan här och det släpps för min e-postlista allra först! Om du inte är med på listan kommer du att missa det!]

[Infoga CTA]`,
        `Jag vet inte vem som behöver höra detta, men [infoga CTA. EXEMPEL: du förtjänar verkligen att boka in dig för den där kostnadsfria konsultationssamtalet. Och om du tror att du inte har tid? Det har du. Eftersom den här sessionen kan SPARA tid på lång sikt. Timmar faktiskt!].

[Infoga CTA]`,
        `[Unik fördel eller fördel. EXEMPEL: Fantastiska resultat, ökad vinst och en hel del skoj.]

Den perfekta kombinationen!

Det är [koppla tillbaka till ditt erbjudande. EXEMPEL: de tre orden som först kommer upp i tankarna för de som anmäler sig till mitt XYZ-program/tjänst/produkt.].

Och det finns en hel hög med fantastiska saker utöver det också. Vill du veta mer? [Infoga CTA]`,
        `Tänk om du ääääääääntligen hade en lösning för [painpoint/utmaning för din drömkund]?

Den sortens lösning som får dig att dansa en glädjedans och fira, eftersom du inte längre behöver [infoga utmaning. EXEMPEL: fundera på vad du ska laga till middag, eller komma på något för den eviga fruktade frågan "mamma, vad blir det för middag ikväll?"].

Om du är redo att förvandla ditt "tänk om" till din fantastiska verkliget, då har jag något för dig.

Din nya favoritlösning: [Infoga lösningens namn. EXEMPEL: Den upptagna familjens kokbok!]

[Förklara erbjudandet. EXEMPEL: Denna nedladdningsbara lösning har skapats för att hjälpa dig och din familj att snabbt och enkelt välja 7 hälsosamma måltider varje vecka. Det gör du enkelt genom att "bläddra" igenom receptboken och slumpmässigt välja 7 måltider som görs på under 30 minuter. De har dessutom handlingslistor med dem för att göra shoppingen enkel].

Tänk [fördel. EXEMPEL: inte ens behöva TÄNKA på middagsalternativ. Tänk [fördel: EXEMPEL: inte längre stressa med att XYZ]

Och [fördel]

Om du vill ha denna fantastiska lösning i din värld, [CTA. EXEMPEL: Skicka mig ett DM med orden DRÖMMIDDAGAR! Så skickar jag en länk i DM!]`,
    ],
    'Underhållande': [
        `CRINGY MEME: “Mitt ansikte när någon säger XYZ":

‌

Okej, på riktigt. Jag avskyr att höra någon säga [XYZ]. Varför? Eftersom [utveckla på saken och varför.].`,
        `Hej där - har vi träffats?

Jag tänkte att jag skulle kika in här idag och säga ett stort virtuellt VÄLKOMMEN och HEJ till dig som är ny och till dig som har varit här ett tag!

Och som en snabb - "vem i hela världen är personen bakom företaget [@företagsnamn]" tänkte jag dela [nummer. EXEMPEL 10] snabba fakta som du kanske eller kanske inte känner till om mig!

Infoga fakta. [EXEMPEL - Jag dricker i genomsnitt 7 koppar kaffe om dagen. Don't \\@ me, jag kommer inte att ändra mig.]

Infoga fakta. [EXEMPEL - I ett tidigare liv innan jag skapade detta företag, var jag en XYZ.]

[Fortsätt med antalet roliga eller intressanta fakta]

Okej, det här summerar mig i ett nötskal.

Berätta om något av dem överraskade dig och TACK för att du är här! Jag är så hedrad över att du hänger här, en liten plats på internet som jag har skapat för att hjälpa dig [infoga din USP]. Det är en ära att ha dig här!`,
        `IDAG ÄR DET DAGS ATT FIRA!!!!

För idag [Infoga varför du ska dira. Det kan antingen vara en prestation du gjort inom företaget som du reflekterar över eller något för dina kunder. EXEMPEL: lanserade jag den nya serien av XYZ! Jag tog på mig min business woman-byxor och är så glad att meddela att en ny webbplats är på väg till er så snart som möjligt!]

[Utveckla om det behövs. Förklara firandet eller framgången eller tillkännagivandet mer detaljerat och håll inlägget mycket "hypeat" och fokuserat på fördelar. EXEMPEL. Den nya serien är en som så många har frågat mig om - en hudvårdsserie där du kan vara säker på att det inte finns några produkter framtagna i stress eller bara för att tjäna pengar, denna serie är en hög av bra saker för att hjälpa dig med XYZ.]

Så om du vill fira med mig - [CTA. EXEMPEL: håll utkik efter den nya webbplatsen som kommer om 10 dagar. Gå till butiken för att få tag på det begränsade sortimentet. Skynda dig att ladda ner freebien]

Och PS - om det är lite för tidigt att öppna flaskor kan du gärna höja din kopp med kaffe eller te för att fira med mig också!`,
        `Något som jag alltid fokuserar på är att skapa saker som jag hoppas att DU kommer att ÄLSKA. Och där har mitt största fokus legat senaste veckorna - samtidigt som kontot har växt! Så jag tänker att det är dags för en riktig presentation!

Så om du är ny här (eller har varit en del av mitt community en längre stund men missat mina tidigare presentations-inlägg) så kommer här lite fun facts about me!

[Fakta 1: Dela lite fun facts, men försök koppla det till företaget/nischen/drömkunden/företagandet på något sätt.}

[Fakta 2]

[Fakta 3]

[Fakta 4]

(Är väldigt glad att jag kan ta det här skrivandes, hade aldrig vågat stå framför [antal följare du har] och säga det högt, hahhahjälpha).

Så nu när jag har presenterat mig tycker jag att det är dags för dig att dela lite fun facts om dig själv! Let me know i kommentarerna!`,
        `Idag vill jag ta fem minuter för att prata om något som ligger mig varmt om hjärtat på [företagsnamn] [om relevant: och något som du, genom DINA köp, stödjer.]

Visste du att här på [företagsnamn] brinner jag för [infoga en passion som relaterar till en sak du har stött genom ditt företag och en kort mening om vad de gör]?

Eftersom [varför betyder denna sak så mycket för dig?] Det är så viktigt för mig att visa stöd för ändamål som detta, så varje [vecka, månad, år] [vad gör du för att stödja ändamålet? EXEMPEL: donerar jag pengar, donera XYZ% av mina försäljningar för månaden, volontärarbetar].

[Valfri CTA] Så jag bjuder in dig att gå med mig och stödja detta fantastiska ändamål genom att [donera, köpa XYZ-produkt under månaden XYZ, volontärarbeta, delta i min insamling]. Varje liten insats räknas!`,
        `OK - BERÄTTA FÖR MIG - DETTA ELLER DETTA?? Swipea mellan de här två favoriterna och berätta i kommentarerna vilken som är din favorit.

[emoji] för [uttalande/produkt/bild]

 eller

[emoji] för [uttalande/produkt/bild]

VALFRI CTA: Och om du vill ha DETTA eller DETTA (eller båda) i ditt liv? [Infoga call to action]`,
        `Hur gammal var du när du insåg att {infoga något du nyligen har upptäckt. Det bör vara relaterbart för din drömkund och något den skulle engagera sig med: EXEMPEL: meningar inte kräver 7 utropstecken för att man inte ska verka arg.}

Jag var today years old 😂`,
        `NOTE: Detta bör paras ihop med en karusell med 4 alternativ av saker som relaterar till din målgrupp. Det kan vara verktyg, saker de använder varje dag, saker de tittar på eller lyssnar på, utrustning, smaker, ingredienser, typ av produkter.

EXEMPEL:

Slide 1: Om du bara kunde behålla en, vilken skulle det vara?

2: produkt 1

3: orodukt 2

4: produkt 3

5: produkt 4

\\_\\_\\_\\_\\_\\_\\_\\__

BILDTEXT:

Jag sa vad jag sa - tre måste försvinna. Ingen fusk 😉 Kommentera ditt val nedan!`,
        `Var ärlig, hur många gånger har du {infoga något som din drömkund kommer att relatera till som är en rolig, relaterbar eller pinsam egenskap} EXEMPEL: råkat posta en viktig karusell för att sedan upptäcka ett stavfel.}

Idag är den 5 578 gången för mig 😂`,
        `Jag ber om ursäkt för sakerna jag sa när {rolig, relaterbar painpoint. EXEMPEL: mitt internet ville inte ansluta. Jag hade missat mitt morgonkaffe. Mina barn trodde det skulle vara 'kul' att vakna varje timme under natten. Jag var stressad över att behöva posta ett inlägg när jag inte hade planerat}.`,
        `NOTE: Para ihop med en karusell av "detta eller det" som har två tydliga kategorier som din drömkund kan relatera till ELLER två mycket olika saker som din drömkund kan ha svårt att välja mellan!

Till exempel:

Slide 1: Vad stämmer bäst in på dig?

Slide 2: DET: tvätten tvättad, torkad, vikt och lagd på plats allt på en dag

Slide 4: eller

Slide 4: DET: tvätten tvättad, torkad och sedan lagd i en hög i 2-4 veckor bara för att plocka ut det du behöver när du behöver det.

UNDERRUBRIK:

Okej, jag måste veta... vad stämmer bäst in på dig??`,
        `NOTE: Para detta med ett meningsfullt citat som säger exempelvis “do more things your future self will thank you for"

\\_\\_\\_\\_\\_\\_

Jag är nyfiken, hur ser detta ut för dig?

För mig betyder detta {utveckla vad citatet betyder för dig. Det kan vara roligt och lättsamt som "sluta slå mina ben i varje soffbord så att framtida jag inte är täckt av blåmärken" eller mer meningsfullt, men försök hålla det kort för att uppmuntra till att inlägget handlar om din läsare}.`,
        `Idag är jag tacksam för [något autentiskt som din drömkund kommer att relatera till].

‌

Din tur. Vad är du tacksam för?`,
        `Underskatta aldrig kraften i en [infoga något din drömkund kommer att relatera till här som är relaterat till ditt företag, nisch eller din målgrupp]"

‌

EXEMPEL - HUMOR Underskatta aldrig kraften i en mamma’s sjätte sinne som gör att de hör ingenting från nästa rum men FORTFARANDE vet att någon form av kaos pågår 😂

‌

Underskatta aldrig kraften i en soloprenör som försöker undvika den där saken på deras att-göra-lista som i slutändan bara kommer ta 5 minuter att göra, men de skjuter upp den i 5 månader 😂

‌

EXEMPEL - EMPOWERING Underskatta aldrig kraften i en soloprenör med en gemenskap av likasinnade kvinnor bakom henne som hejar på henne.

‌

Underskatta aldrig kraften i en mamma som inte har något annat val än att vara stark och fortsätta.`,
        `Skriv ett påstående som fångar uppmärksamhet. Detta kan paras ihop med en bild av dig, en grafik eller en lämplig bild.

EXEMPEL:

År 2024 skäms vi inte längre över stavfel. De är bara en del av företagslivet nu. Tack för att du lyssnade på mitt TED Talk 😂

Berätta nedan om du håller med eller inte!

‌

ELLER

Om XYZ inte längre ger dig någpt är det dags att släppa det. Nu. Tack för att du lyssnade på mitt TED Talk.

Berätta nedan om du håller med eller inte.`,
        `Vill du veta en toxic trait jag har?

Det är [infoga något relaterbart här - som att dricka 15 koppar kaffe och sedan undra varför jag inte kan sova på natten. Det är att säga att jag ska gå och lägga mig och sedan fortsätta scrolla på telefonen i tre timmar. Det är att åka på Plantagen för '1' ny växt och komma tillbaka med 15 buskar, ett nytt växthus och 4 inomhusväxter.]"

Vad är din toxic trait? Let me know i kommentarerna!`,
        `NOTE: Para med en bild med 4 alternativ som kopplar till postens ämne.

\\_\\_\\_\\_

PSSSST, vad är ditt val när det gäller [infoga ämnet posten gäller. EXEMPEL: vad min söndagsritual består av!]? Kommentera din emoji och låt mig veta!

Och innan du frågar, ja, du kan bara välja ett alternativ!!`,
        `NOTE: Para detta med ett upplyftande eller inspirerande citat som DIN drömkund kommer att relatera till.

\\_\\_\\_\\_\\_\\_

BILDTEXT:

‌

THIS? Det är min inspiration för veckan.

Jag vill veta, vad inspirerar dig den här veckan?`,
        `Jag är KÄR i [sak. EXEMPEL: våra freebies, pictures of XYZ, den här produkten, de här produkterna, quotes om XYZ]! Precis som den här! ÄLSKAR.

Dubbelklicka för att dela kärleken om du också tycker om det här!`,
        `NOTE: Para detta med ditt favoritcitat som din drömkund kommer relatera till.

---

Det behövs inga andra ord. Det här citatet säger allt.

Tagga någon som behöver se detta eller dela och sprid peppen <3`,
        `NOTE: Para detta med en karusell av två olika saker. Det kan vara olika ämnen, citat, bilder, resultat av dina tjänster.

---

Jag vet att jag inte borde ha favoriter, så istället kommer jag att låta DIG bestämma. Vilken av dessa två är din favorit? Kommentera en 1 eller 2 nedan och låt mig veta.`,
        `En av dessa saker är inte som de andra... Vilket av följande är INTE [infoga ämne som är relaterat till ditt företag eller dörmkund. EXEMPEL: betraktat som en näringsämne? Något du bör göra om du försöker XYZ? En färg som skulle rekommenderas för sommarmode]

A [infoga alternativ. EXEMPEL: vitaminer]

B [infoga alternativ. EXEMPEL: mineraler]

C [infoga alternativ. EXEMPEL: fiber]

[Kommentera ditt svar nedan och kolla våra stories senare idag för svaret/ Swipa för att se svaret och kommentera nedan om du gissade rätt! Blev du förvånad av svaret?]`,
        `NOTE: Det här kan vara ett roligt sätt att engagera din publik eller hjälpa dig att lära dig mer om deras problem och drömmar.
\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\__

Några förslag/exempel:

Saken jag aldrig skulle klara mig utan som [din drömkund. EXEMPEL: mamma] är\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\__-

En dag utan [din produkttyp. EXEMPEL: kaffe] skulle vara\\_\\_\\_\\_\\_\\_\\_\\__

Min giftiga [din nisch. EXEMPEL: trädgårds] egenskap är \\_\\_\\_\\_\\_\\_\\_\\_\\_\\_-

TEXTFÖRSLAG TILL BILDTEXT:

Nu är det din tur! Vad skulle du avsluta den här meningen med?`,
        `NOTE: Para detta med en utbildande eller inspirerande bildtext om ämnet du har nämnt i memetexten.

\\_\\_\\_\\_\\_\\_\\_\\__

MEME EXEMPEL:

‌

Min reaktion när jag hör någon säga att du inte behöver en varumärkesstrategi, men deras eget varumärke växer inte utan en.

‌

Min reaktion när någon säger att marknadsföring i sociala medier är UTE och INEFFEKTIVT när jag har fått 20 nya leads den här veckan.

‌

Min reaktion när jag hör kunder säga att de inte kan uppnå något, för jag VET att de är menade för framgång.`,
        `NOTE: Para denna med en bildtext som visar hur ditt erbjudande löser din drömkunds problem och uppmanar/inspirerar den att ta action.

\\_\\_\\_\\_\\_\\_

MEME EXEMPEL:

‌

När någon säger att du behöver återanvända ditt innehåll för att få det mesta ut av det, men du har bokstavligen ingen tid.

‌

När någon säger att du behöver använda XYZ-produkten för att få en strålande hud, men du har verkligen ingen aning om vad det betyder.

‌

När du hör att det är viktigt att optimera din landningssida för maximerade resultat, men det låter som ett annat språk för dig.`,
        `NOTE: Para detta med en bildtext som ger information om ditt ämne och hur man gör det "rätt".

\\_\\_\\_\\_

MEME EXEMPEL:

‌

Du: Ska jag bara ladda ner mina videor från TikTok och dela dem direkt på Instagram?

‌

Du: Borde jag posta färre säljande inlägg för att det blir för tjatigt?`,
        `NOTE: Para detta med din favorit-GIF av någon som ser stressad ut, rör sig snabbt, ser bekymrad ut etc.

\\_\\_\\_\\_

Är det bara jag som svettas när det kommer till {infoga ämne som rör drömkund/företag/nisch. EXEMPEL: att göra bokslutet. Försöker komma ikapp allt jag skjutit upp till 'senare i veckan' - och nu är det redan fredag}?

hahahaSKICKAHJÄLPhaha

Lämna dina bästa {infoga ämne. EXEMPEL: fokus}-tips i kommentarerna!`,
        `Föredrar du

→ [situation som din drömkund ofta befinner sig i. EXEMPEL: Att posta i stunden och på måfå, lite det som känns roligt och när du känner för det. Ditt resultat visar på dålig räckvidd och dåligt engagemang, men framförallt få nya följare och få konverterade kunder. Du blir frustrerad varje gång det är dags att posta content för du har ingen tydlig plan, ingen idélista som matchar dina content pillars och inte ett effektivt arbetssätt].

Eller

→ [situation som du tycker att din drömkund ska jobba till. EXEMPEL: Att ha en tydlig plan för vad du ska posta och när, och för vem. Du vet vilka contentidéer som passar ditt företags konto, och dessa idéer lockar fler nya följare. Du har inga problem att sätta dig ner och skapa content, och kanske kan du till och med skapa något i stunden som blir precis rätt för din målgrupp. Tack vare att du är konsekvent i ditt postande blir du top of mind i din nisch och bransch, och får flera nya kunder!]

‌

Alternativ 1 eller 2?

Jag är nyfiken på ditt svar, kommentera nedan 👇👀`,
        `Unpopular opinion: [något du tycker som din drömkund helst inte vill höra att de behöver för att lyckas. EXEMPEL: en strategi] är ett krav för framgång.

‌

Den åsikten är såklart populär bland mig och många av mina branschkollgeor, men människor brukar ibland tycka att det är lite jobbigt att höra att man måste [vad är det du tycker man ska ha? EXEMPEL: ha en strategi] för att lyckas.

‌

Och jag kan förstå det. Det kan kännas både svårt och jobbigt att [göra det du tycker. EXEMPEL: ta fram en strategi] själv. Men heeej, det är därför jag finns här 😎

‌

Jag har spenderat alla de där tusentals timmarna på att lära mig och nu har jag mitt företag för att du ska slippa lägga alla de timmarna och komma direkt till mig istället 🙋‍♀️

‌

[Infoga CTA kopplat till din tjänst du vill pusha extra, med tidsbegränsning om du önskar. EXEMPEL: I april dubblas priset för en skräddarsydd innehållsstrategi, så passa på att knipa en innan mars är slut!]`,
        `NOTE: Para med en karusell med flera slides av citat du gillar.

____________

Jag tycker det är dags att dela litet pepp igen 🙏 Swipa för att se om något passar just dig - och ta till dig det!

‌

Många av oss som hänger här är ju [din drömkund/målgrupp. EXEMPEL: småföretagare, många är också soloföretagare].

Och det kan ibland vara [känsla inför situation. EXEMPEL: tufft att vara själv, när energin dippar eller motivationen sjunker en snabbis].

‌

Det händer oss alla. Även om man [känsla som drömkund upplever. EXEMPEL: absolut ÄLSKAR sitt företag och det man gör, kommer det ibland dagar där man helt enkelt har en liten dipp]. Det är okej. Det är normalt.

‌

Acceptera dippen, försök förstå vad den har att säga (sovit lite? Jobbat för mycket?) och sen tar du nya tag när du kunnat ge kroppen vad den behöver! 🙏❤️‍🩹

‌

Så ta lite pepp och ladda inför morgondagen. Då ska vi skapa stordåd 🙌`,
        `NOTE: Para med en karusell med information om dig själv. Vem du är, vad du gör, fritidsintressen och annan rolig fakta.

_________
BILDTEXT:

Jag vill lära känna dig!

Berätta gärna om dig själv i kommentarerna nedan 👇 Jag vill veta
\\- vem du är
\\- vad du gör
\\- vad du tycker om att göra på fritiden!

Ta gärna någon minut och kommentera nedan. Det vore så roligt att få läsa 🙏

Jag passar på att presentera mig själv på bilderna i det här inlägget (swipa för att läsa mer)! Jag har säkert glömt massa information som kan vara kul för dig som följare att veta, men jag tänker att det kommer längs vägen!

Jag hoppas att vi ska få det riktigt roligt tillsammans här, och att jag kan inspirera dig att [vad gör ditt konto för din följare? EXEMPEL: våga ta tag i ditt företags närvaro på sociala medier och testa nya grejer! Underskatta inte makten som finns på de olika sociala plattformarna].

Jag hjälper dig mer än gärna att [det du gör i ditt företag. EXEMPEL: levla upp ditt Instagramkonto! Strategi, contentplan, social media managing eller coaching - vi tar tillsammans reda på vad just Ditt behov är och sätter upp en plan utifrån det!]

‌

[Infoga CTA. Vill du ha hjälp med dina sociala kanaler? Skicka ett DM/Läs mer på hemsidan/Spana in länken i min bio]`,
        `NOTE: Para detta med ett roligt citat. Exempel: “Are we supposed to know what we’re doing?”

________

BILDTEXT:

Fredagsskoj 🤪

Känner du lite såhär ibland när du ska [situation. EXEMPEL: försöka sätta dig ner och planera ditt content?] Det behöver du inte!

Jag kan hjälpa dig få en överblick över [vad hjälper din tjänst med? EXEMPEL: vad du ska göra, varför du gör det, hur du gör det och för vem!] När du har de delarna kommer det vara sååå mycket enklare 👏

[Infoga CTA. Uppmana till att läsa mer om din tjänst/produkt/erbjudande]`,
        `Upp med handen alla som känner igen sig 🙋‍♀️

‌

Men det är dags att [infoga vad du tycker att din drömkund borde göra. EXEMPEL: ta dig ur den där mörka platsen av övertänkande - just post it!]

‌

Har du [call her out, var är drömkunden nu och vad behöver den göra för att ta sig framåt? Ge en uppmaning. EXEMPEL: 10 utkast (eller fler!!) redo utmanar jag dig att posta minst hälften av dessa innan maj månad är slut! Eller varför inte inom en vecka? Vad är det värsta som kan hända?]

‌

[Ge lite pepp som styrker att din drömkund borde agera som du säger. EXEMPEL: Dessutom finns det flera vittnesmål som säger att content som ”floppar” första gången det postas blir en succé den andra gången det postas 👀 Så ta det inte för hårt om ditt content inte får önskat engagemang direkt ❤️]`,
        `NOTE: Para detta med en karusell med bilder på två olika saker inom din nisch, saker din drömkund kan rösta på. Det kan vara två resultat utan och med din tjänst, quotes eller liknande.

_____________

Bildtext

PSSSSST - VAD VÄLJER DU - [emoji] ELLER [emoji]?? Swipa mellan dessa godbitar och berätta i kommentarerna vilken som är din favorit.

‌

[emoji] för [produkt/bild] eller [emoji] för [produkt/bild]

‌

FRIVILLIG CTA: Och om du vill att DETTA eller DETDÄR ska vara din verkliget? [Infoga CTA som uppmanar till köp/investering]`,
        `Hur gammal var du när du insåg att [infoga något du nyligen har upptäckt. Det bör vara relaterbart för din drömkund och något den skulle engagera sig med: EXEMPEL: meningar inte kräver 7 utropstecken för att man inte ska verka arg.]

Jag var today years old 😂`,
        `NOTE: Detta bör paras ihop med en karusell med 4 alternativ av saker som relaterar till din målgrupp. Det kan vara verktyg, saker de använder varje dag, saker de tittar på eller lyssnar på, utrustning, smaker, ingredienser, typ av produkter.

EXEMPEL:

Slide 1: Om du bara kunde behålla en, vilken skulle det vara?

2: inlägg

3: stories

4: reels

5: DMs

_________________

BILDTEXT:

Jag sa vad jag sa - tre måste försvinna. Ingen fusk 😉 Kommentera ditt val nedan!`,
        `Jag ber om ursäkt för sakerna jag sa när [rolig, relaterbar painpoint. EXEMPEL: mitt internet ville inte ansluta. Jag hade missat mitt morgonkaffe. Mina barn trodde det skulle vara 'kul' att vakna varje timme under natten. Jag var stressad över att behöva posta ett inlägg när jag inte hade planerat].`,
        `Var ärlig, hur många gånger har du [infoga något som din drömkund kommer att relatera till som är en rolig, relaterbar eller pinsam egenskap] EXEMPEL: råkat posta en viktig karusell för att sedan upptäcka ett stavfel.]

Idag är den 5 578 gången för mig 😂`,
        `NOTE: Para ihop med en karusell av "detta eller det" som har två tydliga kategorier som din drömkund kan relatera till ELLER två mycket olika saker som din drömkund kan ha svårt att välja mellan!

Till exempel:

Slide 1: Vad stämmer bäst in på dig?

Slide 2: DET: tvätten tvättad, torkad, vikt och lagd på plats allt på en dag

Slide 4: eller

Slide 4: DET: tvätten tvättad, torkad och sedan lagd i en hög i 2-4 veckor bara för att plocka ut det du behöver när du behöver det.

UNDERRUBRIK:

Okej, jag måste veta... vad stämmer bäst in på dig??`,
        `NOTE: Para detta med ett meningsfullt citat som säger exempelvis “do more things your future self will thank you for"

____________

Jag är nyfiken, hur ser detta ut för dig?

För mig betyder detta [utveckla vad citatet betyder för dig. Det kan vara roligt och lättsamt som "sluta slå mina ben i varje soffbord så att framtida jag inte är täckt av blåmärken" eller mer meningsfullt, men försök hålla det kort för att uppmuntra till att inlägget handlar om din läsare].`,
        `NOTE: Detta bör paras med en karusell med 3-4 alternativ med 'etiketter' som matchar saker din publik kan associera med.

EXEMPEL: "Vilken typ av contentplanerare är du?"

A: Panik-postaren

B: Månadsplaneraren

C: Försvinnaren

D: Konsekventa Sally.

Låt sedan dina följare rösta i kommentarerna. Du kan lägga till mer innehåll i bildtexten om du vill utbilda kring de olika typerna och hur ditt erbjudande kan hjälpa!

BILDTEXT:

Jag är supernyfiken - vem är du? Berätta för mig i kommentarerna! Själv är jag en [infoga alternativet du hade valt].`,
        `Underskatta aldrig kraften i en [infoga något din drömkund kommer att relatera till här som är relaterat till ditt företag, nisch eller din målgrupp]"

‌

EXEMPEL - HUMOR Underskatta aldrig kraften i en mamma’s sjätte sinne som gör att de hör ingenting från nästa rum men FORTFARANDE vet att någon form av kaos pågår 😂

‌

Underskatta aldrig kraften i en soloprenör som försöker undvika den där saken på deras att-göra-lista som i slutändan bara kommer ta 5 minuter att göra, men de skjuter upp den i 5 månader 😂

‌

EXEMPEL - EMPOWERING Underskatta aldrig kraften i en soloprenör med en gemenskap av likasinnade kvinnor bakom henne som hejar på henne.

‌

Underskatta aldrig kraften i en mamma som inte har något annat val än att vara stark och fortsätta.`,
        `Idag är jag tacksam för [något autentiskt som din drömkund kommer att relatera till].

‌

Din tur. Vad är du tacksam för?`,
        `Skriv ett påstående som fångar uppmärksamhet. Detta kan paras ihop med en bild av dig, en grafik eller en lämplig bild.

‌

EXEMPEL:

‌

År 2024 skäms vi inte längre över stavfel. De är bara en del av företagslivet nu. Tack för att du lyssnade på mitt TED Talk 😂

‌

Berätta nedan om du håller med eller inte!

‌

ELLER

‌

Om XYZ inte längre ger dig någpt är det dags att släppa det. Nu. Tack för att du lyssnade på mitt TED Talk.

‌

Berätta nedan om du håller med eller inte.`,
        `Vill du veta en toxic trait jag har?

‌

Det är [infoga något relaterbart här - som att dricka 15 koppar kaffe och sedan undra varför jag inte kan sova på natten. Det är att säga att jag ska gå och lägga mig och sedan fortsätta scrolla på telefonen i tre timmar. Det är att åka på Plantagen för '1' ny växt och komma tillbaka med 15 buskar, ett nytt växthus och 4 inomhusväxter.]"

‌

Vad är din toxic trait? Let me know i kommentarerna!`,
        `NOTE: Para med en bild med 4 alternativ som kopplat till postens ämne.

________

PSSSST, vad är ditt val när det gäller [infoga ämnet posten gäller. EXEMPEL: vad min söndagsritual består av!]? Kommentera din emoji och låt mig veta!

‌

Och innan du frågar, ja, du kan bara svara ett alternativ!!`,
        `NOTE: Detta bör paras med en karusell som säger "Min toxic trait är [infoga något roligt du gör som din drömkund kan relatera till]." Detta bör vara något din drömkund kan relatera till och som de själva kanske gör.

‌

EXEMPEL:

‌

Min toxic trait är att tro att det bara kommer ta 5 minuter att spela in en reel. 


Min toxic trait är att tvätta all tvätt på en dag och sedan låta den ligga på 'tvättstolen' i nästa månad. 


Min toxic trait är att säga "ingen fara" även om jag går sönder av oro inombords.

‌

—---

‌

BILDTEXT:

‌

SNÄLLA säg att jag inte är ensam? [utveckla om du önskar]`,
        `NOTE: Para detta med ett upplyftande eller inspirerande citat som DIN drömkund kommer att relatera till.

____________

BILDTEXT:

‌

THIS? Det är min inspiration för veckan.

Jag vill veta, vad inspirerar dig den här veckan?`,
        `NOTE: Para detta med en utbildande eller inspirerande bildtext om ämnet du har nämnt i memetexten.

_________________

SHOCKED MEME EXEMPEL: 

‌

Min reaktion när jag hör någon säga att du inte behöver en varumärkesstrategi, men deras eget varumärke växer inte utan en.

‌

Min reaktion när någon säger att marknadsföring i sociala medier är UTE och INEFFEKTIVT när jag har fått 20 nya leads den här veckan.

‌

Min reaktion när jag hör kunder säga att de inte kan uppnå något, för jag VET att de är menade för framgång.`,
        `NOTE: Para denna med en bildtext som visar hur ditt erbjudande löser din drömkunds problem och uppmanar/inspirerar den att ta action.

_______


CRYING CAT MEME EXEMPEL: 

‌

När någon säger att du behöver återanvända ditt innehåll för att få det mesta ut av det, men du har bokstavligen ingen tid.

‌

När någon säger att du behöver använda XYZ-produkten för att få en strålande hud, men du har verkligen ingen aning om vad det betyder.

‌

När du hör att det är viktigt att optimera din landningssida för maximerade resultat, men det låter som ett annat språk för dig.`,
        `NOTE: Para detta med en bildtext som ger information om ditt ämne och hur man gör det "rätt".

_______


NO MEME EXEMPEL:

‌

Du: Ska jag bara ladda ner mina videor från TikTok och dela dem direkt på Instagram?

‌

Du: Borde jag posta färre säljande inlägg för att det blir för tjatigt?`,
        `PSSSST: Letar du efter inspiration när det gäller [ämne. EXEMPEL: soloprenörslivet]?

‌

Som en [nisch här - soloprenör själv], kan jag inte leva utan/behöver alltid [kompletterande tjänst - ett verktyg, en webbplats, utrustning, inspiration, kompletterande produkt].

‌

Min favorit? [ANNAT VARUMÄRKE HÄR].`,
        `NOTE: Para detta med din favorit-meme eller GIF av någon som ser stressad ut, rör sig snabbt, ser bekymrad ut etc.

_______



STRESSED MEME EXEMPEL: 




Är det bara jag som svettas när det kommer till [infoga ämne som rör drömkund/företag/nisch. EXEMPEL: att göra bokslutet. Försöker komma ikapp allt jag skjutit upp till 'senare i veckan' - och nu är det redan fredag]?

hahahaSKICKAHJÄLPhaha

Lämna dina bästa [infoga ämne. EXEMPEL: fokus]-tips i kommentarerna!`,
        `Jag vet inte vem som behöver höra detta, men [infoga en kort påstående som din drömkund kommer att relatera till omedelbart. EXEMPEL: det är okej att ta en paus från sociala medier över helgen. Ditt företag kommer INTE att falla sönder. Jag lovar].

Tagga någon som behöver höra detta eller dela för att sprida lite pepp!`,
        `NOTE: Para detta med ditt favoritcitat som din drömkund kommer relatera till.

Det behövs inga andra ord. Det här citatet säger allt.

Tagga någon som behöver se detta eller dela och sprid peppen <3`,
        `NOTE: Para detta med en karusell av två olika saker. Det kan vara olika ämnen, citat, bilder, resultat av dina tjänster.

---

Jag vet att jag inte borde ha favoriter, så istället kommer jag att låta DIG bestämma. Vilken av dessa två är din favorit? Kommentera en 1 eller 2 nedan och låt mig veta.`,
    ],
    'Utbildande': [
        `Låt oss vara ärliga. Jag vet att när du [vad gör din drömkund. EXEMPEL: köper en formell klänning online, köper konst online], undrar du kanske [infoga en vanlig invändning eller fråga. EXEMPEL: hur i hela friden du faktiskt vet hur det kommer att se ut i verkligheten!].

Så idag ska jag dela svaret på detta så att du inte behöver undra mer!

[Infoga information om dina processer/metoder/system här].

Och om du är redo att [infoga resultatet. EXEMPEL hitta den perfekta klänningen för ditt evenemang idag? Låt oss snacka för jag skulle ÄLSKA att hjälpa dig]

[CTA. EXEMPEL: DM:a mig ordet "skönhet" så skickar jag information i DM].`,
        `Har du någonsin undrat [infoga en vanlig fråga någon har om din bransch eller ditt företag. EXEMPEL: hur du kan köpa konst online och få den levererad till dig utan att den skadas under transporten så att den kommer fram i perfekt skick]?

Även om jag inte kan tala för ALLA [infoga ämnet. EXEMPEL: konstleverantörer], kan jag berätta hur det fungerar på [företagsnamn].

[Infoga detaljerna].

Jag hoppas att detta hjälper till att klargöra det och om du har NÅGRA som helst frågor om detta är det bara att du hör av dig, jag skulle jag älska att hjälpa dig!

[Infoga CTA. EXEMPEL Boka ett gratis samtal så kan vi prata mer om detta och hur man hittar - och skickar - det perfekta konstverket för ditt hem eller arbetsplats!].`,
        `Bör du [göra något som människor överväger inom din nisch som är något mindre alternativ till din tjänst/produkt. EXEMPEL: köpa hållbara kläder]

ELLER [infoga lösningen som du erbjuder. EXEMPEL: köpa lokala och handgjorda kläder?].

Det är en fråga folk ställer mig hela tiden - och let me tell you, JAG FÖRSTÅR.

Jag förstår att [infoga eventuella invändningar människor kan ha eller varför de kan välja det andra alternativet. EXEMPEL: du kanske tror att lokalt handgjorda kläder inte är hållbara eftersom de inte har alla etiketter som stora hållbara varumärken har].

Men några saker jag alltid nämner är värt att överväga är:

När du [arbetar med/köper från din nisch. EXEMPEL: köper lokalt] kommer du [infoga fördelarna eller distinkta skillnadspunkterna i resultat osv. osv. EXEMPEL: köpa mycket hållbart med den extra fördelen att stödja ett litet företag. Kläderna här på företagsnamn är hållbara i den meningen att…].

Så medan det alltid finns alternativ tillgängliga för dig, är det viktigt att hitta rätt för att hjälpa dig att uppnå dina mål!

Vill du prata mer om [infoga din nisch: EXEMPEL: tillverkningsprocessen här på företagsnamn? Skicka ett DM, jag skulle älska att prata mer om detta!]`,
        `Vill du veta varför [ämne/lösning/erbjudande. EXEMPEL: våra silkeskuddar] verkligen kan göra riktig [förändringar/påverkan/positiva effekter] för din [situation. EXEMPEL: hud/sömn/hår/hälsa]?

Det är inte bara för att [ett värdelement. EXEMPEL: silket hjälper till att XYZ] Eller bara för att [ett värdelement. EXEMPEL: det är bevisat att göra XYZ]

Javisst, DESSA saker är viktiga och super värdefulla, men?.. Det är också på grund av detta:

[infoga något djupt/inspirerande. Exempel: det är för att det kan hjälpa dig att få den bästa sömnen i ditt liv, vilket leder dig till XYZ, XYZ och XYZ]

[utveckla om du vill på detta ytterligare.]

[CTA. Exempel: Om du är redo att förbättra din hud, sömn, hälsa OCH hår allt i ett, gå då till länken i min bio och kolla in det nya sortimentet av XYZ som precis har kommit in!].`,
        `Är [sak. EXEMPEL: kemikaliefria miljöer] viktigt för dig?

Det är det för [oss/mig] också. [Jag/vi] vet att [infoga drömkundens problem/bekymmer som du kan lösa med din tjänst/produkt. EXEMPEL: att hålla ett hem rent också kan innebära användning av många otäcka kemikalier som inte är så bra för våra små, pälsklingar eller oss själva!]

Och om du har följt oss ett tag vet du att [infoga det drömkunden letar/längtar efter. EXEMPEL: skonsamma, miljövänliga produkter som hjälper till att skydda din familj OCH miljön] är så viktigt för oss. Det är en av våra grundläggande värderingar som företag.

Det är därför vi [infoga vad du gör för att bekämpa problemet/bekymret. EXEMPEL: endast använder de allra mildaste formuleringarna och ser till att alla vår förpackningar är tillverkad av 100% återvunnet material.]

Inga fler [infoga drömkundens problem/bekymmer. EXEMPEL: oroa dig för irriterande ämnen på din lilla hud]

Inga fler [infoga drömkundens problem/bekymmer. EXEMPEL: förvirring om vad du använder varje dag i ditt hem]

Bara [infoga vad din produkt/tjänst löser för problem/bekymmer för din drömkund. EXEMPEL: förtroende för dina produkter, sinnesfrid och minskning av din koldioxidavtryck.]

Vill du haka på och ta din [infoga vad ditt företag gör. EXEMPEL: städning] till nästa nivå? Gå till [infoga CTA: länken i bio, vår webbplats].`,
        `NOTE: Skapa en karusell för att show off de tipsen du nämner i posten om du vill!

---

VÄSENTLIGA TIPS FÖR ATT [infoga ämne. EXEMPEL: få din hy att stråla över natten] - PÅ VÄG!

Okej, jag har alltid fått så många frågor om [ämne. EXEMPEL: att skapa den ultimata hudvårdsrutinen] och tro mig, jag vet hur mycket [utfall. EXEMPEL: att hitta din perfekta matchning kan förändra ditt liv], så idag delar jag med mig av några tips för att hjälpa dig att lyckas och få [det resultat din IC vill ha. EXEMPEL: den strålande huden du alltid drömt om].

1. [infoga tips. EXEMPEL: Försök att undvika att röra vid ditt ansikte och (oavsett hur mycket du vill...) försök inte klämma på finnen!]
2. [infoga tips.]
3. [infoga tips.]
4. [infoga tips.]
5. [infoga tips.]

Överraskade något av dessa tips dig? Har du problem med något av dem eller gör du redan något av dem? Berätta nedan!`,
        `NOTE: Gör en karusellpost för att visa mer av checklistan.

---

Vill du [infoga önskan. EXEMPEL: hitta den perfekta hudvårdsrutinen], UTAN ATT [infoga något som människor inte vill göra. EXEMPEL: spendera tusentals kronor på olika produkter tills du hittar dem som passar dig]?

Om så är fallet, gör dig redo för den ultimata checklistan (och glöm inte att trycka på den där spara-knappen)!

Vi vet att det kan kännas [infoga problemkänsla för din drömkund. EXEMPEL: överväldigande], men lita på oss att när du väl [har den rutinen som får dig att känna dig som en gudinna med strålande hud och strålande självförtroende,] så kommer det att vara så givande!

Så här är vår checklista med [infoga ämne. EXEMPEL: måsten när det gäller att hitta din perfekta match].

(SVEP FÖR ATT SE TIPS)

Och om du har några frågor eller vill utforska [ämnet] ytterligare, kan du [infoga CTA. EXEMPEL: se ännu mer i vår kommande masterclass XYZ. Anmäl dig genom XYZ.]`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

PSSSSST: Du kommer vilja spara detta inlägg!

5 [ämne här som relaterar till din drömkund. EXEMPEL: self-care] aktiviteter som du kan göra idag för att hjälpa din/ditt [vad hjälper aktiviteterna med för din drömkund? EXEMPEL: mentala välmående] på under 5 minuter!

Nu kör vi

AKTIVITET #1: [infoga aktivitet. EXEMPEL: Avsluta din dag genom att skriva ner tre saker du var tacksam för den dagen. Att hålla en tacksamhetsdagbok hjälper till att öka din positivitet och leder till mindre stress och en lyckligare du. En extra bonus med att göra detta till din sista aktivitet för dagen? Det hjälper faktiskt dig att sova bättre! Säg inte att jag aldrig gav dig något 😉]

AKTIVITET #2: [infoga aktivitet]

AKTIVITET #3: [infoga aktivitet]

AKTIVITET #4: [infoga aktivitet]

AKTIVITET #5: [infoga aktivitet]

Låt mig veta i kommentarerna om du gör någon av dessa aktiviteter och hur de hjälper ditt [infoga ämne här. EXEMPEL: dagliga mindset]!`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

Visste du att när [infoga något som kan hända din drömkund. EXEMPEL: din hund drar i kopplet] beror det troligtvis på [infoga vad som orsakar detta. EXEMPEL: att du använder fel typ av koppel]?

Här är vad du kan göra när detta händer:

- [infoga tips/råd. EXEMPEL: Det är dags att kontrollera din hunds föredragna gångstil. Drar de framåt, åt sidan eller XYZ. Att veta detta kommer att hjälpa dig att ta reda på om de passar bäst med ett XYZ eller XYZ koppel.]
- [infoga tips/råd]
- [infoga tips/råd]

Om du tror att [infoga problem. EXEMPEL: du har valt fel koppeltyp], och du letar efter mer råd, är det dags att [skicka ett DM till mig, kontakta oss, besöka vår webbplats, besöka länken i bio för mer information!]`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

Får [XYZ + XYZ] dig [känna XYZ]? [OBS: infoga två bidragande faktorer som slutar i en problemkänsla för din drömkund. EXEMPEL: Gör helger + mat dig förväntansfull eller lat? Gör pasta + bröd dig uppblåst?]

Tro mig, jag förstår det. Därför har jag spenderat så lång tid med att leta efter lösningen på just detta. Och gissa vad? Här får du svaren på hur du vänder problemet

1. [infoga tips. EXEMPEL: Helgerna är till för skoj, så det är ingen överraskning att din diet kan hamna i andra hand. Vem vill tänka på MACRON eller intag av grönsaker när man är på bio eller ute på en familjedag?! Det är därför det är så viktigt att planera sina måltider! Om du vet att du ska äta pasta på fredagskvällen, ha en lättare lunch. Det är också viktigt att komma ihåg att vara snäll mot dig själv och tillåta dig några godsaker här och där. Det är trots allt helg.]
2. [infoga tips]
3. [infoga tips]

Låt mig veta om detta hjälper dig [infoga problem. EXEMPEL: att göra hälsosammare matval under helgen]!`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

Real talk fyllt med massor av kärlek: Om du inte [förbereder din hud med primer innan du applicerar din bas] så gör du fel.

Ok, men varför? Kanske du undrar nu.

[Din hud] + [primer] = [slät hud och makeup som håller hela dagen!]

✅ [Visste du att förutom att hjälpa till att hålla din makeup på plats hela dagen minskar primer också mängden produkt du använder? Spara pengar genom att spendera pengar, vänner!]

✅ [Anledning till varför din IC bör göra detta.]

✅ [Anledning till varför din IC bör göra detta.]

✅ [Anledning till varför din IC bör göra detta.]

✅ [Anledning till varför din IC bör göra detta.]

Här är några enkla sätt som du kan [hitta rätt primer för din hud]:

Steg 1: [Gör vårt onlinequiz (länk i bio!) för att ta reda på vilken hudtyp du har. Detta är viktigt eftersom varje hudtyp kommer att behöva en annan typ av primer. Till exempel, om du har fet hud, skulle en mattande primer fungera bäst för dig!]

Steg 2: [Förklara hur din IC kan få det resultat du lovar i enkla steg.]

Steg 3: [Förklara hur din IC kan få det resultat du lovar i enkla steg.]

Så från och med idag, ta detta som ditt tecken att [alltid använda primer innan du applicerar] och när du gör det? Skicka mig ett DM och låt mig veta skillnaden det gör.`,
        `PSST, här är ett litet tips för alla [som älskar sommarklänningar] där ute!

Har du någonsin undrat hur [du kan övergå din sommargarderob till en varmare garderob under de kallare månaderna samtidigt som du fortfarande kan bära dina favoritsommarplagg?]

Är du redo?

[Det handlar om lager-på-lager! Här är vad du kan göra....]

VARFÖR är detta viktigt?

[Eftersom det inte bara hjälper dig att bära de plagg du älskar året runt utan det innebär också att du inte behöver köper på dig massa fast fashion-mode, och därmed känner att du behöver köpa nytt varje. jäkla. årstid. Du kan fortfarande...]

Berätta för oss om detta fungerar för dig [när du sätter ihop din nästa höstoutfit]`,
        `Truthbomb: [infoga en scroll-stoppande hook eller avslöja en myt. EXEMPEL: du behöver inte köpa de dyraste XYZ-produkterna för att få resultat.].

Såhär, [utveckla vidare. EXEMPEL: medan jag inte tvivlar på att det finns fantastiska produkter där ute, är det så att i många fall köper du varumärket, inte några extra speciella ingredienser för att ge dig 'magiska' resultat som du inte kan få någon annanstans!].

[Utveckla vidare. EXEMPEL: Du förstår, jag vet att det finns mycket bra marknadsföring från stora varumärken som får det att VERKA som att de har något magiskt. Men jag uppmanar dig att se förbi varumärkesnamnet och titta på de aktiva ingredienserna. Det är exakt samma grejer som du hittar i fantastiska produkter från mindre varumärken. Som inte har satt överdrivet höga priser på sina produkter 'bara för att'.]

[Summera. EXEMPEL: Så om du är redo att spara pengar på XYZ samtidigt som du fortfarande får samma resultat? Uppmuntrar jag dig att verkligen gräva lite djupare och fråga dig själv om du betalar för något speciellt? Eller bara betalar extra för varumärkesnamnet och inget annat].

---

VALFRI CTA: Om den här “truthbomben” relaterar till något i din verksamhet där du kan lägga till en CTA, lägg till det här. Det kan vara en freebie, kontakt i DM eller att leda människor längre in i din tratt.`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

[3 x ord, känsla, idé, något som din målgrupp finner förvirrande eller är osäker på om din produkt, tjänst, nisch. EXEMPEL: Hållbar. Miljövänlig. Ekologisk]. Är någon annan förvirrad ännu?

Om du sitter och stirrar på din skärm och undrar vad sjutton dessa saker egentligen betyder (även om jag vet att du ser dem hela tiden), så är jag här för att ge dig en liten hjälpande hand för att verkligen förstå vad dessa saker betyder... och hur de kan hjälpa dig!

[infoga ord + kort beskrivning. EXEMPEL: Hållbar betyder, XYZ, så du kan vara säker när du köper hållbart att XYZ.].

[infoga ord + kort beskrivning. EXEMPEL: Miljövänlig är lite annorlunda, vilket innebär att XYZ.].

Och slutligen [infoga ord + kort beskrivning].

Och här på [varumärkesnamn]? Är vi [infoga om något eller alla dessa är relevanta för din produkt. EXEMPEL: alla tre! När du köper XYZ kan du vara säker på XYZ.].

Och om detta fortfarande lämnar dig lite förvirrad, oroa dig inte - det är bokstavligen det som [jag är/vi är/produktens namn är] här för. Tveka inte att skicka ett DM med eventuella frågor du har, och jag kommer MER än gärna att [hjälpa, svara på dem, vägleda dig].

---

[Valfri CTA]

En liten påminnelse om att min [workshop, e-bok, webbinarium, blogg, FAQ] täcker detta och på ett djupare sätt. Gå till [länk i bio, hemsida] för att [ladda ner, prenumerera, mejla oss].`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

Händerna upp om du är ett fan, *_host_\\* besatt \\*_host_* [infoga något din drömkund skulle vilja EXEMPEL: Återfuktad hud som INTE har genomgått en IG-filter!]

Samma här!

”Men HUUUURRRR kan jag uppnå det?”, hör jag dig fråga. Du kan vara lugn, I got you covered!

STEG 1. [infoga 3 x steg till hur din produkt/tjänst löser drömkundens önskan. EXEMPEL: Börja med vår GRATIS hudanalys online]

STEGET 2. [infoga 3 x steg till hur din produkt/tjänst löser drömkundens önskan. EXEMPEL: Skapa en daglig hudvårdsrutin som du kommer att hålla dig till]

STEGET 3. [infoga 3 x steg till hur din produkt/tjänst löser drömkundens önskan. EXEMPEL: Inkludera månatliga ansiktsbehandlingar som kommer att öka vitaliteten i din hud]

Och framför allt, kom ihåg, [infoga påminnelse här. Exempel: Det kommer inte att hända över en natt, men med rätt produkter och rutin kommer det att hända!]

[Infoga CTA. EXEMPEL: Vill du ha en extra hjälpande hand för att förnya din hudvårdsrutin och få den hy du drömmer om? Klicka på länken i bio för en GRATIS hudanalys]`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

Visste du att [något som ingår i din produkt EXEMPEL: Epsomsalt] + [något som ingår i din produkt. EXEMPEL: Rosa Himalayasalt] = [infoga resultatet av dessa två saker som gynnar din målgrupp. EXEMPEL: en magisk blandning som hjälper till att lindra graviditetsvärk och smärtor när den används tillsammans i ett varmt bad]?

Här är 3 skäl till varför du vill använda [mixen av dessa ingredienser. EXEMPEL: Epsomsalt och Rosa Himalayasalt i dina bad] från och med nu.

[Fördel #1. EXEMPEL: Epsomsalt är känt för det höga magnesiuminnehållet som hjälper till att slappna av och lugna ömma muskler. Och en liten hemlighet från oss till dig? Det hjälper också till att lugna den översträckta känslan!]

[Fördel #2]

[Fördel #3]

Det är just därför varje [produkt] här på [företagsnamn] inkluderar [infoga formula ovan].

Så om du känner dig [infoga målgruppens känsla som produkten eller tjänsten kommer att lösa. EXEMPEL: översträckt, trött och öm], då är det här [produkten] för dig!

Shoppa vår [utbud, produkter, rea] via [länken i bio, hemsida, här].`,
        `Så du vill [infoga en önskan din produkt hjälper till att uppnå. EXEMPEL: att välja en mer hållbar livsstil] men du är osäker på [infoga en invändning från din målgrupp. EXEMPEL: de högre priserna på ekologiska livsmedel jämfört med konventionella alternativ.]

Jag förstår det. Jag lovar.

Och du ser, [förklara och motbevisa invändningen med resonemang och ditt VARFÖR. Hjälp dem att förstå varför de inte kommer att uppleva detta eller ändra sin uppfattning. EXEMPEL: här på varumärkesnamn strävar vi efter att erbjuda rimliga priser på våra ekologiska produkter, samtidigt som vi kvalitetssäkrar och håller oss till våra värderingar. Vi tror på att göra hållbara alternativ mer tillgängliga och att stödja konsumenter i deras strävan efter en mer miljövänlig livsstil.]

Så om detta har hållit dig tillbaka, kan du nu vara säker på att [utfall. EXEMPEL: att välja ekologiska livsmedel för att främja din hälsa och miljö utan att spendera överdrivet mycket pengar] är fullt möjligt.

Vill du prata mer om [utfall]?

[CTA. Skicka ett meddelande för att prata mer om detta eller gå till länken i min bio och läs min blogg om 5 sätt att främja en hållbar livsstil].`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

Behöver du lite inspiration för [infoga ämne. EXEMPEL: din nästa middagsdejt-outfit]?

We’ve got you covered!

Swipa i inlägget för att se [infoga vad de kan se. EXEMPEL våra topp 5 outfits för en romantisk middagsdejt].

[Infoga CTA. Och om du vill lägga till dessa perfekta outfits i din garderob för att bära på DIN nästa dejtkväll - Spana in på hemsidan och handla NU!]`,
        `"[Infoga uttalande här som din målgrupp skulle höra mycket. EXEMPEL: "att köpa hållbart är bara slöseri med pengar"]

Händerna upp om du har hört det här? Eller hört folk säga:

[Infoga uttalande relaterat till det. EXEMPEL: "Varumärken försöker bara göra sig gröna för att lura dig."] eller [infoga uttalande.] eller till och med [infoga uttalande.]

Vill du veta sanningen? [Infoga uttalande här: EXEMPEL: Hållbart är INTE slöseri med pengar. Inte varje varumärke är lömskt. Och dina inköp gör en enorm skillnad.]

[Förklara och utbilda. EXEMPEL. Visste du till exempel att en ny studie visade att att köpa hållbart är det bästa sättet att ...?! Detta är varför...]

Berätta gärna i kommentarerna om detta är något du hört eller har sett!`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

VAD DU BEHÖVER VETA INNAN [infoga hook/ämne här. EXEMPEL: du ger din lilla fast föda!] (Spara detta inlägg!)

Ok [infoga din drömkund här. EXEMPEL: mamma]. Så tiden har kommit och du funderar på [infoga ämnet här. EXEMPEL: att lägga till fast föda i din lilla's kost].

MEN [infoga det problem de står inför eller kan stöta på. EXEMPEL: Det är superviktigt innan du tar det spännande steget att du förstår exakt vilken typ av mat som rekommenderas för din lilla - och vilken som inte rekommenderas!]

Det är därför jag har satt ihop en hjälpsam guide för att hjälpa dig att [ange resultatet de kommer att uppnå genom att läsa guiden. EXEMPEL känna fullständigt förtroende för att göra den första skålen av gott mos för din vackra lilla].

Swipa här ovanför för att se rekommendationerna och ta en screenshot och spara så att du har den till hands när det behövs!`,
        `Ok, så jag var [infoga ålder] år gammal idag när jag fick reda på det här, så jag delar med mig till dig ifall du inte visste...

Visste du att [dela bransch-/verksamhets/professionell-insikt. EXEMPEL: det finns en webbplats online som låter dig spåra XYZ? Och att du kan använda den helt GRATIS!]

Faktum är att [utveckla det här användbara tipset, upptäckten, ämnet]

Är det här nytt för dig också? Eller har jag legat under en sten?`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

[Antal] [ingredienser/steg/delar] för [något din drömkund önskar]

Vill du [sak de vill uppnå. EXEMPEL: ett snabbt sätt att budgetera för din familj varje vecka utan stress eller tidskrävande timmar för att räkna siffror]?

Om så är fallet, här är mina [antal ingredienser/steg/delar] som kommer att [resultat de kommer att uppnå. EXEMPEL: få dig att budgetera på bara några minuter varje vecka].

Svep för att se dem alla!`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

3 SAKER JAG ÖNSKADE ATT JAG VISSTE INNAN [situation din drömkund är i/relaterar till. EXEMPEL: Jag köpte min första bröstpump]

När du först [upprepa situationen. EXEMPEL: börjar pumpa för att mata med flaska] kan det vara [känsla. EXEMPEL: nervöst och samtidigt väldigt spännande]

Du är [situation de befinner sig i. Vad driver dem? EXEMPEL. redo att ta detta steg men osäker på vad man kan förvänta sig, hur det kommer att kännas, vilken utrustning du behöver och listan fortsätter].

Och om du nickar just nu, vill jag att du ska veta att de känslorna och frågorna är normala. Och nu förmedlar jag några av de saker jag önskar att någon hade berättat för mig när jag var i de skor du är i idag!

1 [infoga tips, råd eller avslöja en myt]

2 [infoga tips, råd eller avslöja en myt]

3 [infoga tips, råd eller avslöja en myt]

Finns det något du skulle lägga till på denna lista eller något som kändes igen? Jag skulle älska att veta i kommentarsfältet!`,
        `Om du inte visste det så behöver du inte [infoga fakta eller avslöja en myt eller dela något om din produkt. EXEMPEL: exfoliera ditt ansikte varje. jäkla. dag.]

Faktum är att [infoga information här om vad de borde göra. EXEMPEL: det kommer att göra din hud torr och göra mer skada än nytta!]

[Fortsätt att utveckla informationen. EXEMPEL: Vad du istället bör göra? Är att exfoliera en gång i veckan och använda en XYZ-produkt andra dagar. Detta kommer att säkerställa att du XYZ och aldrig känna XYZ.].

[Ställ en fråga som CTA. Exempel: Har du redan full koll på detta? Vill du veta mer om vilka produkter som är rätt för dig? I så fall, DM:a mig! Jag skulle älska att hjälpa].`,
        `Jag har sagt det förr och jag säger det igen...

[Det som betyder något här är att. EXEMPEL: du behöver inte köpa dyra smycken för att se ut som en milion dollar babe!]

Varför? Eftersom [infoga info. EXEMPEL: du kan se fantastisk ut med smycken som passar din budget och fortfarande är tillverkade av värdefulla, vackra material med unika designer].

Och [om du har svårt att göra detta/behöver lite inspiration för att hjälpa till med detta]? Här är en hjälpande hand! [Utveckla med ett inspirerande exempel eller ett råd. EXEMPEL: Nästa gång du letar efter prisvärda smycken som ser högkvalitativa ut, föreställ dig XYZ...]

[CTA: Och om du vill ha några smycken som passar din outfit OCH budget? Gå till länken i min bio och se den nya kollektionen av XYZ som har XYZ och XYZ]`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

5 sätt att [infoga ämne som relaterar till det din drömkund bryr sig om. EXEMPEL: hjälpa ditt lilla barn genom perioden med tandgenomträngning]

Jag hör många [drömkunder. EXEMPEL: mammor] säga att de [sak som de kämpar med. EXEMPEL: har försökt alla konventionella metoder för tandvård för sin lilla men utan framgång att hitta en lösning] och jag vill berätta att JAG FÖRSTÅR.

Och idag är här för att dela med mig av lite kunskap för att se till att den kampen slutar här, för ingen ska behöva kämpa med det!

1. {Infoga tips/hint}
2. {Infoga tips/hint}
3. {Infoga tips/hint}
4. {Infoga tips/hint}
5. {Infoga tips/hint}

‌

Hur många av dessa gör du redan och hur många var helt nya för dig?`,
        `Det känns som att alla inom [en särskild grupp/gemenskap. EXEMPEL: föräldravärlden] pratar om [ämne. EXEMPEL: bambutyg just nu] och om du inte vet vad det är? Då är den här posten är för DIG!

[Berätta mer om ämnet, ge insikter och din åsikt. EXEMPEL: Bambutyg är XYZ och anledningen till varför så många älskar det är XYZ. Det kommer att hjälpa dig med XYZ och XYZ så att du aldrig behöver oroa dig för XYZ. OCH grädden på moset är XYZ]

[Om du har ett sätt att direkt inkludera detta i ditt erbjudande för företaget, nämn det här. EXEMPEL: Och alla dessa saker? Det är precis varför vår senaste kollektion av barnkläder har tillverkats av detta fantastiska tyg!]

Har du några frågor om [saken. EXEMPEL: Bambutyg och vår nya kollektion]? Skriv dom i kommentarsfältet så svarar vi!`,
        `Att [XYZ. EXEMPEL: matcha silver och guldsmycken tillsammans, klippa dina ljusvekar] eller [XYZ: EXEMPEL inte matcha silver och guldsmycken tillsammans, inte klippa dina ljusvekar]. Det är frågan. Och om det är en fråga som du också har ställt dig själv, så har jag idag ett svar.

Jag tror att du bör [Infoga informationen här om vad du tror är det bästa sättet för din målgrupp att göra]. Varför? Eftersom [infoga mer resonemang för att backa upp detta]

Har du hört motstridig information om [ämnet: EXEMPEL smyckesstil, skötsel av dina ljus]? Låt mig veta nedan!`,
        `Den största missuppfattningen jag hör om [bransch]. Är att [misuppfattningen: att du måste ha en exakt idé om vad du vill ha].

Du BEHÖVER INTE [bryt ned missuppfattningen här. Exempel: ha en skiss på vad du vill ha].

Eller [bryt ned missuppfattningen här. EXEMPEL: ha sett denna typ av smycke någon annanstans].

Eller [bryt ned missuppfattningen här].

Det du BEHÖVER är [infoga fakta eller inspiration här. EXEMPEL: En skicklig designer som kan arbeta med dig för att lyssna på dina behov, ställa de rätta frågorna och designa det perfekta smycket för dig utifrån dina önskemål].

Så nästa gång du tänker " [infoga en fras de skulle säga om den missuppfattningen. EXEMPEL: Jag kommer aldrig att få det perfekta smycket skapat eftersom jag helt enkelt inte kan förverkliga det själv]", kom ihåg, [infoga visdomsord. EXEMPEL: allt du behöver är rätt expert och det där smycket du älskar kommer att förverkligas].

PS är det här du? Har du haft problem med att [infoga problem. EXEMPEL: hitta någon att samarbeta med dig för att skapa ditt perfekta smycke]? [infoga CTA om hur de kan boka dig eller köpa från dig]`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

Hur ofta känner du dig fast när det kommer till [gemensamt problemområde för din målgrupp]?

Sugigt, eller hur? Jag förstår det, men jag vill dela med mig av tre tips idag som kan [förändra din värld helt, hjälpa dig att komma förbi detta, och hjälpa dig att säga adjö till X och hjälpa dig att Y].

TIPS #1: [infoga tips]

TIPS #2: [infoga tips]

TIPS #3: [infoga tips]

Gör du någon av dessa saker för tillfället? Eller har du något du skulle vilja lägga till på listan för andra [i branschen]? Jag skulle gärna vilja veta! Kommentera nedan!`,
        `Ett snabbt tips som kommer att hjälpa dig att [förbättra din användning av vår ryggsäck] direkt?

[Dela tips. EXEMPEL: Använd alla fickor och fack för optimal organisering!]

Det kan låta självklart, men att utnyttja alla fickor och fack i vår ryggsäck kan göra en stor skillnad för [din dagliga organisation och bekvämlighet]. Genom att använda varje fack för specifika ändamål - som exempelvis ett fack för din laptop, ett annat för dina nycklar och plånbok, och ett tredje för vattenflaskan - kan du hålla dina saker organiserade och lättillgängliga när du är på språng.

Och det bästa är att [infoga en fördel, antyda hur lätt förvandlingen är eller utveckla tipset. EXEMPEL: Genom att använda vår ryggsäck på detta sätt kan du inte bara hålla dina saker i ordning, utan också minska stressen och tiden det tar att hitta det du behöver när du är ute och reser eller på jobbet!]

Har du använt detta tips tidigare? Eller har du några andra strategier du använder för att optimera användningen av din ryggsäck? Jag skulle gärna vilja höra!`,
        `Om du funderar på [något som är i din drömkunds tankar], läs detta inlägg först!

Att [något som din drömkund funderar på. EXEMPEL: Köpa en barnvagn innan bebisen föds] är så viktigt, men innan du [väljer, köper] finns det några saker du bör veta för att se till att du får [det önskade resultatet: EXEMPEL: den perfekta passformen för dig].

1. Har du övervägt [infoga en sak]?
2. Visste du att [infoga en sak]?
3. Inte alla [XYZ] är skapade lika.

Så innan du go for it, se till att du överväger dessa saker eftersom de verkligen kan hjälpa dig att [infoga det din drömkund önskar. EXEMPEL: hitta den bästa vagnen för just dig!]`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

Den här veckan pratar vi om [infoga sak. EXEMPEL: att tvätta dina tygblöjor]...

Mer specifikt, om hur du [infoga ett mer fokuserat ämne om den saken. EXEMPEL: gör processen så enkel som möjligt - och samtidigt får dina blöjor att hålla längre också!].

Förbered dig för att trycka på sparaknappen för det här är mitt hemliga knep!

Det MEST viktiga att komma ihåg när det gäller [infoga sak] kommer alltid att vara [infoga det viktiga. EXEMPEL: blötlägg först, tvätta sedan i KALLT vatten - med en touch av XYZ i tvätten också].

Och om du vill veta några andra små användbara tips kan du också:

[infoga tips / tips här #1. EXEMPEL: När de är tvättade kan du enkelt torka dessa genom XYZ?]

[infoga tips / tips #2]

[infoga tips / tips #3]

[Infoga en CTA som relaterar till din produkt! Exempel - Och om du behöver en EXTRA speciell hand, gå till webbutiken och lägg till en av våra blöjtvtättpaket i din nästa beställning som hjälper dig att säga hej till XYZ och hej till XYZ].`,
        `Hej [tilltala din drömkund. EXEMPEL: Mamma, fantastiska småföretagare, vän].

Det kan vara svårt att [infoga en frustration för din drömkund. EXEMPEL: hitta tid att träna när du arbetar heltid och kommer hem till barn, tvätt, middagen måste lagas, hitta den perfekta presenten till den speciella personen som verkar ha ALLT].

Och tro mig, jag förstår det!

[Infoga varför detta kan vara dåligt/negativt för din drömkund. EXEMPEL: Men ATT INTE hitta tid att prioritera dig själv och din hälsa då och då? Det är skadligt för dig i längden.]

Här är mitt snabba tips för att vända problemet och hitta en lösning som VI ALLA behöver under de där [infoga frustration. EXEMPEL: hektiska dagarna].

[Infoga ett tips för att hjälpa till att vända problemet. EXEMPEL: Försök att ställa in en alarmklocka en timme tidigare innan barnen vaknar och få in lite träning då. Byt dagar med din partner så att någon alltid är hemma om det behövs, och på så sätt får ni båda träningstiden prioriterad. Detta lägger också till en motivationsfaktor för att gå upp och inte slösa bort din tilldelade träningsdag.]

Har du några tips för [infoga frustrationerna och drömkunden. EXEMPEL: upptagna, arbetande föräldrar som prioriterar sin träning]? Dela med dig i kommentarerna nedan!`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

PSSSSST: Innan du [vad är något din idealkund gör? EXEMPEL: köper din nästa XYZ, bestämmer dig för rätt XYZ för dig, startar det där cardio-programmet på löpbandet], se till att du först [vad behöver de göra? Läs den här informationen! Ställ dig själv de här frågorna! Kontrollera att du har dessa måste-ha saker med dig! Se till att du gör dessa saker först!]

SWIPEA IGENOM INLÄGGET OCH BOCKA AV DEM EN EFTER EN!

Och om du vill ha mer stöd som detta i framtiden? Se också till att du [call to action. EXEMPEL: lägger till detta konto i dina favoriter för att aldrig missa ett inlägg! Anmäl dig till vårt mejllista där jag varje vecka skickar ut XYZ].`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

Har du nyligen börjat [använda XYZ-produkten, på din XYZ-resa, försöka XYZ] men är inte helt säker på var du ska börja med [infoga ämne som relaterar till produkt/situation. EXEMPEL: hållbart mode]?

Nåväl, här är de goda nyheterna: vi har sammanställt några tips och tricks för att hjälpa dig [infoga deras slutliga önskan. EXEMPEL: köpa mer hållbart mode utan att krossa budgetar].

[infoga tips. EXEMPEL: För att hålla dina bivaxdukar i upp till ett år är det viktigt att de tvättas och torkas ordentligt och sedan förvaras borta från värme]

[infoga tips]

[infoga tips]

För fler tips, tricks och sätt att [använda/ genomföra] [XYZ-produkt/tjänst], [infoga CTA. EXEMPEL: gå till länken i bio, lägg till \\@‌företagsnamn i dina favoriter för att alltid se dessa inlägg först].`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

Idag känner vi oss lite "händiga" och har utvecklat vår alldeles egna [verktygslåda för företag/produkt/tjänst] för att hjälpa dig [vad hjälper den med? EXEMPEL: hantera akneutbrott].

Här är din [sak att infoga. EXEMPEL: Akneförebyggande] verktygslåda:

🔨 [infoga verktyg #1. EXEMPEL: Ha alltid en oljefri rengöringsgel till hands. Bonuspoäng om den innehåller salicylsyra i ingredienserna!]

🔧 [infoga verktyg #2]

🪛 [infoga verktyg #3]

🪚 [infoga verktyg #4]

Spara denna verktygslåda för [infoga scenario där verktygslådan skulle vara användbar att ha/använda. EXEMPEL: nästa gång du handlar och vill ändra din hudvårdsrutin för att förebygga akne].

[Valfri CTA] Och om du letar efter de rätta verktygen till din verktygslåda, leta inte längre än vår [infoga CTA. EXEMPEL: länk i bio/webbplats]. Du hittar allt du behöver där!`,
        `Det hemliga vapnet för att [infoga din målgrupps strävan eller önskan. EXEMPEL: se till att alla dina växter lever ett långt och hälsosamt liv]?

Är att [infoga ett tips eller ett råd. EXEMPEL: sluta pilla på dem!!].

Ofta brukar människor här ute [något som människor gör fel. EXEMPEL: tro att de behöver göra detta, göra det där, lägga till detta, flytta dem hit], men DET ÄR BARA INTE SANT!!

Genom att [upprepa poängen. låta dina växter vara ifred] kan du verkligen [infoga slutresultatet. EXEMPEL: få dem att hålla i år efter år och du kommer ha de där gröna fingrarna du drömmer om!].

Så kom ihåg, [sammanfatta poängen. EXEMPEL: ju mindre du rör dina växter DESTO BÄTTRE]...

Åh, och spara detta inlägg för när du behöver denna påminnelse.`,
        `NOTE: Gör en karusellpost för att visa mer av ämnet i posten.

---

Visste du att [infoga intressant fakta som relaterar till din produkt/tjänst/bransch/nisch. EXEMPEL: 50% av snabbmode kastas bort under de första 3 månaderna] 🤯

Tycker du att det är [imponerande/hemskt/chockerande]? Här är lite annan snabb fakta/intressant statistik som kanske chockar dig att lära dig om [infoga produkt/tjänst/bransch/nisch. EXEMPEL: grafisk design]

[infoga intressant/imponerande fakta. EXEMPEL: Det tar mindre än 90 sekunder för någon att bestämma sig om ett varumärke. Och med kunder som tar 50 millisekunder att bestämma om de ska stanna på din webbplats, är det intressant att veta att mellan 62-90% av deras beslut bara baseras på färgen. Färgteori är viktigt folk!]

[infoga intressant/imponerande fakta.]

[infoga intressant/imponerande fakta.]

[infoga intressant/imponerande fakta.]

Ganska [imponerande/hemskt/chockerande], eller hur?

Vill du ta den här faktan/statistik och använda dem till fördel för [infoga din målgrupp. EXEMPEL: ditt företag/du/etc]? Då är det dags att [infoga CTA. EXEMPEL: klicka på länken i bio/ skicka mig ett DM/ skicka mig ett mejl/ göra en bokning].

Du kommer tacka dig själv senare!`,
        `Nu får det vara nog. Jag är så trött på [ämne som din drömkund relaterar till. EXEMPEL: “det är bara att posta så kommer försäljningen automatiskt”]

[Jag håller inte med! Och här är varför:]

[Dela varför du inte håller med. EXEMPEL: Bara för att du postar en bild på ett snöigt träd kommer du inte sälja. Du behöver ha en strategi bakom ditt postande].

[Utveckla dina tankar kring ämnet, och lägg tyngd vid det du vill att läsaren ska ta med sig. EXEMPEL: Det är inte bara att posta så kommer försäljningen, det är en straight up lie. Du behöver en strategi för att XYZ. Och när vi postar skräp och inte säljer kommer vi slå ner på oss själva och tro att vi är sämst, när det är bristen på strategi som gör att det går dåligt. ]

Så [sammanfatta lärdomen och infoga CTA. EXEMPEL: Så nästa gång du hör någon säga “bara du postar så säljer du” så vet du att de menar att du behöver posta med en strategi, och du kan sluta vara så elak mot dig själv när du inte säljer något från din promenadbild på solen! Vill du ha en strategi bakom ditt postande? Skicka ett DM/kolla länken i min bio för att veta mer!]`,
        `Inget tvivel om att du har hört talas om [en nyhet i din bransch/nisch].

[Beskriv nyheten och värdet i den]

Jag tänkte att vi skulle gå igenom den här nyheten idag, och titta lite på de viktigaste punkterna i den här nyheten! Let’s go:

[Beskriv en grej som nyheten bidrar till och en branschledares åsikt kring den]

[Beskriv en grej som nyheten bidrar till och en branschledares åsikt kring den]

[Beskriv en grej som nyheten bidrar till och en branschledares åsikt kring den]

Du kanske undrar vad JAG tycker om det, eftersom jag tar upp det.. Jo såhär tänker jag

[Beskriv din åsikt kring nyheten och de punkterna du tagit upp]

[Beskriv din åsikt kring nyheten och de punkterna du tagit upp]

[Beskriv din åsikt kring nyheten och de punkterna du tagit upp]

Vad tänker du om den här [nyheten]? Dela dina tankar i kommentarerna!`,
        `[Lista dina varumärkesvärden. EXEMPEL: Avslappnad. Rolig. Peppig.]

Dessa [X anta] ord är kanske mer kända som mina varumärkesvärden - de saker jag strävar efter att leva efter varje dag här på [företagsnamn]. Och för att börja den här veckan rätt har jag bestämt mig för att påminna mig själv om varför jag gör det jag gör. För vad är ett bättre sätt att bocka av mål den här veckan än med syfte och klarhet?

Så vad betyder dessa värden för mig (och egentligen, för dig)?

Värde 1: [infoga värde och kort om det. EXEMPEL: Avslappnad: Jag är här för att ge dig en avslappnad upplevelse. Det finns så mycket stress och hets om marknadsföring på sociala medier där ute och jag vill vara en motpol till det. Det går att göra den här grejen lugnt och sansat också - därför är avslappnad ett viktigt ord för mig!]

Värde 2: [infoga värde och kort om det]

Värde 3: [infoga värde och kort om det]

Så om du är en nuvarande [klient/kund] eller kanske blir det i framtiden, är detta saker du alltid kan förvänta dig av mig, och det som din upplevelse kommer att vara fylld av. Och det är något som gör mig så otroligt stolt att erbjuda!`,
        `Saken jag skulle ALDRIG göra här på [företagsnamn]?

Är [dela ett ämne som är viktigt för dig. Detta kan hämtas från dina varumärkesvärderingar. EXEMPEL: skapa ett coachningsprogram som bara var arbete och ingen glädje].

För mig? [Infoga vad du står för/vad som är viktigt för dig och varför. EXEMPEL: De mest fantastiska förändringarna sker när du VILL arbeta med ditt företag och dig själv. Och detta kommer från en miljö av glädje!]

[Utveckla mer om det behövs].

Är [ämnet. EXEMPEL: glädje] något som är viktigt för dig i ditt [liv/resa/dag/företag]?`,
        `Upp med handen om du någonsin har [infoga invändning eller fråga du får om ditt erbjudande/tjänst. EXEMPEL: undrat som blivande mamma om vår yogastudio tillgodoser dig och din växande mages behov med extra tjocka mattor och yogakuddar för bästa komfort? Undrat om vårt sortiment av hårvårdsprodukter som vi använder i salongen är skonsamma mot XYZ].

Du behöver inte undra längre för svaret är [ja/nej/svar]!

[Infoga information som besvarar och/eller visar trovärdighet, svarar på frågan eller övervinner invändningen. EXEMPEL: Här på företagsnamn har vi en graviditetscertifierad instruktör som håller 3 klasser varje vecka. Så var lugn, du kan (och kommer!) få din träning med någon som har kunskapen att ta hand om dig och ditt växande barns behov. Och dessutom? Yoga som förväntansfull mamma kan också hjälpa dig att FÖRMÅN, FÖRMÅN och FÖRMÅN!]

Har du några frågor om [specifik tjänst som kräver trovärdighet här. EXEMPEL: gravidyoga]? Eller är du redo att [infoga CTA - boka idag, få tag i din första XYZ]? [det du vill att de ska göra - skicka ett DM, besök din webbplats].`,
        `[nummer. EXEMPEL: 3] [tips/hacks/grejer du tycker är onödigt för din drömkund att lägga tud eller pengar på. EXEMPEL: Insta-hacks jag tycker är slöseri med tid om du är soloföretagare 👋]

‌

1\\. [tips/hack|sak som du tycker är onödigt för din drömkund att lägga tid eller pengar på. EXEMPEL: Att pressa ut mängder med innehåll! Ser instagurus säga att för maximal tillväxt ska du posta 7 reels, 4 karusellposter och 3 singelposter, VARJE VECKA. Hjälp. Det kan ge dig en boost, absolut! Men jobba inte ihjäl dig. Det räcker med tre inlägg per vecka också, eller ett om det är det enda du har tid med!]

‌

2\\. [tips/hack|sak som du tycker är onödigt för din drömkund att lägga tid eller pengar på].

‌

3\\. [tips/hack|sak som du tycker är onödigt för din drömkund att lägga tid eller pengar på].

‌

Har du [tiden/pengarna] att lägga på dessa [tips/hacks/saker] och du tycker det är roligt? Ja men kööör för guds skull 💃 Men många [invändning, och varför du tycker motsatsen. EXEMPEL: tycker sociala medier är stressande, ångestfyllt och jobbigt, så jag är här för att visa dig hur enkelt det är att göra det roligt 🥳 (och ett knep är att strunta i dessa hacks!)]

‌

Vill du ha fler tips på vad du kan göra för att [vad du hjälper din drömkund med. EXEMPEL: bygga en stabil närvaro på sociala medier? Följ mig 👋]`,
        `Jag ska berätta en hemlighet...

‌

Jag [något som kopplar till din nisch. EXEMPEL: är en sucker för feta tidningsrubriker. Varje gång jag handlar på mitt lokala ICA sneglar jag mot tidningsstället och fnissar lite åt dramatiken i rubriksättningen..]

‌

[Utveckla dina tankar på ämnet. EXEMPEL: Ibland fångar de mitt intresse så pass mycket att jag faktiskt googlar fram nyheterna när jag kommer hem 😂]

‌

[Berätta mer kopplat till din nisch. EXEMPEL: Skulle NÄSTAN kalla hooks för sociala mediers feta tidningsrubriker, men de är inte lika dramatiska utan väcker istället intresse för vilket content som kommer härnäst! Vad är det jag ska få veta? Vad är det jag ska få lära mig? Vad är det jag ska få se?]

‌

Testa [uppmana din drömkund att göra något. EXEMPEL: använda en i ditt nästa inlägg!]

‌

[Infoga CTA. Exempel: PS. Kom ihåg att spara det här inlägget så du lätt hittar tillbaka till alla exempel jag gett dig!]`,
        `[Något din drömkund skulle kunna säga. EXEMPEL: "Men åååh, finns det rätt och fel på bildstorleken också? Kan man inte bara köra på det som känns bra?"]

‌

[Förklaring på varför du tycker som du tycker. EXEMPEL: Klart du kan! Men vet du vad som är så bra när du använder 1080 x 1350-posterna? Du tar upp så mycket plats du bara kan i instagramflödet! Och vet du vad det leder till?? Att din bild tar så mycket plats på skärmen att den som scrollar inte ser föregående eller nästa bild, och därför inte blir distraherad och scrollar vidare.]

‌

[Resultat av din åsikt. EXEMPEL: De stannar alltså kvar lite längre på din bild, och det gillar algoritmen, hehe.... 💃]

‌

Vill du [resultatet de får när de gör som du säger. EXEMPEL: maximera din närvaro på Instagram? Använd 4:5 (1080 x 1350px) på bilderna!]

‌

[infoga CTA. EXEMPEL: följ mig för mer tips!]`,
        `Får jag vara väldigt ärlig en snabbis? Det som gör ditt liv svårt just nu är [något din drömkund gör som gör deras liv svårt - t.ex. skriva innehåll utan struktur, försöka hitta den perfekta smycken med en säljare hängande över axeln, tro att du måste ha allting perfekt varje gång], och det gör att du bara står kvar och stampar på samma ställe istället för att ta dig framåt.

Jag vet att du vill [vad är drömkundens önskan? Sticka ut på sociala medier, hitta smycken som verkligen är autentiskt du, göra det bästa möjliga jobbet], och jag lovar att du kan komma dit, du behöver bara testa göra på ett annat sätt!

Okej vad bra tänker du nu, men HUR?!

Det ska jag förklara för dig nu!

Om du vill [XYZ], tycker jag det bästa sättet att uppnå [resultat] är att [infoga utbildande, informativt eller inspirerande råd här].

Det är så [jag/mina klienter/kunder] har gått från [var du var i det förflutna/var din drömkund är nu - t.ex. kämpar för att hitta de perfekta kläderna som matchar min personlighet] till [infoga transformation - t.ex. att hitta plagg jag älskar så lätt och stressfritt för att visa upp på utsidan vem jag verkligen är på insidan].

Är det något du kan relatera till att du haft problem med tidigare? Lämna en kommentar eller skicka ett DM! Jag skulle älska att prata mer om det med dig! Det här är ju [något jag hjälper/stöder människor med varje dag, anledningen till varför jag startade XYZ-butiken, de värderingar som driver 'företagsnamn'] och jag hjälper dig gärna framåt!`,
        `Här kommer ett snabbt tips som kommer att hjälpa dig att [infoga din drömkunds önskan. EXEMPEL: utnyttja kraften med hashtags] direkt?

[Infoga tips. EXEMPEL: Sluta använda samma grupp med hashtags om och om igen!] Det kanske verkar självklart, men jag kan inte nog berätta mycket det har hjälpt [mig/mina klienter/mina kunder/andra XYZ jag känner. EXEMPEL: mina klienter] att [infoga transformation som uppnåtts. EXEMPEL: nå fler människor bara genom att variera mellan olika uppsättningar av hashtags!].

Och det här är det bästa - [infoga en fördel, visa på hur lätt transformationen är. EXEMPEL: Att skapa olika grupper med taggar tar bara några minuter! Du behöver bara veta vad din målgrupp är intresserad av!].

Har du gjort detta tidigare? Eller har du något annat du [använder/tillämpar/provar]? Jag skulle vilja veta!`,
        `PSST: Drömmer du om att [infoga något din drömkund önskar. EXEMPEL: önskar du att du kunde påskynda din kvällsrutin för hudvård]? Då är det här för dig.

Vissa dagar känns det som att jag har knäckt koden när det gäller [ditt ämne, EXEMPEL: att komma från badrummet till sängen på kortast möjliga tid]. Men det är ingen hemlighet som jag tänker hålla för mig själv ALLS, och jag tycker att hela världen behöver veta det!

Så här kommer mina bästa tips för [det resultat din drömkund önskar, den ultimata ENKLA hudvårdsrutinen]!

[Infoga ditt tips. EXEMPEL: Utvärdera och minska! Hur länge sen var det du faktiskt utvärderade din hudvårdsrutin? Visste du att en riktigt bra produkt kan ersätta många och de tidskrävande stegen i din rutin?]

[Infoga ditt tips.]

[Infoga ditt tips.]

Vilket av ovanstående skulle göra störst skillnad [infoga ämne. EXEMPEL för din rutin]?

[VALFRITT CTA - om du kan koppla stegen eller resultatet strategiskt till något erbjudande, avsluta med det här. EXEMPEL: Vill du se vårt populära retinolserum som hyllas av alla kunder som testar det? Kommentera “[emoji]” så skickar vi en direktlänk i DM!]`,
        `Om du funderar på [något som finns i din drömkunds tankar. EXEMPEL: köpa ett contentpaket för att underlätta marknadsföringen i ditt företag], läs det här inlägget först!

[Det din drömkund tänker på. EXEMPEL: Att skaffa ett contentpaket] är så en bra idé, men innan du [väljer, dyker in, köper, väljer] finns det några saker du bör veta för att vara säker på att du får [det resultat de vill ha. EXEMPEL: det perfekta paketet för dig].

Har du övervägt [infoga info för att hjälpa din drömkund få ett bra resultat]?

Visste du att [infoga info för att hjälpa din drömkund få ett bra resultat]?

Inte alla [ämnen. EXEMPEL contentpaket] är skapade lika. [Infoga info för att hjälpa din drömkund få ett bra resultat].

Så innan du hoppar och kör, se till att du överväger dessa saker, eftersom de verkligen kan hjälpa dig att [infoga det din drömkund önskar. EXEMPEL: få det resultat för din marknadsföring som du letar efter].

Har du några andra frågor om [ämnet]? Skriv dem nedan eller skicka ett DM så försöker jag svara ASAP!`,
        `Det är dags för påminnelse om att du INTE behöver [infoga något som är en begränsande övertygelse för din drömkund eller en invändning från dem. EXEMPEL: spendera tusentals kronor på en logga för ditt företag när du just har börjat].

Faktum är att [infoga info eller kanske en egen historia för att hjälpa människor att se att det du säger är sant. EXEMPEL: några av mina absoluta favoritlogotyper har jag sett från personer som köpte min XYZ digitala produkt och gjorde sin egen logotyp. Svep för att se några exempel!].

Hur ofta har du haft ångest över [upprepa din drömkunds pain pont - t.ex. kostnaden för din logotyp och låtit det hindra dig]? Om du svarade "ummm, hela tiden!" så är detta din påminnelse om att det finns andra alternativ!

[Upprepa begränsande övertygelse] är INTE det enda sättet. Jag lovar.

[Avsluta med en CTA som kopplar till hur du kan hjälpa drömkunden]`,
        `Det finns ingen sak som [infoga myt här - t.ex. ett perfekt inlägg på sociala medier].

Oavsett vad du hör. Oavsett vad folk säger. Oavsett vad experter försöker säga till dig.

Vad som faktiskt finns? Är [infoga vad som verkligen existerar. EXEMPEL: ett inlägg på sociala medier som resonanser perfekt med DIN IDEALA MÅLGRUPP].

Såhär är det, [utveckla detta ytterligare och ge ditt perspektiv på varför det du pratar om är en myt. EXEMPEL: Inlägg på sociala medier behöver göra ha ett syfte, att locka och resonera med din drömkund. Så finns det ETT typ av inlägg som passar precis alla? NEJ! Vad som däremot finns är...]

Så snälla kom ihåg, nästa gång du läser om [myten] och det får dig att tvivla på dig själv, fråga dig själv [infoga något din drömkund bör reflektera över. EXEMPEL: är det här innehållet relevant för mig och min målgrupp?] Och om det inte är det? Skrolla vidare.

_________

AVANCERAD STRATEGI: Om du har ett erbjudande eller produkt som kan stötta din drömkund kan du infoga det här som en CTA. Exempel - Om du verkligen har svårt att skapa content till dina sociala medier och vill veta hur du skapar content som är perfekta för ditt UNIKA företag? Kolla in min nya tjänst som släpps... ELLER Ladda ner min freebie om...`,
        `Den största missuppfattningen jag hör om [infoga din bransch. EXEMPEL: skräddarsydda kläder]? Är [infoga missuppfattningen. att du måste ha en exakt idé om vad du är ute efter].

Du BEHÖVER INTE [bryt ner missuppfattningarna här. EXEMPEL: en skiss på vad du vill ha]

Eller [bryt ner missuppfattningarna här. EXEMPEL: ha sett det önskade plagget någon annanstans]

Eller [bryt ner missuppfattning här]

Så, vad behöver du då undrar du kanske nu. Det ska jag berätta för dig 👇

Det du behöver är [infoga fakta eller inspiration här. EXEMPEL: En skicklig sömmerska som kan arbeta med dig, lyssna på dina behov, ställa rätt frågorna och designa det perfekta plagget för dig utifrån dina specifika önskemål ].

Så nästa gång du tänker "[infoga en fras de skulle säga om den missuppfattningen. EXEMPEL: Jag kommer aldrig att få ett perfekt plagg skapat eftersom jag inte ens vet exakt själv vad det är jag är ute efter]", kom ihåg, [infoga lite pepp. EXEMPEL: allt du behöver är rätt expert och ditt önskade plagg kommer att bli verklighet].

Känner du igen dig i det här? Har du haft svårt att [infoga utmaning. EXEMPEL: hitta en sömmerska att samarbeta med för att skapa ditt perfekta plagg]? [infoga CTA om hur de kan boka dig eller köpa från dig].`,
        `Saker du inte behöver försvara som [nisch: EXEMPEL en soloprenörska].

[infoga sak 1 de inte behöver rättfärdiga: EXEMPEL SOM ÄR LITE ROLIGT: Att döda den tredje skrivbordsväxten för i år. Det händer oss alla. Du är inte ensam]

[infoga sak 2 de inte behöver rättfärdiga: EXEMPEL SOM ÄR INSPIRERANDE: Att sätta så höga mål att att dina vänner och familj inte förstår och kollar frågande på dig när du berättar. Det är okej, de behöver inte. Det är bara du som behöver tro på och jobba för dem dagligen.]

Eller

[Infoga sak 3 här]

Vad skulle du lägga till i listan som [infoga nisch här. EXEMPEL: soloprenörska]?`,
        `Hur ofta känner du att du kört fast när det gäller [sak din drömkund har som pain point]?

Det är riktigt tråkigt, jag förstår det. Därför vill jag idag dela med mig av tre tips som kan [helt förändra din värld, hjälpa dig att övervinna detta, hjälpa dig att säga adjö till X och hjälpa dig att Y].

TIPS #1: [infoga tips]

TIPS #2: [infoga tips]

TIPS #3: [infoga tips]

Försöker du göra någon av dessa just nu? Eller har du något att lägga till på listan för andra [infoga nisch?]. Jag skulle gärna vilja veta! Dela med dig i kommentarerna 👇`,
        `I fall du inte visste det [infoga fakta här eller avslöja en myt eller dela något om din produkt. EXEMPEL: du behöver inte komma på helt nytt content varje. jäkla. dag]

Det är faktiskt så att [infoga information här om vad de bör göra. EXEMPEL: det inte bara är skönt utan också bra att återanvända gamla inlägg!]

[Fortsätt att utveckla det du skriver om. EXEMPEL: Du behöver alltså inte skapa nytt hela tiden. Återanvänd gammalt, skriv om det lite och testa nya hashtags. Testa ett nytt format, var det en reel kanske du kan göra en karusell istället. Det är bra av flera anledningar än att det är bekvämt, det påminner också dina följare om informationen som annars glöms bort efter cirka 2 dagar]

[Avsluta med en CTA som innehåller en fråga. Exempel: Har du redan koll på det här? Eller vill du veta mer om hur du kan göra din närvaro på Instagram enkel och rolig? Om ja, släng iväg ett DM! Jag vill gärna hjälpa dig med det!].

_________

AVANCERAD STRATEGI: Om du har ett erbjudande eller en produkt som kan vara bra för de som känner igen sig, kan du infoga information om det/den i din CTA. Exempel - Om du känner att du är förvirrad över hur du skapar content som är relevant och som inte tar massa tid att skapa, kolla min nya tjänst XYZ... ELLER Ladda ner min freebie om... ELLER annat som passar`,
        `Jag har sagt det förut och jag säger det igen...

[Sak 👏 här 👏 som 👏 du 👏 vill 👏 highlighta. EXEMPEL: Visa 👏 Mer 👏 Av 👏 Dig 👏 På 👏 Sociala 👏 Medier]

Varför? Eftersom [infoga anledningen varför du tycker att det är viktigt. EXEMPEL: Eftersom det hjälper dina följare att skapa en djupare relation till dig som i sin tur leder till mer tillit och försäljning!]

Och om du har svårt att göra detta? Så har jag tips om en hjälpande hand!

[Utveckla med ett inspirerande exempel eller ett råd. EXEMPEL: Nästa gång du tänker "hmmm kommer folk ens bry sig om detta, tänk på XYZ...]

Så kom ihåg, var inte [det du inte vill att de ska göra. EXEMPEL vara orolig för att dela mer av dig själv.], det kommer [din anledning till att de borde göra den här saken. EXEMPEL: Det kommer att bygga upp en stark verksamhet på lång sikt!]`,
        `3 sätt att [saker här som du vill att din drömkund undviker. EXEMPEL: undvika att glömma bort att ta hand om dig själv när du är mamma!]

Jag hör många [din drömkund. EXEMPEL mammor] säga att de [sak de kämpar med. EXEMPEL: känner att de inte har tid för sig själva och dessutom inte vet vad de skulle vilja göra] och jag vill bara säga att JAG FÖRSTÅR DIG.

Men vet du? Idag är jag här för att dela några riktigt bra tips för att se till att din kamp slutar här eftersom ingen ska behöva kämpa med det!

(SVEP för att se utförligare förklaringar i karusellen! 👉)

[Infoga tips/hint]

[Infoga tips/hint]

[Infoga tips/hint]

Hur många av dessa gör du redan och hur många var helt nya?

Känner du att dessa känns svåra att genomföra själv? Då hjälper jag dig gärna med det. Skicka ett DM så pratar vi mer om hur jag kan hjälpa just dig!`,
        `"[Infoga påstående här som din drömkund hör ofta. EXEMPEL: "Reels är det enda sättet att växa på Instagram"]

Räck upp en hand om du har hört detta tidigare. Eller hört folk säga:

[infoga påstående relaterat till det. EXEMPEL: "Statiska inlägg spelar ingen roll längre."] eller [infoga påstående. EXEMPEL: "ingen läser långa inlägg längre"] eller till och med [infoga påstående]

Vill du veta sanningen? [Infoga påstående här. EXEMPEL: Vad som verkligen betyder något är vad DIN målgrupp skulle älska att se hos dig]

[Utveckla och utbilda. EXEMPEL. Visste du till exempel att en nyligen genomförd studie visade att stories fortfarande är människors #1 sätt att ...?! Det här är varför...]

Dela i kommentarerna, är detta något du hör om eller har problem med? Eller skicka mig ett DM så kan vi prata vidare om ämnet!`,
        `En vänlig påminnelse idag - som [din drömkund. EXEMPEL: småföretagsägare, mamma, återhämtande perfektionist], [dela lite pepp. EXEMPEL: dina följare avgör inte din framgång]

Som en [upprepa din drömkund. EXEMPEL: soloprenör] bör ditt mål INTE vara att [infoga vanlig myt eller missuppfattning någon tror här. EXEMPEL: få fler följare eller nå något uppfunnet nummer i ditt huvud. Din försäljning kommer inte go through the roof bara för att du når den magiska siffran [infoga ditt målnummer här]]

Istället? Bör ditt mål vara att [korrigera dem här. Utveckla meddelandet så att det kommer att resonera med dem. EXEMPEL: nå din drömkund, skapa innehåll som lockar DEN [samtidigt som du hjälper den att lära känna, gilla och lita på dig] och sedan få dem UR din plattform och in i andra delar av ditt företag.]

Att fokusera på [sak de kämpar med: EXEMPEL: antalet följare du har] hindrar dig från att fokusera på vad som VERKLIGEN är viktigt. Och det är [sak som verkligen betyder något. EXEMPEL: att tala direkt till din drömkund.]

Och när du kommer ihåg det? [infoga den transformation de kan uppnå genom att följa ditt råd. EXEMPEL: Att växa det "numret" verkar inte så viktigt längre. Att bli sedd av DE RÄTTA människorna gör det, att ha DE RÄTTA budskapen för att visa dem att du är den rätta för dem och att tjäna dessa människor så bra du kan gör det 💛] Det är en game changer!`,
        `Att [“vara eller inte vara” - fast kopplat till din nisch. EXEMPEL: skriva långa inlägg] eller [XYZ: EXEMPEL: att inte skriva långa inlägg]. Det är frågan.

Och om det är en fråga du också har ställt dig själv, så kan jag meddela att jag har ett svar på frågan idag!

Jag tror att du bör [Infoga information här om vad du tror är det rätta sättet att göra för din drömkund. EXEMPEL: Skriv den längden du gillar bäst].

Varför? Därför [infoga mer resonemang för att backa upp detta, EXEMPEL: dina följare, din målgrupp och framförallt DIN drömkund gillar det DU gillar. De kommer tycka om dina långa texter om det är vad du gillar att skriva]

Har du hört något annan info om [ämne: EXEMPEL: längden på inlägg]? Berätta i kommentarerna!`,
        `NOTERING: Para detta med ett karusellinlägg med dina steg/punkter. Hooken på första sidan för karusellen kan vara:

[#] [ingredienser/steg/delar/sätt. EXEMPEL: 5 steg] till [något din drömkund längtar efter. EXEMPEL: att bli queen of budgetering för familjens ekonomi kom på rätt spår med ekonomin SNABBT!]

_____

Vill du [mål de vill uppnå. EXEMPEL: en enkel metod för att budgetera familjens ekonomi varje vecka utan stress eller tidskrävande timmar med siffror som gör dig förvirrad]?

Då kommer du älska det här inlägget! Här delar jag [# steg/tips] som kommer att [resultat de kommer att uppnå. EXEMPEL: få dig att budgetera på bara några minuter varje vecka].

Svep för att se dem!

Vilka tror du att du kommer använda för att hjälpa dig att nå [infoga din drömkunds mål. EXEMPEL: era budgetmål]?`,
        `"Hur kan jag [infoga vanlig varumärkes/nischrelaterad fråga eller en invändning någon har mot din tjänst eller produkt. Exempel - skapa min egen logga utan att den ser oproffsig ut?]"

Har du ställt dig själv den frågan tidigare? Om du svarade JA är det här inlägget för dig!

Om du vill [upprepa ämnet. Exempel: skapa din egen logga och få den att se riktigt proffsig ut], då [infoga detaljer. Exempel, har jag tre tips som hjälper dig med det].

[Infoga informationen]

Är det något du har funderat på tidigare eller har du en annan fråga om [ämnet]?

Låt mig veta nedan!`,
        `NOTERING: PARA IHOP MED CITAT-GRAFIK SOM: Du behöver inte ha allt klart. Allt du behöver göra är att ta det första steget.

_____

Okej, real talk. Hur ofta har du känt dig fastfrusen på plats eftersom det finns ett/en [mål/aspiration/önskan] du vill uppnå, men det verkar för stort, för skrämmande eller det finns vissa saker som gör att du känner dig osäker?

Så istället för att hoppa låser du fötterna i marken och rör dig inte en millimeter.

Kanske vill du [vad är deras mål?]

Kanske vill du [vad är ett annat möjligt mål?]

Eller kanske vill du [vad är ett annat möjligt mål?]

Vad det än är, vill jag att du ska veta att jag förstår det. Och jag förstår varför du känner att du är fastfrusen och står stilla.

Men let me tell you:

Du behöver inte ha allt klart för att [infoga vad de vill uppnå. EXEMPEL: helt förändra din hud. Vara den bästa mamman du kan vara. Börja en helt ny träningsriktning.]. Du behöver bara börja röra dig i den riktningen. Och precis som med allt annat, ju närmare du kommer det "slutliga" målet, saken, desto lättare blir det.

Så vill jag att du tar ditt första steg. Se det här som ditt tecken för det.

________

AVANCERAD STRATEGI: Om detta relaterar till ditt erbjudande kan du lägga till en CTA till det. EXEMPEL: Och om du behöver hjälp [infoga CTA. Detta kan vara att skicka ett DM för råd/snacka, boka ett samtal, köpa en produkt osv.]`,
        `3 SAKER JAG ÖNSKAR JAG VISSTE INNAN JAG BÖRJADE [situation din drömkund är i/relaterar till. EXEMPEL: LÄRA MIG ETT ANNAT SPRÅK]

När du först [upprepa situationen. EXEMPEL: börjar lära dig ett nytt språk, börjar gå till ett gym, börjar amma, börjar sälja dina tjänster på Instagram] kan det vara [känsla. EXEMPEL: nervöst och samtidigt riktigt spännande]

Du är [situation de är i. Vad driver dem? EXEMPEL: taggad på att lära dig dessa nya färdigheter men orolig för den tid det kommer att ta eller om du överhuvudtaget kommer att kunna klara av det].

Och om du just nu nickar med huvudet och håller med, vill jag att du ska veta att jag också kände precis så! Och nu förmedlar jag några av de saker jag önskar att någon hade berättat för mig när jag var i de skor du är i idag!

1 [infoga tips, fakta, råd eller slå hål på en myt]

2 [infoga tips, fakta, råd eller slå hål på en myt]

3 [infoga tips, fakta, råd eller slå hål på en myt]

Finns det något du skulle lägga till den här listan eller något som resonerar med dig? Jag skulle vilja veta nedan 💛`,
        `PSSSSST: Har du också funderat på detta? 👇

En fråga jag ofta får är [infoga din målgrupps vanligaste fråga. EXEMPEL: hur man behåller motivationen när entusiasmen för hälsoutmaningen börjar försvinna?]

Så idag delar jag detaljerna så att du inte längre behöver undra. Och kanske är det bästa att svaret är mycket enklare än du tror!

Faktum är att jag till och med kommer att bryta ner det i 3 [steg/tips] för dig: [Ge 3 x enkla steg/tips/ för din IC att ta för att svara på deras fråga/lösa deras problem. Detta kan också vara i ett karusellinlägg!]

1 [Infoga tips/steg]

2 [Infoga tips/steg]

3 [Infoga tips/steg]

Fick du svar på din undran? Finns det något annat du funderar över [infoga ämne. EXEMPEL: hur man utmanar sitt mindset] också? I så fall, låt mig veta i kommentarerna så hjälper jag gärna <3`,
        `NOTIS: Detta kan antingen handla om något inom din bransch ELLER om din egen tjänst eller produkt. Till exempel kan du göra ett inlägg om "varför du bör köpa appen captions för att enkelt lägga till undertexter på dina videos" eller "varför du bör anställa en professionell marknadsförare i ditt team".

Får jag ställa en ärlig fråga? Har du någonsin tittat på [produkt, tjänst eller erbjudandetyp] och tänkt för dig själv, "Äsch, jag behöver inte betala för det! Jag kan spara pengar genom att [infoga ett affärserbjudande. EXEMPEL: skapa min egen produktfotografering med din pålitliga iPhone]?"

Om du känner så vill jag bara säga att jag också ÄLSKAR att göra saker själv inom mitt [liv, företag, situation], men det finns tre bra skäl till varför att använda en [tjänst/produkttyp] faktiskt kan SPARA dig pengar på lång sikt.

1: [infoga fördel]

2: [infoga fördel]

3: [infoga fördel]

Så medan jag är helt för att spara pengar där vi kan, tycker jag att nästa gång du tänker på [ämnet], kom ihåg att det finns vissa saker värda att spendera pengar på.

Och detta är en av dem. 🙌

AVANCERAD STRATEGI: Om detta relaterar till ditt företag eller erbjudande kan du lägga till en CTA. Och om du ÄR redo att arbeta med en professionell för att [fördel/transformation/resultat] då [infoga CTA. Detta kan vara att skicka ett DM för råd/snacka, boka ett samtal, köpa en produkt osv.]`,
        `NOTIS: Börja med en vanlig missuppfattning/myt som faktum som kommer att få din drömkund att sluta scrolla. Detta kan vara din grafik eller den första raden i din bildtext. EXEMPEL: PS: Terapi är bara för människor med "riktiga" problem.

_*HOST_*, nu när jag har din uppmärksamhet - Jag är här för att officiellt avslöja detta påstående som MYT!

Låt mig lägga fram fakta för dig ifall du har undrat... [Infoga fakta som avslöjar myten. EXEMPEL: Du kanske tror att för att gå till en terapeut måste du ha en diagnostiserad mental/psykologisk störning eller kämpa överväldigande, och det är helt enkelt inte fallet. Det finns SÅ många anledningar till att människor går till terapeuter och så många sätt som terapi kan gynna ditt mående och mentala hälsa, och här är de!]

1. j
2. .
3. j

[Backa upp ditt påstående med bevis, som ett citat. EXEMPEL: Som Ryan Howes, Ph.D och klinisk psykolog förklarar, "Människor går till terapi för att hantera händelser, relationer, stress, sorg, för att ta reda på vem de är och lära sig att leva livet till fullo. Det finns ingen skam i att vilja ha ett bättre liv."]

Har du någonsin fått höra denna myt tidigare eller funderat över den själv? Låt mig veta nedan.

Och om du har några frågor eller behöver lite råd om [myten du slog hål på här. EXEMPEL: om du personligen bör eller vill söka terapi], är det bara att glida in i mina DM eller skicka ett mejl. Jag finns här för dig!`,
        `Hur gör du [något din drömkund värdesätter eller önskar. EXEMPEL: för att återhämta dig?]

Gör du [olika sätt att uppnå det: läser du varje kväll innan du går och lägger dig? Eller kanske tappar upp ett bad och dricker ett glas vin? Eller något helt annat]?

För mig uppnås [ämnet] genom att [infoga något du gör som relaterar till ditt erbjudande. EXEMPEL: handlar helt om att sätta mina avsikter för veckan och förbereda måltider så att det inte blir några oplanerade snedsteg].

Se detta som min påminnelse till dig OCH till mig själv för att se till att vi [göra en uttalande som kommer att inspirera din publik. EXEMPEL: gör vad vi än värdesätter när det gäller återhämtning, eftersom vi inte kan “hälla ur en tom kopp” och behöver prioritera oss själva].

Berätta hur du [ämnet] i kommentarerna för att hålla dig själv accountable och inspirera andra!`,
        `Okej, så jag var IDAG år gammal när jag fick reda på det här, så jag delar med mig till dig ifall du inte visste...

Visste du att [dela bransch-/företags-/professionell insikt. EXEMPEL: att det finns en webbplats online som låter dig följa XYZ? Och att du kan använda den helt GRATIS!]

Faktum är [utveckla denna användbara ledtråd, tips, upptäckt, ämne]

Är detta nytt för dig också? Eller har jag sovit under en sten?`,
        `Om det är en sak jag skulle kunna berätta för mitt tidigare jag om [ett ämne relaterat till din drömkund som de också står inför nu. EXEMPEL att ge sig ut på en resa för att lära sig hur man XYZ], skulle det vara [infoga lärande som är relaterat till drömkund. EXEMPEL: att lära sig att sakta ner och inte bry sig om småsaker].

Det här kanske låter uppenbart, men om jag hade vetat att [utveckla ämnet. EXEMPEL: försöka posta själv varje dag på Instagram samtidigt som jag hjälper mina klienter varje dag] skulle leda till [infoga bieffekt av dålig vana. EXEMPEL: allvarlig utmattning och brist på kreativitet] så skulle jag förmodligen ha gjort vissa saker annorlunda.

Så hur har jag lärt mig av mina tidigare beteenden? [infoga vad du har lärt dig. EXEMPEL: Nu ser jag till att jag tar en dag i veckan och planerar allt för mig själv så jag kan fokusera på mina klienter resten av veckan]

Detta hjälper mig att vara en bättre [infoga resultat EXEMPEL: coach och nu kan jag XYZ utan XYZ] - för att inte tala om [infoga något relaterat. EXEMPEL: Jag är nu mycket mer närvarande i mina klienters arbete!]

Så detta är min love note till mitt tidigare jag.

Kan du relatera? Vad är något du skulle berätta för ditt tidigare jag?

[Valfritt CTA om du har ett erbjudande, freebie, lösning som relaterar till detta:]

OCH FÖRRESTEN, PS: om du, precis som jag, också behöver lära dig hur man [infoga lärande. EXEMPEL: planerar in tid för dina egna grejer], gå till länken i min bio för att se hur [infoga erbjudande. EXEMPEL: jag kan hjälpa till att lätta din börda genom att ta på mig några av dina vardagliga sysslor!]`,
        `En sak jag får frågor om hela tiden

[Infoga fråga/uttalande här. EXEMPEL: hur är det möjligt att få allt att gå ihop som soloprenör utan att glömma något viktigt.]

Vill du veta hur jag tänker kring detta? Let me tell you.

[Ditt påstående här: För det första, låt oss släppa tanken att vi som soloprenörer behöver 'göra allt nu' och skapa en plan för att 'göra detta, göra det sedan, göra detta, före när. För den känslan att allt måste vara klart igår? Är inte hälsosam. Och det orsakar en känsla av överväldigande som faktiskt kommer att sakta ner dig och inte göra dig produktiv.]

[Ditt andra påstående. EXEMPEL: För det andra? Här är ett tips för dig...]

Det VIKTIGASTE jag vill att du ska ta med dig? Är [Infoga den mest effektiva/positiva lärdomen som är relevant för din drömkund.]

Vad är dina tankar? Är detta något du har frågat dig själv, och resoneras något av dessa tips med dig?`,
        `PSST, det här är för alla [infoga drömkund. EXEMPEL: nybörjar-yogis] där ute!

Har du någonsin undrat hur [infoga drömkunds smärtområde/FAQ. EXEMPEL: i hela världen du ska lyckas andas medan du gör alla dessa komplexa positioner? Sa hon just andas ut nu? Varför andas jag in? Hur synkar jag det här? Omg, hon har gått vidare till nästa pose.]

Är du redo?

[infoga tips/instruktioner här. EXEMPEL: Öva på att andas in djupt genom näsan, dra ihop baksidan av halsen något och andas sedan ut genom näsan. Gör detta långsamt och med avsikt. Och som en tumregel, försök att andas ut när du böjer dig framåt och andas in när du öppnar bröstet.]

VARFÖR är detta viktigt?

[Infoga varför detta är viktigt. EXEMPEL: Stadigheten i denna andning som praktiseras genom asana förankrar ditt sinne, kropp och själ i nuet.]

Berätta för oss om detta fungerar för dig [infoga drömkunds situation. EXEMPEL: under ditt nästa yogapass.]`,
        `NOTE: Para med en karusell!

---

VAD DU BEHÖVER VETA INNAN [infoga hook/ämne här som kommer att fånga din drömkunds uppmärksamhet eftersom det är i deras tankar. EXEMPEL: DU BÖRJAR SÄLJA PÅ INSTAGRAM]

(Spara detta inlägg! 💾)

Okej, [infoga din drömkunds identifikation här. EXEMPEL soloprenörska]. Så tiden har kommit och du funderar på [infoga ämne här. EXEMPEL: hur du ska börja sälja på Instagram].

MEN [infoga problemet de står inför eller kan stöta på. EXEMPEL: Det kan kännas svårt/jobbigt/tjatigt]

Det är därför jag har satt ihop en hjälpsam guide för att hjälpa dig att [beskriv utfallet de kommer att uppnå genom att läsa guiden. EXEMPEL: veta exakt hur du ska skriva dina säljande inlägg!].

Swipa för att se mina tips och spara dem så att du har dem till hands när det behövs!`,
        `Har du någonsin funderat på vilka frågor du bör ställa dig när du [situation. EXEMPEL ska planera ditt content för veckan??]

Nåväl, här är en startpunkt för dig:

[Q1 EXEMPEL: Fråga dig själv ‘vad vill jag prata om i veckan?’. Då vet du vilka tjänster du ska promota.]
[Q2 EXEMPEL:]
[Q3 här]

Dessa tre frågor kan verkligen guida dig till [upprepa utfall/önskan: göra hur du ska planera ditt content för veckan för att sälja men också SERVE ditt community, utan att behöva stressa för vad du ska posta varje dag].

Om det här hjälpte dig tänka om lite kring planeringen av ditt content, då kanske du skulle vara intresserad av [CTA här. EXEMPEL: att ladda ner min gratis guide till att planera ditt content bättre eller gå min kurs i planering för att se exakt hur jag gör för att alltid ligga flera veckor före (utan att tappa flexibiliteten)]. Gå till [var vill du skicka dem? EXEMPEL: länken i vår bio för att ladda ner/gå med nu!]`,
        `[3 x ord, känsla, idé, något som din drömund tycker är förvirrande eller osäkert om din produkt, tjänst, nisch. EXEMPEL: Hållbart. Miljövänligt. Ekologiskt]. Är det någon annan som är förvirrad?

Om du stirrar på din skärm och undrar vad sjutton dessa saker egentligen betyder (trots att jag vet att du ser dem hela tiden), är jag här för att ge dig en liten hjälpande hand för att verkligen förstå vad dessa saker betyder... och hur de kan hjälpa dig!

[infoga ord + kort beskrivning. EXEMPEL: Hållbart betyder XYZ, så när du köper hållbart kan du vara säker på att XYZ.].

[infoga ord + kort beskrivning. EXEMPEL: Miljövänligt är lite annorlunda och betyder att XYZ.].

Och slutligen [infoga ord + kort beskrivning].

Och om detta fortfarande gör dig lite förvirrad, oroa dig inte – det är bokstavligen det [jag/vi/service name] är [här för/skapade X för]. Tveka inte att skicka ett meddelande till mig om du har några frågor, och jag kommer mer än gärna [hjälpa till, besvara dem, vägleda dig].

[Valfri CTA]

En liten påminnelse om att min [workshop, e-bok, webbinarium, blogg, FAQ] täcker detta och på ett djupare plan. Gå till [länk i bio, webbplatsen] för att [ladda ner, prenumerera, skicka e-post till oss].`,
        `Pssst: du kommer vilja spara det här inlägget för senare 👇

5 [ämne här som relaterar till din drömkund. EXEMPEL: planeringstips. SEO-förbättring] som du kan göra idag för att hjälpa din [vad gör aktiviteterna för din drömkund? EXEMPEL: dig vara konsekvent på Instagram] på under 5 minuter.

Så här gör du 💪

AKTIVITET #1: [infoga aktivitet. EXEMPEL: Avsluta din dag genom att skriva ner tre saker du var tacksam för den dagen. Att hålla en tacksamhetsdagbok ökar din positivitet och leder till mindre stress och en gladare dig. En extra bonus med att göra detta till din sista aktivitet för dagen? Det hjälper faktiskt dig att sova bättre! Säg inte att jag aldrig gett dig något 😉]

AKTIVITET #2: [infoga aktivitet]

AKTIVITET #3: [infoga aktivitet]

AKTIVITET #4: [infoga aktivitet]

AKTIVITET #5: [infoga aktivitet]

Berätta i kommentarerna om du gör någon av dessa aktiviteter och hur de hjälper dig med [infoga ämne här. EXEMPEL: att posta konsekvent].`,
        `Räck upp en hand om du är ett fan _host_ obsessed _host_ (insert något din IC vill ha: exempel: av att använda karuseller för att boosta ditt engagemang och räckvidd)

Sammmmmmmme.

"Men HUR kan jag [adressera det vanliga problemet: göra dem snabbare, få bättre resultat, få dem att sticka ut]?" undrar du kanske?

Frukta inte, I got you covered.

**STEG 1:** Se till att du behåller en konsekvent look för dina karuseller som överensstämmer med ditt varumärke! Detta är det FÖRSTA jag täcker i min planerings-masterclass!

**STEG 2:** Skapa bildtexter som inte bara berättar en historia utan också främjar engagemang. Varje gång du skriver en bildtext, se till att du XYZ.

**STEG 3:** Infoga bildtexter i varje inlägg där de är lämpliga. Detta kan öka din karusells effektivitet avsevärt genom XYZ.

Och framför allt, kom ihåg, karuseller är bara en del av din övergripande strategi, men de är en viktig del!

🚀 Redo för en extra hjälpande hand för att skapa mallar du bara kan kopiera och återanvända? Kolla på min planerings-masterclass, du får några extra bonusar 🚀`,
        `**NOTE. Du kan lägga till dessa tips i en karusell om du önskar!**

3 saker som hindrar dig när det kommer till [ämne eller mål som din drömkund vill uppnå. EXEMPEL: att hitta din sanna inredningsstil]. (och hur du löser dem!)

Absolut, du kan ha alla "how to"-tips i världen för att uppnå [ämne. EXEMPEL: ett vackert hem som blir din lugna plats...]

MEEEEEEN om det finns saker som står i vägen? Ja, då behöver du flytta på dessa hinder först för att kunna uppnå [resultat. EXEMPEL: hemmet som känns som en dröm]. SÅ, idag ska vi dyka djupt in i vad som hindrar dig från att komma dit du vill vara och lösa dessa problem, SNABBT.

Hinder #1: [Infoga problem. EXEMPEL: Du vet inte tillräckligt om vad du verkligen vill för att kunna gå vidare] FIX #1: [Infoga lösning och kontext. EXEMPEL: Utan att verkligen veta hur du faktiskt vill att ditt hem ska kännas, kan du inte börja designa hur det ser ut. För att övervinna detta är det viktigt att fråga dig själv XYZ].

Hinder #2: [Infoga problem] FIX #2: [Infoga lösning och kontext]

Hinder #3: [Infoga problem] FIX #3: [Infoga lösning och kontext]

Känner du igen dig i någon av dessa? Kommer du försöka vidta åtgärder för att lösa något av ovanstående problem och komma ur det “låsta läget"?`,
        `Så, du vill ha [lägg till en önskan som din tjänst hjälper till att uppfylla. EXEMPEL: en profil som jobbar för dig medans du sover], men du vill inte [lägg till en invändning från din målgrupp. EXEMPEL: lägga en hel vecka på att researcha hur en bra profil ser ut och innehåller].

Jag förstår. Jag lovar.

Och vet du, [adressera invändningen med resonemang och ditt VARFÖR. Hjälp dem att se varför de inte kommer att uppleva detta, eller ändra deras uppfattning. EXEMPEL: det är exakt därför jag har tagit fram Insta Boost, för jag vet att ditt företag är OTROLIGT och du förtjänar att ha en profil som jobbar för dig, medans du spenderar din tid på bättre saker än att älta vad som faktiskt ska stå eller inte.]

Så om detta har hindrat dig, var medveten om att [resultatet. EXEMPEL: en profil som drar in både följare och kunder] är uppnåeligt.

Vill du prata mer om [resultatet]?

[CTA. Skicka ett DM eller gå in på mitt konto för att läsa mer om vilka misstag du inte får göra och vilka tips du kan applicera DIREKT för att göra din profil magnetisk!`,
        `NOTE: Para ihop denna bildtext med en grafik som gör ett roligt/chockerande påstående som du avser att motbevisa. EXEMPEL: INGEN LÄSER VILLKOREN, SÅ ORKA INKLUDERA DEM! ...

________

eeeeeh SKOJAR! ... Men jag fick dig att titta, eller hur.

Här är sanningen. [ämne. EXEMPEL: Villkor och bestämmelser blir ofta bortglömda/ignorerade/får dåligt rykte men DE ÄR så viktiga för ditt företag].

Låt mig berätta varför:

[Förklara varför påståendet är fel. EXEMPEL: Villkor och bestämmelser för ditt företag kan vara skillnaden mellan din företagssäkerhet och konkurs. Detta beror på att ...]

Det är så viktigt att [hur man rättar till påståendet. EXEMPEL: du pratar med en juridisk professionell för att utforma villkor och bestämmelser som är relevanta för ditt företagserbjudande, så att du inte bryter mot någon klausul du inte ens visste att du hade!]

Visste du detta, eller är det nyheter för dig?

OCH PS: Om du vill komma i kontakt angående [ämne här. EXEMPEL: skapa vattentäta villkor och bestämmelser för ditt företag], [infoga CTA som att skicka mig ett meddelande idag, gå till länken i min bio för att boka ett gratis upptäcktsmöte för att diskutera DINA juridiska behov]`,
        `REAL TALK fyllt med massor av kärlek: om du inte [infoga något du vill att din målgrupp ska göra. EXEMPEL: förbereder din hud med primer innan du applicerar din bas] gör du det fel.

Okej, men varför?

[infoga ämne. EXEMPEL: Din hud] + [infoga produkt eller tjänst som hjälper din målgrupp med ämnet. EXEMPEL: primer] = [infoga positivt resultat av de två elementen. EXEMPEL: jämn hud och smink som håller hela dagen!]

✅ [Infoga anledning till varför din målgrupp bör göra detta. EXEMPEL: Visste du att förutom att hjälpa till att hålla ditt smink på plats hela dagen minskar primer också mängden produkt du använder? Spara pengar genom att spendera några extra, vänner!]

✅ [Infoga anledning till varför din målgrupp bör göra detta.]

✅ [Infoga anledning till varför din målgrupp bör göra detta.]

✅ [Infoga anledning till varför din målgrupp bör göra detta.]

✅ [Infoga anledning till varför din målgrupp bör göra detta.]

Här är några enkla sätt som du kan [infoga ämne. EXEMPEL: hitta rätt primer för din hud]:

Steg 1: [förklara hur din målgrupp kan få det resultat du lovar i enkla steg. EXEMPEL: Ta vårt onlinequiz (länk i bio!) för att ta reda på vilken hudtyp du har. Detta är viktigt eftersom varje hudtyp kommer att behöva en annan typ av primer. Till exempel, om du har fet hud, skulle en mattande primer fungera bäst för dig!]

Steg 2: [förklara hur din målgrupp kan få det resultat du lovar i enkla steg.]

Steg 3: [förklara hur din målgrupp kan få det resultat du lovar i enkla steg.]

Så, se detta som ditt tecken att [sammanfatta tipset. EXEMPEL: alltid använd primer innan du applicerar ditt mink] och när du gör det? Skicka mig ett DM och låt mig veta skillnaden det gör!`,
        `Sanningens ögonblick: [infoga ett scroll-stoppande påstående eller slå hål på en myt. EXEMPEL: du behöver inte bara använda 3-5 hashtags per inlägg]. #realtalk

För att [utveckla vidare. EXEMPEL: även om jag inte tvivlar på att den strategin kommer att fungera för vissa människor, vad du verkligen behöver göra... Är att hitta hashtag-strategin som fungerar FÖR DIG!].

[Utveckla vidare. EXEMPEL: Såhär, jag vet att det finns mycket motstridig information där ute. Och jag kommer inte att lägga till till det. Vad jag kommer att göra? Är att ge dig inspiration att testa olika strategier för ditt eget företag och hitta vad som fungerar för just dig!]

[Sammanfatta. EXEMPEL: Så om du har varit förvirrad, trött på motstridig information eller om du har påbörjat en strategi eftersom du trodde att du var tvungen men det fungerar inte för dig, är detta din LOVE NOTE att testa, prova och ta reda på vad som är bäst för DITT fantastiska företag].

VALFRI CTA: Om denna “sanningens ögonblick” relaterar till något i ditt företag som du kan lägga till en CTA för, lägg till det här. Detta kan vara en gratis nedladdning, skicka ett DM eller flytta människor längre in i din säljresa.`,
        `FÖRSLAG. Du kan lägga till dessa tips i ett karusellinlägg om du vill!

_________________________________________________________________________________

VIKTIGA TIPS FÖR ATT [infoga ämne. EXEMPEL: SKAPA DEN PERFEKTA KARUSELLEN]!

Okej, jag har fått så många frågor om [ämne. EXEMPEL: hur man gör en bra karusell] och tro mig, jag vet hur bra [resultat. EXEMPEL: det känns när man hittar DEN GREJEN som fungerar klockrent i marknadsföringen]!

Så idag delar jag med mig av [vad delar du med dig av: Exempelvis: fem olika tips för hur du bygger upp din karusell] [infoga resultatet som din målgrupp vill ha. EXEMPEL: så att du aldrig fastnar i ditt skapande igen].

1 [Infoga tips eller dela med dig av]

2 [Infoga tips eller dela med dig av]

3 [Infoga tips eller dela med dig av]

4 [Infoga tips eller dela med dig av]

5 [Infoga tips eller dela med dig av]

Berätta, hur brukar du tänka när du bygger upp dina karusellinlägg?`,
        `Mitt hemliga knep för att (infoga din drömkunds dröm här, exempel: skapa regelbundet, högkvalitativt och fyllt-med-energi-och-personlighet-content?)

Är att (skriv sammanfattning av tips här, exempelvis: göra det till min #1 PRIORITET varje vecka. Jag bokar hela måndagarna för mig själv så att min egen marknadsföring hamnar allra först på min att-göra-lista.)

Och om DU [infoga en pain point eller begär som det här tipset kommer hjälpa dem nå. exempel: kämpar med att posta konsekvent eller med hög kvalitet kanske du vill göra samma sak] ASAP.

Och här är varför:

[Addera kontext och förklara varför det är viktigt och hur det hjälper att nå resultat: Exempel: Innehållet hjälper ditt företag framåt. Innehåll hjälper dig sälja. Innehåll skapar community. Och alltför många ser det som en tråkig syssla eller som en uppgift som "jag gör det efter att jag har fått det andra gjort först" istället för att prioritera det och se det som den fantastiska möjlighet det är för att skapa framgång.]

För mig? [Utveckla hur detta har hjälpt mig och dela min expertis. EXAMPLE: Innehåll är det första jag gör på en måndag. Jag har en tidsram inbokad i min kalender för mina inlägg + stories, epost och telegram-meddelanden, så att jag aldrig hamnar efter. Och det eldar också upp mig inför veckan! Det sätter tonen]

Så om du vill [återupprepa det de önskar. EXAMPLE: Närvara på det bästa sättet och posta det bästa innehållet du kan för att bygga det bästa företaget du kan]...

Rekommenderar jag starkt att lägga till detta som en prioritet i din dag/vecka/företag.

Är det något du tror att du kommer att prova?`,
        `PUBLIC SERVICE REMINDER

Det är dags att släppa taget om [infoga ett hinder din drömkund kämpar med. EXAMPLE: det sätt du TROR att människor ser dig] och börja [projicera hur du VILL att människor ska se dig].

Lättare sagt än gjort, säger du? Jag förstår.

Men det är uppnåeligt. Och såååå värt det. Och här är hur.

Börja med att [infoga hur din drömkund kan börja implementera. EXEMPEL: titta på allt du redan har uppnått. Och kom ihåg vem som gjorde det. Hint: det är du!]

[Utveckla mer om ditt tips]

Ibland är en snabb lösning inte alltid svaret.

Om du vill se lite mer [infoga känsla din drömkund längtar efter. EXAMPLE: självförtroende] i ditt liv, [infoga CTA. EXEMPEL: skicka ett DM, skicka mig ett mejl, prenumerera på mitt nyhetsbrev, anmäl dig till min nya XYZ-kurs/produkt]!`,
        `[infoga en problemfras som din idealkund skulle kunna säga. EXEMPEL: "Jag vill bli mer hälsosam, men jag har helt enkelt inte tid att gå till gymmet"]

Säger du själv detta? Du är inte ensam!

Här är saken: [Infoga ärlig diskussion, motivation eller utbildande info kring ämnet. EXEMPEL: En mer hälsosam, lyckligare du skapas inte alltid över en natt - även om vi önskar att det vore så 😂 Men med rätt inställning kan du börja göra små förändringar som ökar dina chanser att nå dit även med lite tid]!

Här är 5 sätt att [infoga ämne. EXEMPEL: öka din dagliga rörelse] utan att [infoga något din idealkund skulle vilja undvika. EXEMPEL: ta flera timmar av din dag].

[infoga tips. EXEMPEL: När du behöver ringa någon, sträck på benen och ta en promenad medan du pratar. Även om det bara är i 2 minuter!]

[infoga tips. EXEMPEL: Dela upp din lunchtid i hälften och spendera första halvan med att få in lite rörelse. Ta en promenad, en lätt joggingtur, en 30-minuters gympass. BONUS: Belöna dig själv och lyssna på din favoritpodcast eller ljudbok medan du gör det. Du kanske till och med börjar se fram emot det!]

[infoga tips]

[infoga tips]

[infoga tips]

OCH PS - Om du vill ha fler strategier som hjälper dig att [infoga ämne. EXEMPEL: lägga till mer rörelse i din dag], gå till länken i bio för att ladda ner min gratis guide om ämnet, prenumerera på mitt nyhetsbrev för mer information, besök hemsidan/bloggen.`,
        `5 saker jag önskar att någon hade berättat för mig när jag började med [ett ämne direkt relaterat till din drömkund. Exempel: att skriva innehåll för sociala medier, på min viktminskningsresa, förberedelser inför moderskapet].

[Infoga inspirerande tips/pepp här. EXEMPEL: Du kommer att få SÅ mycket information om moderskapet. Ta allt med en nypa salt och hitta det som fungerar för dig.]

[Infoga djup eller inspirerande element här]

[Infoga djup eller inspirerande element här]

[Infoga djup eller inspirerande element här]

[Infoga djup eller inspirerande element här]

Skulle du lägga till något på den här listan? Eller kände du igen dig i någon av dessa?`,
        `Någonsin känt att du bara 'tar det som det kommer' när det gäller [infoga ämne. EXEMPEL: planera din tid, skapa content till din Instagram]?

Om så är fallet kommer du vilja spara detta inlägg, för här är EXAKT hur jag skulle rekommendera att lägga till lite struktur - och mycket mer framgång - för [ämnet - din tidsplan, ditt contentskapande].

För det första, [infoga ditt råd/tips].

Sedan, [infoga ditt råd/tips].

Slutligen, [infoga ditt råd/tips].

Att ha detta [system/process/struktur] på plats kan hjälpa dig att [infoga en fördel. EXEMPEL: inte bara skapa content med lätthet utan också sälja regelbundet så att du kan tjäna mer pengar i ditt företag!].

OCH PS - om du vill ha ytterligare stöd när det gäller [ämnet. EXEMPEL: planera in tid för att få till en bra skapandeprocess], [infoga CTA. EXEMPEL: Spana in min freebie om XYZ/ skicka ett DM och låt mig veta vad du kämpar med, så ska jag se om jag kan hjälpa!]`,
        `Om du känner mig väl eller om du har varit här ett tag VET du att jag är en stor fan av [infoga något du gör som din IC kan uppfatta som värdefullt eller som skulle hjälpa dem. EXEMPEL: att planera för att kunna marknadsföra mig konsekvent!].

Och jag vill dela några av mina bästa tips idag ifall du också vill experimentera med detta och vill ha en hjälpande hand.

[TITEL PÅ TIPS 1. EXEMPEL: ANVÄND ETT PLANERINGSVERKTYG]. [Infoga råd. Exempel: Det kanske inte är någon nyhet, de flesta gör nog det, men använd det för att dels planera in tid för DIG, men också faktiskt planera när saker ska publiceras!]

[TITEL PÅ TIPS 2] [Infoga råd]

[TITEL PÅ TIPS 3] [Infoga råd]

Är något av detta nytt för dig? Eller om du är en fan, skulle du lägga till något?`,
        `En av de största sakerna jag ALLTID blir ombedd att hjälpa till med

Är [infoga en FAQ - antingen om ditt företag, din resa eller ett ämne. EXEMPEL: hur höll du dig till din måltidsplan på din viktminskningsresa?” Eller “hur hittar du människors varumärkesröster när du skriver deras innehåll åt dem?”]

Och mitt svar? Är detta:

[Infoga svar]

Så om detta är något du upplever just nu, hoppas jag att det här kan hjälpa DIG på din resa. Och om du har några andra frågor vet du att min DM alltid är öppen!`,
        `MÄRKVÄRDIGT TIPS FÖR ATT BLI BÄTTRE PÅ [ÄMNE. EXEMPEL - COPYWRITING] PÅ INGÅNG!

Visste du att [infoga vana eller övning eller erfarenhet här. EXEMPEL titta på TV] kan göra dig [infoga resultat. EXEMPEL: till en bättre copywriter?]

Jag vet att det kanske låter lite konstigt, men lyssna på mig.

Du förstår, [infoga anledningen till varför denna sak kan hjälpa någon att uppnå något]

Så över till dig. Prova detta själv och låt mig veta om du kan se fördelarna eller förändringen.`,
        `Är du en [peka ut något som din drömkund kan relatera till. EXEMPELvis en prokrastinerare]?

Finns det tillfällen när du [infoga en relaterbar situation din drömkund kämpar med. EXEMPEL: börjar en uppgift, bara för att sedan hitta alla möjliga sätt att inte slutföra den. Eller vet att du behöver påbörja något men når inte ens dit alls]?

I så fall kan det [pain point som detta kan orsaka. EXEMPEL: hindra dig från att nå dina mål].

Och jag är här för att hjälpa.

[Infoga information och stöd kring ämnet. Dela med dig av värdefull information som kan hjälpa din drömkund att övervinna detta.]

Så idag ger jag dig en utmaning: att implementera ovanstående för att hjälpa DIG att uppnå [infoga drömkunds önskat resultat. EXEMPEL: dina fantastiska mål på ett snabbare sätt utan att prokrastineringen står i vägen].

Och om detta tips har hjälpt dig? Då kan du också vara intresserad av [CTA här. EXEMPEL: ladda ner min gratis guide för att planera din Instagram bättre]. Gå till [var vill du skicka dem? EXEMPEL: länk i min bio för att ladda ner nu!]`,
        `NOTE: Detta inlägg är ett rekommendationsinlägg. Idealiskt sett kommer det att handla om hjälpande teknik som t.ex apprekommendationer, men det kan omformuleras för produktrekommendationer om det fungerar bättre för ditt företag och din IC.

Tipsen kan också levereras i karusellformat.

_____

ATTENTION. Du kommer vilja spara detta inlägg för senare!

Jag vet att [infoga ämne. EXEMPEL: skapa ditt innehåll på sociala medier, hålla ditt kök rent och organiserat] kan vara [infoga drömkundens frustrationskänslor. EXEMPEL: frustrerande och tidskrävande].

[infoga flera saker som gör ämnet tidskrävande, svårt eller i behov av produkter/teknik för att underlätta processen. EXEMPEL: Från att skriva bildtexter till att skapa grafik och schemalägga inlägg på sociala medier], det finns så många element som ingår i [infoga ämne. EXEMPEL: att skapa dina inlägg på sociala medier].

Det är därför jag har lagt TIMMAR på att forska efter rätt [infoga rekommendationstyp. EXEMPEL: teknik, appar, produkter] för att hjälpa [vad hjälper rekommendationen med? EXEMPEL: påskynda mina processer, planera och dela innehåll på sociala medier, skapa iögonfallande marknadsföringsmaterial].

Och jag kommer att dela dem med dig!

Här är mina topp 3 [infoga rekommendationstyp. EXEMPEL: appar] som jag använder DAGLIGEN, som hjälper mig [XYZ].

[infoga rekommendation - hur det hjälper. EXEMPEL: Canva - det här är en grafisk designapp riktad till icke-designers för att skapa snygg grafisk design enkelt. Jag använder bokstavligen det för allt från inlägg på sociala medier till visitkort och flygblad! Det är så lätt att använda.]

[infoga rekommendation - hur det hjälper]

[infoga rekommendation - hur det hjälper]

Är något av dessa redan på din måste-ha-lista? Vad är dina favorit [infoga rekommendationstyp. EXEMPEL: appar] när det gäller [infoga ämne. EXEMPEL: att skapa ditt innehåll på sociala medier]?`,
        `PSST... Vill du veta en liten hemlighet om hur jag [infoga ämne. EXEMPEL: aldrig missar ett steg i min nattliga hudvårdsrutin]?

Jag förespråkar alltid en backupplan.

När du är [infoga drömkunds problem. EXEMPEL: på språng, upptagen, känner dig nedstämd, begränsad], och saker inte går som planerat, är det bästa sättet att ha en pålitlig backupplan för att hålla [infoga hur reservplanen hjälper IC. EXEMPEL: dig själv ansvarig, din rutin på plats, ditt tankesätt i schack].

Här är min:

[infoga din reservplan relaterad till drömkundens problem. EXEMPEL: Jag har ALLTID en förpackning med nedbrytbara, veganska sminkdukar i min vardagsväska så att jag aldrig blir överraskad av att behöva lämna sminket på mig över natten eller på gymmet - usch!]

Har du en pålitlig backupplan som är beprövad och testad? Berätta för oss i kommentarerna!

[Valfri CTA] Och om du funderar på att testa Min lilla hemliga plan i ditt liv, kan du [infoga CTA. EXEMPEL: köpa XYZ-produkt genom länken i bio, anmäla dig till mitt nyhetsbrev för fler tips och tricks, boka in dig för en coaching-session om tankesätt nu].`,
        `Gör [A + B] att du känner dig [XYZ eller ZYX]? [infoga två bidragande faktorer som slutar i ett problematiskt känsla för din drömkund. EXEMPEL: Gör stressiga vardagar + vetskapen att behöva laga en nyttig middag att du känner dig lat eller omotiverad? Gör pasta + bröd att du känner dig uppblåst? OBS: du kan använda flera av XYZ + XYZ = XYZ problem i följd för effekt]

Tro mig, jag förstår. Därför har jag lagt lång tid på att leta efter lösningen på just detta.

Och gissa vad? Jag kan ge dig svaren på hur du vänder problemet ⬇️

[infoga tips. EXEMPEL: Vardagskvällarna är till för att landa och återhämta sig efter jobbet, så det är ingen överraskning att din kost känns jobbig att behöva tänka så mycket på. Vem vill tänka på MACROS eller grönsaksintag när man helst bara vill vila upp sig?! Det är av denna anledning som det är så viktigt att planera sina måltider! Om du vet att du ska äta pasta på fredagskvällen, ät en lättare lunch.]

[infoga tips]

[infoga tips]

Berätta gärna om detta hjälper dig [infoga problem. EXEMPEL: med att göra hälsosammare matval under veckorna!].`,
        `NOTES: Använd ett karusellinlägg för att dela tipsen

---

Vill du [Infoga drömkunds önskan. EXEMPEL: få de små att sova hela natten], UTAN [infoga något som folk inte vill göra. EXEMPEL: använda metoden 'låta dem gråta sig själva till sömns']?

Om så är fallet, gör dig redo för checklistan från dina drömmar (och glöm inte att klicka på spara-knappen!)

Vi vet att det kan vara [infoga problematisk känsla för din drömkund. EXEMPEL: överväldigande], men lita på mig, att när du väl [behärskar sömnträning och ser din lilla älska metoden också], kommer det att vara så givande.

Så här är min checklista över [infoga ämne. EXEMPEL: måsten när det gäller att hitta din nya rutin].

(SVEP FÖR ATT SE TIPSEN 👉)

Och om du har några frågor eller vill utforska [ämnet] ytterligare, kan du [infoga CTA. EXEMPEL: se ännu mer i min kommande masterclass XYZ. Anmäl dig via länken i bio!]`,
        `Visste du att när [sätt in något som kan hända din drömkund. EXEMPEL: din logotyp visas pixlad] beror det troligtvis på [sätt in vad som orsakar detta. EXEMPEL: att du använder fel filtyp]?

Här är vad du kan göra när detta händer:

👉 [sätt in tips/råd. EXEMPEL: det är dags att kontrollera att du har fått alla korrekta filtyper. Har du en EPS, PDF, JPG och PNG-version av din logotyp? Om inte kan du sakna en integrerad filtyp]

👉 [sätt in tips/råd. EXEMPEL: Visste du att JPG- och PNG-filer tappar data [eller blir pixlad] när de skalar upp? För att undvika detta måste du använda en vektorfil.]

 👉 [sätt in tips/råd]

Om du tror att [sätt in problem. EXEMPEL: felaktig hantering av logotypen] är det som hänt och du letar efter mer råd är det dags att [skicka ett meddelande till mina DM, kontakta mig, besöka min webbplats, besök länken i bio för mer information.]`,
        `Litet PSA att [infoga ett ämne som rör din idealkund som följer denna formel: X gör Y när Z. EXEMPEL: ditt företag blir igenkännbart när du har varumärkesklarhet] #micdrop

När [infoga ämne. EXEMPEL: ditt visuella varumärke sträcker sig bortom logotypen], [infoga vad tjänsten förbättrar/förändrar. EXEMPEL: det skapar enhetlighet].

När du har [infoga förbättringen ovan. EXEMPEL: enhetlighet], har du [infoga resultatet av förbättringen för din idealkund. EXEMPEL: en stark varumärkesgrund]

Det är så viktigt att veta hur [infoga ämnet och varför det är viktigt. EXEMPEL: att vara enhetlig i sitt varumärkesbyggande, eftersom detta i slutändan påverkar hur kunderna ser ditt företag].

Det är ditt jobb som [infoga din drömkund. EXEMPEL: soloprenör] att ta ett steg tillbaka och reflektera över [infoga vad du vill att de ska göra. EXEMPEL: om ditt varumärke är tydligt och konsekvent. Skulle du känna igen ditt företag bland en folkmassa?]

Detta? Är verkligen NYCKELN till [ultimat resultat. EXEMPEL: att bygga ett varumärke som stoppar scrollandet och är en magnet för sälj]. #micdrop

____________________

VALFRI: Lägg till detta om det finns ett sätt som detta relaterar till nästa steg i din klients resa.

PS: Jag har skapat en [workshop/blogginlägg/webbinarium/produkt/tjänst] som hjälper [sätt in vad din produkt/tjänst gör för din drömkund. EXEMPEL: identifiera och hantera] [sätt in ämne. EXEMPEL: din visuella branding över ditt företag].

Vad du kan förvänta dig att [workshop/blogginlägg/webbinarium/produkt/tjänst] täcka:

✅ [sätt in vad IC kommer att lära sig/få]

✅ [sätt in vad IC kommer att lära sig/få]

✅ [sätt in vad IC kommer att lära sig/få]

[CTA. EXEMPEL: ANMÄL DIG NU]

PPS[Pusha på urgency om det är relevant. EXEMPEL: Det här är din sista möjlighet att anmäla dig till workshopen för resten av månaden/Denna erbjudande löper ut idag/köp via länken i bio/ etc]`,
        `PÅMINNELSE: Det är okej att [sätt in något din drömkund behöver höra. EXEMPEL: be om hjälp, ta lite tid för dig själv, lägga ifrån dig telefonen idag, inte alltid älska din kropp även på din resa mot självkärlek]

Du behöver inte alltid [sätt in begränsande tro de har. EXEMPEL: göra saker själv som förälder, även om våra hjärnor kan säga oss XYZ].

Du har helt rätt att [sätt in något de kanske undviker att göra. EXEMPEL: sätta på TV:n och ställa de små framför den så att du kan få 15 minuter för lite egentid].

Jag lovar dig [sätt in den negativa konsekvensen din IC tror kommer att hända om de gör detta som inte är sant. EXEMPEL: du är inte en dålig förälder för det. Faktum är att du kommer att vara en BÄTTRE förälder för det eftersom lite vila kan hjälpa till att förbättra din motståndskraft och sänka din stress och hjälpa dig att möta dagen med ny energi].

Så, det här är ditt tecken att [återupprepa det din drömkund behöver höra. EXEMPEL: be om hjälp, ta lite tid för dig själv, lägga ifrån dig telefonen idag]`,
        `Vill du veta skillnaden mellan [XYZ] och [XYZ]?

Let's break it down! Swipa för att se detaljerna!

[Infoga CTA]`,
        `Behöver du lite inspiration [infoga ämne. EXEMPEL: för olika sätt att engagera dina följare?]?

Jag är på't! Swipa och se [infoga vad de kan se. EXEMPEL: mina 5 bästa tips för att aktivera dina följare igen!].

[Infoga CTA]`,
        `HEMLIGHETEN BAKOM [sätt in din drömkunds önskan här. EXEMPEL: ATT VÄXA DINA FÖLJARE PÅ THE 'GRAM]

Okej, så nu när jag har din uppmärksamhet 😉 och har stoppat dig i ditt scrollande, here’s the real talk.

Jag tror inte på några "hemligheter" eller snabba lösningar för detta. MEN vad som faktiskt finns?

Är DEFINITIVT några fantastiska [vad. EXEMPEL: nyckelpunkter, strategier, riktlinjer] som kan hjälpa dig att uppnå detta utan [vad vill de undvika? EXEMPEL: att känna dig överväldigad, att det tar år att uppnå dina mål.]

Så låt oss dyka in

1 - [RUBRIK. Exempel: HITTA DIN RÖST] [Infoga tipset. EXEMPEL: Om du vill locka idealiska kunder måste du vara den idealiska personen för dem. Och det här kommer ner till...]

2 - [RUBRIK] [Infoga tipset]

3 - [RUBRIK] [Infoga tipset]

Så som du kan se, det här är inte direkt några "hemligheter". Men jag lovar att dessa saker verkligen kan hjälpa dig att uppnå [dina mål/dina önskningar/sätt in resultat].`,
        `NOTE: Använd karusellinlägg för att visa detta över flera sidor.

‌

\\---

SLUTA ATT FASTNA NÄR DET GÄLLER [ÄMNE. EXEMPEL: ATT HITTA DET RÄTTA TRÄNINGSSCHEMAT FÖR DIG!] ⁣⁣

Istället? 👉 Svep för att se mina bästa tips och tricks för hur du kan [skriv din drömkunds ultimata mål. EXEMPEL: skapa en rutin du älskar och hålla fast vid, så att du kan nå dina mål.] ⁣

[Valfri CTA om du har ett erbjudande, freebie eller lösning som relaterar till detta:] OCH PS: Om du behöver en hjälpande hand för att [sätt in mål/önskan. EXEMPEL: sakta ner och frigöra mer tid för träning], gå till länken i min bio för att se hur [sätt in erbjudande. EXEMPEL: jag kan hjälpa dig att inte bara hitta DET RÄTTA träningsmönstret för dig, utan också skapa mer utrymme i din dag för det också]`,
        `3 saker som fick mig att inse att vi INTE behöver [sätt in ämne här. EXEMPEL: ha ett perfekt flöde på Instagram, betala dyra pengar för program som lovar världen, stressa över vad folk tycker om din föräldrastil.]...

‌

Och idag delar jag dem så ATT DU kan släppa den begränsande tron och [sätt in fördelen med denna förändring. EXEMPEL: återta din tid och hitta din autentiska själv igen på sociala medier 🙌].

‌

INSIKT ETT: [sätt in detaljer]

INSIKT TVÅ: [sätt in detaljer]

INSIKT TRE: [sätt in detaljer]

‌

Så jag vet inte hur det är för dig, men för mig? Dagarna av [upprepa ämnet. EXEMPEL: att stressa över hur mitt flöde ser ut och slösa SÅ mycket värdefull tid är över för ALLTID!].

‌

Istället? Kommer jag att [sätt in hur du kommer att gå vidare: bry mig mer om VAD jag säger och hur jag visar upp mig än hur mitt flöde ser ut varje dag, och se till att mina sociala medier är autentiska.]

‌

Är detta något du har tänkt på tidigare? Hur känner du inför det nu?`,
        `Vill du veta det #1 sättet som du kan ändra IDAG för att [sätt in mål som din drömkund vill uppnå. Det kan vara ett litet eller stort mål. EXEMPEL: 'komma ikapp med din att-göra-lista' eller ett större mål som 'ändra din mindset kring företag SNABBT']?

DET ÄR INTE att [sätt in något som det inte är som din drömkund kanske tror. EXEMPEL: tvinga dig själv att sitta vid ditt skrivbord och jobba även om tanken på det får dig att gråta.]

DET ÄR INTE att [sätt in något som det inte är som din drömkund kanske tror.]

OCH det är inte heller [sätt in något som det inte är som din drömkund kanske tror.]

SÅ, vad är det då?!! Det är detta:

[Sätt in ett mic-drop-råd här. EXEMPEL: det handlar om att skapa en rutin som fungerar för DITT schema som du blir kär i! Du kan göra detta genom att... ].

Så nästa gång du [sätt in situation de står inför. EXEMPEL: behöver komma ikapp med den brutala att-göra-listan?]

Kom ihåg att [upprepa/sammanfatta rådet här.]

[Valfri CTA om du har ett erbjudande, freebie, lösning som relaterar till detta:]

OCH PS: om du behöver en hjälpande hand att [sätt in info. EXEMPEL: ha kontroll över tidshantering och produktivitet i ditt företag], då [call to action. EXEMPEL tycker jag att du ska gå till länken i min bio för att titta på min gratis masterclass där jag ger dig resultat, resultat, resultat. Den är live NU!]`,
        `Jag kan inte hålla tyst om det här längre.

Jag har sett det överallt på senaste tiden, men jag måste bara get it of my chest...

[Slå hål på en myt om något eller korrigera information. EXEMPEL: frukt är inte dåligt för dig!! NEJ, inte ens när du försöker gå ner i vikt].

[Utveckla myten ytterligare. EXEMPEL: Jag vet att det kan vara förvirrande, men här är sanningen. Frukt är en väsentlig del av din kost och det kan faktiskt STÖDJA viktminskning. Och här är hur]

Så medan jag vet att det finns desinformation där ute, står jag fast vid att detta är sant.

Och om du vill prata mer om det? [Lägg till en CTA. EXEMPEL: boka ett gratis samtal med mig så kan vi diskutera dina nuvarande mål kring mat och hur jag kanske kan stödja - och samtidigt slå hål på några fler myter].`,
        `Behöver du lite inspiration till hur du kan maximera användningen av hashtags? Som du kan applicera NU och få resultat direkt?

I got you covered! Swipa för att se [infoga vad de kommer se. EXEMPEL mina topp 5 sätt att välja relevanta hashtags!].


[Infoga CTA]`,
        `NOTE: Para med ett karusellinlägg

---

Har du svårt att hålla [sätt in drömkundens frustration. EXEMPEL: maten intressant för din lilla?]

Vad sägs om [sätt in en annan frustration. EXEMPEL: hitta recept på åldersanpassade födoämnen]?

När jag först började min [sätt in din/drömkunds nisch. EXEMPEL: moderskap, hållbart, hälsosamt levnadssätt], [sätt in situationen. EXEMPEL: såg jag ständigt de perfekta berättelserna om bebisar som slukade sina måltider, perfekt smink med NOLL hudtextur, andra kvinnor i affärer som helt KROSSADE arbets-/livsbalansen], vilket fick mig att känna mig [hur din drömkund skulle känna. EXEMPEL: förvirrad och överväldigad över att min resa inte utvecklades på samma sätt]

Men jag lovar dig att du KAN [sätt in deras ultimata mål] - även om det verkar svårt just nu.

Och du kan svepa för att stjäla mina bästa tips om HUR du gör just detta. 👉

Och en sista liten LOVE NOTE. Håll ut där [drömkund. EXEMPEL: mamma, soloprenör, pappa, vänner] och fortsätt göra det du gör. För jag lovar dig att det blir bättre!`,
        `Det här är din påminnelse om att [sätt in en påminnelse om ett viktigt mål som ibland är svårt som din drömkund siktar mot. EXEMPEL: Det är dags att släppa hur du TROR att människor ser dig och börja projicera hur du VILL att människor ska se dig].

Lättare sagt än gjort, säger du? Du har inte fel. Men det ÄR möjligt.

Börja med [sätt in hur din drömkund kan göra. EXEMPEL: att titta på allt du redan har uppnått. Och kom ihåg vem som gjorde det. Ledtråd: det är du!]

[sätt in fler strategier om det är lämpligt].

Och kom ihåg: en snabb lösning är inte alltid svaret, och förändring kommer inte alltid lätt. Men att hålla fast vid [din resa/dessa steg] kommer att vara så värt det när du [når ditt mål, kommer fram till din destination].

OCH PS - Om du behöver mer hjälp med detta? [sätt in CTA. EXEMPEL: skicka ett DM, skicka ett mejl, prenumerera på mitt nyhetsbrev, anmäl dig till min nya XYZ-kurs/produkt].`,
        `NOTE: para med ett karusellinlägg

---

Redo för [infoga ämne. EXEMPEL 5 steg till den perfekta bildtexten på Instagram?].

Swipa för att spana in vad de är!

Visste du om de här redan, eller var någon ny? Let me know i kommentarerna!`,
        `Ummmmmmm, har du gjort fel när det gäller [infoga ämne. EXEMPEL: att marknadsföra dig på Instagram]?

Så ofta träffar jag fantastiska kunder, och när vi börjar prata om [ämnet], inser de snabbt att de har närmat sig saker på ett sätt som gör det väldigt svårt för dem.

Och för att DU inte ska upprepa dessa misstag ^ swipa för att se mina bästa [nummer. EXEMPEL: 3] tips så att du kan undvika detta!

Har du gjort något av detta?`,
        `NOTE: Pair this with a carousel post

_________

Försöker du [sätt in din drömkunds önskan. EXEMPEL: gå ner i vikt] MEN saker går inte så smidigt som du hoppats?

Du kanske saknar ett av dessa VIKTIGA element för att [sätt in önskan igen - EXEMPEL: göra viktminskning så mycket enklare].

Svep genom för att se dem och bocka av vilka DU gör en efter en ... och lägg snabbt till dem du INTE gör i din plan så snart som möjligt!

OCH PS - Om du behöver mer hjälp med detta? [sätt in CTA. EXEMPEL: skicka mig ett DM, skicka ett mejl, prenumerera på mitt nyhetsbrev, anmäl dig till min nya XYZ-kurs/produkt].`,
        `SLUTA KÄMPA! Jag har hittat ett enklare sätt att [sätt in din drömkunds önskan. EXEMPEL: förbereda content för hela veckan PÅ BARA EN TIMME].

Inget mer [det din drömkund kämpar med. EXEMPEL: behöva spendera timmar varje dag på att komma på vad fan de ska posta].

Inget mer [en annan sak de kämpar med]

Och inget mer [en annan sak de kämpar med]

För med det här? [Fördelen de vill uppnå. EXEMPEL: Att förbereda content för hela veckan på bara en timme är en fröjd]. Och här är mitt tips!

[sätt in mer information kring ämnet].

Prova detta och skicka mig ett DM och berätta hur det går. Jag lovar att det är en game changer!`,
        `VARFÖR DU BEHÖVER [sätt in din idealkunds önskan. EXEMPEL: ANVÄNDA MEMES PÅ DIN INSTAGRAM] - NU.

Okej, om du inte [det de borde göra. EXEMPEL: använder memes på din Instagram] kommer jag här att redogöra för varför detta kan hjälpa dig så mycket så att du inte kommer kunna motstå att testa det direkt.

Låt oss inte dra ut på det. Här är [nummer. EXEMPEL de 5 främsta] skälen att göra detta från och med idag.

SKÄL

SKÄL

SKÄL

SKÄL

SKÄL

Och om du har några frågor om något av ovanstående skäl eller vill ha mer stöd med detta? [Infoga CTA. EXEMPEL: registrera dig för mitt gratis webinarium nästa vecka om hur du kan öka ditt sociala medieengagemang - där vi kommer att gå djupare in på detta ämne plus 4 andra sätt du kan göra detta med lätthet].`,
        `NOTE: Para med ett statiskt inlägg med ett statement på. EXEMPEL “I am in love with my brand and it represents me so authentically”

—-------
På en skala från 1-10, hur mycket skulle du betygsätta detta som sant?

Och om du sa något annat än 10, här är en liten LOVE NOTE till dig idag.

[Infoga diskussion om ämnet och varför människor borde vara en 10 och hur de kan komma närmare det.]

Så om du idag är en 9 eller lägre kan det vara dags att göra en förändring. Och om du behöver hjälp med detta? [Infoga CTA - skicka ett DM, boka ett gratis samtal, ladda ner en freebie, delta i ett webbinarium, gå med i din FB-grupp etc.]`,
        `Känner du [saker din drömkund upplever. EXEMPEL: alla känslor när det gäller föräldraskap - och allt på en och samma dag].

Jag vill bara berätta för dig [infoga empati. EXEMPEL: att detta är så vanligt, jag har känt så här också, och det är helt normalt och förväntat].

Men också, om du VILL göra en förändring [infoga önskad förvandling. EXEMPEL: där du kan få några av dessa stora känslor under kontroll], swipa igenom för att se stegen som hjälper dig att göra just det.

Och om de här tipsen har hjälpt dig? Då kanske du också är intresserad av [CTA här. EXEMPEL: att ladda ner min gratis guide om att navigera de första 12 månaderna som mamma och de saker som kommer upp - precis som känslorna som diskuterades idag.]. Gå till [var vill du skicka dem? EXEMPEL: länk i min bio för att ladda ner nu!]`,
    ],
};

const ALL_HOOKS = [
    `Varför pratar ingen om...`,
    `Det mest värdefulla tipset jag lärt mig...`,
    `3 saker varje [din drömkund] behöver!`,
    `Jag kontaktar alla [din drömkund. EX: soloprenörer]`,
    `Här är en sak jag verkligen inte håller med om`,
    `Det här kanske är tough love, men du behöver höra det`,
    `Jag har välkomnat [nummer] till [program/masterclass/tjänst] - är du nästa person att joina oss?`,
    `En sak inom [din nisch] som jag inte tycker om...`,
    `Jag är BESATT av [något du är besatt av] och varför du också borde vara det`,
    `SPOILER ALERT`,
    `Sanningen om...`,
    `Unpopular opinion/opopulär åsikt incoming:`,
    `Har du någonsin`,
    `Tänk om du VISSTE att du inte skulle misslyckas...`,
    `Titta på det här om du...`,
    `Mitt favorithack för...`,
    `5 fakta om...`,
    `Du vill inte missa det här!`,
    `Jag ska berätta en hemlighet...`,
    `Hur min [klient] gick från XYZ till ZYX och här är hur du också kan göra det`,
    `Inte många vet det här men...`,
    `Your well needed daily reminder`,
    `En myt om...`,
    `Det här är hur jag [gjorde något din drömkund drömmer om] steg för steg!`,
    `Tänk om du hade 99 problem men [painpoint] inte var ett av dem?`,
    `Är du rädd att [vad är drömkunden rädd för?]? Då behöver du höra detta!`,
    `Jag vet att du inte vill höra det här, men du behöver: [sak de behöver höra]`,
    `Din guide till [något din drömkund längtar efter]`,
    `Happy tears incoming:`,
    `Den BÄSTA strategin som hjälpt mig [det din drömkund drömmer om som du gjort]`,
    `EXCITING NEWS`,
    `Vad skulle du göra om du visste att du inte kunde misslyckas med [förändring/dröm/mål]`,
    `Det här är stunden vi alla väntat på...`,
    `Det är x timmar kvar att [göra något/investera/förändra/ta action] - valet är ditt..`,
    `Är 2024 året du äntligen [förändring din drömkund längtar efter]?`,
    `Är du redo att släppa [painpoint] och [resultat av din tjänst]? Häng på [program/tjänst/produkt]`,
    `5 sätt att [uppnå förändring drömkund längtar efter]`,
    `Det här är vad jag hatar med [...]`,
    `3 tips för att lyckas med [förändring drömkund längtar efter]`,
    `Min exakta strategi för att [det din drömkund vill uppnå] (Du kommer vilja spara det här!)`,
    `SPARA DET HÄR`,
    `Hur du kan [göra förändring] på [tidsram]`,
    `En anledning till att du [painpoint] (och hur du fixar det!)`,
    `Det är dags att du bevisar att du kan [det drömkunden drömmer om]!`,
    `Det här är den egentliga anledningen till att du [problem drömkunden upplever]`,
    `Den främsta anledningen till att det är så svårt att [nå ett mål]`,
    `Stoppar den här [anledningen/tron/saken] dig från att nå alla dina drömmar och mål?`,
    `Hur skulle ditt liv se ut om du redan [något drömkunden drömmer om]?`,
    `Sluta scrolla och...`,
    `Hur skulle du må om du redan uppnått [drömkundens mål]?`,
    `Visste du det här...`,
    `Har du någonsin undrat varför...?`,
    `Det här gör alla fel - gör du det också?`,
    `Så här kan du förbättra....`,
    `Hemligheten bakom...`,
    `Ett enkelt sätt att göra.... Visste du om det?`,
    `Det största misstaget du kan göra...`,
    `Så här sparar du både tid och pengar på...`,
    `Tänk om du kunde... på bara 5 minuter?`,
    `Det här är vad ingen berättar om...`,
    `Har du hört talas om den nya trenden inom..?`,
    `Mina 5 bästa tips för...`,
    `5 saker du bör göra om...`,
    `Så här löser du [problem] en gång för alla!`,
    `Följ dessa steg för att...`,
    `Gör detta idag och se resultat redan imorgon!`,
    `Har du någonsin testat...?`,
    `Vad du behöver veta om...`,
    `Den mest effektiva strategin för att...`,
    `En oväntad fördel med...`,
    `Såhär maximerar du... med minimal ansträngning...`,
    `Det här kommer förändra hur du tänker på..`,
    `Det här kommer förändra hur du ser på...`,
    `Så här får du ut det mesta av...`,
    `Undvik de här vanliga misstagen...`,
    `Är du redo att förändra...`,
    `[Det vanligaste misstaget] som [din drömkund] gör och hur du kan undvika det`,
    `7 anledningar till att du inte [uppnår drömmål] ännu`,
    `Om du kämpar med [problem], läs vidare...`,
    `Så här gör du [process] enklare`,
    `3 saker jag önskar jag visste innan jag började [din nisch/tjänst]`,
    `Gör detta för att [uppnå mål] snabbare`,
    `Min klient fick [resultat] genom att göra detta - vill du veta hur?`,
    `Så här får du fler [din drömkund] att [önskad handling]`,
    `Den största lärdomen jag lärt mig om [ämne]`,
    `Om jag skulle börja om idag, skulle jag göra detta...`,
    `En sak jag skulle ha gjort annorlunda när jag startade [din nisch/tjänst]`,
    `Ett tips för att förvandla [problem] till [lösning]`,
    `Vad jag skulle göra om jag bara hade 30 dagar att [nå mål]`,
    `3 saker du behöver veta innan du [gör något inom din nisch]`,
    `Din snabbguide till att [uppnå specifikt resultat]`,
    `Här är varför du inte ser resultat när du [försöker något]`,
    `Du behöver bara 5 minuter för att [nå resultat]`,
    `Det här är varför du känner dig fast i [problemområde]`,
    `Så här slår du din [konkurrent/problem] utan stress`,
    `Om du känner att du inte har tid för [din tjänst], läs detta`,
    `En game-changer strategi för att [nå specifikt mål]`,
    `Har du koll på den senaste strategin för [ämne]?`,
    `Jag testade detta och här är vad som hände...`,
    `Är du redo att ta steget och [göra något förändrande]?`,
    `Hur jag hjälpte [klient] att överkomma [problem] och hur du också kan göra det`,
    `Om du inte är villig att investera i [din tjänst], borde du nog läsa detta...`,
    `Är du fast i [problem]? Här är vad du kan göra istället`,
    `Den största fördelen med att [köpa din tjänst/produkt]`,
    `5 tecken på att du är redo för [din tjänst]`,
    `Har du försökt att [en metod] men inte sett resultat?`,
    `Vad gör du när [problem] inträffar? Här är vad jag gör...`,
    `Jag ångrar att jag inte började [din tjänst/ämne] tidigare...`,
    `Sanningen om att [utföra en handling/uppnå ett mål]`,
    `5 skäl till att du bör överväga att [köpa din tjänst]`,
    `Den mest oväntade utmaningen jag stötte på när jag började [din nisch]`,
    `Kan du föreställa dig att [uppnå dröm]? Här är hur...`,
    `Den största myten om [ämne]`,
    `3 skäl till varför [din metod] fungerar bättre än något annat`,
    `Hur du tar kontroll över [utmaning] och gör det till din styrka`,
    `Ditt nästa steg mot att [uppnå mål]`,
    `En kraftfull fråga att ställa dig själv om du vill [göra en förändring]`,
    `Så här optimerar du [en process] på under en vecka`,
    `Om du är rädd för [ett vanligt problem], läs vidare`,
    `Det här är vad jag önskar att alla [din drömkund] visste om [ämne]`,
    `Varför jag lämnade [metod/strategi] för att satsa på [din metod/strategi]`,
    `En snabb och enkel övning för att [nå ett mål]`,
    `Kan du gissa vad som hindrar dig från att [uppnå något]?`,
    `Den första saken jag gör när jag vill [nå ett resultat]`,
    `Hur [ett litet steg] kan leda till [ett stort resultat]`,
    `Jag delar mina bästa tips för att [göra något bättre/snabbare]`,
    `Om jag bara kunde ge ett tips om [ämne], skulle det vara detta...`,
    `Är du redo att skala upp och [ta din verksamhet till nästa nivå]?`,
    `Det här är vad jag lärde mig efter att ha jobbat med [antal] klienter`,
    `Hur jag navigerar i [specifik utmaning inom din nisch]`,
    `Det här är vad jag skulle gjort tidigare om jag visste vad jag vet nu...`,
    `Så här kan du dra nytta av [en trend/utveckling]`,
    `Jag blev chockad när jag insåg detta om [ämne]`,
    `Om du bara kunde förändra en sak i din verksamhet, vad skulle det vara?`,
    `Hur jag förvandlade [ett problem] till [en framgång]`,
    `Har du en plan för att [nå mål] under de kommande 3 månaderna?`,
    `Så här går du från [nuvarande situation] till [önskat resultat]`,
    `5 frågor att ställa sig själv innan du [gör ett val/förändring]`,
    `Varför jag inte längre rekommenderar [en strategi/metod]`,
    `Det här är hur du vet om du är redo att [ta nästa steg]`,
    `Det mest oväntade sättet att [uppnå ett mål]`,
    `3 enkla steg för att komma igång med [din metod/strategi]`,
    `Så här skapar du [något] utan att känna dig överväldigad`,
    `Hur du använder [din tjänst/metod] för att [uppnå något specifikt]`,
    `Jag trodde aldrig att jag skulle säga detta om [ämne]...`,
    `En enkel förändring du kan göra idag för att [nå ett resultat]`,
    `Så här bygger du [något] på ett hållbart sätt`,
    `Om du känner att du är på fel väg, läs detta...`,
    `En enkel fråga som förändrade mitt sätt att se på [ämne]`,
    `Är du redo att [förbättra något] i ditt liv/företag?`,
    `Så här går du från [smärta/problem] till [lösning/resultat]`,
    `Hur du skapar en plan för att [nå ett mål] utan att stressa`,
    `Så här kan du testa [en metod] och se resultat inom en vecka`,
    `Vad skulle hända om du vågade [ta ett steg]?`,
    `Här är en insikt som förändrade allt för mig...`,
    `Ett snabbt tips för att maximera [resultat inom din nisch]`,
    `Hur du undviker att fastna i [ett problemområde]`,
    `Varför jag började [en specifik metod] och aldrig ser tillbaka`,
    `Om du undrar varför du inte ser resultat, här är varför...`,
    `Jag var skeptisk till [något] men här är vad som hände när jag testade det`,
    `Den största insikten jag har fått i år om [ämne]`,
    `Jag delar min plan för att [nå specifikt mål] under de kommande 90 dagarna`,
    `Så här kan du använda [din tjänst/produkt] för att [nå specifikt resultat]`,
    `En enkel men effektiv metod för att [nå något]`,
    `Har du hört talas om [en ny trend eller metod inom din nisch]?`,
    `En fråga att reflektera över om du vill [uppnå något]`,
    `Om jag bara hade 10 minuter att ge dig ett råd, skulle det vara detta...`,
    `Det här är vad som fungerar just nu inom [din nisch]`,
    `3 enkla justeringar du kan göra för att se bättre resultat`,
    `Här är varför jag tror att alla [din drömkund] borde prova [din tjänst]`,
    `En insikt som tog mig flera år att förstå men kan hjälpa dig på ett ögonblick`,
    `Så här bygger du upp [något] från grunden`,
    `Vad skulle du göra om du fick reda på att [något oväntat]?`,
    `Hur du gör [en förändring] utan att offra [något viktigt]`,
    `Är du redo att omfamna [en ny metod/strategi]?`,
    `Det här är vad som gjorde den största skillnaden för mig när jag [uppnådde något]`,
    `Jag säger det här med kärlek, anledningen till [problem] är [xyz]`,
    `Vill du se resultat imorgon? Gör detta...`,
];

const ALL_CTAS = [
    `Håller du med? Dela dina tankar i kommentarsfältet!`,
    `Kommentera [emoji] om du håller med!`,
    `Kommentera [emoji] om detta stämmer in på dig!`,
    `Ställ din fråga i kommentarerna!`,
    `Vad tycker du? Kommentera nedan!`,
    `Dela med dig om en liknande grej har hänt dig.`,
    `Tagga någon som behöver höra detta!`,
    `Vad är din åsikt? Kommentera nedan!`,
    `Rösta i kommentarerna - [emoji 1] eller [emoji 2]`,
    `Spara det här inlägget så att du hittar tillbaka senare!`,
    `Spara inlägget och dela till någon du tror behöver läsa detta!`,
    `Dela det här inlägget till någon som du tror skulle gilla detta!`,
    `Spara det här inlägget till nästa gång du behöver inspiration`,
    `Spara inlägget och dela till någon du tror behöver höra detta!`,
    `Spara det här inlägget till nästa gång du behöver hjälp!`,
    `Kommentera [emoji] så skickar jag en länk!`,
    `Kommentera "ja tack" så skickar jag ett DM med länk och mer info!`,
    `Gilla inlägget om du håller med!`,
    `Dela med dig, vad är dina tankar om [ämnet]?`,
    `Håller du med?`,
    `Vill du också känna som [personen i inlägget]? Skicka ett DM med "[kort fras]"!`,
    `Är du redo att känna likadant? Kommentera [emoji]!`,
    `Vill du ha mer information? Kommentera "Ja tack" så skickar jag ett DM!`,
    `Spara inlägget så att du inte tappar bort det!`,
    `Gilla inlägget om du tyckte om det!`,
    `Är du redo att ta nästa steg? Skriv "redo" i kommentarerna!`,
    `Är detta något du kämpar med? Skicka mig ett DM så pratar vi!`,
    `Vill du veta mer? Klicka på länken i bio!`,
    `Nyfiken på hur detta fungerar för dig? Boka en gratis konsultation nu!`,
    `Dela det här inlägget om du tror att någon annan kan dra nytta av det!`,
    `Tryck på [emoji] om du vill ha fler tips som detta!`,
    `Är du redo att förändra ditt liv? Klicka på länken och boka ett möte!`,
    `Tryck "JA" i kommentarerna så skickar jag mer information direkt till din DM!`,
    `Hur många av er kämpar med detta? Låt oss prata om det i kommentarerna!`,
    `Skicka ett hjärta [emoji] om du känner likadant!`,
    `Vill du ha tillgång till min gratis [e-bok/guide]? Kommentera "[ORD]"`,
    `Intresserad av att veta mer? Skriv "MER INFO" nedan!`,
    `Klicka på "Följ" om du vill ha dagliga tips och inspiration!`,
    `Vill du se fler inlägg som detta? Spara och dela för att visa oss att du vill ha mer!`,
    `Vill du förbättra dina [skills/strategier]? Boka din plats på vår nästa workshop!`,
    `Tagga någon du tror skulle älska detta ämne!`,
    `Skriv “JA” i kommentarerna om du är redo att göra en förändring!`,
    `Dela din resa i kommentarerna och låt oss stötta varandra!`,
    `Sluta vänta! Gör första steget mot förändring nu – klicka på länken och ta kontakt!`,
    `Missa inte din chans att lära dig detta gratis! Anmäl dig via länken i bio!`,
    `Har du frågor? Fråga mig i kommentarerna så svarar jag!`,
    `Tycker du detta var hjälpsamt? Spara inlägget för framtida användning!`,
    `Är du redo att påbörja din resa? Skriv "JAG ÄR REDO!" i kommentarerna.`,
    `Skicka ett meddelande om du vill höra mer om hur jag kan hjälpa dig att nå dina mål!`,
    `Skaffa dig en gratis provperiod och se vad vi handlar om! Klicka på länken.`,
    `Spara detta inlägg för att ha alla tips nära till hands!`,
    `Se till att du inte missar några uppdateringar – aktivera notiserna!`,
    `Är du intresserad av att gå djupare? Skicka mig ett DM med ordet "INTRESSERAD".`,
    `Gilla det här inlägget om du vill se mer av samma typ!`,
    `Boka din plats nu innan alla platser är fyllda!`,
    `Tyckte du om detta? Dela det med dina vänner!`,
    `Har du hört om vår senaste kurs? Klicka på länken för att få reda på mer!`,
    `Klar att börja nu? Tryck på "Boka nu"-knappen!`,
    `Redo att ta nästa steg? Skicka ett DM med "Redo" så sätter vi igång!`,
    `Vill du veta mer om hur detta kan hjälpa dig? Kommentera "Jag är intresserad" så hör vi av oss!`,
    `Letar du efter nästa nivå i din karriär? Boka en gratis strategi-session via länken i vår bio!`,
    `Är du trött på att känna dig fast? Skriv "Få hjälp" i kommentarerna och låt oss guida dig!`,
    `Klicka på länken för att ladda ner vår kostnadsfria guide och börja din resa redan idag!`,
];

const ONE_LINERS = [
    `Rulla ut den röda mattan eftersom denna nya [produkttyp] är på väg rakt till VIP-nivå`,
    `Återkommer snart, ska bara beundra denna nya [produktnamn/typ].`,
    `Vi kanske är partiska, men denna [produkttyp] är en 12/10. Kanske till och med högre men vi försöker att vara ödmjuka`,
    `Det känns som en "lägg till i kundvagnen"-typ av dag`,
    `Bekräftat: den perfekta [produkttypen] EXISTERAR`,
    `Jag tar 6, tack`,
    `Du + [produktnamn/typ] = det perfekta paret. Det är vetenskap`,
    `Om det inte är [elementet i din bild/produkt], vill jag inte ha det.`,
    `Något är på gång... kan du gissa vad utifrån denna förhandsvisning?`,
    `Närbild på [produkttyp/namn] [element], för med utseenden så här bra, varför inte?!`,
    `På onsdagar bär vi [din produkts färg eller produkttyp]`,
    `Gänget är här`,
    `Hemligheten är ute - [produktnamn/typ] är nu LIVE och folk är förälskade.`,
    `Du vill ha [önskan. EXEMPEL: perfekt hy]. Vi vill det för dig också. Det är därför [produktnamn] existerar.`,
    `Absolut besatt av [funktionen eller produkten på bilden]`,
    `Den perfekta [produkttypen] exi...`,
    `Möt det nyaste medlemmen i gänget!!`,
    `All kärlek för denna otroliga skönhet`,
    `Någon annan har FOMO när de ser [produktnamn] i verkliga livet?`,
    `Menar inte att alarmera dig, men detta kan bara vara din favorit [produkttyp] någonsin.`,
    `Är någon annan besatt av [produktsfunktion, fördel eller typ]?`,
    `PSSSSSST: denna smygsmygtitt är bara för dina ögon. Nya produkter kommer till [varumärkesnamn] nästa vecka. Vem är exalterad??`,
    `Ingenting slår [produktens funktion, fördel eller typ] för att få dig att bli kär`,
    `[Parat med några olika produkter]: Det är en "behöver en av allt" typ av dag`,
    `Vitaminlycka i form av [produkttyp/namn]`,
    `Det är de små sakerna som betyder mest`,
    `BARA EN FYI - Denna skatt är bara några klick bort från att vara i ditt liv.`,
    `Livet är för kort för att inte ha bra [produkttyp]`,
    `Allt blir bättre med [produktsfunktion, fördel eller typ]`,
    `Vad är din favorit? 1, 2 eller 3?`,
    `"Lite online-shopping skadar aldrig någon" - någon väldigt, väldigt klok`,
    `NYTT ✔ [ADJEKTIV] ✔ BEHÖVS ✔`,
    `Letar du efter den perfekta [produktsfunktion, fördel eller typen]? Look no further!`,
    `Det är officiellt... vi är officiellt förälskade i [produktsfunktion, fördel eller typ]`,
    `[något] är TILLBAKA, baby!`,
    `[Parat med några olika produkter] Vilken trio/par/kombination/samling!`,
    `Vem älskar inte [infoga produktnyhet. EXEMPEL: en stor skön tröja du kan krypa upp i]. Denna skatt finns tillgänglig i butiken just nu!`,
    `Redo för en förhandsvisning av vad som kommer? Svep åt höger! >`,
    `Det är en [situation. EXEMPEL: fredag] typ av vibb`,
    `"Jag har för många [produkter]” - sa aldrig någon någonsin.`,
    `Vi är förälskade i ALLLLLLLLA de nya produkterna men eftersom vi inte kan välja favoriter, vill vi veta vad DIN är!`,
    `Alltid förälskad i [produktsfunktion, fördel eller typ]`,
    `Ser verkligen fram emot [kommande händelse]. Och att ha [din produkttyp] vid vår sida hela tiden.`,
    `Hand upp om du älskar [produktsfunktion, fördel eller typ]. °lyfter båda händerna°`,
    `SPARA DATUMET! [produktnamn/kategori/serie] går live [datum]. Missa inte!`,
    `Det enda som saknas i din vardag är denna 👆`,
    `Be ready to fall in love... igen. 💕 [produktnamn] är här för att stanna!`,
    `Detta är inte bara en [produkttyp]... det är en upplevelse!`,
    `Ett steg närmare perfektion med den här godingen!`,
    `Säg hej till din nya räddare i nöden: [produktnamn]`,
    `Vi tar hållbarhet till nästa nivå med [produktnamn/typ]. Är du med oss?`,
    `Känslan när du packar upp en helt ny [produkttyp]... oslagbar.`,
    `Dags att uppgradera ditt liv. Börja med [produkt] 😜`,
    `Ingen vet att du behöver detta... tills du har det 😍`,
    `Redo att sätta guldkant på din vardag? Kolla in [produkt].`,
    `Alla vägar leder till [din produkt]. Och vi kan bevisa det 👆`,
    `En droppe lyx i varje detalj. Så känns det med [produkt] 💸`,
    `En gång [din produkttyp], alltid [din produkttyp] 🫶`,
    `Ett nytt måste-ha: [produktnamn]. Vi lovar, du kommer inte ångra dig!`,
    `Du förtjänar bara det bästa. Och bästa betyder [produktnamn] 😌`,
];


// ========================================================================
// ADDITIONAL RESOURCES - Viral Hooks, CTAs, Storytelling
// ========================================================================

// Viral Hook Formulas (36 formulas with templates + examples)
const VIRAL_HOOK_FORMULAS = [
    { template: `Things I wish I knew`, example: `Life hacks I know at 30` },
    { template: `[x] will teach you more than [y]`, example: `21 tiny life habits that will teach you more than a self-help book` },
    { template: `If I only had [x] minutes every day to work on [your hearts desire], this is exactly what I would do`, example: `If I only had 15 minutes every day to work on building core strength, this is exactly what I would do.` },
    { template: `A Quick Tip / Strategy for...`, example: `A Quick Tip for starting a fitness studio` },
    { template: `How to ... with/in ...`, example: `How to find your style in less than a week` },
    { template: `Things that I thought were my X, but they are my Y`, example: `Things that I thought were my allergies, but they are my body's response to stress` },
    { template: `You need... if you’re...`, example: `You need this habit hack if you are a serial procrastinator` },
    { template: `Do you struggle with... , do this…`, example: `Do you struggle with keeping your newborn asleep? Do this...` },
    { template: `This is why your... isn’t working...`, example: `This is why your cake isn't fluffy` },
    { template: `If[x], read this:`, example: `If you are prone to overthinking, read this` },
    { template: `Here is a x (your niche) starter pack`, example: `Here is a Finance starter package` },
    { template: `[x] free [y] to…`, example: `9 Free design tools to make your life easy` },
    { template: `in [y] days that will [benefit]`, example: `7 ted talks in 7 days that will inspire & motivate you` },
    { template: `How to [x]. Action [y]:`, example: `How to avoid burnout` },
    { template: `Here's an exercise that everyone should do!`, example: `Here's an exercise that every mother should do 3 months after giving birth!` },
    { template: `“Quote.” How to:`, example: `“Not taking things personally is a superpower” James Clear` },
    { template: `I spent on [y]. Here is [y] for free:`, example: `I spent 120$ on a course that tripled my reading speed imagine you going from reading 20 to 60 books a year` },
    { template: `If you are currently in (this process) - then this video is for you!`, example: `If you are currently in the process of finishing your Masters degree - then this video is for you!` },
    { template: `Statement. 99% don’t know. Here are…`, example: `Internet is a free university but 99% don’t know to benefit from it. Here are the top tips:` },
    { template: `The worst thing you can do as X is Y`, example: `The worst thing you can do as a woman in a relationship is stop communicating` },
    { template: `Statement. Contrast. Listicle`, example: `You don't get what you deserve you get what you negotiate (9 tips to master negotiations)` },
    { template: `(not joking)`, example: `21 one-time decisions that will 10x your productivity (not joking)` },
    { template: `(until now)`, example: `7 habits you didn't know it was bad (until now)` },
    { template: `(you’ll thank me later)`, example: `Lock yourself in 1 room and read those books (you’ll thank me later)` },
    { template: `(in 6 months)`, example: `If you want to give yourself an MBA in 6 months read those books` },
    { template: `(without [x])`, example: `How to study 4 hours straight (without Adderall)` },
    { template: `(all free)`, example: `10 Google Chrome extensions that will accelerate your learning (all free)` },
    { template: `(backed by science)`, example: `How to fall asleep quickly (backed by science)` },
    { template: `(in life and business)`, example: `You don't get what you deserve you get what you negotiate. 9 tips to master negotiation (in life and business)` },
    { template: `(including this)`, example: `How to remember everything valuable you read (including this)` },
    { template: `Let’s talk about (taboo topic)…`, example: `Let’s talk about praying at work…` },
    { template: `I do X so that you don’t have to`, example: `I study brands powered by the creator economy so that you don’t have to.` },
    { template: `After working with X I noticed this...`, example: `After training 300 athletes, I noticed this:` },
    { template: `The trick that X,Y & Z have in common`, example: `The marketing trick that Google, Apple and Tesla have in common` },
    { template: `(that one day might save you)`, example: `7 rules for saving money (that one day might save you)` },
    { template: `The X Method`, example: `How to fall asleep quickly The 4-7-8 Method` },
];

const VIRAL_HOOKS_ORGANIZED = {
    'educational': [
        "This represents your X before, during, and after X",
        "Here\'s exactly how much (insert action/item) you need to (insert result)",
        "Can you tell us how to (insert result) in 60 seconds?",
        "This is what (insert thing) looks like when you\'re (insert action). And this is what they look like when you\'re not (insert action)",
        "I\'m going to tell you how to get (Insert result), (insert mind blowing method)",
        "It took me 10 years to learn this but I\'ll teach it to you in less than 1 minute",
        "When you get (insert item/result) here are the # things you got to do right away",
        "If you don\'t have (insert item/action), do (insert item/action)",
        "My money rules as a (insert description) working towards financial independence",
        "Money can buy you (insert item) but it can not buy you (insert result)",
        "Here\'s how to develop a (insert skill) so strong that you physically can\'t stop (doing skill)",
        "This is what (insert #) of (insert item) looks like",
        "If I woke up (insert pain point) tomorrow, and wanted to (insert dream result) by (insert time) here\'s exactly what I would do",
        "If you\'re a (insert target audience) and you want (insert dream result) by (insert avenue) then listen to this video",
        "If you are (insert age group or range) do not do (insert action)",
        "As an (insert trait) responsible (insert age) year old with a goal to (insert goal) here are 3 things I will never regret doing",
        "Not to flex, but I\'m fretty f*cking good at (insert skill/niche)",
        "This is what (insert object/item) looks like when you are using/doing (insert product/service)",
        "Are you still (insert action)? I\'ve got (insert result) in (insert time frame) and I have never (insert action)",
        "3 Youtube channels that will teach you more than any (insert industry/niche) degree",
        "I think I just found the biggest (insert niche/industry) cheat code",
        "Here are 3 people who will make you a better (insert title)",
        "(insert trait) Guy vs (insert trait) Guy",
        "I see you doing nothing but (insert action) after (insert event) so follow this agenda to avoid that",
        "Want to be the first (insert dream result) in your family?",
        "This is how many (insert item) you need to (insert result)",
        "Everyone tells you to (insert action) but nobody actually tells you how to do it. Here is a # second step by step tutorial that you can save",
        "If you\'re (insert age range) these are the # things you need to do so you don\'t end up (insert pain point) by (insert age)",
        "If I were starting over in my (insert age range) with no (insert item) here are the top # things I would do to (insert dream result)",
        "Here are some slightly unethical (insert industry/niche) hacks that you should know if you\'re (insert target audience)",
        "Here\'s exactly how you\'re gonna lock in if you want to (insert dream result)",
        "This is the same exact (insert thing) but the first is/got (insert result and the second is/got X",
        "If you want to end up (insert pain point) then skip this video",
        "We have never used (insert noun) in our home because we have found it to be generally (insert trait/traits)",
        "(insert action) for (insert period of time) and you will get (insert dream result)",
        "If you\'re between the ages of (insert age) to (insert age) and you feel like (insert pain point)",
        "(insert before state) to (insert after state) in # simple steps in under # of seconds",
        "If you\'re trying to (insert dream results) then here is the one (insert thing) you should do",
        "How long do you think you have to (insert action) to (insert result)",
        "If you want to do this, first do this",
        "If you\'re trying to (insert dream result) and you haven\'t got a clue what to (insert action) on a daily basis I am going to show you an example",
        "This is how many (insert item) you need to (insert result)",
        "I\'m gonna save you # of minutes off your next workout with # of simple tips",
        "If I only had (insert time frame) in the (insert location/place) this is exactly what I would do to get (insert dream result)",
        "How long can you skip (insert action) before losing (insert result)",
        "If you want to (insert dream result) a week for the next (insert weeks) without (insert pain point) then listen up",
        "If you just turned (insert age) and you don\'t want to (insert pain point) then you should do the following # things immediately",
        "You can have a perfect (insert dream result) by simply dumbing it down",
        "Did you know that this, this, this, and this get (insert dream result)",
        "Don\'t start doing (insert action) until you learn how to do this",
        "(insert industry) tier list for (insert year)",
        "In 60 seconds i\'m going to teach you more about (insert thing) than you have ever learned in your entire life",
        "(Insert noun) loses (Insert noun) on this, so they can make (insert noun) on this",
        "You have (insert noun) tomorrow but you have no time to (insert action). Here\'s how you save your (insert noun)",
        "(Insert scenario) and (Insert dream result), here are the # of steps to get (insert dream result)",
        "(Insert target audience) if you\'re serious about playing at the next level",
        "You only have to be dialed in on # of things to be an elite (insert title)",
        "(Insert noun) for dummies",
        "Don\'t hate me but I don\'t really mind (insert noun)",
        "Best ways to save money while (insert action)",
        "This is every way to (insert action)",
        "What if I told you this (insert item) could (insert result)",
        "Did you know that if you (insert action, (Insert action), (insert action), etc",
        "The (insert thing) you have now in you (insert age group) is so (insert noun)",
        "Listen if you\'re not forcing your (insert person/persons) to (insert action) in their (insert current state) don\'t expect them to be (insert trait) in their (insert after state)",
        "Would you rather watch your (insert person/persons) (insert pain point) or join them in their (insert niche) journey to save their lives?",
        "This is the amount of (insert noun) you would lose per day in a (insert state)",
        "If your in a (insert dream result) journey, this is exactly what you need to do to (insert dream goal) in # simple steps",
        "If you told me # of years ago I\'d be (insert dream result) I wouldn\'t have believed you",
        "If your getting (insert adjective) or know someone (insert adjective) there are # of incredulity important things you need to make sure you can do physically in order to (dream result)",
        "If you don\'t want to fail (insert life event)",
        "I crammed the hardest (insert noun) and (insert dream result)",
        "If you\'re cooked for your (insert life event) but still can\'t find the motivation to do (insert action) you\'re gonna want to see this",
        "Here\'s the difference between (insert title), (insert title) , and (insert title)",
        "If I were in my (insert age range) here is exactly how I would avoid (insert bad result)",
        "Here\'s every (insert noun) that you actually need to know",
        "The most important things I will teach my kids as a (insert job title)",
        "If you can\'t solve this (insert problem) in under 5 seconds go back to (insert pre-qualifying stage)",
        "30 seconds of (insert industry) advice I give my best friend if he/she were starting from scratch",
        "I would do this before quitting your job",
        "If you do this you\'ll (insert result)",
        "Here are 5 books to (insert dream result) better than 99% of other people",
        "If you can\'t do (insert action)",
        "If you can do # of (insert action), than you can do # of (insert action)",
        "If your mom didn\'t teach you how to make (insert noun) growing up, don\'t worry i\'m your mommy now",
        "Never lose a game of (insert game) for the rest of your life",
        "3 levels of (insert noun)",
        "Did you know that if you… (Insert action), (insert action), (insert action), etc",
        "I am a professional (insert industry) hacker, and here\'s every hack at (insert store/location/event/etc)",
        "I have a very long list of (insert noun) that I (insert action) that I gate keep from other people. But today I feel like giving back so I am going to tell you",
        "I am going to teach you how to identify a good (insert noun) to a bad (insert noun)",
        "I went to (insert school type) so you don\'t have to",
        "Ranking all the most popular (insert noun), so I can rank them from worst to best",
        "Here is how I (insert action) as a (insert label) (insert age)",
        "You wouldn\'t get (insert bad result) when you (insert action) if you (insert action)",
        "This is harder than getting into Harvard",
        "Now how much does it really cost to (insert action)",
        "This is why no one remembers you",
        "If you take (insert noun) it will (insert result)",
        "I just made a website called (insert the longest but most relatable website name)",
        "How to turn just one (insert noun) into a lifetime of free (insert noun)",
        "Things that are damaging your (insert noun) without you even realizing it",
        "I\'ve (insert dream result) despite having (insert pain point) and this is the routine that did it",
        "Swap these (insert noun) for better (insert result)",
        "Did you know that this, this, and this target (insert dream result)",
        "Your (insert noun) looks like this and you want them to look like this",
        "(Insert last year) (insert noun), (insert current year) (insert noun)",
        "Okay (insert pain point), how about we don\'t f up (insert current year)",
        "This is the program/steps I would follow if I was trying to (insert dream result)",
        "Here are some (insert action) you can do without (insert noun)",
        "Let\'s find out what (insert noun) you are in # steps",
        "Most people can only do (insert action) when trying to (insert action) but as an (insert title) you should be able to (insert action)",
        "As an (insert title) you should be able to do this, if you can\'t (insert diagnosis)",
        "What happens when you go X hours/days/weeks/years without (insert noun)",
        "There is no doubt in my mind that (insert action) are the best (insert noun) for your (insert noun)",
        "Don\'t touch this",
        "What I wish I knew at (insert age) instead of (insert age)",
        "You\'re damaging your (insert noun) if you (insert noun) looks like this or like this",
        "My most complemented (insert noun) of (insert year)",
        "I have been dating my girlfriend/boyfriend for # years here are # basics I learned that every guy/girl should do for a partner in (insert scenario)",
        "When I say I (insert action) everyday and I don\'t (insert action) everyday people always ask me…",
        "The reason you can\'t (insert dream result) to get that (insert dream result) you keep talking about is because…",
        "This is your (insert noun) on a regular day, this is you (insert noun) on (insert scenario)",
        "You guys know this look, when someone perfectly (insert action) and (insert action) I am obsessed with this (insert noun)",
        "You crave (insert noun) on your (insert scenario) here\'s why",
        "This is you (insert noun) when you (insert action), and this is your (insert noun) when you (insert action)",
        "I have (insert noun) commercial (insert noun)",
        "Stop (insert action) if you actually want to (insert dream result)",
        "This is how much (insert dream result) you achieve if you (insert action), and this is how much (insert dream result) if you (insert action) and these # of hacks",
        "If you want to (insert # of dream result) per week this is how you are going to do it",
        "This is for the homies who promised (insert person/persons) and nice and fancy (insert noun)",
        "What if I told you, you could (insert action) for only (insert low cost)",
        "Why did it take me over # years to realize you can make (insert result) in # minutes",
        "Don\'t hate me but I don\'t really mind (insert basic niche thing) but don;t worry I am going to show you how to make it way better",
        "(insert dream result) and (insert dream result) with these # of tips. For reference I have (insert personal result)",
        "Did you know that if you (insert action), (insert action), (insert action), etc",
        "Here\'s exactly how much (insert noun) you can make with under (insert dollar amount)",
        "The lack of clinical studies on (insert noun) isn\'t because it doesn\'t work, it\'s because…",
        "You\'ll never get (insert dream result) in your (insert age range) if you don;t do these 3 things when you turn (insert age)",
        "I make more money than doctors, engineers, and lawyers and no I didn\'t go to college for more than 6 years to get a degree",
        "I worked at (insert company) for X months/years and now I am exposing everything they keep from customers",
        "This is what (insert money amount) will get you in (insert location)",
        "How much do I need to make or buy a (insert price) (insert noun)",
        "I make (insert hourly rate) can I qualify/buy (insert loan/noun)",
        "Let\'s see what your monthly payment would look like if you owned (insert noun)",
        "Lets see what $1,800 a month gets you in (insert location)",
        "If you are paying over (insert price amount) for a (insert noun), you might as well buy a (insert noun)",
        "I have made a spreadsheet with over (insert large number) of (insert noun)",
        "This is (insert large number) of (insert noun)",
        "There is one thing above all that sets the top (insert title) apart from the rest",
        "This is how I would (insert action) if I were starting from scratch)",
        "If you\'re spending a lot of money on (insert noun) then you need to try this (insert recipe/method/strategy) because it\'s super easy and (insert dream outcome)",
        "If you have a (insert noun) you have probably experienced this",
        "(insert noun) (insert trait) (insert similar noun) (insert trait)",
        "It looks like you haven\'t done (insert noun) since (insert time frame)",
        "I don\'t know who needs to see this but if you have a (insert symptom) this is how I literally (insert dream result) every single time",
        "Oh look I found (insert $), that means I am going to (insert verb) I only need this",
        "One (insert noun), one (insert noun), and you have (insert time frame)",
        "The reason your (insert noun) sucks, is because you have no freaking (insert adjective)",
        "You\'ve heard of the viral (insert method/strategy/noun name) right? Well I invested that!",
        "(insert noun) I would make for you based on your favorite (insert noun)",
        "Here are (insert #) of (insert noun) from (insert noun) that I am going to (insert verb) in (insert time frame)",
        "How we saved (insert $) on our (insert noun), and one thing we wish we did differently",
        "This is everything I bought at (insert store) today to stay (insert adjective) at (insert age)",
        "(insert verb) is expensive. Here is how to (insert noun) for (insert time frame) for only (insert $)",
        "How to (insert verb) you (insert noun) from a (insert title)",
        "How many (insert nouns) can you make with only (insert $)",
        "I present a challenge (insert noun) (insert noun)",
        "This is every way to make (insert noun)",
        "If I have to learn (insert noun) again here\'s 5 tips of everything I would do in # seconds",
        "(insert company/individual) if I (insert verb) (insert noun) for you this is what I would do",
        "This is what it would (insert adjective) like if (insert number) of (insert noun) were in one (insert noun)",
        "This (insert adjective) (insert noun) gets (insert verb) by this (insert adjective) (insert noun)",
        "In this video see if you can tell what\'s real and what\'s (inset noun)",
        "I have no idea why I have no (insert adjective/noun)",
        "I avoid all toxic (insert noun), here is how to clean up your (insert noun)",
        "Here are # of questions I ask before (insert verb)",
        "Since (insert noun) from (insert prace/location) are basically (insert fact), you might as well learn how to make them from home",
        "Every wonder how the same (insert noun) can result in drastically different (insert noun)",
        "Here\'s what to look for when buying (insert noun) in (insert location)",
        "If your (insert noun) look like this, and this pay attention",
        "Today I am going to show you have to make the perfect (insert noun) because I went to (insert school) so you don\'t have to",
        "It took me # full hours to (insert verb) this (insert noun) and I originally allotted myself # minutes",
        "(Insert noun) (insert noun) (insert noun) where the 3 themes for this (insert noun). And you guys I delivered",
        "Take your (insert noun) from this to this",
        "I have to ask, girl, how do you (insert adjective) so good?",
        "I got to (insert verb) for (insert noun) (insert time), but let me just (insert verb) for a bit",
        "Give me 10 seconds and I will let you know what one suits you best",
        "Give me 10 seconds and I will let you know if you have a (insert noun) or a (insert noun)",
        "Anyone even notice how some people look naturally (insert adjective) without doing anything crazy",
        "If you\'ve ever secretly (insert action) and hope no one noticed this is for you",
        "Today we are going to play did you know (insert noun) edition",
        "If this is your first time being (insert adjective) I am (insert name) and I am trying to make it (insert adjective) to (insert verb) by using (insert noun)",
        "My (insert noun) never (insert pain point) no matter what I do",
        "(insert noun) level 1",
        "Here are # of ways to make (insert noun)",
        "Those little (insert nouns) are called (insert name) I am a (insert title) and I am going to show you how (insert result)",
        "You want to know why it takes (insert noun) to get (insert result) again",
        "Stop buying your (insert noun) like this, and start buying them like this",
        "Did you know this tip, it\'s going to blow your mind",
        "If I (insert action) right now would you believe me if I told you (insert truth)",
        "This is what (insert noun) looks like. I am a pro (insert title) and this is the proper way to (insert action)",
        "Does it actually matter what type of (insert noun) you use",
        "Let\'s (insert verb) our (insert noun)",
        "This is what you would (insert verb) for (insert person) if you weren\'t terrified to talk to them",
        "When making (insert noun) the (insert noun) is just as important as the (insert noun)",
        "Today I am going to show you the # most common ways to order your (insert noun) at a (insert place/location)",
        "Guys this is so nerdy but it\'s the coolest thing I have ever done with my (insert noun)",
        "(insert noun), (insert noun), (insert noun), makes a (insert noun)",
        "Here are # of (insert noun) from across the world, let\'s break them down to their core components",
        "There are way too many (insert noun) in the world that sort of all look that same, but are they?",
        "(insert noun), (insert noun), (insert noun), are the basic components of a (insert noun)",
        "Here\'s a little (insert noun) 101 for you",
        "These are the 3 most common mistakes I see when people are making (insert noun)",
        "A quick guide to (insert verb) (insert noun) some basic and some unusual",
        "I see so many people using their (insert noun) just like this or maybe like this even when you (insert action). So let me show you the trick to perfectly (insert action)",
        "Here\'s how the form of (insert noun) you add into (insert noun) affects them",
        "Why (insert action) like a normal person, when you can be a psycho instead",
        "This is everything I got for free on my (insert event)",
        "(insert noun) is my second (insert noun) so here are # of (insert noun) that I used to do a lot and I recommend my students as well",
        "If you gave me (insert time frame) to get a job as a (insert title) this is what I would do",
        "Did you know if you have a (insert noun), (insert noun), (insert noun), (insert noun), (insert noun) then you can (insert dream result)",
        "If you\'re the person who told me this I could kiss you right now because it literally saved my life",
        "I bought all the (insert noun) so you could find out which are the best in each category and which is not worth your money",
        "Here\'s how I get people the best (insert noun) on (insert noun)",
        "Did you know that there are # types of (insert noun)",
        "Here\'s how you can guess an almost perfect number every single time",
        "Here is how I make (insert noun) that lasts up to (insert time frame) and only costs (insert $)",
        "I teach (insert noun) to people like they are in kindergarten, and it\'s time for class",
        "(insert noun) can be reversed so let\'s talk about # things you can do to improve your (insert noun)",
        "This is how much (insert noun) you would lose at the end of the day with a (insert metric) (insert noun)",
        "Did you know your (insert noun) are programmed to make your (insert result)",
        "This might be the ultimate (insert person) hack",
        "To (insert verb) the (insert metric) in this (insert noun) the average would have to (insert action) for (insert time frame)",
        "If you (insert verb) this (insert noun) this is the amount of (insert noun) your body would (insert result)",
        "The worst (insert noun) that you will regret buying for your (insert noun) is right here",
        "(insert noun) how to (insert action) and still (insert dream result)",
        "Use this, to pay for this",
        "I paid (insert $) to build this (insert noun) from scratch)",
        "If I told you, you would (insert result) form (insert action) you would probably believe me right? Well here\'s the thing…",
        "How to budget with a (insert $) salary using this special (insert name) technique",
        "I spent (insert $) on new (insert noun) for my (insert noun)",
        "Here\'s a quick what to (insert result) (insert metric) of you (insert noun) legally",
        "(insert adjective) won\'t get this but hopefully you will",
        "This is the exact order in which you should be (insert verb) for all of your (insert noun)",
        "Why is it we are all so stressed about (insert noun) but we also all have a (insert noun) in (insert location)",
        "Today my kids (insert noun) is due. So let\'s (insert action)",
        "There are # things I like to do when I buy a new (insert noun)",
        "Here are # of things you have been putting off around the house that you can get done in # minutes",
        "Show me the method of the best way to (insert result)",
        "Why does nobody talk about the cost of (insert action)",
        "Top # ways not to (insert action) to the (insert person) you (insert noun)",
        "Top # deadliest (insert noun) that can kill (insert living thing) in one (insert verb)",
        "So this is (insert weight) of (insert noun) if I (insert verb) that to a (insert noun) what is that equivalent to for humans",
        "What is this? This is your (insert description of visual) and this is this #1 reason that (insert noun) die",
        "The easiest way to keep you (insert noun) (insert adjective) is to pretend…",
        "If you\'re wanting to transfer your (insert noun) from this into (insert noun)",
        "Let\'s see how many (insert noun) we can get out of this",
        "This was the most popular (insert noun) in all of (insert year)",
        "Did you know that you could (insert verb) a year\'s worth of (insert noun) in (insert time frame)",
        "That is crazy",
        "Give me 60 seconds to show you how to (insert action) for the first time after (insert life event)",
        "Want a (insert noun) that (insert dream result) even when you (insert action)",
        "Mom/Dad of # of kids, here is how I treat being a mom/dad as a job",
        "If you have a (insert noun) in your house and a (insert noun) I am going to show you guys the # of the best things we did to (insert dream outcome)",
        "If I could suggest any tip to any (insert person) out these it would be this",
        "If you want to do this in (insert year). If you want (insert dream result) you have 3 main options to make it happen. I am going to go over them right now",
        "Your (insert noun) is to (insert adjective) and (insert adjective). Here are # of (insert noun) to (insert result)",
        "If you (insert verb) and (insert action) and it doesn\'t (insert result) it\'s time to (insert action)",
        "I just made over # of (insert noun) in under (insert time) and I will show you how I did it",
        "If you want to add (insert noun) to you (insert noun) in (insert year) and you don\'t know what (insert noun) to get I got you",
        "If you storing your (insert noun) in (insert noun) stop what you\'re doing and watch this video",
        "We spent $ of (insert noun) for our family of #, and this will last us (insert time frame)",
        "People always ask me (insert name) (insert fact) (insert question) well, let\'s find out",
        "If you\'re wondering why when you (insert action) and don\'t (insert result). Then proceed to (insert action) and (insert result). It\'s because you are not doing this",
        "Whatever you do, do not let you (insert person) (insert action)",
        "I am sick of hearing this word (insert word)",
        "It starts off like this…",
        "After (insert time frame) of research here is why I choose (insert noun) and started (insert action)",
        "Does your (insert person) (insert action) like this?",
        "If you have a (insert person) at home, then (insert action) will dramatically change their (insert noun)",
        "I built this (insert noun) for (insert $)",
        "I bought this (insert noun) for (insert $) and let me show you what I did next",
        "In (insert year) the (insert company/person) introduced the (insert noun)",
        "Here\'s the only way I will ever (insert action)",
        "So I spent (insert $) at (insert store) on my last trip",
        "I turned one (insert noun) into # different (insert noun)",
        "(insert company) did not sponsor me this year, so here is how to make their (insert noun) at home",
        "Want a (insert person) who (insert dream result) every time, even when you don\'t (insert noun/action)",
        "It\'s (insert noun) season, so let\'s make a (insert noun) for your (insert person)",
        "Your favorite (insert noun) hacks from (insert year)",
        "It\'s wild to think (insert type of stores) still sell (insert noun) for (insert result). But not everyone knows they actually (insert result)",
        "I am not a DIY guy/girl but I am going to show you how I spent (insert $) to transform my (insert noun)",
        "3 (insert noun) we do not recommend for the first time (insert noun) owners/users",
        "How to stop (insert verb)",
        "People keep asking me what to do with (insert noun)",
        "Does (insert noun) really kill (insert live thing)",
        "I am going to show you how to (insert verb) your (insert noun) so they don\'t (insert pain point)",
        "Almost everyone thinks they know how to (insert action)",
        "Let\'s start by mixing (insert noun) and (insert noun) and I am going to give it a good shake. What happens?",
        "Apparently if you…",
        "Let\'s get this brand new (insert noun) (insert action) so we can put it to good use",
        "Throw out you (insert noun)",
        "This one mistake can actually kill your (insert living thing)",
        "This is kind of gross but I had to share",
        "(insert name), how do you (insert result)?",
        "We are going to text (insert noun), today on how (insert adjective) is it",
        "All you need is a (insert amount) of (insert noun) and you can turn (insert amount) of (insert noun) into (insert result)",
        "Here are # (insert noun) that you should never (insert action)",
        "If I can\'t do it in one step, I am not doing it. This is the #1 most efficient way to (insert verb) (insert noun)",
        "When (insert occurrence) you will probably need a better (insert noun) than this",
        "I found out why (insert noun) wasn\'t (insert result). So I am going to tell you what you\'re doing wrong",
        "This is the ultimate master trick to (insert result) in just # minutes",
        "Did you know you only need # of ingredients to make (insert noun)",
        "I am willing to bet, this (insert noun) is older than you",
        "Did you know our chicken is dunked in chlorine?",
        "The viral (insert noun) hack that landed me in (insert news/magazine outlet)",
        "I am a # generation (insert title) and I hope this shows you why you should (insert action) when (insert task)",
        "Here are the # (insert noun) items you need to throw in the garbage right now",
        "We\'re going to see if it\'s true, that (insert noun) are so filled with toxins that they don\'t burn when you hit them with a blow torch",
        "Believe it or not, this simple device can prevent (insert pain point), (insert pain point), and (insert pain point)",
        "Here\'s why I never use a (insert noun)",
        "Did you know you could take a (insert noun) like this, and quick (insert action)",
        "Here are # (insert noun) as a (insert title) I would never own",
        "Want to find out what\'s hiding inside one of these (insert noun) when they are not properly maintenanced?",
        "What I eat in a day on the (insert noun) diet",
        "These are # of (insert noun) I would not own as a (insert title)",
        "You should be able to look at her/his (insert noun) and see if come up to her/his (insert noun) here",
        "If you see (insert symptom), (insert symptom) especially on a (insert type of noun) you better worry about what\'s called (insert name)",
        "If you have a (insert noun) and you see that the (insert noun) is (insert observation) that\'s a dead giveaway that they are (insert action)",
        "(insert name), overused (insert noun)?",
        "Here are # human foods that can kill your (insert living thing)",
        "Before you ever take you (insert living thing) on a (insert action) for the first time you need to watch this",
        "Strange (insert noun) behaviors explained",
        "(insert name) what is your (insert title) trigger?",
        "What\'s the most overrated (insert noun)?",
        "The top # (insert noun) for (insert target audience)",
        "Here are the # (insert noun) that are the least likely to (insert result)",
        "If you (insert action) for (insert timeframe) what would happen?",
        "This (insert noun) has something in it called (insert name). (insert verb) enough of these and they will kill you",
        "Here are # of things, every (insert person) should keep in their (insert noun)",
        "Man this, (insert noun) in (insert location) is trash. Maybe I should just get this cheap (insert noun). Yeah I wouldn\'t do that if I were you",
        "This (insert noun) isn\'t bad for you. Yeah it has some (insert noun) but what does that even mean?",
        "So most people don\'t know that on a (insert noun) there is one (insert noun) every (insert noun) owner always (insert action)",
        "0 calorie (insert noun) I am not joking these are literally 0 calories",
        "This guy bought a failing (insert type) company for (insert noun). Now it\'s worth over (insert $)",
        "Stop wearing (insert noun), it really is just like wearing (insert analogy to represent damage)",
        "We all have that one (insert label) in our life",
        "But it\'s just an (insert noun) and it\'s (insert positive) how bad could it be? Well this (insert noun) has the same amount of (insert metric) as # (insert noun)",
        "What if I told you that you could eat this entire jar of (insert noun) for less calories than 2 servings of their (insert noun)",
        "A # calorie deficit per day, for a month should be around (insert pounds/kilos) of weight loss",
        "Welcome back to \"I can\'t (insert dream result)\" a series where I show you (insert routine/tutorial/steps to insert result) that take less than (insert time) to do/make",
        "What I am (insert verb) on my (insert goal) journey, (insert result) last month",
        "If your (insert current state) you can\'t just (insert result) like everyone else",
        "After over a decade of (insert action) here is what I wish someone would have told me from the start",
        "To everyone just doing (insert #) (insert action). Stop that",
        "If you want to (insert dream result), (insert action) is the worst thing you can do",
        "This is (insert metric) the exact same amount of (insert noun) you build everyday. If you (insert action) hard (insert #) times per week",
        "You want you (insert noun) to look like these? So did this guy",
        "If I had 90 days to go from being (insert current state) to (insert dream result) here\'s exactly how I would do it!",
        "You are (insert adjective) than you think",
        "You can put on/take off (insert metric) on your (insert mile/exercise/vertical/etc) in one workout with these simple tips",
        "If you have (insert symptom) you probably have (insert condition)",
        "If you (insert action) but don\'t when to (insert action). You could be losing up to (insert metric) of you (insert dream result) without even realizing it",
        "If your (insert verb) (insert noun) and then (insert noun) and then (insert noun) that is literally the worst thing you could be doing",
        "The worst possible thing that can happen to a man/woman is developing (insert result)",
        "I grew about # (insert metric) in the past year at (insert age) by fixing my (insert condition) and (insert condition)",
        "Person #1: (insert large number) Person #2: What are you doing? Person #1: (insert action) I want to get a (insert dream result) before (insert time)",
        "So you want to impress you (insert person) when you (insert action) this (insert upcoming time)",
        "Person #1: What aren\'t my (insert noun) (insert adjective)? Person #2: It\'s because your (insert common mistake)",
        "If you want to be the (insert adjective) person in the room, it all starts when you (insert action)",
        "If you have (insert pain point) but not much time to (insert action) and you want to (insert result) then save these (insert noun) and (insert noun) steps/routines/tips",
        "I\'ve had a (insert drea result) since I was (insert age)",
        "The reason I can (insert result) and be comfortable, not have any (insert pain point) is this right here",
        "I spent (insert #) whole years with (insert condition) so you don\'t have too",
        "I have a (insert metric) (insert noun) because this is one of my workouts/routines/steps/tips/strategies/methods",
        "If you can\'t (insert skill), then follow this one minute routine/progressional/tutorial and you will have (insert skill) by the end of this video",
        "If your (insert current state) then the easiest way to have (insert dream state) is to have (insert result)",
        "What would happen to you (insert noun) if you only (insert action) for an entire week",
        "Taking a (insert noun) can increase your (insert result) but only with one strategy",
        "If you\'re serious about getting (insert result) then this is the only video you will ever need so save it for later and watch till the end",
        "If I had to start over and (insert verb) my (insert noun) from scratch, these are the only (insert noun) I would do for someone that is new to (insert noun)",
        "Let\'s see what\'s inside (insert noun)",
        "This is the reason (insert noun) is the size they are",
        "Here is a tier list of the best (insert noun) sources based off of how good they are for you (insert noun)",
        "I don\'t really show the (insert noun) a lot of love because I don\'t like (insert action) but today I am going to show you (insert action)",
        "What if I told you to (insert verb) # (insert noun) everyday?",
        "What would happen if you (insert dangerous action)",
        "F*ck it, I am going to role # of (insert noun) in 60 seconds",
        "This is what a full (insert time) (insert action) looks like at top # (insert school) in (insert location)",
        "What\'s hommies, I am going to give you a cash course of what (insert noun) to ask for, based on what you want that (insert noun) to do for you",
        "If your between the heights (insert height) to (insert height)",
        "This is a great trick",
        "(insert $) in (insert time) and people still think you need a 9-5",
        "They say you can\'t (insert result) with (insert noun) but they\'re wrong",
        "Here are # of pricing mistakes we made when starting our (insert business)",
        "The (insert noun) of a (insert noun) will tell you a lot about the (insert noun)",
        "Here are some space saving (insert noun) hacks that saved our small space",
        "Do you feel (insert pain point) by your (insert noun) consistent (insert pain point)",
        "My friends and I turned this (insert adjective) (insert noun) into this (insert adjective) (insert noun) in just (insert time)",
        "What happened to (insert adjective) (insert noun)",
        "(insert noun) used to have (insert trait), now they don\'t",
        "Here is a complete cost breakdown to build my (insert sqft) home",
        "It cost (insert $) to build my own (insert noun), acting as my own general contractor. Here is the complete coast breakdown",
        "I paid (insert $) to build my own dream home and pool as an (insert title). Here is the complete cost breakdown",
        "I\'ve (insert verb) over (insert #) of (insert noun) here are # things I would never do",
        "If you want to (insert verb) in an exceptional (insert noun) you have got to stop half-assing things",
        "It\'s also super hard to get (insert result) especially with the (insert condition)",
        "It has taken me # years if (insert occupation/skill/hobby) to realize I have been (insert action) wrong this entire time",
        "Remember (insert method/strategy name) for you next (insert noun)",
        "Remember (insert #) (insert noun) combo for you next (insert noun)",
        "(insert industry/niche) tips for if you\'re broke",
        "What (insert noun) and (insert noun) do I really need?",
        "Every time you (insert action) your passing you (insert adjective) (insert noun) just because you don\'t know what they are",
        "Alright you little DIY freaks here\'s how to build the sauciest (insert noun) of all time",
        "Normally I would never say this but please stop (insert action) until you\'re ready to (insert action)",
        "(insert noun) for all the (insert condition) guys/girls out there",
        "How to take better (insert noun)",
        "This is every single (insert noun) in my collection",
        "Invest in (insert adjective) (insert noun)",
        "For people who (insert action) and are also into (insert noun) what the hell are we doing",
        "Here\'s how to build a good (insert noun) rotation",
        "This guy has made (insert $) profit in one day using the technique he is about to use",
        "This book will teach you more about the (insert niche/industry/topic) than all of these books here",
        "If you wear a (insert noun) or (insert noun) with (insert noun) and a different (insert trait) (insert noun) then you have (insert result)",
        "Every (insert noun) explained in one sentence",
        "If you keep failing your (insert noun), just figure out where you\'re failing it",
        "How long does it take to complete the impossible mile",
        "(insert noun) is believed to be super bad for us. Causing (insert symptom), (insert symptom), (insert symptom), and even (insert symptom)",
        "(insert noun) can make you go bald!",
        "I\'ll tell you a story, We have # (insert noun) that were invented to solve 3 different problems",
        "(insert industry) tier list for 2025",
        "How to start your (insert noun) from scratch",
        "Exposing the only (insert noun) you will ever need",
        "How to dress like a (insert person)",
        "Every (insert store type) has a million (insert noun) with different (insert noun). But some of them are more special than others",
        "This is exactly how you and your friends are going to get (insert result) before this (insert time)",
        "If you\'re afraid to (insert action), then (insert action)",
        "If you want to start a (insert noun) in (insert year) here are some things you are going to need",
        "Putting you on brands you may have never heard of",
        "This is an (insert noun), and this is an (insert noun)",
        "This (insert noun) and this (insert noun) have the same amount of (insert noun)",
        "A lot of people ask me what\'s better (insert option #1) or (insert option #2) for (insert dream result) I achieved (insert dream result) doing one of these and it\'s not even close",
        "For this (insert item) you could have all of these (insert item)",
        "He/she always (insert action), and he/she does (insert action)",
        "For this (insert noun), you could have all of (insert noun)",
        "This (option #1) has (insert noun) in it, and (option #2) has (insert noun) in it",
        "This group didn\'t (insert action) and this group did",
        "For this (insert noun), you could have this whole (insert noun)",
        "This is (insert metric) of (insert noun) for (insert price), and this is also (insert metric) of (insert noun) for (insert price)",
        "How long would it take you to go from (insert before state) like this (with pain point) to (insert dream result) with (insert desire)",
        "If you\'re between the ages # - # and you want to become (insert dream result) and I mean really (insert dream result). Then you have to do these # things",
        "This (insert noun) has (insert metric) and will get you (insert dream result), and this (insert noun) has (insert metric) and will get you (insert dream result)",
        "One (insert noun), and # of my (insert noun) have the same (insert metric)",
        "This is a (insert noun) from (insert restaurant/store/place) for (insert metric), and this is the same (insert noun) from (insert restaurant/store/place) for (insert metric)",
        "This is a (insert noun), this is also a (insert noun)",
        "This is (insert noun) before you (insert action), this is (insert noun) after you (insert action)",
        "These two groups (insert similar result) but this group (insert result)",
        "The (insert noun) offers you a (option #1) and a (option #2) what do you choose?",
        "(insert #) (insert noun) I would have this one if I was (insert verb), and I would have this one if I was (insert verb)",
        "This is (insert noun) at (insert metric), and it\'s perfect for (insert verb). This is (insert noun) at (insert metric)",
        "This is (insert metric) of (insert noun), this is also (insert metric)",
        "(insert metric) and (insert metric) both sides are (insert adjective) and look the same. Let\'s see why",
        "(insert result) (insert noun) vs. (insert result) (insert noun)",
        "Both these (insert noun) are exactly the same. I have not changed a single (insert noun). But this one is (insert metic) and this one is (insert metric)",
        "Would you feel more (insert trait) in this (insert noun) or this one?",
        "Both groups gained the same amount of (insert noun). Expect this grouped (insert action) # days a week, and this group (insert action) #",
        "Cheap vs. Expensive (insert noun)",
        "You will (insert result) a week if you (insert action) on a (insert journey). But you will only (insert result) this much a week if you (insert action) on a (insert journey)",
        "This is what your (insert noun) looks like when you don\'t take (insert noun). And this is what your (insert noun) looks like when you take (insert noun)",
        "This is me after (insert action) in the (insert location) with (insert condition). And this is me just (insert action) in the middle of (insert location)",
        "(insert item) (insert fact), (insert complete opposite item) (insert similar fact)",
    ],
    'comparison': [
        "This is why doing (insert action) makes you (insert pain point)",
        "This is how you (insert dream result) while (insert guilty pleasure)",
        "(insert item) (insert fact), (insert item) (insert similar fact), (insert complete opposite item) (insert similar fact)",
        "If you\'re really a (insert dream result), why aren\'t you doing (insert common belief)?",
        "Just because you do (insert action) doesn\'t make you a good (insert label)",
        "This is what (insert number) of (insert item) looks like",
        "If you are (insert action) just once per (month/day/year) than you are f*ucked",
        "This is me when I (insert action) (insert frequency), and this is me still (insert action) (insert frequency)",
        "No your (insert noun) is not cause (insert result)",
        "Let me de-influence you from (insert action)",
        "More (insert target audience) need to hear this, (insert common belief) will not (insert result)",
        "It\'s time to throw away your (insert item), you don\'t need it anymore",
        "They said, \"(insert famous cliché or quote)\" That\'s a lie",
        "Don\'t (insert action) until you\'ve done this one thing",
        "Stop using (insert item) for (insert result)",
        "You cannot be (insert dream result) before you enter (insert age group)",
        "I stopped acting like the (insert person/title) in my life and you shouldn\'t be the (insert person/title) either",
        "Your life is boring because you don\'t (insert action)",
        "This is (insert large number) worth of (insert noun)",
        "Just because you have never (insert action) before, doesn\'t make you a (insert label) person",
        "This is how we think we (insert pain point), but you would have to (insert action) on top of (insert action) # of times for that to happen",
        "(Insert noun) is actually a really good (Insert noun) for (insert result)",
        "If you look in the mirror and notice (insert observation) here\'s what you do to (insert dream result)",
        "I haven\'t done (insert common action) in over # years, and it\'s healed (insert noun)",
        "(insert dream outcome) that don\'t taste/look like pure bootyhole",
        "You are not (insert bad label), you are not (insert bad label), you just can\'t (insert adjective)",
        "My biggest regret in (insert life event) was (insert accomplishment)",
        "(insert action) I have never (insert action) before, to prove (insert action) is easy",
        "For the price of this many (insert noun) at the (insert place/store/restaurant) you could make this many at home",
        "If you (insert action) this (insert noun) then yes i\'m judging you",
        "You are (insert action) too many (insert noun) that you didn\'t know",
    ],
    'myth_busting': [
        "I have never met a single person that (insert action), (insert action), (insert action), (insert action), and still has time to (insert dream result)",
        "(insert well known person or brand) is trying to get this video removed from the internet because he/she exposes their product for being (insert negative result). Watch this now before it\'s gone",
        "What if I told you making your own (insert noun) is actually super easy and only costs (insert price)",
        "I said it before and I am going to say it again (insert mind blowing fact)",
        "There is absolutely no reason for you to be (insert pain point) every single day just because you are trying to (insert dream result)",
        "Don\'t make the mistake of (insert action), (insert action), (insert action)",
        "You are not bad at (insert action), you probably were just never taught how to (insert action)",
        "If you\'re a young (insert person) and you are a (insert result) (insert title), let me tell you something you got a bright future buddy",
        "I can\'t (insert verb) (insert noun) anymore",
        "Believe it or not this (insert noun) was not (insert verb) with a (insert noun)",
        "(insert noun) are not (insert adjective) and they are not a cop-out. I think they can actually be made into something really really (insert adjective)",
        "If your (insert noun) are not lasting you at least (insert time frame) you are probably doing them wrong",
        "This is why you should always (insert verb) your (insert noun) before (insert verb)",
        "You\'re using your (insert noun) wrong and I am going to show you how to use it the right way",
        "Everyone on the internet is going to tell you making (insert noun) is impossible. But I am going to show you how to make them from home",
        "I will let you in on a secret (insert verb) is the easiest thing in the world",
        "Are you still (insert verb) (insert noun) like this? While I worked at (insert noun) and let me show you how to do it like a pro",
        "Instead of (insert verb) (insert noun) like this, try this method instead",
        "(insert verb) does not mean your (insert adjective), it means your just (insert adjective)",
        "If you (insert action) like this, then you\'re doing it wrong",
        "I am going to hold you hand while I tell you this. If you only have # of (insert noun) you are not doing it the right way",
        "(insert noun) are not as disgusting as you think",
        "(insert noun) is better for (insert result) than (insert noun). And yes I am going to back up my claim with studies",
        "Being (insert result) is not just based on (insert noun). You may not believe this but I could have been (insert adjective) then this guy/girl if I had just changed a few things",
        "I started my (insert business) when I was (insert age) with (insert $)",
        "X years ago my (insert person) told me (insert quote)",
        "I have (insert time) to get my sh*t together",
        "I don\'t have a backup plan so this kind of needs to work",
        "This is how my (insert event/item/result) changed my life",
        "So about a month ago my (insert person) and I did (insert action)",
        "I have (insert action) over (insert #) in my life",
        "This is a picture of my (insert what picture is)",
        "X years ago I decided to (insert decision)",
        "Yesterday I was at (insert location) when I noticed something (insert adjective)",
        "X years ago I was (insert action) because I (insert pain point)",
        "Is it possible to (insert action) while (insert action) in X days",
        "When is it time to do (insert action)",
        "So I did (insert action) last week",
        "When I was (insert description) I was always (insert bad habit)",
        "If you are anything like me, you take your (insert event/item) very seriously",
        "In (insert time), I went from (insert before state) to (insert after state)",
        "X years ago we (insert action) to (insert result)",
        "Hi I am (insert first name) and I am starting (insert business) from scratch",
        "This is the story of how I managed to do (insert achievement)",
        "I am (insert age) having an identity crisis",
        "(# days/months/years) ago I quit (insert thing)",
        "This is probably the scariest thing I have ever done",
        "This girl/boy was in her/his flop era",
        "Is it possible for (insert description) to make (insert $) a month?",
        "I did everything right",
        "So I recently started feeling \"the pressure\" everyone talks about",
        "Can you (insert dream result) after (insert shortcut)",
        "After X years of I (insert action) because I realized one thing: (insert statement)",
        "It all started when (insert person) (insert action)",
        "X years ago (insert people) (insert action)",
        "I\'m (insert action) in (insert time) and I just (insert action)",
        "1 Year Ago today, I ___",
        "I\'m (insert age) and I\'m not ashamed to admit that >>",
    ],
    'storytelling': [
        "When I (insert action), people said (insert feedback)",
        "X days/weeks/months/years into my (insert action), my worst nightmare became my reality",
        "It all started when this boy/girl, (insert action)",
        "X days/weeks/months ago my (insert person) and I (insert action), (insert action), and (insert action) this is how it\'s going",
        "I started my (insert business) when I was (insert age) with (insert $)",
        "X days/months/years ago my (insert person) told me (insert statement)",
        "When I (insert action), people said (insert feedback)",
        "I woke up this morning thinking about (insert thought)",
        "X days/months/years I (insert life event) and decided to quit (insert bad habit)",
        "X days/months/years I started (insert action) again after being stuck at (insert pain point)",
        "X days/months/years I started (insert action) thinking it would magically solve (insert pain point) but here is what ended up happening",
        "I am an X year old (insert occupation) from (insert location) and I just (insert action)",
        "I don\'t have a backup plan so this kind of needs to work…",
        "This is how my X changed my life",
        "I have (insert action) over (insert #) in my life",
        "This is a picture of my (insert what picture is of)",
        "X days/months/years ago I decided to (insert decision)",
        "Yesterday I was at (insert location) when I noticed something (insert adjective)",
        "X days/months/years ago I was (insert action) because I (insert pain point)",
        "Is it possible to (insert dream result) while (insert action) in X days",
        "When is it time to do (insert action)",
        "So I did (insert action) last week",
        "When I was (insert description) I was always (insert bad habit)",
        "If you are anything like me, you take your (insert action) very seriously",
        "In (insert time frame), I went from (insert before) to (insert dream result)",
        "X days/months/years I (insert big risk)",
        "I am starting/started a (insert business) from scratch",
        "This is the story of how I managed to do (insert achievement)",
        "I am (insert age) having an identity crisis",
        "X days/months/years ago I quit (insert habit)",
        "X days/months/years ago I stopped (insert action/or habit) and started (insert action/or habit)",
        "This is probably the scariest thing I have ever done",
        "This girl/boy was in her/his flop era",
        "Is it possible for (insert avatar) to (insert dream result)?",
        "I did everything right/wrong",
        "So I recently started feeling (insert feeling) everyone talks about",
        "Can you (insert dream result) after (insert shortcut)",
        "After X years of (insert action/or habit) I stopped/started (insert action/or habit)",
        "It all started when (insert person) (insert action)",
        "X days/months/years ago (insert people) (insert action)",
        "X days/months/years, I ___",
        "I\'m (insert age) and I\'m not ashamed to admit that",
        "The secret is out I am (insert action)",
        "I got (insert dream result) without (pain point/points) here\'s how",
        "So I (insert shocking action) for over (insert time frame)",
        "So I messed up",
        "I developed an X addiction so strong I physically can not stop (insert action)",
        "X years it took me from (insert bad situation/result) to (insert good situation/result)",
        "X Months/Years ago I (insert action) to (insert action)",
        "I (insert action)",
        "There is nothing more embarrassing than X",
        "I am a (insert title) by day and a (insert title) by night",
        "Come with me to make (insert object)",
        "Come with me to break up with (insert object/company/etc)",
        "I started (insert business) at (age/life event) and I had no idea I would (insert result/outcome)",
        "You know the feminine urge to open (insert business)",
        "It\'s been (insert time) since we (insert experience)",
        "I think (insert belief/opinion) so I have been taking matters into my own hands",
        "I was shocked when I found out (insert fact)",
        "So I just turned (insert age)",
        "This is how I got to (insert cool opportunity) in my X week/month/year of doing/starting (insert business or job)",
        "What happens when you (insert action) then you end up (insert result) but you (insert challenge)",
        "What if I told you that (insert dream result) without (insert pain point)",
        "I went on # of (insert noun) this year, and here is the one trait I learned that you need to have to (insert dream result)",
        "X days/months/years ago I was (insert action), every waking hour because I was (insert trait) and I wanted (insert result)",
        "X days/months/years ago I was (insert life event), because I was (insert action) instead of (insert action)",
        "This is (insert person) we have known each other from X years, X days, X hours, X minutes",
        "Put a finger down if you told the entire internet you were going to create a (insert noun) without having any idea how to (insert action) or any idea how to start?",
        "I think (insert noun) should be better than this, so i;ve been taking matters into my own hands",
        "This is me (insert life state), yes my (insert observation) all my (insert persons) were (insert action) but I couldn\'t because I had to (insert scenario)",
        "I used to be in a super toxic relationship back in (insert time frame) so let me tell you about it",
        "How I married my middle school/highschool/college girlfriend/boyfriend",
        "(insert person) always expects you to have (insert result) but the problem is….",
        "My (insert label) (insert name) and I, started (insert business) in (insert year)",
        "X days/months/years ago my (insert label) (insert name) and I (insert action) to (insert result)",
        "You are not (insert label) is something I wish I could have told my younger self",
        "Is it possible to get (insert dream result) with only (insert action) for only 1 day",
        "I have no idea what I am doing at (insert place)",
        "I got (insert result) at (insert age) and (insert result) by (insert age) if you are scared about (insert result) this is for you",
        "Is it possible to (insert action) successful (insert noun) for (insert noun) in just 1 hour?",
        "(insert year) - I think I am going to (insert goal)",
        "So I bought this (insert noun) last week and quickly realized I have no idea how to (insert action)",
        "X days/months/years ago I bought a (insert noun) as a (insert age) with a full-time (insert job)",
        "We (insert action) over # of the most (insert adjective) (insert profession) and # responded",
        "I hate to say this but my wake up call wasn\'t as (insert scenario) no my first wake up call was (insert scenario)",
        "Is it possible to get (insert dream result) without your daddy being the CEO of apple",
        "If you\'re new to this channel let me catch you up",
        "The worst part about being a (insert title) is I literally do not…",
        "Living in a (insert adjective) household has led me to literally having (insert bad result)",
        "Nothing could have prepared me for how it feels being in your (insert age group) and (insert situation)",
        "So apparently your frontal lobe does not develop fully until your age 25, so here are some things I have realized since it came in",
        "I tried a # hour (insert noun) routine, which is much harder than you think",
        "You think you\'re a (insert label)? Well let me introduce you to my life",
        "My (insert person) and I tried a whole (insert time frame) without (insert action)",
        "(insert quote) the first time I heard this I was (insert action), and my (insert person) just dropped that line out of nowhere",
        "Build a (insert noun) with me while I (insert action)",
        "I have had 0 (insert noun) in (insert time frame)",
        "It was until I build # of (insert noun) and completed over # of (insert noun) that I realized (insert action) is not really that complicated",
        "X days/months/years ago me and my (insert person) bought (insert noun) for (insert price)",
        "I am (insert life event) in (insert time frame) and I just wrote a letter that I wish my (insert age) self would have read",
        "I am leaving my (insert salary) dream job at (insert company) to (insert action)",
        "This is day # of making fake (insert noun) for our dream clients until one of them starts working with us",
        "X days/months/years ago I went extremely viral for (insert action)",
        "Have you ever wondered why (insert noun) (insert adjective) is much better than (insert noun)",
        "For those of you who don\'t know I have been bootstrapping a (insert business type) to see how big I can scale it",
        "When I told my (insert person) I was going to start doing this he/she thought it was the worst idea ever",
        "These are dumb things I have done in (insert stage) of (insert action) for my (insert noun)",
        "This (insert noun) single handedly changed my career",
        "Have you ever tried to (insert action) something that was supposed to look like this but ended up looking like this",
        "Hi my name is (insert name) and this was me (insert time frame) ago a (insert label) in (insert noun)",
        "Day # of (insert action) until I (insert dream result)",
        "I just (insert action) to make (insert noun)",
        "I (insert action) to every (insert person) in the world. Here is how many people responded",
        "What happens when you (insert action), (insert action), (insert action), etc",
        "Ever since I was (insert adjective) my (insert person) made it very clear to me that he/she was (insert adjective) about certain aspects of (insert noun)",
        "One day you\'re gonna get dumped. Not by your girlfriend, not by your boyfriend, not by your fiance, not by your spouse. But by your (insert noun)",
        "I am (insert name) (insert age) you might know me from my (insert accomplishment), (insert accomplishment), or (insert accomplishment)",
        "I was today years old when I found out that if you have (insert trait), (insert noun) will look really (insert adjective) on you",
        "People are shocked to hear that these are my natural (insert noun)",
        "Have you ever noticed that some (insert noun) feel (insert description) while others feel (insert description)",
        "This video got # of views, with a lot of (insert adjective) feedback. Let\'s try it out and see if it makes a difference to my (insert noun)",
        "If you\'ve ever come across one of my reels and thought (insert adjective) that woman/man has (insert adjective) (insert noun). But here\'s a little secret: my (insert noun) was not always like this",
        "Welcome back to my (insert noun) series where I will be teaching you everything I know, no gatekeeping here",
        "After (insert time period) of having (insert bad result) come get my (insert noun) done with me",
        "Hi I am (insert name) and I am a (insert negative label)",
        "Here is how I lost a (insert time frame) of my life",
        "I feel really bad for saying this but sometimes you just need to (insert harsh truth)",
        "As you may know I have been (insert action) to (insert dream result)",
        "I (insert action) almost everyday for a week and here is what happened",
        "(insert action) everyday has literally changed my life. In particular helping me (insert dream result)",
        "I had this weird idea that if I added some (insert action), (insert action), (insert action), etc…",
        "Did you know that if you combined (insert noun), (insert noun), (insert noun), etc…",
        "When you\'re sad but then you remember you have (insert noun)",
        "I spent (insert price) on a (insert noun) here\'s all the (insert noun) I got",
        "You know those days where it feels like (insert scenario) well today was that day for me",
        "I have (inset amount of thing), (insert amount of time), and a pipe dream to get ready for (insert event)",
        "So I was just (insert action) to do my (insert action) of the day when I saw that…",
        "Welcome back to another episode of (insert series name) where I (insert action)",
        "We are not even (insert time frame) into (insert year) and have gone from being a (insert before state) to (insert after state)",
        "I (insert action) but I don\'t have (insert noun)",
        "I worked (insert hours) in just (insert days) making all of this (insert noun) for my (insert noun)",
        "If you told (insert age) me that I wouldn\'t be a (insert title) I would probably tell you to go screw yourself",
        "I (insert action) all of the (insert noun) you want with all the (insert adjective) that you need",
        "Someone just (insert negative result) my business",
        "Can you please pack my (insert price) (insert noun) with me? Of course!",
        "The ultimate assembly video of my (insert huge metric) (insert noun)",
        "I am on a journey to find the best (insert noun) for (insert target audience) and today we went to (insert location)",
        "Here\'s how I made a wireless (insert noun) that is valued at (insert price)",
        "We pretty much (insert action) our entire (insert noun) into (insert noun)",
        "X days/weeks/months/years ago I purchased (insert price) (insert noun) as a (insert label) with only a (insert price) deposit",
        "For our entire # year relationship my (insert person) has been hiding something pretty important from me",
        "I always had the biggest dream of (insert dream)",
        "(Insert noun) is cringe right now but let me tell you what a game changer it was for me",
        "Hey everyone I am (insert name) I am (insert age) and I am starting a (insert business) from scratch",
        "I didn\'t realize how bad I lost myself",
        "I just left my (insert salary) a year new grad job, and now I am just a disappointment",
        "Me and my (insert person) are supposed to be (insert action), but instead we (insert action)",
        "(insert year) (insert occurrence)",
        "I think I got (insert verb)",
        "My (insert person) wanted a (insert noun) for (insert event) so I said thanks for the suggestion but that\'s not my vibe and made them (insert noun) instead",
        "I\'ve (insert verb) this almost every single day of my entire life",
        "Buying things I don\'t need because I have adult money",
        "A fun fact about my (insert person) (insert name) is",
        "My entire life I grew up (insert adjective) and (insert adjective) it was just my (insert person) raising the # of us",
        "I spent an entire (insert time) (insert verb) but was it a waste of time?",
        "I am about to go on the biggest bender of my entire life!",
        "I think I am getting (insert verb) today",
        "Welcome back to me (insert verb) my (insert person) (insert noun)",
        "I always wondered what it was like to (insert action)",
        "So (insert time frame) ago me and my (insert person) had a little too much fun",
        "Selling (insert noun) at (insert location) has made me more money than my (insert person/title) and today I am going to be investing that money into (insert noun)",
        "Welcome back to day #, where I (insert verb) a (insert noun) everyday until I am (insert adjective)",
        "(Insert person), (Insert person), or that one (Insert person) we just don\'t have (insert title) like we did back then",
        "Day # of trying to (insert action) all year",
        "This was the (insert noun) that changed my life forever",
        "Over # of you saw this video",
        "Today I woke up and realized (insert realization)",
        "I am (insert verb) a (insert noun), on my (insert noun)",
        "Remember that time you were (insert adjective) so you (insert action) but the moment (insert person) (insert verb) you (insert action)",
        "Okay real talk, I wasn\'t always this (insert adjective)",
        "Is it possible to stop (insert pain point) and (insert dream result) in (insert time frame) even if you\'re in (insert noun) and all of your (insert person) think getting (insert verb) is (insert trait)",
        "(insert question) I hate this question",
        "Last year I (insert verb) (insert noun) for (insert $)",
        "Let\'s make (insert #) (insert noun)",
        "I had just (insert time) to (insert verb) (insert #) of (insert noun) for a (insert person). And you have until the end of the video to guess who they are for",
        "I only have (insert time) to finish over (insert number) of (insert noun) orders, including (insert number) of (insert noun), (insert number) of (insert noun), (insert number) of (insert noun), and (insert noun)",
        "I (insert verb) (insert number) (insert noun) and I had to throw (insert number) of them away",
        "Have you ever seen (insert #) (insert noun) in one place?",
        "I have a confession. I have no problem (insert verb) for my (insert noun) but it\'s the process of actually (insert noun) that feels so (insert adjective)",
        "I am (insert age) and I have an identity crisis",
        "I have been a (insert title) for # years of my life I started when I was # years old working at (insert location/place) in (insert location)",
        "When I was growing up one (insert noun) I always (insert verb) with my (insert person) was (insert noun)",
        "Once upon a time we bought a (insert noun) on (insert noun)",
        "If I want my (insert person) to be (insert dream result one day) that means I got to (insert action) now",
        "Hi I am (insert name) and I have been secretly (insert action) for # years",
        "Can you name something more terrifying than a (insert person) with a (insert noun)",
        "This is the ultimate assembly video of my (insert noun)",
        "So (insert time) ago my (insert person) and I bought a (insert noun)",
        "I am on a journey to find the best (insert noun) for (insert person) and today we (insert action)",
        "This week I tried to see if I could (insert result) for all of my (insert noun) just by (insert action) the night before",
        "In (insert year) I started (insert action) and I gave my life to (insert person)",
        "I lied to the (insert person) who (insert action)",
        "Something I never thought I would have on my bingo card as a (insert title) was…",
        "I had to spend (insert &) on this free (insert noun) before it even started",
        "I just left my 9-5 corporate job to start my (insert business",
        "I feel like # years ago I had my life together as a (insert title) but just slowly over time things have shifted",
        "(insert year) I met my (insert person) when working at (insert job)",
        "My house has this weird (insert trait) and it\'s haunted me ever since I first toured",
        "My (insert person) and I moved in together and ended up losing (insert $)",
        "X years ago we decided we wanted to know exactly where our (insert noun) was coming from",
        "I made (insert $) doing (insert side hustle) as a side hustle",
        "I have no intention of…",
        "Growing up my parents used to get upset when I (insert action), (insert action), or (insert action) they would get frustrated",
        "Hi my name is (insert name) and this is my home",
        "This is how much (insert adjective) (insert noun) cost me in (insert location) and a (insert age) (insert occupation)",
        "Nearly # years/months ago today I packed my bags and left for (insert location), thinking I would only be gone for (insert time)",
        "I am attempting to be the first person to (insert goal), day #",
        "When we first moved to the (insert location), my (insert person) bought a (insert noun) in (insert location)",
        "My (insert person) told me he/she wanted a (insert noun) and instead of waiting around I decided to build it right now",
        "My parents had # sons/daughters/kids thiers me, my (insert person), and (insert person)",
        "(insert time) I bought a (insert adjective) (insert noun) because it\'s cheaper than a (insert adjective) (insert noun)",
        "Did you know that if you wake up at (insert time), and (insert action)...",
        "I already know I am going to get a bunch of hate for this but the (insert noun) is getting taken out today",
        "People know me for nearly losing (insert noun) and dying in (insert location)",
        "I am going to do it, i\'m going to flip this… house",
        "Dude, it\'s day #. And I almost went (insert result)",
        "My (insert person) lives (insert exact number of miles) away from my house",
        "Why am I (insert action) at # months pregnant?",
        "Last year for (insert holiday) we (insert action)",
        "We spent all day (insert action), burning through (insert metric) of (insert noun), and now I am having a fully blown (insert noun) choice crisis",
        "Day # of my (insert persons) room makeover. Which I kind of took to the extreme but let\'s start from the beginning",
        "Every year we make the questionable decision of (insert decision)",
        "This is what I (insert action) in a day as someone who is trying to (insert action) less and (insert action) more",
        "I have been (insert title) for (insert time) now, and I have gained (insert #) of followers just by sharing (insert content type)",
        "My (insert person) hasn\'t (insert action) in over # years",
        "I have a problem. Which is that my (insert noun) it (insert pain point) and (insert pain point). So i\'m going to build my own (insert noun) that has (insert benefit)",
        "This week in fatherhood/motherhood I am please to report that I (insert result)",
        "Some say the strongest bond is between (insert person) and his/her (insert person)",
        "Hi i\'m (insert name) and I am a (insert title), this is my (insert person) and he/she loves (insert noun)",
        "What is this massive stack of (insert noun) that I am holding in my hand, well it is the (insert noun) for the (insert number) of (insert noun) I have done this year",
        "I (insert traumatic event) at (insert age) but it\'s what happened after that, that actually changed my life",
        "I was walking past this (insert store) when I say they had (insert noun)",
        "Fourtnely my (insert person) and I have a tendency to be a little bit impulsive",
        "Yesterday I (insert action) in (insert hours) and (insert minutes)",
        "Would you buy a house with no (insert noun), well my (insert person) did!",
        "How long does it take to catch (insert high number) of (insert noun)?",
        "We got an insane deal on our (insert noun) a year ago because it needed to be (insert action)",
        "There is a man/woman that comments on every single video I upload",
        "Buying (insert noun) that need a lot of work, can work out in your favor",
        "In # days I am selling my (insert noun) and moving out of the country",
        "I think of my (insert noun) as my own personal (insert noun)",
        "It\'s been (insert time) since I bought my dream (insert noun), and I want to take you through what the last (insert time) has been like",
        "(insert $) home (insert bad result) in just # time/months",
        "Come with me to (insert action) the (insert title) didn\'t (insert action)",
        "I am revmong all my (insert noun) friendly upgrades before we (insert action). Today we are removing (insert noun)",
        "Let\'s try to unclog a (insert noun)",
        "This is what my morning looks like while (insert situation)",
        "Last night at around (insert time) (insert person) began textbook stage one (insert scenario)",
        "After many years of total neglect my basement is finally getting much needed TLC",
        "How (insert action) ended with a (insert person) at my house telling me how lucky we are that (insert accident) didn\'t happen",
        "Customer called me up because they had (insert situation) and wanted it (insert result) immediately",
        "While my kids were taking a nap I went to (insert action) when I realized (insert realization)",
        "My one goal this year was to showcase just how interesting (insert noun) is",
        "I don\'t usually cry, but yesterday I did. And it wasn\'t because of (insert reason)",
        "You know when I started making (insert noun) I should have known this day would come",
        "I got a (insert noun) and it did not turn out to be what I expected",
        "About a (insert time) ago I got in trouble for having too many (insert nouns)",
        "I baited this (insert google rating) (insert title) with this (insert noun) in excellent condition to see if they would rip me off",
        "I took my (insert person) to (insert location) to try this (insert noun) and it actually caught something",
        "I opened up a (insert business/store) in the middle of (insert location) and I can\'t believe how much money I made",
        "I took a (insert hour) and (insert minute) (insert noun) to (insert location) and here\'s how it went",
        "(insert verb) (insert noun), (insert action), and don\'t (insert result). Welcome to (insert event)",
        "This is life as a (insert noun) addict part (insert #)",
        "Welcome back to the journey of how I got (insert result)",
        "Come take a (insert noun) with me that I did not (insert action) for at all",
        "It\'s been (insert time) since I have seen myself with (insert feature) and that\'s all about to change",
        "This was me when I was (insert pain point), (insert pain point), and (insert pain point)",
        "From being (insert state), to (insert state), back to (insert state), to (insert state), to now being (insert current state) in (insert time) I have built tons of knowledge when it comes to (insert result)",
        "I have (insert event) in (insert time) and I have not started (insert action). And if I don\'t do well I have to (insert consequence)",
        "Today I am eating like (insert person) for the full day and I am going to see how much weight I gain by the end of the day",
        "(insert time ago) my (insert person) (insert action) when my (insert person) passed away",
        "(insert time) I started accepting the choice to (insert drastic change)",
        "2 years, no (insert noun), and today\'s the first time I get to use (insert noun)",
        "Does this stuff actually work?",
        "I gained (insert pounds/kilos) during (insert life event)",
        "I am letting (insert business type) companies, control my (insert noun)",
        "So I am (insert age) and I work nights at (insert store) that\'s the dream life right?",
        "So it\'s been a week and I am already on (insert number) of followers",
        "So when I was (insert age) I started taking (insert noun) and at (insert age) I had to (insert action)",
        "I used to always be the guy that had a (insert condition), (insert condition), and always struggled with (insert condition)",
        "My (insert person) takes me to the doctor, because I am (insert age) and already (insert action)",
        "It has come to my attention that some of you guys think I am actually (insert result) when I do (insert content type)",
        "A little over (insert time) ago I posted a video about the benefits of (insert action)",
        "I did (insert action) everyday for one year, and here\'s what\'s different",
        "I can confidently say the only reason I can (insert verb) (insert metric) is simply because of the way I choose to (insert verb)",
        "A competitor showed up at my job trying to get me fired",
        "I damaged a customer\'s property and here\'s how I handled it",
        "A customer (insert result) and tried to avoid paying",
        "I was harassed by (insert noun) so I had to do this",
        "Alright this is officially day #1, trying to make (insert $) a month with (insert business)",
        "I am a retired (insert title) who now owns a (insert business). So come with me to collect the quarters",
        "Did you know you can start your own (insert business ) from home without (insert pain point), (insert pain point), and (insert pain point)",
        "I would like to welcome you to my (insert location)",
        "Let me show yall how to make (insert $) per day, but installing a simple (insert noun)",
        "Have you ever thought about starting your own (insert business)?",
        "Day # of trying a new hobby to recover from burnout",
        "My (insert noun) made me (insert $) last month, and what\'s crazy about this is I used no money to start this business",
        "Make (insert noun) and (insert noun) with me from my online (insert business) and a (insert label)",
        "Hi i\'m (insert name) a (insert #) generation (insert title) who shares tips about (insert niche) and (insert result)",
        "Starting a (insert business) at (insert age)",
        "Welcome to day # of starting my life over at (insert age)",
        "I have something to address, over the last week I have gained (insert #) of followers",
        "This is how I ended up taking the biggest risk of my life",
        "In 1 year I (insert verb) over (insert pounds) of (insert noun) in my extremely small (insert location)",
        "I f*cked up. I bought literally a (insert metric) of (insert noun). And for the last (insert time) I have been turning them into (insert results)",
        "I finally built it. For the last # years I\'ve been turning (insert noun) into (insert noun)",
        "Is it possible to go from (insert before state) to (insert after state) just by (insert action)",
        "We are now at day #, since starting my (insert project)",
        "Proof that a (insert noun) can totally transform a space",
        "Alright today we are building this (insert $) (insert adjective) (insert noun)",
        "Here is how we transformed my (insert persons) (insert location) from this to this using (insert noun)",
        "There;s probably a reason why most people don\'t (insert action)",
        "I bought this (insert noun) for (insert $). And today my (insert person) and I will find out if it (insert result)",
        "I can\'t stand this (insert noun), let\'s transform it",
        "Over the past # days I (insert action) on # of (insert nouns). In doing that I have gained over (insert #) of followers. So here\'s the thing",
        "Over the last (insert time) I have been finding a lot of cool things over (insert location). And today I am finally finishing my (insert project)",
        "Do you ever (insert situation), yeah well that\'s my job",
        "I bought this (insert noun) for (insert $), and I am going to make it worth over (insert $) without changing the product in any way",
        "This might be the coolest DIY I have ever made",
        "Some people call it a problem but I call it (insert noun) genius",
        "With the (insert life event) coming, it\'s time to (insert action)",
        "This is (insert large number) of (insert item)",
        "This is my (insert item) and this is (insert random action) if I were (insert random action)",
        "You\'re losing your boyfriend/girlfriend this week to (insert event/hobby)",
        "What (insert title) says vs what they mean",
        "(insert trend) is the most disgusting trend on social media",
        "I do not believe in (insert common belief), I believe in (insert your belief)",
        "If you like these (insert job title), you\'ll probably like my (insert work)",
        "(insert big brand) didn\'t want to sponsor this video, let me show you what they\'re missing out on",
        "I am trying a different (insert noun) for each letter of the alphabet",
        "My (insert person) has never been in the (insert place) before let\'s see if she can tell who is (insert adjective) or not",
        "If I get this in, then I have to (insert verb)",
        "My (insert before state) used to look like this and now they look like this",
        "10 YEARS it took me from (insert before state) to (insert after state)",
        "How to turn this into this in X simple steps",
        "(insert big result) from (insert item/thing). Here\'s how you can do it in X steps",
        "Over the past (insert time) I\'ve grown my (insert thing) from (insert before) to (insert after)",
        "Just # (insert item/action) took my client from (insert before) to (insert after)",
        "My customer/client got (insert dream result) without (insert pain point)",
        "If I were to create a collab campaign for (insert big brands) here\'s how I would do it",
        "How I got my (insert item/thing) from this to this",
        "I became a (insert achievement) at (insert age) and if I could give you X pieces of advice it would be…",
        "Everyone is complimenting on my (insert noun) because of one (insert noun) routine that I do",
        "I lost over (insert metric) in (insert time frame) and here are the # of things I would do if I was to start all over",
        "My customer/client got (insert dream result) with out (insert pain point) and here\'s how",
        "I am in a (insert noun) and these # habits dramatically transformed my (insert noun)",
        "I got (insert dream result) on all of my (insert noun) with minimal (insert action) and here\'s how",
        "If I were to create a (insert noun) today this is how I would do it",
        "If I ever made it to the news I thought it would at least be for something illegal, turns out it\'s for (insert dream result)",
        "(insert well known brand) commented that I am their new favorite (insert title)",
        "What I (insert action) in a day as someone who has achieved (insert dream result)",
        "I literally used to have a (insert before state)",
        "My (insert noun) went from this to this in the last (insert time frame) and this is what I done",
        "I have been pretty much doing the same (insert noun) for the past (insert time frame) and they have legit (insert dream result)",
        "When I was (insert before state) I was constantly (insert pain point)",
        "In (insert year) my business made (insert dollar amount)",
        "As a (insert title) for several years whose (insert action) I often get asked (insert name) (insert question)",
        "I have never ended (insert noun) with a (insert result) or below",
    ],
    'random': [
        "He/she (insert action) for one day and got (insert dream result)",
        "I jumped my (insert noun) from (insert before state) to (insert dream result)",
        "This used to be my (insert noun) this is my (insert noun) now",
        "I have been able to go from this, to this",
        "Things I wish I knew before my (insert noun) that took me from this to this",
        "The (insert noun) I (insert action) everyday that took me from this, to this",
        "I went from this to this",
        "No because my transformation from (insert age) to (insert age) ought to be studied",
        "After (insert dream result) here is one thing I learned the hard way so you don\'t have to",
        "Okay bish you don\'t need to (insert action) to (insert dream result) coming from someone who (insert dream result)",
        "I (insert dream result) in the past (insert time frame), here\'s proof",
    ],
    'authority': [
        "Here\'s how my student/client/customer went from (insert before result) to (insert after result) and (insert symptom due to result)",
        "% of the time when I am in (insert situation) I get (insert result), and today I will be showing you my (insert noun) routine so I can help you achieve (insert dream result)",
        "I (insert verb) for (insert time frame) and I got a (insert dream result)",
        "This is how I got my (insert noun) from this to this completely natural",
        "Nobody believes me if I say I went from this to this",
        "These are the products I use to keep (insert noun) (insert noun) and (insert adjective) as a (insert title)",
        "Same recipe but different (insert noun). For this (insert noun) I used my # tips to make (insert dream result) at home and you can really tell it makes a big difference",
        "(insert noun) is my second (insert noun) and here are the # (insert noun) I did over, and over, and over again to improve my (insert noun)",
        "How I took this (insert title) from 0 to (insert #) of (insert noun) in 1 week",
    ],
};



// CTAs for Follows & Sales (38 CTAs)
const CTA_FOLLOWS_SALES = [
    `Follow for more (industry) education!`,
    `Want results like my clients? Comment X for more information!`,
    `Add in before and after screenshots to make it more effective!`,
    `Tag someone below who needs to hear this!`,
    `I went from (insert pain point) to (insert dream result) in X days, want the same results? I don’t gatekeep make sure to follow for more of my secrets!`,
    `Add in before and after screenshots to make it more effective!`,
    `I went from (insert pain point) to (insert dream result) in X days, want the same results? Comment X for more details!`,
    `Add in before and after screenshots to make it more effective!`,
    `Remember to save this post for the next time you do X!`,
    `I went from X to X, in X time, without doing (insert fear holding them back)! Want the same results. Follow because I share all my tips & tricks!`,
    `Add in before and after screenshots to make it more effective!`,
    `I helped my client go from X to X, in X time, without doing (insert fear holding them back)! Want the same results. Comment X and I will send you more info!`,
    `Add in before and after screenshots to make it more effective!`,
    `Comment below your opinion on X!`,
    `I wish I had someone like myself who could help me get the same (insert dream result) in 1 year instead of 5. But now you do, follow because I share all the secrets!`,
    `I wish I had someone like myself who could help me get the same (insert dream result) in 1 year instead of 5. That's why I created (insert service/offer), so you can achieve (insert dream result) in a fraction of the time!`,
    `Hey I know you are probably going to forget and I don't blame your busy, so make sure to save this for later!`,
    `I have been in the (insert industry) for X years, and I share all the tips, lessons, and mistakes I have learned on social media! Make sure to follow!`,
    `Like what you just learned? Comment X for (insert lead magnet)!`,
    `Save this post so the next time X happens you are prepared!`,
    `I am an (title) and if you want to learn more (industry) education make sure to follow!`,
    `I help (insert target audience) go from (insert current state) to (insert dream result) in (insert timeframe)! Want to learn more? Comment X!`,
    `Add in before and after screenshots to make it more effective!`,
    `This was a lot of information! Save this so you don’t get annoyed trying to find it later.`,
    `Are you a (avatar) Looking to achieve (dream result)? Follow for more (industry) related content!`,
    `There is so much more that can't be fit into one video comment the word for access to a free (insert lead magnet)!`,
    `Save it or forget it!`,
    `I help (avatar) achieve (dream result) with tips and tricks that I post everyday. Make sure to follow!`,
    `Interested? Comment the word “X” for “X”!`,
    `Busy right now? Save this for when you're ready`,
    `If you actually found this valuable I post stuff like this everyday, so make sure to follow!`,
    `There is so much more that can't be fit into one video comment the word for access to a free (insert lead magnet)!`,
    `If you are a (insert avatar), make sure to follow!`,
    `Interested but what to learn more? Comment the word X and I will send you more information!`,
    `If you want to get (insert dream result) follow!`,
    `DM me the word X for a free (lead magnet)!`,
    `Did you like this tip? Well I help (avatar) achieve (dream result) with this and multiple other methods. Make sure to follow for more!`,
];

// Storytelling Structures (107 items)
const STORYTELLING_STRUCTURES = [
    `STORYTELLING STRUCTURES:`,
    `#1. INTRO - Establishes the hero (our client, or one of their clients) and the problem.`,
    `Template: X days/years ago I (insert problem client was experiencing/and or was seeing others experience)`,
    `#2. INFLECTION POINT - Highlights the pain points from this problem.`,
    `Template: Because of this I was (insert pain points/symptoms that come from having this problem)`,
    `#3. RISING ACTION - Explain failed solutions/attempts they tried in order to fix the problem.`,
    `Template: I tired/they tried insert failed solutions they have tried in order to fix the problem`,
    `#4. CLIMAX - Introduce the solution to this problem.`,
    `Template: Finally after X months/years of no results I figured out the one thing that actually worked, (insert solution).`,
    `#5. FALLING ACTION - Explain the success you have seen because of the solution`,
    `Template: When I started doing this I (Insert results/social proof/success from solution that happened`,
    `#6. RESOLUTION - Call to action to business/service.`,
    `Template: Because of this experience I started (insert business/service so I could help people just like me achieve (insert dream result)`,
    `CTA to business/service`,
    `Example (follows most parts of template)`,
    `#1. INTRO - A starting point where your story begins`,
    `Template: Hi i’m (insert name), and X months/years ago I was a normal guy/girl, working as a (insert role), and living a normal life`,
    `#2. CONFLICT - What set you on this path`,
    `Template: Well all up until (insert life changing event)`,
    `#3. EPIPHANY - That changed your perspective`,
    `Template: Because of this I realized (insert epiphany)`,
    `#4. CHANGE - The change you made following your epiphany`,
    `Template: Which led me to do (insert action/actions), and that leads me to today. Now I (insert dream result), and (insert positive side effect/effects from dream result).`,
    `#5. PURPOSE - The deeper “Why” that is driving your brand`,
    `Template: (Insert dream result) changed my life, and I made it my mission to help (insert target audience) go from (insert pain point/points) to (insert dream result) too.`,
    `#1. SETBACK - State shocking/bold setback hook`,
    `Template: I (insert shocking result/event/etc)`,
    `#2. PAIN POINTS - State pain points as a result of hook`,
    `Template: So I did (insert action #1), (Insert action #2), and (insert action #3) with no success, so I started doing (insert action)`,
    `#3. RESOLUTION - State dream result outcome because of action`,
    `Template: Within X days/months/years I (insert dream result)`,
    `#4. LESSON - State what you learned from this`,
    `Template: This whole situation taught me (insert lesson)`,
    `#1. INTRODUCE DREAM - Explain origin of dream/big goal`,
    `Template: I have (insert action), # times in my life, and ever since I was X age I have always dreamed of doing (insert dream). Each time I (insert action), I think about how cool it would be to (insert dream).`,
    `#2. PURSUIT OF DREAM - Explain when the individual started to seriously take action`,
    `Template: But after years of dreaming, on one random (insert weekday) I (insert realization/or life event) and decided it was now or never so I started (insert action/actions). I won’t lie I was (insert vulnerable feeling) but I did it anyway.`,
    `#3. DREAM/GOAL PROGRESS UPDATE - Share an update on where individual is on journey to achieve goal/dream`,
    `Template: So far I have already (insert action/actions), and now I am currently/about to start (insert action) which involves (insert step/steps). If I want to achieve (dream result) by (insert age/date/time) I need to complete this in (insert time frame).`,
    `#4. CTA - Encourages audiences help/participation`,
    `Template: want to see if I can get (insert action) done on time? (Insert CTA)`,
    `CHALLENGE TO VICTORY:`,
    `#1. DOUBT - Introduce limiting belief/challenge`,
    `Template: X days/months/years ago someone/society told me I’d never get (insert dream result)`,
    `#2. INITIAL STRUGGLE - Explain problem and effort put in`,
    `Template: I was doing (insert action/actions) and still getting (insert bad result).`,
    `#3. THE TURNING POINT - Explain the one thing that changed everything`,
    `Template: Until I realized (insert realization ie. how the college board actually design their questions)`,
    `#4. THE SOLUTION - Explain the solution (method, framework, approach)`,
    `Template: Template: I followed the (insert an acronym you created) method. X letter - stands for (insert step) (breakdown step). X letter - stands for (insert step) (breakdown step). X letter - stands for (insert step) (breakdown step).`,
    `Template: I followed this # step framework. Step #1. (Insert step) (breakdown step). Step #2. (Insert step) (breakdown step). Step #3. (Insert step) (breakdown step).`,
    `#5. THE TRANSFORMATION -`,
    `Template: I went from (insert before) to (insert after) and ended up (insert positive side effect/effects from transformation)`,
    `#6. MYTH BUST - Challenge a common belief that the audience has`,
    `Template: (insert dream result) is not hard, you are probably just literally just doing the wrong things to get there.`,
    `Example (realization)`,
    `Example (realization)`,
    `#1. PROBLEM - State problem`,
    `Template: I was doing (insert solution/action) and still getting (insert bad result). But even after trying (insert action/actions) I kept (insert bad result).`,
    `#2. BREAKTHROUGH - State mind blowing realization or mind blowing result achieved`,
    `Template: until I realized (insert realization)`,
    `Template: until I did this one thing that got me (insert result)`,
    `#3. FIX (TAKEAWAY) - Breakdown the fix that got you from problem to curiosity breakthrough`,
    `Template: One day I was doing (insert action) when I came across (insert resource) that explained (insert solution/realization). Since I had nothing to lose, I tried (insert solution implemented) and X days/months/years later (insert dream result/insert social proof/insert positive changes/outcomes)`,
    `Template: Before I struggled (getting dream result) because of (insert problem #1), (insert problem #2), and (insert problem #3) and I have no idea how to do (insert action). But in order to achieve (insert dream result) you actually want to (insert solution) so here are the steps we followed. First (insert step #1), then (insert step #2), and lastly (insert step #3).`,
    `EDUCATIONAL STRUCTURES:`,
    `Educational Tip/Hack Template:`,
    `Let them know you are about to let them in on some valuable information - use hook from education section of template`,
    `In a short sentence let them know what it is you are about to teach them (only if hook did not mention it)`,
    `Show viewer exactly how to do hack/tip with practical steps they can do`,
    `Let them know you post valuable stuff like this everyday and they should definitely follow ;) - use CTA from follow section of template`,
    `Use hook from myth section of template`,
    `State the myth (skip this if you state the myth in your hook)`,
    `Explain why this myth is wrong`,
    `Introduce what they should do instead to achieve their dream result`,
    `Subtly hit that your product/service helps people achieve their dream result`,
    `Let them know where they can find more information about your product or service - use CTA from sales section of template`,
    `Viral Video Reaction Template:`,
    `Add in a 5-7 second viral Tiktok or Instagram Reel that talks about something relating to your niche`,
    `Share Your Expert Opinion`,
    `Is it true or complete BS? If it’s true explain why, if it’s BS explain what you should do instead`,
    `Remind them you are an expert in your field and they should follow - use hook from follow section of template`,
    `Step-By-Step System Template:`,
    `Use hook from step-by-step system section of template`,
    `State the name of the framework you are about to teach them if applicable or state you are about to tell them the steps - Ex. Here are the X steps you need to take`,
    `State step and explain the step in 1-2 brief sentences`,
    `State step and explain the step in 1-2 brief sentences`,
    `State step and explain the step in 1-2 brief sentences`,
    `Let them know you help people do exactly this (in the CTA you would go and let them know where they can find more information about your product and service)`,
    `Use CTA from sales, engagement, or follow section of template`,
    `Common Mistake Template:`,
    `Use hook from common mistake section of template`,
    `Introduce common mistake (if you did not in the hook)`,
    `Explain why this is a mistake`,
    `Let them know what they can do instead to achieve their dream result`,
    `Let them know you help (ideal customer) achieve (dream result) (in the CTA you would go and let them know where they can find more information about your product and service)`,
    `Use CTA from sales, engagement, or follow section of template`,
    `Use hook from authority section of template`,
    `Show real results you got or got a client`,
    `Explain tip/hack or step by step breakdown the viewer can do to achieve dream result`,
    `Use CTA from sales section of template`,
    `Selling Product/Service Template:`,
    `State a common pain point of your ideal customer/client`,
    `Let them know there is light at the end of the tunnel aka a solution and they don’t have to feel like that if they don’t want to`,
    `Give them an actionable step by step solution to help solve said problem`,
    `Subtly let them know your product/service helps people do exactly this to achieve dream result`,
    `Use CTA from sales section of template`,
];


// ========================================================================
// SCRIPT TEMPLATES - Storytelling Frameworks
// ========================================================================

const SCRIPT_TEMPLATES = {
    'ed_lawrence': {
        name: '🌟 LinnArtistry Framework',
        description: 'Problem → Konflikt → Insikt → Transformation → Resultat → CTA',
        steps: [
            {
                title: '1. Hook – Vad är problemet?',
                question: 'Vilket problem har din drömkund? Hur känns det?',
                placeholder: 'Om du [problem], och inget du gör funkar – lyssna nu.',
                example: 'Om din bas alltid ser torr eller kakig ut, även när du gör exakt som på TikTok – då måste du höra det här.'
            },
            {
                title: '2. Konflikt – Vad har de försökt?',
                question: 'Lista 2-3 saker de gjort fel (visa att du förstår dem)',
                placeholder: 'Du har redan försökt [A], [B], [C] – ändå ser du ingen skillnad.',
                example: 'Du har bytt foundation fem gånger. Testat nya primers. Mer puder, mindre puder, viral hack – och ändå ser det inte ut som du vill.'
            },
            {
                title: '3. Twist – Sanningen som ändrar allt',
                question: 'Vad är "Aha!"-ögonblicket? Varför har de misslyckats?',
                placeholder: 'Problemet är inte du. Det är att ingen lärt dig grunderna – på ditt ansikte.',
                example: 'Problemet är inte du. Problemet är att ingen lärt dig grunderna – på ditt ansikte.'
            },
            {
                title: '4. Story – Transformation Moment',
                question: 'Berätta om en elev/kund som hade problemet. Före → Efter.',
                placeholder: 'Jag hjälpte en [person] som [problem]. När vi [lösning], hände det här: [resultat].',
                example: 'Jag hade en elev som trodde hon behövde dyr makeup. Men när vi bytte underton och la basen i tunna lager såg hon ut som en helt ny version av sig själv på 30 sekunder.'
            },
            {
                title: '5. Demonstration – Visa 1 konkret lösning',
                question: 'Ge EN konkret teknik/tip som funkar',
                placeholder: 'Testa det här: [en konkret teknik]. Det förändrar allt.',
                example: 'Om du börjar lägga foundation där du har mest täckning och jobbar utåt, kommer din bas alltid smälta bättre in.'
            },
            {
                title: '6. Outcome – Vad får de när problemet är löst?',
                question: 'Beskriv resultatet i känslor + visuella effekter',
                placeholder: 'När du gör så här får du [resultat], [känsla], och [visuell effekt].',
                example: 'När du väl förstår rätt underton och rätt teknik får du en bas som alltid sitter, ser fräschare ut och gör att du slipper tänka på sminket resten av dagen.'
            },
            {
                title: '7. CTA – Bjud in till nästa steg',
                question: 'Mjuk, trygg, guidande uppmaning',
                placeholder: 'Om du vill lära dig hela metoden – gå till [länk/webinar/kurs].',
                example: 'Vill du att jag visar dig hela systemet? Kolla webinaret Lär dig sminka dig rätt. Du kommer förstå ditt ansikte bättre än du någonsin gjort.'
            }
        ]
    },

    'hypothetical': {
        name: '💭 Hypotetisk Berättelse',
        description: 'Fiktivt men kraftfullt scenario för att engagera',
        steps: [
            {
                title: '1. Sätt scenen',
                question: 'Skapa ett hypotetiskt scenario din målgrupp känner igen',
                placeholder: 'Föreställ dig att...',
                example: 'Föreställ dig att du vaknar imorgon och alla dina makeup-problem är lösta...'
            },
            {
                title: '2. Bygg upp spänning',
                question: 'Vad händer i scenariot? Vad är utmaningen?',
                placeholder: 'Men plötsligt...',
                example: 'Men plötsligt inser du att det inte är produkterna – det är tekniken.'
            },
            {
                title: '3. Visa möjligheten',
                question: 'Hur skulle deras liv se ut om detta var sant?',
                placeholder: 'Tänk om du kunde...',
                example: 'Tänk om du kunde sminka dig på 5 minuter och känna dig helt säker hela dagen.'
            },
            {
                title: '4. Koppla till verkligheten',
                question: 'Hur kan de göra detta verkligt?',
                placeholder: 'Det här är faktiskt möjligt när...',
                example: 'Det här är faktiskt möjligt när du lär dig rätt teknik för just ditt ansikte.'
            }
        ]
    },

    'heros_journey': {
        name: '🦸 Hjältens Resa',
        description: 'Klassisk transformationsberättelse',
        steps: [
            {
                title: '1. Vanliga världen',
                question: 'Var befinner sig hjälten (kunden) nu? Vad är deras normaltillstånd?',
                placeholder: 'Möt [namn] som...',
                example: 'Möt Sara som varje morgon kämpar med sin makeup i 45 minuter.'
            },
            {
                title: '2. Kallelse till äventyr',
                question: 'Vad får dem att vilja förändras? Vad är triggern?',
                placeholder: 'En dag insåg hon att...',
                example: 'En dag insåg hon att hon missade frukost med barnen varje morgon bara för smink.'
            },
            {
                title: '3. Möta mentorn',
                question: 'Vem eller vad hjälper dem? (Hint: ditt erbjudande)',
                placeholder: 'Hon hittade...',
                example: 'Hon hittade min 5-minuters makeup-metod.'
            },
            {
                title: '4. Utmaningar & tester',
                question: 'Vilka utmaningar möter de på vägen?',
                placeholder: 'Det var inte lätt från början...',
                example: 'Det var inte lätt från början – gammal vana dör svårt.'
            },
            {
                title: '5. Transformation',
                question: 'Vad är det stora genombrottet?',
                placeholder: 'Men när hon äntligen...',
                example: 'Men när hon äntligen lärde sig sina rätta undertoner och tekniker förändrades allt.'
            },
            {
                title: '6. Nya världen',
                question: 'Hur ser deras liv ut nu?',
                placeholder: 'Idag...',
                example: 'Idag sminkar hon sig på 5 minuter, hinner frukost med barnen, och känner sig mer som sig själv än någonsin.'
            }
        ]
    },

    'chronological': {
        name: '📅 Kronologisk Berättelse',
        description: 'Från början till slut, steg för steg',
        steps: [
            {
                title: '1. Början – Sätt scenen',
                question: 'Var började historien? Vad var situationen?',
                placeholder: 'För [X tid] sedan...',
                example: 'För 3 år sedan startade jag min makeup-journey helt lost.'
            },
            {
                title: '2. Uppbyggnad',
                question: 'Vad hände sedan? Vilka händelser ledde till förändring?',
                placeholder: 'Jag försökte..., sedan..., och till slut...',
                example: 'Jag försökte varje tutorial på YouTube. Köpte "must-haves" från TikTok. Ingenting funkade.'
            },
            {
                title: '3. Vändpunkt',
                question: 'Vad var det stora ögonblicket?',
                placeholder: 'Tills en dag...',
                example: 'Tills en dag en makeup artist sa: "Du har fel underton. Därför funkar inget."'
            },
            {
                title: '4. Efter vändpunkten',
                question: 'Vad hände efter insikten?',
                placeholder: 'Efter det började jag...',
                example: 'Efter det började jag lära mig grunderna – på rätt sätt.'
            },
            {
                title: '5. Resultat',
                question: 'Var är du/de idag?',
                placeholder: 'Nu, [X tid] senare...',
                example: 'Nu, 3 år senare, hjälper jag andra undvika samma misstag.'
            }
        ]
    },

    'before_after_bridge': {
        name: '🌉 Före-Efter-Bryggan',
        description: 'Visa transformation först, förklara sedan hur',
        steps: [
            {
                title: '1. FÖRE – Problemsituationen',
                question: 'Hur såg det ut innan? Vad var smärtpunkterna?',
                placeholder: 'Tidigare...',
                example: 'Tidigare spenderade jag 1000kr/månad på makeup som aldrig såg bra ut.'
            },
            {
                title: '2. EFTER – Drömresultatet',
                question: 'Hur ser det ut nu? (Skippa bryggan – bygg nyfikenhet)',
                placeholder: 'Idag...',
                example: 'Idag sminkar jag mig på 5 minuter, ser fräsch hela dagen, och sparar pengar.'
            },
            {
                title: '3. BRYGGAN – Hur kom du dit?',
                question: 'Vad var hemligheten? Vilka steg togs?',
                placeholder: 'Så här gick jag från A till B:',
                example: 'Så här gick jag från A till B: Jag slutade följa TikTok-trender och lärde mig istället grunderna för MITT ansikte.'
            },
            {
                title: '4. Applicering',
                question: 'Hur kan din publik göra samma resa?',
                placeholder: 'Du kan göra samma sak genom att...',
                example: 'Du kan göra samma sak genom att lära dig dina undertoner, rätt applikationsteknik och produktval.'
            }
        ]
    },

    'metaphorical': {
        name: '🎭 Metaforisk Berättelse',
        description: 'Använd liknelser för att förklara koncept',
        steps: [
            {
                title: '1. Välj metafor',
                question: 'Vad är din metafor? (Makeup är som... bygg hus, laga mat, etc)',
                placeholder: 'Tänk på makeup som...',
                example: 'Tänk på makeup som att bygga ett hus.'
            },
            {
                title: '2. Utveckla liknelsen',
                question: 'Hur fungerar metaforen? Förklara detaljerna.',
                placeholder: 'Precis som när du bygger ett hus...',
                example: 'Precis som när du bygger ett hus behöver du en stark grund. Du kan inte börja måla väggarna om fundamentet är dåligt.'
            },
            {
                title: '3. Koppla till problemet',
                question: 'Hur relaterar metaforen till kundens problem?',
                placeholder: 'Samma sak gäller för...',
                example: 'Samma sak gäller för din makeup. Om din hudvård och primer (fundamentet) är fel kommer foundation aldrig sitta rätt.'
            },
            {
                title: '4. Ge lösningen genom metaforen',
                question: 'Vad är "rätt sätt" i din metafor?',
                placeholder: 'Så istället för att..., gör så här...',
                example: 'Så istället för att köpa dyrare foundation, fixa ditt fundament först.'
            },
            {
                title: '5. Avsluta med insikt',
                question: 'Vad ska de komma ihåg?',
                placeholder: 'Kom ihåg:',
                example: 'Kom ihåg: En stark grund håller allt på plats. I huset. Och på ditt ansikte.'
            }
        ]
    }
};


// Added functions
function clearMainContent() {
    const main = document.getElementById('mainContent');
    if (main) {
        main.innerHTML = '';
    }
}

// Wrapper functions to connect new menu items to existing pages


// ========================================================================
// ADDITIONAL SCRIPT TEMPLATES & FORMAT IDEAS
// ========================================================================

// Add 6 new storytelling templates to SCRIPT_TEMPLATES
const ADDITIONAL_SCRIPT_TEMPLATES = {
    'heros_journey_detailed': {
        name: '🦸 Hero\'s Journey (Detaljerad)',
        description: 'Klassisk hjälteresa med alla steg',
        steps: [
            {
                title: '1. Intro – Var började det?',
                question: 'X dagar/år sedan upplevde jag vilket problem?',
                placeholder: 'För [X tid] sedan upplevde jag [problem]...',
                example: 'För 5 år sedan upplevde jag konstant osäkerhet med min makeup – den såg aldrig rätt ut.'
            },
            {
                title: '2. Inflection Point – Smärtpunkten',
                question: 'Vad var konsekvensen? Hur påverkade det dig?',
                placeholder: 'På grund av detta var jag [smärta/resultat]...',
                example: 'På grund av detta var jag osäker varje dag, undvek kameran och kände mig som en dålig makeup artist.'
            },
            {
                title: '3. Rising Action – Misslyckade försök',
                question: 'Vad försökte du som inte funkade?',
                placeholder: 'Jag försökte [misslyckade försök]...',
                example: 'Jag försökte varje TikTok-hack, köpte dyra produkter och testade 100+ tutorials.'
            },
            {
                title: '4. Climax – Lösningen',
                question: 'Vad var vändpunkten? Vad hittade du?',
                placeholder: 'Till slut hittade jag [lösningen]...',
                example: 'Till slut hittade jag sanningen: det handlade om MINA undertoner och rätt placering – inte produkterna.'
            },
            {
                title: '5. Falling Action – Resultaten',
                question: 'Vad hände när du började göra rätt?',
                placeholder: 'När jag började göra det här fick jag [resultat]...',
                example: 'När jag började jobba med mina undertoner såg min makeup plötsligt professionell ut på 5 minuter.'
            },
            {
                title: '6. Resolution – Varför du gör det här',
                question: 'Vad startade du? Vem hjälper du nu?',
                placeholder: 'På grund av detta startade jag [tjänst/verksamhet]...',
                example: 'På grund av detta startade jag LinnArtistry – för att hjälpa andra slippa samma 5 år av frustration.'
            }
        ]
    },

    'about_me': {
        name: '👋 About Me',
        description: 'Personlig introduktion och din resa',
        steps: [
            {
                title: '1. Introduktion',
                question: 'Vem är du och var var du för X år sedan?',
                placeholder: 'Hej, jag är [namn], och för X år sedan var jag [startpunkt]...',
                example: 'Hej, jag är Linn, och för 5 år sedan var jag en makeup-entusiast som aldrig kunde få min bas att se bra ut.'
            },
            {
                title: '2. Vändpunkten',
                question: 'Vad hände som förändrade allt?',
                placeholder: 'Allt förändrades när [livshändelse]...',
                example: 'Allt förändrades när en professionell makeup artist såg mitt ansikte och sa: "Du har fel underton".'
            },
            {
                title: '3. Insikten',
                question: 'Vad fick dig att förstå?',
                placeholder: 'Det fick mig att inse [insikt]...',
                example: 'Det fick mig att inse att ingen hade lärt mig grunderna – på mitt sätt.'
            },
            {
                title: '4. Förändringen',
                question: 'Vad började du göra annorlunda?',
                placeholder: 'Så jag började [förändring], vilket gav [nytt resultat]...',
                example: 'Så jag började lära mig RÄTT tekniker för MITT ansikte, vilket gav mig självförtroende jag aldrig haft.'
            },
            {
                title: '5. Missionen',
                question: 'Vem hjälper du nu och hur?',
                placeholder: 'Nu hjälper jag [målgruppen] att gå från [smärta] till [drömresultat].',
                example: 'Nu hjälper jag kvinnor att gå från osäkerhet och tunga lager makeup till naturlig, fräsch makeup på 5 minuter.'
            }
        ]
    },

    'the_lesson': {
        name: '📚 The Lesson',
        description: 'Från motgång till läxa',
        steps: [
            {
                title: '1. Setback – Motgången',
                question: 'Vad gick fel? Vad var misslyckandet?',
                placeholder: 'Jag misslyckades med [situation]...',
                example: 'Jag misslyckades med att få min foundation att sitta – varje dag.'
            },
            {
                title: '2. Pain Points – Smärtan',
                question: 'Hur kändes det? Vad var konsekvenserna?',
                placeholder: 'Det fick mig att känna [känslor/konsekvenser]...',
                example: 'Det fick mig att känna mig inkompetent, osäker och frustrerad – trots att jag älskar makeup.'
            },
            {
                title: '3. Resolution – Lösningen',
                question: 'Hur löste du det? Vad insåg du?',
                placeholder: 'Jag insåg att [lösning]...',
                example: 'Jag insåg att jag följde fel metoder för mitt ansikte – inte min förmåga som var problemet.'
            },
            {
                title: '4. Lesson – Läxan',
                question: 'Vad lärde du dig? Vad ska andra veta?',
                placeholder: 'Läxan är: [key takeaway]...',
                example: 'Läxan är: Generic tutorials funkar inte. Du måste lära dig DITT ansikte.'
            }
        ]
    },

    'the_big_dream': {
        name: '💫 The Big Dream',
        description: 'Från dröm till verklighet',
        steps: [
            {
                title: '1. Introducera drömmen',
                question: 'Vad var din stora dröm eller mål?',
                placeholder: 'Min dröm var att [stort mål]...',
                example: 'Min dröm var att hjälpa tusentals kvinnor känna sig vackra utan att sminka sig i 45 minuter.'
            },
            {
                title: '2. När du började ta action',
                question: 'Vad var första steget? När började du?',
                placeholder: 'Jag började med [första action]...',
                example: 'Jag började med att lära ut mina egna tekniker till vänner – och såg hur deras liv förändrades.'
            },
            {
                title: '3. Var du är nu',
                question: 'Var befinner du dig idag?',
                placeholder: 'Idag har jag [nuvarande status]...',
                example: 'Idag har jag hjälpt över 500 kvinnor lära sig makeup på rätt sätt – och de älskar sina resultat.'
            },
            {
                title: '4. CTA – Följ resan',
                question: 'Vad kan de göra för att följa med?',
                placeholder: 'Vill du följa resan? [CTA]...',
                example: 'Vill du följa resan? Följ mig för dagliga tips, eller gå med i min kurs!'
            }
        ]
    },

    'challenge_victory': {
        name: '🏆 Challenge → Victory',
        description: 'Från tvivel till triumf',
        steps: [
            {
                title: '1. Doubt – Tvivlet',
                question: 'Vad tvivlade du på? Vad var rädslan?',
                placeholder: 'Jag tvivlade på att [rädsla]...',
                example: 'Jag tvivlade på att jag någonsin skulle kunna sminka mig snabbt OCH snyggt.'
            },
            {
                title: '2. Initial Struggle – Kampen',
                question: 'Hur såg de första försöken ut?',
                placeholder: 'I början var det [svårigheter]...',
                example: 'I början var det kaos – fel färger, fläckig bas, 60 minuter slösade varje morgon.'
            },
            {
                title: '3. Turning Point – Vändpunkten',
                question: 'Vad förändrades? Vad var genombrott?',
                placeholder: 'Men när jag [förändring]...',
                example: 'Men när jag lärde mig rätt underton och rätt verktyg förändrades allt på en vecka.'
            },
            {
                title: '4. The Solution – Lösningen',
                question: 'Vad funkade till slut?',
                placeholder: 'Lösningen var [metod]...',
                example: 'Lösningen var att skippa generiska tutorials och lära mig MITT ansikte.'
            },
            {
                title: '5. The Transformation – Resultatet',
                question: 'Hur ser det ut nu?',
                placeholder: 'Nu kan jag [resultat]...',
                example: 'Nu kan jag sminka mig perfekt på 5 minuter – varje dag.'
            },
            {
                title: '6. Myth Bust – Avliva myten',
                question: 'Vilken myt vill du krossa?',
                placeholder: 'Myten att [falsk tro] är inte sann...',
                example: 'Myten att "dyr makeup = bättre resultat" är helt falsk.'
            }
        ]
    },

    'the_breakthrough': {
        name: '💡 The Breakthrough',
        description: 'Snabb transformation story',
        steps: [
            {
                title: '1. Problem – Utgångsläget',
                question: 'Vad var problemet?',
                placeholder: 'Problemet var att [situation]...',
                example: 'Problemet var att min foundation alltid såg orange och fläckig ut.'
            },
            {
                title: '2. Breakthrough – Genombrott',
                question: 'Vad var "aha!"-momentet?',
                placeholder: 'Genombrott kom när jag [insikt/förändring]...',
                example: 'Genombrott kom när jag insåg att jag hade för varm underton – hela tiden!'
            },
            {
                title: '3. Result – Resultatet',
                question: 'Vad hände efter genombrott?',
                placeholder: 'Nu [resultat/CTA]...',
                example: 'Nu ser min bas professionell ut på 2 minuter. Vill du lära dig samma sak?'
            }
        ]
    }
};

// Video Format Ideas
const VIDEO_FORMAT_IDEAS = [
    'Talking Form (direkt till kamera)',
    'Audio + B-roll (röst över bilder)',
    'Voiceover (röst över video)',
    'My Story (personlig berättelse)',
    'Talking Back & Forth (dialog/konversation)',
    'Multitasking (gör flera saker samtidigt)',
    'Day in the Life - Voiceover',
    'Day in the Life - Audio & B-roll',
    'Setting Changes (olika platser)',
    'Shot/Angle Changes (olika vinklar)',
    'Clone (du med dig själv)',
    'Visual Concept (kreativ visualisering)',
    '1-Person Q&A (frågor & svar)',
    'Multi-person Q&A (flera personer)',
    'Whiteboard (rita/förklara)',
    'Green Screen (bakgrundseffekt)',
    'Split Screen (delad skärm)',
    'Stitch/Reaction Video (reagera på annat)'
];

// Content Format Ideas
const CONTENT_FORMAT_IDEAS = [
    'Blind Ranking (rangordna utan att se)',
    'Pointing Comparison (peka och jämför)',
    'Tier List Format (S, A, B, C, D ranking)',
    '3 Levels (nybörjare, medel, expert)',
    'This or That (välj mellan två)'
];


// Content Ideas - "Next Week of Content" inspirations
const CONTENT_IDEAS = [
    // Från "Next Week of Content" dokument
    'Visa 1 sak du önskar att alla visste om ditt område',
    'Gör en video där du avlivar en myt inom ditt område',
    'Visa ett vanligt misstag dina kunder gör, och hur de ska göra istället',
    'Dela din egen resa från [före] till [efter] inom ditt område',
    'Gör en steg-för-steg-video: så här gör du [konkret resultat]',
    'Dela 3 saker du ALDRIG skulle göra inom [ditt område]',
    'Visa din morgonrutin/kvällsrutin',
    'Gör en "Things I wish I knew" video',
    'Dela en FAQ du får mycket och svaret på den',
    'Visa något som inspirerar dig (podcast, bok, citat)',
    'Gör en "Before & After" transformation',
    'Dela 3 tips för nybörjare inom [område]',
    'Visa 3 produkter/verktyg du använder varje dag',
    'Gör en "Day in the Life" video',
    'Dela något du var rädd att prova men som lönade sig',
    'Visa något du försökte men som inte funkade (och vad du lärde dig)',
    'Gör en "Get Ready With Me" med storytelling',
    'Dela 3 misstag du gjorde som nybörjare',
    'Visa hur du gör [något] på 5 minuter',
    'Gör en "Behind the Scenes" av ditt arbete',
    'Dela din bästa produktrekommendation',
    'Visa skillnaden mellan [dyrt vs billigt/rätt vs fel]',
    'Gör en "This or That" video',
    'Dela en sårbar historia som din publik kan relatera till',
    'Visa 3 levels: nybörjare, medel, expert',
    'Gör en "What I eat in a day" (ersätt med ditt område)',
    'Dela din största insikt inom [område]',
    'Visa vad du gör annorlunda än andra',
    'Gör en "Unpopular Opinion" video',
    'Dela 3 råd du skulle ge ditt yngre jag'
];


// ========================================================================
// RESOURCE UPLOAD SYSTEM
// ========================================================================

// Custom SVG Icons (LinnArtistry Style)
const CUSTOM_ICONS = {
    upload: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L12 16" stroke="currentColor" stroke-width="2.25" stroke-linecap="round"/><path d="M8 8L12 4L16 8" fill="currentColor" fill-opacity="0.20"/><path d="M8 8L12 4L16 8" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 16L5 18C5 19.1046 5.89543 20 7 20L17 20C18.1046 20 19 19.1046 19 18L19 16" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-opacity="0.85"/></svg>',
    sparkles: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L13 8L12 14" stroke="currentColor" stroke-width="2.25" stroke-linecap="round"/><path d="M2 12L8 13L14 12" stroke="currentColor" stroke-width="2.25" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="currentColor" fill-opacity="0.30"/></svg>',
    fire: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3C12 3 8 7 8 11C8 13.2091 9.79086 15 12 15C14.2091 15 16 13.2091 16 11C16 7 12 3 12 3Z" fill="currentColor" fill-opacity="0.30" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    template: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" fill-opacity="0.20" stroke="currentColor" stroke-width="2.25"/><path d="M8 9H16" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-opacity="0.85"/><path d="M8 13H14" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-opacity="0.7"/></svg>',
    hook: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3V13" stroke="currentColor" stroke-width="2.25" stroke-linecap="round"/><path d="M12 13C12 16.866 15.134 20 19 20" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" fill="currentColor" fill-opacity="0.20"/></svg>',
    megaphone: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 11C4 11 6 9 12 9V15C6 15 4 13 4 13V11Z" fill="currentColor" fill-opacity="0.30" stroke="currentColor" stroke-width="2.25" stroke-linejoin="round"/><path d="M12 9L18 6V18L12 15" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    book: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H12C14 4 16 5 16 7V20C16 18 14 17 12 17H4V4Z" fill="currentColor" fill-opacity="0.30" stroke="currentColor" stroke-width="2.25" stroke-linejoin="round"/></svg>',
    film: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="6" width="16" height="12" rx="2" fill="currentColor" fill-opacity="0.30" stroke="currentColor" stroke-width="2.25"/><circle cx="7" cy="9" r="1" fill="currentColor"/><circle cx="17" cy="9" r="1" fill="currentColor"/></svg>'
};

function showUploadResourceModal() {
    const modal = document.createElement('div');
    modal.id = 'uploadModal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';

    const content = document.createElement('div');
    content.style.cssText = 'background: white; padding: 40px; border-radius: 20px; max-width: 500px; width: 90%; box-shadow: 0 8px 32px rgba(0,0,0,0.2);';

    content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h2 style="margin: 0; color: #2c2416; font-size: 1.8em;">📤 Ladda upp resurs</h2>
            <button onclick="closeUploadModal()" style="background: none; border: none; font-size: 1.5em; cursor: pointer; color: #999;">×</button>
        </div>
        
        <div style="margin-bottom: 24px;">
            <label style="display: block; font-weight: 600; color: #2c2416; margin-bottom: 8px;">Välj kategori:</label>
            <select id="uploadCategory" style="width: 100%; padding: 12px; border: 2px solid #d4a574; border-radius: 8px; font-size: 1em;">
                <option value="">-- Välj kategori --</option>
                <option value="templates">📋 Templates (Captions)</option>
                <option value="hooks_sv">💫 Hooks (Svenska)</option>
                <option value="hooks_viral">🔥 Viral Hook Formulas</option>
                <option value="ctas_sv">🎯 CTAs (Svenska)</option>
                <option value="ctas_sales">💰 CTAs (Follows & Sales)</option>
                <option value="storytelling">📖 Storytelling Structures</option>
                <option value="script_templates">📝 Script Templates</option>
                <option value="video_formats">🎥 Video Format Ideas</option>
                <option value="content_formats">💡 Content Format Ideas</option>
                <option value="content_ideas">💭 Content Ideas</option>
            </select>
        </div>
        
        <div style="margin-bottom: 24px;">
            <label style="display: block; font-weight: 600; color: #2c2416; margin-bottom: 8px;">Välj fil:</label>
            <input type="file" id="uploadFile" accept=".txt,.docx,.pdf" style="width: 100%; padding: 12px; border: 2px solid #d4a574; border-radius: 8px;"/>
            <p style="color: #999; font-size: 0.9em; margin-top: 8px;">Stödda format: TXT, DOCX, PDF</p>
        </div>
        
        <div style="display: flex; gap: 12px;">
            <button onclick="uploadResource()" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; font-size: 1em;">
                Ladda upp & Spara
            </button>
            <button onclick="closeUploadModal()" style="flex: 0.4; padding: 14px; background: #f5f1eb; color: #2c2416; border: none; border-radius: 12px; font-weight: 600; cursor: pointer;">
                Avbryt
            </button>
        </div>
        
        <div id="uploadStatus" style="margin-top: 20px;"></div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);
}

function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) modal.remove();
}

async function uploadResource() {
    const category = document.getElementById('uploadCategory').value;
    const fileInput = document.getElementById('uploadFile');
    const statusDiv = document.getElementById('uploadStatus');

    if (!category) {
        statusDiv.innerHTML = '<p style="color: #d9534f; padding: 12px; background: #ffe6e6; border-radius: 8px;">⚠️ Välj en kategori först!</p>';
        return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
        statusDiv.innerHTML = '<p style="color: #d9534f; padding: 12px; background: #ffe6e6; border-radius: 8px;">⚠️ Välj en fil först!</p>';
        return;
    }

    const file = fileInput.files[0];
    statusDiv.innerHTML = '<p style="color: #5bc0de; padding: 12px; background: #e6f7ff; border-radius: 8px;">📤 Laddar upp och läser fil...</p>';

    try {
        const text = await readFileContent(file);

        if (!text || text.trim().length === 0) {
            throw new Error('Kunde inte läsa fil-innehåll');
        }

        // Parse content into array (split by newlines, filter empty)
        const items = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 10); // Minimum 10 chars

        if (items.length === 0) {
            throw new Error('Inga giltiga items hittades i filen');
        }

        // Save to appropriate storage
        saveToCategory(category, items);

        statusDiv.innerHTML = '<p style="color: #5cb85c; padding: 12px; background: #e6ffe6; border-radius: 8px;">✅ Uppladdning klar! ' + items.length + ' items tillagda till ' + getCategoryName(category) + '</p>';

        setTimeout(() => {
            closeUploadModal();
            alert('✅ ' + items.length + ' items sparade i ' + getCategoryName(category) + '!\\n\\nUppdatera sidan för att se dem.');
        }, 2000);

    } catch (error) {
        statusDiv.innerHTML = '<p style="color: #d9534f; padding: 12px; background: #ffe6e6; border-radius: 8px;">❌ Fel: ' + error.message + '</p>';
    }
}

async function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target.result;
            resolve(text);
        };

        reader.onerror = () => {
            reject(new Error('Kunde inte läsa filen'));
        };

        // Read as text (works for TXT, can be extended for DOCX/PDF)
        reader.readAsText(file);
    });
}

function saveToCategory(category, items) {
    const storageKey = 'custom_' + category;
    const existing = localStorage.getItem(storageKey);
    const existingItems = existing ? JSON.parse(existing) : [];

    // Add new items
    const allItems = [...existingItems, ...items];

    // Remove duplicates
    const uniqueItems = [...new Set(allItems)];

    localStorage.setItem(storageKey, JSON.stringify(uniqueItems));
}

function getCategoryName(category) {
    const names = {
        'templates': 'Templates',
        'hooks_sv': 'Svenska Hooks',
        'hooks_viral': 'Viral Hook Formulas',
        'ctas_sv': 'Svenska CTAs',
        'ctas_sales': 'Follows & Sales CTAs',
        'storytelling': 'Storytelling Structures',
        'script_templates': 'Script Templates',
        'video_formats': 'Video Format Ideas',
        'content_formats': 'Content Format Ideas',
        'content_ideas': 'Content Ideas'
    };
    return names[category] || category;
}














// Configuration

// Main Master Creator function
function showPremiumContentCreator() {
    const content = document.getElementById('mainContent');
    if (!content) return;

    const container = document.createElement('div');
    container.style.cssText = 'max-width: 1400px; margin: 0 auto; padding: 20px;';

    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;';
    header.innerHTML = '<div><h1 style="font-size: 2.5em; color: #2c2416; margin: 0 0 10px 0; font-weight: 700;">✨ Premium Content Creator</h1><p style="color: #6b5d4f; font-size: 1.1em; margin: 0;">Allt du behöver för att skapa perfekt content – på ett ställe</p></div><button onclick="showPage(\'overview\')" style="padding: 12px 24px; background: rgba(212, 165, 116, 0.1); color: #2c2416; border: 2px solid #d4a574; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s;">← Tillbaka till Dashboard</button>';
    container.appendChild(header);

    const mainLayout = document.createElement('div');
    mainLayout.style.cssText = 'display: grid; grid-template-columns: 1fr 350px; gap: 30px;';

    const leftCol = document.createElement('div');
    leftCol.id = 'masterLeftCol';
    leftCol.style.cssText = 'display: flex; flex-direction: column; gap: 30px;';

    const rightCol = document.createElement('div');
    rightCol.id = 'masterRightCol';
    rightCol.style.cssText = 'position: sticky; top: 20px; height: fit-content;';

    mainLayout.appendChild(leftCol);
    mainLayout.appendChild(rightCol);
    container.appendChild(mainLayout);

    content.innerHTML = '';
    content.appendChild(container);


    renderAvatarLibrary();
    loadAvatar();
    renderFreeThoughts();
    renderScriptBuilder();
    renderCategorySection();
    renderPurposeSection();
    renderChannelSection();
    renderFormatSection();
    renderToneSection();
    renderTemplateSection();
    renderHooksSection();
    renderStorytellingSection();
    renderCTASection();
    renderContentDraft();
    renderQuickActions();
}

function renderFreeThoughts() {
    const currentPost = POSTS.getCurrent();
    const leftCol = document.getElementById('masterLeftCol');
    if (!leftCol) return;

    const section = document.createElement('div');
    section.style.cssText = 'background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);';
    section.innerHTML = '<h3 style="font-size: 1.4em; color: #2c2416; margin: 0 0 20px 0; font-weight: 700;">💭 Fritänkande</h3><textarea id="freeThoughtsInput" rows="6" placeholder="Skriv dina tankar, idéer och koncept här..." style="width: 100%; padding: 20px; border: 2px solid #d4a574; border-radius: 12px; font-size: 1.05em; font-family: Poppins, sans-serif; line-height: 1.8; resize: vertical;">' + (currentPost.freeText || '') + '</textarea>';
    leftCol.appendChild(section);

    setTimeout(() => {
        const input = document.getElementById('freeThoughtsInput');
        if (input) {
            input.addEventListener('input', function () {
                const current = POSTS.getCurrent();
                current.freeText = this.value;
                POSTS.setCurrent(current);
            });
        }
    }, 100);
}

function renderScriptBuilder() {
    const leftCol = document.getElementById('masterLeftCol');
    if (!leftCol) return;

    const section = document.createElement('div');
    section.style.cssText = 'background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);';

    const title = document.createElement('h3');
    title.style.cssText = 'font-size: 1.4em; color: #2c2416; margin: 0 0 20px 0; font-weight: 700;';
    title.textContent = '📝 Script Template Builder';
    section.appendChild(title);

    // Dropdown for template selection
    const selectContainer = document.createElement('div');
    selectContainer.style.cssText = 'margin-bottom: 20px;';

    const label = document.createElement('label');
    label.style.cssText = 'display: block; font-weight: 600; color: #2c2416; margin-bottom: 8px;';
    label.textContent = 'Välj storytelling template:';
    selectContainer.appendChild(label);

    const select = document.createElement('select');
    select.id = 'scriptTemplateSelect';
    select.style.cssText = 'width: 100%; padding: 12px; border: 2px solid #d4a574; border-radius: 8px; font-size: 1em; background: white; cursor: pointer;';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Välj en template --';
    select.appendChild(defaultOption);

    // Main templates
    Object.keys(SCRIPT_TEMPLATES).forEach(key => {
        const template = SCRIPT_TEMPLATES[key];
        const option = document.createElement('option');
        option.value = key;
        option.textContent = template.name;
        select.appendChild(option);
    });

    // Additional templates
    if (typeof ADDITIONAL_SCRIPT_TEMPLATES !== 'undefined') {
        Object.keys(ADDITIONAL_SCRIPT_TEMPLATES).forEach(key => {
            const template = ADDITIONAL_SCRIPT_TEMPLATES[key];
            const option = document.createElement('option');
            option.value = 'add_' + key;
            option.textContent = template.name;
            select.appendChild(option);
        });
    }

    select.onchange = () => loadScriptTemplate(select.value);
    selectContainer.appendChild(select);
    section.appendChild(selectContainer);

    // Container for template form
    const formContainer = document.createElement('div');
    formContainer.id = 'scriptFormContainer';
    section.appendChild(formContainer);

    leftCol.appendChild(section);
}

function loadScriptTemplate(templateKey) {
    const formContainer = document.getElementById('scriptFormContainer');
    if (!formContainer || !templateKey) {
        if (formContainer) formContainer.innerHTML = '';
        return;
    }

    // Check if it's from additional templates
    let template;
    if (templateKey.startsWith('add_')) {
        const realKey = templateKey.substring(4);
        template = typeof ADDITIONAL_SCRIPT_TEMPLATES !== 'undefined' ? ADDITIONAL_SCRIPT_TEMPLATES[realKey] : null;
    } else {
        template = SCRIPT_TEMPLATES[templateKey];
    }

    if (!template) return;

    let html = `<div style="background: #f5f1eb; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: 700; color: #2c2416; margin-bottom: 4px;">${template.name}</div>
        <div style="color: #666; font-size: 0.9em;">${template.description}</div>
    </div>`;

    // Create form fields for each step
    template.steps.forEach((step, idx) => {
        html += `
            <div style="margin-bottom: 24px; padding: 20px; background: #faf8f5; border-radius: 12px; border-left: 4px solid #d4a574;">
                <div style="font-weight: 700; color: #2c2416; margin-bottom: 8px;">${step.title}</div>
                <div style="color: #666; font-size: 0.9em; margin-bottom: 12px;">${step.question}</div>
                <textarea 
                    id="scriptStep${idx}" 
                    rows="3" 
                    placeholder="${step.placeholder}"
                    style="width: 100%; padding: 12px; border: 2px solid #d4a574; border-radius: 8px; font-size: 0.95em; font-family: Poppins, sans-serif; resize: vertical; margin-bottom: 8px;"
                ></textarea>
                <div style="font-size: 0.85em; color: #999; font-style: italic;">Exempel: ${step.example}</div>
            </div>
        `;
    });

    html += `
        <button 
            onclick="copyScriptToCaption()" 
            style="width: 100%; padding: 16px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; font-weight: 700; font-size: 1.1em; cursor: pointer; box-shadow: 0 4px 16px rgba(212, 165, 116, 0.3);"
        >
            ✨ Generera Script
        </button>
    `;

    formContainer.innerHTML = html;
}

function generateScript(templateKey) {
    const template = SCRIPT_TEMPLATES[templateKey];
    if (!template) return;

    let script = `=== ${template.name} ===\n\n`;

    template.steps.forEach((step, idx) => {
        const input = document.getElementById(`scriptStep${idx}`);
        const value = input ? input.value.trim() : '';

        if (value) {
            script += `${step.title}\n${value}\n\n`;
        }
    });

    script += '\n---\nGenererat med Script Template Builder\n';

    // Add to Content Draft
    const contentInput = document.getElementById('contentDraftInput');
    if (contentInput) {
        contentInput.value = script;

        const current = POSTS.getCurrent();
        current.content = script;
        POSTS.setCurrent(current);

        alert('✅ Script genererat och tillagt i Content Draft!');

        // Scroll to content draft
        contentInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function createSelectionSection(title, emoji, items, currentValue, onSelect) {
    const section = document.createElement('div');
    section.style.cssText = 'background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);';

    const titleEl = document.createElement('h3');
    titleEl.style.cssText = 'font-size: 1.4em; color: #2c2416; margin: 0 0 20px 0; font-weight: 700;';
    titleEl.textContent = emoji + ' ' + title;
    section.appendChild(titleEl);

    const grid = document.createElement('div');
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px;';

    items.forEach(item => {
        const isSelected = currentValue === item.id;
        const btn = document.createElement('button');
        btn.style.cssText = 'padding: 16px; border: 2px solid ' + (isSelected ? (item.color || '#d4a574') : '#eee') + '; background: ' + (isSelected ? 'rgba(212, 165, 116, 0.2)' : 'white') + '; border-radius: 12px; cursor: pointer; transition: all 0.3s; font-weight: ' + (isSelected ? '700' : '500') + '; color: #2c2416;';
        btn.textContent = item.emoji + ' ' + item.name;
        btn.onclick = () => onSelect(item.id);
        grid.appendChild(btn);
    });

    section.appendChild(grid);
    return section;
}

function renderCategorySection() {
    const leftCol = document.getElementById('masterLeftCol');
    if (!leftCol) return;
    const currentPost = POSTS.getCurrent();
    leftCol.appendChild(createSelectionSection('Välj Kategori', '🎯', MC_CONFIG.categories, currentPost.category, selectCategory));
}

function renderPurposeSection() {
    const leftCol = document.getElementById('masterLeftCol');
    if (!leftCol) return;
    const currentPost = POSTS.getCurrent();
    leftCol.appendChild(createSelectionSection('Välj Syfte', '🎯', MC_CONFIG.purposes, currentPost.purpose, selectPurpose));
}

function renderChannelSection() {
    const leftCol = document.getElementById('masterLeftCol');
    if (!leftCol) return;
    const currentPost = POSTS.getCurrent();
    leftCol.appendChild(createSelectionSection('Välj Kanal', '📱', MC_CONFIG.channels, currentPost.channel, selectChannel));
}

function renderFormatSection() {
    const leftCol = document.getElementById('masterLeftCol');
    if (!leftCol) return;
    const currentPost = POSTS.getCurrent();
    leftCol.appendChild(createSelectionSection('Välj Format', '🎬', MC_CONFIG.formats, currentPost.format, selectFormat));
}

function renderToneSection() {
    const leftCol = document.getElementById('masterLeftCol');
    if (!leftCol) return;
    const currentPost = POSTS.getCurrent();
    leftCol.appendChild(createSelectionSection('Välj Ton', '🎨', MC_CONFIG.tones, currentPost.tone, selectTone));
}

function selectCategory(id) {
    const current = POSTS.getCurrent();
    current.category = current.category === id ? null : id;
    POSTS.setCurrent(current);
    showPremiumContentCreator();
}

function selectPurpose(id) {
    const current = POSTS.getCurrent();
    current.purpose = current.purpose === id ? null : id;
    POSTS.setCurrent(current);
    showPremiumContentCreator();
}

function selectChannel(id) {
    const current = POSTS.getCurrent();
    current.channel = current.channel === id ? null : id;
    POSTS.setCurrent(current);
    showPremiumContentCreator();
}

function selectFormat(id) {
    const current = POSTS.getCurrent();
    current.format = current.format === id ? null : id;
    POSTS.setCurrent(current);
    showPremiumContentCreator();
}

function selectTone(id) {
    const current = POSTS.getCurrent();
    current.tone = current.tone === id ? null : id;
    POSTS.setCurrent(current);
    showPremiumContentCreator();
}

function renderTemplateSection() {
    const leftCol = document.getElementById('masterLeftCol');
    if (!leftCol) return;
    const currentPost = POSTS.getCurrent();

    const section = document.createElement('div');
    section.style.cssText = 'background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);';

    const title = document.createElement('h3');
    title.style.cssText = 'font-size: 1.4em; color: #2c2416; margin: 0 0 20px 0; font-weight: 700;';
    title.textContent = '📋 Templates';
    section.appendChild(title);

    // Map purpose to template category
    const purposeToCategory = {
        'sell': 'Säljande',
        'inspire': 'Inspirerande',
        'educate': 'Utbildande',
        'story': 'Underhållande'
    };

    const categoryName = purposeToCategory[currentPost.purpose];
    const templates = categoryName && typeof CONTENT_TEMPLATES !== 'undefined' && CONTENT_TEMPLATES[categoryName] ? CONTENT_TEMPLATES[categoryName] : [];

    const container = document.createElement('div');
    container.style.cssText = 'max-height: 400px; overflow-y: auto;';

    if (templates.length === 0) {
        const msg = currentPost.purpose ? `${templates.length} templates för valt syfte` : 'Välj ett syfte för att se templates';
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 40px;">' + msg + '</p>';
    } else {
        const info = document.createElement('div');
        info.style.cssText = 'padding: 12px; background: #f5f1eb; border-radius: 8px; margin-bottom: 16px; color: #2c2416; font-weight: 600;';
        info.textContent = `${templates.length} templates för ${categoryName}`;
        container.appendChild(info);

        templates.forEach((template, idx) => {
            const div = document.createElement('div');
            div.style.cssText = 'padding: 16px; margin-bottom: 12px; border: 2px solid #eee; border-radius: 12px; cursor: pointer; background: white; transition: all 0.2s;';
            div.textContent = template.substring(0, 150) + '...';
            div.onmouseenter = function () { this.style.borderColor = '#d4a574'; this.style.background = '#faf8f5'; };
            div.onmouseleave = function () { this.style.borderColor = '#eee'; this.style.background = 'white'; };
            div.onclick = () => selectTemplate(categoryName, idx);
            container.appendChild(div);
        });
    }

    section.appendChild(container);
    leftCol.appendChild(section);
}

function selectTemplate(categoryName, idx) {
    const current = POSTS.getCurrent();
    const templates = typeof CONTENT_TEMPLATES !== 'undefined' && CONTENT_TEMPLATES[categoryName] ? CONTENT_TEMPLATES[categoryName] : [];
    const template = templates[idx];
    if (template) {
        const contentInput = document.getElementById('contentDraftInput');
        if (contentInput) {
            contentInput.value = template;
            current.content = template;
            current.template = template;
            POSTS.setCurrent(current);
            // Alert removed
        }
    }
}

function renderHooksSection() {
    const leftCol = document.getElementById('masterLeftCol');
    if (!leftCol) return;

    const section = document.createElement('div');
    section.style.cssText = 'background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);';

    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;';

    const title = document.createElement('h3');
    title.style.cssText = 'font-size: 1.4em; color: #2c2416; margin: 0; font-weight: 700;';
    title.textContent = '💫 Hooks';
    header.appendChild(title);

    // Tabs
    const tabs = document.createElement('div');
    tabs.style.cssText = 'display: flex; gap: 8px;';

    const svTab = document.createElement('button');
    svTab.id = 'hookTabSv';
    svTab.textContent = '📝 Svenska';
    svTab.style.cssText = 'padding: 8px 16px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;';
    svTab.onclick = () => switchHookTab('sv');

    const viralTab = document.createElement('button');
    viralTab.id = 'hookTabViral';
    viralTab.textContent = '🔥 Viral Formulas';
    viralTab.style.cssText = 'padding: 8px 16px; background: #f5f1eb; color: #2c2416; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;';
    viralTab.onclick = () => switchHookTab('viral');

    tabs.appendChild(svTab);
    tabs.appendChild(viralTab);
    header.appendChild(tabs);
    section.appendChild(header);

    const container = document.createElement('div');
    container.id = 'hooksContainer';
    container.style.cssText = 'max-height: 400px; overflow-y: auto;';
    section.appendChild(container);

    leftCol.appendChild(section);

    // Show svenska by default
    switchHookTab('sv');
}

function switchHookTab(type) {
    const container = document.getElementById('hooksContainer');
    if (!container) return;

    // Update tab styles
    const svTab = document.getElementById('hookTabSv');
    const viralTab = document.getElementById('hookTabViral');

    if (type === 'sv') {
        svTab.style.background = 'linear-gradient(135deg, #d4a574 0%, #e8c298 100%)';
        svTab.style.color = 'white';
        viralTab.style.background = '#f5f1eb';
        viralTab.style.color = '#2c2416';

        // Show Svenska Hooks
        const hooks = typeof ALL_HOOKS !== 'undefined' ? ALL_HOOKS : [];
        container.innerHTML = '';

        const info = document.createElement('div');
        info.style.cssText = 'padding: 12px; background: #f5f1eb; border-radius: 8px; margin-bottom: 16px; color: #2c2416; font-weight: 600;';
        info.textContent = `${hooks.length} svenska hooks`;
        container.appendChild(info);

        hooks.forEach(hook => {
            const div = document.createElement('div');
            div.style.cssText = 'padding: 16px; margin-bottom: 12px; border: 2px solid #eee; border-radius: 12px; cursor: pointer; background: white; transition: all 0.2s;';
            div.textContent = hook.substring(0, 100) + (hook.length > 100 ? '...' : '');
            div.onmouseenter = function () { this.style.borderColor = '#d4a574'; this.style.background = '#faf8f5'; };
            div.onmouseleave = function () { this.style.borderColor = '#eee'; this.style.background = 'white'; };
            div.onclick = () => addHookToContent(hook);
            container.appendChild(div);
        });

    } else {
        svTab.style.background = '#f5f1eb';
        svTab.style.color = '#2c2416';
        viralTab.style.background = 'linear-gradient(135deg, #d4a574 0%, #e8c298 100%)';
        viralTab.style.color = 'white';

        // Show Viral Hooks with Category Selector
        container.innerHTML = '';

        // Add category selector
        const categoryDiv = document.createElement('div');
        categoryDiv.style.cssText = 'margin-bottom: 20px;';
        categoryDiv.innerHTML = `
            <label style="display: block; font-weight: 600; color: #2c2416; margin-bottom: 8px;">🎯 Välj Hook-Kategori:</label>
            <select id="hookCategorySelect" onchange="filterHooksByCategory()" style="width: 100%; padding: 12px; border: 2px solid #e5d4c1; border-radius: 8px; font-size: 1em;">
                <option value="all">🔥 Alla Hooks (949)</option>
                <option value="educational">📚 Educational (472)</option>
                <option value="storytelling">📖 Storytelling (368)</option>
                <option value="myth_busting">💥 Myth Busting (58)</option>
                <option value="comparison">⚖️ Comparison (31)</option>
                <option value="authority">👑 Authority (9)</option>
                <option value="random">🎲 Random (11)</option>
            </select>
        `;
        container.appendChild(categoryDiv);

        // Add hooks container
        const hooksDiv = document.createElement('div');
        hooksDiv.id = 'viralHooksContainer';
        hooksDiv.style.cssText = 'max-height: 300px; overflow-y: auto;';
        container.appendChild(hooksDiv);

        // Initialize hooks
        filterHooksByCategory();
    }
}

function addHookToContent(hookText) {
    const contentInput = document.getElementById('contentDraftInput');
    if (contentInput) {
        const currentContent = contentInput.value;
        const newContent = hookText + (currentContent ? '\n\n' + currentContent : '');
        contentInput.value = newContent;

        const current = POSTS.getCurrent();
        current.content = newContent;
        POSTS.setCurrent(current);

        // Alert removed
    }
}

function renderStorytellingSection() {
    const leftCol = document.getElementById('masterLeftCol');
    if (!leftCol) return;

    const section = document.createElement('div');
    section.style.cssText = 'background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);';

    const title = document.createElement('h3');
    title.style.cssText = 'font-size: 1.4em; color: #2c2416; margin: 0 0 20px 0; font-weight: 700;';
    title.textContent = '📖 Storytelling Structures';
    section.appendChild(title);

    const container = document.createElement('div');
    container.style.cssText = 'max-height: 400px; overflow-y: auto;';

    const structures = typeof STORYTELLING_STRUCTURES !== 'undefined' ? STORYTELLING_STRUCTURES : [];

    if (structures.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 40px;">Inga storytelling structures</p>';
    } else {
        const info = document.createElement('div');
        info.style.cssText = 'padding: 12px; background: #f5f1eb; border-radius: 8px; margin-bottom: 16px; color: #2c2416; font-weight: 600;';
        info.textContent = `${structures.length} storytelling structures`;
        container.appendChild(info);

        structures.forEach(structure => {
            const div = document.createElement('div');
            div.style.cssText = 'padding: 16px; margin-bottom: 12px; border: 2px solid #eee; border-radius: 12px; cursor: pointer; background: white; transition: all 0.2s;';
            div.textContent = structure.substring(0, 120) + (structure.length > 120 ? '...' : '');
            div.onmouseenter = function () { this.style.borderColor = '#d4a574'; this.style.background = '#faf8f5'; };
            div.onmouseleave = function () { this.style.borderColor = '#eee'; this.style.background = 'white'; };
            div.onclick = () => addToContent(structure);
            container.appendChild(div);
        });
    }

    section.appendChild(container);
    leftCol.appendChild(section);
}

function renderCTASection() {
    const leftCol = document.getElementById('masterLeftCol');
    if (!leftCol) return;

    const section = document.createElement('div');
    section.style.cssText = 'background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);';

    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;';

    const title = document.createElement('h3');
    title.style.cssText = 'font-size: 1.4em; color: #2c2416; margin: 0; font-weight: 700;';
    title.textContent = '🎯 Call-to-Actions';
    header.appendChild(title);

    // Tabs
    const tabs = document.createElement('div');
    tabs.style.cssText = 'display: flex; gap: 8px;';

    const svTab = document.createElement('button');
    svTab.id = 'ctaTabSv';
    svTab.textContent = '📝 Svenska';
    svTab.style.cssText = 'padding: 8px 16px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;';
    svTab.onclick = () => switchCTATab('sv');

    const salesTab = document.createElement('button');
    salesTab.id = 'ctaTabSales';
    salesTab.textContent = '💰 Follows & Sales';
    salesTab.style.cssText = 'padding: 8px 16px; background: #f5f1eb; color: #2c2416; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;';
    salesTab.onclick = () => switchCTATab('sales');

    tabs.appendChild(svTab);
    tabs.appendChild(salesTab);
    header.appendChild(tabs);
    section.appendChild(header);

    const container = document.createElement('div');
    container.id = 'ctaContainer';
    container.style.cssText = 'max-height: 400px; overflow-y: auto;';
    section.appendChild(container);

    leftCol.appendChild(section);

    // Show svenska by default
    switchCTATab('sv');
}

function switchCTATab(type) {
    const container = document.getElementById('ctaContainer');
    if (!container) return;

    const svTab = document.getElementById('ctaTabSv');
    const salesTab = document.getElementById('ctaTabSales');

    if (type === 'sv') {
        svTab.style.background = 'linear-gradient(135deg, #d4a574 0%, #e8c298 100%)';
        svTab.style.color = 'white';
        salesTab.style.background = '#f5f1eb';
        salesTab.style.color = '#2c2416';

        const ctas = typeof ALL_CTAS !== 'undefined' ? ALL_CTAS : [];
        container.innerHTML = '';

        const info = document.createElement('div');
        info.style.cssText = 'padding: 12px; background: #f5f1eb; border-radius: 8px; margin-bottom: 16px; color: #2c2416; font-weight: 600;';
        info.textContent = `${ctas.length} svenska CTAs`;
        container.appendChild(info);

        ctas.forEach(cta => {
            const div = document.createElement('div');
            div.style.cssText = 'padding: 16px; margin-bottom: 12px; border: 2px solid #eee; border-radius: 12px; cursor: pointer; background: white; transition: all 0.2s;';
            div.textContent = cta;
            div.onmouseenter = function () { this.style.borderColor = '#d4a574'; this.style.background = '#faf8f5'; };
            div.onmouseleave = function () { this.style.borderColor = '#eee'; this.style.background = 'white'; };
            div.onclick = () => addToContentEnd(cta);
            container.appendChild(div);
        });

    } else {
        svTab.style.background = '#f5f1eb';
        svTab.style.color = '#2c2416';
        salesTab.style.background = 'linear-gradient(135deg, #d4a574 0%, #e8c298 100%)';
        salesTab.style.color = 'white';

        const ctas = typeof CTA_FOLLOWS_SALES !== 'undefined' ? CTA_FOLLOWS_SALES : [];
        container.innerHTML = '';

        const info = document.createElement('div');
        info.style.cssText = 'padding: 12px; background: #f5f1eb; border-radius: 8px; margin-bottom: 16px; color: #2c2416; font-weight: 600;';
        info.textContent = `${ctas.length} follows & sales CTAs`;
        container.appendChild(info);

        ctas.forEach(cta => {
            const div = document.createElement('div');
            div.style.cssText = 'padding: 16px; margin-bottom: 12px; border: 2px solid #eee; border-radius: 12px; cursor: pointer; background: white; transition: all 0.2s;';
            div.textContent = cta;
            div.onmouseenter = function () { this.style.borderColor = '#d4a574'; this.style.background = '#faf8f5'; };
            div.onmouseleave = function () { this.style.borderColor = '#eee'; this.style.background = 'white'; };
            div.onclick = () => addToContentEnd(cta);
            container.appendChild(div);
        });
    }
}

function addToContent(text) {
    const contentInput = document.getElementById('contentDraftInput');
    if (contentInput) {
        const currentContent = contentInput.value;
        const newContent = text + (currentContent ? '\n\n' + currentContent : '');
        contentInput.value = newContent;

        const current = POSTS.getCurrent();
        current.content = newContent;
        POSTS.setCurrent(current);

        alert('✅ Tillagd!');
    }
}

function addToContentEnd(text) {
    const contentInput = document.getElementById('contentDraftInput');
    if (contentInput) {
        const currentContent = contentInput.value;
        const newContent = (currentContent ? currentContent + '\n\n' : '') + text;
        contentInput.value = newContent;

        const current = POSTS.getCurrent();
        current.content = newContent;
        POSTS.setCurrent(current);

        // Alert removed
    }
}

function renderContentDraft() {
    const leftCol = document.getElementById('masterLeftCol');
    if (!leftCol) return;
    const currentPost = POSTS.getCurrent();

    const section = document.createElement('div');
    section.style.cssText = 'background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);';
    section.innerHTML = '<h3 style="font-size: 1.4em; color: #2c2416; margin: 0 0 20px 0; font-weight: 700;">✍️ Ditt Content</h3><textarea id="contentDraftInput" rows="15" placeholder="Här kommer din färdiga text..." style="width: 100%; padding: 20px; border: 2px solid #d4a574; border-radius: 12px; font-size: 1.05em; font-family: Poppins, sans-serif; line-height: 1.8; resize: vertical;">' + (currentPost.content || '') + '</textarea>';
    leftCol.appendChild(section);

    setTimeout(() => {
        const input = document.getElementById('contentDraftInput');
        if (input) {
            input.addEventListener('input', function () {
                const current = POSTS.getCurrent();
                current.content = this.value;
                POSTS.setCurrent(current);
            });
        }
    }, 100);
}

function renderQuickActions() {
    const rightCol = document.getElementById('masterRightCol');
    if (!rightCol) return;
    const currentPost = POSTS.getCurrent();

    const section = document.createElement('div');
    section.style.cssText = 'background: white; padding: 24px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);';

    let html = '<h3 style="font-size: 1.2em; color: #2c2416; margin: 0 0 20px 0; font-weight: 700;">⚡ Snabbåtgärder</h3>';
    html += '<button onclick="copyContentDraft()" style="width: 100%; padding: 14px; margin-bottom: 12px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer;">📋 Kopiera Text</button>';
    html += '<button onclick="schedulePost()" style="width: 100%; padding: 14px; margin-bottom: 12px; background: rgba(212, 165, 116, 0.2); color: #2c2416; border: none; border-radius: 12px; font-weight: 700; cursor: pointer;">📅 Schemalägg</button>';
    html += '<button onclick="savePost()" style="width: 100%; padding: 14px; margin-bottom: 12px; background: rgba(212, 165, 116, 0.2); color: #2c2416; border: none; border-radius: 12px; font-weight: 700; cursor: pointer;">💾 Spara</button>';
    html += '<button onclick="clearCurrentPost()" style="width: 100%; padding: 14px; background: rgba(0,0,0,0.05); color: #999; border: none; border-radius: 12px; font-weight: 600; cursor: pointer;">🗑️ Rensa allt</button>';

    html += '<hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">';
    html += '<h4 style="font-size: 1em; color: #2c2416; margin: 0 0 12px 0; font-weight: 700;">🎥 Video Format Ideas</h4>';
    html += '<select id="videoFormatSelect" onchange="addVideoFormat(this.value)" style="width: 100%; padding: 10px; margin-bottom: 12px; border: 2px solid #d4a574; border-radius: 8px; font-size: 0.9em; background: white; cursor: pointer;"><option value="">-- Välj format --</option>';

    if (typeof VIDEO_FORMAT_IDEAS !== 'undefined') {
        VIDEO_FORMAT_IDEAS.forEach(format => {
            html += `<option value="${format}">${format}</option>`;
        });
    }
    html += '</select>';

    html += '<h4 style="font-size: 1em; color: #2c2416; margin: 0 0 12px 0; font-weight: 700;">💡 Content Format Ideas</h4>';
    html += '<select id="contentFormatSelect" onchange="addContentFormat(this.value)" style="width: 100%; padding: 10px; margin-bottom: 16px; border: 2px solid #d4a574; border-radius: 8px; font-size: 0.9em; background: white; cursor: pointer;"><option value="">-- Välj format --</option>';

    if (typeof CONTENT_FORMAT_IDEAS !== 'undefined') {
        CONTENT_FORMAT_IDEAS.forEach(format => {
            html += `<option value="${format}">${format}</option>`;
        });
    }
    html += '</select>';

    html += '<h4 style="font-size: 1em; color: #2c2416; margin: 0 0 12px 0; font-weight: 700;">💭 Content Ideas</h4>';
    html += '<select id="contentIdeaSelect" onchange="addContentIdea(this.value)" style="width: 100%; padding: 10px; margin-bottom: 16px; border: 2px solid #d4a574; border-radius: 8px; font-size: 0.9em; background: white; cursor: pointer;"><option value="">-- Välj idé --</option>';

    if (typeof CONTENT_IDEAS !== 'undefined') {
        CONTENT_IDEAS.forEach(idea => {
            html += `<option value="${idea}">${idea}</option>`;
        });
    }
    html += '</select>';

    html += '<hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">';
    html += '<h4 style="font-size: 1em; color: #2c2416; margin: 0 0 12px 0; font-weight: 700;">📚 Resurser</h4>';
    html += '<button onclick="showSavedPosts()" style="width: 100%; padding: 10px; margin-bottom: 8px; background: rgba(212, 165, 116, 0.1); border: none; border-radius: 8px; cursor: pointer; text-align: left; color: #2c2416; font-weight: 600;">📚 Mina Posts</button>';
    html += '<button onclick="showUploadResourceModal()" style="width: 100%; padding: 10px; margin-bottom: 8px; background: rgba(212, 165, 116, 0.15); border: 2px solid #d4a574; border-radius: 8px; cursor: pointer; text-align: left; color: #2c2416; font-weight: 600;">📤 Ladda upp resurs</button>';

    section.innerHTML = html;
    rightCol.appendChild(section);
}

function addVideoFormat(format) {
    if (!format) return;

    const contentInput = document.getElementById('contentDraftInput');
    if (contentInput) {
        const text = `[VIDEO FORMAT: ${format}]\n\n`;
        contentInput.value = text + contentInput.value;

        const current = POSTS.getCurrent();
        current.content = contentInput.value;
        POSTS.setCurrent(current);

        // Alert removed
    }

    // Reset dropdown
    document.getElementById('videoFormatSelect').value = '';
}

function addContentFormat(format) {
    if (!format) return;

    const contentInput = document.getElementById('contentDraftInput');
    if (contentInput) {
        const text = `[CONTENT FORMAT: ${format}]\n\n`;
        contentInput.value = text + contentInput.value;

        const current = POSTS.getCurrent();
        current.content = contentInput.value;
        POSTS.setCurrent(current);

        // Alert removed
    }

    // Reset dropdown
    document.getElementById('contentFormatSelect').value = '';
}

function addContentIdea(idea) {
    if (!idea) return;

    const contentInput = document.getElementById('contentDraftInput');
    if (contentInput) {
        const text = `💡 CONTENT IDÉ:\n${idea}\n\n---\n\n`;
        contentInput.value = text + contentInput.value;

        const current = POSTS.getCurrent();
        current.content = contentInput.value;
        POSTS.setCurrent(current);

        // Alert removed
    }

    // Reset dropdown
    document.getElementById('contentIdeaSelect').value = '';
}

function copyContentDraft() {
    const content = document.getElementById('contentDraftInput');
    if (!content || !content.value) {
        alert('Ingen text att kopiera!');
        return;
    }
    navigator.clipboard.writeText(content.value);
    alert('✅ Text kopierad!');
}

function schedulePost() {
    // Save current post first
    const current = POSTS.getCurrent();
    if (!current.content || current.content.trim().length === 0) {
        alert('⚠️ Skriv något content först!');
        return;
    }

    // Save the post
    POSTS.save(current);

    // Open calendar
    showPage('calendar30');

    // Show info
    setTimeout(() => {
        alert('📅 Välj ett datum i kalendern för att schemalägga din post!');
    }, 500);
}

function savePost() {
    const current = POSTS.getCurrent();

    if (!current.content || current.content.trim().length === 0) {
        alert('⚠️ Skriv något content först!');
        return;
    }

    // Ask for status
    const statusChoice = prompt('Välj status:\n1 = Utkast 📝\n2 = Pågående 🔄\n3 = Klar ✅\n4 = Publicerad 🌟\n\nSkriv 1, 2, 3 eller 4:');

    const statusMap = {
        '1': 'draft',
        '2': 'in-progress',
        '3': 'ready',
        '4': 'published'
    };

    if (statusChoice && statusMap[statusChoice]) {
        current.status = statusMap[statusChoice];
        POSTS.save(current);

        const statusNames = {
            'draft': 'Utkast',
            'in-progress': 'Pågående',
            'ready': 'Klar',
            'published': 'Publicerad'
        };

        alert('✅ Post sparad som: ' + statusNames[current.status] + '!');
    } else if (statusChoice) {
        alert('❌ Ogiltigt val. Försök igen.');
    }
}

function clearCurrentPost() {
    if (confirm('Rensa allt? Detta går inte att ångra.')) {
        POSTS.setCurrent(POSTS._createEmpty());
        showPremiumContentCreator();
    }
}


function showSavedPosts() {
    const content = document.getElementById('mainContent');
    if (!content) return;
    const posts = POSTS.getAll();

    let html = '<div style="max-width: 1400px; margin: 0 auto; padding: 20px;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;"><div><h1 style="font-size: 2.5em; color: #2c2416; margin: 0; font-weight: 700;">📚 Mina Posts</h1><p style="color: #6b5d4f; font-size: 1.1em; margin: 8px 0 0 0;">' + posts.length + ' sparade posts</p></div><div style="display: flex; gap: 12px;"><button onclick="showPremiumContentCreator()" style="padding: 14px 24px; background: rgba(212, 165, 116, 0.1); color: #2c2416; border: 2px solid #d4a574; border-radius: 12px; font-weight: 700; cursor: pointer;">← Tillbaka</button><button onclick="showPremiumContentCreator()" style="padding: 14px 24px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer;">✨ Skapa ny</button></div></div>';

    if (posts.length === 0) {

        // Add category selector for viral hooks
        html += '<div style="margin-bottom: 20px;">';
        html += '<label style="display: block; font-weight: 600; color: #2c2416; margin-bottom: 8px;">🎯 Välj Hook-Kategori:</label>';
        html += '<select id="hookCategorySelect" onchange="filterHooksByCategory()" style="width: 100%; padding: 12px; border: 2px solid #e5d4c1; border-radius: 8px; font-size: 1em;">';
        html += '<option value="all">Alla Hooks (949)</option>';
        html += '<option value="educational">📚 Educational (472)</option>';
        html += '<option value="storytelling">📖 Storytelling (368)</option>';
        html += '<option value="myth_busting">💥 Myth Busting (58)</option>';
        html += '<option value="comparison">⚖️ Comparison (31)</option>';
        html += '<option value="random">🎲 Random (11)</option>';
        html += '<option value="authority">👑 Authority (9)</option>';
        html += '</select>';
        html += '</div>';

        html += '<div style="background: white; padding: 60px; border-radius: 20px; text-align: center;"><div style="font-size: 4em; margin-bottom: 20px;">📝</div><h2 style="color: #2c2416;">Inga posts ännu</h2><button onclick="showPremiumContentCreator()" style="padding: 16px 32px; background: linear-gradient(135deg, #d4a574 0%, #e8c298 100%); color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; margin-top: 20px;">🚀 Skapa första posten</button></div>';
    } else {
        html += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px;">';
        posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).forEach(post => {
            const status = MC_CONFIG.statuses.find(s => s.id === post.status) || MC_CONFIG.statuses[0];
            const preview = (post.content || post.freeText || '').substring(0, 150);
            const date = new Date(post.updatedAt).toLocaleDateString('sv-SE');
            html += '<div onclick="loadPost(' + post.id + ')" style="background: white; padding: 24px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); cursor: pointer;"><span style="padding: 6px 12px; background: ' + status.color + '20; color: ' + status.color + '; border-radius: 8px; font-size: 0.85em; font-weight: 600;">' + status.emoji + ' ' + status.name + '</span><div style="color: #2c2416; line-height: 1.6; margin: 12px 0; min-height: 60px;">' + preview + '...</div><div style="color: #999; font-size: 0.9em;">📅 ' + date + '</div><button onclick=\'deletePremiumPost(\"' + post.id + '\")\'style=\'padding:8px 16px;background:#ff4444;color:white;border:none;border-radius:8px;cursor:pointer;margin-top:10px;\'title=\'Radera post\'>🗑️ Radera</button></div>';
        });
        html += '</div>';
    }

    html += '</div>';
    content.innerHTML = html;
}

function loadPost(postId) {
    const posts = POSTS.getAll();
    const post = posts.find(p => p.id === postId);
    if (post) {
        POSTS.setCurrent(post);
        showPremiumContentCreator();
    }
}




function filterHooksByCategory() {
    const category = document.getElementById('hookCategorySelect').value;
    const container = document.getElementById('viralHooksContainer');
    if (!container) return;

    let hooks = [];
    if (category === 'all') {
        // Combine all hooks
        Object.keys(VIRAL_HOOKS_ORGANIZED).forEach(cat => {
            hooks = hooks.concat(VIRAL_HOOKS_ORGANIZED[cat]);
        });
    } else {
        hooks = VIRAL_HOOKS_ORGANIZED[category] || [];
    }

    // Re-render hooks
    container.innerHTML = '';
    hooks.forEach((hook, index) => {
        const hookEl = document.createElement('div');
        hookEl.style.cssText = 'padding: 12px; background: #f8f5f0; border-radius: 8px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s;';
        hookEl.textContent = hook;
        hookEl.onclick = () => {
            const contentInput = document.getElementById('contentDraftInput');
            if (contentInput) {
                contentInput.value = hook + '\n\n' + contentInput.value;
                const current = POSTS.getCurrent();
                current.content = contentInput.value;
                POSTS.setCurrent(current);
            }
        };
        hookEl.onmouseenter = () => hookEl.style.background = '#e8dcc8';
        hookEl.onmouseleave = () => hookEl.style.background = '#f8f5f0';
        container.appendChild(hookEl);
    });
}


function deletePremiumPost(id) {
    if (!confirm('Radera?')) return;
    let posts = JSON.parse(localStorage.getItem('linnartistry_premium_posts') || '[]');
    posts = posts.filter(p => p.id !== id);
    localStorage.setItem('linnartistry_premium_posts', JSON.stringify(posts));
    showSavedPosts();
}

function deleteResource(resourceId) {
    if (!confirm('Är du säker på att du vill radera denna resurs?')) return;

    let resources = JSON.parse(localStorage.getItem('linnartistry_resources') || '[]');
    resources = resources.filter(r => r.id !== resourceId);
    localStorage.setItem('linnartistry_resources', JSON.stringify(resources));

    showPage('resources');
    if (typeof showNotification === 'function') {
        showNotification('🗑️ Resurs raderad', 'success');
    }
}
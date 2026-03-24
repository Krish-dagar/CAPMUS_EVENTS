import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const MAPS = {
    "MG Auditorium": "https://maps.google.com/?q=VIT+Chennai+MG+Auditorium",
    "Kasturba Hall": "https://maps.google.com/?q=VIT+Chennai+Kasturba+Hall",
    "Kamraj Auditorium": "https://maps.google.com/?q=VIT+Chennai+Kamraj+Auditorium",
    "Netaji Auditorium": "https://maps.google.com/?q=VIT+Chennai+Netaji+Auditorium",
    "VOC Auditorium": "https://maps.google.com/?q=VIT+Chennai+VOC+Auditorium",
    "AB-1 101": "https://maps.google.com/?q=VIT+Chennai+AB1",
    "AB-3 601": "https://maps.google.com/?q=VIT+Chennai+AB3",
    "Seminar Hall A": "https://maps.google.com/?q=VIT+Chennai+Seminar+Hall",
    "Block B Lab": "https://maps.google.com/?q=VIT+Chennai+Block+B",
    "Outdoor Ground": "https://maps.google.com/?q=VIT+Chennai+Ground",
    "CSE Lab - Block D": "https://maps.google.com/?q=VIT+Chennai+Block+D",
};
const VENUE_CAP = {
    "MG Auditorium": 2000, "Kasturba Hall": 250, "Kamraj Auditorium": 300,
    "Netaji Auditorium": 350, "VOC Auditorium": 100, "AB-1 101": 50,
    "AB-3 601": 100, "Seminar Hall A": 80, "Block B Lab": 40,
    "Outdoor Ground": 1000, "CSE Lab - Block D": 60,
};
const CGRAD = { technical: "#1a3c8e", cultural: "#e65100", sports: "#2e7d32", workshop: "#f9a825" };
const EMJ = { technical: "⚙️", cultural: "🎭", sports: "🏆", workshop: "🔧" };

const INITIAL_CLUBS = [
    {
        id: "ieee", name: "IEEE Student Chapter", password: "club123", emoji: "⚡",
        category: "technical", founded: "2018", advisor: "Dr. Rajesh Kumar",
        contact: "ieee@vit.ac.in", instagram: "@ieee_vitchennai", points: 1840, monthlyRank: 1,
        members: [
            { id: "m1", name: "Arjun Selvam", regNo: "21CSE001", dept: "CSE", role: "President", points: 240 },
            { id: "m2", name: "Kavya Rajan", regNo: "21CSE018", dept: "CSE", role: "Vice President", points: 210 },
            { id: "m3", name: "Deepan M", regNo: "21CSE034", dept: "CSE", role: "Secretary", points: 185 },
            { id: "m4", name: "Nithya S", regNo: "21IT007", dept: "IT", role: "Treasurer", points: 160 },
            { id: "m5", name: "Vimal K", regNo: "21CSE051", dept: "CSE", role: "Member", points: 140 },
            { id: "m6", name: "Preethi A", regNo: "21ECE022", dept: "ECE", role: "Member", points: 120 },
        ],
        announcements: [
            { id: "a1", type: "announcement", title: "General Body Meeting", body: "Monthly GBM is scheduled for Saturday 5 PM in CSE Seminar Hall. All members must attend.", time: "2 days ago" },
            { id: "a2", type: "recruitment", title: "Recruiting New Members!", body: "IEEE VIT is opening applications for 2026 batch. Apply via the club portal before March 30.", time: "5 days ago" },
        ],
    },
    {
        id: "gdsc", name: "GDSC VIT", password: "club123", emoji: "🌐",
        category: "technical", founded: "2020", advisor: "Dr. Priya Nair",
        contact: "gdsc@vit.ac.in", instagram: "@gdsc_vitchennai", points: 1620, monthlyRank: 2,
        members: [
            { id: "g1", name: "Santhosh R", regNo: "21CSE012", dept: "CSE", role: "Lead", points: 220 },
            { id: "g2", name: "Ananya K", regNo: "21IT014", dept: "IT", role: "Co-Lead", points: 195 },
            { id: "g3", name: "Hari P", regNo: "21CSE045", dept: "CSE", role: "Member", points: 170 },
        ],
        announcements: [
            { id: "ga1", type: "announcement", title: "Flutter Workshop Prep", body: "Members interested in conducting the Flutter workshop, please submit your topics by Friday.", time: "1 day ago" },
        ],
    },
    {
        id: "finearts", name: "Fine Arts Club", password: "club123", emoji: "🎨",
        category: "cultural", founded: "2015", advisor: "Prof. Meena Devi",
        contact: "arts@vit.ac.in", instagram: "@finearts_vitchennai", points: 1240, monthlyRank: 3,
        members: [
            { id: "f1", name: "Divya R", regNo: "21ARCH001", dept: "ARCH", role: "President", points: 200 },
            { id: "f2", name: "Ramprasad S", regNo: "21CIVIL010", dept: "CIVIL", role: "Secretary", points: 175 },
        ],
        announcements: [],
    },
    {
        id: "sports", name: "Sports Board", password: "club123", emoji: "🏆",
        category: "sports", founded: "2010", advisor: "Mr. Balamurugan",
        contact: "sports@vit.ac.in", instagram: "@sports_vitchennai", points: 1380, monthlyRank: 4,
        members: [
            { id: "s1", name: "Kiran M", regNo: "21MECH005", dept: "MECH", role: "Captain", points: 230 },
            { id: "s2", name: "Lokesh A", regNo: "21EEE009", dept: "EEE", role: "Vice Captain", points: 190 },
        ],
        announcements: [],
    },
];

const INITIAL_EVENTS = [
    { id: 1, title: "Code Wars 3.0", club: "IEEE Student Chapter", cat: "technical", date: "2026-03-28", time: "10:00 AM - 1:00 PM", venue: "CSE Lab - Block D", fee: "Free", od: "yes", ref: "yes", dl: "2026-03-25", coord: "ieee@vit.ac.in", emoji: "💻", seats: 120, desc: "3-hour competitive coding challenge with live leaderboards and prizes.", loc: "Block D, Ground Floor, Room D101", clubId: "ieee" },
    { id: 2, title: "Freshers Cultural Night", club: "Student Cultural Committee", cat: "cultural", date: "2026-03-30", time: "06:00 PM - 09:00 PM", venue: "MG Auditorium", fee: "Free", od: "no", ref: "yes", dl: "2026-03-28", coord: "cultural@vit.ac.in", emoji: "🎭", seats: 2000, desc: "Welcome freshers with an evening of music, dance and drama.", loc: "MG Auditorium, Central Block" },
    { id: 3, title: "Inter-Dept Cricket", club: "Sports Board", cat: "sports", date: "2026-04-02", time: "08:00 AM - 05:00 PM", venue: "Outdoor Ground", fee: "₹50/team", od: "no", ref: "yes", dl: "2026-03-30", coord: "sports@vit.ac.in", emoji: "🏏", seats: 500, desc: "Annual inter-department cricket tournament. Teams of 11.", loc: "Main Cricket Ground, Behind Block A", clubId: "sports" },
    { id: 4, title: "UI/UX Design Workshop", club: "Design Thinking Club", cat: "workshop", date: "2026-04-05", time: "09:00 AM - 04:00 PM", venue: "Seminar Hall A", fee: "₹100", od: "yes", ref: "yes", dl: "2026-04-02", coord: "design@vit.ac.in", emoji: "🎨", seats: 80, desc: "Full-day Figma workshop: wireframing, prototyping and user research.", loc: "Block A, Second Floor, Seminar Hall" },
    { id: 5, title: "Hackathon 2025", club: "ISTE Chapter", cat: "technical", date: "2026-04-08", time: "09:00 AM - 09:00 AM+1", venue: "Block C Hall", fee: "Free", od: "yes", ref: "yes", dl: "2026-04-04", coord: "iste@vit.ac.in", emoji: "⚡", seats: 300, desc: "24-hour hackathon. Build solutions for real-world problems.", loc: "Block C, All Floors" },
    { id: 6, title: "Classical Dance Competition", club: "Fine Arts Club", cat: "cultural", date: "2026-04-12", time: "02:00 PM - 06:00 PM", venue: "Kasturba Hall", fee: "₹30", od: "no", ref: "no", dl: "2026-04-10", coord: "arts@vit.ac.in", emoji: "💃", seats: 250, desc: "Solo and group classical dance competition. All classical styles welcome.", loc: "Kasturba Hall, Women's Block", clubId: "finearts" },
    { id: 7, title: "PCB Design Workshop", club: "Electronics Club", cat: "workshop", date: "2026-04-15", time: "10:00 AM - 02:00 PM", venue: "Block B Lab", fee: "₹150", od: "yes", ref: "no", dl: "2026-04-12", coord: "elec@vit.ac.in", emoji: "🔌", seats: 60, desc: "Hands-on PCB design using KiCad. All participants get a starter kit.", loc: "Block B, ECE Lab 3, Room B302" },
    { id: 8, title: "Basketball Tournament", club: "Sports Board", cat: "sports", date: "2026-04-18", time: "09:00 AM - 06:00 PM", venue: "Outdoor Ground", fee: "₹100/team", od: "no", ref: "yes", dl: "2026-04-15", coord: "sports@vit.ac.in", emoji: "🏀", seats: 400, desc: "3x3 and 5x5 basketball formats. Men and women categories.", loc: "Basketball Court, East Side Ground", clubId: "sports" },
    { id: 9, title: "AI/ML Seminar", club: "AI Research Club", cat: "technical", date: "2026-04-20", time: "11:00 AM - 01:00 PM", venue: "MG Auditorium", fee: "Free", od: "yes", ref: "yes", dl: "2026-04-18", coord: "aiclub@vit.ac.in", emoji: "🤖", seats: 2000, desc: "National-level guest lecture on Generative AI and LLMs.", loc: "MG Auditorium, Ground Floor" },
    { id: 10, title: "Campus Treasure Hunt", club: "Student Council", cat: "cultural", date: "2026-04-22", time: "09:00 AM - 12:00 PM", venue: "Outdoor Ground", fee: "Free", od: "no", ref: "yes", dl: "2026-04-20", coord: "council@vit.ac.in", emoji: "🗺️", seats: 600, desc: "Campus-wide treasure hunt. Teams of 5.", loc: "Starts at Admin Block Steps" },
    { id: 11, title: "VIT Tech Fest 2026", club: "Student Technical Council", cat: "technical", date: "2026-04-25", time: "09:00 AM - 06:00 PM", venue: "MG Auditorium", fee: "₹50", od: "yes", ref: "yes", dl: "2026-04-22", coord: "techfest@vit.ac.in", emoji: "🧠", seats: 2000, desc: "Annual college-wide technical festival with paper presentations and project expos.", loc: "MG Auditorium + Campus Grounds" },
    { id: 12, title: "Annual Cultural Fest", club: "Student Cultural Committee", cat: "cultural", date: "2026-04-28", time: "05:00 PM - 10:00 PM", venue: "MG Auditorium", fee: "Free", od: "no", ref: "yes", dl: "2026-04-25", coord: "cultural@vit.ac.in", emoji: "🎶", seats: 2000, desc: "Grand annual cultural night with celebrity performances and dance battles.", loc: "MG Auditorium, Main Stage" },
    { id: 13, title: "Women in Tech Summit", club: "WIE IEEE Chapter", cat: "technical", date: "2026-05-02", time: "10:00 AM - 04:00 PM", venue: "Kasturba Hall", fee: "Free", od: "yes", ref: "yes", dl: "2026-04-29", coord: "wie@vit.ac.in", emoji: "👩‍💻", seats: 250, desc: "Full-day summit celebrating women in engineering with keynotes and workshops.", loc: "Kasturba Hall, Ground Floor" },
    { id: 14, title: "Robotics Championship", club: "Robotics Club", cat: "technical", date: "2026-05-05", time: "09:00 AM - 05:00 PM", venue: "MG Auditorium", fee: "₹200/team", od: "yes", ref: "yes", dl: "2026-05-01", coord: "robotics@vit.ac.in", emoji: "🤖", seats: 1800, desc: "Inter-college robotics arena battle. Prizes worth 1 lakh rupees.", loc: "MG Auditorium, Exhibition Hall" },
    { id: 15, title: "Farewell Night 2026", club: "Final Year Committee", cat: "cultural", date: "2026-05-10", time: "06:00 PM - 10:00 PM", venue: "Kasturba Hall", fee: "₹75", od: "no", ref: "yes", dl: "2026-05-07", coord: "farewell@vit.ac.in", emoji: "🎓", seats: 250, desc: "An evening to celebrate our final year graduates with dance, memories and dinner.", loc: "Kasturba Hall, Banquet Level" },
    { id: 16, title: "National Symposium on IoT", club: "ECE Association", cat: "technical", date: "2026-05-14", time: "09:30 AM - 05:00 PM", venue: "Kamraj Auditorium", fee: "₹80", od: "yes", ref: "yes", dl: "2026-05-11", coord: "ece@vit.ac.in", emoji: "📡", seats: 300, desc: "Industry-academia symposium on Internet of Things with expert talks.", loc: "Kamraj Auditorium, Block A" },
    { id: 17, title: "Entrepreneurship Summit", club: "E-Cell VIT", cat: "workshop", date: "2026-05-18", time: "10:00 AM - 06:00 PM", venue: "Netaji Auditorium", fee: "Free", od: "yes", ref: "yes", dl: "2026-05-15", coord: "ecell@vit.ac.in", emoji: "🚀", seats: 350, desc: "Full-day event with startup pitches, VC talks and ideathon.", loc: "Netaji Auditorium, Central Campus" },
    { id: 18, title: "Short Film Screening", club: "Film & Media Club", cat: "cultural", date: "2026-05-20", time: "04:00 PM - 07:00 PM", venue: "VOC Auditorium", fee: "Free", od: "no", ref: "no", dl: "2026-05-18", coord: "media@vit.ac.in", emoji: "🎬", seats: 100, desc: "Annual short film showcase by student filmmakers.", loc: "VOC Auditorium, Arts Block" },
    { id: 19, title: "Python Bootcamp", club: "Coding Club", cat: "workshop", date: "2026-05-22", time: "10:00 AM - 01:00 PM", venue: "AB-1 101", fee: "₹50", od: "yes", ref: "no", dl: "2026-05-20", coord: "codingclub@vit.ac.in", emoji: "🐍", seats: 50, desc: "Beginner-friendly Python bootcamp. Certificate provided.", loc: "AB-1, Room 101, Ground Floor" },
    { id: 20, title: "Web Dev Workshop", club: "GDSC VIT", cat: "workshop", date: "2026-05-25", time: "09:00 AM - 12:00 PM", venue: "AB-3 601", fee: "Free", od: "yes", ref: "yes", dl: "2026-05-22", coord: "gdsc@vit.ac.in", emoji: "🌐", seats: 100, desc: "Hands-on HTML, CSS and JavaScript workshop by GDSC.", loc: "AB-3, Room 601, Sixth Floor", clubId: "gdsc" },
    // Past events (already completed)
    { id: 101, title: "Python Fundamentals Workshop", club: "Coding Club VIT", cat: "workshop", date: "2026-03-05", time: "10:00 AM - 01:00 PM", venue: "AB-1 101", fee: "Free", od: "yes", ref: "yes", dl: "2026-03-03", coord: "codingclub@vit.ac.in", emoji: "🐍", seats: 60, desc: "Beginner-friendly Python workshop covering data types, loops, functions and file handling.", loc: "AB-1, Room 101, Ground Floor" },
    { id: 102, title: "ML Bootcamp 2026", club: "AI Research Club", cat: "technical", date: "2026-03-10", time: "09:00 AM - 05:00 PM", venue: "Seminar Hall A", fee: "₹50", od: "yes", ref: "yes", dl: "2026-03-08", coord: "aiclub@vit.ac.in", emoji: "🤖", seats: 80, desc: "Full-day bootcamp on Machine Learning fundamentals with hands-on Scikit-learn exercises.", loc: "Block A, Seminar Hall, Second Floor" },
    { id: 103, title: "Open Source Contribution Drive", club: "GDSC VIT", cat: "technical", date: "2026-03-18", time: "11:00 AM - 03:00 PM", venue: "AB-3 601", fee: "Free", od: "yes", ref: "no", dl: "2026-03-16", coord: "gdsc@vit.ac.in", emoji: "🌟", seats: 100, desc: "Hands-on session on contributing to open-source projects via GitHub. All skill levels welcome.", loc: "AB-3, Room 601, Sixth Floor", clubId: "gdsc" },
];

const INITIAL_PROPOSALS = [
    { id: "p1", clubId: "ieee", clubName: "IEEE Student Chapter", title: "Advanced AI Workshop", emoji: "🤖", cat: "workshop", date: "2026-04-15", time: "10:00 AM - 4:00 PM", venue: "MG Auditorium", fee: "₹150", maxParticipants: 200, expectedParticipants: 150, deadline: "2026-04-10", od: "yes", desc: "Full-day workshop on Deep Learning, CNNs and LLMs. Industry speaker from TCS.", resources: ["Projector", "Sound System", "IT Support", "WiFi Extension"], notes: "Need 20 laptops from IT Lab.", status: "pending", adminRemark: "", suggestedDate: "", suggestedVenue: "", submittedOn: "2026-03-18" },
    { id: "p2", clubId: "gdsc", clubName: "GDSC VIT", title: "Flutter Dev Bootcamp", emoji: "🦋", cat: "workshop", date: "2026-04-22", time: "09:00 AM - 5:00 PM", venue: "AB-3 601", fee: "Free", maxParticipants: 100, expectedParticipants: 80, deadline: "2026-04-19", od: "yes", desc: "Two-day Flutter bootcamp covering Dart basics, UI components, state management.", resources: ["Projector", "IT Support", "WiFi Extension"], notes: "Please provide extension boards for charging.", status: "approved", adminRemark: "Approved. Coordinate with IT dept for WiFi.", suggestedDate: "", suggestedVenue: "", submittedOn: "2026-03-10" },
    { id: "p3", clubId: "finearts", clubName: "Fine Arts Club", title: "Canvas & Colors Fest", emoji: "🎨", cat: "cultural", date: "2026-05-05", time: "02:00 PM - 6:00 PM", venue: "Kasturba Hall", fee: "Free", maxParticipants: 150, expectedParticipants: 100, deadline: "2026-05-01", od: "no", desc: "Annual painting and sketching competition with themed rounds.", resources: ["Projector", "Housekeeping"], notes: "Need 50 drawing boards from the college.", status: "revision", adminRemark: "Please shift to VOC Auditorium - Kasturba Hall is booked that day.", suggestedDate: "2026-05-07", suggestedVenue: "VOC Auditorium", submittedOn: "2026-03-20" },
];

const FRIENDS = [
    { name: "Ashmita R", init: "A", ev: "Hackathon 2025" },
    { name: "Divesh K", init: "D", ev: "Code Wars 3.0" },
    { name: "Mrinal S", init: "M", ev: "AI/ML Seminar" },
    { name: "Priya T", init: "P", ev: "UI/UX Workshop" },
    { name: "Rajan V", init: "R", ev: "Hackathon 2025" },
];

const VENUES = ["MG Auditorium", "Kasturba Hall", "Kamraj Auditorium", "Netaji Auditorium", "VOC Auditorium", "AB-1 101", "AB-3 601", "Seminar Hall A", "Block B Lab", "Outdoor Ground", "CSE Lab - Block D"];
const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS", "AIML"];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Space Grotesk',sans-serif;background:#f0f2f5;color:#333}
  :root{
    --blue:#1a3c8e;--yellow:#ffc107;--bg:#f0f2f5;--white:#fff;
    --border:#ddd;--sub:#999;--sub2:#777;--green:#2e7d32;
    --mono:'JetBrains Mono',monospace;
  }
  .btn-primary{background:var(--blue);color:#fff;border:none;padding:9px 18px;border-radius:5px;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit}
  .btn-primary:hover{background:#142e6e}
  .btn-sol{background:var(--yellow);border:none;color:#111;padding:8px 18px;border-radius:5px;cursor:pointer;font-size:14px;font-weight:700;font-family:inherit}
  .btn-sol:hover{background:#e6ac00}
  .btn-out{background:transparent;border:2px solid var(--blue);color:var(--blue);padding:7px 16px;border-radius:5px;cursor:pointer;font-size:13px;font-weight:700;font-family:inherit}
  .btn-out:hover{background:#dce8ff}
  .btn-out-white{background:transparent;border:2px solid white;color:white;padding:8px 18px;border-radius:5px;cursor:pointer;font-size:14px;font-weight:700;font-family:inherit}
  .btn-out-white:hover{background:rgba(255,255,255,0.15)}
  input,select,textarea{font-family:inherit;font-size:14px;outline:none}
  .iw{margin-bottom:12px}
  .iw label{display:block;font-size:11px;font-weight:700;color:#555;margin-bottom:5px;text-transform:uppercase;letter-spacing:.05em}
  .iw input,.iw select,.iw textarea{width:100%;padding:10px 12px;background:#f8f9fa;border:1px solid var(--border);border-radius:5px;color:#333}
  .iw input:focus,.iw select:focus,.iw textarea:focus{border-color:var(--blue)}
  .err-box{background:#fff0f0;border:1px solid #f5a5a5;color:#c0392b;padding:9px 12px;border-radius:5px;font-size:13px;margin-bottom:10px}
  .hint-box{font-size:12px;color:var(--sub2);padding:7px 10px;background:#f0f4ff;border-radius:4px;border-left:3px solid var(--blue);margin-bottom:12px;font-family:var(--mono)}
  .tag-t{background:#dce8ff;color:var(--blue);padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700}
  .tag-c{background:#fdebd0;color:#e65100;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700}
  .tag-s{background:#d4edda;color:#2e7d32;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700}
  .tag-w{background:#fff9c4;color:#f9a825;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700}
  .rs-r{background:#e8f0fe;color:var(--blue);padding:2px 8px;border-radius:10px;font-size:11px;font-weight:700;font-family:var(--mono)}
  .rs-a{background:#d4edda;color:#2e7d32;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:700;font-family:var(--mono)}
  .rs-j{background:#f8d7da;color:#c0392b;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:700;font-family:var(--mono)}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
  .modal-box{background:#fff;border-radius:10px;padding:32px;width:100%;max-width:420px;position:relative;box-shadow:0 4px 24px rgba(0,0,0,.2);max-height:90vh;overflow-y:auto}
  .modal-close{position:absolute;top:12px;right:14px;background:none;border:none;font-size:18px;cursor:pointer;color:#aaa;line-height:1}
  .modal-close:hover{color:#333}
  .mtabs{display:flex;gap:4px;background:#f0f0f0;border-radius:6px;padding:4px;margin-bottom:18px}
  .mtab{flex:1;padding:8px;border:none;background:transparent;color:#777;border-radius:4px;cursor:pointer;font-size:13px;font-weight:700;font-family:inherit}
  .mtab.on{background:var(--blue);color:#fff}
  .slbl{font-size:12px;font-weight:700;color:var(--blue);text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:10px;letter-spacing:.05em}
  .slbl::after{content:'';flex:1;height:1px;background:var(--border)}
  .ph h2{font-size:24px;font-weight:700;color:var(--blue)}
  .ph p{color:var(--sub2);margin-top:4px;font-size:14px}
  .ph{margin-bottom:20px}
  .page-wrap{padding:24px;flex:1;max-width:1400px;margin:0 auto;width:100%}
  /* Topbar */
  .topbar{height:52px;background:var(--blue);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 16px;position:sticky;top:0;z-index:200}
  .alogo{font-size:16px;font-weight:700;color:#fff;margin-right:14px;flex-shrink:0}
  .ntabs{display:flex;height:100%;flex:1;overflow-x:auto}
  .ntab{display:flex;align-items:center;gap:5px;padding:0 14px;height:100%;border:none;background:transparent;color:rgba(255,255,255,.6);cursor:pointer;font-size:13px;font-weight:700;border-bottom:2px solid transparent;white-space:nowrap;font-family:inherit}
  .ntab:hover{color:#fff}
  .ntab.on{color:var(--yellow);border-bottom-color:var(--yellow)}
  .tbr{display:flex;align-items:center;gap:8px;margin-left:auto;flex-shrink:0}
  .od-badge{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:4px;padding:4px 10px}
  .od-track{width:60px;height:5px;background:rgba(255,255,255,.2);border-radius:3px;overflow:hidden}
  .od-fill{height:100%;border-radius:3px;transition:width .5s}
  .od-t{font-size:11px;color:rgba(255,255,255,.7);font-family:var(--mono)}
  .ubadge{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:4px;padding:4px 10px}
  .uav{width:22px;height:22px;border-radius:3px;background:var(--yellow);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#111}
  .uname{font-size:12px;color:#fff;font-family:var(--mono)}
  .lout{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.3);color:#fff;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:700;font-family:inherit}
  .lout:hover{background:rgba(255,255,255,.2)}
  /* Toast */
  .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);background:#222;color:#fff;padding:10px 20px;border-radius:6px;font-size:13px;display:flex;gap:8px;align-items:center;z-index:9999;opacity:0;transition:all .3s;pointer-events:none;font-family:var(--mono)}
  .toast.on{opacity:1;transform:translateX(-50%) translateY(0)}
  /* Event Card */
  .ev-card{background:#fff;border:1px solid var(--border);border-radius:8px;padding:16px;cursor:pointer;transition:border-color .15s,box-shadow .15s}
  .ev-card:hover{border-color:var(--blue);box-shadow:0 2px 8px rgba(26,60,142,.1)}
  .ev-emoji{font-size:28px;margin-bottom:8px}
  .ev-title{font-size:15px;font-weight:700;margin-bottom:4px;line-height:1.3}
  .ev-club{font-size:12px;color:var(--sub2);margin-bottom:10px}
  .ev-meta{display:flex;flex-direction:column;gap:4px;margin-bottom:12px}
  .ev-meta-row{font-size:12px;color:var(--sub2);display:flex;align-items:center;gap:5px}
  .ev-actions{display:flex;gap:8px;flex-wrap:wrap}
  .ev-reg-btn{background:var(--blue);color:#fff;border:none;padding:7px 14px;border-radius:4px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit}
  .ev-reg-btn:hover{background:#142e6e}
  .ev-reg-btn.registered{background:#d4edda;color:#2e7d32}
  .ev-save-btn{background:transparent;border:1px solid var(--border);padding:7px 10px;border-radius:4px;font-size:12px;cursor:pointer;color:var(--sub2);font-family:inherit}
  .ev-save-btn:hover{border-color:var(--blue);color:var(--blue)}
  /* Detail Modal */
  .dhero{padding:32px 28px 20px;border-radius:8px 8px 0 0;position:relative;display:flex;align-items:flex-end;gap:16px}
  .dhero-emoji{font-size:48px;line-height:1}
  .dhero-info{flex:1}
  .dhero-title{font-size:22px;font-weight:700;color:#fff;margin-bottom:6px}
  .dhero-club{font-size:13px;color:rgba(255,255,255,.7)}
  .dbody{padding:24px 28px 28px}
  .dmeta-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
  .dmeta-item{background:#f8f9fa;border-radius:6px;padding:10px 12px}
  .dmeta-label{font-size:10px;font-weight:700;color:var(--sub2);text-transform:uppercase;margin-bottom:3px;font-family:var(--mono)}
  .dmeta-val{font-size:13px;font-weight:600;color:#333}
  /* Events filter */
  .filter-bar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;align-items:center}
  .filter-bar input,.filter-bar select{padding:8px 12px;border:1px solid var(--border);border-radius:5px;background:#fff;font-size:13px}
  .filter-bar input:focus,.filter-bar select:focus{border-color:var(--blue)}
  /* Events grid */
  .ev-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
  /* Home */
  .greet-banner{display:flex;justify-content:space-between;align-items:flex-start;background:#fff;border:1px solid var(--border);border-radius:8px;padding:18px 22px;margin-bottom:20px;flex-wrap:wrap;gap:10px}
  .greet-hello{font-size:11px;font-weight:700;color:var(--blue);text-transform:uppercase;margin-bottom:4px;font-family:var(--mono)}
  .greet-name{font-size:26px;font-weight:700;color:#333}
  .greet-line{font-size:13px;color:#888;margin-top:4px}
  .greet-time{font-size:22px;font-weight:700;color:var(--blue);margin-top:4px;font-family:var(--mono)}
  .greet-date{font-size:12px;color:var(--sub)}
  /* Countdown */
  .countdown-box{background:#fff;border:1px solid var(--border);border-radius:8px;padding:18px 20px;margin-bottom:16px}
  .cd-event-name{font-size:14px;font-weight:700;color:var(--blue);margin-bottom:4px}
  .cd-label{font-size:12px;color:var(--sub);margin-bottom:10px;text-transform:uppercase;font-family:var(--mono)}
  .cd-timer{display:flex;align-items:center;gap:8px}
  .cd-unit{display:flex;flex-direction:column;align-items:center;gap:3px}
  .cd-num{font-size:28px;font-weight:700;color:var(--blue);background:#f0f4ff;border:1px solid #ccd9ff;border-radius:5px;padding:6px 10px;min-width:50px;text-align:center;font-family:var(--mono)}
  .cd-u{font-size:10px;color:#aaa;text-transform:uppercase;font-family:var(--mono)}
  .cd-sep{font-size:22px;font-weight:700;color:#bbb;margin-bottom:14px}
  /* Trending */
  .trend-wrap{position:relative;display:flex;align-items:center;gap:8px}
  .trend-arr{background:#fff;border:1px solid var(--border);color:#333;width:30px;height:30px;border-radius:4px;cursor:pointer;font-size:14px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:inherit}
  .trend-arr:hover{border-color:var(--blue);color:var(--blue)}
  .trend-arr:disabled{opacity:.3;cursor:default}
  .trend-outer{overflow:hidden;flex:1;padding:4px 0 6px}
  .trend-track{display:flex;gap:12px;transition:transform .3s}
  .trend-card{min-width:200px;max-width:200px;background:#fff;border:1px solid var(--border);border-radius:8px;padding:14px;cursor:pointer;flex-shrink:0}
  .trend-card:hover{border-color:var(--blue)}
  .trend-card.hot{border-left:3px solid #fd7e14}
  .trend-rank{font-size:11px;color:var(--blue);font-weight:700;margin-bottom:5px;font-family:var(--mono)}
  .trend-card.hot .trend-rank{color:#fd7e14}
  .trend-emoji{font-size:24px;margin-bottom:6px}
  .trend-title{font-size:13px;font-weight:700;margin-bottom:4px;line-height:1.3}
  .trend-club{font-size:11px;color:var(--sub)}
  .trend-regs{font-size:11px;color:var(--blue);margin-top:5px;font-weight:700;font-family:var(--mono)}
  /* Quick actions */
  .qa-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px}
  .qa-btn{background:#fff;border:1px solid var(--border);border-radius:7px;padding:12px 14px;text-align:left;cursor:pointer;font-size:13px;font-weight:700;color:#333;font-family:inherit;display:flex;flex-direction:column;gap:4px}
  .qa-btn:hover{border-color:var(--blue);background:#f8f9ff}
  .qa-icon{font-size:20px}
  .qa-lbl{font-size:11px;color:var(--sub2)}
  /* Calendar */
  .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);border:1px solid var(--border);border-radius:8px;overflow:hidden;background:#fff}
  .cal-head{padding:10px 6px;text-align:center;font-size:11px;font-weight:700;color:var(--sub2);background:#f8f9fa;border-bottom:1px solid var(--border);font-family:var(--mono)}
  .cal-cell{min-height:70px;padding:6px;border-right:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0;position:relative;cursor:pointer;background:#fff;transition:background .1s}
  .cal-cell:hover{background:#f8f9ff}
  .cal-cell.today .cal-day{background:var(--blue);color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center}
  .cal-cell.other-month .cal-day{color:#ccc}
  .cal-cell.has-event{background:#f0f4ff}
  .cal-day{font-size:13px;font-weight:600;color:#333;line-height:1;margin-bottom:4px}
  .cal-dot{font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:var(--blue);color:#fff;border-radius:2px;padding:1px 4px;margin-bottom:2px}
  .cal-dot.cultural{background:#e65100}
  .cal-dot.sports{background:#2e7d32}
  .cal-dot.workshop{background:#f9a825}
  /* Stats row */
  .stats-row{display:flex;background:#fff;border-top:1px solid var(--border);border-bottom:1px solid var(--border);flex-wrap:wrap}
  .stat-i{flex:1;padding:24px 20px;text-align:center;border-right:1px solid var(--border)}
  .stat-i:last-child{border-right:none}
  .stat-n{font-size:28px;font-weight:700;color:var(--blue)}
  .stat-l{font-size:12px;color:var(--sub);margin-top:4px;text-transform:uppercase}
  /* Admin */
  .akpi{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin-bottom:24px}
  .akc{background:#fff;border:1px solid var(--border);border-radius:8px;padding:18px 20px}
  .akc-l{font-size:11px;color:var(--sub);font-family:var(--mono);margin-bottom:6px}
  .akc-v{font-size:28px;font-weight:700}
  .admin-tabs{display:flex;gap:5px;margin-bottom:18px;flex-wrap:wrap}
  .admin-tab{padding:7px 14px;border-radius:4px;border:1px solid #ccc;background:transparent;color:#888;cursor:pointer;font-size:12px;font-weight:700;text-transform:uppercase;font-family:inherit}
  .admin-tab:hover{border-color:var(--blue);color:var(--blue)}
  .admin-tab.on{background:#dce8ff;border-color:var(--blue);color:var(--blue)}
  table{width:100%;border-collapse:collapse}
  thead th{padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:var(--sub2);text-transform:uppercase;border-bottom:2px solid var(--border);background:#f8f9fa;font-family:var(--mono)}
  tbody td{padding:12px;font-size:13px;border-bottom:1px solid #f5f5f5}
  tbody tr:hover{background:#fafbff}
  .tact{padding:4px 10px;border-radius:3px;border:none;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--mono);margin-right:4px}
  .te{background:#dce8ff;color:var(--blue)}
  .tdl{background:#fff0f0;color:#c0392b}
  .tap{background:#d4edda;color:#2e7d32}
  .trj{background:#f8d7da;color:#c0392b}
  /* Club page */
  .club-stabs{display:flex;gap:5px;margin-bottom:16px;flex-wrap:wrap}
  .club-stab{padding:7px 14px;border-radius:4px;border:1px solid #ccc;background:transparent;color:#888;cursor:pointer;font-size:12px;font-weight:700;text-transform:uppercase;font-family:inherit}
  .club-stab:hover{border-color:var(--blue);color:var(--blue)}
  .club-stab.on{background:#dce8ff;border-color:var(--blue);color:var(--blue)}
  /* Portfolio */
  .portfolio-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin-bottom:26px}
  .pstat{background:#fff;border:1px solid var(--border);border-radius:8px;padding:18px 20px;text-align:center}
  .pstat-n{font-size:26px;font-weight:700;color:var(--blue)}
  .pstat-l{font-size:11px;color:var(--sub);margin-top:4px;text-transform:uppercase}
  .score-crit{background:#fff;border:1px solid var(--border);border-radius:7px;padding:14px}
  .sc-pts{font-size:20px;font-weight:700;color:var(--blue);font-family:var(--mono)}
  .sc-label{font-size:13px;font-weight:700;margin-top:4px}
  .sc-desc{font-size:11px;color:var(--sub2);margin-top:3px}
  /* QR modal */
  .qr-modal{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:1002;padding:20px}
  .qr-box{background:#0d0d0d;color:#39ff14;border-radius:12px;padding:28px;max-width:340px;width:100%;text-align:center;font-family:var(--mono)}
  .qr-ev{font-size:14px;font-weight:700;color:#fff;margin-bottom:12px}
  .qr-status{padding:5px 12px;border-radius:4px;font-size:12px;font-weight:700;display:inline-block;margin-bottom:14px;font-family:var(--mono)}
  .qr-status.pending{background:rgba(245,196,0,.15);color:#f5c400;border:1px solid #f5c400}
  .qr-status.checked{background:rgba(57,255,20,.15);color:#39ff14;border:1px solid #39ff14}
  /* Feedback */
  .star{font-size:20px;cursor:pointer;opacity:.3;transition:opacity .1s}
  .star.on{opacity:1}
  /* Saved */
  .upi{background:#fff;border:1px solid var(--border);border-radius:8px;padding:14px 16px;display:flex;align-items:center;gap:12px;margin-bottom:10px}
  /* Leaderboard */
  .lb-modal{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:1003;padding:20px}
  .lb-box{background:#fff;border-radius:10px;padding:28px;max-width:400px;width:100%;max-height:80vh;overflow-y:auto}
  .perf-row{display:flex;align-items:center;gap:12px;padding:10px 14px;background:#fff;border:1px solid var(--border);border-radius:7px;margin-bottom:8px}
  .perf-av{width:30px;height:30px;border-radius:50%;background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}
  .perf-name{flex:1;font-weight:700;font-size:13px}
  .perf-pts{font-size:13px;color:var(--blue);font-weight:700;font-family:var(--mono)}
  /* Add event form */
  .addform{background:#fff;border:1px solid var(--border);border-radius:8px;padding:24px;margin-bottom:20px}
  .fgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .fg{display:flex;flex-direction:column;gap:5px}
  .fg label{font-size:11px;font-weight:700;color:#555;text-transform:uppercase;font-family:var(--mono)}
  .fg input,.fg select,.fg textarea{padding:9px 11px;border:1px solid var(--border);border-radius:4px;font-size:13px;font-family:inherit}
  .fg input:focus,.fg select:focus,.fg textarea:focus{border-color:var(--blue)}
  .fg.full{grid-column:1/-1}
  .fg textarea{min-height:60px;resize:vertical}
  /* Announcement */
  .ann-card{background:#fff;border:1px solid var(--border);border-radius:7px;padding:14px 16px;margin-bottom:10px}
  .ann-type{font-size:10px;font-weight:700;text-transform:uppercase;font-family:var(--mono);margin-bottom:5px;color:var(--blue)}
  .ann-title{font-size:14px;font-weight:700;margin-bottom:4px}
  .ann-body{font-size:13px;color:var(--sub2);line-height:1.5}
  .ann-time{font-size:11px;color:var(--sub);margin-top:6px;font-family:var(--mono)}
  /* Proposal */
  .prop-card{background:#fff;border:1px solid var(--border);border-radius:8px;padding:18px;margin-bottom:12px}
  .prop-status-p{background:#fff3cd;color:#856404;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700;font-family:var(--mono)}
  .prop-status-a{background:#d4edda;color:#2e7d32;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700;font-family:var(--mono)}
  .prop-status-r{background:#f8d7da;color:#c0392b;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700;font-family:var(--mono)}
  .prop-status-rev{background:#dce8ff;color:var(--blue);padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700;font-family:var(--mono)}
  /* Member badge */
  .member-av{width:36px;height:36px;border-radius:50%;background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0}
  /* Alert banner */
  .alert-banner{background:#fff9c4;border:1px solid #ffd77a;border-radius:7px;padding:10px 14px;margin-bottom:10px;display:flex;align-items:center;gap:10px;font-size:13px}
  /* Responsive */
  @media(max-width:600px){
    .fgrid{grid-template-columns:1fr}
    .fg.full{grid-column:1}
    .dmeta-grid{grid-template-columns:1fr}
    .qa-grid{grid-template-columns:1fr 1fr}
    .ev-grid{grid-template-columns:1fr}
    .greet-name{font-size:20px}
    .alogo{font-size:13px}
  }
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function catTag(cat) {
    const cls = { technical: "tag-t", cultural: "tag-c", sports: "tag-s", workshop: "tag-w" };
    return <span className={cls[cat] || "tag-t"}>{cat?.toUpperCase()}</span>;
}
function fmt(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function odColor(u) {
    if (u >= 35) return "linear-gradient(90deg,#ff3d5a,#ff7b25)";
    if (u >= 25) return "linear-gradient(90deg,#f5c400,#ff7b25)";
    return "linear-gradient(90deg,#39ff14,#5eff3a)";
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg, icon, visible }) {
    return (
        <div className={`toast${visible ? " on" : ""}`}>
            <span>{icon}</span><span>{msg}</span>
        </div>
    );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function Landing({ onLogin, onSignup }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <nav style={{ background: "#1a3c8e", padding: "14px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: "#fff", fontSize: 18 }}>⚡CampusEvents</div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-out-white" onClick={() => onLogin("student")}>LOG IN</button>
                    <button className="btn-sol" onClick={onSignup}>SIGN UP</button>
                </div>
            </nav>
            <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center", background: "#1a3c8e", color: "#fff" }}>
                <div style={{ fontSize: 13, color: "#aac4ff", marginBottom: 20, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'JetBrains Mono',monospace" }}>VIT CHENNAI OFFICIAL EVENT PLATFORM</div>
                <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 20, textTransform: "uppercase" }}>CAMPUS<br /><span style={{ color: "#ffc107" }}>EVENTS</span></h1>
                <p style={{ fontSize: 16, color: "#ccc", maxWidth: 500, marginBottom: 30, lineHeight: 1.7 }}>
                    Discover, register, and track all campus events at VIT Chennai. One platform for students, clubs & administration.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
                    <button className="btn-sol" style={{ padding: "12px 30px", fontSize: 15 }} onClick={() => onLogin("student")}>GET STARTED →</button>
                    <button className="btn-out-white" style={{ padding: "12px 30px", fontSize: 15 }} onClick={() => onLogin("admin")}>ADMIN / CLUB</button>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                    {["OD_TRACKER", "EVENT_CALENDAR", "SMART_FILTERS", "CLUB_SEARCH", "LIVE_REGISTRATIONS", "VENUE_MAPS", "ADMIN_PANEL"].map(f => (
                        <div key={f} style={{ padding: "6px 14px", border: "1px solid rgba(255,255,255,.3)", borderRadius: 20, fontSize: 12, color: "#ccc", fontFamily: "'JetBrains Mono',monospace" }}>{f}</div>
                    ))}
                </div>
            </main>
            <div className="stats-row">
                {[["20+", "Events This Semester"], ["4", "Active Clubs"], ["500+", "Registrations"], ["40hrs", "Max OD Available"]].map(([n, l]) => (
                    <div className="stat-i" key={l}><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
                ))}
            </div>
        </div>
    );
}

// ─── LOGIN MODAL ──────────────────────────────────────────────────────────────
function LoginModal({ onClose, onLogin }) {
    const [tab, setTab] = useState("student");
    const [u, setU] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState("");
    const hints = { student: "DEMO → any username / pass123", club: "DEMO → ieee / club123  |  gdsc / club123", admin: "DEMO → admin / admin123" };
    function doLogin() {
        setErr("");
        onLogin(tab, u.trim(), p.trim(), (e) => setErr(e));
    }
    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-box">
                <button className="modal-close" onClick={onClose}>✕</button>
                <h2 style={{ color: "#1a3c8e", fontSize: 22, marginBottom: 4 }}>Welcome Back</h2>
                <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>Sign in to your CampusEvents account</p>
                <div className="mtabs">
                    {["student", "club", "admin"].map(t => (
                        <button key={t} className={`mtab${tab === t ? " on" : ""}`} onClick={() => { setTab(t); setErr(""); }}>{t === "club" ? "🏛 CLUB" : t.toUpperCase()}</button>
                    ))}
                </div>
                {err && <div className="err-box">{err}</div>}
                <div className="hint-box">// {hints[tab]}</div>
                <div className="iw"><label>Username / Club ID</label><input value={u} onChange={e => setU(e.target.value)} onKeyDown={e => e.key === "Enter" && doLogin()} placeholder="21CSE001 or ieee or admin" /></div>
                <div className="iw"><label>Password</label><input type="password" value={p} onChange={e => setP(e.target.value)} onKeyDown={e => e.key === "Enter" && doLogin()} placeholder="Enter password" /></div>
                <button className="btn-sol" style={{ width: "100%", padding: 12 }} onClick={doLogin}>LOG IN →</button>
            </div>
        </div>
    );
}

// ─── SIGNUP MODAL ─────────────────────────────────────────────────────────────
function SignupModal({ onClose, onSignup }) {
    const [tab, setTab] = useState("student");
    const [form, setForm] = useState({ name: "", regno: "", dept: "", email: "", phone: "", clubname: "", clubcat: "", advisor: "", clubemail: "", pass: "", pass2: "" });
    const [err, setErr] = useState("");
    const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
    function doSignup() {
        setErr("");
        if (form.pass.length < 6) { setErr("Password must be at least 6 characters."); return; }
        if (form.pass !== form.pass2) { setErr("Passwords do not match."); return; }
        if (tab === "student") {
            if (!form.name || !form.regno || !form.dept) { setErr("Please fill all required fields."); return; }
        } else {
            if (!form.clubname || !form.clubcat) { setErr("Club name and category are required."); return; }
        }
        onSignup(tab, form);
    }
    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-box" style={{ maxWidth: 460 }}>
                <button className="modal-close" onClick={onClose}>✕</button>
                <h2 style={{ color: "#1a3c8e", fontSize: 22, marginBottom: 4 }}>Create Account</h2>
                <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>Join VIT Chennai's event platform</p>
                <div className="mtabs">
                    <button className={`mtab${tab === "student" ? " on" : ""}`} onClick={() => setTab("student")}>STUDENT</button>
                    <button className={`mtab${tab === "club" ? " on" : ""}`} onClick={() => setTab("club")}>🏛 CLUB</button>
                </div>
                {err && <div className="err-box">{err}</div>}
                {tab === "student" ? (
                    <>
                        <div className="iw"><label>Full Name</label><input value={form.name} onChange={e => upd("name", e.target.value)} placeholder="Arun Kumar" /></div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <div className="iw"><label>Registration No.</label><input value={form.regno} onChange={e => upd("regno", e.target.value)} placeholder="21CSE001" /></div>
                            <div className="iw"><label>Department</label>
                                <select value={form.dept} onChange={e => upd("dept", e.target.value)}>
                                    <option value="">Select Dept</option>
                                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="iw"><label>Email</label><input type="email" value={form.email} onChange={e => upd("email", e.target.value)} placeholder="21CSE001@vit.ac.in" /></div>
                        <div className="iw"><label>Phone</label><input value={form.phone} onChange={e => upd("phone", e.target.value)} placeholder="9876543210" /></div>
                    </>
                ) : (
                    <>
                        <div className="iw"><label>Club Name</label><input value={form.clubname} onChange={e => upd("clubname", e.target.value)} placeholder="Robotics Club" /></div>
                        <div className="iw"><label>Club Category</label>
                            <select value={form.clubcat} onChange={e => upd("clubcat", e.target.value)}>
                                <option value="">Select Category</option>
                                <option value="technical">Technical</option>
                                <option value="cultural">Cultural</option>
                                <option value="sports">Sports</option>
                                <option value="workshop">Workshop</option>
                            </select>
                        </div>
                        <div className="iw"><label>Faculty Advisor</label><input value={form.advisor} onChange={e => upd("advisor", e.target.value)} placeholder="Dr. Ramesh Kumar" /></div>
                        <div className="iw"><label>Contact Email</label><input type="email" value={form.clubemail} onChange={e => upd("clubemail", e.target.value)} placeholder="robotics@vit.ac.in" /></div>
                    </>
                )}
                <div className="iw"><label>Password</label><input type="password" value={form.pass} onChange={e => upd("pass", e.target.value)} placeholder="Min. 6 characters" /></div>
                <div className="iw"><label>Confirm Password</label><input type="password" value={form.pass2} onChange={e => upd("pass2", e.target.value)} placeholder="Repeat password" /></div>
                <button className="btn-sol" style={{ width: "100%", padding: 12, marginTop: 4 }} onClick={doSignup}>CREATE ACCOUNT →</button>
            </div>
        </div>
    );
}

// ─── EVENT DETAIL MODAL ───────────────────────────────────────────────────────
function DetailModal({ event, onClose, user, regs, saved, onRegister, onTeamReg, onSave, onQR, onFeedback, onCalendar }) {
    if (!event) return null;
    const isReg = regs.some(r => r.eid === event.id && r.sid === user?.id);
    const isSaved = saved.has(event.id);
    const bgColor = CGRAD[event.cat] || "#1a3c8e";
    const isPast = new Date(event.date) < new Date();
    const reg = regs.find(r => r.eid === event.id && r.sid === user?.id);
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,.25)" }}>
                <div className="dhero" style={{ background: bgColor }}>
                    <button style={{ position: "absolute", top: 12, right: 14, background: "rgba(255,255,255,.2)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: 4, cursor: "pointer", fontSize: 16 }} onClick={onClose}>✕</button>
                    <div className="dhero-emoji">{event.emoji}</div>
                    <div className="dhero-info">
                        <div className="dhero-title">{event.title}</div>
                        <div className="dhero-club">{event.club}</div>
                    </div>
                </div>
                <div className="dbody">
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                        {catTag(event.cat)}
                        {event.od === "yes" && <span style={{ background: "#d4edda", color: "#2e7d32", padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>OD ELIGIBLE</span>}
                        {event.ref === "yes" && <span style={{ background: "#fdebd0", color: "#e65100", padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>REFRESHMENTS</span>}
                    </div>
                    <div className="dmeta-grid">
                        <div className="dmeta-item"><div className="dmeta-label">📅 Date</div><div className="dmeta-val">{fmt(event.date)}</div></div>
                        <div className="dmeta-item"><div className="dmeta-label">🕐 Time</div><div className="dmeta-val">{event.time}</div></div>
                        <div className="dmeta-item"><div className="dmeta-label">🏛 Venue</div><div className="dmeta-val">{event.venue}</div></div>
                        <div className="dmeta-item"><div className="dmeta-label">💰 Fee</div><div className="dmeta-val">{event.fee}</div></div>
                        <div className="dmeta-item"><div className="dmeta-label">🎟 Seats</div><div className="dmeta-val">{event.seats}</div></div>
                        <div className="dmeta-item"><div className="dmeta-label">⏰ Deadline</div><div className="dmeta-val">{fmt(event.dl)}</div></div>
                    </div>
                    <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, marginBottom: 16 }}>{event.desc}</p>
                    {event.loc && <div style={{ fontSize: 12, color: "#888", marginBottom: 16, padding: "8px 12px", background: "#f8f9fa", borderRadius: 5, borderLeft: "3px solid #ddd" }}>📍 {event.loc}</div>}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {!isPast && user?.role === "student" && (
                            isReg ? (
                                <button className="ev-reg-btn registered" disabled>✅ REGISTERED</button>
                            ) : (
                                <>
                                    <button className="ev-reg-btn" onClick={() => onRegister(event.id)}>REGISTER NOW</button>
                                    <button className="btn-out" style={{ padding: "7px 12px", fontSize: 12 }} onClick={() => onTeamReg(event.id)}>👥 TEAM REG</button>
                                </>
                            )
                        )}
                        {user?.role === "student" && (
                            <button className="ev-save-btn" onClick={() => onSave(event.id)}>
                                {isSaved ? "🔖 SAVED" : "🔖 SAVE"}
                            </button>
                        )}
                        <button className="btn-out" style={{ padding: "7px 12px", fontSize: 12 }} onClick={() => onCalendar(event.id)}>📅 CALENDAR</button>
                        {isReg && (
                            <>
                                <button className="btn-out" style={{ padding: "7px 12px", fontSize: 12 }} onClick={() => onQR(event.id)}>📱 QR CHECK-IN</button>
                                {isPast && reg?.status === "Approved" && (
                                    <button className="btn-out" style={{ padding: "7px 12px", fontSize: 12 }} onClick={() => downloadCert(event.title, event.date, event.venue, user)}>⬇ CERTIFICATE</button>
                                )}
                                {isPast && <button className="btn-out" style={{ padding: "7px 12px", fontSize: 12 }} onClick={() => onFeedback(event.id)}>⭐ FEEDBACK</button>}
                            </>
                        )}
                        {MAPS[event.venue] && <a href={MAPS[event.venue]} target="_blank" rel="noreferrer"><button className="btn-out" style={{ padding: "7px 12px", fontSize: 12 }}>🗺 MAP</button></a>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function downloadCert(title, date, venue, user) {
    const d = new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const html = `<!DOCTYPE html><html><head><title>Certificate</title><style>body{font-family:Georgia,serif;background:#f9f9f9;margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;}.cert{background:#fff;border:6px double #1a7a2e;padding:60px 70px;max-width:700px;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.12);}h1{font-size:2.2rem;color:#1a7a2e;margin:0 0 8px;}.sub{font-size:.9rem;color:#666;margin-bottom:30px;text-transform:uppercase;letter-spacing:.1em;}.stu{font-size:2rem;font-weight:700;color:#222;border-bottom:2px solid #1a7a2e;padding-bottom:8px;margin:20px 0;}.evname{font-size:1.4rem;color:#1a7a2e;font-weight:700;margin:16px 0 6px;}.seal{font-size:3rem;margin-top:20px;}</style></head><body><div class="cert"><h1>Vellore Institute of Technology, Chennai</h1><div class="sub">Certificate of Participation</div><p>This certifies that</p><div class="stu">${user.name}</div><p>successfully participated in</p><div class="evname">${title}</div><p style="font-size:.85rem;color:#555">Held on ${d} at ${venue}</p><div class="seal">🏆</div><p style="font-size:.75rem;color:#aaa;margin-top:24px;">CampusEvents · VIT · Auto-generated</p></div><scr` + `ipt>window.print();</scr` + `ipt></body></html>`;
    const w = window.open("", "_blank"); if (w) { w.document.write(html); w.document.close(); }
}

// ─── QR MODAL ─────────────────────────────────────────────────────────────────
function QRModal({ event, onClose, onCheckin }) {
    const [status, setStatus] = useState("pending");
    const canvasRef = useRef();
    useEffect(() => {
        if (!canvasRef.current || !event) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const size = 200;
        ctx.fillStyle = "#0d0d0d"; ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "#39ff14";
        const data = (event.id + event.title).split("").map(c => c.charCodeAt(0));
        const cell = 8, modules = 25;
        [[0, 0], [0, 18], [18, 0]].forEach(([ox, oy]) => {
            ctx.fillRect(ox * cell, oy * cell, 7 * cell, 7 * cell);
            ctx.fillStyle = "#0d0d0d"; ctx.fillRect((ox + 1) * cell, (oy + 1) * cell, 5 * cell, 5 * cell);
            ctx.fillStyle = "#39ff14"; ctx.fillRect((ox + 2) * cell, (oy + 2) * cell, 3 * cell, 3 * cell);
            ctx.fillStyle = "#39ff14";
        });
        for (let r = 0; r < modules; r++) for (let c = 0; c < modules; c++) {
            if ((r < 9 && c < 9) || (r < 9 && c > 15) || (r > 15 && c < 9)) continue;
            if (data[(r * modules + c) % data.length] % 2 === 0 && (r + c) % 3 !== 0) ctx.fillRect(c * cell + 4, r * cell + 4, cell - 1, cell - 1);
        }
        ctx.strokeStyle = "#39ff14"; ctx.lineWidth = 2; ctx.strokeRect(1, 1, size - 2, size - 2);
    }, [event]);
    function simulate() {
        setStatus("scanning");
        setTimeout(() => { setStatus("checked"); onCheckin(event.id); }, 1400);
    }
    if (!event) return null;
    return (
        <div className="qr-modal" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="qr-box">
                <div className="qr-ev">{event.emoji} {event.title}</div>
                <div className={`qr-status ${status === "checked" ? "checked" : "pending"}`}>
                    {status === "pending" && "⏳ PENDING"}{status === "scanning" && "⌛ SCANNING..."}{status === "checked" && "✅ CHECKED IN"}
                </div>
                <canvas ref={canvasRef} width={200} height={200} style={{ borderRadius: 4, display: "block", margin: "0 auto 16px" }} />
                <button className="btn-primary" style={{ width: "100%", padding: 10, marginBottom: 8, fontFamily: "'JetBrains Mono',monospace" }} onClick={simulate} disabled={status !== "pending"}>
                    {status === "pending" ? "📱 SIMULATE CHECK-IN" : status === "scanning" ? "Scanning..." : "Done!"}
                </button>
                <button className="btn-out" style={{ width: "100%", padding: 9, fontSize: 12, color: "#888", borderColor: "#555" }} onClick={onClose}>CLOSE</button>
            </div>
        </div>
    );
}

// ─── FEEDBACK MODAL ───────────────────────────────────────────────────────────
function FeedbackModal({ event, onClose, onSubmit }) {
    const [eRating, setERating] = useState(0);
    const [sRating, setSRating] = useState(0);
    const [overall, setOverall] = useState("");
    const [comments, setComments] = useState("");
    const [suggest, setSuggest] = useState("");
    function submit() {
        if (!eRating) { alert("Rate the event!"); return; }
        onSubmit(event.id, { eRating, sRating, overall, comments, suggest });
        onClose();
    }
    if (!event) return null;
    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-box" style={{ maxWidth: 440 }}>
                <button className="modal-close" onClick={onClose}>✕</button>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>⭐ Event Feedback</h3>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 16, fontFamily: "'JetBrains Mono',monospace" }}>{event.emoji} {event.title}</div>
                <div className="iw"><label>Event Rating</label>
                    <div style={{ display: "flex", gap: 4 }}>{[1, 2, 3, 4, 5].map(i => <span key={i} className={`star${i <= eRating ? " on" : ""}`} onClick={() => setERating(i)}>⭐</span>)}</div>
                </div>
                <div className="iw"><label>Speaker Rating</label>
                    <div style={{ display: "flex", gap: 4 }}>{[1, 2, 3, 4, 5].map(i => <span key={i} className={`star${i <= sRating ? " on" : ""}`} onClick={() => setSRating(i)}>⭐</span>)}</div>
                </div>
                <div className="iw"><label>Overall Experience</label>
                    <select value={overall} onChange={e => setOverall(e.target.value)}>
                        <option value="">Select...</option>
                        <option>Excellent</option><option>Good</option><option>Average</option><option>Needs Improvement</option>
                    </select>
                </div>
                <div className="iw"><label>Comments</label><textarea value={comments} onChange={e => setComments(e.target.value)} placeholder="Share your experience..." style={{ minHeight: 60 }} /></div>
                <div className="iw"><label>Suggestions</label><textarea value={suggest} onChange={e => setSuggest(e.target.value)} placeholder="How can we improve?" style={{ minHeight: 60 }} /></div>
                <button className="btn-sol" style={{ width: "100%", padding: 11, marginTop: 4 }} onClick={submit}>SUBMIT FEEDBACK →</button>
            </div>
        </div>
    );
}

// ─── TEAM REG MODAL ───────────────────────────────────────────────────────────
function TeamRegModal({ event, user, onClose, onSubmit }) {
    const [members, setMembers] = useState([""]);
    function submit() {
        const valid = members.filter(Boolean);
        if (!valid.length) { alert("Add at least one teammate!"); return; }
        onSubmit(event.id, valid);
        onClose();
    }
    if (!event) return null;
    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-box">
                <button className="modal-close" onClick={onClose}>✕</button>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>👥 Team Registration</h3>
                <div style={{ fontSize: 12, color: "#888", fontFamily: "'JetBrains Mono',monospace", marginBottom: 16 }}>{event.emoji} {event.title}</div>
                <div style={{ marginBottom: 8 }}>
                    <input value={user.regNo + " (You)"} disabled style={{ width: "100%", padding: "9px 11px", background: "#f8f9fa", border: "1px solid #ddd", borderRadius: 5, opacity: .6, marginBottom: 8 }} />
                    {members.map((m, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                            <input value={m} onChange={e => { const a = [...members]; a[i] = e.target.value; setMembers(a) }} placeholder={`Member ${i + 2} Reg No`} style={{ flex: 1, padding: "9px 11px", border: "1px solid #ddd", borderRadius: 5 }} />
                            {members.length > 1 && <button onClick={() => setMembers(members.filter((_, j) => j !== i))} style={{ padding: "0 10px", background: "#fff0f0", border: "1px solid #f5a5a5", color: "#c0392b", borderRadius: 5, cursor: "pointer" }}>✕</button>}
                        </div>
                    ))}
                </div>
                {members.length < 4 && <button className="btn-out" style={{ width: "100%", padding: 9, fontSize: 12, marginBottom: 8 }} onClick={() => setMembers([...members, ""])}>+ ADD MEMBER</button>}
                <button className="btn-sol" style={{ width: "100%", padding: 11 }} onClick={submit}>REGISTER TEAM →</button>
            </div>
        </div>
    );
}

// ─── LEADERBOARD MODAL ────────────────────────────────────────────────────────
function LeaderboardModal({ clubs, onClose }) {
    const sorted = [...clubs].sort((a, b) => b.points - a.points);
    return (
        <div className="lb-modal" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="lb-box">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>🏆 // LEADERBOARD</h2>
                    <button className="modal-close" style={{ position: "static" }} onClick={onClose}>✕</button>
                </div>
                {sorted.map((c, i) => (
                    <div className="perf-row" key={c.id}>
                        <div style={{ fontSize: 14, fontWeight: 700, minWidth: 26, textAlign: "center", color: i < 3 ? ["#ffd700", "#c0c0c0", "#cd7f32"][i] : "#555" }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</div>
                        <div className="perf-av">{c.emoji}</div>
                        <div className="perf-name">{c.name}</div>
                        <div className="perf-pts">{c.points} pts</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── EVENT CARD ───────────────────────────────────────────────────────────────
function EventCard({ event, user, regs, saved, onDetail, onRegister, onSave }) {
    const isReg = regs.some(r => r.eid === event.id && r.sid === user?.id);
    const isSaved = saved.has(event.id);
    const isPast = new Date(event.date) < new Date();
    const regCount = regs.filter(r => r.eid === event.id).length;
    return (
        <div className="ev-card" onClick={() => onDetail(event)}>
            <div className="ev-emoji">{event.emoji}</div>
            <div className="ev-title">{event.title}</div>
            <div className="ev-club">{event.club}</div>
            <div className="ev-meta">
                <div className="ev-meta-row">📅 {fmt(event.date)} · {event.time}</div>
                <div className="ev-meta-row">🏛 {event.venue}</div>
                <div className="ev-meta-row">💰 {event.fee} · 🎟 {event.seats} seats</div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {catTag(event.cat)}
                {event.od === "yes" && <span style={{ background: "#d4edda", color: "#2e7d32", padding: "2px 7px", borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>OD</span>}
                {isPast && <span style={{ background: "#f0f0f0", color: "#999", padding: "2px 7px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>PAST</span>}
            </div>
            <div className="ev-actions" onClick={e => e.stopPropagation()}>
                {user?.role === "student" && !isPast && (
                    isReg
                        ? <button className="ev-reg-btn registered" disabled>✅ REGISTERED</button>
                        : <button className="ev-reg-btn" onClick={() => onRegister(event.id)}>REGISTER</button>
                )}
                {user?.role === "student" && <button className="ev-save-btn" onClick={() => onSave(event.id)}>{isSaved ? "🔖" : "🔖"} {isSaved ? "SAVED" : "SAVE"}</button>}
                <span style={{ fontSize: 11, color: "#999", alignSelf: "center", marginLeft: "auto", fontFamily: "'JetBrains Mono',monospace" }}>{regCount} regs</span>
            </div>
        </div>
    );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ user, events, regs, clubs, saved, onDetail, onRegister, onSave, onLB, onPage, toast }) {
    const [clock, setClock] = useState(new Date());
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0, event: null });
    const [trendOffset, setTrendOffset] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setClock(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    useEffect(() => {
        const update = () => {
            const upcoming = events.filter(e => new Date(e.date) > new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
            if (!upcoming.length) return;
            const next = upcoming[0];
            const diff = new Date(next.date) - new Date();
            const days = Math.floor(diff / 86400000);
            const hours = Math.floor((diff % 86400000) / 3600000);
            const mins = Math.floor((diff % 3600000) / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            setCountdown({ days, hours, mins, secs, event: next });
        };
        update();
        const t = setInterval(update, 1000);
        return () => clearInterval(t);
    }, [events]);
    const h = clock.getHours();
    const greetWord = h < 12 ? "GOOD MORNING" : h < 17 ? "GOOD AFTERNOON" : "GOOD EVENING";
    const greetLine = ["Ready for your next event?", "Let's conquer campus today!", "Something exciting is on your way!", "Your next achievement awaits!"][clock.getSeconds() % 4];
    const trending = [...events].sort((a, b) => regs.filter(r => r.eid === b.id).length - regs.filter(r => r.eid === a.id).length).slice(0, 8);
    const myRegs = regs.filter(r => r.sid === user.id);
    const odUsed = user.odUsed || 0;
    const odPct = Math.min(100, (odUsed / 40) * 100);
    const upcomingMyRegs = myRegs.map(r => events.find(e => e.id === r.eid)).filter(e => e && new Date(e.date) > new Date());
    // Alerts: events in 2 days
    const alerts = events.filter(e => {
        const diff = (new Date(e.date) - new Date()) / (1000 * 3600 * 24);
        return diff > 0 && diff <= 2 && myRegs.some(r => r.eid === e.id);
    });
    const trendCardW = 212;
    const maxOffset = Math.max(0, (trending.length - 3) * trendCardW);
    return (
        <div className="page-wrap">
            {alerts.map(e => (
                <div className="alert-banner" key={e.id}>⚠️ <strong>{e.emoji} {e.title}</strong> — happening in less than 2 days! <strong>{fmt(e.date)}</strong></div>
            ))}
            <div className="greet-banner">
                <div>
                    <div className="greet-hello">{greetWord}</div>
                    <div className="greet-name">{user.name.split(" ")[0]} <span>👋</span></div>
                    <div className="greet-line">{greetLine}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div className="greet-date">{clock.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</div>
                    <div className="greet-time">{clock.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
                </div>
            </div>
            {/* Countdown */}
            <div className="slbl">⏳ Next Big Event</div>
            <div className="countdown-box">
                {countdown.event ? (
                    <>
                        <div className="cd-event-name">{countdown.event.emoji} {countdown.event.title}</div>
                        <div className="cd-label">Starts in</div>
                        <div className="cd-timer">
                            {[["Days", String(countdown.days).padStart(2, "0")], ["Hours", String(countdown.hours).padStart(2, "0")], ["Mins", String(countdown.mins).padStart(2, "0")], ["Secs", String(countdown.secs).padStart(2, "0")]].map(([u, v], i) => (
                                <React.Fragment key={u}>
                                    {i > 0 && <div className="cd-sep">:</div>}
                                    <div className="cd-unit"><div className="cd-num">{v}</div><div className="cd-u">{u.toUpperCase()}</div></div>
                                </React.Fragment>
                            ))}
                        </div>
                        <div style={{ fontSize: 12, color: "#aaa", marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <span>📅 {fmt(countdown.event.date)}</span>
                            <span>🏛 {countdown.event.venue}</span>
                            <span>👥 {countdown.event.club}</span>
                        </div>
                    </>
                ) : <div style={{ color: "#999", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>No upcoming events found.</div>}
            </div>
            {/* Trending */}
            <div className="slbl" style={{ marginTop: 22 }}>🔥 Trending Events <span className="slbl" style={{ marginLeft: "auto", fontSize: 11, cursor: "pointer", color: "#999", fontFamily: "'JetBrains Mono',monospace" }} onClick={() => onPage("events")}>VIEW ALL →</span></div>
            <div className="trend-wrap" style={{ marginBottom: 20 }}>
                <button className="trend-arr" disabled={trendOffset <= 0} onClick={() => setTrendOffset(o => Math.max(0, o - trendCardW))}>‹</button>
                <div className="trend-outer">
                    <div className="trend-track" style={{ transform: `translateX(-${trendOffset}px)` }}>
                        {trending.map((e, i) => (
                            <div key={e.id} className={`trend-card${i < 2 ? " hot" : ""}`} onClick={() => onDetail(e)}>
                                <div className="trend-rank">#{i + 1} {i < 2 ? "🔥" : ""}</div>
                                <div className="trend-emoji">{e.emoji}</div>
                                <div className="trend-title">{e.title}</div>
                                <div className="trend-club">{e.club}</div>
                                <div className="trend-regs">{regs.filter(r => r.eid === e.id).length} registered</div>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="trend-arr" disabled={trendOffset >= maxOffset} onClick={() => setTrendOffset(o => Math.min(maxOffset, o + trendCardW))}>›</button>
            </div>
            {/* Quick actions */}
            <div className="slbl">⚡ Quick Actions</div>
            <div className="qa-grid">
                {[
                    { icon: "📋", label: "Browse Events", sub: "Find events to join", p: "events" },
                    { icon: "📅", label: "Calendar", sub: "View event schedule", p: "calendar" },
                    { icon: "🎟", label: "My Registrations", sub: "Track your events", p: "myregs" },
                    { icon: "📊", label: "My Portfolio", sub: "Achievements & certs", p: "portfolio" },
                ].map(q => (
                    <button key={q.p} className="qa-btn" onClick={() => onPage(q.p)}>
                        <div className="qa-icon">{q.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{q.label}</div>
                        <div className="qa-lbl">{q.sub}</div>
                    </button>
                ))}
            </div>
            {/* OD Tracker */}
            <div className="slbl" style={{ marginTop: 8 }}>📋 OD Tracker</div>
            <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: "18px 20px", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>OD Usage</span>
                    <span style={{ fontSize: 13, fontFamily: "'JetBrains Mono',monospace", color: "#1a3c8e" }}>{odUsed}/40 hrs</span>
                </div>
                <div style={{ height: 10, background: "#f0f0f0", borderRadius: 5, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ width: `${odPct}%`, height: "100%", background: odColor(odUsed), borderRadius: 5, transition: "width .5s" }} />
                </div>
                <div style={{ fontSize: 12, color: odUsed >= 35 ? "#ff3d5a" : odUsed >= 25 ? "#f5c400" : "#2e7d32", fontFamily: "'JetBrains Mono',monospace" }}>
                    {odUsed >= 38 ? "⚠️ Critical — almost at OD limit!" : odUsed >= 30 ? "⚡ Approaching limit — use wisely." : "✓ OD hours within safe limit."} Remaining: {40 - odUsed} hrs
                </div>
            </div>
            {/* Friends activity */}
            <div className="slbl">👥 Friends Activity</div>
            <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: "14px 16px", marginBottom: 20 }}>
                {FRIENDS.map(f => (
                    <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid #f5f5f5" }}>
                        <div style={{ width: 28, height: 28, borderRadius: 4, background: "#1a3c8e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{f.init}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{f.name}</div>
                            <div style={{ fontSize: 11, color: "#999" }}>Registered for <span style={{ color: "#1a3c8e", fontWeight: 600 }}>{f.ev}</span></div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Club leaderboard */}
            <div className="slbl">🏆 Club Leaderboard <span style={{ marginLeft: "auto", fontSize: 11, cursor: "pointer", color: "#999", fontFamily: "'JetBrains Mono',monospace" }} onClick={onLB}>FULL LB →</span></div>
            <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: "14px 16px" }}>
                {[...clubs].sort((a, b) => b.points - a.points).slice(0, 3).map((c, i) => (
                    <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? "1px solid #f5f5f5" : "none" }}>
                        <div style={{ fontSize: 18, width: 26, textAlign: "center" }}>{["🥇", "🥈", "🥉"][i]}</div>
                        <div className="perf-av">{c.emoji}</div>
                        <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</div><div style={{ fontSize: 11, color: "#999" }}>{c.category}</div></div>
                        <div style={{ fontWeight: 700, color: "#1a3c8e", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{c.points} pts</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── EVENTS PAGE ──────────────────────────────────────────────────────────────
function EventsPage({ events, user, regs, saved, onDetail, onRegister, onSave }) {
    const [search, setSearch] = useState("");
    const [cat, setCat] = useState("");
    const [od, setOD] = useState("");
    const [sort, setSort] = useState("date");
    let filtered = events.filter(e => {
        if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.club.toLowerCase().includes(search.toLowerCase())) return false;
        if (cat && e.cat !== cat) return false;
        if (od === "yes" && e.od !== "yes") return false;
        if (od === "free" && e.fee !== "Free") return false;
        return true;
    });
    filtered = [...filtered].sort((a, b) => {
        if (sort === "date") return new Date(a.date) - new Date(b.date);
        if (sort === "title") return a.title.localeCompare(b.title);
        if (sort === "regs") return regs.filter(r => r.eid === b.id).length - regs.filter(r => r.eid === a.id).length;
        return 0;
    });
    return (
        <div className="page-wrap">
            <div className="ph"><h2>📋 ALL <span style={{ color: "#1a3c8e" }}>EVENTS</span></h2><p>Browse and register for upcoming campus events</p></div>
            <div className="filter-bar">
                <input placeholder="🔍 Search events..." value={search} onChange={e => setSearch(e.target.value)} style={{ minWidth: 180 }} />
                <select value={cat} onChange={e => setCat(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="technical">Technical</option>
                    <option value="cultural">Cultural</option>
                    <option value="sports">Sports</option>
                    <option value="workshop">Workshop</option>
                </select>
                <select value={od} onChange={e => setOD(e.target.value)}>
                    <option value="">All</option>
                    <option value="yes">OD Eligible</option>
                    <option value="free">Free Entry</option>
                </select>
                <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="date">Sort: Date</option>
                    <option value="title">Sort: Title</option>
                    <option value="regs">Sort: Popular</option>
                </select>
                {(search || cat || od) && <button className="btn-out" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => { setSearch(""); setCat(""); setOD(""); }}>RESET</button>}
            </div>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 12, fontFamily: "'JetBrains Mono',monospace" }}>{filtered.length} event(s) found</div>
            {filtered.length ? (
                <div className="ev-grid">
                    {filtered.map(e => <EventCard key={e.id} event={e} user={user} regs={regs} saved={saved} onDetail={onDetail} onRegister={onRegister} onSave={onSave} />)}
                </div>
            ) : <div style={{ textAlign: "center", padding: 60, color: "#999", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>no_events_found()</div>}
        </div>
    );
}

// ─── CALENDAR PAGE ────────────────────────────────────────────────────────────
function CalendarPage({ events, regs, user, onDetail }) {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const cells = [];
    for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, other: true });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, other: false });
    while (cells.length % 7 !== 0) cells.push({ day: cells.length - firstDay - daysInMonth + 1, other: true });
    function eventsOnDay(d) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        return events.filter(e => e.date === dateStr);
    }
    return (
        <div className="page-wrap">
            <div className="ph"><h2>📅 EVENT <span style={{ color: "#1a3c8e" }}>CALENDAR</span></h2><p>Monthly overview of all campus events</p></div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <button className="btn-out" style={{ padding: "6px 14px", fontSize: 13 }} onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }}>‹ Prev</button>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{MONTHS[month]} {year}</div>
                <button className="btn-out" style={{ padding: "6px 14px", fontSize: 13 }} onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }}>Next ›</button>
            </div>
            <div className="cal-grid">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(d => <div key={d} className="cal-head">{d}</div>)}
                {cells.map((c, i) => {
                    const evs = c.other ? [] : eventsOnDay(c.day);
                    const isToday = !c.other && c.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                    return (
                        <div key={i} className={`cal-cell${isToday ? " today" : ""}${c.other ? " other-month" : ""}${evs.length ? " has-event" : ""}`}>
                            <div className="cal-day">{c.day}</div>
                            {evs.slice(0, 2).map(e => (
                                <div key={e.id} className={`cal-dot ${e.cat}`} title={e.title} onClick={() => onDetail(e)}>{e.emoji} {e.title}</div>
                            ))}
                            {evs.length > 2 && <div style={{ fontSize: 10, color: "#999", fontFamily: "'JetBrains Mono',monospace" }}>+{evs.length - 2} more</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── MY REGS PAGE ─────────────────────────────────────────────────────────────
function MyRegsPage({ user, regs, events, onDetail, onQR, onFeedback }) {
    const [search, setSearch] = useState("");
    const [cat, setCat] = useState("");
    const [od, setOD] = useState("");
    const myRegs = regs.filter(r => r.sid === user.id);
    const SC = { Registered: "rs-r", Approved: "rs-a", Rejected: "rs-j" };
    let filtered = myRegs.filter(r => {
        const e = events.find(x => x.id === r.eid);
        if (!e) return false;
        if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (cat && e.cat !== cat) return false;
        if (od === "od" && e.od !== "yes") return false;
        return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
    return (
        <div className="page-wrap">
            <div className="ph"><h2>🎟 MY <span style={{ color: "#1a3c8e" }}>REGISTRATIONS</span></h2><p>All your event registrations</p></div>
            <div className="filter-bar">
                <input placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} />
                <select value={cat} onChange={e => setCat(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="technical">Technical</option><option value="cultural">Cultural</option><option value="sports">Sports</option><option value="workshop">Workshop</option>
                </select>
                <select value={od} onChange={e => setOD(e.target.value)}>
                    <option value="">All</option><option value="od">OD Only</option>
                </select>
            </div>
            {filtered.length ? filtered.map(r => {
                const e = events.find(x => x.id === r.eid);
                const past = e && new Date(e.date) < new Date();
                return (
                    <div key={r.eid} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ background: "#f8f9fa", border: "1px solid #eee", width: 46, height: 46, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{e?.emoji || "📋"}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{e?.title || "Unknown"}</div>
                            <div style={{ fontSize: 12, color: "#888", display: "flex", gap: 12, flexWrap: "wrap" }}>
                                <span>📅 {e ? fmt(e.date) : r.date}</span>
                                <span>🏛 {e?.venue}</span>
                                {e?.od === "yes" && <span style={{ color: "#2e7d32", fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>OD</span>}
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                            {past && r.status === "Approved" && e && <button className="tact te" onClick={() => downloadCert(e.title, e.date, e.venue, user)}>⬇ CERT</button>}
                            <span className={SC[r.status] || "rs-r"}>{r.status.toUpperCase()}</span>
                            {!past && <button style={{ padding: "4px 10px", background: "#f0f4ff", border: "1px solid #ccd9ff", borderRadius: 4, fontSize: 11, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }} onClick={() => e && onQR(e.id)}>📱 QR</button>}
                            {past && <button className="tact" style={{ background: "#fff9c4", color: "#856404" }} onClick={() => e && onFeedback(e.id)}>⭐</button>}
                        </div>
                    </div>
                );
            }) : <div style={{ textAlign: "center", padding: 60, color: "#999", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>no_registrations_found()</div>}
        </div>
    );
}

// ─── SAVED PAGE ───────────────────────────────────────────────────────────────
function SavedPage({ user, saved, events, regs, onDetail, onRegister, onUnsave }) {
    const savedEvs = events.filter(e => saved.has(e.id));
    return (
        <div className="page-wrap">
            <div className="ph"><h2>🔖 SAVED <span style={{ color: "#1a3c8e" }}>EVENTS</span></h2><p>Events you've bookmarked</p></div>
            {savedEvs.length ? savedEvs.map(e => {
                const isReg = regs.some(r => r.eid === e.id && r.sid === user?.id);
                const isPast = new Date(e.date) < new Date();
                return (
                    <div key={e.id} className="upi" style={{ cursor: "pointer" }} onClick={() => onDetail(e)}>
                        <div style={{ fontSize: 28 }}>{e.emoji}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{e.title}</div>
                            <div style={{ fontSize: 12, color: "#888" }}>📅 {fmt(e.date)} · 🏛 {e.venue}</div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }} onClick={ev => ev.stopPropagation()}>
                            {!isPast && !isReg && <button className="ev-reg-btn" style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => onRegister(e.id)}>REGISTER</button>}
                            <button className="ev-save-btn" onClick={() => onUnsave(e.id)}>✕ Remove</button>
                        </div>
                    </div>
                );
            }) : <div style={{ textAlign: "center", padding: 60, color: "#999", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>no_saved_events()</div>}
        </div>
    );
}

// ─── PORTFOLIO PAGE ───────────────────────────────────────────────────────────
function PortfolioPage({ user, regs, events, feedbacks }) {
    const myRegs = regs.filter(r => r.sid === user.id);
    const approved = myRegs.filter(r => r.status === "Approved");
    const odCount = myRegs.filter(r => { const e = events.find(x => x.id === r.eid); return e && e.od === "yes"; }).length;
    const score = myRegs.length * 100 + approved.length * 50 + odCount * 30;
    const certs = approved.map(r => events.find(e => e.id === r.eid)).filter(Boolean).filter(e => new Date(e.date) < new Date());
    const SCORING = [{ pts: "+100", lbl: "Event Registration", desc: "Each event you register for" }, { pts: "+50", lbl: "Approved Status", desc: "Registration marked approved" }, { pts: "+30", lbl: "OD Event", desc: "Attending an OD-eligible event" }, { pts: "+20", lbl: "Feedback Given", desc: "Submitting event feedback" }, { pts: "+15", lbl: "Team Event", desc: "Participating in team registration" }, { pts: "+10", lbl: "QR Check-In", desc: "Completed QR check-in at venue" }];
    return (
        <div className="page-wrap">
            <div className="ph"><h2>📊 MY <span style={{ color: "#1a3c8e" }}>PORTFOLIO</span></h2><p>Your activity history and achievements</p></div>
            <div className="portfolio-grid">
                {[[myRegs.length, "Total Registrations"], [approved.length, "Approved"], [odCount, "OD Events"], [certs.length, "Certificates"], [score, "Activity Score"]].map(([n, l]) => (
                    <div className="pstat" key={l}><div className="pstat-n">{n}</div><div className="pstat-l">{l}</div></div>
                ))}
            </div>
            <div className="slbl" style={{ marginBottom: 12 }}>⚡ Scoring Criteria</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10, marginBottom: 26 }}>
                {SCORING.map(s => <div key={s.lbl} className="score-crit"><div className="sc-pts">{s.pts}</div><div className="sc-label">{s.lbl}</div><div className="sc-desc">{s.desc}</div></div>)}
            </div>
            <div className="slbl">🎓 My Certificates</div>
            {certs.length ? certs.map(e => (
                <div key={e.id} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 7, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 24 }}>{e.emoji}</div>
                    <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{e.title}</div><div style={{ fontSize: 12, color: "#888" }}>📅 {fmt(e.date)} · {e.venue}</div></div>
                    <button className="tact te" onClick={() => downloadCert(e.title, e.date, e.venue, user)}>⬇ DOWNLOAD</button>
                </div>
            )) : <div style={{ color: "#999", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, marginBottom: 20 }}>Attend events to earn certificates.</div>}
            <div className="slbl" style={{ marginTop: 20 }}>📋 Event History</div>
            {myRegs.length ? myRegs.map(r => {
                const e = events.find(x => x.id === r.eid);
                const SC = { Registered: "rs-r", Approved: "rs-a", Rejected: "rs-j" };
                return (
                    <div key={r.eid} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 7, padding: "11px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, flex: 1 }}>{e?.emoji} {e?.title || "Unknown"}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{fmt(r.date)}</div>
                        <span className={SC[r.status] || "rs-r"}>{r.status}</span>
                    </div>
                );
            }) : <div style={{ color: "#999", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>No event history yet.</div>}
        </div>
    );
}

// ─── ADMIN PAGE ───────────────────────────────────────────────────────────────
function AdminPage({ events, setEvents, regs, setRegs, clubs, setClubs, proposals, setProposals }) {
    const [tab, setTab] = useState("events");
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ title: "", club: "", cat: "technical", date: "", time: "", venue: "MG Auditorium", fee: "Free", od: "yes", ref: "yes", dl: "", coord: "", emoji: "⚡", desc: "", loc: "", seats: 100 });
    const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
    function saveEvent() {
        if (!form.title || !form.date) return;
        if (editId) {
            setEvents(evs => evs.map(e => e.id === editId ? { ...e, ...form, id: editId } : e));
            setEditId(null);
        } else {
            const newId = Math.max(...events.map(e => e.id)) + 1;
            setEvents(evs => [...evs, { ...form, id: newId, seats: Number(form.seats) }]);
        }
        setShowForm(false);
        setForm({ title: "", club: "", cat: "technical", date: "", time: "", venue: "MG Auditorium", fee: "Free", od: "yes", ref: "yes", dl: "", coord: "", emoji: "⚡", desc: "", loc: "", seats: 100 });
    }
    function editEv(id) {
        const e = events.find(x => x.id === id);
        if (!e) return;
        setForm({ ...e });
        setEditId(id);
        setShowForm(true);
    }
    function delEv(id) {
        if (window.confirm("Delete this event?")) setEvents(evs => evs.filter(e => e.id !== id));
    }
    function updStat(idx, status) { setRegs(rs => rs.map((r, i) => i === idx ? { ...r, status } : r)); }
    const pending = proposals.filter(p => p.status === "pending").length;
    const upcoming = events.filter(e => new Date(e.date) >= new Date()).length;
    return (
        <div className="page-wrap">
            <div className="ph"><h2>ADMIN <span style={{ color: "#1a3c8e" }}>DASHBOARD</span></h2><p>Manage events, proposals, venues and clubs</p></div>
            <div className="akpi">
                {[["// total_events", events.length, "#1a3c8e"], ["// registrations", regs.length, "#0288d1"], ["// pending_proposals", pending, "#f5c400"], ["// upcoming", upcoming, "#fd7e14"]].map(([l, v, c]) => (
                    <div className="akc" key={l}><div className="akc-l">{l}</div><div className="akc-v" style={{ color: c }}>{v}</div></div>
                ))}
            </div>
            <div className="admin-tabs">
                {["events", "proposals", "venues", "participants", "clubs"].map(t => (
                    <button key={t} className={`admin-tab${tab === t ? " on" : ""}`} onClick={() => setTab(t)}>
                        {{ "events": "📋 EVENTS", "proposals": "📝 PROPOSALS", "venues": "📅 VENUES", "participants": "👥 PARTICIPANTS", "clubs": "🏛 CLUBS" }[t]}
                    </button>
                ))}
            </div>
            {tab === "events" && (
                <>
                    <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                        <button className="btn-sol" onClick={() => { setShowForm(s => !s); setEditId(null); setForm({ title: "", club: "", cat: "technical", date: "", time: "", venue: "MG Auditorium", fee: "Free", od: "yes", ref: "yes", dl: "", coord: "", emoji: "⚡", desc: "", loc: "", seats: 100 }); }}>+ ADD EVENT</button>
                        <button className="btn-out" style={{ padding: "7px 14px", fontSize: 12 }}>↺ REFRESH</button>
                    </div>
                    {showForm && (
                        <div className="addform">
                            <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, marginBottom: 16 }}>// {editId ? "Edit Event" : "New Event"}</h3>
                            <div className="fgrid">
                                <div className="fg"><label>Event Title</label><input value={form.title} onChange={e => upd("title", e.target.value)} placeholder="Code Wars 2026" /></div>
                                <div className="fg"><label>Club Name</label><input value={form.club} onChange={e => upd("club", e.target.value)} placeholder="IEEE Student Chapter" /></div>
                                <div className="fg"><label>Category</label><select value={form.cat} onChange={e => upd("cat", e.target.value)}><option value="technical">Technical</option><option value="cultural">Cultural</option><option value="sports">Sports</option><option value="workshop">Workshop</option></select></div>
                                <div className="fg"><label>Date</label><input type="date" value={form.date} onChange={e => upd("date", e.target.value)} /></div>
                                <div className="fg"><label>Time</label><input value={form.time} onChange={e => upd("time", e.target.value)} placeholder="10:00 AM – 1:00 PM" /></div>
                                <div className="fg"><label>Venue</label><select value={form.venue} onChange={e => upd("venue", e.target.value)}>{VENUES.map(v => <option key={v}>{v}</option>)}</select></div>
                                <div className="fg"><label>Fee</label><input value={form.fee} onChange={e => upd("fee", e.target.value)} placeholder="Free or ₹50" /></div>
                                <div className="fg"><label>OD Available</label><select value={form.od} onChange={e => upd("od", e.target.value)}><option value="yes">Yes</option><option value="no">No</option></select></div>
                                <div className="fg"><label>Refreshments</label><select value={form.ref} onChange={e => upd("ref", e.target.value)}><option value="yes">Yes</option><option value="no">No</option></select></div>
                                <div className="fg"><label>Reg Deadline</label><input type="date" value={form.dl} onChange={e => upd("dl", e.target.value)} /></div>
                                <div className="fg"><label>Coordinator Email</label><input value={form.coord} onChange={e => upd("coord", e.target.value)} placeholder="coord@vit.ac.in" /></div>
                                <div className="fg"><label>Emoji</label><input value={form.emoji} onChange={e => upd("emoji", e.target.value)} placeholder="⚡" /></div>
                                <div className="fg"><label>Seats</label><input type="number" value={form.seats} onChange={e => upd("seats", e.target.value)} /></div>
                                <div className="fg full"><label>Description</label><textarea value={form.desc} onChange={e => upd("desc", e.target.value)} placeholder="Event description..." /></div>
                                <div className="fg full"><label>Location Hint</label><input value={form.loc} onChange={e => upd("loc", e.target.value)} placeholder="Block A, Room 105" /></div>
                            </div>
                            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                                <button className="btn-sol" onClick={saveEvent}>{editId ? "UPDATE EVENT" : "ADD EVENT"}</button>
                                <button className="btn-out" onClick={() => setShowForm(false)}>CANCEL</button>
                            </div>
                        </div>
                    )}
                    <div style={{ overflowX: "auto" }}>
                        <table>
                            <thead><tr><th>Title</th><th>Club</th><th>Date</th><th>Venue</th><th>OD</th><th>Regs</th><th>Actions</th></tr></thead>
                            <tbody>
                                {events.map(e => (
                                    <tr key={e.id}>
                                        <td><strong>{e.emoji} {e.title}</strong></td>
                                        <td style={{ color: "#777", fontSize: 12 }}>{e.club}</td>
                                        <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{fmt(e.date)}</td>
                                        <td style={{ fontSize: 12 }}>{e.venue}</td>
                                        <td>{e.od === "yes" ? <span style={{ color: "#2e7d32", fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>YES</span> : <span style={{ color: "#ccc" }}>—</span>}</td>
                                        <td><span style={{ color: "#1a3c8e", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{regs.filter(r => r.eid === e.id).length}</span></td>
                                        <td><button className="tact te" onClick={() => editEv(e.id)}>EDIT</button><button className="tact tdl" onClick={() => delEv(e.id)}>DEL</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            {tab === "proposals" && (
                <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#888", marginBottom: 14 }}>{proposals.length} proposal(s) — {pending} pending</div>
                    {proposals.map(p => (
                        <div key={p.id} className="prop-card">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 3 }}>{p.emoji} {p.title}</div>
                                    <div style={{ fontSize: 12, color: "#888" }}>By: {p.clubName} · Submitted: {p.submittedOn}</div>
                                </div>
                                <span className={{ pending: "prop-status-p", approved: "prop-status-a", rejected: "prop-status-r", revision: "prop-status-rev" }[p.status] || "prop-status-p"}>
                                    {p.status.toUpperCase()}
                                </span>
                            </div>
                            <p style={{ fontSize: 13, color: "#555", marginBottom: 10 }}>{p.desc}</p>
                            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "#888", marginBottom: 12 }}>
                                <span>📅 {p.date}</span><span>🏛 {p.venue}</span><span>💰 {p.fee}</span><span>👥 {p.expectedParticipants} expected</span>
                            </div>
                            {p.status === "pending" && (
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    <button className="tact tap" onClick={() => setProposals(ps => ps.map(x => x.id === p.id ? { ...x, status: "approved", adminRemark: "Approved by admin." } : x))}>✓ APPROVE</button>
                                    <button className="tact trj" onClick={() => setProposals(ps => ps.map(x => x.id === p.id ? { ...x, status: "rejected" } : x))}>✕ REJECT</button>
                                    <button className="tact te" onClick={() => setProposals(ps => ps.map(x => x.id === p.id ? { ...x, status: "revision", adminRemark: "Please revise and resubmit." } : x))}>↺ REQUEST REVISION</button>
                                </div>
                            )}
                            {p.adminRemark && <div style={{ marginTop: 8, padding: "8px 12px", background: "#f8f9fa", borderRadius: 5, fontSize: 12, color: "#555", borderLeft: "3px solid #ddd" }}>Admin: {p.adminRemark}</div>}
                        </div>
                    ))}
                </div>
            )}
            {tab === "venues" && (
                <div style={{ overflowX: "auto" }}>
                    <table>
                        <thead><tr><th>Venue</th><th>Capacity</th>{["Mar 28", "Apr 2", "Apr 5", "Apr 8", "Apr 12", "Apr 15"].map(d => <th key={d}>{d}</th>)}</tr></thead>
                        <tbody>
                            {VENUES.map(v => (
                                <tr key={v}>
                                    <td><strong>{v}</strong></td>
                                    <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{VENUE_CAP[v] || "—"}</td>
                                    {["2026-03-28", "2026-04-02", "2026-04-05", "2026-04-08", "2026-04-12", "2026-04-15"].map(d => {
                                        const ev = events.find(e => e.date === d && e.venue === v);
                                        return <td key={d}>{ev ? <span style={{ background: "#f8d7da", color: "#c0392b", padding: "2px 6px", borderRadius: 3, fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}>BOOKED</span> : <span style={{ background: "#d4edda", color: "#2e7d32", padding: "2px 6px", borderRadius: 3, fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}>FREE</span>}</td>;
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {tab === "participants" && (
                <div style={{ overflowX: "auto" }}>
                    <table>
                        <thead><tr><th>Reg No</th><th>Name</th><th>Event</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {regs.length ? regs.map((r, i) => {
                                const e = events.find(x => x.id === r.eid);
                                const SC = { Registered: "rs-r", Approved: "rs-a", Rejected: "rs-j" };
                                return (
                                    <tr key={i}>
                                        <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{r.regNo}</td>
                                        <td>{r.name}</td>
                                        <td style={{ fontSize: 12 }}>{e?.title || "—"}</td>
                                        <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{r.date}</td>
                                        <td><span className={SC[r.status] || "rs-r"}>{r.status.toUpperCase()}</span></td>
                                        <td><button className="tact tap" onClick={() => updStat(i, "Approved")}>APPROVE</button><button className="tact trj" onClick={() => updStat(i, "Rejected")}>REJECT</button></td>
                                    </tr>
                                );
                            }) : <tr><td colSpan={6} style={{ textAlign: "center", padding: 26, color: "#999", fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>no_registrations_yet()</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
            {tab === "clubs" && (
                <div>
                    {clubs.map(c => (
                        <div key={c.id} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: 18, marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{ fontSize: 32 }}>{c.emoji}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
                                <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>Category: {c.category} · Founded: {c.founded} · {c.members.length} members</div>
                                <div style={{ fontSize: 12, color: "#888" }}>Advisor: {c.advisor} · {c.contact}</div>
                            </div>
                            <div style={{ fontWeight: 700, color: "#1a3c8e", fontFamily: "'JetBrains Mono',monospace", fontSize: 16 }}>{c.points} pts</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── CLUB PAGE ────────────────────────────────────────────────────────────────
function ClubPage({ user, clubs, setClubs, events, regs, proposals, setProposals }) {
    const [subTab, setSubTab] = useState("dashboard");
    const club = clubs.find(c => c.id === user.clubId);
    const [propForm, setPropForm] = useState({ title: "", emoji: "📋", cat: "technical", date: "", time: "", venue: "MG Auditorium", fee: "Free", maxParticipants: 100, expectedParticipants: 80, deadline: "", od: "yes", desc: "", resources: [], notes: "" });
    const [annForm, setAnnForm] = useState({ type: "announcement", title: "", body: "" });
    const [showAddMember, setShowAddMember] = useState(false);
    const [memberForm, setMemberForm] = useState({ name: "", regNo: "", dept: "CSE", role: "Member" });
    if (!club) return <div className="page-wrap"><div style={{ color: "#999", fontFamily: "'JetBrains Mono',monospace" }}>Club not found.</div></div>;
    const clubEvents = events.filter(e => e.clubId === club.id);
    const now = new Date();
    const eventsDone = clubEvents.filter(e => new Date(e.date) < now).length;
    const eventsUpcoming = clubEvents.filter(e => new Date(e.date) >= now).length;
    function addMember() {
        if (!memberForm.name || !memberForm.regNo) return;
        const newMember = { id: "m" + Date.now(), ...memberForm, points: 0 };
        setClubs(cs => cs.map(c => c.id === club.id ? { ...c, members: [...c.members, newMember] } : c));
        setMemberForm({ name: "", regNo: "", dept: "CSE", role: "Member" });
        setShowAddMember(false);
    }
    function downloadMembersCSV() {
        const header = "Name,Reg No,Department,Role,Points";
        const rows = club.members.map(m => `${m.name},${m.regNo},${m.dept},${m.role},${m.points}`);
        const csv = [header, ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `${club.name}_members.csv`; a.click();
        URL.revokeObjectURL(url);
    }
    function downloadEventRegistrantsCSV(ev) {
        const eventRegs = regs.filter(r => r.eid === ev.id);
        const header = "Name,Reg No,Status,Date";
        const rows = eventRegs.map(r => `${r.name},${r.regNo},${r.status},${r.date}`);
        const csv = [header, ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `${ev.title}_registrants.csv`; a.click();
        URL.revokeObjectURL(url);
    }
    const clubProposals = proposals.filter(p => p.clubId === club.id);
    const totalRegs = clubEvents.reduce((s, e) => s + regs.filter(r => r.eid === e.id).length, 0);
    function submitProposal() {
        if (!propForm.title || !propForm.date) return;
        const newP = { ...propForm, id: "p" + Date.now(), clubId: club.id, clubName: club.name, status: "pending", adminRemark: "", suggestedDate: "", suggestedVenue: "", submittedOn: new Date().toISOString().split("T")[0] };
        setProposals(ps => [...ps, newP]);
        setPropForm({ title: "", emoji: "📋", cat: "technical", date: "", time: "", venue: "MG Auditorium", fee: "Free", maxParticipants: 100, expectedParticipants: 80, deadline: "", od: "yes", desc: "", resources: [], notes: "" });
        alert("Proposal submitted!");
    }
    function submitAnn() {
        if (!annForm.title || !annForm.body) return;
        setClubs(cs => cs.map(c => c.id === club.id ? { ...c, announcements: [{ id: "a" + Date.now(), ...annForm, time: "Just now" }, ...c.announcements] } : c));
        setAnnForm({ type: "announcement", title: "", body: "" });
    }
    const upd = (k, v) => setPropForm(f => ({ ...f, [k]: v }));
    return (
        <div className="page-wrap">
            <div className="ph"><h2>🏛 {club.name}</h2><p>{club.category} · Founded {club.founded} · {club.members.length} members</p></div>
            <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
                {[[club.points, "Club Points"], [clubEvents.length, "Events Hosted"], [totalRegs, "Total Registrations"], [club.monthlyRank, "Monthly Rank"]].map(([n, l]) => (
                    <div key={l} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: "14px 20px", flex: 1, minWidth: 120 }}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: "#1a3c8e" }}>{n}</div>
                        <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace" }}>{l}</div>
                    </div>
                ))}
            </div>
            <div className="club-stabs">
                {["dashboard", "members", "events", "proposals", "announcements"].map(t => (
                    <button key={t} className={`club-stab${subTab === t ? " on" : ""}`} onClick={() => setSubTab(t)}>
                        {{ "dashboard": "📊 DASHBOARD", "members": "👥 MEMBERS", "events": "📋 EVENTS", "proposals": "📝 PROPOSE EVENT", "announcements": "📢 ANNOUNCEMENTS" }[t]}
                    </button>
                ))}
            </div>
            {subTab === "dashboard" && (
                <div>
                    <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                        <div style={{ background: "#d4edda", border: "1px solid #b8dbb8", borderRadius: 8, padding: "14px 20px", flex: 1, minWidth: 120, textAlign: "center" }}>
                            <div style={{ fontSize: 28, fontWeight: 700, color: "#2e7d32" }}>{eventsDone}</div>
                            <div style={{ fontSize: 11, color: "#388e3c", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace" }}>Events Done</div>
                        </div>
                        <div style={{ background: "#fff3cd", border: "1px solid #ffe08a", borderRadius: 8, padding: "14px 20px", flex: 1, minWidth: 120, textAlign: "center" }}>
                            <div style={{ fontSize: 28, fontWeight: 700, color: "#856404" }}>{eventsUpcoming}</div>
                            <div style={{ fontSize: 11, color: "#856404", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace" }}>Upcoming</div>
                        </div>
                    </div>
                    <div className="slbl">ℹ️ Club Info</div>
                    <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: 18, marginBottom: 20 }}>
                        {[["🏛 Category", club.category], ["👨‍🏫 Advisor", club.advisor], ["📧 Contact", club.contact], ["📸 Instagram", club.instagram]].map(([l, v]) => (
                            <div key={l} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid #f5f5f5", fontSize: 14 }}>
                                <span style={{ fontWeight: 600, minWidth: 120 }}>{l}</span>
                                <span style={{ color: "#555" }}>{v}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {subTab === "members" && (
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                        <div style={{ fontSize: 13, color: "#888", fontFamily: "'JetBrains Mono',monospace" }}>{club.members.length} member(s)</div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn-out" style={{ padding: "7px 14px", fontSize: 12 }} onClick={downloadMembersCSV}>⬇ EXPORT CSV</button>
                            <button className="btn-sol" style={{ padding: "7px 14px", fontSize: 12 }} onClick={() => setShowAddMember(s => !s)}>+ ADD MEMBER</button>
                        </div>
                    </div>
                    {showAddMember && (
                        <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: 18, marginBottom: 16 }}>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#1a3c8e" }}>// Add New Member</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                                <div className="iw" style={{ margin: 0 }}><label>Full Name</label><input value={memberForm.name} onChange={e => setMemberForm(f => ({ ...f, name: e.target.value }))} placeholder="Arjun Kumar" /></div>
                                <div className="iw" style={{ margin: 0 }}><label>Reg No</label><input value={memberForm.regNo} onChange={e => setMemberForm(f => ({ ...f, regNo: e.target.value }))} placeholder="22CSE001" /></div>
                                <div className="iw" style={{ margin: 0 }}><label>Department</label>
                                    <select value={memberForm.dept} onChange={e => setMemberForm(f => ({ ...f, dept: e.target.value }))}>
                                        {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="iw" style={{ margin: 0 }}><label>Role</label>
                                    <select value={memberForm.role} onChange={e => setMemberForm(f => ({ ...f, role: e.target.value }))}>
                                        {["President", "Vice President", "Secretary", "Treasurer", "Member"].map(r => <option key={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button className="btn-sol" style={{ padding: "8px 18px", fontSize: 13 }} onClick={addMember}>ADD →</button>
                                <button className="btn-out" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setShowAddMember(false)}>CANCEL</button>
                            </div>
                        </div>
                    )}
                    {club.members.map(m => (
                        <div key={m.id} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 7, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                            <div className="member-av">{m.name[0]}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                                <div style={{ fontSize: 12, color: "#888" }}>{m.regNo} · {m.dept} · {m.role}</div>
                            </div>
                            <div style={{ fontWeight: 700, color: "#1a3c8e", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{m.points} pts</div>
                        </div>
                    ))}
                </div>
            )}
            {subTab === "events" && (
                <div>
                    {clubEvents.length ? clubEvents.map(e => {
                        const eventRegs = regs.filter(r => r.eid === e.id);
                        const isPast = new Date(e.date) < now;
                        const sampleRegs = [
                            { name: "Arjun S", regNo: "21CSE001", status: "Approved" },
                            { name: "Kavya R", regNo: "21CSE018", status: "Registered" },
                            { name: "Deepan M", regNo: "21CSE034", status: "Registered" },
                        ];
                        const displayRegs = eventRegs.length > 0 ? eventRegs : sampleRegs.map(s => ({ ...s, eid: e.id }));
                        return (
                            <div key={e.id} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: "14px 16px", marginBottom: 14 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                                    <div style={{ fontSize: 26 }}>{e.emoji}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 14 }}>{e.title}</div>
                                        <div style={{ fontSize: 12, color: "#888" }}>📅 {fmt(e.date)} · {e.venue}</div>
                                    </div>
                                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                        <span style={{ fontWeight: 700, color: "#1a3c8e", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{eventRegs.length} regs</span>
                                        {isPast ?
                                            <span style={{ background: "#d4edda", color: "#2e7d32", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>DONE</span> :
                                            <span style={{ background: "#fff3cd", color: "#856404", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>UPCOMING</span>
                                        }
                                        <button className="btn-out" style={{ padding: "5px 12px", fontSize: 11 }} onClick={() => downloadEventRegistrantsCSV(e)}>⬇ CSV</button>
                                    </div>
                                </div>
                                {displayRegs.length > 0 && (
                                    <div style={{ overflowX: "auto" }}>
                                        <table style={{ fontSize: 12 }}>
                                            <thead><tr>
                                                <th>Name</th><th>Reg No</th><th>Status</th>
                                            </tr></thead>
                                            <tbody>
                                                {displayRegs.slice(0, 5).map((r, i) => (
                                                    <tr key={i}>
                                                        <td>{r.name}</td>
                                                        <td style={{ fontFamily: "'JetBrains Mono',monospace" }}>{r.regNo}</td>
                                                        <td><span className={r.status === "Approved" ? "rs-a" : "rs-r"}>{r.status}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {eventRegs.length === 0 && <div style={{ fontSize: 11, color: "#aaa", fontFamily: "'JetBrains Mono',monospace", marginTop: 4, paddingLeft: 4 }}>// sample registrations shown</div>}
                                        {eventRegs.length > 5 && <div style={{ fontSize: 11, color: "#999", fontFamily: "'JetBrains Mono',monospace", marginTop: 4 }}>+ {eventRegs.length - 5} more. Download CSV for full list.</div>}
                                    </div>
                                )}
                            </div>
                        );
                    }) : <div style={{ color: "#999", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>No events hosted yet.</div>}
                </div>
            )}
            {subTab === "proposals" && (
                <>
                    <div className="addform">
                        <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, marginBottom: 16 }}>// Submit New Proposal</h3>
                        <div className="fgrid">
                            <div className="fg full"><label>Event Title</label><input value={propForm.title} onChange={e => upd("title", e.target.value)} placeholder="Workshop on Deep Learning" /></div>
                            <div className="fg"><label>Category</label><select value={propForm.cat} onChange={e => upd("cat", e.target.value)}><option value="technical">Technical</option><option value="cultural">Cultural</option><option value="sports">Sports</option><option value="workshop">Workshop</option></select></div>
                            <div className="fg"><label>Emoji</label><input value={propForm.emoji} onChange={e => upd("emoji", e.target.value)} /></div>
                            <div className="fg"><label>Proposed Date</label><input type="date" value={propForm.date} onChange={e => upd("date", e.target.value)} /></div>
                            <div className="fg"><label>Time</label><input value={propForm.time} onChange={e => upd("time", e.target.value)} placeholder="10:00 AM - 2:00 PM" /></div>
                            <div className="fg"><label>Venue</label><select value={propForm.venue} onChange={e => upd("venue", e.target.value)}>{VENUES.map(v => <option key={v}>{v}</option>)}</select></div>
                            <div className="fg"><label>Fee</label><input value={propForm.fee} onChange={e => upd("fee", e.target.value)} /></div>
                            <div className="fg"><label>OD Available</label><select value={propForm.od} onChange={e => upd("od", e.target.value)}><option value="yes">Yes</option><option value="no">No</option></select></div>
                            <div className="fg"><label>Max Participants</label><input type="number" value={propForm.maxParticipants} onChange={e => upd("maxParticipants", e.target.value)} /></div>
                            <div className="fg"><label>Registration Deadline</label><input type="date" value={propForm.deadline} onChange={e => upd("deadline", e.target.value)} /></div>
                            <div className="fg full"><label>Description</label><textarea value={propForm.desc} onChange={e => upd("desc", e.target.value)} placeholder="Describe your event..." /></div>
                            <div className="fg full"><label>Additional Notes</label><input value={propForm.notes} onChange={e => upd("notes", e.target.value)} placeholder="Special requirements..." /></div>
                        </div>
                        <button className="btn-sol" style={{ marginTop: 14, padding: "10px 24px" }} onClick={submitProposal}>SUBMIT PROPOSAL →</button>
                    </div>
                    <div className="slbl" style={{ marginTop: 8 }}>📋 My Proposals</div>
                    {clubProposals.length ? clubProposals.map(p => (
                        <div key={p.id} className="prop-card">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.emoji} {p.title}</div>
                                <span className={{ pending: "prop-status-p", approved: "prop-status-a", rejected: "prop-status-r", revision: "prop-status-rev" }[p.status]}>
                                    {p.status.toUpperCase()}
                                </span>
                            </div>
                            {p.adminRemark && <div style={{ marginTop: 8, padding: "8px 12px", background: "#f8f9fa", borderRadius: 5, fontSize: 12, color: "#555", borderLeft: "3px solid #ddd" }}>Admin note: {p.adminRemark}</div>}
                        </div>
                    )) : <div style={{ color: "#999", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>No proposals submitted yet.</div>}
                </>
            )}
            {subTab === "announcements" && (
                <>
                    <div className="addform" style={{ marginBottom: 20 }}>
                        <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, marginBottom: 12 }}>// Post Announcement</h3>
                        <div className="iw"><label>Type</label><select value={annForm.type} onChange={e => setAnnForm(f => ({ ...f, type: e.target.value }))}><option value="announcement">Announcement</option><option value="recruitment">Recruitment</option><option value="event">Event Update</option></select></div>
                        <div className="iw"><label>Title</label><input value={annForm.title} onChange={e => setAnnForm(f => ({ ...f, title: e.target.value }))} placeholder="Announcement title" /></div>
                        <div className="iw"><label>Body</label><textarea value={annForm.body} onChange={e => setAnnForm(f => ({ ...f, body: e.target.value }))} placeholder="Write your announcement..." style={{ minHeight: 80 }} /></div>
                        <button className="btn-sol" onClick={submitAnn}>POST →</button>
                    </div>
                    {club.announcements.map(a => (
                        <div key={a.id} className="ann-card">
                            <div className="ann-type">{a.type}</div>
                            <div className="ann-title">{a.title}</div>
                            <div className="ann-body">{a.body}</div>
                            <div className="ann-time">{a.time}</div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function CampusEvents() {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState(INITIAL_EVENTS);
    const [clubs, setClubs] = useState(INITIAL_CLUBS);
    const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
    const [regs, setRegs] = useState([]);
    const [saved, setSaved] = useState(new Set());
    const [feedbacks, setFeedbacks] = useState({});
    const [page, setPage] = useState("home");
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [detailEvent, setDetailEvent] = useState(null);
    const [qrEvent, setQREvent] = useState(null);
    const [feedbackEvent, setFeedbackEvent] = useState(null);
    const [teamEvent, setTeamEvent] = useState(null);
    const [showLB, setShowLB] = useState(false);
    const [toast, setToast] = useState({ msg: "", icon: "", visible: false });
    const toastTimer = useRef();

    function showToast(msg, icon = "ℹ️") {
        clearTimeout(toastTimer.current);
        setToast({ msg, icon, visible: true });
        toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
    }

    function doLogin(tab, u, p, onErr) {
        let usr = null;
        if (tab === "admin" && u === "admin" && p === "admin123") usr = { id: "admin", name: "Admin", role: "admin", regNo: "ADMIN", odUsed: 0 };
        else if (tab === "student" && p === "pass123") usr = { id: u || "student", name: (u || "Student").toUpperCase(), role: "student", regNo: (u || "STUDENT").toUpperCase(), odUsed: Math.floor(Math.random() * 18) };
        else if (tab === "club") { const club = clubs.find(c => c.id === u.toLowerCase() && c.password === p); if (club) usr = { id: club.id, name: club.name, role: "club", regNo: "CLUB", odUsed: 0, clubId: club.id }; }
        if (!usr) { onErr("Invalid credentials. Try again."); return; }
        if (usr.role === "student" && !regs.length) {
            const initial = [
                { eid: 101, status: "Approved", date: "2026-03-05" },
                { eid: 102, status: "Approved", date: "2026-03-10" },
                { eid: 103, status: "Approved", date: "2026-03-18" },
                { eid: 1, status: "Approved", date: "2026-03-28" },
                { eid: 6, status: "Approved", date: "2026-04-12" },
                { eid: 4, status: "Approved", date: "2026-04-05" },
            ];
            setRegs(initial.map(r => ({ eid: r.eid, sid: usr.id, status: r.status, date: r.date, regNo: usr.regNo, name: usr.name })));
            usr = { ...usr, odUsed: Math.min(40, (usr.odUsed || 0) + 16) };
        }
        setUser(usr);
        setShowLogin(false);
        setPage(usr.role === "admin" ? "admin" : usr.role === "club" ? "club" : "home");
        showToast(`Welcome, ${usr.name.split(" ")[0]}!`, "👋");
    }

    function doSignup(tab, form) {
        if (tab === "student") {
            const usr = { id: form.regno.toLowerCase(), name: form.name.toUpperCase(), role: "student", regNo: form.regno.toUpperCase(), dept: form.dept, email: form.email, odUsed: 0 };
            setUser(usr);
            setShowSignup(false);
            setPage("home");
            showToast(`Welcome, ${form.name.split(" ")[0]}! Account created.`, "✅");
        } else {
            const newClubId = form.clubname.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
            if (clubs.find(c => c.id === newClubId)) { alert("A club with this name already exists."); return; }
            const newClub = { id: newClubId, name: form.clubname, password: form.pass, emoji: "🏛", category: form.clubcat, founded: new Date().getFullYear().toString(), advisor: form.advisor || "TBD", contact: form.clubemail || newClubId + "@vit.ac.in", instagram: "@" + newClubId + "_vit", points: 0, monthlyRank: clubs.length + 1, members: [], announcements: [] };
            setClubs(cs => [...cs, newClub]);
            const usr = { id: newClubId, name: form.clubname, role: "club", regNo: "CLUB", odUsed: 0, clubId: newClubId };
            setUser(usr);
            setShowSignup(false);
            setPage("club");
            showToast(`Club "${form.clubname}" registered!`, "🏛");
        }
    }

    function doLogout() {
        setUser(null); setRegs([]); setSaved(new Set()); setPage("home");
        showToast("Session ended", "👋");
    }

    function registerEvent(id) {
        if (!user) return;
        if (regs.some(r => r.eid === id && r.sid === user.id)) { showToast("Already registered!", "ℹ️"); return; }
        const ev = events.find(e => e.id === id);
        const newReg = { eid: id, sid: user.id, status: "Registered", date: new Date().toISOString().split("T")[0], regNo: user.regNo, name: user.name };
        setRegs(rs => [...rs, newReg]);
        if (ev?.od === "yes") setUser(u => ({ ...u, odUsed: Math.min(40, (u.odUsed || 0) + 8) }));
        showToast(`Registered for ${ev?.title || "event"}!`, "✅");
    }

    function teamRegister(id, members) {
        if (!user) return;
        if (regs.some(r => r.eid === id && r.sid === user.id)) { showToast("Already registered!", "ℹ️"); return; }
        const ev = events.find(e => e.id === id);
        setRegs(rs => [...rs, { eid: id, sid: user.id, status: "Registered", date: new Date().toISOString().split("T")[0], regNo: user.regNo, name: user.name, team: members }]);
        if (ev?.od === "yes") setUser(u => ({ ...u, odUsed: Math.min(40, (u.odUsed || 0) + 8) }));
        showToast(`Team registered (${members.length + 1} members)!`, "👥");
    }

    function toggleSave(id) {
        setSaved(s => { const n = new Set(s); if (n.has(id)) { n.delete(id); showToast("Removed from saved", "🔖"); } else { n.add(id); showToast("Event saved!", "🔖"); } return n; });
    }

    function checkin(id) {
        setRegs(rs => rs.map(r => r.eid === id && r.sid === user?.id ? { ...r, status: "Approved" } : r));
        showToast("Attendance marked!", "✅");
    }

    function submitFeedback(id, data) {
        setFeedbacks(f => ({ ...f, [id]: data }));
        showToast("Feedback submitted!", "⭐");
    }

    function addToCalendar(id) {
        const e = events.find(x => x.id === id);
        if (!e) return;
        const s = e.date.replace(/-/g, "");
        const gcal = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&dates=${s}/${s}&details=${encodeURIComponent(e.desc)}&location=${encodeURIComponent(e.venue + ", VIT Chennai")}`;
        window.open(gcal, "_blank");
        showToast("Opening calendar...", "📅");
    }

    const odPct = Math.min(100, ((user?.odUsed || 0) / 40) * 100);

    // Show landing page if not logged in
    if (!user) {
        return (
            <>
                <style>{css}</style>
                <Landing onLogin={(t) => { setShowLogin(true); }} onSignup={() => setShowSignup(true)} />
                {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={doLogin} />}
                {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSignup={doSignup} />}
                <Toast {...toast} />
            </>
        );
    }

    const tabs = [
        { id: "home", label: "🏠 HOME", show: true },
        { id: "events", label: "📋 EVENTS", show: true },
        { id: "calendar", label: "📅 CALENDAR", show: true },
        { id: "myregs", label: "🎟 MY REGS", show: user.role === "student" },
        { id: "saved", label: "🔖 SAVED", show: user.role === "student" },
        { id: "portfolio", label: "📊 PORTFOLIO", show: user.role === "student" },
        { id: "admin", label: "⚙ ADMIN", show: user.role === "admin" },
        { id: "club", label: "🏛 CLUB", show: user.role === "club" },
    ].filter(t => t.show);

    return (
        <>
            <style>{css}</style>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <nav className="topbar">
                    <div className="alogo">⚡CE</div>
                    <div className="ntabs">
                        {tabs.map(t => (
                            <button key={t.id} className={`ntab${page === t.id ? " on" : ""}`} onClick={() => setPage(t.id)}>{t.label}</button>
                        ))}
                    </div>
                    <div className="tbr">
                        {user.role === "student" && (
                            <div className="od-badge">
                                <span className="od-t">OD</span>
                                <div className="od-track"><div className="od-fill" style={{ width: `${odPct}%`, background: odColor(user.odUsed || 0) }} /></div>
                                <span className="od-t">{user.odUsed || 0}/40</span>
                            </div>
                        )}
                        <div className="ubadge">
                            <div className="uav">{user.name[0]}</div>
                            <span className="uname">{user.name.split(" ")[0]}</span>
                        </div>
                        <button className="lout" onClick={doLogout}>EXIT</button>
                    </div>
                </nav>
                <div style={{ flex: 1 }}>
                    {page === "home" && <HomePage user={user} events={events} regs={regs} clubs={clubs} saved={saved} onDetail={setDetailEvent} onRegister={registerEvent} onSave={toggleSave} onLB={() => setShowLB(true)} onPage={setPage} toast={showToast} />}
                    {page === "events" && <EventsPage events={events} user={user} regs={regs} saved={saved} onDetail={setDetailEvent} onRegister={registerEvent} onSave={toggleSave} />}
                    {page === "calendar" && <CalendarPage events={events} regs={regs} user={user} onDetail={setDetailEvent} />}
                    {page === "myregs" && <MyRegsPage user={user} regs={regs} events={events} onDetail={setDetailEvent} onQR={id => { const e = events.find(x => x.id === id); setQREvent(e); }} onFeedback={id => { const e = events.find(x => x.id === id); setFeedbackEvent(e); }} />}
                    {page === "saved" && <SavedPage user={user} saved={saved} events={events} regs={regs} onDetail={setDetailEvent} onRegister={registerEvent} onUnsave={toggleSave} />}
                    {page === "portfolio" && <PortfolioPage user={user} regs={regs} events={events} feedbacks={feedbacks} />}
                    {page === "admin" && <AdminPage events={events} setEvents={setEvents} regs={regs} setRegs={setRegs} clubs={clubs} setClubs={setClubs} proposals={proposals} setProposals={setProposals} />}
                    {page === "club" && <ClubPage user={user} clubs={clubs} setClubs={setClubs} events={events} regs={regs} proposals={proposals} setProposals={setProposals} />}
                </div>
            </div>
            {/* MODALS */}
            {detailEvent && <DetailModal event={detailEvent} onClose={() => setDetailEvent(null)} user={user} regs={regs} saved={saved} onRegister={id => { registerEvent(id); }} onTeamReg={id => { setTeamEvent(events.find(e => e.id === id)); setDetailEvent(null); }} onSave={toggleSave} onQR={id => { setQREvent(events.find(e => e.id === id)); }} onFeedback={id => { setFeedbackEvent(events.find(e => e.id === id)); }} onCalendar={addToCalendar} />}
            {qrEvent && <QRModal event={qrEvent} onClose={() => setQREvent(null)} onCheckin={id => { checkin(id); showToast("Attendance marked!", "✅"); }} />}
            {feedbackEvent && <FeedbackModal event={feedbackEvent} onClose={() => setFeedbackEvent(null)} onSubmit={submitFeedback} />}
            {teamEvent && <TeamRegModal event={teamEvent} user={user} onClose={() => setTeamEvent(null)} onSubmit={teamRegister} />}
            {showLB && <LeaderboardModal clubs={clubs} onClose={() => setShowLB(false)} />}
            <Toast {...toast} />
        </>
    );
}

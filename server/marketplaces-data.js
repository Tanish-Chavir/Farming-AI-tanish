// ============================================
// FARM AI BUILDER — Predefined APMC Marketplaces Dataset
// Comprehensive data for Indian agricultural markets
// ============================================

const MARKETPLACES = [
  // ── DELHI / NCR ──
  { id: "azadpur", name: "Azadpur Mandi", address: "Azadpur, North Delhi, Delhi 110033", lat: 28.7041, lng: 77.1788, phone: "011-27691081", state: "Delhi", district: "North Delhi", crops: ["Vegetables", "Fruits", "Onion", "Potato", "Tomato"] },
  { id: "ghazipur", name: "Ghazipur Mandi", address: "Ghazipur, East Delhi, Delhi 110096", lat: 28.6218, lng: 77.3209, phone: "011-22726920", state: "Delhi", district: "East Delhi", crops: ["Flowers", "Vegetables", "Fruits"] },
  { id: "okhla", name: "Okhla Mandi", address: "Okhla, South Delhi, Delhi 110025", lat: 28.5672, lng: 77.2710, phone: "011-26831456", state: "Delhi", district: "South Delhi", crops: ["Grains", "Pulses", "Vegetables"] },

  // ── UTTAR PRADESH ──
  { id: "lucknow_mandi", name: "Lucknow APMC", address: "Alambagh, Lucknow, UP 226005", lat: 26.8206, lng: 80.8920, phone: "0522-2455678", state: "Uttar Pradesh", district: "Lucknow", crops: ["Wheat", "Rice", "Potato", "Vegetables"] },
  { id: "agra_mandi", name: "Agra Mandi", address: "Belanganj, Agra, UP 282004", lat: 27.1767, lng: 78.0081, phone: "0562-2520134", state: "Uttar Pradesh", district: "Agra", crops: ["Potato", "Wheat", "Mustard"] },
  { id: "kanpur_apmc", name: "Kanpur APMC", address: "Anwarganj, Kanpur, UP 208003", lat: 26.4499, lng: 80.3319, phone: "0512-2540089", state: "Uttar Pradesh", district: "Kanpur", crops: ["Grains", "Pulses", "Oilseeds"] },
  { id: "varanasi_mandi", name: "Varanasi Mandi", address: "Lanka, Varanasi, UP 221005", lat: 25.3176, lng: 82.9739, phone: "0542-2369012", state: "Uttar Pradesh", district: "Varanasi", crops: ["Vegetables", "Grains", "Fruits"] },
  { id: "meerut_mandi", name: "Meerut Mandi", address: "Partapur, Meerut, UP 250103", lat: 28.9845, lng: 77.7064, phone: "0121-2760034", state: "Uttar Pradesh", district: "Meerut", crops: ["Sugarcane", "Wheat", "Jaggery"] },
  { id: "bareilly_mandi", name: "Bareilly APMC", address: "Nawabganj, Bareilly, UP 243001", lat: 28.3670, lng: 79.4304, phone: "0581-2565012", state: "Uttar Pradesh", district: "Bareilly", crops: ["Rice", "Wheat", "Vegetables"] },

  // ── PUNJAB ──
  { id: "khanna_mandi", name: "Khanna Mandi", address: "Grain Market, Khanna, Punjab 141401", lat: 30.6964, lng: 76.2170, phone: "01628-224055", state: "Punjab", district: "Ludhiana", crops: ["Wheat", "Rice", "Maize"] },
  { id: "amritsar_mandi", name: "Amritsar Mandi", address: "Hall Bazar, Amritsar, Punjab 143001", lat: 31.6340, lng: 74.8723, phone: "0183-2540089", state: "Punjab", district: "Amritsar", crops: ["Wheat", "Vegetables", "Basmati Rice"] },
  { id: "ludhiana_apmc", name: "Ludhiana APMC", address: "Gill Road, Ludhiana, Punjab 141003", lat: 30.9010, lng: 75.8573, phone: "0161-2770012", state: "Punjab", district: "Ludhiana", crops: ["Rice", "Cotton", "Wheat"] },
  { id: "bathinda_mandi", name: "Bathinda Mandi", address: "Grain Market, Bathinda, Punjab 151001", lat: 30.2110, lng: 74.9455, phone: "0164-2212345", state: "Punjab", district: "Bathinda", crops: ["Cotton", "Mustard", "Wheat"] },
  { id: "jalandhar_mandi", name: "Jalandhar APMC", address: "BMC Chowk, Jalandhar, Punjab 144001", lat: 31.3260, lng: 75.5762, phone: "0181-2224567", state: "Punjab", district: "Jalandhar", crops: ["Vegetables", "Wheat", "Rice"] },

  // ── HARYANA ──
  { id: "karnal_mandi", name: "Karnal Mandi", address: "Grain Market, Karnal, Haryana 132001", lat: 29.6857, lng: 76.9905, phone: "0184-2260123", state: "Haryana", district: "Karnal", crops: ["Rice", "Wheat", "Basmati"] },
  { id: "hisar_mandi", name: "Hisar Mandi", address: "Grain Market, Hisar, Haryana 125001", lat: 29.1492, lng: 75.7217, phone: "01662-234567", state: "Haryana", district: "Hisar", crops: ["Cotton", "Mustard", "Gram"] },
  { id: "sirsa_mandi", name: "Sirsa Mandi", address: "Grain Market, Sirsa, Haryana 125055", lat: 29.5349, lng: 75.0283, phone: "01666-223456", state: "Haryana", district: "Sirsa", crops: ["Cotton", "Guar", "Bajra"] },
  { id: "sonipat_mandi", name: "Sonipat APMC", address: "Mandi Road, Sonipat, Haryana 131001", lat: 28.9931, lng: 77.0151, phone: "0130-2236789", state: "Haryana", district: "Sonipat", crops: ["Wheat", "Rice", "Vegetables"] },

  // ── RAJASTHAN ──
  { id: "jaipur_mandi", name: "Jaipur Mandi", address: "Muhana Mandi, Jaipur, Rajasthan 302029", lat: 26.8043, lng: 75.8290, phone: "0141-2792345", state: "Rajasthan", district: "Jaipur", crops: ["Mustard", "Gram", "Vegetables", "Onion"] },
  { id: "jodhpur_mandi", name: "Jodhpur Mandi", address: "Mandi Bhawan, Jodhpur, Rajasthan 342001", lat: 26.2389, lng: 73.0243, phone: "0291-2636789", state: "Rajasthan", district: "Jodhpur", crops: ["Bajra", "Guar", "Cumin", "Moth"] },
  { id: "kota_mandi", name: "Kota Mandi", address: "Anantpura, Kota, Rajasthan 324001", lat: 25.2138, lng: 75.8648, phone: "0744-2500456", state: "Rajasthan", district: "Kota", crops: ["Soybean", "Coriander", "Wheat"] },

  // ── MADHYA PRADESH ──
  { id: "indore_mandi", name: "Indore Mandi", address: "Malwa Mill Area, Indore, MP 452003", lat: 22.7196, lng: 75.8577, phone: "0731-2491234", state: "Madhya Pradesh", district: "Indore", crops: ["Soybean", "Wheat", "Gram", "Garlic"] },
  { id: "bhopal_apmc", name: "Bhopal APMC", address: "Karond, Bhopal, MP 462001", lat: 23.2599, lng: 77.4126, phone: "0755-2660789", state: "Madhya Pradesh", district: "Bhopal", crops: ["Wheat", "Gram", "Vegetables"] },
  { id: "neemuch_mandi", name: "Neemuch Mandi", address: "Mandi Bhawan, Neemuch, MP 458441", lat: 24.4622, lng: 74.8708, phone: "07423-234567", state: "Madhya Pradesh", district: "Neemuch", crops: ["Garlic", "Coriander", "Opium"] },
  { id: "mandsaur_mandi", name: "Mandsaur Mandi", address: "Krishi Upaj Mandi, Mandsaur, MP 458001", lat: 24.0667, lng: 75.0700, phone: "07422-245678", state: "Madhya Pradesh", district: "Mandsaur", crops: ["Garlic", "Soybean", "Opium"] },

  // ── MAHARASHTRA ──
  { id: "vashi_apmc", name: "Vashi APMC", address: "Sector 19, Vashi, Navi Mumbai, MH 400705", lat: 19.0760, lng: 72.9981, phone: "022-27840505", state: "Maharashtra", district: "Thane", crops: ["Vegetables", "Fruits", "Onion", "Potato"] },
  { id: "lasalgaon_mandi", name: "Lasalgaon Mandi", address: "Lasalgaon, Nashik, MH 422306", lat: 20.1433, lng: 74.2335, phone: "02550-240123", state: "Maharashtra", district: "Nashik", crops: ["Onion", "Tomato", "Grapes"] },
  { id: "pune_apmc", name: "Pune APMC (Market Yard)", address: "Gultekdi, Pune, MH 411037", lat: 18.4981, lng: 73.8850, phone: "020-24262525", state: "Maharashtra", district: "Pune", crops: ["Vegetables", "Grains", "Fruits", "Flowers"] },
  { id: "nagpur_mandi", name: "Nagpur Mandi", address: "Kalamna Market, Nagpur, MH 440002", lat: 21.1458, lng: 79.0882, phone: "0712-2723456", state: "Maharashtra", district: "Nagpur", crops: ["Orange", "Cotton", "Soybean", "Rice"] },
  { id: "kolhapur_mandi", name: "Kolhapur APMC", address: "Shahu Market Yard, Kolhapur, MH 416005", lat: 16.7050, lng: 74.2433, phone: "0231-2654321", state: "Maharashtra", district: "Kolhapur", crops: ["Sugarcane", "Turmeric", "Vegetables"] },

  // ── GUJARAT ──
  { id: "rajkot_mandi", name: "Rajkot Mandi", address: "Marketing Yard, Rajkot, Gujarat 360003", lat: 22.3039, lng: 70.8022, phone: "0281-2440567", state: "Gujarat", district: "Rajkot", crops: ["Groundnut", "Cotton", "Castor"] },
  { id: "ahmedabad_apmc", name: "Ahmedabad APMC", address: "Jamalpur, Ahmedabad, Gujarat 380022", lat: 23.0225, lng: 72.5714, phone: "079-25623456", state: "Gujarat", district: "Ahmedabad", crops: ["Vegetables", "Spices", "Grains"] },
  { id: "unjha_mandi", name: "Unjha Mandi", address: "Unjha APMC, Mehsana, Gujarat 384170", lat: 23.8000, lng: 72.4000, phone: "02767-254567", state: "Gujarat", district: "Mehsana", crops: ["Cumin", "Fennel", "Ajwain", "Isabgol"] },
  { id: "gondal_mandi", name: "Gondal Mandi", address: "Gondal APMC, Rajkot, Gujarat 360311", lat: 21.9600, lng: 70.7900, phone: "02825-220345", state: "Gujarat", district: "Rajkot", crops: ["Groundnut", "Onion", "Cotton"] },

  // ── KARNATAKA ──
  { id: "bengaluru_apmc", name: "Bengaluru APMC (Yeshwanthpur)", address: "Yeshwanthpur, Bengaluru, KA 560022", lat: 13.0221, lng: 77.5431, phone: "080-23371234", state: "Karnataka", district: "Bengaluru", crops: ["Vegetables", "Flowers", "Fruits", "Coconut"] },
  { id: "hubli_mandi", name: "Hubli-Dharwad Mandi", address: "Amargol, Hubli, KA 580025", lat: 15.3647, lng: 75.1240, phone: "0836-2372345", state: "Karnataka", district: "Dharwad", crops: ["Cotton", "Groundnut", "Jowar", "Chilli"] },
  { id: "mysuru_mandi", name: "Mysuru Mandi", address: "Bandipalya, Mysuru, KA 570026", lat: 12.2958, lng: 76.6394, phone: "0821-2471234", state: "Karnataka", district: "Mysuru", crops: ["Coffee", "Spices", "Vegetables", "Flowers"] },

  // ── TAMIL NADU ──
  { id: "koyambedu", name: "Koyambedu Market", address: "Koyambedu, Chennai, TN 600107", lat: 13.0694, lng: 80.1948, phone: "044-24791234", state: "Tamil Nadu", district: "Chennai", crops: ["Vegetables", "Fruits", "Flowers"] },
  { id: "coimbatore_apmc", name: "Coimbatore APMC", address: "Mettupalayam Road, Coimbatore, TN 641043", lat: 11.0168, lng: 76.9558, phone: "0422-2452345", state: "Tamil Nadu", district: "Coimbatore", crops: ["Cotton", "Coconut", "Vegetables", "Turmeric"] },
  { id: "madurai_mandi", name: "Madurai Mandi", address: "Mattuthavani, Madurai, TN 625007", lat: 9.9252, lng: 78.1198, phone: "0452-2537890", state: "Tamil Nadu", district: "Madurai", crops: ["Banana", "Rice", "Vegetables"] },

  // ── ANDHRA PRADESH ──
  { id: "guntur_mandi", name: "Guntur Mandi", address: "Mirchi Yard, Guntur, AP 522001", lat: 16.3067, lng: 80.4365, phone: "0863-2233456", state: "Andhra Pradesh", district: "Guntur", crops: ["Chilli", "Cotton", "Tobacco", "Turmeric"] },
  { id: "kurnool_mandi", name: "Kurnool Mandi", address: "Kurnool APMC, AP 518001", lat: 15.8281, lng: 78.0373, phone: "08518-224567", state: "Andhra Pradesh", district: "Kurnool", crops: ["Groundnut", "Jowar", "Sunflower"] },
  { id: "vijayawada_mandi", name: "Vijayawada Mandi", address: "Benz Circle, Vijayawada, AP 520010", lat: 16.5062, lng: 80.6480, phone: "0866-2474567", state: "Andhra Pradesh", district: "Krishna", crops: ["Rice", "Vegetables", "Fruits"] },

  // ── TELANGANA ──
  { id: "hyderabad_apmc", name: "Hyderabad APMC (Bowenpally)", address: "Bowenpally, Hyderabad, TS 500011", lat: 17.4700, lng: 78.4700, phone: "040-27742345", state: "Telangana", district: "Hyderabad", crops: ["Vegetables", "Fruits", "Grains"] },
  { id: "warangal_mandi", name: "Warangal Mandi", address: "Enumamula, Warangal, TS 506007", lat: 17.9784, lng: 79.5941, phone: "0870-2578901", state: "Telangana", district: "Warangal", crops: ["Cotton", "Rice", "Turmeric"] },
  { id: "nizamabad_mandi", name: "Nizamabad Mandi", address: "Nizamabad APMC, TS 503001", lat: 18.6725, lng: 78.0941, phone: "08462-234567", state: "Telangana", district: "Nizamabad", crops: ["Turmeric", "Rice", "Maize"] },

  // ── WEST BENGAL ──
  { id: "kolkata_apmc", name: "Kolkata APMC (Posta Bazar)", address: "Posta, Kolkata, WB 700006", lat: 22.5868, lng: 88.3552, phone: "033-22684567", state: "West Bengal", district: "Kolkata", crops: ["Rice", "Jute", "Vegetables", "Fish"] },
  { id: "siliguri_mandi", name: "Siliguri Mandi", address: "Bidhan Market, Siliguri, WB 734001", lat: 26.7271, lng: 88.3953, phone: "0353-2435678", state: "West Bengal", district: "Darjeeling", crops: ["Tea", "Rice", "Jute", "Oranges"] },

  // ── BIHAR ──
  { id: "patna_mandi", name: "Patna Mandi", address: "Mithapur, Patna, Bihar 800001", lat: 25.6244, lng: 85.1376, phone: "0612-2223456", state: "Bihar", district: "Patna", crops: ["Wheat", "Rice", "Maize", "Vegetables"] },
  { id: "muzaffarpur_mandi", name: "Muzaffarpur Mandi", address: "Muzaffarpur APMC, Bihar 842001", lat: 26.1209, lng: 85.3647, phone: "0621-2240567", state: "Bihar", district: "Muzaffarpur", crops: ["Litchi", "Banana", "Vegetables"] },

  // ── ODISHA ──
  { id: "cuttack_mandi", name: "Cuttack Mandi", address: "Badambadi, Cuttack, Odisha 753009", lat: 20.4625, lng: 85.8830, phone: "0671-2314567", state: "Odisha", district: "Cuttack", crops: ["Rice", "Vegetables", "Fish"] },

  // ── KERALA ──
  { id: "kochi_market", name: "Kochi Market (Ernakulam)", address: "Edappally, Kochi, Kerala 682024", lat: 9.9816, lng: 76.2999, phone: "0484-2803456", state: "Kerala", district: "Ernakulam", crops: ["Spices", "Rubber", "Coconut", "Banana"] },
  { id: "thrissur_mandi", name: "Thrissur Mandi", address: "Thrissur APMC, Kerala 680001", lat: 10.5276, lng: 76.2144, phone: "0487-2331234", state: "Kerala", district: "Thrissur", crops: ["Coconut", "Rice", "Vegetables"] },

  // ── GOA ──
  { id: "panaji_market", name: "Panaji Market", address: "Municipal Market, Panaji, Goa 403001", lat: 15.4989, lng: 73.8278, phone: "0832-2224567", state: "Goa", district: "North Goa", crops: ["Cashew", "Coconut", "Vegetables", "Fish"] },

  // ── CHHATTISGARH ──
  { id: "raipur_mandi", name: "Raipur Mandi", address: "Pandri, Raipur, CG 492001", lat: 21.2514, lng: 81.6296, phone: "0771-4044567", state: "Chhattisgarh", district: "Raipur", crops: ["Rice", "Pulses", "Maize"] },

  // ── JHARKHAND ──
  { id: "ranchi_mandi", name: "Ranchi Mandi", address: "Birsa Munda Market, Ranchi, JH 834001", lat: 23.3441, lng: 85.3096, phone: "0651-2310567", state: "Jharkhand", district: "Ranchi", crops: ["Rice", "Vegetables", "Maize"] },

  // ── ASSAM ──
  { id: "guwahati_mandi", name: "Guwahati Mandi", address: "Fancy Bazar, Guwahati, Assam 781001", lat: 26.1890, lng: 91.7462, phone: "0361-2544567", state: "Assam", district: "Kamrup", crops: ["Tea", "Rice", "Jute", "Vegetables"] },

  // ── HIMACHAL PRADESH ──
  { id: "shimla_apmc", name: "Shimla APMC", address: "Dhalli, Shimla, HP 171012", lat: 31.1048, lng: 77.1734, phone: "0177-2623456", state: "Himachal Pradesh", district: "Shimla", crops: ["Apple", "Stone Fruits", "Vegetables"] },

  // ── UTTARAKHAND ──
  { id: "dehradun_mandi", name: "Dehradun Mandi", address: "Niranjanpur, Dehradun, UK 248001", lat: 30.3165, lng: 78.0322, phone: "0135-2654567", state: "Uttarakhand", district: "Dehradun", crops: ["Basmati Rice", "Fruits", "Vegetables"] },

  // ── SIKKIM ──
  { id: "gangtok_market", name: "Gangtok Market", address: "Lall Market, Gangtok, Sikkim 737101", lat: 27.3389, lng: 88.6065, phone: "03592-202345", state: "Sikkim", district: "East Sikkim", crops: ["Cardamom", "Organic Produce", "Ginger"] },

  // ── TRIPURA ──
  { id: "agartala_market", name: "Agartala Market", address: "Battala, Agartala, Tripura 799001", lat: 23.8315, lng: 91.2868, phone: "0381-2324567", state: "Tripura", district: "West Tripura", crops: ["Rice", "Rubber", "Pineapple"] },

  // ── ADDITIONAL MAJOR MANDIS ──
  { id: "chandigarh_mandi", name: "Chandigarh Grain Market", address: "Sector 26, Chandigarh 160019", lat: 30.7300, lng: 76.7800, phone: "0172-2790123", state: "Chandigarh", district: "Chandigarh", crops: ["Wheat", "Rice", "Vegetables", "Fruits"] },
  { id: "surat_apmc", name: "Surat APMC", address: "Varachha Road, Surat, Gujarat 395006", lat: 21.1702, lng: 72.8311, phone: "0261-2556789", state: "Gujarat", district: "Surat", crops: ["Vegetables", "Sugarcane", "Cotton", "Banana"] },
  { id: "udaipur_mandi", name: "Udaipur Mandi", address: "Mandi Samiti, Udaipur, Rajasthan 313001", lat: 24.5854, lng: 73.7125, phone: "0294-2414567", state: "Rajasthan", district: "Udaipur", crops: ["Maize", "Wheat", "Garlic", "Soybean"] },
  { id: "jabalpur_mandi", name: "Jabalpur Mandi", address: "Adhartal, Jabalpur, MP 482004", lat: 23.1815, lng: 79.9864, phone: "0761-2600456", state: "Madhya Pradesh", district: "Jabalpur", crops: ["Wheat", "Rice", "Pulses", "Oilseeds"] },
  { id: "aurangabad_mandi", name: "Aurangabad APMC", address: "Jalna Road, Aurangabad, MH 431001", lat: 19.8762, lng: 75.3433, phone: "0240-2334567", state: "Maharashtra", district: "Aurangabad", crops: ["Cotton", "Bajra", "Jowar", "Vegetables"] },
  { id: "sangli_mandi", name: "Sangli Mandi", address: "Market Yard, Sangli, MH 416416", lat: 16.8524, lng: 74.5815, phone: "0233-2671234", state: "Maharashtra", district: "Sangli", crops: ["Turmeric", "Grapes", "Sugarcane", "Raisins"] },
  { id: "davangere_mandi", name: "Davangere APMC", address: "Market Yard, Davangere, KA 577002", lat: 14.4644, lng: 75.9218, phone: "08192-234567", state: "Karnataka", district: "Davangere", crops: ["Maize", "Cotton", "Groundnut", "Chilli"] },
  { id: "salem_mandi", name: "Salem APMC", address: "Omalur Road, Salem, TN 636004", lat: 11.6643, lng: 78.1460, phone: "0427-2314567", state: "Tamil Nadu", district: "Salem", crops: ["Tapioca", "Turmeric", "Banana", "Mango"] },
  { id: "visakhapatnam_mandi", name: "Visakhapatnam Mandi", address: "Rythu Bazar, Vizag, AP 530003", lat: 17.6868, lng: 83.2185, phone: "0891-2712345", state: "Andhra Pradesh", district: "Visakhapatnam", crops: ["Rice", "Cashew", "Vegetables", "Fruits"] },
  { id: "prayagraj_mandi", name: "Prayagraj Mandi", address: "Naini, Prayagraj, UP 211008", lat: 25.4358, lng: 81.8463, phone: "0532-2460567", state: "Uttar Pradesh", district: "Prayagraj", crops: ["Wheat", "Rice", "Vegetables", "Guava"] },
];

module.exports = { MARKETPLACES };

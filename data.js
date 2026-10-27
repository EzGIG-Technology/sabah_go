/* Sabah GO: sample content (replace with live APIs) */
const DEST = [
  { id:'semporna', name:'Semporna', tag:'Island Paradise', cat:['island','adventure'], img:'semporna_hero', thumb:'t_semporna', gallery:'semporna_overview', rating:4.9, reviews:2841, loc:'Semporna, Tawau Division', best:'Mar – Oct', ideal:'Couples, families, divers',
    desc:'Semporna is the gateway to some of the most beautiful islands in the world, with crystal clear waters, vibrant marine life and the living culture of the Bajau Laut sea nomads.',
    attractions:[['Mabul Island','Muck diving & water villas','islands'],['Bohey Dulang','Iconic viewpoint hike','island'],['Kapalai','Resort on stilts over a sandbar','resort23'],['Regatta Lepa','Bajau boat festival (April)','boat']],
    acts:['a_island','a_sipadan','a_sunset'], food:['f_seafood','f_hinava'], stay:['s_mabul','s_kapalai'] },
  { id:'kinabalu', name:'Mount Kinabalu', tag:'Nature & Adventure', cat:['nature','adventure'], img:'kinabalu_park', thumb:'t_kinabalu', gallery:'kinabalu_eco', rating:4.9, reviews:5120, loc:'Kinabalu Park, Ranau', best:'Mar – Aug', ideal:'Hikers, nature lovers',
    desc:'At 4,095 m, Mount Kinabalu is the highest peak in Malaysia and a UNESCO World Heritage Site, home to more than 5,000 plant species including the Rafflesia and pitcher plants.',
    attractions:[['Kinabalu Park HQ','Botanical garden & trails','kinabalu_park'],['Poring Hot Springs','Canopy walk & sulphur baths','rec_waterfall'],['Low\'s Peak','Summit sunrise at 4,095 m','t_kinabalu']],
    acts:['a_climb','a_kundasang'], food:['f_tuaran'], stay:['s_pine','s_homestay'] },
  { id:'sipadan', name:'Sipadan', tag:'World Class Diving', cat:['island','adventure'], img:'rec_diving', thumb:'t_sipadan', gallery:'t_sipadan', rating:5.0, reviews:1932, loc:'Celebes Sea, off Semporna', best:'Apr – Dec', ideal:'Certified divers',
    desc:'Sipadan rises 600 m from the seabed and is rated among the top dive sites on earth: turtle tombs, barracuda tornadoes and reef sharks. Daily permits are limited to 176 divers.',
    attractions:[['Barracuda Point','Schooling barracuda & jacks','rec_diving'],['Turtle Tomb','Cave system under the island','t_sipadan'],['Drop Off','Wall dive from the jetty','boat']],
    acts:['a_sipadan','a_island'], food:['f_seafood'], stay:['s_kapalai','s_mabul'] },
  { id:'kundasang', name:'Kundasang', tag:'Cool Highland Escape', cat:['nature'], img:'kundasang2', thumb:'t_kundasang', gallery:'t_kundasang', rating:4.7, reviews:1610, loc:'Ranau District', best:'All year', ideal:'Families, photographers',
    desc:'Known as the "New Zealand of Sabah", Kundasang sits at 1,900 m with dairy farms, vegetable markets and the best sunrise view of Mount Kinabalu.',
    attractions:[['Desa Dairy Farm','Cows with a mountain backdrop','t_kundasang'],['Kundasang War Memorial','Gardens & history','kinabalu_park'],['Mesilau Nature Resort','Forest trails','rec_waterfall']],
    acts:['a_kundasang','a_climb'], food:['f_tuaran'], stay:['s_pine','s_homestay'] },
  { id:'tawau', name:'Tawau', tag:'Gateway to Nature', cat:['nature'], img:'t_tawau', thumb:'t_tawau', gallery:'t_tawau', rating:4.5, reviews:640, loc:'Tawau Division', best:'All year', ideal:'Nature, food lovers',
    desc:'Tawau is the gateway to Semporna and home to Tawau Hills Park, the world\'s tallest tropical tree and Sabah\'s cocoa heritage.',
    attractions:[['Tawau Hills Park','Hot springs & waterfalls','rec_waterfall'],['Cocoa Heritage','Bean-to-bar tastings','crafts']],
    acts:['a_danum'], food:['f_seafood'], stay:['s_homestay'] },
  { id:'kinabatangan', name:'Kinabatangan', tag:'Wildlife & River Safari', cat:['nature','wildlife'], img:'t_kinabatangan', thumb:'t_kinabatangan', gallery:'rec_orangutan', rating:4.8, reviews:2205, loc:'Sukau, Sandakan Division', best:'Mar – Oct', ideal:'Wildlife lovers',
    desc:'Malaysia\'s second longest river is lined with forest full of proboscis monkeys, pygmy elephants, orangutans and eight species of hornbill.',
    attractions:[['Sukau','Dawn & dusk river cruises','t_kinabatangan'],['Gomantong Caves','Swiftlet nest harvesting','t_danum'],['Sepilok','Orangutan rehabilitation','rec_orangutan']],
    acts:['a_river'], food:['f_hinava'], stay:['s_sukau'] },
  { id:'danum', name:'Danum Valley', tag:'Ancient Rainforest', cat:['nature','wildlife','adventure'], img:'t_danum', thumb:'t_danum', gallery:'rec_waterfall', rating:4.8, reviews:870, loc:'Lahad Datu', best:'Mar – Sep', ideal:'Adventurers, researchers',
    desc:'130 million years old and older than the Amazon, Danum Valley is one of the last pristine lowland rainforests on earth.',
    attractions:[['Canopy Walkway','27 m above the forest floor','t_danum'],['Coffin Cliff','Ancient Kadazan burial site','rec_waterfall']],
    acts:['a_danum'], food:[], stay:['s_sukau'] },
  { id:'kk', name:'Kota Kinabalu', tag:'City, Food & Sunsets', cat:['culture'], img:'kk_city', thumb:'kk_city', gallery:'city', rating:4.6, reviews:3820, loc:'West Coast Division', best:'All year', ideal:'Everyone',
    desc:'Sabah\'s capital is a waterfront city of night markets, seafood, island hopping and some of the best sunsets in Southeast Asia.',
    attractions:[['Gaya Street Sunday Market','Crafts, food & plants','market2'],['Signal Hill','City view at sunset','city'],['KK Waterfront','Bars & seafood','jetty_sunset'],['Filipino Market','Grilled seafood at night','seafood']],
    acts:['a_food','a_sunset','a_island'], food:['f_fattkee','f_welcome','f_seafood'], stay:['s_shangri','s_homestay'] },
  { id:'manukan', name:'Pulau Manukan', tag:'Snorkelling & Beaches', cat:['island'], img:'manukan', thumb:'manukan', gallery:'beach', rating:4.6, reviews:2950, loc:'Tunku Abdul Rahman Park', best:'Mar – Oct', ideal:'Families, first-timers',
    desc:'Twenty minutes by boat from Jesselton Point, Manukan has white sand, clear water and easy snorkelling right off the beach.',
    attractions:[['Manukan Beach','Snorkel & swim','beach'],['Sapi Island','Coral Flyer zipline','island']],
    acts:['a_island'], food:['f_seafood'], stay:['s_shangri'] },
  { id:'marimari', name:'Mari-Mari Village', tag:'Culture & Tradition', cat:['culture'], img:'marimari', thumb:'marimari', gallery:'dancers', rating:4.8, reviews:1430, loc:'Inanam, Kota Kinabalu', best:'All year', ideal:'Culture lovers, families',
    desc:'A living museum of five ethnic groups of Sabah (Kadazandusun, Rungus, Lundayeh, Bajau and Murut), with traditional houses, food, blowpipes and dance.',
    attractions:[['Traditional houses','Five ethnic architectures','marimari'],['Sumazau dance','Cultural performance','dancers']],
    acts:['a_culture'], food:['f_hinava'], stay:['s_homestay'] },
];

const ITEMS = {
  /* activities */
  a_island:{type:'act',name:'Semporna Island Hopping',sub:'Bohey Dulang, Mantabuan & Sibuan · 8 hrs',price:180,old:220,img:'islands',rating:4.9,dest:'semporna',incl:['Speedboat & guide','Snorkel gear','Seafood lunch','Marine park fees']},
  a_sipadan:{type:'act',name:'Sipadan Dive Day Trip',sub:'3 boat dives · permit included',price:450,img:'rec_diving',rating:5.0,dest:'sipadan',incl:['Sipadan permit','3 guided dives','Lunch on Mabul','Equipment rental']},
  a_sunset:{type:'act',name:'Sunset Cruise KK',sub:'2 hrs · dinner on deck',price:150,old:180,img:'jetty_sunset',rating:4.7,dest:'kk',incl:['Hotel pickup','Buffet dinner','Live music']},
  a_climb:{type:'act',name:'Mount Kinabalu Climb 2D1N',sub:'Summit at sunrise · licensed guide',price:1350,img:'t_kinabalu',rating:4.9,dest:'kinabalu',incl:['Climbing permit','Mountain guide','Laban Rata dorm','All meals']},
  a_kundasang:{type:'act',name:'Kundasang Highland Tour',sub:'Desa Dairy Farm & markets · 9 hrs',price:160,img:'t_kundasang',rating:4.7,dest:'kundasang',incl:['Transport from KK','Farm entry','Lunch']},
  a_river:{type:'act',name:'Kinabatangan River Safari',sub:'Dusk cruise · proboscis monkeys',price:220,old:260,img:'t_kinabatangan',rating:4.8,dest:'kinabatangan',incl:['Boat & ranger','Night walk','Dinner']},
  a_danum:{type:'act',name:'Danum Valley Canopy Walk',sub:'Guided rainforest day · 6 hrs',price:320,img:'t_danum',rating:4.8,dest:'danum',incl:['Conservation fee','Guide','Packed lunch']},
  a_food:{type:'act',name:'KK Night Food Tour',sub:'8 tastings · local host',price:120,img:'seafood',rating:4.8,dest:'kk',incl:['8 tastings','Local host','Drinks']},
  a_culture:{type:'act',name:'Mari-Mari Cultural Tour',sub:'Half day · lunch & dance show',price:190,img:'marimari',rating:4.8,dest:'marimari',incl:['Transfer','Guided tour','Lunch','Performance']},
  /* food */
  f_fattkee:{type:'food',name:'Kedai Kopi Fatt Kee',sub:'Kopitiam · Butter prawns, sweet & sour',price:35,img:'seafood',rating:4.6,dest:'kk',deal:'10% off with Pass'},
  f_welcome:{type:'food',name:'Welcome Seafood Restaurant',sub:'Live seafood · Tiger prawns, crab',price:80,img:'seafood',rating:4.5,dest:'kk',deal:'Free drink'},
  f_seafood:{type:'food',name:'Filipino Market Grill',sub:'Night market · Grilled fish & squid',price:25,img:'market1',rating:4.4,dest:'kk',deal:'Pay by QR'},
  f_hinava:{type:'food',name:'Hinava & Kadazan Kitchen',sub:'Traditional · Hinava, tuhau, bambangan',price:30,img:'crafts',rating:4.7,dest:'marimari',deal:'Cultural pick'},
  f_tuaran:{type:'food',name:'Tuaran Mee House',sub:'Local noodles · Ranau & Kundasang',price:15,img:'market2',rating:4.5,dest:'kundasang'},
  /* stay */
  s_shangri:{type:'stay',name:'Shangri-La Tanjung Aru',sub:'5★ beach resort · Kota Kinabalu',price:780,old:920,img:'resort23',rating:4.8,dest:'kk'},
  s_mabul:{type:'stay',name:'Mabul Water Bungalows',sub:'Overwater villa · Semporna',price:1150,img:'bg_resort',rating:4.9,dest:'semporna'},
  s_kapalai:{type:'stay',name:'Sipadan Kapalai Resort',sub:'Stilt resort on a sandbar',price:980,img:'villas',rating:4.7,dest:'sipadan'},
  s_pine:{type:'stay',name:'Kinabalu Pine Resort',sub:'Mountain-view lodge · Kundasang',price:320,img:'kundasang2',rating:4.5,dest:'kundasang'},
  s_sukau:{type:'stay',name:'Sukau Rainforest Lodge',sub:'Eco lodge · Kinabatangan',price:640,img:'t_danum',rating:4.8,dest:'kinabatangan'},
  s_homestay:{type:'stay',name:'Homestay Kg. Mesilou',sub:'Village homestay · local hosts',price:120,img:'tourists',rating:4.7,dest:'kundasang'},
  /* shopping */
  p_gaya:{type:'shop',name:'Gaya Street Sunday Market',sub:'Sundays 6am–1pm · Crafts & plants',price:0,img:'market2',rating:4.6,dest:'kk'},
  p_handicraft:{type:'shop',name:'KK Handicraft Market',sub:'Pearls, batik & souvenirs',price:0,img:'crafts',rating:4.4,dest:'kk'},
  p_vege:{type:'shop',name:'Kundasang Vegetable Market',sub:'Highland produce & snacks',price:0,img:'t_kundasang',rating:4.5,dest:'kundasang'},
  /* services */
  v_esim:{type:'svc',name:'Sabah GO eSIM',sub:'15 days · 30 GB · 5G',price:45,img:'city',rating:4.7},
  v_ferry:{type:'svc',name:'Jesselton Point Ferry',sub:'Return to Manukan / Sapi',price:45,img:'boat',rating:4.5},
  v_car:{type:'svc',name:'Car Rental · Perodua Bezza',sub:'Per day · insurance included',price:130,img:'bus',rating:4.4},
  v_bus:{type:'svc',name:'Airport Express Bus',sub:'KKIA ↔ City Centre',price:5,img:'bus',rating:4.3},
  v_medical:{type:'svc',name:'Executive Health Screening',sub:'Gleneagles KK · Medical tourism',price:890,img:'medical',rating:4.8},
};

const EVENTS = [
  {id:'kaamatan',name:'Pesta Kaamatan',sub:'Harvest Festival · KDCA, Penampang',d:'30',m:'May',img:'dancers',desc:'Sabah\'s biggest celebration: the Unduk Ngadau pageant, sumazau dancing, tapai rice wine and the thanksgiving to Bambarayon, the rice spirit.'},
  {id:'regatta',name:'Regatta Lepa',sub:'Semporna waterfront',d:'25',m:'Apr',img:'boat',desc:'Bajau Laut families sail their colourful lepa boats in a parade of sails, music and traditional dance.'},
  {id:'birds',name:'Borneo Bird Festival',sub:'Rainforest Discovery Centre, Sepilok',d:'08',m:'Nov',img:'rec_orangutan',desc:'Guided bird walks, photography workshops and conservation talks in the Sepilok forest.'},
  {id:'jazz',name:'KK Jazz Festival',sub:'Waterfront, Kota Kinabalu',d:'14',m:'Nov',img:'jetty_sunset',desc:'Two nights of jazz by the sea with local and international acts.'},
  {id:'sabahfest',name:'Sabah Fest',sub:'Kota Kinabalu city',d:'20',m:'Dec',img:'culture4',desc:'A week-long showcase of Sabah\'s 30+ ethnic groups: music, food, crafts and costume.'},
];

const DEALS = [
  {id:'d_attr',big:'10% OFF',t:'All Attractions',s:'With Digital Tourist Pass',c:'c-blue',code:'SBGO10'},
  {id:'d_cash',big:'RM120',t:'Cashback on Stays',s:'Min. spend RM600',c:'c-green',code:'STAY120'},
  {id:'d_fnb',big:'1+1',t:'Local Food Trail',s:'40 kopitiams in KK',c:'c-orange',code:'MAKAN11'},
  {id:'d_esim',big:'15% OFF',t:'eSIM & Internet',s:'All data plans',c:'c-purple',code:'ESIM15'},
  {id:'d_dive',big:'RM50',t:'Off dive trips',s:'Semporna & Sipadan',c:'c-teal',code:'DIVE50'},
];

const LANGS = [['ms','Bahasa Malaysia','Malay'],['en','English','English'],['zh','中文','Chinese'],['ja','日本語','Japanese'],['ko','한국어','Korean'],['id','Bahasa Indonesia','Indonesian'],['th','ภาษาไทย','Thai'],['vi','Tiếng Việt','Vietnamese'],['de','Deutsch','German'],['fr','Français','French'],['ar','العربية','Arabic'],['ta','தமிழ்','Tamil']];

const CURR = [['MYR','Malaysian Ringgit',1],['CNY','Chinese Yuan',1.62],['USD','US Dollar',0.23],['SGD','Singapore Dollar',0.30],['GBP','British Pound',0.17],['EUR','Euro',0.21],['KRW','Korean Won',318],['JPY','Japanese Yen',34.6],['THB','Thai Baht',7.7],['IDR','Indonesian Rupiah',3720],['AUD','Australian Dollar',0.35]];

const RAILS = [
  {g:'Sabah GO', items:[['wallet','Sabah GO Wallet','Instant · no fees',null]]},
  {g:'International cards', items:[['visa','Visa','•••• 4821','pay_visa'],['mastercard','Mastercard','Credit / debit','pay_mastercard'],['jcb','JCB','Credit / debit','pay_jcb'],['amex','American Express','Credit','pay_amex']]},
  {g:'China', items:[['alipay','Alipay+','Pay in CNY','pay_alipay'],['wechat','WeChat Pay','Pay in CNY','pay_wechat'],['unionpay','UnionPay','银联','pay_unionpay']]},
  {g:'ASEAN cross-border QR', items:[['paynow','PayNow','Singapore','pay_paynow'],['promptpay','PromptPay','Thailand','pay_promptpay'],['qris','QRIS','Indonesia','pay_qris']]},
  {g:'Domestic Malaysia', items:[['duitnow','DuitNow QR','All Malaysian banks','pay_duitnow'],['fpx','FPX Online Banking','Maybank, CIMB, Bank Islam…','pay_fpx']]},
];

const TEC_RATES = {air:{n:'Air',ms:'Udara',p:75,img:'airport_sunset'},land:{n:'Land',ms:'Darat',p:35,img:'bus'},sea:{n:'Sea / Ferry',ms:'Laut / Feri',p:35,img:'boat'},cruise:{n:'Cruise',ms:'Kapal Persiaran',p:50,img:'resort23'}};

const I18N = {
  en:{home:'Home',trips:'Trips',wallet:'Wallet',rewards:'Rewards',profile:'Profile',welcome:'Welcome to Sabah',discover:'Discover Amazing Sabah',heroSub:'Nature • Culture • Adventure • Local Experience',search:'Search places, food, tours',popular:'Popular Destinations',seeAll:'See All',reco:'Recommended for You',events:'Festivals & Events',deals:'Exclusive Deals',services:'Traveller Services',c_dest:'Destinations',c_act:'Activities',c_food:'Food',c_shop:'Shopping',c_stay:'Stay',c_deal:'Packages & Deals',c_svc:'Services',c_rw:'Rewards',banner:'Explore Sabah More Meaningfully',bannerSub:'Let Stella plan a trip around what you love.',bannerCta:'Plan with Stella'},
  ms:{home:'Utama',trips:'Perjalanan',wallet:'Wallet',rewards:'Ganjaran',profile:'Profil',welcome:'Selamat Datang',discover:'Explore Real Sabah',heroSub:'Alam Semula Jadi • Budaya Unik • Pengalaman Tidak Terlupakan',search:'Cari tempat, makanan, aktiviti',popular:'Destinasi Popular',seeAll:'Lihat Semua',reco:'Disyorkan Untuk Anda',events:'Festival & Acara',deals:'Tawaran Eksklusif',services:'Perkhidmatan Pelancong',c_dest:'Destinasi',c_act:'Aktiviti',c_food:'Makanan',c_shop:'Beli-belah',c_stay:'Penginapan',c_deal:'Pakej & Promosi',c_svc:'Perkhidmatan',c_rw:'Ganjaran',banner:'Jom Teroka Sabah',bannerSub:'Biar Stella rancang perjalanan ikut minat anda.',bannerCta:'Rancang bersama Stella'},
};

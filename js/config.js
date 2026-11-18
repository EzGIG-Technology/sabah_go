/* =====================================================================
   CONFIG · paths. When the console lives inside the existing Sabah GO
   repo (served at /console/), photos come from the app's own /img/ folder.
   Generated images go in /img/console/ and override the fallbacks
   automatically (see IMAGE_PROMPTS.md).
   ===================================================================== */
window.SG_CONFIG = window.SG_CONFIG || {};
const IMG_BASE = SG_CONFIG.imgBase || '/img/';
const LOGO = {
  full: SG_CONFIG.logoFull || '/img/logos/sabah-go-logo.png',
  emblem: SG_CONFIG.logoEmblem || '/img/logos/sabah-go-emblem.png',
  MOF: SG_CONFIG.logoMOF || '/img/logos/mof-sabah.png',
  KEP: SG_CONFIG.logoKEP || '/img/logos/kepkas.png',
  IMM: SG_CONFIG.logoIMM || '/img/logos/imigresen-malaysia.png',
};
/* key: [generated file in /img/console/, fallback photo already in /img/] */
const IMGS = {
  hero:['hero.jpg','hero_sabah.jpg'], p_app:['portal-app.jpg','home_hero.jpg'], appbg:['app-bg.jpg','semporna_hero.jpg'],
  p_ops:['portal-ops.jpg','semporna_overview.jpg'], p_tourism:['portal-tourism.jpg','culture4.jpg'], p_finance:['portal-finance.jpg','villas.jpg'],
  p_immigration:['portal-immigration.jpg','airport_sunset.jpg'], p_merchant:['portal-merchant.jpg','market1.jpg'], p_command:['portal-command.jpg','kinabalu_eco.jpg'],
  d_kk:['dest-kota-kinabalu.jpg','kk_city.jpg'], d_tarp:['dest-tar-park.jpg','manukan.jpg'], d_kpark:['dest-kinabalu-park.jpg','kinabalu_park.jpg'], d_summit:['dest-kinabalu-summit.jpg','t_kinabalu.jpg'],
  d_semporna:['dest-semporna.jpg','t_semporna.jpg'], d_sipadan:['dest-sipadan.jpg','t_sipadan.jpg'], d_kina:['dest-kinabatangan.jpg','t_kinabatangan.jpg'], d_sepilok:['dest-sepilok.jpg','rec_orangutan.jpg'],
  d_danum:['dest-danum-valley.jpg','t_danum.jpg'], d_marimari:['dest-mari-mari.jpg','marimari.jpg'], d_kudat:['dest-kudat.jpg','beach.jpg'], d_tamu:['dest-tamu-kota-belud.jpg','market2.jpg'],
  e_bird:['event-bird-festival.jpg','rec_orangutan.jpg'], e_fest:['event-sabah-fest.jpg','dancers.jpg'], e_jazz:['event-kk-jazz.jpg','jetty_sunset.jpg'], e_climb:['event-climbathon.jpg','t_kinabalu.jpg'], e_regatta:['event-regatta-lepa.jpg','boat.jpg'], e_kaamatan:['event-kaamatan.jpg','culture4.jpg'],
  cp_air:['checkpoint-airport.jpg','airport.jpg'], cp_sea:['checkpoint-ferry.jpg','boat.jpg'], cp_cruise:['checkpoint-cruise.jpg','jetty_sunset.jpg'], cp_land:['checkpoint-land.jpg','bus.jpg'],
  m_cover:['merchant-tamu.jpg','market2.jpg'], m_owner:['merchant-aminah.jpg','crafts.jpg'],
  pr_basket:['product-woven-basket.jpg','crafts.jpg'], pr_kuih:['product-kuih-box.jpg','market1.jpg'], pr_cincin:['product-kuih-cincin.jpg','market1.jpg'], pr_dastar:['product-dastar.jpg','crafts.jpg'],
  pr_mat:['product-woven-mat.jpg','crafts.jpg'], pr_beads:['product-beaded-bracelet.jpg','crafts.jpg'], pr_hinava:['product-hinava.jpg','market1.jpg'], pr_tea:['product-sabah-tea.jpg','kundasang2.jpg'],
  cat_food:['category-food.jpg','seafood.jpg'], cat_tour:['category-tours.jpg','islands.jpg'], cat_stay:['category-stays.jpg','villas.jpg'], cat_trans:['category-transport.jpg','boat.jpg'], cat_retail:['category-crafts.jpg','crafts.jpg'],
  bella:['bella-ai.png','stella.jpg'],
};
const bg = k => { const v=IMGS[k]; return v ? `url('${IMG_BASE}console/${v[0]}'), url('${IMG_BASE}${v[1]}')` : 'none'; };

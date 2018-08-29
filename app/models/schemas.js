const connection = require('./sequelize').connection;
const Sequelize = require('./sequelize').Sequelize;
const randstr = require('randomstring');
const utils = require('../utils/helpers');

let Post = connection.define('posts', {
  user_id: {type: Sequelize.INTEGER, defaultValue: 0},
  cover: {type: Sequelize.TEXT, defaultValue: ''},
  title: {type: Sequelize.TEXT, defaultValue: ''},
  preview: {type: Sequelize.TEXT, defaultValue: ''},
  text: {type: Sequelize.TEXT, defaultValue: ''},
  publish: {type: Sequelize.BOOLEAN, defaultValue: false},
  published_at: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
  expires_at: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
}, {
  underscored: true
});

let PostComment = connection.define('posts_comments', {
  post_id: {type: Sequelize.INTEGER, defaultValue: 0},
  user_id: {type: Sequelize.INTEGER, defaultValue: 0},
  user_name: {type: Sequelize.STRING(64), defaultValue: ''},
  user_avatar: {type: Sequelize.TEXT, defaultValue: ''},
  text: {type: Sequelize.TEXT, defaultValue: ''},
  publish: {type: Sequelize.BOOLEAN, defaultValue: 1},
}, {
  underscored: true
});

let ChatMessage = connection.define('chat_messages', {
  user_name: {type: Sequelize.STRING(64), defaultValue: ''},
  user_avatar: {type: Sequelize.TEXT, defaultValue: ''},
  user_id: {type: Sequelize.INTEGER, defaultValue: 0},
  room: {type: Sequelize.STRING, defaultValue: ''},
  text: {type: Sequelize.TEXT, defaultValue: ''},
  seen: {type: Sequelize.BOOLEAN, defaultValue: false},
}, {
  underscored: true
});

let Menu = connection.define('menu', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
  link: {type: Sequelize.STRING(64), defaultValue:''},
  icon: {type: Sequelize.STRING(64), defaultValue:null},
  nested_in: {type: Sequelize.INTEGER, defaultValue:0},
  display: {type: Sequelize.BOOLEAN, defaultValue:true},
  display_id: {type: Sequelize.INTEGER, defaultValue:0},
}, {
  underscored: true
});

let User = connection.define('user', {
  login: {type: Sequelize.STRING(64), defaultValue: '', unique: true},
  email: {type: Sequelize.STRING(64), defaultValue: ''},
  password: {type: Sequelize.STRING(64), defaultValue: ''},
  avatar: {type: Sequelize.STRING(255), defaultValue: ''},
  first_name: {type: Sequelize.STRING(64), defaultValue: ''},
  last_name: {type: Sequelize.STRING(64), defaultValue: ''},
  nick_name: {type: Sequelize.STRING(64), defaultValue: ''},
  birth_date: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
  language: {type: Sequelize.INTEGER, defaultValue: 1},
  country: {type: Sequelize.STRING(64), defaultValue: ''},
  city: {type: Sequelize.INTEGER, defaultValue: 0},
  zip: {type: Sequelize.INTEGER, defaultValue: 0},
  phone: {type: Sequelize.STRING(64), defaultValue: ''},
  skype: {type: Sequelize.STRING(64), defaultValue: ''},
  discord: {type: Sequelize.STRING(64), defaultValue: ''},
  vkontakte: {type: Sequelize.STRING(64), defaultValue: 'vkontakte.com'},
  facebook: {type: Sequelize.STRING(64), defaultValue: 'facebook.com'},
  instagram: {type: Sequelize.STRING(64), defaultValue: 'instagram.com'},
  youtube: {type: Sequelize.STRING(64), defaultValue: 'youtube.com'},
  twitter: {type: Sequelize.STRING(64), defaultValue: 'twitter.com'},
  dotabuff: {type: Sequelize.STRING(64), defaultValue: 'dotabuff.com'},
  is_approved: {type: Sequelize.BOOLEAN, defaultValue: false},
  is_blocked: {type: Sequelize.BOOLEAN, defaultValue: false},
  is_subscribed: {type: Sequelize.BOOLEAN, defaultValue: false},
  is_configured: {type: Sequelize.BOOLEAN, defaultValue: false},
  deposit: {type: Sequelize.DOUBLE, defaultValue: 0},
  rating: {type: Sequelize.DOUBLE, defaultValue: 0},
  rating_id: {type: Sequelize.INTEGER, defaultValue: 1},
  currency_id: {type: Sequelize.INTEGER(2), defaultValue:1},
  type: {type: Sequelize.INTEGER, defaultValue: 3},
  permissions: {
    type: Sequelize.TEXT, 
    defaultValue: '',           
    get() { return JSON.parse(this.getDataValue('permissions')) },
    set(v) { return this.setDataValue('permissions', JSON.stringify(v)) },
  },
  order_permissions: {
    type: Sequelize.TEXT, 
    defaultValue: '',           
    get() { return JSON.parse(this.getDataValue('order_permissions')) },
    set(v) { return this.setDataValue('order_permissions', JSON.stringify(v)) },
  },
  heroes: {type: Sequelize.TEXT, defaultValue: ''},
  lanes: {type: Sequelize.TEXT, defaultValue: ''},
  mmr_solo: {type: Sequelize.INTEGER, defaultValue: 0},
  mmr_party: {type: Sequelize.INTEGER, defaultValue: 0},
  recovery_hash: {type: Sequelize.STRING(24), defaultValue: null},

}, {
  underscored: true
});

let UserType = connection.define('users_type', {
  name: {type: Sequelize.STRING(64), defaultValue: ''},
  permissions: {
    type: Sequelize.TEXT, 
    defaultValue: '',           
    get() { return JSON.parse(this.getDataValue('permissions')) },
    set(v) { return this.setDataValue('permissions', JSON.stringify(v)) },
  },
  order_permissions: {
    type: Sequelize.TEXT, 
    defaultValue: '',           
    get() { return JSON.parse(this.getDataValue('order_permissions')) },
    set(v) { return this.setDataValue('order_permissions', JSON.stringify(v)) },
  },
}, {
  underscored: true
});

let UserBonusPenalty = connection.define('users_bonuses_and_penalties', {
  type: {type: Sequelize.INTEGER, defaultValue:1},
  name: {type: Sequelize.TEXT, defaultValue:''},
  description: {type: Sequelize.TEXT, defaultValue:''},
  amount: {type: Sequelize.TEXT, defaultValue:''},
}, {
  underscored: true
});

let Contact = connection.define('contacts', {
  name: {type: Sequelize.TEXT, defaultValue:''},
  description: {type: Sequelize.TEXT, defaultValue:''},
  contact: {type: Sequelize.STRING(255), defaultValue:''},
}, {
  underscored: true
});

let BoosterReview = connection.define('users_reviews', {
  order_id: {type: Sequelize.INTEGER, defaultValue:0},
  user_id: {type: Sequelize.INTEGER, defaultValue:0},
  client_id: {type: Sequelize.INTEGER, defaultValue:0},
  comment: {type: Sequelize.TEXT, defaultValue:''},
  mark: {type: Sequelize.INTEGER, defaultValue:0},
}, {
  underscored: true
});

let BoosterPriceCategory = connection.define('users_pricelists_categories', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
  from: {type: Sequelize.DOUBLE, defaultValue:0},
  till: {type: Sequelize.DOUBLE, defaultValue:0},
  factor: {type: Sequelize.DOUBLE, defaultValue:0},
}, {
  underscored: true
});

let BoosterPricelistMedal = connection.define('users_pricelists_medal', {
  title: {type: Sequelize.STRING(64), defaultValue:''},
  rank: {type: Sequelize.INTEGER, defaultValue:0},
  image: {type: Sequelize.STRING(255), defaultValue:null},
  rub: {type: Sequelize.DOUBLE, defaultValue:0},
  usd: {type: Sequelize.DOUBLE, defaultValue:0},
}, {
  underscored: true
});

let BoosterPricelistBoosting = connection.define('users_pricelists_boosting', {
  from: {type: Sequelize.INTEGER, defaultValue:0},
  till: {type: Sequelize.INTEGER, defaultValue:0},
  volume: {type: Sequelize.INTEGER, defaultValue:0},
  rub: {type: Sequelize.DOUBLE, defaultValue:0},
  usd: {type: Sequelize.DOUBLE, defaultValue:0},
}, {
  underscored: true
});

let SupportTicket = connection.define('tickets', {
  user_id: {type: Sequelize.INTEGER, defaultValue:0},
  order_id: {type: Sequelize.INTEGER, defaultValue:0},
  tx_id: {type: Sequelize.INTEGER, defaultValue:0},
  order_number: {type: Sequelize.STRING(64), defaultValue:''},
  tx_number: {type: Sequelize.STRING(64), defaultValue:''},
  theme: {type: Sequelize.STRING(255), defaultValue:''},
  description: {type: Sequelize.STRING(255), defaultValue:''},
  status: {type: Sequelize.INTEGER, defaultValue:1},
  type: {type: Sequelize.INTEGER, defaultValue:1},
  pinned: {type: Sequelize.BOOLEAN, defaultValue:false},
  considered_at: {type: Sequelize.DATE, defaultValue:null},
  system_number: {
    type: Sequelize.STRING(64),
    unique: true,
    set(id) { return this.setDataValue('system_number',  id + 's' + Math.round(Date.now() / 1000)) },
  },
}, {
  underscored: true
});

let SupportTicketType = connection.define('tickets_types', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
}, {
  underscored: true
});

let SupportTicketStatus = connection.define('tickets_statuses', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
}, {
  underscored: true
});

let LogAction = connection.define('logs_actions', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
  details: {type: Sequelize.STRING(255), defaultValue:''},
}, {
  underscored: true
});

let Log = connection.define('logs', {
  user_id: {type: Sequelize.INTEGER, defaultValue:0},
  order_id: {type: Sequelize.INTEGER, defaultValue:0},
  action_id: {type: Sequelize.INTEGER, defaultValue:0},
  message: {type: Sequelize.TEXT, defaultValue:''},
  additional: {type: Sequelize.TEXT, defaultValue:''},
}, {
  underscored: true
});

let Partner = connection.define('partners', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
  domain: {type: Sequelize.STRING(64), defaultValue:''},
}, {
  underscored: true
});

let OrderType = connection.define('orders_types', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
}, {
  underscored: true
});

let OrderStatus = connection.define('orders_statuses', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
  desc: {type: Sequelize.STRING(255), defaultValue:''},
}, {
  underscored: true
});

let OrderServer = connection.define('orders_servers', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
}, {
  underscored: true
});

let TrainingService = connection.define('orders_training_services', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
  title: {type: Sequelize.STRING(64), defaultValue:''},
}, {
  underscored: true
});

let OrderPriceCategory = connection.define('orders_ranking_categories', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
  from: {type: Sequelize.DOUBLE, defaultValue:0},
  till: {type: Sequelize.DOUBLE, defaultValue:0},
  factor: {type: Sequelize.DOUBLE, defaultValue:0},
}, {
  underscored: true
});

let OrderRankingSpeed = connection.define('orders_ranking_speeds', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
  from: {type: Sequelize.DOUBLE, defaultValue:0},
  till: {type: Sequelize.DOUBLE, defaultValue:0},
  ratio: {type: Sequelize.DOUBLE, defaultValue:0},
}, {
  underscored: true
});

let OrderRankingWinrate = connection.define('orders_ranking_winrates', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
  from: {type: Sequelize.DOUBLE, defaultValue:0},
  till: {type: Sequelize.DOUBLE, defaultValue:0},
  ratio: {type: Sequelize.DOUBLE, defaultValue:0},
}, {
  underscored: true
});

let OrderRankingMark = connection.define('orders_ranking_marks', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
  mark: {type: Sequelize.DOUBLE, defaultValue:0},
  ratio: {type: Sequelize.DOUBLE, defaultValue:0},
}, {
  underscored: true
});

let OrderReport = connection.define('orders_reports', {
  order_id: {type: Sequelize.INTEGER, defaultValue:0},
  user_id: {type: Sequelize.INTEGER, defaultValue:0},
  comment: {type: Sequelize.TEXT, defaultValue:''},
  mmr: {type: Sequelize.INTEGER, defaultValue:0},
  mmr_diff: {type: Sequelize.INTEGER, defaultValue:0},
  games: {type: Sequelize.INTEGER, defaultValue:0},
  hours: {type: Sequelize.INTEGER, defaultValue:0},
  medal: {type: Sequelize.INTEGER, defaultValue:0},
  result: {type: Sequelize.STRING(24), defaultValue:''},
  finisher: {type: Sequelize.BOOLEAN, defaultValue:false},
  canceled: {type: Sequelize.BOOLEAN, defaultValue:false},
}, {
  underscored: true
});

let OrderReportScreenshot = connection.define('orders_reports_screenshots', {
  report_id: {type: Sequelize.INTEGER, defaultValue:0},
  filename: {type: Sequelize.STRING(64), defaultValue:''},
}, {
  underscored: true
});

let OrderHistory = connection.define('orders_histories', {
  order_id: {type: Sequelize.INTEGER, defaultValue:0},
  worker_id: {type: Sequelize.INTEGER, defaultValue:0},
  action: {type: Sequelize.INTEGER, defaultValue:0},
  note: {type: Sequelize.STRING(64), defaultValue:''},
  rank: {type: Sequelize.DOUBLE, defaultValue:0},
  worker_rank: {type: Sequelize.DOUBLE, defaultValue:0},
  salary: {type: Sequelize.DOUBLE, defaultValue:0},
  finisher: {type: Sequelize.BOOLEAN, defaultValue:false},
}, {
  underscored: true
});

let OrderReminder = connection.define('orders_reminders', {
  order_id: {type: Sequelize.INTEGER, defaultValue:0},
  user_id: {type: Sequelize.INTEGER, defaultValue:0},
  type: {type: Sequelize.INTEGER, defaultValue:1},
  title: {type: Sequelize.STRING(64), defaultValue:''},
  note: {type: Sequelize.STRING(64), defaultValue:''},
  dismissable: {type: Sequelize.BOOLEAN, defaultValue:true},
  expires_at: {type: Sequelize.DATE, defaultValue:Sequelize.NOW},
}, {
  underscored: true
});

let OrderReminderType = connection.define('orders_reminders_types', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
}, {
  underscored: true
});

let OrderCalibrationType = connection.define('orders_calibration_types', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
}, {
  underscored: true
});

let Order = connection.define('orders', {
  type: {type: Sequelize.INTEGER, defaultValue:0},
  partner_id: {type: Sequelize.INTEGER, defaultValue:0},
  system_number: {type: Sequelize.STRING(64), defaultValue:''},
  client_id: {type: Sequelize.INTEGER, defaultValue:0},
  client_comment: {type: Sequelize.TEXT, defaultValue: ''},
  worker_id: {type: Sequelize.INTEGER, defaultValue:0},
  worker_status: {type: Sequelize.BOOLEAN, defaultValue:false},
  dotabuff: {type: Sequelize.STRING(64), defaultValue:''},
  account_login: {type: Sequelize.STRING(255), defaultValue:''},
  account_pass: {type: Sequelize.STRING(255), defaultValue:''},
  promocode: {type: Sequelize.INTEGER, defaultValue:0},
  quality: {type: Sequelize.INTEGER, defaultValue:0},
  servers: {
    type: Sequelize.TEXT, 
    defaultValue: null,           
    get() { try { return JSON.parse(this.getDataValue('servers')) } catch(e) { return [] } },
    set(v) { return v ? this.setDataValue('servers', JSON.stringify(v)) : this.setDataValue('servers', null) },
  },
  lanes: {
    type: Sequelize.TEXT, 
    defaultValue: null,           
    get() { try { return JSON.parse(this.getDataValue('lanes')) } catch(e) { return [] } },
    set(v) { return v ? this.setDataValue('lanes', JSON.stringify(v)) : this.setDataValue('lanes', null) },
  },
  heroes: {
    type: Sequelize.TEXT, 
    defaultValue: null,           
    get() { try { return JSON.parse(this.getDataValue('heroes')) } catch(e) { return [] } },
    set(v) { return v ? this.setDataValue('heroes', JSON.stringify(v)) : this.setDataValue('heroes', null) },
  },
  heroes_ban: {
    type: Sequelize.TEXT, 
    defaultValue: null,           
    get() { try { return JSON.parse(this.getDataValue('heroes_ban')) } catch(e) { return [] } },
    set(v) { return v ? this.setDataValue('heroes_ban', JSON.stringify(v)) : this.setDataValue('heroes_ban', null) },
  },
  cali_type: {type: Sequelize.INTEGER, defaultValue:1},
  cali_games_done: {type: Sequelize.INTEGER, defaultValue:0},
  cali_games_total: {type: Sequelize.INTEGER, defaultValue:10},
  mmr_start: {type: Sequelize.INTEGER, defaultValue:0},
  mmr_finish: {type: Sequelize.INTEGER, defaultValue:0},
  mmr_boosted: {type: Sequelize.INTEGER, defaultValue:0},
  medal_start: {type: Sequelize.INTEGER, defaultValue:1},
  medal_finish: {type: Sequelize.INTEGER, defaultValue:1},
  medal_current: {type: Sequelize.INTEGER, defaultValue:1},
  training_time_from: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
  training_time_till: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
  training_hours: {type: Sequelize.INTEGER, defaultValue:0},
  training_hours_done: {type: Sequelize.INTEGER, defaultValue:0},
  training_services: {
    type: Sequelize.TEXT, 
    defaultValue: null,           
    get() { try { return JSON.parse(this.getDataValue('training_services')) } catch(e) { return [] } },
    set(v) { return v ? this.setDataValue('training_services', JSON.stringify(v)) : this.setDataValue('training_services', null) },
  },
  training_worker_id: {type: Sequelize.INTEGER, defaultValue:0},
  status: {type: Sequelize.INTEGER, defaultValue:0},
  currency_id: {type: Sequelize.INTEGER, defaultValue:1},
  amount: {type: Sequelize.DOUBLE, defaultValue:0.00},
  amount_paid: {type: Sequelize.DOUBLE, defaultValue:0.00},
  salary_rub: {type: Sequelize.DOUBLE, defaultValue:0.00},
  salary_usd: {type: Sequelize.DOUBLE, defaultValue:0.00},
  urgency_hours: {type: Sequelize.INTEGER, defaultValue:0},
  deadline: {type: Sequelize.DATE, defaultValue:null}
}, {
  underscored: true
});

let Lane = connection.define('lanes', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
}, {
  underscored: true
});

let Country = connection.define('countries', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
  alpha2: {type: Sequelize.STRING(64), defaultValue:''},
  alpha3: {type: Sequelize.STRING(64), defaultValue:''},
  region: {type: Sequelize.STRING(64), defaultValue:''},
}, {
  underscored: true
});

let PayMethod = connection.define('users_pay_methods', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
}, {
  underscored: true
});

let PayProp = connection.define('users_pay_props', {
  prop: {type: Sequelize.STRING(64), defaultValue:''},
  method_id: {type: Sequelize.INTEGER, defaultValue:0},
  country: {type: Sequelize.STRING(64), defaultValue:''},
  user_id: {type: Sequelize.INTEGER, defaultValue:0},
  default: {type: Sequelize.BOOLEAN, defaultValue:false},
}, {
  underscored: true
});

let PayoutRequest = connection.define('users_payout_requests', {
  user_id: {type: Sequelize.INTEGER, defaultValue:0},
  amount: {type: Sequelize.DOUBLE, defaultValue:0},
  currency: {type: Sequelize.STRING(8), defaultValue:''},
  method_id: {type: Sequelize.STRING(64), defaultValue:''},
  prop: {type: Sequelize.STRING(64), defaultValue:0},
  country: {type: Sequelize.STRING(64), defaultValue:''},
  comment: {type: Sequelize.STRING(255), defaultValue:''},
  status: {type: Sequelize.INTEGER, defaultValue:1},
  tx_id: {type: Sequelize.INTEGER, defaultValue:0},
}, {
  underscored: true
});

let PayoutRequestStatus = connection.define('users_payout_requests_statuses', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
}, {
  underscored: true
});

let Hero = connection.define('heroes', {
  name: {type: Sequelize.STRING(64), defaultValue:''},
  localized_name: {type: Sequelize.STRING(64), defaultValue:''},
  img_vr: {type: Sequelize.STRING(64), defaultValue: ''},
  img_lg: {type: Sequelize.STRING(64), defaultValue: ''},
  img_md: {type: Sequelize.STRING(64), defaultValue: ''},
  img_sm: {type: Sequelize.STRING(64), defaultValue: ''},
}, {
  underscored: true
});

let Currency = connection.define('currencies', {
  name: {type: Sequelize.STRING(11), defaultValue:null},
  sign: {type: Sequelize.STRING(11), defaultValue:null},
  rate: {type: Sequelize.DOUBLE, defaultValue:1},
  used: {type: Sequelize.BOOLEAN, defaultValue:false},
}, {
  underscored: true
});

let Tx = connection.define('txs', {
  system_number: {type: Sequelize.TEXT, 
    set(v) {
      let hex = String(String(v) + '.' + randstr.generate(2) + '.' + String(Math.round(Date.now()/1000))).hexval(false);
      this.setDataValue('system_number', hex);
    }
  },
  type: {type: Sequelize.INTEGER(2), defaultValue:1},
  amount: {type: Sequelize.DOUBLE(19,4), defaultValue:0},
  user_id: {type: Sequelize.INTEGER(11), defaultValue:0},
  currency_id: {type: Sequelize.INTEGER(2), defaultValue:1},
  status: {type: Sequelize.INTEGER(2), defaultValue:1},
  comment: {type: Sequelize.STRING(255), defaultValue:''},
}, {
  underscored: true
});

let TxType = connection.define('txs_types', {
  name: {type: Sequelize.STRING(11), defaultValue:null},
}, {
  underscored: true
});

let TxStatus = connection.define('txs_statuses', {
  name: {type: Sequelize.STRING(11), defaultValue:null},
}, {
  underscored: true
});

let Translate = connection.define('translate', {
  name: {type: Sequelize.TEXT, defaultValue:''},
  us: {type: Sequelize.TEXT, defaultValue:''},
  ru: {type: Sequelize.TEXT, defaultValue:''},
}, {
  underscored: true
});

module.exports = { 
  Menu,
  UserType, 
  User, 
  UserBonusPenalty,
  Partner, 
  Contact,
  BoosterReview,
  BoosterPriceCategory,
  BoosterPricelistBoosting,
  BoosterPricelistMedal,
  Post,
  PostComment,
  Order, 
  OrderCalibrationType,
  OrderType, 
  OrderStatus, 
  OrderServer, 
  OrderHistory,
  OrderRankingSpeed,
  OrderRankingWinrate,
  OrderRankingMark,
  OrderPriceCategory,
  OrderReminder,
  OrderReminderType,
  OrderReport,
  OrderReportScreenshot,
  Hero, 
  Lane, 
  Country, 
  PayMethod, 
  PayProp, 
  PayoutRequest,
  PayoutRequestStatus,
  TrainingService,
  ChatMessage,
  LogAction,
  Log,
  SupportTicket,
  SupportTicketStatus,
  SupportTicketType,
  Currency,
  Tx,
  TxType,
  TxStatus,
  Translate,
};
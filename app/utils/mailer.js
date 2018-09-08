const nodemailer = require('nodemailer');
const moment = require('moment');

function mailer(template) {
  this.transport = nodemailer.createTransport({
    host: 'smtp.ukr.net',
    port: 465,
    secure: true,
    auth: {
      user: 'voodoosavage@ukr.net',
      pass: '199024VadzoJuniore',
    }
  });
  this.tempvars = {
    logo : 'http://megakovka.com.ua/logo.png',
    oklogo : 'http://megakovka.com.ua/img/okok.gif',
    date : moment().format("DD.MM.YYYY hh:mm"),
    title1 : 'Спасибо за доверие',
  };
  this.template = template;
  if(!this.template.length) throw new Error(`Mailer >>> i wouldn\'t send an empty message`);
  return this.template;
};

mailer.prototype.isEmail = function(mixed) {
    let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(mixed);
};


mailer.prototype.transform = function(tempvars) {
  this.tempvars = tempvars;
  for(var key in this.tempvars) {
    var content = this.tempvars[key];
    this.template = this.template.replace("${"+key+"}", content);
  };
  return this;
};

mailer.prototype.send =  function(receiver, subject, text) {
  this.receiver = receiver;
  if(!this.isEmail(this.receiver)) throw new Error(`Mailer >>> receiver should be an valid email, got ${this.receiver}`);
  this.transport.sendMail({
      from: 'voodoosavage@ukr.net',
      to: this.receiver,
      subject: subject,
      text: text,
      html: this.template
  }, (error, info) => {
      if (error) return console.log(error);
      res.send(info);
  });
};

var Mailer = function(template) {
  return new mailer(template);
}

module.exports = Mailer;

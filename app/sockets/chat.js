const Models = require('../models/schemas');
const connection = require('../models/sequelize');
const Utils = require('../utils/helpers');
const controllers = {};
controllers.news = require('../controllers/controller.news')(connection);
controllers.users = require('../controllers/controller.users')(connection);
const async = require('async');
var countdowns = {};

module.exports.use = (app) => {
  var server = require('http').createServer(app);
  var io = require('socket.io')(server);
  var online = 0;

  io.touser = (user_id) => {
    var socket = null;
    for(let sock in io.sockets.connected) {
      if(io.sockets.connected[sock].user_id == user_id) socket = io.sockets.connected[sock];
    }
    var emit = (a, b) => {
      return socket ? socket.emit(a, b) : null;
    }
    var notin = (room) => {
      if(socket && socket.rooms.hasOwnProperty(room)) socket = null; 
      return { emit: emit };
    };
    return { notin: notin, emit: emit };
  };

  io.on('connection', (socket) => {
    var addedUser = false;

    socket.on('user connected', (data) => {
      let token = data.t;
      if(!data.t) return socket.emit('property failure');
      let user = Utils.jwtVerify(data.t);
      if(!user) socket.emit('property failure');
    });

    socket.on('user connected', (data) => {
      if(!data.t) return null;
      let user = Utils.jwtVerify(data.t);
      if(!user) return null;
      if(user.type == 2) socket.join('supports');
      if(user.type == 3) socket.join('boosters');
      socket.nick_name = user.nick_name;
      socket.user_id = user.id;
      setInterval(() => {
        if(!Utils.jwtVerify(data.t)) socket.emit('property failure');
      }, 5000);
    });

    socket.on('join room', (data) => {
      if(!data.room || !data.nick_name) return;
      socket.nick_name = data.nick_name;
      socket.leave(data.room);
      socket.join(data.room);
      io.to(data.room).emit('room joined', data);
      connection.execute(`
        select cm.text, cm.created_at, cm.user_name, cm.user_avatar, cm.user_id
        from chat_messages as cm
        where cm.room = ? order by id limit 100`, {replacements:[data.room], raw: true})
      .then(results => {
        let messages = results.map(e => new Object({
            user: { id: e.user_id, avatar: e.user_avatar, name: e.user_name },
            date: e.created_at,
            text: e.text,
        }));
        socket.emit('room messages', messages);
      })
      .catch(console.log);
    });

    socket.on('leave room', (data) => {
      if(!data.room) return;
      socket.leave(data.room, function(r, e) {
      });
    }); 

    socket.on('room message', (data) => {
      if(!data.text || !data.text.length) return null;
      Models.ChatMessage.create({
        user_id: data.user.id,
        user_name: data.user.name,
        user_avatar: data.user.avatar,
        room: data.room,
        text: data.text,
      }).then(message => {
        io.to(data.room).emit('room message', data);
      }).catch(console.log);
    });

    socket.on('order message', (data) => {
      if(!data.text || !data.text.length || !data.room) return null;
      Models.Order.findOne({where:{system_number:data.room}})
      .then(order => {
        Models.ChatMessage.create({
          user_id: data.user.id,
          user_name: data.user.name,
          user_avatar: data.user.avatar,
          order_id: order.id,
          room: data.room,
          text: data.text,
        }).then(message => {
          io.to(data.room).emit('order message', data);
          io.touser(order.worker_id).notin(data.room).emit('order message', data);
        }).catch(console.log);
      }).catch(console.log);
    });

    socket.on('user notifications', (data) => {
      if(!data.t) return;
      let user = Utils.jwtVerify(data.t);
      if(user) {
        controllers.news.getPosts().then(posts => {
          socket.emit('notification news', posts);
        }).catch(console.log);

        controllers.users.getAlerts(user.id).then(reminders => {
          socket.emit('notification reminders', reminders);
        }).catch(console.log);

        connection.execute(`
          select m.* from 
            (select cm.id, cm.text, cm.created_at, cm.user_name as author, cm.user_avatar as avatar,
            if(t.id, 'support', 'order') as type,
            if(t.id, t.system_number, o.system_number) as system_number
            from chat_messages cm
            left join orders o on o.system_number = cm.room and (o.worker_id = ${user.id} or o.client_id = ${user.id})
            left join tickets t on t.system_number = cm.room and t.user_id = ${user.id}
            where cm.user_id <> ${user.id} and seen = 0
            having system_number is not null
            order by cm.id desc limit 100) as m
          group by m.system_number
          order by m.created_at desc`, 
          {raw: true})
        .then(messages => {
          socket.emit('notification messages', messages);
        })
        .catch(console.log);
      }
    });   

    socket.on('start typing', () => {
      socket.broadcast.emit('typing', { nick_name: socket.nick_name });
    });

    socket.on('stop typing', () => {
      socket.broadcast.emit('stop typing', { nick_name: socket.nick_name });
    });

    socket.on('order countdown get', (data) => {
      let order_number = data.order_number;
      if(!order_number) return null;
      if(countdowns[order_number] && countdowns[order_number]['timer']) {
        io.to(data.order_number).emit('order countdown set', countdowns[order_number]['timer']);
      } else {
        Models.Order.findOne({where:{system_number:order_number}, raw: true}).then(order => {
          if(!order) return null;
          let distance = (order.training_hours - order.training_hours_done) * 60 * 60 * 1000;
          let timer = getTimeLeftObject(distance);
          io.to(order.system_number).emit('order countdown set', timer);
        }).catch(e => null);
      }
    });

    socket.on('order countdown start', (data) => {
      let order_number = data.order_number;
      if(!order_number) return null;

      if(countdowns[order_number] && countdowns[order_number]['pause']) {
        countdowns[order_number]['pause'] = false;
        io.to(data.order_number).emit('order countdown start', countdowns[order_number]['timer']);
        return null;
      } else {
        Models.Order.findOne({where:{system_number:order_number}}).then(order => {
          if(!order) return null;
            let distance = (order.training_hours - order.training_hours_done) * 60 * 60 * 1000;
            countdowns[order_number] = [];
            countdowns[order_number]['pause'] = false;
            countdowns[order_number]['interval'] = setInterval(function() {
              if(!countdowns[order_number]['pause']) {
                distance -= 1000;
                countdowns[order_number]['distance'] = distance;
                countdowns[order_number]['timer'] = getTimeLeftObject(distance);
                io.to(order.system_number).emit('order countdown', countdowns[order_number]['timer']);
              }
              if(distance < 0) orderTimerStop(order_number);
            }, 1000);  
        }).catch(e => null);
      }
    });
    
    socket.on('order countdown pause', (data) => {
      let order_number = data.order_number;
      if(!order_number || !countdowns[order_number]) return null;
      countdowns[order_number]['pause'] = true;
      io.to(data.order_number).emit('order countdown pause', countdowns[order_number]['timer']);
    });

    socket.on('order countdown stop', (data) => {
      let order_number = data.order_number;
      if(!order_number || !countdowns[order_number]) return null;
      orderTimerStop(order_number);
    });

    socket.on('disconnect', () => {
      if (addedUser) {
        --online;
        socket.broadcast.emit('user left', { nick_name: socket.nick_name, online: online});
      }
    });
  });

  server.listen(4001);

  function getTimeLeftObject(distance) {
    let timer = {};
    timer.h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    timer.m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    timer.s = Math.floor((distance % (1000 * 60)) / 1000);
    timer.h = ("00" + timer.h).substr(-2);
    timer.m = ("00" + timer.m).substr(-2);
    timer.s = ("00" + timer.s).substr(-2);
    return timer;
  }

  function orderTimerStop(order_number) {
    if(!order_number || !countdowns[order_number]) return null;
    let distance = countdowns[order_number]['distance'];
    Models.Order.findOne({where:{system_number:order_number}}).then(order => {
      if(!order) return null;
      let hoursLeft = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let hoursUsed = order.training_hours - hoursLeft;
      let timer =  getTimeLeftObject(hoursLeft * 60 * 60 * 1000);
      order.update({training_hours_done: hoursUsed}).then(res => {
        clearInterval(countdowns[order_number]['interval']);
        delete countdowns[order_number];
        io.to(order_number).emit('order countdown stop', timer);
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }
}

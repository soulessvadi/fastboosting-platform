const Models = require('../models/schemas');
const provider = require('../models/provider');
const utils = require('../utils/helpers');
const storage = require('../utils/storage');
const async = require('async');
const connection = require('../models/sequelize');
const moment = require('moment');

module.exports = (db) => {

	const controller = {};

	controller.publish = (req, res, next) => {
		if(req.params.id) {
			Models.Post.findById(req.params.id).then((post) => {
				post.update({ publish: !!req.body.publish }).then(() => {
		    		res.status(200).json({ publish: req.body.publish });
				}).catch((err) => res.status(202).json({'error':'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'post_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.remove = (req, res, next) => {
		if(req.params.id) {
			Models.Post.findById(req.params.id).then((post) => {
				post.destroy().then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error': 'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'post_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.create = (req, res, next) => {
		let user_id = req.app.user.id;
		let post = Models.Post.build();
		post.user_id = (req.body.user_id || user_id);
		post.title = (req.body.title || post.title);
		post.text = req.body.text || post.text;
		post.preview = req.body.preview || post.preview;
		post.tags = req.body.tags || post.tags;
		post.video = req.body.video || post.video;
		post.expires_at = req.body.expires_at || post.expires_at;
		post.published_at = req.body.published_at || post.published_at;
		if(typeof req.file != typeof undefined) {
			post.cover = req.file.filename;
			utils.image(storage.spaces.shared + post.cover).resize(900, 600);
		}
		post.save().then(() => {
    		res.status(200).json({id: post.id});
		}).catch((err) => res.status(202).json({'error': 'internal_error'}));
	};

	controller.update = (req, res, next) => {
		if(req.params.id) {
			Models.Post.findById(req.body.id).then((post) => {
				post.user_id = (req.body.user_id || post.user_id);
				post.title = (req.body.title || post.title);
				post.text = req.body.text || post.text;
				post.preview = req.body.preview || post.preview;
				post.tags = req.body.tags || post.tags;
				post.video = req.body.video || post.video;
				post.expires_at = req.body.expires_at || post.expires_at;
				post.published_at = req.body.published_at || post.published_at;
				if(typeof req.file != typeof undefined) {
					post.cover = req.file.filename;
					utils.image(storage.spaces.shared + post.cover).resize(900, 600);
				}
				post.save().then(() => {
		    		res.status(200).json({'status':'ok'});
				}).catch((err) => res.status(202).json({'error': 'internal_error'}));
			}).catch((err) => res.status(202).json({'error':'post_not_found'}));
		} else {
			res.status(202).json({'error':'bad_parameters'});
		}
	};

	controller.newComment = (req, res, next) => {
		req.body.message = req.body.message.replace(/<[^>]+>/g, '') || '';
		req.body.id = parseInt(req.body.id) || false;
		if(!req.body.id || req.body.message.length < 5) {
			return res.status(500).json('bad_parameters');
		}

		let entity = {
			post_id: req.body.id,
			text: req.body.message.replace(/@\[(.*?)]*?\]/g, "<i>$1</i>"),
			user_id: req.app.user.id,
			user_name: req.app.user.nick_name,
			user_avatar: req.app.user.avatar,
		};

      	Models.PostComment.create(entity).then((message) => {
			res.status(200).json({
				text: message.text,
				created_at: message.created_at,
				author: message.user_name,
				avatar: message.user_avatar,
			});
		}).catch((err) => {
			res.status(500).json('internal_error');
		});
	};	

	controller.post = (req, res, next) => {
      	let post_id = req.params.id;
		connection.executeOne(`
			select posts.id, posts.title, posts.preview, posts.tags, posts.text, posts.video, posts.user_id, posts.publish, posts.cover, posts.published_at, posts.expires_at,
			u.nick_name as author, u.id as author_id, (select count(id) from posts_comments where post_id = posts.id limit 1) as comments
			from posts left join users u on u.id = posts.user_id
			where posts.id = ${post_id} limit 1`, { raw: true })
		.then((post) => {
			if(!post) return res.status(202).json({'error':'post_not_found'});
			(async function() {
				try {
					post.comments = await connection.execute(`
						select pc.text, pc.created_at,
						(select nick_name from users where id = pc.user_id limit 1) as author, 
						(select avatar from users where id = pc.user_id limit 1) as avatar 
						from posts_comments pc where pc.post_id = ${posts[x].id}
						and publish = 1 order by pc.created_at asc`, {raw: true}
					);
				} catch(err) { 
					post.comments = []; 
				}
				res.status(200).json({post: post});
			})();			            
		}).catch((err) => {
			res.status(202).json({'error':'internal_error'});
		});
	};		

	controller.all = (req, res, next) => {
      	let page = req.query.page || 1;
		let perpage = req.query.perpage || 3;
      	let limits = page * perpage - perpage + ', ' + perpage;
		let keyword = req.query.keyword && req.query.keyword !='null' && req.query.keyword.length ? req.query.keyword : 0;
		async.parallel({
			news: (cb) => {
		      	let conditions = '';
				if(keyword) conditions += ` and (posts.preview like '%${keyword}%' or posts.text like '%${keyword}%' or posts.tags like '%${keyword}%' or u.nick_name like '%${keyword}%')`;
				connection.execute(`
					select posts.id, posts.title, posts.preview, posts.text, posts.tags, posts.video, posts.user_id, posts.publish, posts.cover, posts.published_at, posts.expires_at,
					u.nick_name as author, u.id as author_id, (select count(id) from posts_comments where post_id = posts.id limit 1) as comments
					from posts left join users u on u.id = posts.user_id
					where 1 ${conditions} 
					order by id desc limit ${limits}`, { raw: true }).then((posts) => {
					connection.executeOne(`
						select count(posts.id) as total from posts
						left join users u on u.id = posts.user_id
						where 1 ${conditions} limit 1`, {raw: true})
					.then(count => {
			            let pages = Math.ceil(count.total/perpage);
			            let pagination = utils.paginate(page, perpage, pages, 3);
			            if(!posts.length) cb(null, {list: posts, pagination: pagination});
						(async function loopthrogh(x) {
							try {
								posts[x].comments = await connection.execute(`
									select pc.text, pc.created_at,
									(select nick_name from users where id = pc.user_id limit 1) as author, 
									(select avatar from users where id = pc.user_id limit 1) as avatar 
									from posts_comments pc where pc.post_id = ${posts[x].id}
									and publish = 1 order by pc.created_at asc`, {raw: true}
								);
							} catch(err) { posts[x].comments = []; }
							if(x > 0) loopthrogh(--x);
							else cb(null, {list: posts, pagination: pagination});
						})(posts.length - 1);			            
					});
				}).catch((err) => {
					console.log(err)
					cb(null, {list: [], pagination: []});
				});
			},
			tags: (cb) => {
				connection.executeOne(`select group_concat(distinct tags separator '|') as tags from posts where tags is not null and tags <> '' limit 1`,{raw: true})
				.then((results) => {
					let tags = results.tags.split("|").filter((value, index, self) => self.indexOf(value) === index);
					cb(null, tags);
				}).catch((err) => {
					cb(null, err);
				})
			},
			videos: (cb) => {
				connection.execute(`select distinct video, title from posts where video is not null and video <> ''`,{raw: true})
				.then((results) => {
					let videos = results.filter(e => e.video.length);
					cb(null, videos);
				}).catch((err) => {
					cb(null, err);
				})
			}
		}, (error, results) => {
    		res.status(200).json(results);
		});
	};	

	controller.getPosts = () => {
		return connection.execute(`
			select p.id, p.title, p.cover, p.preview, p.text, p.published_at, p.video,
			(select nick_name from users where id = p.user_id limit 1) as author
			from posts p  
			where p.expires_at > ?
			and p.publish = ?`, { replacements: [moment().format("YYYY-MM-DD HH:mm:ss"), 1], raw: true})
	};

	return controller;
};
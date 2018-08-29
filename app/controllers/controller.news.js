const Models = require('../models/schemas');
const provider = require('../models/provider');
const utils = require('../utils/helpers');
const async = require('async');
const connection = require('../models/sequelize');
const moment = require('moment');

module.exports = (db) => {

	const controller = {};

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

	controller.getPosts = () => {
		return connection.execute(`
			select p.id, p.title, p.cover, p.preview, p.text, p.published_at,
			(select nick_name from users where id = p.user_id limit 1) as author
			from posts p  
			where p.expires_at > ?
			and p.publish = ?`, { replacements: [moment().format("YYYY-MM-DD HH:mm:ss"), 1], raw: true})
	};

	return controller;
};
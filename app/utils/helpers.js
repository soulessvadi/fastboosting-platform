const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const keys = {
	private: fs.readFileSync(path.join(path.dirname(require.main.filename), 'auth_priv.pem')),
	public: fs.readFileSync(path.join(path.dirname(require.main.filename), 'auth_pub.pem')),
};

Date.prototype.addHours = function(hours) {
    let date = this;
    date.setHours( date.getHours() + hours );
    return date;
};

String.prototype.hexval = function(prefixed) {
	prefixed = prefixed || false;
	let r = [];
	for (let n = 0, l = this.length; n < l; n ++) {
		r.push(Number(this.charCodeAt(n)).toString(16));
	}
	return prefixed ? '0x' + r.join('') : r.join('');
}

if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

module.exports = {
	isEmail: function(mixed) {
	    let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    	return regex.test(mixed);
	},
	jwtSign: function(data, extended) {
		let expiresAt = Math.floor(Date.now() / 1000) + 86400;
		let payload = { data: data };
		if(!extended) payload.exp = expiresAt;
		let token = jwt.sign(payload, keys.private, { algorithm: 'RS256' });
		return token;
	},
	jwtVerify: function(token) {
		let results;
		try {
		  	let decoded = jwt.verify(token, keys.public, { algorithms: ['RS256'] });
		  	results = decoded.data;
		} catch(err) {
			results = false;
		}
		return results;
	},
	paginator: function(pages, per_page, pages_display) {
		return {
			page: function( page ) {
				var pagi = pages.length > 1 ? pages.concat(pages).concat(pages) : pages;
					current = parseInt(page - 1) + pages.length,
					offset 	= Math.ceil((pages_display - 1) / 2),
					from 	= current - offset,
					till	= current + offset;
				return {
			        pages : pagi.slice(from, till + 1),
			        prev : pagi.slice(current - 1, current).pop() || current,
					next : pagi.slice(current + 1, current + 2).pop() || current,
			        current : parseInt(page),
			    };
			}
		};
	},
	paginate: function(page, per_page, pages_count, pages_display) {
		var pages_all = [];
		for(var x = 1; x <= pages_count; x++) pages_all.push(x);
		const paginate = this.paginator(pages_all, per_page, pages_display);
		return paginate.page(page);
	},

	datesRange: function(start, end) {
	    function addDays(date, days) {
	      let entity = new Date(date);
	      entity.setDate(entity.getDate() + days);
	      return entity;
	    }
	    let array = [];
	    start = new Date(start);
	    end = new Date(end);
	    while (start <= end) {
	        array.push(new Date(start));
	        start = addDays(start, 1);
	    }
	    return array;
	}
};
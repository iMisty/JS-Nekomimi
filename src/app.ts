/*
 * @Author: Miya
 * @Date: 2020-07-14 17:07:05
 * @LastEditors: Miya
 * @LastEditTime: 2020-07-30 10:05:12
 * @Description: 入口文件
 * @FilePath: \Single-Search-Server\src\app.ts
 */
import * as Koa from 'koa';
import * as jwt from 'koa-jwt';
import cors = require('koa2-cors');
import bodyParser = require('koa-bodyparser');
import mongoose = require('mongoose');
import router from './router/index';
// mongodb
const dbConfig = require('./config/db');
const app = new Koa();
// token
const SECRET = 'Kagura_Design';

app.use(bodyParser());
app.use(cors());
app.use(router());

// logger
app.use(async (ctx, next) => {
	const start: any = new Date();
	await next();
	const fin: any = new Date();
	const ms: number = fin - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// token
app.use(async (ctx, next) => {
	return next().catch((err) => {
		if (err.status === 401) {
			ctx.status = 401;
			ctx.body = {
				code: 401,
				msg: err.message,
			};
		} else {
			throw err;
		}
	});
});
app.use(
	jwt({ secret: SECRET }).unless({
		path: ['/admin/login', '/link'],
	})
);

app.listen(12450);

// mongodb
mongoose.connect(dbConfig.dbs, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

console.log('server running on port 12450');

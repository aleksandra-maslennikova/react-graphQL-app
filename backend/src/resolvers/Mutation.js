const bycript = require('bcryptjs');
const { randomBytes } = require('crypto');
const { promisify } = require('util'); // function that takes callback based functions and turns them into promise 
const { setUserToken } = require('../utils');

const Mutations = {
    async createItem(parent, args, ctx, info) {
        // TODO check if they are logged in
        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);
        return item;
    },

    updateItem(parent, args, ctx, info) {
        const updates = { ...args };
        delete updates.id;

        return ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
    },

    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id };
        const item = await ctx.db.query.item({ where }, `{id title}`);
        return ctx.db.mutation.deleteItem({ where }, info);
    },

    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();

        const password = await bycript.hash(args.password, 10);
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions: { set: ['USER'] }
            }
        }, info);

        setUserToken(user.id, ctx);
        return user;
    },

    async signin(parent, { email, password }, ctx, info) {
        const user = await ctx.db.query.user({ where: { email } });

        if (!user) {
            throw new Error(`No such user found for email ${email}`)
        }

        const validPassword = bycript.compare(password, user.password);

        if (!validPassword) {
            throw new Error('Invalid password')
        }
        setUserToken(user.id, ctx);

        return user;
    },

    signout(parent, args, ctx, info) {
        ctx.response.clearCookie('token');
        return { message: 'Goodbuy' }
    },

    async requestReset(parent, { email }, ctx, info) {

        // 1. Check if this is a real user
        const user = await ctx.db.query.user({ where: { email } });

        if (!user) {
            throw new Error(`No such user found for email ${email}`);
        }

        // 2. Set a reset token and expiry on that user
        const randomBytesPromiseified = promisify(randomBytes);
        const resetToken = (await randomBytesPromiseified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

        const res = await ctx.db.mutation.updateUser({
            where: email,
            data: { resetToken, resetTokenExpiry }
        });

        return { message: 'Thanks' };

        // 3. Email user with that token

    },

    async resetPassword(parent, { resetToken, password, confirmPassword }, ctx, info) {
        // 1. check if the passwords match
        if (password !== confirmPassword) {
            throw new Error("Passwords are not equal");
        }
        // 2. check if its a legit reset token
        // 3. check if its expired
        const [user] = await ctx.db.query.users({
            where: {
                resetToken,
                resetTokenExpiry_gte: Date.now() - 36000000
            }
        });

        if (!user) {
            throw new Error("Token is not valid or expired");
        }
        // 4. hash user's new password
        const newPassword = await bycript.hash(args.password, 10);
        // 5. save the new password to the user and remove old resetToken fields
        const updatedUser = await ctx.db.mutation.updateUser({
            where: {
                email: user.email,
                data: {
                    password: newPassword,
                    resetToken: null,
                    resetTokenExpiry: null
                }
            }
        }, info);

        setUserToken(updatedUser.id, ctx);
        return updatedUser
    }
};

module.exports = Mutations;

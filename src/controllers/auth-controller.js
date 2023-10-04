const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../validators/auth-validator');
const prisma = require('../models/prisma');
const createError = require('../utils/create-error');
const { use } = require('../routes/auth-route');

exports.register = async (req, res, next) => {
    try {
        const { value, error } = registerSchema.validate(req.body);

        if (error) {
            return next(error)
        }
        value.password = await bcrypt.hash(value.password, 12)

        const user = await prisma.user.create({
            data: value
        });

        const payload = { userId: user.id };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || '123qweryuioxcvb', {
            expiresIn: process.env.JWT_EXPIRE
        });

        delete user.password
        res.status(201).json({ accessToken, user })
        // console.log(value);

    } catch (err) {
        next(err)
    }
}

exports.login = async (req, res, next) => {
    try {

        const { value, error } = loginSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        // SELECT * FROM user WHERE email = emailOrMoblie OR mobile = emailOrMoblie
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: value.emailOrMobile }, { mobile: value.emailOrMobile },]
            }
        })

        if (!user) {
            return next(createError('invalid credential', 400))
        }

        const isMatch = await bcrypt.compare(value.password, user.password);
        if (!isMatch) {
            return next(createError('invalid credential', 400))
        }

        const payload = { userId: user.id };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || '123qweryuioxcvb', {
            expiresIn: process.env.JWT_EXPIRE
        });

        delete user.password;
        res.status(201).json({ accessToken, user })


    } catch (err) {
        console.log(err)
    }
}

exports.getMe = (req, res, next) => {
    res.status(200).json({ user: req.user })

}
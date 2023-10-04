const createError = require('../utils/create-error')
const { upload } = require('../utils/cloudinary-service')
const prisma = require('../models/prisma')

exports.updateProfile = async (req, res, next) => {
    try {
        // req.file .single
        // req.files .array .fields

        if (!req.files) {
            return next(createError('profile image or cover image is required'))
        }
        if (req.files.profileImage) {
            const url = await upload(req.files.profileImage[0].path);
            await prisma.user.update({
                data: {
                    profileImage: url
                },
                where: {
                    id: req.user.id
                }
            });
        }

        if (req.files.coverImage) {
            const url = await upload(req.files.coverImage[0].path);
            await prisma.user.update({
                data: {
                    profileImage: url
                },
                where: {
                    id: req.user.id
                }
            });
        }

        res.status(200).json({ message: 'update profile successfully' })
    } catch (err) {
        next(err)
    }
}
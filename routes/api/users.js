const express = require("express");
const { BadRequest } = require("http-errors");
const { User } = require("../../models");
const { authenticate, upload } = require("../../middlewares");
const path = require("path");
const router = express.Router();
const fs = require("fs/promises");
const avatarsDir = path.join(__dirname, "../../", "public", "avatars");
const Jimp = require("jimp");

router.get("/current", authenticate, async (req, res, next) => {
    const { email, subscription } = req.user;
    res.json({
        user: {
            email,
            subscription,
        },
    });
});

router.get("/logout", authenticate, async (req, res, next) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).send();
});

router.patch("/avatars", authenticate, upload.single("avatar"), async (req, res, next) => {
    const { path: tempUpload, filename } = req.file;
    const [extension] = filename.split(".").reverse();
    const newFleName = `${req.user._id}.${extension}`;
    const fileUpload = path.join(avatarsDir, newFleName);
    await fs.rename(tempUpload, fileUpload);
    Jimp.read(fileUpload)
        .then((file) => {
            return file.contain(250, 250).write(fileUpload);
        })
        .catch((err) => {
            console.error(err.message);
        });
    const avatarURL = path.join("avatars", newFleName);
    await User.findByIdAndUpdate(req.user._id, { avatarURL }, { new: true });
    res.json({ avatarURL })


});

module.exports = router;



 // try {
    //     const { _id } = req.user;
    //     const { subscription } = req.body;
    //     if (subscription === undefined) {
    //         throw new BadRequest("Missing subscription field");
    //     }

    //     const validSubscriptions = ["starter", "pro", "business"];

    //     console.log(validSubscriptions.includes(subscription));

    //     if (!validSubscriptions.includes(subscription)) {
    //         throw new BadRequest("Invalid subscription value");
    //     }

    //     const updateSubscription = await User.findByIdAndUpdate(
    //         _id,
    //         { subscription },
    //         { new: true }
    //     );
    //     res.json(updateSubscription);
    // } catch (error) {
    //     next(error);
    // }
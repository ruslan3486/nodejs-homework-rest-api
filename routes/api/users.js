const express = require("express");
const { NotFound, BadRequest } = require("http-errors");
const { User } = require("../../models");
const { authenticate, upload } = require("../../middlewares");
const path = require("path");
const router = express.Router();
const fs = require("fs/promises");
const res = require("express/lib/response");
const avatarsDir = path.join(__dirname, "../../", "public", "avatars");
const { sendEmail } = require("../../helpers");
const { SITE_NAME } = process.env;

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

router.get("/verify/:verificationToken", async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken })
        if (!user) {
            throw new NotFound('User not found')
        }

        await User.findByIdAndUpdate(user._id, { verificationToken: null, verify: true });
        res.json({ message: "Verification successful" })

    } catch (error) {
        next(error)
    }


})

router.patch("/avatars", authenticate, upload.single("avatar"), async (req, res, next) => {
    const { path: tempUpload, filename } = req.file;
    const [extension] = filename.split(".").reverse();
    const newFleName = `${req.user._id}.${extension}`;
    const fileUpload = path.join(avatarsDir, newFleName);
    await fs.rename(tempUpload, fileUpload);
    const avatarURL = path.join("avatars", newFleName);
    await User.findByIdAndUpdate(req.user._id, { avatarURL }, { new: true });
    res.json({ avatarURL })


});

router.post("/verify", async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw new BadRequest("missing required field email");
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new NotFound('User not found');
        }
        if (user.verify) {
            throw new BadRequest("Verification has already been passed")
        }

        const { verificationToken } = user;
        const data = {
            to: email,
            subject: "Подтверждение email",
            html: `<a target="_blank" href="${SITE_NAME}/users/verify/${verificationToken}">Подтвердить email</a>`
        }

        await sendEmail(data);

        res.json({ message: "Verification email sent" });
    } catch (error) {
        next(error);
    }
})

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
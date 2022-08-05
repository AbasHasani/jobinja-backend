const upload = require("../middleware/upload");
const router = require("express").Router();
const User = require("../schemas/users");
const Company = require("../schemas/employers");
const { usersVerifyer, employersVerifyer } = require("../verifyer/verifyer");
router.post(
  "/upload/user",
  [upload.single("file"), usersVerifyer],
  async (req, res) => {
    if (req.file === undefined) return res.send("asdasd");
    const imageUrl = `http://localhost:4000/file/${req.file.filename}`;
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { profile: imageUrl },
      { new: true }
    ).exec();
    return res.status(200).json({ imageUrl, user: updatedUser });
  }
);

router.post(
  "/upload/company/mainInfo/:logoimage",
  [upload.single("file"), employersVerifyer],
  async (req, res) => {
    if (req.file === undefined) return res.send("asdasd");
    const imageUrl = `http://localhost:4000/file/${req.file.filename}`;
    try {
      const updatedUser = await Company.findOneAndUpdate(
        { _id: req.employer._id },
        { [req.params.logoimage]: imageUrl },
        { new: true }
      ).exec();
      res.status(200).json({ imageUrl, employer: updatedUser });
    } catch (err) {
      res.status(500).send(err);
    }
  }
);
router.post(
  "/upload/company/introduction/:logoimage",
  [upload.single("file"), employersVerifyer],
  async (req, res) => {
    if (req.file === undefined) return res.send("asdasd");
    const imageUrl = `http://localhost:4000/file/${req.file.filename}`;
    try {
      const updatedUser = await Company.findOneAndUpdate(
        { _id: req.employer._id },
        { introduction: { [req.params.logoimage]: imageUrl } },
        { new: true }
      ).exec();
      res.status(200).json({ imageUrl, employer: updatedUser });
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

module.exports = router;

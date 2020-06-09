const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../Models/User");
const isAuthenticated = require("../Middleware/isAuthenticated");
const strRandom = require("../Middleware/strRandom");

//CREATE
router.post("/user/signup", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (req.body.username && req.body.email && req.body.password) {
      if (!user) {
        const salt = strRandom({
          includeUpperCase: true,
          includeNumber: true,
          length: 64,
        });
        const token = strRandom({
          includeUpperCase: true,
          includeNumber: true,
          length: 64,
        });
        const hash = SHA256(req.body.password + salt).toString(encBase64);
        const newUser = new User({
          email: req.body.email,
          salt: salt,
          hash: hash,
          token: token,
          account: { username: req.body.username },
        });
        await newUser.save();
        res.json({
          id: newUser._id,
          token: newUser.token,
          account: newUser.account,
        });
      } else {
        res.json({ message: "Email already used" });
      }
    } else {
      res.json({ message: "All parameters are required" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (
        SHA256(req.body.password + user.salt).toString(encBase64) === user.hash
      ) {
        res.json({ id: user._id, token: user.token, account: user.account });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//READ
router.get("/user/read/:id", isAuthenticated, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    res.json({ account: user.account, email: user.email });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//UPDATE

router.post("/user/update/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await req.user;
    if (req.params.id === user._id.toString()) {
      user.account.username =
        req.body.username === null || req.body.username === ""
          ? user.account.username
          : req.body.username;
      user.email =
        req.body.email === null || req.body.email === ""
          ? user.email
          : req.body.email;
      user.account.breed =
        req.body.breed === null || req.body.breed === ""
          ? user.account.breed
          : req.body.breed;
      user.account.dateOfBirth =
        req.body.dateOfBirth === null || req.body.dateOfBirth === ""
          ? user.account.dateOfBirth
          : req.body.dateOfBirth;
      user.account.subfamily =
        req.body.subfamily === null || req.body.subfamily === ""
          ? user.account.subfamily
          : req.body.subfamily;
      user.account.food =
        req.body.food === null || req.body.food === ""
          ? user.account.food
          : req.body.food;
      await user.save();
      res.status(200).json({ account: user.account, email: user.email });
    } else {
      res.status(401).json({ error: "this user cannot update " });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/user/update/friend/:id", isAuthenticated, async (req, res) => {
  try {
    const userToUpdateFriends = await req.user;
    const id = req.params.id;
    const friendUsername = req.body.friends;
    const friendToUpdate = await User.findOne({
      "account.username": friendUsername,
    });

    const indexOfFriend = userToUpdateFriends.account.friends.findIndex(
      (friend) => friend.username === friendUsername
    );
    if (friendToUpdate !== null) {
      if (indexOfFriend !== -1) {
        userToUpdateFriends.account.friends.splice(indexOfFriend, 1);
        const indexOfUser = friendToUpdate.account.friends.indexOf(id);
        friendToUpdate.account.friends.splice(indexOfUser, 1);
        await userToUpdateFriends.save();
        await friendToUpdate.save();
        res.json({
          message: "Friend deleted",
          email: userToUpdateFriends.email,
          account: userToUpdateFriends.account,
          friends: userToUpdateFriends.account.friends,
        });
      } else if (indexOfFriend === -1) {
        userToUpdateFriends.account.friends.push({
          username: friendToUpdate.account.username,
          id: friendToUpdate._id,
          breed: friendToUpdate.account.breed,
        });
        friendToUpdate.account.friends.push({
          username: userToUpdateFriends.account.username,
          id: userToUpdateFriends._id,
          breed: userToUpdateFriends.account.breed,
        });
        await userToUpdateFriends.save();
        await friendToUpdate.save();
        res.json({
          message: "Friend added",
          email: userToUpdateFriends.email,
          account: userToUpdateFriends.account,
          friends: userToUpdateFriends.account.friends,
        });
      } else {
        res.status(400).json({ message: "an error occured" });
      }
    } else {
      res.json({ message: "no friend" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

//DELETE
router.get("/user/delete/:id", isAuthenticated, async (res, req) => {
  try {
    const userId = req.user._id;
    const userToDelete = await User.findById(userId);
    userToDelete.deleted = true;
    await userToDelete.save();
    res.json({ message: "User deleted (soft)" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

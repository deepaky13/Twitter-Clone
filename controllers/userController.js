import Notification from "../models/notificationModel.js";
import User from "../models/usermodel.js";
import mongoose from "mongoose";

export const getUserProfile = async (req, res) => {
  const {username} = req.params;
console.log(username);

  try {
    const user = await User.findOne({ userName: username }).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.log("Error from user profiel", error);
    res.status(404).json({ msg: error.msg });
  }
};
    
export const followUnfollwings = async (req, res) => {
  const { id } = req.params;
  console.log("following person's id:", id);
  console.log(req.user);

  try {
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user);
    console.log("user to follow:", userToModify?._id);
    console.log("current user:", currentUser?._id);

    if (!userToModify || !currentUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (userToModify._id.equals(currentUser._id)) {
      return res
        .status(400)
        .json({ msg: "You cannot follow/unfollow yourself" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user } });
      await User.findByIdAndUpdate(req.user, { $pull: { following: id } });
      return res.status(200).json({ msg: "User unfollowed successfully" });
    } else {
      // Follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user } });
      await User.findByIdAndUpdate(req.user, { $push: { following: id } });

      //? notify the user

      const newNotifications = new Notification({
        type: "follow",
        from: req.user,
        to: userToModify._id,
      });
      await newNotifications.save();

      return res.status(200).json({ msg: "User followed successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

//? to get he suggested users to follow

export const getSuggestedUser = async (req, res) => {
  const userId = req.user;
  try {
    const userFollowedByMe = await User.findById(userId)
      .select("following")
      .lean();

    if (!userFollowedByMe) {
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("Current User ID:", userId);

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(userId) },
        },
      },
      { $sample: { size: 10 } },
    ]);

    console.log("Aggregated Users:", users);

    // Convert followed user IDs to strings
    const followedUserIds = userFollowedByMe.following.map((followingId) =>
      followingId.toString()
    );

    // Filter out users already followed by the current user
    const filteredUsers = users.filter(
      (user) => !followedUserIds.includes(user._id.toString())
    );

    console.log("Filtered Users:", filteredUsers);

    // Get the top 4 suggested users
    const suggestedUsers = filteredUsers.slice(0, 4);

    // Remove the password field from suggested users
    suggestedUsers.forEach((user) => {
      user.password = null;
    });

    res.status(200).json({ msg: "Suggested users", suggestedUsers });
  } catch (error) {
    console.error("Error occurred in:", error);
    res.status(400).json({ msg: error.message });
  }
};

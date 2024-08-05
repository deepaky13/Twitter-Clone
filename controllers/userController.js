import Notification from "../models/notificationModel.js";
import User from "../models/usermodel.js";

export const getUserProfile = async (req, res) => {
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

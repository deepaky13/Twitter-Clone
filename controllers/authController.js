import User from "../models/usermodel.js";
import { comparePassword, hashpassword } from "../utils/passwordUtls.js";
import { createJwt } from "../utils/tokenUtils.js";

//********************** user Registeration **********************
export const signUp = async (req, res) => {
  const { userName, fullName, email, password } = req.body;

  const hashedPassword = await hashpassword(password);

  try {
    const newUser = await User({
      userName,
      fullName,
      email,
      password: hashedPassword,
    });
    console.log(hashedPassword);

    if (newUser) {
      await newUser.save();
      createJwt(newUser._id, res);

      // passing the new user to the client without password
      res.status(201).json({
        _id: newUser._id,
        userName: newUser.userName,
        fullName: newUser.fullName,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ msg: "Invaild user Data" });
    }
  } catch (error) {
    console.log("There is an error from signup ", error);
    res.status(500).json({ msg: error.msg });
  }
};

//*----------------------\user Login--------------------------------
export const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!user || !isPasswordCorrect) {
      res.status(401).json({ msg: "Invalid credientials" });
    }
    createJwt(user._id, res);

    res.status(201).json({
      _id: user._id,
      userName: user.userName,
      fullName: user.fullName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("There is an error from signIn ", error);
    res.status(500).json({ msg: error.msg });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(200).json({ msg: "user logged out" });
  } catch (error) {
    console.log("There is an error from logout ", error);
    res.status(500).json({ msg: error.msg });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.status(200).json({ user: user });
  } catch (error) {
    console.log("There is an error from getting current user ", error);
    res.status(500).json({ msg: error.msg });
  }
};

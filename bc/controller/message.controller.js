import Message from "../models/message.model.js";
export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filterUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filterUsers);
  } catch (error) {
    console.error("Error in getusers for sidebar", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params.id;
    const senderId = req.user._id;

    const message = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in getting messages: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id } = req.params;
    const senderId = req.user._id
    let imageURL
    if(image) {
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageURL = uploadResponse.secure_url
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageURL,
    })
    await newMessage.save()

    res.status(201).json(newMessage)
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error'})
    
  }
};

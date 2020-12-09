"use strict";
const Message = use("App/Models/Message");
const User = use("App/Models/User");
const { validate } = use('Validator')

class MessageController {
  async sendMessage({ request, response }) {
    try {
      const { senderId, recipient, topic, messageText } = request.all();
      const rules = {
        recipient: "required|string|max:20",
        topic: "required|string|max:255",
        messageText: "required|string|max:255",
      };
      const validateInfo = await validate(request.all(), rules);
      if (validateInfo) {
        const recipientUser = (await User.findBy("username", recipient)) || {
          id: null,
        };
        const senderUser = await User.findBy("id", senderId);
        if (recipientUser.id) {
          if (recipientUser.username !== senderUser.username) {
            const message = await Message.create({
              topic,
              content: messageText,
              was_read: 0,
              recipient_name: recipientUser.username,
              sender_name: senderUser.username,
            });
            await senderUser.messages().attach([message.id], (row) => {
              row.type = "sender";
            });

            await recipientUser.messages().attach([message.id], (row) => {
              row.type = "recipient";
            });

            return response.status(200).json(message);
          } else {
            return response.status(403).send("Can't message to yourself");
          }
        } else {
          return response.status(404).send("Recipient not found");
        }
      } else {
        return response.status(406).send("Invalid fields");
      }
    } catch (error) {
      return response.status(500).send("Server error");
    }
  }
  async deleteMessage({ request, response }) {
    try {
      const { user_id, message_id } = request.all();
      const user = await User.findBy("id", user_id);
      const msgToDelete = await user
        .messages()
        .where("message_id", message_id)
        .first();
      await msgToDelete.delete();
      await msgToDelete.save();
    } catch (error) {
      return response.status(500).send("Server error");
    }
  }

  async readMessage({ request, response }) {
    try {
      const { message_id } = request.all();
      await Message.query().where("id", message_id).update({ was_read: 1 });
      return response.status(200).send("Message read succesfully");
    } catch (error) {
      return response.status(500).send("Server Error");
    }
  }

  async getList({ request, response }) {
    try {
      const { user_id, mode } = request.all();
      const user = await User.findBy("id", user_id);
      const list = await user
        .messages()
        .where("type", mode === "sent" ? "sender" : "recipient")
        .fetch();
      return response.status(200).json(list);
    } catch (error) {
      return response.status(500).send("Server Error");
    }
  }
}

module.exports = MessageController;

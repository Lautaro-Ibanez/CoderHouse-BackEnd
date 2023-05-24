import messageModel from "../models/messages-model.js";

export default class MessageManager {
  getMessagges = (params) => {
    return messageModel.find(params).lean();
  };

  createMessage = (message) => {
    return messageModel.create(message);
  };
}

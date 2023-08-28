import mongoose from "mongoose";
import ticketModel from "../models/ticket-model.js";

export default class TicketManager {
  saveTicket = (ticket) => {
    return ticketModel.create(ticket);
  };
}

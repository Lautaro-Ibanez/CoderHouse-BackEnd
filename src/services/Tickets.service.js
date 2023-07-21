export default class TicketsService {
  constructor(dao) {
    this.dao = dao;
  }

  addTicket = (ticket) => {
    return this.dao.saveTicket(ticket);
  };
}

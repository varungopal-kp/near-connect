const chatSocket = require('./chatSocket');

module.exports = (io) => {
  chatSocket(io);
};

const { ObjectId } = require('mongodb');

exports.convertToObjectId = (id) => {
    try {
      return new ObjectId(id);
    } catch (error) {
      throw new Error("Invalid ObjectId");
    }
  };
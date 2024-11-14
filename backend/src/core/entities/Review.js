// src/core/entities/Review.js
class Review {
    constructor({ id, bookId, userId, rating, comment, createdAt }) {
      this.id = id;
      this.bookId = bookId;
      this.userId = userId;
      this.rating = rating;
      this.comment = comment;
      this.createdAt = createdAt || new Date();
    }
  }
  
  module.exports = Review;
  
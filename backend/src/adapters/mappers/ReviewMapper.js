// src/adapters/mappers/ReviewMapper.js
const Review = require('../../core/entities/Review');

class ReviewMapper {
  static toEntity(data) {
    return new Review({
      id: data._id,
      bookId: data.bookId,
      userId: data.userId,
      rating: data.rating,
      comment: data.comment,
      createdAt: data.createdAt
    });
  }

  static toPersistence(review) {
    return {
      bookId: review.bookId,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt
    };
  }
}

module.exports = ReviewMapper;

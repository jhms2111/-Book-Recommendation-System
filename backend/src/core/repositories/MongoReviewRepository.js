// src/adapters/repositories/MongoReviewRepository.js
const ReviewRepository = require('../../core/repositories/ReviewRepository');
const ReviewModel = require('../../infrastructure/database/models/ReviewModel');
const ReviewMapper = require('../mappers/ReviewMapper');

class MongoReviewRepository extends ReviewRepository {
  async addReview(review) {
    const reviewData = ReviewMapper.toPersistence(review);
    const savedReview = await ReviewModel.create(reviewData);
    return ReviewMapper.toEntity(savedReview);
  }

  async getReviewsByBook(bookId) {
    const reviews = await ReviewModel.find({ bookId });
    return reviews.map(ReviewMapper.toEntity);
  }
}

module.exports = MongoReviewRepository;

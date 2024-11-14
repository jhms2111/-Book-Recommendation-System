// src/core/useCases/AddReview.js
class AddReview {
    constructor(reviewRepository) {
      this.reviewRepository = reviewRepository;
    }
  
    async execute(reviewData) {
      const review = await this.reviewRepository.addReview(reviewData);
      return review;
    }
  }
  
  module.exports = AddReview;
  
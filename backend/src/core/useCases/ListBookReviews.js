// src/core/useCases/ListBookReviews.js
class ListBookReviews {
    constructor(reviewRepository) {
      this.reviewRepository = reviewRepository;
    }
  
    async execute(bookId) {
      const reviews = await this.reviewRepository.getReviewsByBook(bookId);
      return reviews;
    }
  }
  
  module.exports = ListBookReviews;
  
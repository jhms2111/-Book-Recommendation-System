# 📚 Book Recommendation System

![Project Preview](path/to/preview-image.png)

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [APIs Used](#apis-used)
5. [Setup](#setup)
6. [Usage](#usage)
7. [Project Structure](#project-structure)
8. [Contributing](#contributing)
9. [License](#license)

---

## Overview
The Book Recommendation System provides a curated selection of books across multiple categories. Users can browse, search, and click on each book to view detailed information. Each category is displayed in a carousel format, allowing for seamless scrolling through a broad collection.

## Features
- **Book Search**: Find books by title, author, or topic.
- **Category Carousels**: Browse book categories like *Finance*, *Self-Help*, *Trending*, and *Classics*.
- **Book Details Page**: View details such as title, author, cover image, and a summary.
- **User Interaction**: Allows user reviews and ratings (in development).
- **Responsive Design**: Built with Material UI for optimized viewing on various screen sizes.

## Tech Stack
- **Frontend**: React, Material UI, React Slick for carousels
- **Backend**: Node.js, Express.js (for API management)
- **APIs**: Open Library API, Google Books API

## APIs Used
1. **Google Books API**: Used to fetch books by category and search terms. (If using an API key, configure it in `.env` as `GOOGLE_BOOKS_API_KEY`).
2. **Open Library API**: Serves as a secondary source for book data, especially for public domain works.

> **Note**: Google Books API has a daily usage limit. To avoid reaching it, use Open Library for additional sources or implement request caching.

## Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/jhms2111/book-recommendation-system.git
   cd book-recommendation-system

# BookTrove

# Project Setup

## Prerequisites
Make sure you have the following installed before proceeding:
- **Node.js** (Latest LTS recommended)
- **npm** (Comes with Node.js)
- **MongoDB** (Locally or cloud-based, e.g., MongoDB Atlas)

## Installation

1. Clone the repository:
   ```sh
   git clone [<your-repo-url>](https://github.com/varun-chaudhary/SqlInterviewTyari.git)
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Configuration

3. Setup environment variables:
   - Rename `.env.example` to `.env` (if applicable)
   - Replace **MongoDB URL** in the `.env` file:
     ```env
     MONGODB_URL=your_mongodb_connection_string
     ```
   - Replace **OpenAI API Key**:
     ```env
     OPENAI_API_KEY=your_openai_api_key
     ```

## Running the Project

4. Start the backend server:
   ```sh
   npm run server
   ```

5. Start the frontend:
   ```sh
   npm run dev
   ```

## Notes
- Ensure MongoDB is running before starting the server.
- If using a cloud database like MongoDB Atlas, allow network access to your IP.

### Happy Coding! 🚀


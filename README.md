# Cocktail Explorer 🍹

Welcome to Cocktail Explorer, a web application that allows users to browse, search, and filter a wide variety of cocktails. Users can mark their favorite cocktails and view detailed information, including ingredients and preparation instructions.

## Features

- **Cocktail List Viewing**:Browse a comprehensive list of cocktails fetched from the [Solvro Cocktails API](https://cocktails.solvro.pl)
- **Favorite Cocktails**:Mark and unmark cocktails as favorites, with favorites persisted in local storage
- **Search and Filter**:Search cocktails by name and filter by category, glass type, and alcoholic content. The search algorithm has been enhanced to support multi-keyword searches, matching keywords to the start of any word in the cocktail name
- **Cocktail Details**:View detailed information about each cocktail, including ingredients and preparation steps
- **Responsive Design**:Optimized for various screen sizes to ensure a seamless user experience across devices

## Technologies Used

- **Next.js**:A React framework for server-rendered applications and static website generation
- **TypeScript**:Provides static typing to enhance code quality and development experience
- **Tailwind CSS**:A utility-first CSS framework for rapid UI development
- **TanStack Query (React Query)**:Manages server state and data fetching, providing caching and synchronization capabilities
- **Axios**:Promise-based HTTP client for making API requests

## Getting Started

To run this project locally, follow these steps:

1. **Clone the repository**:

   ````bash
   git clone https://github.com/Suleymanmalikov/cocktail-app.git
   ```

   ````

2. **Navigate to the project directory**:

   ````bash
   cd cocktail-app
   ```

   ````

3. **Install dependencies**:

   ````bash
   npm install
   ```

   ````

4. **Start the development server**:

   ````bash
   npm run dev
   ```

   ````

5. **Open the application**:

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Available Scripts

-`npm run dev`: Starts the development server
-`npm run build`: Builds the application for production
-`npm run start`: Starts the production server
-`npm run lint`: Runs ESLint to check for linting errors

## Deployment

This application can be deployed on platforms like Vercel, Netlify, or any platform that supports Next.js applications. Ensure that all environment variables are set appropriately for the production environment

## Acknowledgements

- **Solvro Cocktails API**:For providing the cocktail data
- **TanStack Query**:For efficient data fetching and state management
- **Tailwind CSS**:For streamlined styling and responsive design
  Thank you for exploring Cocktail Explorer! Cheers! �

```

```

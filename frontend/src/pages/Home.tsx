import React from 'react';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
        Welcome to FilmApp
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
        Discover movies, discuss and learn.
      </p>
      <div className="flex gap-4">
        <Link to="/films">
          <Button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Discover Movies
          </Button>
        </Link>
        <Link to="/genres">
          <Button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-base px-6 py-3.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            Browse Genres
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { Card, Spinner } from 'flowbite-react';

interface Genre {
  id: string;
  name: string;
}

const Genres: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/genres')
      .then((res) => setGenres(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Spinner size="xl" aria-label="Loading genres" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 pb-4 border-b border-gray-200 dark:border-gray-700 dark:text-white">Genres</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <Link to={`/genres/${genre.id}`} key={genre.id} className="no-underline">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                {genre.name}
              </h5>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Genres;

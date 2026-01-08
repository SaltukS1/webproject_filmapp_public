import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { Card, Spinner } from 'flowbite-react';

interface Person {
  id: string;
  fullName: string;
  bio?: string;
}

const Actors: React.FC = () => {
  const [actors, setActors] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/people/actors')
      .then((res) => setActors(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Spinner size="xl" aria-label="Loading actors" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 pb-4 border-b border-gray-200 dark:border-gray-700 dark:text-white">Actors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {actors.map((actor) => (
          <Link to={`/person/${actor.id}/films`} key={actor.id} className="no-underline">
            <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
              <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {actor.fullName}
              </h5>
              {actor.bio && (
                <p className="font-normal text-sm text-gray-700 dark:text-gray-400 line-clamp-3">
                  {actor.bio}
                </p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Actors;

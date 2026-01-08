import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import { Card, Spinner } from 'flowbite-react';

interface Film {
  id: string;
  title: string;
  posterUrl: string;
  releaseYear: number;
}

interface Person {
  id: string;
  fullName: string;
  bio: string;
}

const PersonFilms: React.FC = () => {
  const { id } = useParams();
  const [films, setFilms] = useState<Film[]>([]);
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [personRes, filmsRes] = await Promise.all([
          client.get(`/people/${id}`),
          client.get(`/people/${id}/films`)
        ]);
        setPerson(personRes.data);
        if (Array.isArray(filmsRes.data)) {
          setFilms(filmsRes.data);
        } else {
          setFilms([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Spinner size="xl" aria-label="Loading films" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 pb-4 border-b border-gray-200 dark:border-gray-700 dark:text-white">
        {person?.fullName} Films
      </h1>
      
      {films.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No films found for this person.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {films.map((film) => (
            <Link to={`/films/${film.id}`} key={film.id} className="no-underline">
              <Card
                className="max-w-[250px] mx-auto hover:shadow-lg transition-shadow duration-300 h-full"
                imgSrc={film.posterUrl}
                imgAlt={film.title}
                theme={{
                  root: {
                    children: "flex flex-col !justify-start !p-[5px] !gap-[5px]",
                  },
                  img: {
                    base: "w-full h-[350px] object-contain rounded-t-lg bg-gray-50 dark:bg-gray-800"
                  }
                }}
              >
                <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white truncate !my-0">
                  {film.title}
                </h5>
                <p className="font-normal text-sm text-gray-700 dark:text-gray-400 !my-0">
                  {film.releaseYear}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonFilms;

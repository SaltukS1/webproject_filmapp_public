import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from 'flowbite-react';

interface Film {
  id: string;
  title: string;
  releaseYear: number;
}

const AdminFilms: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);

  const fetchFilms = () => {
    client.get('/films')
      .then((res) => setFilms(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete film?')) return;
    try {
      await client.delete(`/films/${id}`);
      fetchFilms();
    } catch (error) {
      console.error(error);
      alert('Error deleting film');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Films</h2>
        <Button as={Link} to="/admin/films/new" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          Add New Film
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableHeadCell>Title</TableHeadCell>
            <TableHeadCell>Year</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {films.map((film) => (
              <TableRow key={film.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {film.title}
                </TableCell>
                <TableCell>{film.releaseYear}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button as={Link} to={`/admin/films/${film.id}/edit`} size="xs" color="gray">
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(film.id)} size="xs" color="failure">
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {films.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No films found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminFilms;

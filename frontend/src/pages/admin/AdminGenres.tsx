import React, { useEffect, useState } from 'react';
import client from '../../api/client';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, Card, Label, TextInput } from 'flowbite-react';

interface Genre {
  id: string;
  name: string;
}

const AdminGenres: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchGenres = () => {
    client.get('/genres')
      .then((res) => setGenres(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await client.patch(`/genres/${editingId}`, { name });
      } else {
        await client.post('/genres', { name });
      }
      setName('');
      setEditingId(null);
      fetchGenres();
    } catch (error) {
      console.error(error);
      alert('Error saving genre');
    }
  };

  const handleEdit = (genre: Genre) => {
    setName(genre.name);
    setEditingId(genre.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete genre?')) return;
    try {
      await client.delete(`/genres/${id}`);
      fetchGenres();
    } catch (error) {
      console.error(error);
      alert('Error deleting genre');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Manage Genres</h2>
      
      <Card className="mb-8">
        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {editingId ? 'Edit Genre' : 'Add New Genre'}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="genreName">Genre Name</Label>
            </div>
            <TextInput
              id="genreName"
              type="text"
              placeholder="e.g. Action"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              {editingId ? 'Update' : 'Create'}
            </Button>
            {editingId && (
              <Button 
                color="gray"
                onClick={() => { setName(''); setEditingId(null); }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell className="text-right">Actions</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {genres.map((genre) => (
              <TableRow key={genre.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {genre.name}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="xs" color="gray" onClick={() => handleEdit(genre)}>
                      Edit
                    </Button>
                    <Button size="xs" color="failure" onClick={() => handleDelete(genre.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {genres.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-4">
                  No genres found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminGenres;

import React, { useEffect, useState } from 'react';
import client from '../../api/client';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, Card, Label, TextInput, Textarea } from 'flowbite-react';

interface Person {
  id: string;
  fullName: string;
  bio?: string;
  primaryRole?: 'ACTOR' | 'DIRECTOR';
}

const AdminDirectors: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchPeople = () => {
    client.get('/people/directors')
      .then((res) => setPeople(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { fullName, bio, primaryRole: 'DIRECTOR' };
      if (editingId) {
        await client.patch(`/people/${editingId}`, data);
      } else {
        await client.post('/people', data);
      }
      setFullName('');
      setBio('');
      setEditingId(null);
      fetchPeople();
    } catch (error) {
      console.error(error);
      alert('Error saving director');
    }
  };

  const handleEdit = (person: Person) => {
    setFullName(person.fullName);
    setBio(person.bio || '');
    setEditingId(person.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete director?')) return;
    try {
      await client.delete(`/people/${id}`);
      fetchPeople();
    } catch (error) {
      console.error(error);
      alert('Error deleting director');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Manage Directors</h2>
      
      <Card className="mb-8">
        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {editingId ? 'Edit Director' : 'Add New Director'}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="fullName">Full Name</Label>
            </div>
            <TextInput
              id="fullName"
              type="text"
              placeholder="Jane Campion"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="bio">Bio (optional)</Label>
            </div>
            <Textarea
              id="bio"
              placeholder="Brief biography..."
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              {editingId ? 'Update' : 'Create'}
            </Button>
            {editingId && (
              <Button color="gray" onClick={() => {
                setEditingId(null);
                setFullName('');
                setBio('');
              }}>
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
            <TableHeadCell>Bio</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {people.map((person) => (
              <TableRow key={person.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {person.fullName}
                </TableCell>
                <TableCell>{person.bio}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="xs" color="warning" onClick={() => handleEdit(person)}>
                      Edit
                    </Button>
                    <Button size="xs" color="failure" onClick={() => handleDelete(person.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDirectors;

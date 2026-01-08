import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../../api/client';
import { Button, Card, Label, TextInput, Textarea, Select, Checkbox, Spinner, FileInput, Radio } from 'flowbite-react';

interface Genre {
  id: string;
  name: string;
}

interface Person {
  id: string;
  fullName: string;
}

interface CreditItem {
  personId: string;
  creditType: 'DIRECTOR' | 'ACTOR';
  orderIndex?: number;
}

interface Review {
  rating: number;
  reviewText: string;
}

const AdminFilmForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState<number>(new Date().getFullYear());
  const [posterUrl, setPosterUrl] = useState('');
  const [inputType, setInputType] = useState<'url' | 'file'>('url');
  const [synopsis, setSynopsis] = useState('');

  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);

  const [people, setPeople] = useState<Person[]>([]);
  const [credits, setCredits] = useState<CreditItem[]>([]);

  
  const [newCreditPersonId, setNewCreditPersonId] = useState('');
  const [newCreditType, setNewCreditType] = useState<'DIRECTOR' | 'ACTOR'>('ACTOR');

  const [review, setReview] = useState<Review>({ rating: 0, reviewText: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresRes, peopleRes] = await Promise.all([
          client.get('/genres'),
          client.get('/people')
        ]);
        setGenres(genresRes.data);
        setPeople(peopleRes.data);

        if (id) {
          const filmRes = await client.get(`/films/${id}`);
          const film = filmRes.data;
          setTitle(film.title);
          setReleaseYear(film.releaseYear);
          setPosterUrl(film.posterUrl);
          setSynopsis(film.synopsis || '');
          
          if (film.filmGenres) {
            setSelectedGenreIds(film.filmGenres.map((fg: any) => fg.genre.id));
          }
          
          if (film.filmCredits) {
            setCredits(film.filmCredits.map((fc: any) => ({
              personId: fc.person.id,
              creditType: fc.creditType,
              orderIndex: fc.orderIndex
            })));
          }

          if (film.reviews && film.reviews.length > 0) {
             
             const r = film.reviews[0];
             setReview({ rating: r.rating, reviewText: r.reviewText });
          }
        }
      } catch (error) {
        console.error(error);
        alert('Error loading data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleGenreToggle = (genreId: string) => {
    setSelectedGenreIds(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId) 
        : [...prev, genreId]
    );
  };

  const handleAddCredit = () => {
    if (!newCreditPersonId) return;
    const newCredit: CreditItem = {
      personId: newCreditPersonId,
      creditType: newCreditType,
      orderIndex: credits.length
    };
    setCredits([...credits, newCredit]);
    setNewCreditPersonId('');
  };

  const handleRemoveCredit = (index: number) => {
    const newCredits = [...credits];
    newCredits.splice(index, 1);
    setCredits(newCredits);
  };

  const getPersonName = (id: string) => {
    const person = people.find(p => p.id === id);
    return person ? person.fullName : 'Unknown';
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await client.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPosterUrl(res.data.url);
    } catch (error) {
      console.error('File upload failed:', error);
      alert('File upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!posterUrl) {
      alert('Please provide a poster image (URL or Upload).');
      return;
    }

    try {
      const filmData = {
        title,
        releaseYear: Number(releaseYear),
        posterUrl,
        synopsis
      };

      let filmId = id;

      if (id) {
        await client.patch(`/films/${id}`, filmData);
      } else {
        const res = await client.post('/films', filmData);
        filmId = res.data.id;
      }

      if (filmId) {
        await client.put(`/films/${filmId}/genres`, { genreIds: selectedGenreIds });
        await client.put(`/films/${filmId}/credits`, { credits });
        
        if (review.rating > 0 || review.reviewText) {
             await client.post(`/films/${filmId}/reviews`, review);
        }
      }

      navigate('/admin/films');
    } catch (error) {
      console.error(error);
      alert('Error saving film');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Spinner size="xl" aria-label="Loading form" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{id ? 'Edit Film' : 'Add New Film'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="title">Title *</Label>
            </div>
            <TextInput id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="releaseYear">Release Year *</Label>
            </div>
            <TextInput id="releaseYear" type="number" value={releaseYear} onChange={e => setReleaseYear(Number(e.target.value))} required />
          </div>
          <div className="md:col-span-2">
            <div className="mb-2 block">
              <Label htmlFor="posterUrl">Poster Image</Label>
            </div>
            
            <fieldset className="flex max-w-md flex-col gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Radio id="url-input" name="inputType" value="url" checked={inputType === 'url'} onChange={() => setInputType('url')} />
                <Label htmlFor="url-input">Image URL</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio id="file-input" name="inputType" value="file" checked={inputType === 'file'} onChange={() => setInputType('file')} />
                <Label htmlFor="file-input">Upload File</Label>
              </div>
            </fieldset>

            {inputType === 'url' ? (
              <TextInput 
                id="posterUrl" 
                type="url" 
                placeholder="https://example.com/poster.jpg" 
                value={posterUrl} 
                onChange={e => setPosterUrl(e.target.value)} 
                required={!posterUrl} 
              />
            ) : (
              <div>
                <FileInput 
                  id="file-upload" 
                  onChange={handleFileUpload}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
              </div>
            )}
            {posterUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Preview:</p>
                <img src={posterUrl} alt="Poster preview" className="h-32 object-cover rounded" onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                }} />
              </div>
            )}
          </div>
        </div>

        <div>
           <div className="mb-2 block">
            <Label htmlFor="synopsis">Synopsis</Label>
          </div>
          <Textarea id="synopsis" value={synopsis} onChange={e => setSynopsis(e.target.value)} rows={4} />
        </div>

        {}
        <Card>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Genres</h3>
          <div className="flex flex-wrap gap-4">
            {genres.map(genre => (
              <div key={genre.id} className="flex items-center gap-2">
                <Checkbox 
                  id={`genre-${genre.id}`} 
                  checked={selectedGenreIds.includes(genre.id)} 
                  onChange={() => handleGenreToggle(genre.id)} 
                />
                <Label htmlFor={`genre-${genre.id}`}>{genre.name}</Label>
              </div>
            ))}
          </div>
        </Card>

        {}
        <Card>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Credits</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
            <div className="md:col-span-2">
              <div className="mb-2 block">
                <Label htmlFor="person">Person</Label>
              </div>
              <Select id="person" value={newCreditPersonId} onChange={e => setNewCreditPersonId(e.target.value)}>
                <option value="">Select Person</option>
                {people.map(p => (
                  <option key={p.id} value={p.id}>{p.fullName}</option>
                ))}
              </Select>
            </div>
            <div>
               <div className="mb-2 block">
                <Label htmlFor="role">Role</Label>
              </div>
              <Select id="role" value={newCreditType} onChange={e => setNewCreditType(e.target.value as any)}>
                <option value="ACTOR">Actor</option>
                <option value="DIRECTOR">Director</option>
              </Select>
            </div>
            <Button type="button" onClick={handleAddCredit} color="success">Add</Button>
          </div>

          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {credits.map((c, idx) => (
              <li key={idx} className="flex justify-between items-center py-2">
                <span className="text-gray-900 dark:text-white">
                  <strong>{getPersonName(c.personId)}</strong> - {c.creditType} 
                </span>
                <Button color="failure" size="xs" onClick={() => handleRemoveCredit(idx)}>Remove</Button>
              </li>
            ))}
          </ul>
        </Card>

        {}
        <Card className="bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Admin Review</h3>
          <div className="flex flex-col gap-4">
            <div>
               <div className="mb-2 block">
                <Label htmlFor="rating">Rating (0-10)</Label>
              </div>
              <TextInput 
                id="rating"
                type="number" 
                min="0" 
                max="10" 
                value={review.rating} 
                onChange={e => setReview({ ...review, rating: Number(e.target.value) })}
                className="w-24"
              />
            </div>
            <div>
               <div className="mb-2 block">
                <Label htmlFor="reviewText">Review Text</Label>
              </div>
              <Textarea 
                id="reviewText"
                value={review.reviewText} 
                onChange={e => setReview({ ...review, reviewText: e.target.value })}
                placeholder="Write your review here..."
                rows={3}
              />
            </div>
          </div>
        </Card>

        <div className="flex gap-4 mt-4">
          <Button type="submit" color="blue">
            Save Film
          </Button>
          <Button type="button" color="gray" onClick={() => navigate('/admin/films')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminFilmForm;

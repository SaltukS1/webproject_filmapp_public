import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Spinner, Badge, Button, Textarea, Avatar, Card } from 'flowbite-react';

interface FilmDetail {
  id: string;
  title: string;
  synopsis: string;
  releaseYear: number;
  posterUrl: string;
  filmGenres: { genre: { name: string } }[];
  filmCredits: { person: { fullName: string }, creditType: string }[];
  reviews: { rating: number, reviewText: string, author: { name: string } }[];
  comments: { id: string, commentText: string, author: { name: string, id: string }, createdAt: string }[];
}

const FilmDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<FilmDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  const fetchFilm = () => {
    setLoading(true);
    client.get(`/films/${id}`)
      .then((res) => {
        setFilm(res.data);
        setError('');
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load film details.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFilm();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await client.post(`/films/${id}/comments`, { commentText: newComment });
      setNewComment('');
      fetchFilm();
    } catch (err) {
      console.error(err);
      alert('Failed to post comment.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await client.delete(`/comments/${commentId}`);
      fetchFilm();
    } catch (err) {
      console.error(err);
      alert('Failed to delete comment.');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Spinner size="xl" aria-label="Loading film details" />
    </div>
  );
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
  if (!film) return null;

  
  const directors = film.filmCredits.filter(c => c.creditType === 'DIRECTOR');
  const actors = film.filmCredits.filter(c => c.creditType === 'ACTOR');

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <img 
            src={film.posterUrl} 
            alt={film.title} 
            className="w-full rounded-lg shadow-lg object-cover aspect-[2/3]" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Poster';
            }}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            {film.title} <span className="text-gray-500 font-normal">({film.releaseYear})</span>
          </h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {film.filmGenres.map((fg, i) => (
              <Badge key={i} color="gray" size="sm">
                {fg.genre.name}
              </Badge>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Synopsis</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-lg">{film.synopsis}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {directors.length > 0 && (
              <div>
                <h4 className="font-bold border-b border-gray-200 dark:border-gray-700 pb-2 mb-2 text-gray-900 dark:text-white">Directors</h4>
                <ul className="list-none space-y-1 text-gray-700 dark:text-gray-300">
                  {directors.map((c, i) => <li key={i}>{c.person.fullName}</li>)}
                </ul>
              </div>
            )}
            {actors.length > 0 && (
              <div>
                <h4 className="font-bold border-b border-gray-200 dark:border-gray-700 pb-2 mb-2 text-gray-900 dark:text-white">Cast</h4>
                <ul className="list-none space-y-1 text-gray-700 dark:text-gray-300">
                  {actors.map((c, i) => (
                    <li key={i}>
                      <span className="font-medium">{c.person.fullName}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr className="my-12 border-gray-200 dark:border-gray-700" />

      {}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Admin Reviews</h2>
        {film.reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet.</p>
        ) : (
          <div className="grid gap-4">
            {film.reviews.map((review, idx) => (
              <Card key={idx} className="border-l-4 border-l-blue-600">
                <div className="flex items-center gap-3 mb-2">
                  <Badge color="indigo" size="lg">
                    {review.rating}/10
                  </Badge>
                  <span className="font-bold text-gray-900 dark:text-white">{review.author.name}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{review.reviewText}</p>
              </Card>
            ))}
          </div>
        )}
      </section>

      {}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Comments</h2>
        
        {user ? (
          <Card className="mb-8">
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Leave a comment</h4>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                required
                rows={4}
              />
              <div className="flex justify-end">
                <Button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Post Comment</Button>
              </div>
            </form>
          </Card>
        ) : (
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            <Link to="/login" className="text-blue-600 hover:underline">Log in</Link> to leave a comment.
          </p>
        )}
        
        {film.comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet. Be the first!</p>
        ) : (
          <div className="space-y-6">
            {film.comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <Avatar placeholderInitials={comment.author?.name?.charAt(0).toUpperCase() || '?'} rounded />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white mr-2">{comment.author?.name || 'Anonymous'}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    {user && (user.role === 'ADMIN' || user.id === comment.author.id) && (
                      <Button 
                        color="failure" 
                        size="xs" 
                        outline 
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comment.commentText}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default FilmDetail;

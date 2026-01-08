import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Films from './pages/Films';
import Genres from './pages/Genres';
import GenreFilms from './pages/GenreFilms';
import PersonFilms from './pages/PersonFilms';
import Actors from './pages/Actors';
import Directors from './pages/Directors';
import Login from './pages/Login';
import Register from './pages/Register';
import FilmDetail from './pages/FilmDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFilms from './pages/admin/AdminFilms';
import AdminFilmForm from './pages/admin/AdminFilmForm';
import AdminGenres from './pages/admin/AdminGenres';
import AdminActors from './pages/admin/AdminActors';
import AdminDirectors from './pages/admin/AdminDirectors';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/films" element={<Films />} />
        <Route path="/films/:id" element={<FilmDetail />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/genres/:id" element={<GenreFilms />} />
        <Route path="/person/:id/films" element={<PersonFilms />} />
        <Route path="/actors" element={<Actors />} />
        <Route path="/directors" element={<Directors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {}
        <Route element={<ProtectedRoute roles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/films" element={<AdminFilms />} />
          <Route path="/admin/films/new" element={<AdminFilmForm />} />
          <Route path="/admin/films/:id/edit" element={<AdminFilmForm />} />
          <Route path="/admin/genres" element={<AdminGenres />} />
          <Route path="/admin/actors" element={<AdminActors />} />
          <Route path="/admin/directors" element={<AdminDirectors />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

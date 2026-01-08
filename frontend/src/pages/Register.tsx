import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { Button, Card, Label, TextInput, Alert } from 'flowbite-react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.post('/auth/register', { name, email, password });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 py-12">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Create an account</h2>
        {error && <Alert color="failure">{error}</Alert>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name">Your name</Label>
            </div>
            <TextInput
              id="name"
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email">Your email</Label>
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password">Your password</Label>
            </div>
            <TextInput
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Register</Button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-700 hover:underline dark:text-blue-500">
              Login here
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register;

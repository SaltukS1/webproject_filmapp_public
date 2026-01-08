import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Avatar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';

const AppNavbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar fluid rounded>
      {}
      <NavbarBrand as={Link} to="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Film App
        </span>
      </NavbarBrand>
      <div className="flex md:order-2">
        {user ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User settings" img="" rounded placeholderInitials={user.name.charAt(0).toUpperCase()} />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">{user.name}</span>
              <span className="block truncate text-sm font-medium">{role}</span>
            </DropdownHeader>
            {role === 'ADMIN' && (
              <>
                <DropdownItem as={Link} to="/admin/films">
                  Manage Films
                </DropdownItem>
                <DropdownItem as={Link} to="/admin/genres">
                  Manage Genres
                </DropdownItem>
                <DropdownItem as={Link} to="/admin/actors">
                  Manage Actors
                </DropdownItem>
                <DropdownItem as={Link} to="/admin/directors">
                  Manage Directors
                </DropdownItem>
                <DropdownItem as={Link} to="/admin/users">
                  Manage Users
                </DropdownItem>
                <DropdownDivider />
              </>
            )}
            <DropdownItem onClick={handleLogout}>Sign out</DropdownItem>
          </Dropdown>
        ) : (
          <div className="flex gap-2">
            <Button as={Link} to="/login" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
              Login
            </Button>
            <Button as={Link} to="/register" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Register
            </Button>
          </div>
        )}
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        {}
        <NavbarLink as={Link as any} to="/" active={false} className={location.pathname === '/' ? "!text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"}>
          Home
        </NavbarLink>
        {}
        <NavbarLink as={Link as any} to="/films" active={false} className={location.pathname === '/films' ? "!text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"}>
          Films
        </NavbarLink>
        {}
        <NavbarLink as={Link as any} to="/actors" active={false} className={location.pathname === '/actors' ? "!text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"}>
          Actors
        </NavbarLink>
        {}
        <NavbarLink as={Link as any} to="/directors" active={false} className={location.pathname === '/directors' ? "!text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"}>
          Directors
        </NavbarLink>
        {}
        <NavbarLink as={Link as any} to="/genres" active={false} className={location.pathname === '/genres' ? "!text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"}>
          Genres
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
};

export default AppNavbar;

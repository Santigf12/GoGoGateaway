import React, { useState } from 'react';
import { useUserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import ProfilePicture from './ProfilePicture';
import { CgProfile } from 'react-icons/cg';
import { IoPersonOutline } from 'react-icons/io5';
import { CiLogout } from 'react-icons/ci';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { currentUser, user, logout } = useUserContext();

  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between border-b-2 bg-light-blue px-12 py-6">
      <div className="flex items-center gap-8 ">
        {' '}
        <h1
          className="cursor-pointer text-xl"
          onClick={() => navigate('/foryou')}
        >
          GoGoGetaway
        </h1>{' '}
        <SearchBar />
      </div>

      <div className="flex items-center justify-evenly gap-16  font-poppins">
        {/* <nav>
          <ul className="flex list-none space-x-8">
            <li>
              <a href="#" className="text-lg hover:text-blue-700">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-blue-700">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-blue-700">
                Deals
              </a>
            </li>
          </ul>
        </nav> */}
        {currentUser && currentUser.username ? (
          <>
            {' '}
            <DropdownMenu>
              <DropdownMenuTrigger>
                {' '}
                <ProfilePicture />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-4 mt-4 w-56 text-lg">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => navigate('/profile')}
                >
                  <IoPersonOutline size={25} />
                  <div>Profile</div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={logout}
                >
                  <CiLogout size={25} />
                  <div>Log Out</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <button
              className="btn cursor-pointer bg-blue-400 text-lg text-white"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;

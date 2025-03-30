
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, Menu, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-2.5">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center mr-10">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-crm-blue">
              Minimalist CRM
            </span>
          </Link>
          
          <div className="hidden md:flex md:space-x-8">
            <Link to="/" className="py-2 px-1 text-crm-charcoal text-sm font-medium border-b-2 border-crm-blue">
              Dashboard
            </Link>
            <Link to="/deals" className="py-2 px-1 text-crm-gray text-sm font-medium hover:text-crm-charcoal">
              Deals
            </Link>
            <Link to="/lists" className="py-2 px-1 text-crm-gray text-sm font-medium hover:text-crm-charcoal">
              Lists
            </Link>
            <Link to="/reports" className="py-2 px-1 text-crm-gray text-sm font-medium hover:text-crm-charcoal">
              Reports
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 w-64 bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-crm-blue text-sm"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-crm-darkGray" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-crm-blue rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-crm-blue flex items-center justify-center text-white">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden md:block text-sm text-left font-medium">
                  Admin User
                  <ChevronDown className="h-4 w-4 inline ml-1" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6 text-crm-charcoal" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 pb-3 space-y-1">
          <Link
            to="/"
            className="block py-2 px-3 text-crm-charcoal font-medium bg-gray-50 rounded-md"
          >
            Dashboard
          </Link>
          <Link
            to="/deals"
            className="block py-2 px-3 text-crm-gray hover:text-crm-charcoal hover:bg-gray-50 font-medium rounded-md"
          >
            Deals
          </Link>
          <Link
            to="/lists"
            className="block py-2 px-3 text-crm-gray hover:text-crm-charcoal hover:bg-gray-50 font-medium rounded-md"
          >
            Lists
          </Link>
          <Link
            to="/reports"
            className="block py-2 px-3 text-crm-gray hover:text-crm-charcoal hover:bg-gray-50 font-medium rounded-md"
          >
            Reports
          </Link>
          <div className="relative mt-3 px-3">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 w-full bg-gray-50 border-0"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React from "react";
import { useAppContext } from "../context/AppContext";
import { User } from "firebase/auth";


const Header: React.FC = () => {
  const { user, logout } = useAppContext();

  const currentUser = user as User | null; // 👈 ensures strong typing

  return (
    <header className="backdrop-blur bg-white/80 sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          PitchDeck AI
        </h1>

        {currentUser && (
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-gray-600 text-sm">
              {currentUser.displayName || currentUser.email || "User"}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-all duration-200 shadow-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


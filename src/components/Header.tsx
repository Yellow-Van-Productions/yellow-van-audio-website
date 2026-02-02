import React from 'react';
import './Header.css';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title animate-fade-in">{title}</h1>
      </div>
    </header>
  );
};

export default Header;

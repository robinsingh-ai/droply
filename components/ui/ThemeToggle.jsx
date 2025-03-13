import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '../../context/ThemeContext';

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${props => props.theme.name === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'};
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 1rem;
  
  &:hover {
    background: ${props => props.theme.name === 'dark' 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.1)'};
    transform: translateY(-2px);
  }

  i {
    font-size: 1rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <ToggleButton 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme.name === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme.name === 'light' ? 'dark' : 'light'} mode`}
      theme={theme}
    >
      {theme.name === 'light' ? (
        <i className="fas fa-moon"></i>
      ) : (
        <i className="fas fa-sun"></i>
      )}
    </ToggleButton>
  );
};

export default ThemeToggle; 
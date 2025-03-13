import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';
import { Link } from 'next/link';

const TopBar = styled.nav`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  background-color: ${props => props.theme.colors.cardBackground};
  padding: 1.25rem 1.5rem;
  z-index: 3000;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding: 1rem 1rem;
  }
  
  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    .brand-icon {
      width: 38px;
      height: 38px;
      object-fit: contain;
      
      @media (max-width: 768px) {
        width: 32px;
        height: 32px;
      }
    }
    
    .brand-text {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: ${props => props.theme.colors.primaryGradient};
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'Poppins', system-ui, sans-serif;
      
      @media (max-width: 768px) {
        font-size: 1.5rem;
      }
    }
    
    .version-badge {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      background-color: ${props => `${props.theme.colors.primaryLight}`};
      color: ${props => props.theme.colors.primary};
      border-radius: 4px;
      font-weight: 600;
      margin-left: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
  
  .nav-actions {
    display: flex;
    align-items: center;
  }
`;

const Topbar = () => {
    const { theme } = useTheme();
    
    return (
        <TopBar theme={theme}>
            <div className="nav-container">
                <div className="brand">
                    <img 
                        src="/images/icons/icon.png" 
                        alt="Droply Logo" 
                        className="brand-icon"
                    />
                    <div className="brand-text">droply</div>
                    <span className="version-badge">beta</span>
                </div>
                
                <div className="nav-actions">
                    <ThemeToggle />
                </div>
            </div>
        </TopBar>
    );
};

export default Topbar;
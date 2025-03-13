import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '../../../context/ThemeContext';

const PeerCard = styled.div`
    background-color: ${props => props.theme.colors.cardBackground};
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border: 1px solid ${props => props.theme.colors.border};
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    
    .connection-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      
      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
    
    .connection-details {
      .label {
        color: ${props => props.theme.colors.mutedText};
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
      }
      
      .peer-id {
        font-size: 1.5rem;
        font-weight: 600;
        color: ${props => props.theme.colors.text};
        font-family: 'Poppins', sans-serif;
        word-break: break-all;
      }
    }
    
    .disconnect-button {
      background: linear-gradient(to right, #F43F5E, #FB7185);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(244, 63, 94, 0.3);
      }
      
      i {
        font-size: 0.875rem;
      }
      
      @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
        padding: 1rem;
        font-size: 1.125rem;
        border-radius: 0.75rem;
      }
    }
`;

const PeerCardComponent = ({ code, onDisconnect }) => {
    const { theme } = useTheme();

    return (
        <PeerCard theme={theme}>
            <div className="connection-info">
                <div className="connection-details">
                    <div className="label">Connected to</div>
                    <div className="peer-id">{code}</div>
                </div>
                <button
                    aria-label="Disconnect from Peer"
                    title="Disconnect from Peer"
                    className="disconnect-button"
                    onClick={onDisconnect}
                >
                    <i className="fas fa-unlink"></i>
                    Disconnect
                </button>
            </div>
        </PeerCard>
    );
};

export default PeerCardComponent;
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '../../../context/ThemeContext';

const CodeInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 320px;
  padding: 1.5rem 1rem;
`;

const InputForm = styled.form`
  width: 100%;
  
  .input-label {
    color: ${props => props.theme.colors.mutedText};
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  
  .code-input {
    width: 100%;
    background-color: ${props => props.theme.colors.cardBackground};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 0.5rem;
    color: ${props => props.theme.colors.text};
    font-size: 1.25rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1.5rem;
    font-family: monospace;
    transition: all 0.2s ease;
    
    &::placeholder {
      color: ${props => props.theme.colors.mutedText};
    }
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 2px ${props => `${props.theme.colors.primary}30`};
    }
  }
  
  .connect-button {
    width: 100%;
    background: ${props => props.theme.colors.primaryGradient};
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px ${props => `${props.theme.colors.primary}30`};
    }
    
    &:disabled {
      background: ${props => props.theme.colors.cardBackground};
      color: ${props => props.theme.colors.mutedText};
      cursor: not-allowed;
    }
  }
`;

const CodeInput = ({ onConnect }) => {
    const [peerCode, setPeerCode] = useState('');
    const { theme } = useTheme();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (peerCode.length >= 4) {
            onConnect(peerCode.toLowerCase());
        }
    };
    
    return (
        <CodeInputContainer>
            <InputForm onSubmit={handleSubmit} theme={theme}>
                <div className="input-label">Enter your peer's code</div>
                <input
                    className="code-input"
                    type="text"
                    aria-label="Enter Peer Code"
                    title="Enter Peer Code"
                    required
                    autoFocus
                    autoComplete="off"
                    aria-required="true"
                    onChange={(e) => setPeerCode(e.target.value)}
                    placeholder="Enter code..."
                    maxLength={20}
                />
                
                <button
                    className="connect-button"
                    type="submit"
                    disabled={peerCode.length < 4}
                    aria-label="Connect to Peer"
                >
                    <i className="fas fa-link"></i>
                    Connect
                </button>
            </InputForm>
        </CodeInputContainer>
    );
};

export default CodeInput;
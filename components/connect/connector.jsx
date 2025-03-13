import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '../../context/ThemeContext';

import { QRScanner, MyQRCode, CodeInput } from './views';

// Standalone QR section
const QRWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
    
    @media (min-width: 768px) {
        justify-content: flex-start;
        margin-right: 2rem;
        margin-bottom: 0;
    }
`;

// Standalone button group
const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
    
    @media (min-width: 768px) {
        flex-direction: row;
        max-width: 100%;
    }
`;

const ActionButton = styled.button`
    background: ${props => props.primary 
        ? props.theme.colors.primaryGradient 
        : props.theme.colors.cardBackground};
    color: ${props => props.primary ? 'white' : props.theme.colors.text};
    border: ${props => props.primary 
        ? 'none' 
        : `1px solid ${props.theme.colors.border}`};
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    cursor: pointer;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        background: ${props => props.primary 
            ? props.theme.colors.primaryGradient 
            : props.theme.name === 'dark' ? '#2D3748' : '#f0f5f2'};
    }
    
    i {
        font-size: 1rem;
    }
    
    @media (min-width: 768px) {
        flex: 1;
    }
`;

// Main content area as a flexbox for horizontal layout on larger screens
const StandaloneContentArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.75rem;
    
    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }
`;

// Loading spinner
const LoadingSpinner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    
    .spinner {
        font-size: 2rem;
        color: ${props => props.theme.colors.primary};
        margin-bottom: 1rem;
    }
    
    .message {
        color: ${props => props.theme.colors.mutedText};
    }
`;

export default ({ myCode, onConnect, isLoading }) => {
    const [type, setType] = useState('qrCode');
    const { theme } = useTheme();

    if (isLoading) {
        return (
            <LoadingSpinner theme={theme}>
                <i className="fas fa-circle-notch fa-spin spinner"></i>
                <p className="message">Establishing connection...</p>
            </LoadingSpinner>
        );
    }

    // Display different content based on the selected type
    if (type === 'qrScanner') {
        return (
            <StandaloneContentArea>
                <QRWrapper>
                    <QRScanner onScan={onConnect} />
                </QRWrapper>
                <ButtonGroup>
                    <ActionButton
                        primary
                        onClick={() => setType('qrCode')}
                        aria-label="Show My QR Code"
                        title="Show My QR Code"
                        theme={theme}
                    >
                        <i className="fas fa-user-circle"></i>
                        Show My QR Code
                    </ActionButton>
                </ButtonGroup>
            </StandaloneContentArea>
        );
    }
    
    if (type === 'codeInput') {
        return (
            <StandaloneContentArea>
                <QRWrapper>
                    <CodeInput onConnect={onConnect} />
                </QRWrapper>
                <ButtonGroup>
                    <ActionButton
                        primary
                        onClick={() => setType('qrCode')}
                        aria-label="Show My QR Code"
                        title="Show My QR Code"
                        theme={theme}
                    >
                        <i className="fas fa-user-circle"></i>
                        Show My QR Code
                    </ActionButton>
                </ButtonGroup>
            </StandaloneContentArea>
        );
    }
    
    // Default QR code view
    return (
        <StandaloneContentArea>
            <QRWrapper>
                <MyQRCode code={myCode} />
            </QRWrapper>
            <ButtonGroup>
                <ActionButton 
                    primary
                    onClick={() => setType('qrScanner')}
                    aria-label="Scan QR Code"
                    title="Scan QR Code"
                    theme={theme}
                >
                    <i className="fas fa-qrcode"></i>
                    Scan QR Code
                </ActionButton>
                
                <ActionButton
                    onClick={() => setType('codeInput')}
                    aria-label="Enter Code Instead"
                    title="Enter Code Instead"
                    theme={theme}
                >
                    <i className="fas fa-keyboard"></i>
                    Enter Code Instead
                </ActionButton>
            </ButtonGroup>
        </StandaloneContentArea>
    );
}
import React from 'react';
import styled from '@emotion/styled';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { throwToast } from '../../../functions';
import { useTheme } from '../../../context/ThemeContext';

const QRCode = require('qrcode.react');

const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .qr-wrapper {
    background: white;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .code-value {
    display: flex;
    align-items: center;
    background-color: ${props => props.theme.colors.cardBackground};
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid ${props => props.theme.colors.border};
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    
    &:hover {
      background-color: ${props => props.theme.name === 'dark' ? '#2D3748' : '#f0f5f2'};
      transform: translateY(-2px);
    }
    
    .code {
      font-family: monospace;
      color: ${props => props.theme.colors.primary};
      font-size: 1.125rem;
      font-weight: 600;
      margin-right: 0.5rem;
    }
    
    .copy-icon {
      color: ${props => props.theme.colors.mutedText};
      font-size: 0.875rem;
    }
  }
  
  .info-text {
    text-align: center;
    font-size: 0.75rem;
    color: ${props => props.theme.colors.mutedText};
    margin-top: 0.5rem;
  }
`;

export default ({ code }) => {
    const { theme } = useTheme();
    
    return (
        <QRCodeContainer theme={theme}>
            <div className="qr-wrapper">
                <QRCode 
                    size={180} 
                    value={code} 
                    bgColor="#FFFFFF"
                    fgColor={theme.colors.primary}
                    level="H"
                    includeMargin={false}
                />
            </div>
            
            <CopyToClipboard 
                text={code} 
                onCopy={() => throwToast("success", `Code copied to clipboard: ${code}`)}
            >
                <div 
                    className="code-value"
                    aria-label={`Click to copy your code - ${code}`}
                    title={`Share this code with your peer`}
                >
                    <span className="code">{code}</span>
                    <i className="fas fa-copy copy-icon"></i>
                </div>
            </CopyToClipboard>
            <div className="info-text">Click to copy</div>
        </QRCodeContainer>
    );
}
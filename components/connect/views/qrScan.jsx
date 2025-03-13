import React, { useState } from 'react';
import styled from '@emotion/styled';
import dynamic from "next/dynamic";
import { useTheme } from '../../../context/ThemeContext';

const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

const ScannerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 300px;
  
  .scanner-wrapper {
    position: relative;
    width: 100%;
    border-radius: 0.5rem;
    overflow: hidden;
    
    /* Create scanner overlay effect */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 2px solid ${props => props.theme.colors.primary};
      border-radius: 0.5rem;
      box-shadow: 0 0 0 4px ${props => `${props.theme.colors.primary}30`};
      z-index: 10;
      pointer-events: none;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(to right, transparent, ${props => props.theme.colors.primary}, transparent);
      animation: scan 2s ease-in-out infinite;
      z-index: 10;
      pointer-events: none;
    }
    
    @keyframes scan {
      0% {
        top: 20%;
      }
      50% {
        top: 80%;
      }
      100% {
        top: 20%;
      }
    }
  }
  
  .instructions {
    color: ${props => props.theme.colors.mutedText};
    font-size: 0.875rem;
    margin-top: 1rem;
    text-align: center;
  }
`;

const QrScan = ({ onScan }) => {
    const [isScanning, setIsScanning] = useState(true);
    const { theme } = useTheme();
    
    const handleScan = (data) => {
        if (data) {
            setIsScanning(false);
            onScan(data);
        }
    };
    
    const handleError = (err) => {
        console.error("QR Scanner Error:", err);
    };
    
    return (
        <ScannerContainer theme={theme}>
            <div className="scanner-wrapper">
                <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '100%' }}
                    facingMode="environment"
                />
            </div>
            <div className="instructions">
                Point your camera at your peer's QR code
            </div>
        </ScannerContainer>
    );
};

export default QrScan;
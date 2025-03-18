import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '../../../context/ThemeContext';

import { Topbar } from "../../common";
import { PeerConnector } from "../../connect";
import { PopUp } from "../../ui";

const HeroSection = styled.section`
  background-color: ${props => props.theme.colors.background};
  min-height: 100vh;
  color: ${props => props.theme.colors.text};
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  
  .hero-container {
    flex: 1;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    @media (min-width: 768px) {
      padding-top: 6rem;
    }
  }
`;

const CenteredContent = styled.div`
  text-align: center;
  max-width: 900px;
  margin: 0 auto 3rem;
  padding: 0 1.5rem;
  
  .title {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    background: ${props => props.theme.colors.primaryGradient};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  
  .subtitle {
    font-size: 1.25rem;
    line-height: 1.6;
    color: ${props => props.theme.colors.mutedText};
    margin: 0 auto 2rem;
    max-width: 700px;
    
    @media (max-width: 768px) {
      font-size: 1.125rem;
    }
  }
`;

const ConnectorWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  
  /* Override for larger QR code and buttons */
  .qr-wrapper {
    img, canvas {
      width: 250px !important;
      height: 250px !important;
    }
  }
  
  /* Override for larger buttons */
  button {
    font-size: 1.125rem !important;
    padding: 1rem 1.5rem !important;
  }
`;

// Mobile-optimized connector styles
const FullScreenConnector = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background-color: ${props => props.theme.colors.background};
  
  /* Make QR code larger on mobile */
  .qr-wrapper {
    margin-bottom: 2rem;
    
    img, canvas {
      width: 280px !important;
      height: 280px !important;
    }
  }
  
  /* Code display */
  .code-value {
    margin-bottom: 2.5rem !important;
    padding: 0.75rem 1.25rem !important;
    font-size: 1.25rem !important;
  }
  
  /* Make buttons larger and full width */
  button {
    width: 100%;
    margin-bottom: 1rem;
    font-size: 1.25rem !important;
    padding: 1.25rem !important;
    border-radius: 0.75rem !important;
  }
  
  /* Add more space between elements */
  & > div {
    margin-bottom: 1.5rem;
    width: 100%;
  }

  /* Content container with padding */
  .content-container {
    padding: 2rem;
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const FeaturesList = styled.div`
  max-width: 1200px;
  margin: 3rem auto 0;
  padding: 0 1.5rem;
  
  .features-heading {
    text-align: center;
    margin-bottom: 2.5rem;
    
    h2 {
      font-size: 2rem;
      font-weight: 700;
      color: ${props => props.theme.colors.text};
      margin-bottom: 1rem;
    }
    
    p {
      color: ${props => props.theme.colors.mutedText};
      max-width: 600px;
      margin: 0 auto;
    }
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .feature-card {
    background-color: ${props => props.theme.colors.cardBackground};
    border-radius: 1rem;
    border: 1px solid ${props => props.theme.colors.border};
    padding: 1.5rem;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    .feature-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      background: ${props => props.theme.colors.darkGradient};
      
      i {
        font-size: 1.5rem;
        background: ${props => props.theme.colors.primaryGradient};
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    
    .feature-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: ${props => props.theme.colors.text};
      margin-bottom: 0.5rem;
    }
    
    .feature-description {
      color: ${props => props.theme.colors.mutedText};
      font-size: 0.9rem;
      line-height: 1.5;
    }
  }
`;

const FixedBottomButton = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 600;
  padding: 1rem;
  background-color: ${props => `${props.theme.colors.cardBackground}E6`};
  backdrop-filter: blur(10px);
  border-top: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  
  .button {
    display: block;
    width: 100%;
    background: ${props => props.theme.colors.primaryGradient};
    color: white;
    border: none;
    padding: 1.25rem;
    font-size: 1.125rem;
    font-weight: 600;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px ${props => `${props.theme.colors.primary}30`};
    }
    
    i {
      margin-right: 0.5rem;
      font-size: 1.25rem;
    }
  }
`;

const LoadingState = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  
  .title {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    
    i {
      color: #FBBF24;
      margin-right: 0.75rem;
    }
  }
  
  .message {
    color: ${props => props.theme.colors.mutedText};
    line-height: 1.5;
  }
`;

// Custom modal styles with improved close button
const customModalStyles = {
  content: {
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    padding: '0',
    border: 'none',
    background: 'none',
    borderRadius: '0',
    overflow: 'hidden'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 9999
  }
};

// Create a class for the React Modal close button to style it
const modalCloseBtnStyles = `
  .ReactModal__Close {
    position: fixed;
    top: 20px;
    right: 20px;
    color: white;
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
    z-index: 10001;
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }
  .ReactModal__Close:hover {
    opacity: 1;
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding: 1.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.mutedText};
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    padding-bottom: 6rem;
  }
`;

const Header = ({ myCode, isLoading, onConnect }) => {
    const [showConnector, setShowConnector] = useState(false);
    const { theme } = useTheme();

    return (
        <React.Fragment>
            <style>
                {modalCloseBtnStyles}
            </style>
            <Topbar />
            <HeroSection theme={theme}>
                <div className="hero-container">
                    <CenteredContent theme={theme}>
                        <h1 className="title">
                            Secure file transfers made simple
                        </h1>
                        <p className="subtitle">
                            Share files of any size between devices directly in your browser. 
                            No registration, no uploads, complete privacy.
                        </p>
                    </CenteredContent>
                    
                    {isLoading ? (
                        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
                            <LoadingState theme={theme}>
                                <div className="title">
                                    <i className="fas fa-sync-alt fa-spin"></i> Connecting to server
                                </div>
                                <p className="message">
                                    Please wait while we establish a connection to our signaling server. 
                                    This usually takes just a few seconds.
                                </p>
                            </LoadingState>
                        </div>
                    ) : (
                        <div className="d-none d-md-block">
                            <ConnectorWrapper>
                                <PeerConnector
                                    isLoading={isLoading}
                                    myCode={myCode}
                                    onConnect={onConnect}
                                />
                            </ConnectorWrapper>
                            
                            <p style={{ 
                                fontSize: "0.875rem", 
                                color: theme.colors.mutedText, 
                                marginTop: "1rem", 
                                textAlign: "center" 
                            }}>
                                Connection issues? Try refreshing to generate a new ID.
                            </p>
                        </div>
                    )}
                   
                </div>
            </HeroSection>
            
            <FixedBottomButton className="d-block d-md-none" theme={theme}>
                <button
                    className="button"
                    onClick={() => setShowConnector(true)}
                >
                    <i className="fas fa-exchange-alt"></i> Start Transferring
                </button>
            </FixedBottomButton>
            
            <PopUp
                isOpen={showConnector}
                onClose={() => setShowConnector(false)}
                appElement=".app"
                style={customModalStyles}
                closeTimeoutMS={300}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
            >
                <FullScreenConnector theme={theme}>
                    <div className="content-container">
                        <PeerConnector
                            isLoading={isLoading}
                            myCode={myCode}
                            onConnect={(code) => {
                                onConnect(code);
                                setShowConnector(false);
                            }}
                        />
                    </div>
                </FullScreenConnector>
            </PopUp>
        </React.Fragment>
    );
};

export default Header;
import React, { useState, useEffect, useRef } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import styled from '@emotion/styled';
import { useTheme } from '../../context/ThemeContext';
import { FileSelector } from "../files/modules";

import { FileSharedViewer, PeerCard } from './views';
import { Topbar } from "../common";

const ShareWindowContainer = styled.div`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    padding: 4rem 1rem 5rem;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    transition: all 0.3s ease;
    
    .container {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
    }
    
    .row {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -1rem;
      
      @media (max-width: 768px) {
        flex-direction: column;
        margin: 0;
      }
    }
    
    .col {
      flex: 1;
      padding: 0 1rem;
      margin-bottom: 2rem;
      
      @media (max-width: 768px) {
        padding: 0;
      }
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
      padding: 2rem 1rem 7rem;
      
      /* Make cards full width on mobile */
      .card {
        border-radius: 0.75rem;
        width: 100%;
      }
      
      /* Larger touch targets */
      button {
        padding: 1.25rem !important;
        font-size: 1.125rem !important;
        border-radius: 0.75rem !important;
        width: 100%;
      }
      
      /* Better spacing */
      .file-item, .shared-file-item {
        padding: 1.25rem !important;
        margin-bottom: 1rem !important;
      }
      
      /* Larger text for readability */
      h2, h3 {
        font-size: 1.5rem !important;
      }
      
      p, span {
        font-size: 1rem !important;
      }
    }
`;

const MobileNavBar = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: ${props => props.theme.colors.cardBackground};
    border-top: 1px solid ${props => props.theme.colors.border};
    padding: 0.5rem;
    z-index: 1000;
    box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
    justify-content: space-around;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }
`;

const NavButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem !important;
  background: transparent !important;
  border: none;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.mutedText};
  width: auto !important;
  border-radius: 0 !important;
  font-size: 0.75rem !important;
  transition: all 0.2s ease;
  
  i {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }
  
  &:hover, &:focus {
    color: ${props => props.theme.colors.primary};
  }
`;

const AddFileButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 4rem !important;
  height: 4rem !important;
  border-radius: 50% !important;
  background: ${props => props.theme.colors.primaryGradient} !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: none;
  margin-top: -1.5rem;
  position: relative;
  z-index: 1001;
  padding: 0 !important;
  font-size: 0.75rem !important;
  
  i {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }
`;

// Create a hidden file input that we'll trigger programmatically
const HiddenFileInput = styled.input`
  display: none;
`;

const Copyright = styled.div`
  text-align: center;
  padding: 1.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.mutedText};
  
  @media (max-width: 768px) {
    padding-bottom: 6rem;
  }
`;

const Share = (
    {
        myCode, peerCode, currentFile, isTransferring,
        filesReceived: filesReceivedProps, filesSent: filesSentProps,
        onSend, onCancel, onDisconnect
    }
) => {

    const [filesQueued, setFilesQueued] = useState([]);
    const [filesReceived, setFilesReceived] = useState(filesReceivedProps ? filesReceivedProps : []);
    const [filesSent, setFilesSent] = useState(filesSentProps ? filesSentProps : []);
    const [activeTab, setActiveTab] = useState('files');
    const { theme } = useTheme();
    const fileInputRef = useRef(null);

    // useBeforeunload(event => event.preventDefault());

    const isFileActive = (f) => f && f.status && !(f.status.state === 'sent' || f.status.state === 'received');
    const excludeFile = (file, files) => files.filter((f) => f.id !== file.id);

    const handleOnSelect = (files) => {
        setFilesQueued(filesQueued.length > 0 ? [...filesSent, ...files] : [...files])
    };

    useEffect(() => {
        if(filesQueued && filesQueued.length > 0 && !isFileActive(currentFile))
            onSend(filesQueued[0]);
    }, [filesQueued]);

    useEffect(() => {
        if(!isTransferring && filesQueued && filesQueued.length > 0 && !isFileActive(currentFile))
            onSend(filesQueued[0]);
    }, [isTransferring]);

    useEffect(() => {
        if(currentFile) {
            const newQ = excludeFile(currentFile, filesQueued);
            setFilesQueued([...newQ]);
        }
    }, [currentFile]);

    useEffect(() => {
        if(filesSentProps && filesSentProps.length !== filesSent.length)
            setFilesSent(filesSentProps);
    }, [filesSentProps]);

    useEffect(() => {
        if(filesReceivedProps && filesReceivedProps.length !== filesReceived.length)
            setFilesReceived(filesReceivedProps);
    }, [filesReceivedProps]);

    const getActiveQueue = () => {
        if(isFileActive(currentFile))
        {
            if(filesQueued.length > 0) {
                const newQ = excludeFile(currentFile, filesQueued);
                return [currentFile, ...newQ];
            }
            return [currentFile]
        }
        if(filesQueued.length > 0)
           return [...filesQueued];
        return [];
    };

    const handleCancel = (id) => {
        if(currentFile.id === id) onCancel(id);
        else {
            const newQ = excludeFile({ id }, filesQueued);
            setFilesQueued([...newQ]);
        }
    };

    const handleSaveReceived = (file) => {
        // Implementation of handleSaveReceived function
    };
    
    // Process files from the input directly
    const processFile = (file) => {
        return {
            id: Math.random().toString(36).substr(2, 9),
            file,
            url: file.size < 50 * 1024 * 1024 ? URL.createObjectURL(file) : null,
            meta: {
                name: file.name,
                type: file.type,
                size: file.size,
            },
            status: {
                state: "queued",
            }
        };
    };
    
    // Handle file selection from the hidden input
    const handleFileSelect = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const files = Array.from(event.target.files).map(processFile);
            handleOnSelect(files);
            // Reset input so the same file can be selected again
            event.target.value = '';
        }
    };
    
    // Trigger the file input when the add button is clicked
    const triggerFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return <React.Fragment>
        <Topbar />
        <ShareWindowContainer theme={theme}>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <PeerCard code={peerCode} onDisconnect={onDisconnect} />
                    </div>
                </div>
                <div className="row">
                    <div className="col" style={{ 
                        display: activeTab === 'history' && window.innerWidth <= 768 ? 'none' : 'block' 
                    }}>
                        <FileSelector
                            onSelect={handleOnSelect}
                            queue={getActiveQueue()}
                            onCancel={handleCancel}
                        />
                    </div>
                    <div className="col" style={{ 
                        display: activeTab === 'files' && window.innerWidth <= 768 ? 'none' : 'block' 
                    }}>
                        <FileSharedViewer
                            sent={filesSent}
                            received={filesReceived}
                            onSaveReceived={handleSaveReceived}
                        />
                    </div>
                </div>
                
                <Copyright theme={theme}>
                    Made by Robin &copy; {new Date().getFullYear()} All Rights Reserved
                </Copyright>
            </div>
        </ShareWindowContainer>
        
        <HiddenFileInput 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
        />
        
        <MobileNavBar theme={theme} className="d-md-none">
            <NavButton 
                onClick={() => setActiveTab('files')}
                active={activeTab === 'files'}
                theme={theme}
                aria-label="Files"
                title="Files"
            >
                <i className="fas fa-file-alt"></i>
                Files
            </NavButton>
            
            <AddFileButton 
                onClick={triggerFileSelect}
                theme={theme}
                aria-label="Add Files"
                title="Add Files"
            >
                <i className="fas fa-plus"></i>
            </AddFileButton>
            
            <NavButton 
                onClick={() => setActiveTab('history')}
                active={activeTab === 'history'}
                theme={theme}
                aria-label="History"
                title="History"
            >
                <i className="fas fa-history"></i>
                History
            </NavButton>
        </MobileNavBar>
    </React.Fragment>
};

export default Share;
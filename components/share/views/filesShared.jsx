import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '../../../context/ThemeContext';

import FileLister from '../../files/modules/Lister';

const FileSharedViewerContainer = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  padding: 1.5rem;
  border-radius: 1rem;
  margin-top: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 1.5rem;
    font-family: 'Poppins', sans-serif;
  }
  
  @media (max-width: 768px) {
    border-radius: 0.75rem;
    padding: 1.25rem;
    
    h3 {
      font-size: 1.375rem;
    }
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TabButton = styled.button`
  background: transparent;
  border: none;
  padding: 0.75rem 1.5rem;
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.mutedText};
  font-weight: ${props => props.active ? '600' : '400'};
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
  
  .count {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
    color: ${props => props.active ? 'white' : props.theme.colors.mutedText};
    font-size: 0.75rem;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
`;

const FilesShared = ({ sent, received, onSaveReceived }) => {
    const [activeTab, setActiveTab] = React.useState('received');
    const { theme } = useTheme();

    return (
        <FileSharedViewerContainer theme={theme}>
            <h3>Shared Files</h3>
            
            <TabContainer theme={theme}>
                <TabButton 
                    active={activeTab === 'received'} 
                    onClick={() => setActiveTab('received')}
                    theme={theme}
                >
                    Received
                    {received && received.length > 0 && (
                        <span className="count">{received.length}</span>
                    )}
                </TabButton>
                <TabButton 
                    active={activeTab === 'sent'} 
                    onClick={() => setActiveTab('sent')}
                    theme={theme}
                >
                    Sent
                    {sent && sent.length > 0 && (
                        <span className="count">{sent.length}</span>
                    )}
                </TabButton>
            </TabContainer>
            
            <div>
                {activeTab === 'received' && (
                    <FileLister
                        files={received}
                        showSaveButton
                        onSave={onSaveReceived}
                        labels={{
                            noFilesShared: "No files received yet."
                        }}
                    />
                )}
                
                {activeTab === 'sent' && (
                    <FileLister
                        files={sent}
                        labels={{
                            noFilesShared: "You haven't sent any files yet."
                        }}
                    />
                )}
            </div>
        </FileSharedViewerContainer>
    );
};

export default FilesShared;
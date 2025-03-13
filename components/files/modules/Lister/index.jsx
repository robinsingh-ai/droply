import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import FileViewer from '../Viewer';

const FileListerContainer = styled.div`
  max-height: 75vh;
  overflow-y: auto;
  
  /* Customize scrollbar for dark theme */
  &.minimal-scrollbar {
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #1F2937;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #4B5563;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: #60A5FA;
    }
  }
`;

const EmptyListContainer = styled.div`
    min-height: 15vh;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: #9CA3AF;
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #6B7280;
      }
      
      h4 {
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        font-weight: 600;
        font-size: 1.15rem;
        color: white;
      }
    }
`;

const defaultLabels = {
    noFilesShared: 'No Files Shared.'
};

export default ({
    files: filesProp, labels: labelsProp,
    showSaveButton, allowCancel,
    onCancel,
}) => {

    const [files, setFiles] = useState(filesProp);

    const labels = {...defaultLabels, ...labelsProp};

    useEffect(() => {
        setFiles(filesProp);
    }, [filesProp]);

    return files && files instanceof Array && files.length > 0 ?
    <FileListerContainer className="minimal-scrollbar">
    {files.map((f) =>
        <div key={f.id} className="p-2">
            <FileViewer
                fileData={f}
                showSaveButton={showSaveButton}
                showCancelButton={allowCancel}
                onCancel={onCancel}
            />
        </div>
    )}
    </FileListerContainer> :
    <EmptyListContainer>
        <div className="empty-state">
            <i className="fas fa-file-alt"></i>
            <h4>{labels.noFilesShared}</h4>
        </div>
    </EmptyListContainer>
}
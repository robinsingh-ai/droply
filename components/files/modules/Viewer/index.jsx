import React from 'react';
import styled from '@emotion/styled';
import { FilePreview } from '../../views/';

const ErrorContainer = styled.div`
  background-color: #1F2937;
  border-radius: 0.75rem;
  padding: 1rem;
  color: #EF4444;
  border: 1px solid #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  i {
    font-size: 1.25rem;
  }
  
  div {
    font-weight: 500;
  }
`;

const Index = ({ fileData, showSaveButton, showCancelButton, onCancel }) => {

    const handleDownload = () => {
        const tempLink = document.createElement('a');
        tempLink.href = fileData.url;
        tempLink.setAttribute('download', fileData.meta.name);
        tempLink.click();
    };

    return <div>{fileData?
        <FilePreview
            {...fileData}
            onSave={handleDownload}
            showSaveButton={showSaveButton}
            showCancelButton={showCancelButton}
            onCancel={() => onCancel(fileData.id)}
        />
        : <ErrorContainer>
            <i className="fas fa-exclamation-triangle"></i>
            <div>File Damaged. Ask to Resend</div>
        </ErrorContainer>
    }</div>;
};

export default Index;
import React from 'react';
import styled from '@emotion/styled';
import { getFileIconFromMIME } from "../../../../../functions";

const FilePreviewContainer = styled.div`
  .file-preview {
    display: flex;
    align-items: center;
    
    .file-icon {
      flex: 0 0 3rem;
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #374151;
      border-radius: 0.5rem;
      margin-right: 1rem;
      
      img {
        width: 1.75rem;
        height: auto;
        filter: brightness(1.1);
      }
    }
    
    .file-info {
      flex: 1;
      min-width: 0;
      
      .file-name {
        font-weight: 600;
        color: white;
        font-size: 1.1rem;
        margin-bottom: 0.25rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .file-type {
        color: #9CA3AF;
        font-size: 0.875rem;
        text-transform: uppercase;
      }
    }
  }
`;

export default ({ meta: { name, type }, }) => {
    const fileType = type.split('/')[1] || type;
    
    return (
        <FilePreviewContainer>
            <div className="file-preview">
                <div className="file-icon">
                    <img src={getFileIconFromMIME(type)} alt="file" />
                </div>
                <div className="file-info">
                    <div className="file-name" title={name}>{name}</div>
                    <div className="file-type">{fileType}</div>
                </div>
            </div>
        </FilePreviewContainer>
    );
};
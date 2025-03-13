import React, { useEffect } from 'react';
import shortid from 'shortid';
import {useDropzone} from 'react-dropzone';
import styled from '@emotion/styled';

import FileLister from '../Lister';

const FileSelectorWrap = styled.div`
  background-color: #1F2937;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  border: 1px solid #374151;
  color: white;
  
  h4 {
    font-weight: 600;
    margin-bottom: 1rem;
    font-family: 'Poppins', sans-serif;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    span.count {
      background: linear-gradient(to right, #2563EB, #60A5FA);
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
    }
  }
  
  .dropzone {
    border: 2px dashed #4B5563;
    padding: 2.5rem;
    border-radius: 0.75rem;
    background-color: #111827;
    transition: all 0.2s ease;
    
    &:hover {
      border-color: #60A5FA;
      background-color: rgba(96, 165, 250, 0.05);
    }
    
    button {
      border-radius: 0.5rem;
      font-size: 1.15rem;
      font-weight: 600;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(to right, #2563EB, #60A5FA);
      border: none;
      color: white;
      transition: all 0.2s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
      }
    }
    
    span {
      display: block;
      margin-top: 1rem;
      color: #9CA3AF;
      text-align: center;
    }
  }
  
  .bg-light {
    background-color: #111827 !important;
    border: 1px solid #374151;
    border-radius: 0.75rem;
  }
`;

const FooterFileSelector = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  background: rgba(17, 24, 39, 0.9);
  backdrop-filter: blur(10px);
  z-index: 600;
  
  button {
    width: 100%;
    font-size: 1.15rem;
    padding: 1rem;
    background: linear-gradient(to right, #2563EB, #60A5FA);
    border: none;
    color: white;
    font-weight: 600;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
    }
  }
`;

export default ({ queue, onSelect, onCancel }) => {

    const getFileURL = (file) => {
        const fileSize = file.size / (1024 * 1024);
        if(fileSize < 50) return URL.createObjectURL(file);
        else return null;
    };

    const processFile = (file) => {
        return {
            id: shortid.generate(),
            file,
            url: getFileURL(file),
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

    const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({ noClick: true, noKeyboard: true });

    useEffect(() => {
        if(acceptedFiles && acceptedFiles.length>0)
        {
            const files = [];
            acceptedFiles.forEach((f) => {
                files.push(processFile(f));
            });
            onSelect(files);
        }
    }, [acceptedFiles]);

    const renderMobileSelector =
    <FooterFileSelector>
        <button
            aria-label="Select Files to Send"
            title="Select Files to Send"
            type="button"
            onClick={open}
        >
            <i className="fas fa-file-upload mr-2"></i> Select File(s)
        </button>
    </FooterFileSelector>;

    const renderLargeScreenSelector =
    <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <div className="d-flex align-items-center justify-content-center">
            <div>
                <div className="d-flex justify-content-center">
                    <button
                        aria-label="Select Files to Send"
                        title="Select Files to Send"
                        type="button"
                        onClick={open}
                    >
                        <i className="fas fa-file-upload mr-2"></i> Select File(s)
                    </button>
                </div>
                <div className="d-none d-md-block">
                    <span>You may also drag and drop files here</span>
                </div>
            </div>
        </div>
    </div>;

    return <FileSelectorWrap>
        <div className="d-block d-md-none">
            {renderMobileSelector}
        </div>
        <div className="d-none d-md-block">
            {renderLargeScreenSelector}
        </div>
        <div className="mt-md-4">
            <h4 className="p-2 my-2">
                <span>Queue</span>
                <span className="count">{queue && queue.length > 0 ? queue.length : 0}</span>
            </h4>
            <div className="bg-light rounded p-2">
                <FileLister
                    files={queue}
                    allowCancel
                    onCancel={onCancel}
                    labels={{ noFilesShared: "No files pending." }}
                />
            </div>
        </div>
    </FileSelectorWrap>;
}
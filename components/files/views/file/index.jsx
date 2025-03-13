import React from 'react';
import styled from '@emotion/styled';
import prettyBytes from 'pretty-bytes';

import ImagePreview from './previews/image';
import VideoPreview from './previews/video';
import AudioPreview from './previews/audio';
import FilePreview from './previews/file';

import { getFileTypeFromMIME } from "../../../../functions";

const FilePreviewContainer = styled.div`
  padding: 1.25rem;
  font-size: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #374151;
  background-color: ${({progress}) => progress ? 
    `linear-gradient(to right, rgba(16, 185, 129, 0.2) ${progress}%, #111827 ${progress}%)` : 
    `#111827`};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #4B5563;
  }
`;

const FileActionButton = styled.button`
  background: transparent;
  color: ${props => props.variant === 'cancel' ? '#F43F5E' : '#60A5FA'};
  border: 1.5px solid;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:focus, &:hover {
    outline: none;
    background: ${props => props.variant === 'cancel' ? '#F43F5E' : '#2563EB'};
    color: white;
    transform: translateY(-2px);
  }
  
  i {
    margin-right: 0.5rem;
    font-size: 0.875rem;
  }
`;

const StatusText = styled.span`
  font-weight: 600;
  color: ${props => props.success ? '#10B981' : '#EF4444'};
`;

const SizeText = styled.span`
  color: #9CA3AF;
  font-size: 0.875rem;
  margin-left: 0.5rem;
`;

const Index = (
    {
        url, status: { progress, state, kbps }, meta, useStream,
        showSaveButton, showCancelButton,
        onSave, onCancel
    }
) => {

    const renderStateText =
    state === 'processing' ? <StatusText success>Processing</StatusText> :
    state === 'queued' ? <StatusText success>Queued</StatusText> :
    state === 'sent' ? <StatusText success>Sent</StatusText> :
    state === 'received' ? <StatusText success>Received</StatusText> :
    state === 'sending' ? <StatusText success>Sending {kbps && `at ${kbps} KB/s`}</StatusText> :
    state === 'receiving' ? <StatusText success>Receiving {kbps && `at ${kbps} KB/s`}</StatusText> :
    state === 'failed' ? <StatusText>Failed</StatusText>:
    <StatusText>Unknown Error</StatusText>;

    const renderSaveButton = showSaveButton ?
    <FileActionButton
        role="button"
        title="Save to Device"
        aria-label="Save File to Device"
        onClick={onSave}
    >
        <i className="fas fa-download"></i>
        Save
    </FileActionButton>
    : null;

    const renderCancelButton = showCancelButton ?
    <FileActionButton
        role="button"
        title="Cancel Transfer"
        aria-label="Cancel Transfer"
        onClick={onCancel}
        variant="cancel"
    >
        <i className="fas fa-times"></i>
        Cancel
    </FileActionButton>
    : null;

    const isTransferred = state === 'received' || state === 'sent';

    const renderTitle = () => <FilePreview url={url} meta={meta} />

    const renderPreview = () => {
        const type = getFileTypeFromMIME(meta.type);
        if(type === 'audio') return <AudioPreview isTransferred={isTransferred} url={url} meta={meta} />;
        if(type === 'video') return <VideoPreview isTransferred={isTransferred} url={url} meta={meta} />;
        if(type === 'image') return <ImagePreview url={url} meta={meta} />;
        return renderTitle();
    };

    const renderTransferSize = () => {
        if(meta && meta.size) {
            if(progress && progress < 100)
                return <SizeText>{prettyBytes(meta.size*(progress/100))} / {prettyBytes(meta.size)}</SizeText>;
            return <SizeText>{prettyBytes(meta.size)}</SizeText>
        }
        return <SizeText>-- / --</SizeText>;
    };

    return <FilePreviewContainer
        progress={(state === 'sending' || state === 'receiving' )? progress : null}
    >
        {useStream ? renderTitle() : renderPreview()}
        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
            <div className="d-flex align-items-center">
                {renderStateText}
                {renderTransferSize()}
            </div>
            <div className="d-flex align-items-center mt-2 mt-sm-0">
                {useStream? null : renderSaveButton}
                {renderCancelButton}
            </div>
        </div>
    </FilePreviewContainer>
};

export default Index;
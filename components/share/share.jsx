import React, { useState, useEffect, useRef } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import styled from '@emotion/styled';
import { useTheme } from '../../context/ThemeContext';
import { FileSelector } from "../files/modules";

import { FileSharedViewer, PeerCard } from './views';
import { Topbar } from "../common";

// Main container with a more modern, asymmetric design
const ShareWindowContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: ${props => props.theme.isDark ? 
      'linear-gradient(135deg, #121212 0%, #1e1e24 100%)' : 
      'linear-gradient(135deg, #f8f9ff 0%, #eef1f5 100%)'};
    color: ${props => props.theme.colors.text};
    transition: all 0.4s ease;
    position: relative;
    overflow-x: hidden;
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${props => props.theme.isDark ?
        'radial-gradient(circle at 15% 50%, rgba(25, 118, 210, 0.1) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(126, 87, 194, 0.1) 0%, transparent 50%)' :
        'radial-gradient(circle at 15% 50%, rgba(66, 165, 245, 0.08) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(156, 39, 176, 0.08) 0%, transparent 50%)'};
      z-index: 0;
    }
    
    /* Designer diagonal elements */
    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 35%;
      height: 100%;
      background: ${props => props.theme.isDark ? 
        'linear-gradient(135deg, transparent 40%, rgba(33, 33, 38, 0.4) 100%)' : 
        'linear-gradient(135deg, transparent 40%, rgba(240, 242, 250, 0.5) 100%)'};
      z-index: 0;
      clip-path: polygon(100% 0, 0% 100%, 100% 100%);
    }
    
    .content-wrapper {
      position: relative;
      z-index: 1;
      padding: 5.5rem 1.5rem 6rem;
      
      @media (min-width: 768px) {
        padding: 7rem 2rem 3rem;
      }
    }

    .container {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      position: relative;
    }
    
    .card-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
      
      @media (min-width: 768px) {
        grid-template-columns: 1fr;
        max-width: 800px;
        margin: 0 auto;
      }
    }
    
    /* Modern 3D Card style */
    .glass-card {
      background: ${props => props.theme.isDark ? 
        'rgba(40, 40, 45, 0.5)' : 
        'rgba(255, 255, 255, 0.7)'};
      border-radius: 1.25rem;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid ${props => props.theme.isDark ? 
        'rgba(255, 255, 255, 0.08)' : 
        'rgba(255, 255, 255, 0.7)'};
      box-shadow: ${props => props.theme.isDark ?
        '0 8px 32px rgba(0, 0, 0, 0.3)' :
        '0 8px 32px rgba(0, 0, 0, 0.05)'};
      padding: 1.75rem;
      position: relative;
      overflow: hidden;
      transform-style: preserve-3d;
      perspective: 1000px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      
      &:hover {
        transform: translateY(-5px) rotateX(3deg);
        box-shadow: ${props => props.theme.isDark ?
          '0 12px 40px rgba(0, 0, 0, 0.4)' :
          '0 12px 40px rgba(0, 0, 0, 0.08)'};
      }
      
      /* Card accent line */
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 4px;
        background: ${props => props.theme.colors.primaryGradient};
        border-radius: 2px 0 0 2px;
      }
      
      /* Card inner glow */
      &:after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle at center, 
          ${props => props.theme.isDark ? 
            'rgba(255, 255, 255, 0.015) 0%, transparent 50%' : 
            'rgba(255, 255, 255, 0.5) 0%, transparent 60%'});
        opacity: 0;
        transition: opacity 0.6s ease;
        pointer-events: none;
        transform: translateZ(-10px);
      }
      
      &:hover:after {
        opacity: 1;
      }
    }
    
    .card-header {
      display: flex;
      align-items: center;
      margin-bottom: 1.25rem;
      
      .card-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: ${props => props.theme.colors.primaryGradient};
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
        color: white;
        font-size: 1.25rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .card-title {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0;
        background: ${props => props.theme.colors.primaryGradient};
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -0.02em;
      }
    }
    
    /* Unique styled buttons */
    .btn {
      background: ${props => props.theme.isDark ? 
        'rgba(70, 70, 75, 0.3)' : 
        'rgba(255, 255, 255, 0.7)'};
      border: 1px solid ${props => props.theme.isDark ? 
        'rgba(255, 255, 255, 0.08)' : 
        'rgba(240, 240, 245, 0.8)'};
      color: ${props => props.theme.colors.text};
      font-weight: 600;
      padding: 0.875rem 1.5rem;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(5px);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        background: ${props => props.theme.isDark ? 
          'rgba(80, 80, 85, 0.4)' : 
          'rgba(255, 255, 255, 0.9)'};
      }
      
      &.btn-primary {
        background: ${props => props.theme.colors.primaryGradient};
        border: none;
        color: white;
        box-shadow: 0 4px 12px ${props => props.theme.isDark ? 
          'rgba(30, 136, 229, 0.2)' : 
          'rgba(30, 136, 229, 0.3)'};
        
        &:hover {
          box-shadow: 0 6px 16px ${props => props.theme.isDark ? 
            'rgba(30, 136, 229, 0.3)' : 
            'rgba(30, 136, 229, 0.4)'};
        }
      }
      
      i {
        margin-right: 0.5rem;
        font-size: 1.1em;
      }
    }
    
    /* File item with advanced styling */
    .file-item {
      background: ${props => props.theme.isDark ? 
        'rgba(50, 50, 55, 0.4)' : 
        'rgba(250, 250, 255, 0.7)'};
      border-radius: 12px;
      border: 1px solid ${props => props.theme.isDark ? 
        'rgba(255, 255, 255, 0.05)' : 
        'rgba(240, 240, 245, 0.8)'};
      padding: 1rem 1.25rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      transition: all 0.3s ease;
      backdrop-filter: blur(5px);
      
      &:hover {
        transform: translateX(4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        border-left: 3px solid ${props => props.theme.colors.primary};
      }
      
      .file-icon {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
        background: ${props => props.theme.colors.primaryGradient};
        color: white;
        font-size: 1.25rem;
        flex-shrink: 0;
      }
      
      .file-info {
        flex: 1;
        
        .file-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .file-meta {
          color: ${props => props.theme.colors.mutedText};
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          
          span {
            margin-right: 0.75rem;
            display: flex;
            align-items: center;
            
            i {
              margin-right: 0.25rem;
              font-size: 0.9em;
              opacity: 0.7;
            }
          }
        }
      }
      
      .file-actions {
        display: flex;
        align-items: center;
        
        button {
          background: transparent;
          border: none;
          color: ${props => props.theme.colors.mutedText};
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          margin-left: 0.25rem;
          
          &:hover {
            background: ${props => props.theme.isDark ? 
              'rgba(255, 255, 255, 0.08)' : 
              'rgba(0, 0, 0, 0.05)'};
            color: ${props => props.theme.colors.primary};
          }
        }
      }
    }
    
    /* Stylish progress bar */
    .progress-container {
      background: ${props => props.theme.isDark ? 
        'rgba(30, 30, 35, 0.3)' : 
        'rgba(240, 240, 245, 0.6)'};
      border-radius: 10px;
      height: 12px;
      width: 100%;
      overflow: hidden;
      margin: 1rem 0;
      position: relative;
      backdrop-filter: blur(5px);
      
      .progress-bar {
        height: 100%;
        background: ${props => props.theme.colors.primaryGradient};
        border-radius: 10px;
        transition: width 0.3s ease;
        display: flex;
        justify-content: flex-end;
        
        &:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.15) 50%,
            transparent 100%
          );
          animation: shimmer 2s infinite;
          background-size: 200% 100%;
        }
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    }
    
    /* Empty state styling */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
      text-align: center;
      
      .empty-icon {
        width: 80px;
        height: 80px;
        margin-bottom: 1.5rem;
        opacity: 0.7;
      }
      
      h3 {
        font-size: 1.25rem;
        margin-bottom: 0.75rem;
        font-weight: 600;
      }
      
      p {
        color: ${props => props.theme.colors.mutedText};
        margin-bottom: 1.5rem;
        max-width: 300px;
      }
    }
    
    /* Animations */
    @keyframes fadeInUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    
    .animate-in {
      opacity: 0;
      animation: fadeInUp 0.5s forwards;
    }
    
    /* Custom scroll bar */
    .scroll-area {
      max-height: 400px;
      overflow-y: auto;
      padding-right: 0.5rem;
      
      &::-webkit-scrollbar {
        width: 6px;
      }
      
      &::-webkit-scrollbar-track {
        background: ${props => props.theme.isDark ? 
          'rgba(255, 255, 255, 0.05)' : 
          'rgba(0, 0, 0, 0.05)'};
        border-radius: 3px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: ${props => props.theme.isDark ? 
          'rgba(255, 255, 255, 0.2)' : 
          'rgba(0, 0, 0, 0.15)'};
        border-radius: 3px;
        
        &:hover {
          background: ${props => props.theme.isDark ? 
            'rgba(255, 255, 255, 0.3)' : 
            'rgba(0, 0, 0, 0.25)'};
        }
      }
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
      .glass-card {
        padding: 1.25rem;
      }
      
      .btn {
        width: 100%;
      }
    }
`;

// Modern mobile navigation with subtle depth and interaction
const MobileNavBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: ${props => props.theme.isDark ? 
    'rgba(30, 30, 35, 0.8)' : 
    'rgba(255, 255, 255, 0.85)'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid ${props => props.theme.isDark ? 
    'rgba(255, 255, 255, 0.05)' : 
    'rgba(0, 0, 0, 0.05)'};
  z-index: 100;
  padding: 0.75rem 1.5rem 1.25rem;
  display: flex;
  justify-content: space-around;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);
  transform: translateZ(0);
  
  @media (min-width: 769px) {
    display: none;
  }
`;

// Nav button with subtle hover effects
const NavButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.active ? 
    props.theme.colors.primary : 
    props.theme.colors.mutedText};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  width: 33%;
  
  i {
    font-size: 1.25rem;
    margin-bottom: 0.375rem;
    transition: transform 0.3s ease;
  }
  
  span {
    font-size: 0.75rem;
    font-weight: ${props => props.active ? 600 : 500};
    transition: all 0.3s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    width: ${props => props.active ? '1.5rem' : '0'};
    height: 3px;
    background: ${props => props.theme.colors.primaryGradient};
    border-radius: 3px;
    transition: all 0.3s ease;
  }
  
  &:hover {
    background: ${props => props.theme.isDark ? 
      'rgba(255, 255, 255, 0.05)' : 
      'rgba(0, 0, 0, 0.03)'};
    
    i {
      transform: translateY(-2px);
      color: ${props => props.theme.colors.primary};
    }
    
    &::after {
      width: ${props => props.active ? '1.5rem' : '0.75rem'};
    }
  }
`;

// Floating action button
const AddFileButton = styled.button`
  width: 58px;
  height: 58px;
  border-radius: 16px;
  background: ${props => props.theme.colors.primaryGradient};
  border: none;
  color: white;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  position: relative;
  margin-top: -35px;
  transform: translateY(0);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 101;
  
  &:hover, &:focus {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0) scale(0.95);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%);
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

// Hidden file input
const HiddenFileInput = styled.input`
  display: none;
`;

// Footer with subtle design
const Copyright = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.mutedText};
  padding: 1.5rem 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 1px;
    background: ${props => props.theme.isDark ? 
      'rgba(255, 255, 255, 0.1)' : 
      'rgba(0, 0, 0, 0.1)'};
  }
  
  @media (max-width: 768px) {
    padding-bottom: 5rem;
  }
`;

// Transfer status indicator with pulse animation
const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => 
    props.status === 'received' ? '#4CAF50' :
    props.status === 'sent' ? '#2196F3' :
    props.status === 'sending' || props.status === 'receiving' ? '#FF9800' :
    props.status === 'error' ? '#F44336' : '#9E9E9E'
  };
  position: relative;
  margin-left: 0.75rem;
  
  ${props => (props.status === 'sending' || props.status === 'receiving') && `
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 24px;
      height: 24px;
      margin-top: -12px;
      margin-left: -12px;
      border-radius: 50%;
      background-color: ${
        props.status === 'sending' ? 'rgba(255, 152, 0, 0.3)' :
        props.status === 'receiving' ? 'rgba(255, 152, 0, 0.3)' : 'transparent'
      };
      animation: pulse-ring 1.5s ease infinite;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 12px;
      height: 12px;
      margin-top: -6px;
      margin-left: -6px;
      border-radius: 50%;
      background-color: ${
        props.status === 'sending' ? '#FF9800' :
        props.status === 'receiving' ? '#FF9800' : 'transparent'
      };
      animation: pulse-dot 1.5s ease-in-out infinite;
    }
  `}
  
  @keyframes pulse-ring {
    0% {
      transform: scale(0.5);
      opacity: 0.5;
    }
    80%, 100% {
      opacity: 0;
      transform: scale(2);
    }
  }
  
  @keyframes pulse-dot {
    0% {
      transform: scale(0.8);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(0.8);
    }
  }
`;

// Add a new styled component for the connection status
const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: ${props => props.theme.isDark ? 
    'rgba(40, 40, 45, 0.4)' : 
    'rgba(255, 255, 255, 0.6)'};
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.isDark ? 
    'rgba(255, 255, 255, 0.05)' : 
    'rgba(240, 240, 245, 0.8)'};
  margin-bottom: 1rem;

  .connection-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .status-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: ${props => props.theme.colors.primaryGradient};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
    }

    .details {
      .label {
        font-size: 0.75rem;
        color: ${props => props.theme.colors.mutedText};
        margin-bottom: 0.25rem;
      }

      .code {
        font-weight: 600;
        font-size: 1rem;
        color: ${props => props.theme.colors.text};
      }
    }
  }

  .disconnect-btn {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    background: ${props => props.theme.isDark ? 
      'rgba(244, 67, 54, 0.1)' : 
      'rgba(244, 67, 54, 0.05)'};
    color: #f44336;
    border: 1px solid rgba(244, 67, 54, 0.2);
    transition: all 0.3s ease;

    &:hover {
      background: rgba(244, 67, 54, 0.15);
      transform: translateY(-1px);
    }

    i {
      margin-right: 0.5rem;
      font-size: 0.875rem;
    }
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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
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
        if(currentFile && currentFile.id === id) onCancel(id);
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

    // Add staggered animation when component mounts
    useEffect(() => {
        const elements = document.querySelectorAll('.animate-in');
        elements.forEach((el, i) => {
            el.style.animationDelay = `${i * 0.15}s`;
        });
    }, []);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <React.Fragment>
        <Topbar />
        <ShareWindowContainer theme={theme}>
            <div className="content-wrapper">
                <div className="container">
                    <ConnectionStatus theme={theme}>
                        <div className="connection-info">
                            <div className="status-icon">
                                <i className="fas fa-link"></i>
                            </div>
                            <div className="details">
                                <div className="label">Connected to</div>
                                <div className="code">{peerCode}</div>
                            </div>
                        </div>
                        <button className="disconnect-btn" onClick={onDisconnect}>
                            <i className="fas fa-times"></i>
                            Disconnect
                        </button>
                    </ConnectionStatus>

                    {/* Files Section */}
                    <div className="glass-card animate-in" 
                        style={{
                            animationDelay: '0.2s',
                            display: isMobile && activeTab !== 'files' ? 'none' : 'block'
                        }}>
                        <div className="card-header">
                            <div className="card-icon">
                                <i className="fas fa-file-upload"></i>
                            </div>
                            <h2 className="card-title">Share Files</h2>
                        </div>
                        
                        <FileSelector
                            onSelect={handleOnSelect}
                            queue={getActiveQueue()}
                            onCancel={handleCancel}
                        />

                        {isTransferring && currentFile && currentFile.status && (
                            <div className="transfer-status" style={{
                                marginTop: '1.5rem',
                                padding: '1.25rem',
                                background: theme.isDark ? 'rgba(30, 30, 35, 0.4)' : 'rgba(245, 245, 250, 0.7)',
                                borderRadius: '12px',
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
                            }}>
                                <div style={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.75rem'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <i className="fas fa-exchange-alt" style={{
                                            marginRight: '0.5rem',
                                            color: theme.colors.primary
                                        }}></i>
                                        <span style={{ 
                                            fontWeight: 600,
                                            fontSize: '0.95rem'
                                        }}>
                                            {currentFile.status.state === 'sending' ? 'Sending File' : 
                                             currentFile.status.state === 'receiving' ? 'Receiving File' : 
                                             'Processing File'}
                                        </span>
                                    </div>
                                    <StatusIndicator status={currentFile.status.state} />
                                </div>
                                
                                <div className="progress-container">
                                    <div className="progress-bar" style={{
                                        width: `${currentFile.status.progress}%`
                                    }}></div>
                                </div>
                                
                                <div style={{ 
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '0.75rem'
                                }}>
                                    <div style={{
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        maxWidth: '80%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {currentFile.meta && currentFile.meta.name}
                                    </div>
                                    <div style={{
                                        fontSize: '0.8rem',
                                        color: theme.colors.mutedText
                                    }}>
                                        {currentFile.status.progress}%
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* History Section */}
                    <div className="glass-card animate-in" 
                        style={{
                            animationDelay: '0.3s',
                            display: isMobile && activeTab !== 'history' ? 'none' : 'block',
                            marginBottom: isMobile ? '6rem' : '2rem'
                        }}>
                        <div className="card-header">
                            <div className="card-icon">
                                <i className="fas fa-history"></i>
                            </div>
                            <h2 className="card-title">Transfer History</h2>
                        </div>
                        
                        <FileSharedViewer
                            sent={filesSent}
                            received={filesReceived}
                            onSaveReceived={handleSaveReceived}
                        />
                    </div>

                    <Copyright theme={theme}>
                        Made by Robin &copy; {new Date().getFullYear()} All Rights Reserved
                    </Copyright>
                </div>
            </div>
        </ShareWindowContainer>
        
        <HiddenFileInput 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
        />
        
        <MobileNavBar theme={theme}>
            <NavButton 
                className="nav-button"
                onClick={() => setActiveTab('files')}
                active={activeTab === 'files'}
                theme={theme}
                aria-label="Files"
                title="Files"
            >
                <i className="fas fa-file-upload"></i>
                <span>Files</span>
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
                className="nav-button"
                onClick={() => setActiveTab('history')}
                active={activeTab === 'history'}
                theme={theme}
                aria-label="History"
                title="History"
            >
                <i className="fas fa-history"></i>
                <span>History</span>
            </NavButton>
        </MobileNavBar>
    </React.Fragment>
};

export default Share;
import { useEffect, useState } from 'react';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { throwToast } from '../functions';
import { getFileFromChunks, FileChunker } from '../functions';

const prodConfig = {
    host: process.env.NEXT_PUBLIC_PEER_HOST?.replace('https://', '').replace('/', '') || 'localhost',
    secure: process.env.NODE_ENV === 'production',
    port: process.env.NODE_ENV === 'production' ? 443 : 9000,
    path: '/droply',
    key: 'peerjs',
    debug: process.env.NODE_ENV === 'production' ? 0 : 3,
    config: {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' },
            {
                urls: 'turn:openrelay.metered.ca:80',
                username: 'openrelayproject',
                credential: 'openrelayproject'
            },
            {
                urls: 'turn:openrelay.metered.ca:443',
                username: 'openrelayproject',
                credential: 'openrelayproject'
            },
            {
                urls: 'turn:openrelay.metered.ca:443?transport=tcp',
                username: 'openrelayproject',
                credential: 'openrelayproject'
            }
        ],
        sdpSemantics: 'unified-plan',
        iceTransportPolicy: 'all'
    },
    pingInterval: 3000,
    reconnectTimer: 2000,
    retries: 7
};

/* const prodConfig = {
     host: '10.0.0.9',
     secure: false,
     port: 9000,
     path: '/myapp',
     debug: 0
 };*/

const nameGeneratorConfig = {
    dictionaries: [colors, adjectives, animals],
    separator: '-',
    length: 3,
    style: 'capital'
};

const generateUniqueId = () => {
    return uniqueNamesGenerator(nameGeneratorConfig);
};

const usePeer = () => {
    const [myself, setMyself] = useState(null);
    const [myPeer, setMyPeer] = useState(null);
    const [data, setData] = useState(null);
    const [isConnected, setConnected] = useState(false);
    const [myConnection, setConnection] = useState(null);

    const cleanUp = () => {
        setMyPeer(null);
        setConnection(null);
        setConnected(false);
    };

    const disconnect = () => {
        myConnection.send({ type: "disconnect" });
        cleanUp();
        throwToast("success", `You have been disconnected from ${myPeer.id}.`);
    };

    const handlePeerOpen = (peer) => {
        setMyself(peer);
        setConnected(true);
    };

    const handlePeerConnection = (connection) => {
        setConnection(connection);
        setMyPeer(connection.peer);
        connection.on('open', () => {
            setConnected(true);
            throwToast("success", `You are now connected to ${connection.peer.id}`);
        });
        connection.on('data', handleReceiveData);
        connection.on('close', cleanUp);
    };

    const handlePeerDisconnect = () => {
        console.log("Peer disconnected");
        cleanUp()
    };

    const handlePeerClose = () => {
        console.log("Peer closed remotely");
        cleanUp();
    };

    const handlePeerError = (error) => {
        console.error("Peer error:", error);
        
        if (error.type === 'network' || error.type === 'disconnected') {
            throwToast("error", "Network connection lost. Attempting to reconnect...");
            setTimeout(() => {
                if (typeof window !== 'undefined') {
                    initializePeer();
                }
            }, 2000);
        } else if (error.type === 'peer-unavailable') {
            throwToast("error", "The peer you're trying to connect to is not available or may be behind a strict firewall.");
        } else if (error.type === 'server-error') {
            throwToast("error", "Server connection error. Please try again in a moment.");
        } else if (error.type === 'webrtc') {
            throwToast("error", "WebRTC connection failed. Please ensure both devices allow WebRTC connections.");
        } else {
            throwToast("error", "Connection error. Please try refreshing the page.");
        }
        
        cleanUp();
    };

    useEffect(() => {
        let peer = null;
        let reconnectAttempts = 0;
        let reconnectTimer = null;
        const maxReconnectAttempts = prodConfig.retries;
        
        const initializePeer = async () => {
            try {
                const PeerJs = await import('peerjs');
                const myName = generateUniqueId();
                
                if (peer) {
                    peer.destroy();
                }
                
                peer = new PeerJs.default(myName, prodConfig);

                if (reconnectTimer) {
                    clearTimeout(reconnectTimer);
                    reconnectTimer = null;
                }

                peer.on('open', () => {
                    console.log("Peer connection established");
                    reconnectAttempts = 0;
                    handlePeerOpen(peer);
                });
                
                peer.on('connection', handlePeerConnection);
                
                peer.on('disconnected', () => {
                    console.log("Peer disconnected, attempting reconnect...");
                    handlePeerDisconnect();
                    
                    const attemptReconnect = () => {
                        if (reconnectAttempts < maxReconnectAttempts) {
                            console.log(`Reconnection attempt ${reconnectAttempts + 1}/${maxReconnectAttempts}`);
                            reconnectAttempts++;
                            
                            try {
                                peer.reconnect();
                            } catch (error) {
                                console.error("Reconnection failed:", error);
                                const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
                                reconnectTimer = setTimeout(attemptReconnect, delay);
                            }
                        } else {
                            console.log("Max reconnection attempts reached");
                            throwToast("error", "Unable to reconnect. Please refresh the page.");
                            cleanUp();
                        }
                    };
                    
                    attemptReconnect();
                });
                
                peer.on('close', () => {
                    console.log("Peer connection closed");
                    if (reconnectTimer) {
                        clearTimeout(reconnectTimer);
                    }
                    handlePeerClose();
                });
                
                peer.on('error', handlePeerError);
                
            } catch (error) {
                console.error('PeerJS initialization error:', error);
                throwToast("error", "Failed to initialize connection. Please refresh the page.");
                cleanUp();
            }
        };

        if (typeof window !== 'undefined') {
            initializePeer();
        }

        return () => {
            if (reconnectTimer) {
                clearTimeout(reconnectTimer);
            }
            if (peer) {
                peer.destroy();
            }
            cleanUp();
        };
    }, []);

    const connectToPeer = (peerID) => {
        try {
            if (!myself) {
                throwToast("error", "Connection not ready. Please wait a moment and try again.");
                return;
            }

            if (myConnection) {
                myConnection.close();
            }

            console.log("Attempting to connect to peer:", peerID);

            const connection = myself.connect(peerID, {
                reliable: true,
                serialization: "json",
                metadata: { type: "data" },
                retries: 3,
                label: "droply-data-channel"
            });

            connection.on('error', (err) => {
                console.error("Connection error:", err);
                throwToast("error", "Failed to connect to peer. Please try again.");
                cleanUp();
            });

            setMyPeer(peerID);
            setConnection(connection);

            const connectionTimeout = setTimeout(() => {
                if (!isConnected) {
                    console.log("Connection attempt timed out");
                    throwToast("error", "Connection timed out. Please try again.");
                    connection.close();
                    cleanUp();
                }
            }, 20000);

            connection.on('open', () => {
                console.log("Connection opened successfully");
                clearTimeout(connectionTimeout);
                setConnected(true);
                throwToast("success", `You are now connected to ${peerID}`);
            });

            connection.on('data', (data) => {
                console.log("Received data of type:", data?.type);
                handleReceiveData(data);
            });

            connection.on('close', () => {
                console.log("Connection closed");
                clearTimeout(connectionTimeout);
                cleanUp();
            });

        } catch (error) {
            console.error("Connection attempt failed:", error);
            throwToast("error", "Failed to establish connection. Please try again.");
            cleanUp();
        }
    };

    const [fileToSend, setFileToSend] = useState(null);
    const [fileChunkIndex, setFileChunkIndex] = useState(null);

    const _startFileTransfer = (id, totalChunks, meta) => myConnection.send({
        id, meta, totalChunks, type: "file_transfer_start",
        status: { state: 'sending', progress: 1 },
    });
    const _sendFileChunk = async ({ id, meta, chunker }, index) => {
        chunker.nextChunk().then((chunk) => myConnection && myConnection.send({
            id, index, chunk, totalChunks: chunker.totalChunks, meta,
            type: "file_transfer_chunk",
        }));
    };
    const _cancelFileTransfer = (id) => myConnection.send({ id, type:"file_transfer_cancel" });

    const transferFile = ({ id, file, url, meta }) => {
        setData({
            id,
            url,
            userRole: 'sender',
            status: { state: "processing", },
            meta
        });
        const chunker = new FileChunker({ file });
        setFileChunkIndex(null);
        setFileToSend({
            id,
            url,
            totalChunks: chunker.totalChunks,
            chunker,
            meta
        });
        _startFileTransfer(id, chunker.totalChunks, meta);
    };

    const stopDownload = () => window.writer.abort();

    const resetTransfer = () => {
        if(window.writer) stopDownload();
        setFileChunkIndex(null);
        setFileToSend(null);
        setReceiveIndex(0);
        setReceivedFile(null);
        setFile(null);
        setChunk(null);
        setData(null);
    };

    const cancelTransfer = ({ id }) => {
        _cancelFileTransfer(id);
        resetTransfer();
    };

    useEffect(() => {
        if (fileChunkIndex !== null && fileToSend !== null) {
            _sendFileChunk(fileToSend, fileChunkIndex).then(() => {
                setData((data) => {
                    return {
                        ...fileToSend,
                        ...data,
                        userRole: 'sender',
                        status: {progress: (fileChunkIndex / fileToSend.chunker.totalChunks) * 100, state: 'sending'}
                    }
                });
            });
        }
    }, [fileChunkIndex]);

    const [file, setFile] = useState({});
    const [chunk, setChunk] = useState(null);
      

    const _sendFileReceipt = ({ id, meta }) => (id && myConnection) &&
        myConnection.send({ id, type: "file_receipt", meta });
    const _requestForFileChunk = (id, index) => (id && myConnection) &&
        myConnection.send({ id, index, type: "file_chunk_request" });

    const [hasReceivedFile, setReceivedFile] = useState(false);

    useEffect(() => {
        if(hasReceivedFile && file && file.chunks && file.meta)
        {
            const resp = {
                    meta:file.meta,
                    status: {
                        progress: 100, 
                        state: 'received',
                    },
                    ...(!file.useStream && getFileFromChunks(file.chunks, file.meta))
            };
            _sendFileReceipt(file);
            setData({
                ...resp,
                id: file.id,
                userRole: 'receiver',
                status: {
                    progress: 100,
                    state: 'received',
                },
                timestamp: new Date().getTime(),
                useStream: file.useStream
            });
        }
    }, [hasReceivedFile]);


    const [receiveIndex, setReceiveIndex] = useState(0);

    useEffect(() => {
        if(chunk === false)
            _requestForFileChunk(file && file.id, receiveIndex);
        else if(chunk && file) {
            getChunkProcessor()();
            handleAfterReceive();
        }
    }, [chunk]);

    const writeWithStreams = () => {
        let _chunk = new Uint8Array(chunk.chunk);
        writer.write(_chunk).then(() => {
            _chunk = null;
            chunk.chunk = null;
        }); 
    };

    const storeInMemory = () => {
        let dataChunks = [];
        if(file && file.chunks)
            dataChunks = [...file.chunks];
        dataChunks[chunk.index] = chunk.chunk;
        setFile({
            ...file,
            id: chunk.id,
            ...(dataChunks && {chunks: dataChunks}),
            meta : chunk.meta ? chunk.meta : file.meta
        });
    };

    const getChunkProcessor = () => file.useStream? writeWithStreams : storeInMemory;

    const handleAfterReceive = () => {
        const meta = chunk.meta ? chunk.meta : file.meta;      
        setData({
            id: chunk.id,
            meta,
            userRole: 'receiver',
            status: {
                state: 'receiving',
                progress: (file && file.totalChunks ? (receiveIndex/file.totalChunks)*100 : 0)
            }
        });
        if(receiveIndex+1 < file.totalChunks)
            _requestForFileChunk(file.id, receiveIndex+1);
        else {
            setReceivedFile(true);
            if(file.useStream) writer.close();
        }
        setReceiveIndex(receiveIndex+1);
    };

    const createChunkWriter = file => {
        const streamSaver =  require("streamsaver");
   
        window.writer = streamSaver.createWriteStream(file.meta.name, {size:file.meta.size}).getWriter();
        window.onunload = () => stopDownload();
     };

    const handleReceiveNewFile = (file) => {
        setReceivedFile(false);
        setReceiveIndex(0);
        const switchSize = 50 * 1024 * 1024;
        const _useStream = file.meta.size > switchSize;

        if(_useStream) createChunkWriter(file);

        setFile( {
            id: file.id,
            meta: file.meta,
            status: file.status,
            chunks: [],
            totalChunks: file.totalChunks,
            complete: false,
            useStream: _useStream
        });
        setChunk(false);
    };

    const handleCancelTransfer = () => {
        throwToast("error", `File transfer cancelled`);
        resetTransfer();
    };

    const handleReceiveData = (data) => {
        if(data && data.type)
        {
            if(data.type === 'file_transfer_start')
                handleReceiveNewFile(data);
            if(data.type === 'file_transfer_cancel')
                handleCancelTransfer(data);
            else if(data.type === 'file_chunk_request')
                setFileChunkIndex(data.index);
            else if(data.type === 'file_transfer_chunk')
               setChunk(data);
            else if(data.type === 'file_receipt')
            {
                setData((data) => {
                    return {
                        ...data,
                        status: {progress: 100, state: 'sent'},
                        timestamp: new Date().getTime(),
                    };
                });
            }
            else if(data.type === 'disconnect')
            {
                throwToast("error", `Your peer left.`);
                cleanUp();
            }

        }
    };

    return [{
        myself,
        myPeer,
        data,
        isConnected,
        connectToPeer,
        disconnect,
        transferFile,
        cancelTransfer,
    }];
};

export default usePeer;

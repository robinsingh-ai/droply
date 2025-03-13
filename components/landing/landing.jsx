import React from 'react';

import {
    Header,
} from "./views";

const Landing = ({ myCode, onConnect, isLoading }) => {
    return <React.Fragment>
        <Header myCode={myCode} isLoading={isLoading} onConnect={onConnect} />
    </React.Fragment>;
};

export default Landing;
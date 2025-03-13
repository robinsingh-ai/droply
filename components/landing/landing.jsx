import React from 'react';

import {
    Header,
} from "./views";

export default ({ myCode, onConnect, isLoading }) => {
    return <React.Fragment>
        <Header myCode={myCode} isLoading={isLoading} onConnect={onConnect} />
    </React.Fragment>;
}
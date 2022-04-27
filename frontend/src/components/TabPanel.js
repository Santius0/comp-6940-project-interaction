import React from 'react';

const TabPanel = props => {
    if(props.value === props.index) return <>{props.children}</>;
    return null
}

export default TabPanel;
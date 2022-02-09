import { useState, useEffect } from 'react';
import { GlobalStyles}  from 'Styles/Global';
import { Row, Col } from 'react-simple-flex-grid';
import { getRecordings } from 'api/RadioJove';

function View({ navigation }) {
    useEffect(() => {
        getRecordings()
    }, []);
    return (
        <div style={GlobalStyles.PageWrapper}>
            <h1 style={GlobalStyles.Header}>Search Recordings</h1>
        </div>
    );
}

export default View;
import { useState, useEffect } from 'react';
import { getCoords } from 'Utils/Location';
import { GlobalStyles}  from 'Styles/Global';

const styles = {
    wrapper: {
        border: `2px solid ${GlobalStyles.Colors.shade}`,
        borderRadius: 10,
        marginTop: '30px',
        padding: '20px'
    },
    error: {
        color: GlobalStyles.Colors.danger
    }
}

export const RecordLocation = (props) => {
    const [error, setError] = useState()
    useEffect(() => {
        getCoords().then(coords => {
            if (coords) {
                props.setLocation(coords)
                props.setCurrentScreen('record')
            }
        }).catch(err => {
            setError(err.message)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div style={styles.wrapper}>
            <h1 style={GlobalStyles.SubHeader}>Getting Your Location</h1>
            <p style={{...GlobalStyles.Body,...{margin:0,marginTop:5}}}>This might take a second...</p>
            {error ? 
                <p style={styles.error}>Error: {error}</p>
            : null}
        </div>
    );
}
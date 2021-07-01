import { GlobalStyles}  from 'Styles/Global';
import { useState, useEffect } from 'react';

const styles = {
    textAreaLabel: {
        fontSize: '14px',
        fontWeight: '600',
        display:'block',
        marginBottom: '8px'
    },
    textArea: {
        height: '80px',
        width: '100%',
        maxWidth: '300px',
        borderRadius: '5px',
        backgroundColor: '#f3f3f4',
        padding: 10,
        outline: 'none',
        color: '#000',
        fontSize: '16px',
        fontWeight: '400',
        border: '1px solid transparent',
        transition: 'all .2s ease'
    },
    textAreaFocus: {
        border: `1px solid #f3f3f4`,
        boxShadow: `0px 0px 0px 4px rgba(0, 111, 250, .25)`,
        backgroundColor: '#fff'
    },
    textAreaError: {
        border: `1px solid ${GlobalStyles.Colors.danger}`,
        boxShadow: `0px 0px 0px 4px ${GlobalStyles.Colors.danger_25}`,
    }
}

export const TextArea = ({ id, formError, required, label, pretext }) => {
    const [hover, setHover] = useState(false);
    const [focus, setFocus] = useState(false);
    const [error, setError] = useState(false);
    const [text, setText] = useState(pretext ? pretext : '');
    const validate = () => {
        if (required & text.trim() === '') {
            setError(true)
        } else {
            setError(false)
        }
    }
    useEffect(() => {
        if (formError !== '') {
            validate()
        }
    }, [formError]);
    return (
        <div style={{marginTop:'20px'}} data-testid="text-area">
            <label style={styles.textAreaLabel}>{label}</label>
            <textarea id={id} style={styles.textArea}
                style={{
                    ...styles.textArea,
                    ...(focus | hover ? styles.textAreaFocus : null),
                    ...(error ? styles.textAreaError : null)
                }} 
                value={text}
                onChange={(e) => setText(e.target.value)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onFocus={() => setFocus(true)}
                onBlur={() => {setFocus(false); validate()}}
            />
        </div>
    );
}
import { useState, useEffect } from 'react';
import { GlobalStyles}  from 'Styles/Global';

const styles = {
    textInputLabel: {
        fontSize: '14px',
        fontWeight: '600',
        display:'block',
        marginBottom: '8px'
    },
    textInput: {
        height: '40px',
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
    textInputFocus: {
        border: `1px solid #f3f3f4`,
        boxShadow: `0px 0px 0px 4px rgba(0, 111, 250, .25)`,
        backgroundColor: '#fff'
    },
    textInputError: {
        border: `1px solid ${GlobalStyles.Colors.danger}`,
        boxShadow: `0px 0px 0px 4px ${GlobalStyles.Colors.danger_25}`,
    }
}

export const TextInput = ({id, type, placeholder, label, required, pretext, formError}) => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formError]);
    return (
        <div style={{marginTop:'20px'}} data-testid="text-input">
            <label style={styles.textInputLabel}>{label}</label>
            <input 
                id={id}
                style={{
                    ...styles.textInput,
                    ...(focus | hover ? styles.textInputFocus : null),
                    ...(error ? styles.textInputError : null)
                }} 
                type={type} 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder} 
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onFocus={() => setFocus(true)}
                onBlur={() => {setFocus(false); validate()}}
            />
        </div>
    );
}
import { useState } from 'react';

const styles = {
    textInputLabel: {
        fontSize: '14px',
        fontWeight: '600',
        display:'block',
        marginBottom: '8px'
    },
    dropdown: {
        height: '40px',
        width: '100%',
        maxWidth: '300px',
        borderRadius: '5px',
        padding: 10,
        outline: 'none',
        color: '#000',
        fontSize: '16px',
        fontWeight: '400',
        border: '2px solid #f3f3f4',
        transition: 'all .2s ease'
    },
    dropdownFocus: {
        border: `1px solid #f3f3f4`,
        boxShadow: `0px 0px 0px 4px rgba(0, 111, 250, .25)`,
        backgroundColor: '#fff'
    }
}

export const Dropdown = ({id, options, label}) => {
    const [dropdownValue, setDropdownValue] = useState(Object.keys(options)[0]);
    const [hover,setHover] = useState(false);
    const [focus,setFocus] = useState(false);
    return (
        <div style={{marginTop:'20px'}} data-testid="dropdown">
            <label style={styles.textInputLabel}>{label}</label>
            <select 
                id={id} 
                value={dropdownValue} 
                onChange={(e) => setDropdownValue(e.target.value)}
                style={{...styles.dropdown,...(hover | focus ? styles.dropdownFocus : null)}}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
            >
                {Object.keys(options).map(option_value => (
                    <option key={option_value} value={option_value}>{options[option_value]}</option>
                ))}
            </select>
        </div>
    );
}
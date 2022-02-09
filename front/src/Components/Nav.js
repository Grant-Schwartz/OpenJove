import { useState } from 'react';
import { GlobalStyles } from 'Styles/Global';
import small_logo from 'Assets/small_logo.svg';
import { Link } from "react-router-dom";
import { useMediaQuery } from 'Styles/Media';
import { MenuOutline, CloseOutline } from 'react-ionicons'

const styles = {
    nav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px'
    },
    navLogo: {
        display: 'flex',
        alignItems: 'center', 
        textDecoration: 'none'
    },
    navLogoText: {
        marginLeft: '10px',
        color: '#000'
    },
    navLink: {
        color: '#fff',
        fontSize: '18px',
        textDecoration: 'none',
        borderRadius: '10px',
        fontWeight: '500',
        padding:'15px',
        paddingLeft:'40px',
        paddingRight:'40px',
        margin: '10px'
    },
    navLinkSimple: {
        color: "#000",
        textDecoration: 'none',
        margin: '20px',
        transition: 'all .15s ease'
    },
    collapsedNavItems: {
        display: 'none',
    },
    navCollapseBtn: {
        backgroundColor: 'transparent',
        border: 'none',
    },
    collapsedNavItemsOpen: {
        display: 'flex',
        position: 'absolute',
        flexDirection: 'column',
        alignItems: 'center',
        top: 80,
        right:20,
        justifyContent:'center',
        width: '300px',
        border: '2px solid rgba(0,0,0,0.075)',
        margin: 0,
        padding: 10,
        borderRadius:10,
        zIndex: 3,
        backgroundColor: '#fff'
    }
}

const NavLinkBtn = ({text, url, bgColor, mq}) => {
    const [hover, setHover] = useState(false);
    return (
        <Link 
            onMouseEnter={()=>{
                setHover(true);
            }}
            onMouseLeave={()=>{
                setHover(false);
            }}
            to={url} 
            style={{
                ...{backgroundColor: bgColor, transition: 'all .15s ease'}, 
                ...styles.navLink, 
                ...(hover ? {boxShadow: `0px 0px 0px 4px ${bgColor}`} : null),
                ...(mq ? {width: '100px',paddingLeft:'80px'} : null)
            }}
        >
            {text}
        </Link>
    );
}

const NavLink = ({text, url, mq}) => {
    const [hover, setHover] = useState(false);
    return (
        <Link 
            onMouseEnter={()=>{
                setHover(true);
            }}
            onMouseLeave={()=>{
                setHover(false);
            }}
            to={url} 
            style={{
                ...styles.navLinkSimple,
                ...(hover ? {color: GlobalStyles.Colors.primary} : null),
            }}

        >
            {text}
        </Link>
    );
}

function Nav() {
    var mq = useMediaQuery("(max-width: 715px)" );
    const [collapseOpen, setCollapseOpen] = useState(false);
    return (
        <div style={styles.nav}>
            <a style={styles.navLogo} href="/" data-testid="nav-logo-link">
                <img alt="Logo" src={small_logo} style={{height:'50px'}} />
                <span style={{...GlobalStyles.Logo, ...styles.navLogoText}}>Open Jove</span>
            </a>
            <div style={mq ? (collapseOpen ? styles.collapsedNavItemsOpen : styles.collapsedNavItems) : null}>
                {/* <NavLink mq={mq} text="View Recordings" url="/view"/> */}
                <NavLinkBtn mq={mq} bgColor={GlobalStyles.Colors.primary} url="/record" text="Record" />
                <NavLinkBtn mq={mq} bgColor={GlobalStyles.Colors.secondary} url="/upload" text="Upload" />
            </div>
            {mq ? 
                <button style={styles.navCollapseBtn} onClick={() => setCollapseOpen(!collapseOpen)}>
                    {!collapseOpen ?
                    <MenuOutline
                        color={'#00000'} 
                        height="35px"
                        width="35px"
                    /> :
                    <CloseOutline
                        color={'#00000'} 
                        height="35px"
                        width="35px"
                    />
                    }
                </button>
            : null}
        </div>
    );
}

export default Nav;
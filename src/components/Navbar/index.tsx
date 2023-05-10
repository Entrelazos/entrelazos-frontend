import React, { useContext, useEffect, useState } from "react";
import { BiMenuAltRight } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useNavigate, NavLink } from "react-router-dom";
import "./navbar.scss";
import coffeLogoImage from '../../assets/entreLazosLogo.png';
import { AuthContext } from '../../auth/context/AuthContext';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });
    
    const handleLogout=() => {
        logout();
        navigate('/login');
    }

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (size.width > 768 && menuOpen) {
            setMenuOpen(false);
        }
    }, [size.width, menuOpen]);

    const menuToggleHandler = () => {
        setMenuOpen((p) => !p);
    };

    return (
        <header className="header">
            <div className="header__content">
                <NavLink to="/">
                    <img width={70} src={coffeLogoImage} alt="" />
                </NavLink>
                <nav
                    className={`${"header__content__nav"} 
          ${menuOpen && size.width < 768 ? `${"isMenu"}` : ""} 
          }`}
                >
                    <ul>
                        <li>
                            <Link className="normalButtons" to="/">Home</Link>
                        </li>
                        <li>
                            <Link className="normalButtons" to="/profile">Profile</Link>
                        </li>
                        <li>
                            <Link className="normalButtons" to="/Works">Browse Works</Link>
                        </li>
                        <li>
                            <Link className="normalButtons" to="/help">Help</Link>
                        </li>

                        <li style={{fontSize: "19px", color:"rgb(162, 162, 246)", fontWeight: "bold"}}>
                            {user?.name}
                        </li>
                        
                        
                            <button className="btn btn__login" onClick={handleLogout}>Salir</button>
                        
                    </ul>
                </nav>
                <div className="header__content__toggle">
                    {!menuOpen ? (
                        <BiMenuAltRight onClick={menuToggleHandler} />
                    ) : (
                        <AiOutlineClose onClick={menuToggleHandler} />
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
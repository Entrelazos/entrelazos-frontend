import { useEffect, useState } from 'react';
import { BiMenuAltRight } from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './navbar.scss';
import entreLazosLogoImage from '../../assets/entreLazosLogoHorizontal.png';
import { startLogout } from '../../store/auth';
import { AppDispatch, RootState } from '../../store/store';

function Navbar() {
  const { displayName } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  const handleLogout = () => {
    dispatch(startLogout());
    navigate('/login');
  };

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
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
    <header className='header'>
      <div className='header__content'>
        <NavLink to='/'>
          <img width={200} src={entreLazosLogoImage} alt='' />
        </NavLink>
        <nav
          className={`${'header__content__nav'} 
          ${menuOpen && size.width < 768 ? `${'isMenu'}` : ''} 
          }`}
        >
          <ul>
            <li>
              <Link className='normalButtons' to='/'>
                Home
              </Link>
            </li>
            <li>
              <Link className='normalButtons' to='/profile'>
                Profile
              </Link>
            </li>
            <li>
              <Link className='normalButtons' to='/Works'>
                Browse Works
              </Link>
            </li>
            <li>
              <Link className='normalButtons' to='/help'>
                Help
              </Link>
            </li>

            <li
              style={{
                fontSize: '19px',
                color: 'rgb(162, 162, 246)',
                fontWeight: 'bold',
              }}
            >
              {displayName}
            </li>

            <button className='btn btn__login' onClick={handleLogout}>
              Salir
            </button>
          </ul>
        </nav>
        <div className='header__content__toggle'>
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

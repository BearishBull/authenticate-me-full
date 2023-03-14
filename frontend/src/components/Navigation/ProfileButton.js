import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';


const ProfileButton = ({ user }) => {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);

    // Open menu
    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    // Close menu
    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = () => {
            setShowMenu(false);
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu])

    // Log out
    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    return (
        <>
            <button onClick={openMenu}>
                <span style={{ color: 'Tomato'}}>
                <i class="fa-solid fa-eye fa-2xl"></i>
            </span>
        </button>

            {
        showMenu && (
            <ul className="profile-dropdown">
                <li>{user.username}</li>
                <li>{user.email}</li>
                <li>
                    <button onClick={logout}>Log Out</button>
                </li>
            </ul>
        )
    }
        </>
    )
};

export default ProfileButton;
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './SignupForm.css';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';

function SignupFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user)
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);

    // Redirect to home page if already logged in
    if (sessionUser) {
        return <Navigate to="/" />
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors([]);
            return dispatch(sessionActions.signup({ email, username, password }))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                });
        }
        return setErrors(['Confirm Pass field must be the same as the Password field']);
    };

    return (
        <div className="login-page">
            <div className="form">
                <form className="login-form" onSubmit={handleSubmit}>
                    <ul>
                        {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                    </ul>
                    <label>
                        Email
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Username
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Password
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Confirm Password
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    )
}

export default SignupFormPage;
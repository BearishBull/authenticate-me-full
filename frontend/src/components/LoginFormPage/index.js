import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './LoginForm.css';

function LoginFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    if (sessionUser) {
       	return <Navigate to="/" />
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({ credential, password }))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
    };

    return (
        <div className="login-page">
            <div className="form">
                <form className="login-form" onSubmit={handleSubmit}>
                    <ul>
                        {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                    </ul>
                    <label>
                        Username or Email
                        <input
                            type="text"
                            value={credential}
                            placeholder="name"
                            onChange={(e) => setCredential(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Log In</button>
                </form>
            </div>
        </div>
    )
};

export default LoginFormPage;
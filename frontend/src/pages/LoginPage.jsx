import React, { useState } from 'react';
import axios from 'axios';
import { apiClient } from '../api/apiClient';

export default function LoginPage({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); // Email takes the place of typical username in login
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (isLogin) {
                // For Basic Auth, we pass 'Authorization' header
                const authHeader = 'Basic ' + btoa(email + ':' + password);

                const response = await axios.get('http://localhost:8085/api/auth/me', {
                    headers: {
                        Authorization: authHeader
                    }
                });

                // If successful, save the token to apply it to all future requests
                axios.defaults.headers.common['Authorization'] = authHeader;

                // ALSO apply it to the specific apiClient used by the rest of the app
                apiClient.defaults.headers.common['Authorization'] = authHeader;

                // Call onLogin with the user data from the backend
                onLogin(response.data);
            } else {
                // Sign Up mode
                const response = await axios.post('http://localhost:8085/api/auth/signup', {
                    name,
                    email,
                    password
                });

                setSuccess(response.data);
                setIsLogin(true); // Switch to login view on success
                setPassword(''); // clear password field
            }
        } catch (err) {
            setError(err.response?.data || err.response?.data?.message || (isLogin ? 'Invalid credentials' : 'Error registering'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{isLogin ? 'Login' : 'Sign Up'}</h2>

            {error && <div style={{ color: 'white', backgroundColor: '#e74c3c', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

            {success && <div style={{ color: 'white', backgroundColor: '#2ecc71', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' }}>{success}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {!isLogin && (
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                            required={!isLogin}
                        />
                    </div>
                )}
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', border: 'none', background: '#3498db', color: 'white', fontSize: '16px', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                </button>
            </form>

            {isLogin && (
                <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
                        <hr style={{ flex: 1 }} />
                        <span style={{ margin: '0 10px', color: '#888' }}>OR</span>
                        <hr style={{ flex: 1 }} />
                    </div>
                    <button
                        onClick={() => window.location.href = 'http://localhost:8085/oauth2/authorization/google'}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            background: 'white',
                            color: '#555',
                            fontSize: '16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
                        Login with Google
                    </button>
                </div>
            )}

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setSuccess('');
                    }}
                    style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {isLogin ? 'Sign up here' : 'Login here'}
                </button>
            </div>
        </div>
    );
}

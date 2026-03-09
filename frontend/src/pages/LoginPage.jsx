import React, { useState } from 'react';
import axios from 'axios';
import { apiClient } from '../api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Image, Loader2, LogIn, UserPlus, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [pictureUrl, setPictureUrl] = useState('');
    const [email, setEmail] = useState('');
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
                const authHeader = 'Basic ' + btoa(email + ':' + password);
                const response = await axios.get('http://localhost:8085/api/auth/me', {
                    headers: { Authorization: authHeader },
                });
                axios.defaults.headers.common['Authorization'] = authHeader;
                apiClient.defaults.headers.common['Authorization'] = authHeader;
                onLogin(response.data);
            } else {
                const response = await axios.post('http://localhost:8085/api/auth/signup', {
                    name,
                    email,
                    password,
                    pictureUrl,
                });
                setSuccess(response.data);
                setIsLogin(true);
                setPassword('');
            }
        } catch (err) {
            setError(
                err.response?.data || err.response?.data?.message || (isLogin ? 'Invalid credentials' : 'Error registering')
            );
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        background: 'var(--panel)',
        padding: '12px 16px 12px 44px',
        fontSize: '14px',
        color: 'var(--text)',
        outline: 'none',
        transition: 'all 0.2s ease'
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'var(--bg)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative blobs */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-5%',
                width: '400px',
                height: '400px',
                background: 'var(--accent)',
                filter: 'blur(100px)',
                opacity: 0.1,
                borderRadius: '50%'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                right: '-5%',
                width: '400px',
                height: '400px',
                background: 'var(--sidebar)',
                filter: 'blur(100px)',
                opacity: 0.1,
                borderRadius: '50%'
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    width: '100%',
                    maxWdth: '420px', // Typo fix: maxWidth 
                    maxWidth: '420px',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <div style={{
                    background: 'var(--panel)',
                    padding: '40px',
                    borderRadius: '24px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <motion.div
                            layoutId="icon"
                            style={{
                                width: '60px',
                                height: '60px',
                                background: 'var(--sidebar)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                                color: '#fff'
                            }}
                        >
                            {isLogin ? <LogIn size={28} /> : <UserPlus size={28} />}
                        </motion.div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text)', margin: '0 0 8px 0' }}>
                            {isLogin ? 'Welcome back' : 'Create account'}
                        </h2>
                        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: 0 }}>
                            {isLogin ? 'Sign in to your university account' : 'Register for management access'}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                    background: 'rgba(217, 83, 79, 0.1)',
                                    color: 'var(--danger)',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    marginBottom: '20px',
                                    fontSize: '0.9rem',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    border: '1px solid rgba(217, 83, 79, 0.2)'
                                }}
                            >
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                    background: 'rgba(46, 139, 87, 0.1)',
                                    color: 'var(--success)',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    marginBottom: '20px',
                                    fontSize: '0.9rem',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    border: '1px solid rgba(46, 139, 87, 0.2)'
                                }}
                            >
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{ display: 'grid', gap: '16px' }}
                            >
                                <div style={{ position: 'relative' }}>
                                    <User style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--muted)' }} size={18} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={inputStyle}
                                        placeholder="Full Name"
                                        required={!isLogin}
                                    />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Image style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--muted)' }} size={18} />
                                    <input
                                        type="text"
                                        value={pictureUrl}
                                        onChange={(e) => setPictureUrl(e.target.value)}
                                        style={inputStyle}
                                        placeholder="Profile Picture URL (optional)"
                                    />
                                </div>
                            </motion.div>
                        )}

                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--muted)' }} size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                                placeholder="Email Address"
                                required
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--muted)' }} size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={inputStyle}
                                placeholder="Password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '10px',
                                background: 'var(--sidebar)',
                                color: '#fff',
                                padding: '14px',
                                borderRadius: '12px',
                                border: 'none',
                                fontWeight: '700',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 4px 12px rgba(29, 79, 92, 0.2)'
                            }}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {isLogin && (
                        <div style={{ marginTop: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                                <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '600' }}>OR CONTINUE WITH</span>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                            </div>
                            <button
                                type="button"
                                onClick={() => (window.location.href = 'http://localhost:8085/oauth2/authorization/google')}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--panel)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    fontWeight: '600',
                                    color: 'var(--text)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google"
                                    style={{ width: '18px' }}
                                />
                                Google
                            </button>
                        </div>
                    )}

                    <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--muted)' }}>
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setSuccess('');
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--sidebar)',
                                fontWeight: '700',
                                cursor: 'pointer',
                                padding: '4px'
                            }}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

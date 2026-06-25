import React from 'react';

const Footer = () => {
    return (
        <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 p-8 text-center">
            <p>© {new Date().getFullYear()} ArtHub. All rights reserved.</p>
        </div>
    );
};

export default Footer;
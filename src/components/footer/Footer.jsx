import React from 'react';

const Footer = () => {
    return (
        <div className="bg-background border-t border-border text-muted p-8 text-center">
            <p>© {new Date().getFullYear()} ArtHub. All rights reserved.</p>
        </div>
    );
};

export default Footer;
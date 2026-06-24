import Footer from '@/components/footer/Footer';
import NavBar from '@/components/navbar/NavBar';
import React from 'react';

const RootLayout = ({ children }) => {
    return (
        <div>
            <NavBar />
            <div className="grow flex flex-col">
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default RootLayout;
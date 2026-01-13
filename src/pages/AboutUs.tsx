const AboutUs = () => {
    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #007bff', paddingBottom: '15px', display: 'inline-block' }}>ABOUT US</h1>
                    
                    <div style={{ color: '#555', lineHeight: '1.8', fontSize: '1.05em' }}>
                        <p style={{ marginBottom: '20px' }}>
                            <strong>Welcome to Toyk Market, your online market place with an advanced security system</strong>
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            What do you want to sell or buy? New or used? Property or Land? What ever you want to buy or sell, you will find them on this website. Post your product or request, someone around the world will be interested.
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            This website assured you of a pleasant business experience. This is why Toyk Market is your veritable online market place.
                        </p>
                        
                        <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '5px', border: '1px solid #ffeeba', marginTop: '30px' }}>
                            <h3 style={{ color: '#856404', marginTop: '0', marginBottom: '15px' }}>NOTICE:</h3>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
                                <li style={{ marginBottom: '10px' }}>Never disclose your Toyk Market password to anyone.</li>
                                <li>Toyk Market staff will never request for your credit card account number and password details through the phone, via emails, text messages or social media.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;

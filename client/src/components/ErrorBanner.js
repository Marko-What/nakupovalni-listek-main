const ErrorBanner = ({ message }) => {
    return (
      <div style={{ background: 'red', color: 'white', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
        Error: {message}
      </div>
    );
  };


export default ErrorBanner;
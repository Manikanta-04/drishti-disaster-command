const Loader = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border-2 border-transparent"
        style={{ borderTopColor: '#00e5ff', animation: 'spin 1s linear infinite' }} />
      <div className="absolute inset-2 rounded-full border-2 border-transparent"
        style={{ borderTopColor: '#ff3b3b', animation: 'spin 0.7s linear infinite reverse' }} />
    </div>
    <span className="font-mono-custom text-xs" style={{ color: '#7aa3bc', letterSpacing: '0.1em' }}>
      {text.toUpperCase()}
    </span>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Loader;

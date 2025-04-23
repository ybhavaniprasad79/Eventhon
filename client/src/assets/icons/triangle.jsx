const Triangle = ({ rotate }) => {
  return (
    <svg
      width="70"
      height="70" // Match this to .navbar-links height
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ transform: rotate }}
    >
      <polygon points="0,0 100,100 0,100" fill="white" />
    </svg>
  );
};
  
  export default Triangle
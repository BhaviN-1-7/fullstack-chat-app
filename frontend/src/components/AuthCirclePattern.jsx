const AuthCirclePattern = ({ title, subtitle }) => {
    return (
      <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
        <div className="max-w-md text-center relative">
          {/* Circle Pattern */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            <div
              className="absolute top-0 left-0 w-24 h-24 rounded-full bg-primary/20 animate-[spin_10s_linear_infinite]"
              style={{ transformOrigin: "center" }}
            />
            <div
              className="absolute top-8 right-4 w-32 h-32 rounded-full bg-accent/15 animate-[pulse_4s_ease-in-out_infinite]"
            />
            <div
              className="absolute bottom-4 left-12 w-20 h-20 rounded-full bg-secondary/25 animate-[spin_12s_linear_reverse_infinite]"
              style={{ transformOrigin: "center" }}
            />
            <div
              className="absolute bottom-0 right-8 w-28 h-28 rounded-full bg-primary/10 animate-[pulse_6s_ease-in-out_infinite]"
            />
          </div>
          {/* Title and Subtitle */}
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-base-content/60">{subtitle}</p>
        </div>
      </div>
    );
  };
  
  export default AuthCirclePattern;
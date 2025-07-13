const TypingIndicator = () => {
  return (
    <div className="flex items-end gap-[2%] max-w-[75%] self-start">
      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex-shrink-0"></div>
      <div className="bg-white rounded-2xl rounded-bl-md px-[4%] py-[3%] shadow-sm">
        <div className="flex gap-1">
          <div
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-anthracite-400 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-anthracite-400 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-anthracite-400 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
};
export default TypingIndicator;

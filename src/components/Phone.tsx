import {
  useLayoutEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

interface PhoneProps extends PropsWithChildren {
  inputPlaceholder?: string;
  onSubmitMessage?: (message: string) => void;
}

const Phone = ({
  children,
  inputPlaceholder = 'Deine Antwort…',
  onSubmitMessage,
}: PhoneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const userTextRef = useRef<HTMLInputElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const threshold = 50; // pixels from bottom
      const isBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        threshold;
      setIsAtBottom(isBottom);
    }
  };

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useLayoutEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [children, isAtBottom]);

  return (
    <div className="relative w-full h-full flex flex-col grow sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px]">
      <div className="hidden sm:block absolute inset-0 bg-black/20 rounded-[2.5rem] blur-xl sm:blur-2xl transform translate-y-4 sm:translate-y-8 mb-8"></div>

      <div className="flex grow relative sm:p-[0.5rem] sm:shadow-2xl sm:bg-gray-950 sm:rounded-[2.5rem]">
        <div className="bg-gray-50 w-full h-[calc(100vh-4rem)] sm:h-auto sm:aspect-[9/19.5] flex flex-col overflow-hidden relative sm:rounded-[2.2rem]">
          <div className="hidden sm:block absolute top-0 left-1/2 transform -translate-x-1/2 w-[35%] h-[3.5%] bg-gray-950 rounded-b-2xl z-10"></div>

          <div className="h-[6%] hidden sm:flex items-end px-[6%] pb-[0.5%] text-[0.6rem] sm:text-xs font-medium text-gray-800">
            <span>9:41</span>
            <div className="ml-auto flex items-center gap-[2%]">
              <div className="w-5 h-2.5 sm:w-6 sm:h-3 border border-gray-800 rounded-sm">
                <div className="w-full h-full bg-gray-800 rounded-sm scale-x-[0.7] origin-left"></div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg border-b border-gold-200/50 px-[4%] py-[3%] hidden sm:flex items-center">
            <button className="p-[2%] -ml-[2%]">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="ml-[3%] flex items-center gap-[3%]">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-gray-950 font-semibold text-[0.7rem] sm:text-xs md:text-sm">
                AV
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                  AYM Vision Chat
                </div>
                <div className="text-[0.65rem] sm:text-xs text-gray-500">
                  Online
                </div>
              </div>
            </div>
            <button className="ml-auto p-[2%] -mr-[2%]">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-[4%] py-[4%] chat-background-modern">
            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="flex flex-col gap-2 overflow-y-auto h-full"
            >
              {children}
            </div>
          </div>

          <div className="bg-white border-t border-gold-200/50 px-[4%] py-[3%]">
            <div className="flex items-center gap-[3%]">
              <button className="p-[2%] text-gray-500 hover:text-gray-700 transition-colors">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
              <div className="flex-1 relative">
                <input
                  ref={userTextRef}
                  className="w-full py-[6%] px-[5%] pr-[12%] rounded-full bg-gold-50 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white transition-all text-xs sm:text-sm"
                  placeholder={inputPlaceholder}
                />
                <button className="absolute right-[2%] top-1/2 transform -translate-y-1/2 p-[2%] text-gray-500 hover:text-gray-700 transition-colors">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => {
                  if (typeof onSubmitMessage === 'function') {
                    onSubmitMessage(userTextRef.current?.value || '');
                  }
                  if (userTextRef.current) {
                    userTextRef.current.value = '';
                  }
                }}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="h-[4%] hidden sm:flex items-center justify-center pb-[1%]">
            <div className="w-[35%] h-[0.5%] min-h-[3px] bg-gray-800 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phone;

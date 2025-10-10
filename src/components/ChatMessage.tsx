interface ChatMessageProps {
  message: {
    type: 'other' | 'main' | 'user' | 'system';
    speaker?: {
      name: string;
      avatar?: string;
      color?: string;
    };
    content?: string;
    image?: string;
    timestamp?: string;
    reactions?: string[];
  };
}

// gleiche Emojis zusammenfassen: ["👍","👍","😂"] -> [["👍",2],["😂",1]]
const groupReactions = (list?: string[]) => {
  const map: Record<string, number> = {};
  (list || []).forEach((e) => {
    if (!e) return;
    map[e] = (map[e] || 0) + 1;
  });
  return Object.entries(map); // [emoji, count][]
};

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUserMessage = message.type === 'user';
  const isMainCharacter = message.type === 'main';
  const isSystemMessage = message.type === 'system';

  // ===== System-Nachrichten (unverändert, ohne Reaktionschips) =====
  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-100 text-gray-600 rounded-lg px-3 py-2 max-w-[80%] text-center">
          {message.image && (
            <img
              src={message.image}
              alt="System image"
              className="w-full rounded-lg mb-2 max-h-64 object-cover"
            />
          )}
          {message.content && <p className="text-md">{message.content}</p>}
          {message.timestamp && (
            <span className="text-sm text-gray-400 mt-1 block">
              {message.timestamp}
            </span>
          )}
        </div>
      </div>
    );
  }

  // ===== User-Nachricht =====
  if (isUserMessage) {
    const grouped = groupReactions(message.reactions);
    return (
      <div className="max-w-[75%] self-end my-4">
        <div className="relative bg-blue-600/50 text-white rounded-2xl rounded-br-md p-2 shadow-md">
          {message.image && (
            <img
              src={message.image}
              alt="Shared image"
              className="w-full rounded-lg mb-2 max-h-64 object-cover"
            />
          )}
          {message.content && <p className="text-md">{message.content}</p>}

          {/* Timestamp & Doppelhaken */}
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-sm text-blue-100">{message.timestamp}</span>
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-blue-100"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              <path
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                transform="translate(4, 0)"
              />
            </svg>
          </div>

          {/* Reaktions-Chips direkt an der Bubble (unten rechts) */}
          {grouped.length > 0 && (
            <div className="absolute -bottom-3 right-2 flex gap-1 rounded-full bg-white/90 backdrop-blur px-1.5 py-0.5 text-sm shadow ring-1 ring-black/5">
              {grouped.map(([emoji, count]) => (
                <span key={emoji} className="leading-none text-gray-800">
                  {emoji}
                  {count > 1 && (
                    <span className="ml-0.5 text-xs text-gray-500 align-middle">
                      {count}
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== Andere/„main“ Nachrichten =====
  const grouped = groupReactions(message.reactions);

  return (
    <div
      className={`flex flex-col max-w-[75%] self-${
        isMainCharacter ? 'end' : 'start'
      } my-2`}
    >
      <div className="flex items-end gap-[2%]">
        {/* Avatar links (für 'other') */}
        {!isMainCharacter &&
          (typeof message.speaker?.avatar === 'undefined' ? (
            <div
              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[0.6rem] sm:text-xs font-semibold ${
                message.speaker?.color ||
                'bg-gradient-to-br from-gold-400 to-gold-600'
              }`}
            >
              {message.speaker?.name?.charAt(0) || 'U'}
            </div>
          ) : (
            <img
              src={message.speaker.avatar}
              alt={message.speaker.name}
              className="w-8 h-8 rounded-full flex-shrink-0 object-contain"
              style={{ backgroundColor: '#ffffef' }}
            />
          ))}

        {/* Bubble */}
        <div
          className={`relative rounded-2xl rounded-bl-md p-2 shadow-sm ${
            isMainCharacter ? 'bg-blue-50 border border-blue-200' : 'bg-white'
          }`}
        >
          {message.speaker && !isMainCharacter && (
            <p className="text-sm font-semibold text-anthracite-600 mb-1">
              {message.speaker.name}
            </p>
          )}

          {message.image && (
            <img
              src={message.image}
              alt="Shared image"
              className="w-full rounded-lg mb-2 max-h-64 object-cover"
            />
          )}

          {message.content && (
            <p
              className={`text-md min-w-24 ${
                isMainCharacter ? 'text-blue-900' : 'text-anthracite-800'
              }`}
            >
              {message.content}
            </p>
          )}

          {/* Timestamp */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-anthracite-400">
              {message.timestamp}
            </span>
          </div>

          {/* Reaktions-Chips direkt an der Bubble (unten rechts) */}
          {grouped.length > 0 && (
            <div className="absolute -bottom-3 right-2 flex gap-1 rounded-full bg-white/90 backdrop-blur px-1.5 py-0.5 text-sm shadow ring-1 ring-black/5">
              {grouped.map(([emoji, count]) => (
                <span key={emoji} className="leading-none text-gray-800">
                  {emoji}
                  {count > 1 && (
                    <span className="ml-0.5 text-xs text-gray-500 align-middle">
                      {count}
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Avatar rechts (für 'main') */}
        {isMainCharacter &&
          (typeof message.speaker?.avatar === 'undefined' ? (
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[0.6rem] sm:text-sm font-semibold bg-gradient-to-br from-blue-500 to-blue-700">
              {message.speaker?.name?.charAt(0) || 'U'}
            </div>
          ) : (
            <img
              src={message.speaker.avatar}
              alt={message.speaker.name}
              className="w-8 h-8 rounded-full flex-shrink-0 object-contain"
              style={{ backgroundColor: '#ffffef' }}
            />
          ))}
      </div>
    </div>
  );
};

export default ChatMessage;

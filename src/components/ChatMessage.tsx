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
    replyTo?: {
      text: string;
      speakerName?: string;
    };
  };
}

const ReplyPreview = ({
  text,
  speakerName,
}: {
  text: string;
  speakerName?: string;
}) => (
  <div className="mb-1 rounded-lg bg-gray-50 border border-gray-200 px-2 py-1 text-sm">
    {speakerName && (
      <div className="font-semibold text-gray-700 leading-tight truncate">
        {speakerName}
      </div>
    )}
    <div className="text-gray-600 line-clamp-2">{text}</div>
  </div>
);

// Reaktionen INSIDE der Bubble, leicht überlappend & sehr kompakt
const ReactionsInsideBubble = ({ reactions }: { reactions?: string[] }) => {
  if (!reactions || reactions.length === 0) return null;
  return (
    <div className="absolute -bottom-0.5 right-2 flex gap-1">
      {reactions.map((r, i) => (
        <span
          key={i}
          className="px-1.5 py-0.5 text-xs bg-white border border-gray-200 rounded-full shadow-sm leading-none"
        >
          {r}
        </span>
      ))}
    </div>
  );
};

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUserMessage = message.type === 'user';
  const isMainCharacter = message.type === 'main';
  const isSystemMessage = message.type === 'system';
  const hasReactions = !!(message.reactions && message.reactions.length > 0);

  // Kleineres, dynamisches Bottom-Padding: reicht meist völlig
  const bubbleBottomPad = hasReactions ? 'pb-2' : '';

  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-1">
        <div className="bg-gray-100 text-gray-600 rounded-lg px-3 py-2 max-w-[80%] text-center">
          {message.image && (
            <img
              src={message.image}
              alt="System image"
              className="w-full rounded-lg mb-1 max-h-64 object-cover"
            />
          )}
          {message.content && <p className="text-md">{message.content}</p>}
          {message.timestamp && (
            <span className="text-sm text-gray-400 mt-0.5 block">
              {message.timestamp}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (isUserMessage) {
    return (
      <div className="max-w-[75%] self-end my-1">
        <div
          className={`relative bg-blue-600/50 text-white rounded-2xl rounded-br-md p-2 shadow-md ${bubbleBottomPad}`}
        >
          {message.replyTo && (
            <div className="mb-1 rounded-lg bg-white/15 border border-white/25 px-2 py-1 text-sm">
              {message.replyTo.speakerName && (
                <div className="font-semibold text-white leading-tight truncate">
                  {message.replyTo.speakerName}
                </div>
              )}
              <div className="text-blue-50 line-clamp-2">
                {message.replyTo.text}
              </div>
            </div>
          )}

          {message.image && (
            <img
              src={message.image}
              alt="Shared image"
              className="w-full rounded-lg mb-1 max-h-64 object-cover"
            />
          )}
          {message.content && <p className="text-md">{message.content}</p>}

          <div className="flex items-center justify-end gap-1 mt-0.5">
            <span className="text-sm text-blue-100">{message.timestamp}</span>
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-blue-100"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              <path
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                transform="translate(4, 0)"
              />
            </svg>
          </div>

          <ReactionsInsideBubble reactions={message.reactions} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col max-w-[75%] self-${
        isMainCharacter ? 'end' : 'start'
      } my-1`}
    >
      <div className="flex items-end gap-2">
        {!isMainCharacter &&
          (typeof message.speaker?.avatar === 'undefined' ? (
            <div
              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[0.6rem] sm:text-xs font-semibold ${
                message.speaker?.color ||
                'bg-gradient-to-br from-gold-400 to-gold-600'
              }}`}
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

        <div
          className={`relative rounded-2xl rounded-bl-md p-2 shadow-sm ${
            isMainCharacter ? 'bg-blue-50 border border-blue-200' : 'bg-white'
          } ${bubbleBottomPad}`}
        >
          {message.speaker && !isMainCharacter && (
            <p className="text-sm font-semibold text-anthracite-600 mb-1">
              {message.speaker.name}
            </p>
          )}

          {message.replyTo && (
            <ReplyPreview
              text={message.replyTo.text}
              speakerName={message.replyTo.speakerName}
            />
          )}

          {message.image && (
            <img
              src={message.image}
              alt="Shared image"
              className="w-full rounded-lg mb-1 max-h-64 object-cover"
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

          <div className="flex items-center justify-between mt-0.5">
            <span className="text-sm text-anthracite-400">
              {message.timestamp}
            </span>
          </div>

          <ReactionsInsideBubble reactions={message.reactions} />
        </div>

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

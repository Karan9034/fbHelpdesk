import '../styles/ChatCard.css';

const ChatCard = ({position, msg}) => {
    return (
        <div className={`chat-card ${position}`}>
            <div className="chat-card-content">
                <p>{msg.message}</p>
            </div>
        </div>
    );
}
export default ChatCard;
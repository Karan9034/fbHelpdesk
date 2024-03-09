import '../styles/ChatCard.css';
import dateFormat, { masks } from "dateformat";

const ChatCard = ({user, position, msg, conversation}) => {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return `${dateFormat(date, "mmm dd, hh:MM TT")}`
    }
    return (
        <div className={`chat-card ${position}`}>
            <div>
                {
                    position === 'left' ? 
                    <i className='material-icons' style={{fontSize: '30px'}}>account_circle</i>
                    : null
                }
                &nbsp;&nbsp;
                <div className="chat-card-content">
                    <p>{msg.message}</p>
                </div>
                &nbsp;&nbsp;
                {
                    position === 'right' ? 
                    <i className='material-icons' style={{fontSize: '36px', color: '#000'}}>account_circle</i>
                    : null
                }
            </div>
            <div>
                {
                    position === 'left' ? 
                    <p><b>{conversation.sender_name}</b> ● {formatDate(msg.timestamp)}</p>
                    : <p><b>{user.name}</b> ● {formatDate(msg.timestamp)}</p>
                }
            </div>
        </div>
    );
}
export default ChatCard;
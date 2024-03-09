import { useEffect, useState } from 'react';
import '../styles/ChatArea.css';
import ChatCard from './ChatCard';

const ChatArea = ({selectedConversation, setSelectedConversation}) => {

    const [reply, setReply] = useState('');
    
    const sendReply = (e) => {
        e.preventDefault();
        if(reply === ''){
            return;
        }
        fetch(`${process.env.REACT_APP_API_URL}/conversations/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                conversationId: selectedConversation._id,
                message: reply
            })
        })
            .then(res => res.json())
            .then(data => {
                if(data.success){
                    setReply('');
                    setSelectedConversation(data.conversation)
                }
            })
    }

    useEffect(() => {
        if(selectedConversation !== null){
            const element = document.querySelector('.chat-area-container');
            element.scrollTop = element.scrollHeight;
        }
    }, [selectedConversation])
    
    if(selectedConversation === null){
        return (
            <div className="chat-area not-selected">
                <p>Select a conversation to get started.</p>
            </div>
        )
    }
    return (
        <div className="chat-area">
            <h2>{selectedConversation.sender_name}</h2>
            <hr />
            <div className="chat-area-container">
                {selectedConversation.messages.map((msg, index) => {
                    return (
                        <ChatCard msg={msg} key={index} position={msg.position}/>
                    )
                })}
            </div>
            <div className='reply-area'>
                <input type="text" className='reply-box' placeholder="Type a message..." value={reply} onChange={(e) => setReply(e.target.value)} />
                <button type='submit' className='send-reply' onClick={sendReply}>Send</button>
            </div>
        </div>
    )
}

export default ChatArea;
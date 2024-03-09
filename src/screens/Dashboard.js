import SideBar from '../components/SideBar';
import Conversations from '../components/Conversations';
import '../styles/Dashboard.css'
import { useEffect, useState } from 'react';
import ChatArea from '../components/ChatArea';

const Dashboard = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/auth/verify`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                if(data.success && !data.connected){
                    window.location.href = '/connect';
                }else if(!data.success){
                    window.location.href = '/login';
                }
            })
    }, [])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/conversations`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                setConversations(data.conversations);
            })
    }, [])

    return (
        <div className="dashboard">
            <SideBar />
            <Conversations conversations={conversations} selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation} />
            <ChatArea selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation}/>
        </div>
    )
}

export default Dashboard;
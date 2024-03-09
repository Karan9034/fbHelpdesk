import SideBar from '../components/SideBar';
import Conversations from '../components/Conversations';
import '../styles/Dashboard.css'
import { useEffect, useState } from 'react';
import ChatArea from '../components/ChatArea';
import Admin from '../components/Admin';

const Dashboard = () => {
    const [currPage, setCurrPage] = useState('inbox')
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
            <SideBar currPage={currPage} setCurrPage={setCurrPage} />
            {currPage === 'inbox' &&
                <>
                    <Conversations conversations={conversations} selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation} />
                    <ChatArea selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation}/>
                </>
            }
            {
                currPage === 'admin' &&
                <Admin />
            }

        </div>
    )
}

export default Dashboard;
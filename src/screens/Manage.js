import { Link } from 'react-router-dom';
import Card from '../components/Card';
import '../styles/Manage.css';
import { useEffect, useState } from 'react';

const Manage = () => {
    const [pageName, setPageName] = useState("")

    const handleDelete = () => {
        fetch(`${process.env.REACT_APP_API_URL}/api/delete`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => res.json())
            .then(data => {
                if(data.success){
                    window.location.href = '/connect';
                }
            })
    }

    useEffect(() => {
        if(localStorage.getItem('token') !== null){
            fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
                .then(res => res.json())
                .then(data => {
                    if(data.success){
                        if(!data.connected) {
                            window.location.href = '/connect';
                        }
                        else {
                            setPageName(data.page_name)
                        }
                    }
                    else {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }
                })
        }else{
            window.location.href = '/login';
        }
    }, [])

    return (
        <div className="manage">
            <Card>
                <h3>Facebook Page Integration<br/>Integrated Page: <b>{pageName}</b></h3>
                <button className='delete' onClick={handleDelete}>Delete Integration</button>
                <Link to="/dashboard"><button>Reply to Messages</button></Link>
            </Card>
        </div>  
    )
}

export default Manage
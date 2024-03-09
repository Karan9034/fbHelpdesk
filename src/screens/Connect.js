import { useEffect } from 'react';
import Card from '../components/Card';
import '../styles/Connect.css';
import { Link } from 'react-router-dom';

const Connect = () => {

    useEffect(() => {
        if(localStorage.getItem('token') !== null){
            fetch(`${process.env.REACT_APP_API_URL}/auth/verify`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
                .then(res => res.json())
                .then(data => {
                    if(data.success){
                        if(data.connected) {
                            window.location.href = '/manage';
                        }
                    }
                    else {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }
                })
        }
    }, [])

    return (
        <div className="connect">
            <Card>
                <h3>Facebook Page Integration</h3>
                <Link to={`${process.env.REACT_APP_API_URL}/auth/facebook`}><button>Connect Page</button></Link>
            </Card>
        </div>
    )
}

export default Connect;
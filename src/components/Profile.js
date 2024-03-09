import '../styles/Profile.css'


const Profile = () => {
    return (
        <div className='profile'>
            <div className='upper'>
                <i className='material-icons' style={{fontSize: '80px'}}>account_circle</i>
                <h2>Amit RG</h2>
                <p>● Offline</p>
                <div>
                    <button><i className='material-icons'>call</i>&nbsp;&nbsp;Call</button>
                    <button><i className='material-icons'>account_circle</i>&nbsp;&nbsp;Profile</button>
                </div>
            </div>
            <div className='lower'>
                <div>
                    <h4>Customer Details</h4>
                    <p>Email: <span>amit@richpanel.com</span></p>
                    <p>First Name: <span>Amit</span></p>
                    <p>Last Name: <span>RG</span></p>
                    <a href=''>View more details</a>
                </div>
            </div>
        </div>
    )
}

export default Profile
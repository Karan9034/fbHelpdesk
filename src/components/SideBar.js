import "../styles/SideBar.css";
import InboxLogo from "../assets/inbox.svg";
import InboxSelectedLogo from "../assets/inbox-selected.svg";
import AdminLogo from '../assets/admin.png'
import AnalyticsLogo from '../assets/analytics.png'
import LogoutIcon from '../assets/logout.png'

const SideBar = ({currPage, setCurrPage}) => {
    
    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    return (
        <div className="sidebar">
            <div className="logo">
                <img src="/logo192.png" alt="logo" width={"100%"}/>
            </div>
            <div className="menu">
                {currPage === "inbox" ? (
                    <img className="menu-item selected" src={InboxSelectedLogo} alt="logo" width={"100%"}/>
                ) : (
                    <img className="menu-item" onClick={() => setCurrPage('inbox')} src={InboxLogo} alt="logo" width={"100%"}/>
                )}
                {currPage === "admin" ? (
                    <img className="menu-item selected" src={AdminLogo} alt="logo" width={"100%"}/>
                ) : (
                    <img className="menu-item" onClick={() => setCurrPage('admin')} src={AdminLogo} alt="logo" width={"100%"}/>
                )}
                {currPage === "analytics" ? (
                    <img className="menu-item selected" src={AnalyticsLogo} alt="logo" width={"100%"}/>
                ) : (
                    <img className="menu-item" onClick={() => setCurrPage('analytics')} src={AnalyticsLogo} alt="logo" width={"100%"}/>
                )}
                <img className="menu-item logout" onClick={logout} src={LogoutIcon} alt="logout" width={"100%"} />
            </div>
        </div>
    )
}

export default SideBar;
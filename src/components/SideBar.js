import "../styles/SideBar.css";
import InboxLogo from "../assets/inbox.svg";
import InboxSelectedLogo from "../assets/inbox-selected.svg";
import AdminLogo from '../assets/admin.png'
import AnalyticsLogo from '../assets/analytics.png'
import { useState } from "react";

const SideBar = () => {

    const [selected, setSelected] = useState("inbox");

    return (
        <div className="sidebar">
            <div className="logo">
                <img src="/logo192.png" alt="logo" width={"100%"}/>
            </div>
            <div className="menu">
                {selected === "inbox" ? (
                    <img className="menu-item selected" src={InboxSelectedLogo} alt="logo" width={"100%"}/>
                ) : (
                    <img className="menu-item" onClick={() => setSelected('inbox')} src={InboxLogo} alt="logo" width={"100%"}/>
                )}
                {selected === "admin" ? (
                    <img className="menu-item selected" src={AdminLogo} alt="logo" width={"100%"}/>
                ) : (
                    <img className="menu-item" onClick={() => setSelected('admin')} src={AdminLogo} alt="logo" width={"100%"}/>
                )}
                {selected === "analytics" ? (
                    <img className="menu-item selected" src={AnalyticsLogo} alt="logo" width={"100%"}/>
                ) : (
                    <img className="menu-item" onClick={() => setSelected('analytics')} src={AnalyticsLogo} alt="logo" width={"100%"}/>
                )}
            </div>
        </div>
    )
}

export default SideBar;
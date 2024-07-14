import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export const Navbar = ({ login, lbatman }) => {
    const nav = useNavigate()

    if (!login) {
        var lbatman = JSON.parse(localStorage.getItem('LoggedBatman'))||[]
    }

    return (
        <div className="navbar" style={{ display: "flex", justifyContent: "center", backgroundColor: "black", color: "wheat", border: "1px solid wheat", width: "100%", position: "fixed", top: "0%", alignItems: "center", minHeight: "10%", height: "11%", marginBottom: "150px" }}>

            {
                login ?
                    <h2 style={{ position: "fixed", cursor: "pointer" }}>🦇Batman🦇</h2>

                    :
                    <>
                        <h2 onClick={() => nav('/home')} style={{ position: "fixed", cursor: "pointer" }}>🦇Batman🦇</h2>
                        <div className="findbatmans">
                            <img src="https://img.icons8.com/?size=100&id=RsGPVZADOaiL&format=png&color=000000" alt="" style={{ width: "60%", cursor: "pointer" }} onClick={() => nav('/allbatmans')} />
                        </div>
                    </>
            }

            {
                !login ?

                    <div className="a" style={{ display: "flex", marginLeft: "80%", alignItems: "center", flexDirection: "row-reverse", width: "20px" }}>

                        <div className="findbatmans">
                            <img src="https://img.icons8.com/?size=100&id=RsGPVZADOaiL&format=png&color=000000" alt="" style={{ width: "60%", cursor: "pointer" }} onClick={() => nav('/allbatmans')} />
                        </div>

                        <div onClick={() => nav(`/myprofile/${localStorage.getItem('Id')}`)} className="batmandetails" style={{ display: "flex", marginLeft: "70%", alignItems: "center", flexDirection: "column", marginRight: "15%" }}>

                            <img src={lbatman[0]?.DP} alt="" style={{ width: "25px", borderRadius: "15px", height: "70%", cursor: "pointer" }} />
                            <h3 style={{ fontSize: "11px" }}>{lbatman[0]?.Name}</h3>

                        </div>
                        <button onClick={async () => {
                            if (window.confirm('Log Out?')) {

                                try {
                                    const res = await axios.get(`https://batman-backend.onrender.com/logoutbatman`)
                                    toast(res.data.Msg)
                                    nav('/')
                                } catch (error) {
                                    console.log(error);
                                }
                            }
                        }} style={{ cursor: "pointer", backgroundColor: "darkred", color: "wheat", borderRadius: "15px", marginLeft: "0px" }}>Logout</button>
                    </div>
                    :
                    <></>
            }
        </div>

    )
}
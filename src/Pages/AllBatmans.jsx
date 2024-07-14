import { useEffect, useState } from "react"
import { Navbar } from "../Components/Navbar"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import './AllBatmans.css'

export const AllBatmans = () => {
    const [batmans, setBatmans] = useState([])
    const [followstatus, setFollowstatus] = useState(false)
    const nav = useNavigate()

    const tokenChecker = () => {
        axios.get(`https://batman-backend.onrender.com/allbatmans`)
            .then(res => {
                if (res.data.Token) setBatmans(res.data.Allbatmans)

                else nav('/')
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        tokenChecker()
    }, [followstatus])

    console.log(batmans);

    const FollowUnfollow = async (batmantofollowid) => {
        try {
            const res = await axios.put(`https://batman-backend.onrender.com/followbatman`, { batmantofollowid })

            toast(res.data.Msg)
            setFollowstatus(!followstatus)

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="main" style={{ backgroundColor: "black", minHeight: "160vh", display: "flex", flexDirection: 'column', alignItems: "center" }}>

            <Navbar />

            <div className="batmans" style={{ marginTop: "150px", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "black", justifyContent: "flex-start" }}>
                {
                    batmans.map(batman => (
                        <div className="btmans" style={{ width: "140%" }}>

                            <div className="singlebatman" style={{ display: "flex", background: "black", color: "wheat", justifyContent: "space-between", alignItems: 'center', border: "1px solid wheat", borderRadius: "15px" }}>

                                <div onClick={() => nav(`/myprofile/${batman._id}`)} className="btmaninfo" style={{ display: "flex", color: "wheat", alignItems: "center", height: "55px", marginLeft: "3%" }}>
                                    <img src={batman.DP} alt="" style={{ width: "38%", borderRadius: '180px', height: "50px" }} />
                                    <p>{batman.Name}</p>
                                </div>

                                {
                                    batman._id == localStorage.getItem('Id') ?
                                        <h1 onClick={() => nav(`/myprofile/${batman._id}`)} style={{ cursor: "pointer" }}>🦇</h1>
                                        :
                                        batman.Followers.includes(localStorage.getItem('Id')) ?
                                            <button onClick={() => FollowUnfollow(batman._id)} style={{ width: "auto", height: "30px", backgroundColor: "darkred", color: "wheat", borderRadius: "15px" }} className="fuf">Unfollow</button>
                                            :
                                            <button onClick={() => FollowUnfollow(batman._id)} style={{ width: "auto", height: "30px", backgroundColor: "darkgreen", color: "wheat", borderRadius: "15px" }} className="fuf">Follow</button>

                                }

                            </div>

                            <br />

                        </div>
                    ))
                }

            </div>

            <button onClick={() => nav(-1)} style={{ backgroundColor: "black", color: "wheat", width: "auto", marginTop: "5%", borderRadius: "15px", fontSize: "medium", padding: "10px", height: "auto" }}>Back</button>

        </div>

    )
}
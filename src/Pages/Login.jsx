import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import './Login.css'
import { Navbar } from "../Components/Navbar"

export const Login = () => {

    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const nav = useNavigate()

    axios.defaults.withCredentials = true
    const tokenChecker = async () => {
        try {
            const res = await axios.get(`https://batman-backend.onrender.com/getallposts`)
            if (!res.data.Token) {
                localStorage.clear()
                nav('/')
            }

            else nav('/home')

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [])


    const SubmitForm = (e) => {
        e.preventDefault()

        axios.post(`https://batman-backend.onrender.com/loginbatman`, { email, pwd })
            .then(res => {
                if (res.data.ValidationError) {
                    res.data.ActError.map((v) => toast(v.msg))
                }

                else if (res.data.AlreadyLoggedin) nav('/home')

                else {

                    if (res.data.LoggedIn) {
                        localStorage.setItem('LoggedBatman', JSON.stringify(res.data.LoggedBatman))

                        localStorage.setItem('Id', res.data.LoggedBatman[0]._id)

                        toast(res.data.Msg)

                        nav('/home')
                    }

                    else if (res.data.Msg === `Incorrect Password`) toast(res.data.Msg)

                    else toast(res.data.Msg)
                }
            })
            .catch(err => console.log(err))
    }



    return (
        <div className="main" style={{ backgroundColor: "black" }} >
            <Navbar login={true} />

            <br />

            <div className="logincontent" style={{ display: "flex", backgroundColor: "black", minHeight: "100vh", flexDirection: 'row', justifyContent: "space-around", marginTop: "125px" }}>

                <div className="batmanimage">
                    <img src="https://wallpapers.com/images/hd/the-batman-2022-darkness-r489d3hmw1u9iwwa.jpg" alt="" style={{ height: "60%", width: "80%", borderRadius: "15px" }} />
                </div>

                <div className="form" style={{ border: "1px solid wheat", width: "35%", display: "flex", justifyContent: "center", color: "wheat", backgroundColor: 'black', marginTop: "0%", borderRadius: "15px", height: "60vh", alignItems: "center", marginRight: "5%" }}>

                    <form action="" onSubmit={SubmitForm} style={{ width: "100%" }}>
                        <h1>Login</h1>

                        <label htmlFor="email">Email</label>
                        <br />
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "80%", backgroundColor: "black", color: "wheat", borderRadius: "15px", textAlign: "center" }} />

                        <br />
                        <br />

                        <label htmlFor="pwd">Password</label>
                        <br />
                        <input type="password" id="pwd" value={pwd} onChange={e => setPwd(e.target.value)} style={{ width: "80%", backgroundColor: "black", color: "wheat", borderRadius: "15px", textAlign: "center" }} />

                        <br />
                        <br />

                        <button type="submit" style={{ backgroundColor: "black", color: "wheat", width: "auto", borderRadius: "15px", minWidth: "8%" }}>Login</button>

                        <br />
                        <br />
                        <hr />

                        <button onClick={() => nav('/register')} className="newuser" style={{ backgroundColor: "black", color: "wheat", width: "auto", borderRadius: "15px", minWidth: "8%", marginTop: "4%" }}>New User?</button>
                    </form>


                </div>
            </div>

        </div>
    )
}
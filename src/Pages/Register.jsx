import { useEffect, useState } from "react"
import { Navbar } from "../Components/Navbar"
import { useNavigate } from "react-router-dom"
import './Login.css'
import axios from "axios"
import { toast } from "react-toastify"

export const Register = () => {
    const [name, setName] = useState("")
    const [age, setAge] = useState(Number(""))
    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const nav = useNavigate()

    axios.defaults.withCredentials = true
    const tokenChecker = async () => {
        try {
            const res = await axios.get(`https://batman-backend.onrender.com/getallposts`)
            if (!res.data.Token) {
                localStorage.clear()

            }

            else nav('/home')

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [])

    const handleSubmit = e => {
        e.preventDefault()

        axios.post(`https://batman-backend.onrender.com/registerbatman`, { name, age, email, pwd })
            .then(res => {
                if (res.data.ValidationError) res.data.ActError.map((e) => toast(e.msg))
                else {
                    toast(res.data)
                    nav('/')
                }
            })
            .catch(er => console.log(er))

    }

    return (
        <div className="main" style={{ backgroundColor: "black", marginTop: "20px" }} >

            <Navbar login={true} />

            <br />
            <br />
            <br />
            <br />

            <div className="registercontent" style={{ display: "flex", backgroundColor: "black", minHeight: "100vh", flexDirection: 'row', justifyContent: "space-evenly" }}>

                <div className="batmanimage">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIYwTsrYZB9ofXO-rpZY8BBNtdNvoxGOh9XV_4WyoRlkXmU_8NqrLf7EWIJoY5OsTstUI&usqp=CAU" alt="" style={{ height: "55%", marginTop: "55.5%", width: "150%", borderRadius: "15px" }} />
                </div>

                <div className="rform" style={{ border: "1px solid wheat", width: "35%", display: "flex", justifyContent: "center", color: "wheat", backgroundColor: 'black', marginTop: "10%", borderRadius: "15px", height: "85%", alignItems: "center", }}>

                    <form action="" onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <h1>Register</h1>
                        <label htmlFor="name">Name</label>
                        <br />
                        <input type="text" value={name} id="name" onChange={(e) => setName(e.target.value)} style={{ width: "80%", backgroundColor: "black", color: "wheat", borderRadius: "15px", textAlign: "center" }} />

                        <br />
                        <br />

                        <label htmlFor="age">Age</label>
                        <br />
                        <input type="number" value={age} id="age" onChange={(e) => setAge(e.target.value)} style={{ width: "80%", backgroundColor: "black", color: "wheat", borderRadius: "15px", textAlign: "center" }} />

                        <br />
                        <br />

                        <label htmlFor="email">Email</label>
                        <br />
                        <input type="email" value={email} id="email" onChange={(e) => setEmail(e.target.value)} style={{ width: "80%", backgroundColor: "black", color: "wheat", borderRadius: "15px", textAlign: "center" }} />

                        <br />
                        <br />

                        <label htmlFor="pwd">Password</label>
                        <br />
                        <input type="password" value={pwd} id="pwd" onChange={(e) => setPwd(e.target.value)} style={{ width: "80%", backgroundColor: "black", color: "wheat", borderRadius: "15px", textAlign: "center" }} />

                        <br />
                        <br />

                        <button type="submit" style={{ backgroundColor: "black", color: "wheat", width: "auto", borderRadius: "15px", minWidth: "8%", marginTop: "4%" }}>Register</button>

                        <br />
                        <br />
                        <hr />

                        <button onClick={() => nav('/')} className="newuser" style={{ backgroundColor: "black", color: "wheat", width: "auto", borderRadius: "15px", minWidth: "8%", marginTop: "4%", marginBottom: "4%" }}>Already a user?</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
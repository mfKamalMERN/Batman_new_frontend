import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Navbar } from "../Components/Navbar"
import { TableDisplayer } from "../Components/TableDisplayer"
import { toast } from "react-toastify"

export const MyProfile = () => {
    const [lbatman, setLbatman] = useState([])
    const [myfollowings, setMyfollowings] = useState([])
    const [myfollowers, setMyfollowers] = useState([])
    const [followingsstatus, setFollowingsstatus] = useState(false)
    const [followersstatus, setFollowersstatus] = useState(false)
    const [nameupdatestatus, setNameupdatestatus] = useState(false)
    const [pwdstatus, setPwdstatus] = useState(false)
    const [oldpwd, setOldpwd] = useState("")
    const [newpwd, setNewpwd] = useState("")
    const [confirmpwd, setConfirmpwd] = useState("")
    const [newpoststatus, setNewpoststatus] = useState(false)
    const [batmanid, setBatmanid] = useState(null)
    const [newname, setNewname] = useState("")
    const [caption, setCaption] = useState("")
    const [file, setFile] = useState(null)
    const [dp, setDp] = useState(null)
    const [lname, setLname] = useState("")
    const [freq, setFreq] = useState(false)
    const [dpsetter, setDpsetter] = useState(false)
    const nav = useNavigate()
    const { bid } = useParams()

    axios.defaults.withCredentials = true
    const tokenChecker = () => {
        axios.get(`https://batman-backend.onrender.com/getbatmandetails/${bid}`)
            .then(res => {
                if (!res.data.Token) {
                    localStorage.clear()
                    nav('/')
                }

                else {
                    setLbatman(res.data.LoggedBatman)
                    setLname(res.data.LoggedBatman[0].Name)
                    setBatmanid(bid)
                    if (followersstatus || followingsstatus) {
                        setFollowersstatus(false)
                        setFollowingsstatus(false)
                    }
                }
            })
            .catch(er => console.log(er))
    }

    useEffect(() => {
        tokenChecker()

    }, [bid, newname, newpoststatus, freq, dpsetter])

    const MyFollowings = async () => {
        try {
            setFollowingsstatus(!followingsstatus)
            setFollowersstatus(false)
            setNewpoststatus(false)
            const res = await axios.get(`https://batman-backend.onrender.com/getmyfollowings/${batmanid}`)
            setMyfollowings(res.data.Followings)

        } catch (error) {
            console.log(error);
        }
    }

    const MyFollowers = async () => {
        try {
            setFollowingsstatus(false)
            setNewpoststatus(false)
            setFollowersstatus(!followersstatus)
            const res = await axios.get(`https://batman-backend.onrender.com/getmyfollowers/${bid}`)
            setMyfollowers(res.data.Followers)

        } catch (error) {
            console.log(error);
        }
    }

    const nameUpdate = (batmanname) => {
        setNameupdatestatus(!nameupdatestatus)
        setNewname(batmanname)
    }

    const UpdateName = () => {
        setNameupdatestatus(false)
        setNewpoststatus(false)

        if (newname.trim() === "") toast(`Invalid Name`)

        else {
            axios.put(`https://batman-backend.onrender.com/editname`, { newname })
                .then(res => {
                    toast(res.data.Msg)
                    setNewname("")
                    setNameupdatestatus(false)
                })
                .catch(er => console.log(er))
        }
    }

    const UploadPost = async (e) => {
        e.preventDefault()
        if (file === null || caption.trim === "") toast(`Invalid entries`)
        else {
            const formdata = new FormData()

            formdata.append('file', file)
            formdata.append('caption', caption)

            try {
                const res = await axios.post(`https://batman-backend.onrender.com/createpost`, formdata)
                toast(res.data.Msg)
                setNewpoststatus(false)

            } catch (error) {
                console.log(error);
            }

        }
    }

    const FollowUnfollow = (batmantofollowid) => {
        axios.put(`https://batman-backend.onrender.com/followbatman`, { batmantofollowid })
            .then(res => {
                toast(res.data.Msg)
                setFreq(!freq)
            })
            .catch(er => console.log(er))
    }

    const editPwd = e => {
        e.preventDefault()

        axios.put(`https://batman-backend.onrender.com/editpwd`, { oldpwd, newpwd, confirmpwd })
            .then(res => {
                if (!res.data.Updated) toast(res.data.Msg)
                else {
                    toast(res.data.Msg)
                    setPwdstatus(false)
                    setOldpwd("")
                    setNewpwd("")
                    setConfirmpwd("")
                }

            })
            .catch(er => console.log(er))
    }

    return (
        <div className="all" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", background: "black", height: "150vh", color: 'wheat', alignItems: "center" }}>

            <Navbar />

            <h2 style={{ marginTop: "150px" }}>{lname}'s Profile</h2>

            <div className="table" style={{ marginTop: "2%", display: "flex", justifyContent: "center" }}>

                <table border={1} style={{ width: "50%" }}>
                    <thead>
                        <tr>

                            <th>Name</th>
                            <th>Avatar</th>
                            <th>Posts</th>
                            <th>Following</th>
                            <th>Followers</th>
                        </tr>
                    </thead>

                    {
                        lbatman.map((batman) => (

                            batman._id != localStorage.getItem('Id') ?

                                <tbody>
                                    <tr>
                                        <td>{batman.Name}</td>

                                        <td><img src={batman.DP} alt="" style={{ width: "40px", borderRadius: "80px", height: "auto" }} /></td>

                                        <td><button onClick={() => nav(`/home/${batman._id}`)}>{batman.Posts.length}</button></td>

                                        <td><button onClick={MyFollowings}>{batman.Following.length}</button></td>

                                        <td><button onClick={MyFollowers}>{batman.Followers.length}</button></td>
                                    </tr>
                                </tbody>
                                :
                                <tbody>
                                    <tr>
                                        {
                                            !nameupdatestatus ?
                                                <td>{batman.Name}<button onClick={() => nameUpdate(batman.Name)}> ✏️</button></td>
                                                :
                                                <>
                                                    <input type="text" value={newname} onChange={e => setNewname(e.target.value)} />
                                                    <button onClick={UpdateName}>Update</button>
                                                </>

                                        }

                                        <td>
                                            <img src={batman.DP} alt="" style={{ width: "40px", borderRadius: "80px", height: "auto" }} />
                                            <br />
                                            {
                                                !dpsetter ?
                                                    <button onClick={() => setDpsetter(!dpsetter)}> ✏️DP</button>
                                                    :
                                                    <>
                                                        <input type="file" required onChange={(e) => setDp(e.target.files[0])} />

                                                        <button onClick={() => {
                                                            if (dp === null) toast("Please select an Image for Display Pic")
                                                            else {
                                                                const fd = new FormData()
                                                                fd.append('file', dp)

                                                                axios.put(`https://batman-backend.onrender.com/uploaddp`, fd)
                                                                    .then(res => {
                                                                        toast(res.data.Msg)

                                                                        setDpsetter(false)

                                                                        localStorage.setItem('LoggedBatman', JSON.stringify(res.data.Lbatman))

                                                                        localStorage.setItem('LoggedBatman', JSON.stringify(res.data.Lbatman))


                                                                    })
                                                                    .catch(er => console.log(er))
                                                            }
                                                        }}>Update</button>
                                                    </>
                                            }
                                            <br />
                                            {
                                                !pwdstatus ?
                                                    <button onClick={() => setPwdstatus(!pwdstatus)}>✏️Pwd</button>
                                                    :
                                                    <form action="" onSubmit={editPwd}>
                                                        <label htmlFor="oldpwd">Old Pwd</label>
                                                        <input type="password" value={oldpwd} onChange={(e) => setOldpwd(e.target.value)} id="oldpwd" />
                                                        <br />
                                                        <label htmlFor="newpwd">New Pwd</label>
                                                        <input type="password" value={newpwd} onChange={e => setNewpwd(e.target.value)} id="newpwd" />
                                                        <br />
                                                        <label htmlFor="confirmpwd">Confirm Pwd </label>
                                                        <input type="password" value={confirmpwd} onChange={e => setConfirmpwd(e.target.value)} id="confirmpwd" />
                                                        <button type="submit">Update</button>
                                                    </form>

                                            }
                                        </td>

                                        <td><button onClick={() => nav(`/home/${batman._id}`)}>{batman.Posts.length}</button> <button onClick={() => setNewpoststatus(!newpoststatus)}>➕Post</button></td>

                                        <td><button onClick={MyFollowings}>{batman.Following.length}</button></td>

                                        <td><button onClick={MyFollowers}>{batman.Followers.length}</button></td>
                                    </tr>
                                </tbody>

                        ))
                    }

                </table>

            </div>

            <br />
            <br />

            <button onClick={() => nav(-1)} style={{ backgroundColor: "black", color: "wheat", width: "auto", marginTop: "5%", borderRadius: "15px", fontSize: "small", padding: "10px", height: "auto" }}>Back</button>

            <div className="table" style={{ display: "flex", justifyContent: "center", marginTop: "5%" }}>
                {
                    !followingsstatus ?
                        <></>
                        :
                        <div className="tbl" style={{ display: "flex", flexDirection: "column" }}>

                            <h3>Followings:</h3>
                            <TableDisplayer batmans={myfollowings} FollowUnfollow={FollowUnfollow} />
                        </div>

                }
            </div>

            <div className="table" style={{ display: "flex", justifyContent: "center" }}>

                {
                    !followersstatus ?
                        <></>
                        :
                        <div className="tbl" style={{ display: "flex", flexDirection: "column" }}>

                            <h3>Followers:</h3>
                            <TableDisplayer batmans={myfollowers} MyF={MyFollowers} FollowUnfollow={FollowUnfollow} />
                        </div>
                }
            </div>

            {
                !newpoststatus ?
                    <></>
                    :
                    <div className="form" style={{ border: "1px solid wheat", width: "50%", marginLeft: "25%", display: "flex", flexDirection: "column", marginTop: "5%" }}>

                        <form action="" onSubmit={UploadPost} style={{ width: "100%" }}>
                            <label htmlFor="caption">Caption</label>
                            <input type="text" id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} />

                            <input type="file" onChange={(e) => setFile(e.target.files[0])} />

                            <button type="submit">➕</button>
                        </form>
                    </div>
            }

        </div>
    )
}
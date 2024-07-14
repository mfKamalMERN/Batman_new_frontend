import { useNavigate } from "react-router-dom"
import { Navbar } from "./Navbar"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import './Card.css'
import { saveAs } from 'file-saver';

export const PostsDisplayer = ({ values, posts, batmans, postsFetcher }) => {

    const { AddNewComment, setNewcomment, newcomment, FollowUnfollow, RemoveComment, editStatussetter, UpdateComment, setUpdatedcomment, updatedcomment, commentid, editstatus, postid, commentstatus, likes, likesstatus, viewComments, ViewLikesSetter, LikeUnlike } = values

    const [editpoststatus, setEditpoststatus] = useState(false)
    const [file, setFiile] = useState(null)
    const [newcaption, setNewcaption] = useState("")
    const [submitStatus, setSubmitstatus] = useState(false)
    const [epid, setEpid] = useState("")

    const nav = useNavigate()

    const updatePost = async (values) => {
        const { PostID } = values
        const formdata = new FormData()
        if (file === null) toast("Pleas select an image file")
        else if (newcaption.trim() === "") toast("Captionm is Empty")
        else {

            formdata.append('file', file)
            formdata.append('newcaption', newcaption)


            try {
                const res = await axios.put(`https://batman-backend.onrender.com/editpost/${PostID}`, formdata)
                toast(res.data)
                setEditpoststatus(false)
                setSubmitstatus(!submitStatus)


            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        postsFetcher()
    }, [submitStatus])


    const deletePost = (pid) => {

        if (window.confirm("Removing this post...")) {
            axios.delete(`https://batman-backend.onrender.com/removepost/${pid}`)
                .then(res => toast(res.data.Msg))
                .catch(err => console.log(err))
        }
    }

    const ViewImage = (url) => {

        // console.log(url);
        // const bloburl = URL.createObjectURL(new Blob([url],{type:"application/pdf"}))
        // console.log(bloburl);
        // saveAs(url, 'image.pdf')
        // const a = document.createElement('a')
        // a.href = url
        // a.download = 'img.JPG'
        // document.body.appendChild(a)
        // a.click()
        saveAs(url, 'image.JPG')
    }


    return (
        <div className="allposts" style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", color: "wheat", backgroundColor: "black", minWidth: "95%", minHeight: "100vh" }}>

            <Navbar />

            {
                posts.map((post) => (

                    <div className="card" >

                        <div className="createdby" style={{ display: "flex", border: "1px solid wheat", width: "70%", justifyContent: "space-around", backgroundColor: "black", color: "wheat", borderRadius: "8px", alignItems: "center" }}>

                            <p>Created By: </p>

                            <div className="ownerdetails" style={{ display: "flex", flexDirection: "row-reverse", width: "40%", alignItems: "center" }}>

                                <p>{batmans.find((batman) => batman._id == post.Owner).Name}</p>

                                <img src={batmans.find((batman) => batman._id == post.Owner).DP} alt="" style={{ width: "28px", borderRadius: "50%" }} />

                            </div>

                        </div>

                        {
                            editpoststatus && (post._id == epid) ?
                                <>


                                    <label htmlFor="newcaption">Caption</label>
                                    <input type="text" id="newcaption" value={newcaption} onChange={e => setNewcaption(e.target.value)} />
                                    <input type="file" required onChange={e => setFiile(e.target.files[0])} />
                                    <button onClick={() => updatePost({ PostID: post._id, Caption: post.Caption })}>Update</button>
                                    <button onClick={() => setEditpoststatus(false)}>Cancel</button>
                                </>
                                :
                                <>
                                    <p>{post.Caption}</p>
                                    <img onClick={() => ViewImage(post.Img)} src={post.Img} alt="" style={{ width: "90%", borderRadius: "15px" }} />

                                    <div className="actionbtns">
                                        {
                                            post.Owner == localStorage.getItem('Id') ?
                                                <>
                                                    <button onClick={() => {
                                                        setNewcaption(post.Caption)
                                                        setEpid(post._id)
                                                        setEditpoststatus(!editpoststatus)
                                                    }
                                                    } >✏️</button>
                                                    <button onClick={() => deletePost(post._id)}>🪣</button>
                                                </>
                                                :
                                                <></>
                                        }
                                    </div>
                                </>
                        }

                        <div className="actionbuttons" style={{ display: "flex", justifyContent: "space-evenly", marginTop: "5%", width: "80%" }}>

                            {
                                post.Likes.includes(localStorage.getItem('Id')) ?

                                    <button onClick={() => LikeUnlike(post._id)} style={{ backgroundColor: "black", color: "wheat", borderRadius: "15px", width: "auto", fontSize: "small" }}>❤️ ({post.Likes.length})</button>
                                    :
                                    <button onClick={() => LikeUnlike(post._id)} style={{ backgroundColor: "black", color: "wheat", borderRadius: "15px", width: "auto", fontSize: "small" }}>🩶 ({post.Likes.length})</button>
                            }

                            <button onClick={() => ViewLikesSetter(post._id)} style={{ backgroundColor: "black", color: "wheat", borderRadius: "15px", width: "auto", fontSize: "small" }}>ℹ️ Likes</button>

                            <button onClick={() => viewComments(post._id)} style={{ backgroundColor: "black", color: "wheat", borderRadius: "15px", width: "auto", fontSize: "small" }}>Comments</button>

                        </div>
                        {
                            likesstatus && post._id == postid ?
                                post.Likes.length == 0 ?
                                    <>No Likes on this post yet</>
                                    :
                                    <>
                                        <h4>Likes</h4>
                                        {
                                            likes.map((v) => (

                                                <div className="likedbatman" style={{ display: "flex", justifyContent: "space-evenly", border: "1px solid wheat", width: "82%", alignItems: "center", marginTop: "3%", backgroundColor: "black", borderRadius: "15px" }}>

                                                    <div className="likedbatmandetails" style={{ display: "flex", alignItems: 'center', justifyContent: "flex-start", width: "25%" }}>

                                                        <img src={v.DP} style={{ width: "25px", borderRadius: "50px", height: "auto" }} />

                                                        <p style={{ fontSize: "13px" }}>{v.Name}</p>

                                                    </div>

                                                    <div className="followactions" style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>

                                                        {
                                                            v._id == localStorage.getItem('Id') ?
                                                                <button onClick={() => nav(`/myprofile/${v._id}`)} style={{ color: "wheat", backgroundColor: "black", border: "1px solid wheat", borderRadius: "15px" }}>ℹ️</button>
                                                                :
                                                                batmans.find(batman => batman._id == v._id).Followers.includes(localStorage.getItem('Id')) ?
                                                                    <button onClick={() => FollowUnfollow(v._id)} style={{ color: "wheat", backgroundColor: "black", border: "1px solid wheat", borderRadius: "15px", width: "auto" }}>Unfollow</button>
                                                                    :
                                                                    <button onClick={() => FollowUnfollow(v._id)} style={{ color: "wheat", backgroundColor: "black", border: "1px solid wheat", borderRadius: "15px", width: "auto" }}>Follow</button>

                                                        }
                                                    </div>

                                                </div>
                                            ))
                                        }
                                    </>
                                :
                                <></>

                        }

                        {
                            !commentstatus && post._id == postid ?
                                <></>
                                :
                                post.Comments.map((cmnt) => (

                                    <div className="singlecomment" style={{ display: "flex", backgroundColor: "black", alignItems: "center", border: "1px solid wheat", marginTop: "5%", borderRadius: "10px", width: "95%" }}>

                                        <div className="cbatman" style={{ display: "flex", alignItems: "center", width: "80%" }}>

                                            <img src={batmans.find((batman) => batman._id == cmnt.CommentedBy).DP} alt="" style={{ width: "18px", borderRadius: "50px", marginLeft: "5%" }} />

                                            <p style={{ marginLeft: "5%", fontSize: "x-small" }}>{batmans.find((batman) => batman._id == cmnt.CommentedBy).Name}</p>

                                        </div>

                                        <div className="comment" style={{ marginRight: "40%", display: "flex", width: "100%" }}>
                                            {
                                                editstatus && cmnt._id == commentid ?
                                                    <>
                                                        <input type="text" value={updatedcomment} onChange={e => setUpdatedcomment(e.target.value)} />

                                                        <button onClick={() => UpdateComment([cmnt._id, post._id])}>Update</button>
                                                    </>
                                                    :
                                                    <>
                                                        <p style={{ fontSize: "smaller", marginLeft: "10%" }}>{cmnt.Comment}</p>
                                                        {
                                                            cmnt.CommentedBy == localStorage.getItem('Id') ?
                                                                <div className="btns" style={{ display: "flex", alignItems: "center" }}>

                                                                    <button onClick={() => editStatussetter([cmnt._id, cmnt.Comment])} style={{ height: "45%", marginTop: "3.5%", marginLeft: "3.5%", backgroundColor: "black", width: "auto", fontSize: "x-small" }}>✏️</button>

                                                                    <button onClick={() => RemoveComment([post._id, cmnt._id])} style={{ height: "50%", marginTop: "3.5%", marginLeft: "1%", backgroundColor: "black", color: "white", borderRadius: "10px", fontSize: "x-small" }}>🪣</button>
                                                                </div>

                                                                :
                                                                <></>
                                                        }
                                                    </>

                                            }

                                        </div>

                                        <div className="followactions" style={{ display: "flex", alignItems: "center", marginRight: "10px" }}>

                                            {
                                                cmnt.CommentedBy == localStorage.getItem('Id') ?
                                                    <button onClick={() => nav(`/myprofile/${cmnt.CommentedBy}`)} style={{ fontSize: "smaller", backgroundColor: "black", color: "wheat", borderRadius: "10px" }}>ℹ️</button>
                                                    :
                                                    batmans.find((batman) => batman._id == cmnt.CommentedBy).Followers.includes(localStorage.getItem('Id')) ?

                                                        <button onClick={() => FollowUnfollow(cmnt.CommentedBy)} style={{ marginRight: "0px", backgroundColor: "red", color: "white", borderRadius: "15px" }}>Unfollow</button>
                                                        :
                                                        <button onClick={() => FollowUnfollow(cmnt.CommentedBy)} style={{ marginRight: "0px", backgroundColor: "darkgreen", color: "wheat", borderRadius: "15px" }}>Follow</button>

                                            }
                                        </div>

                                    </div>
                                ))
                        }

                        <div className="addcomment" style={{ marginTop: "3%", backgroundColor: "black", width: "100%", marginBottom: "0.7%" }}>

                            <input type="text" placeholder="Comment..." style={{ width: '80%', backgroundColor: "black", textAlign: "center", color: "wheat", height: "80%", borderRadius: "50px" }} value={newcomment} onChange={(e) => setNewcomment(e.target.value)} />

                            <button onClick={() => AddNewComment(post._id)} style={{ backgroundColor: "black" }}>➕</button>
                        </div>

                    </div>
                ))

            }

        </div>
    )
}
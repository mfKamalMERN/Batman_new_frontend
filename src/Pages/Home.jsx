import { fetchPosts } from '../Redux/postSlice';
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PostsDisplayer } from '../Components/PostsDisplayer';


export const Home = () => {
    const [likes, setLikes] = useState([])
    const [likesstatus, setLikesstatus] = useState(false)
    const [commentstatus, setCommentstatus] = useState(false)
    const [editstatus, setEditstatus] = useState(false)
    const [removecommentstatus, setRemovecommentstatus] = useState(false)
    const [followstatus, setFollowstatus] = useState(false)
    const [postid, setPostid] = useState(null)
    const [commentid, setCommentid] = useState(null)
    const [newcomment, setNewcomment] = useState("")
    const [posts, setPosts] = useState([])
    const [allbatman, setAllbatman] = useState([])
    const [updatedcomment, setUpdatedcomment] = useState("")
    const nav = useNavigate()
    const dispatch = useDispatch()
    const { batmanid } = useParams()

    const datas = useSelector((s) => s.posts)

    axios.defaults.withCredentials = true

    const tokenChecker = () => nav('/')

    const postsFetcher = async () => {

        if (!batmanid) dispatch(fetchPosts())
        else {
            try {
                const res = await axios.get(`https://batman-backend.onrender.com/getbatmanposts/${batmanid}`)

                if (!res.data.Token) nav('/')
                else {
                    if (res.data.Access) {
                        if (res.data.NoPosts) {
                            toast(res.data.Msg)
                            nav(`/myprofile/${batmanid}`)
                        }
                        else {
                            setPosts(res.data.Posts)
                            setAllbatman(res.data.Batmans)
                            setCommentstatus(!commentstatus)
                        }
                    }
                    else {
                        toast(res.data.Msg)
                        nav(`/myprofile/${batmanid}`)
                    }
                }

            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        postsFetcher()
        // setCommentstatus(false)
        // if (!commentstatus) setLikesstatus(true)
        // else setLikesstatus(false)
    }, [likes, newcomment, updatedcomment, removecommentstatus, followstatus, posts, datas?.data?.AllPosts])

    const ViewLikesSetter = (pid) => {
        setCommentstatus(false)
        setLikesstatus(true)
        setPostid(pid)
        ViewLikes(pid)
    }

    const ViewLikes = async (pid) => {
        try {
            const res = await axios.get(`https://batman-backend.onrender.com/viewlikes/${pid}`)
            setLikes(res.data.Likes)
        } catch (error) {
            console.log(error);
        }
    }

    const viewComments = (pid) => {
        setLikesstatus(false)
        setCommentstatus(true)
        setPostid(pid)
    }

    const LikeUnlike = (pid) => {
        axios.put(`https://batman-backend.onrender.com/likeunlikepost/${pid}`)
            .then(res => {
                ViewLikes(pid)
                // toast(res.data.Msg)
            })
            .catch(er => console.log(er))
    }

    const AddNewComment = async (pid) => {

        try {
            const res = await axios.post(`https://batman-backend.onrender.com/addcomment/${pid}`, { newcomment })

            toast(res.data.Msg)
            setNewcomment("")

        } catch (error) {
            console.log(error);
        }

    }

    const editStatussetter = ([cid, comment]) => {
        setEditstatus(!editstatus)
        setCommentid(cid)
        setUpdatedcomment(comment)
    }


    const UpdateComment = ([cid, pid]) => {

        if (updatedcomment.trim() === "") toast("Invalid Comment")
        else {
            axios.put(`https://batman-backend.onrender.com/editcomment/${pid}`, { updatedcomment, cid })
                .then(res => {
                    toast(res.data.Msg)
                    setEditstatus(false)
                    setUpdatedcomment("")
                })
                .catch(err => console.log(err))
        }
        setEditstatus(false)
    }

    const RemoveComment = async (values) => {
        const pid = values[0]
        const cid = values[1]
        try {
            const res = await axios.put(`https://batman-backend.onrender.com/removecomment/${pid}`, { cid })
            toast(res.data.Msg)
            setRemovecommentstatus(!removecommentstatus)

        } catch (error) {
            console.log(error);
        }

    }

    const FollowUnfollow = async (batmantofollowid) => {
        try {
            const res = await axios.put(`https://batman-backend.onrender.com/followbatman`, { batmantofollowid })
            setFollowstatus(!followstatus)
            toast(res.data.Msg)


        } catch (error) {
            console.log(error);
        }
    }

    if (batmanid) {
        return (
            <PostsDisplayer values={{ AddNewComment, setNewcomment, newcomment, FollowUnfollow, RemoveComment, editStatussetter, UpdateComment, setUpdatedcomment, updatedcomment, commentid, editstatus, postid, commentstatus, likes, likesstatus, viewComments, ViewLikesSetter, LikeUnlike }} posts={posts} batmans={allbatman} postsFetcher={postsFetcher} />
        )
    }

    else if (datas?.isLoading && typeof (datas?.data) !== "object") {
        return (
            <>Loading...</>
        )
    }

    else {
        console.log(datas?.data);
        return (
            <div className="home" style={{ backgroundColor: "black", minHeight: "190vh" }}>

                {
                    !datas?.data?.Token
                        ?
                        tokenChecker()
                        :
                        <PostsDisplayer values={{ AddNewComment, setNewcomment, newcomment, FollowUnfollow, RemoveComment, editStatussetter, UpdateComment, setUpdatedcomment, updatedcomment, commentid, editstatus, postid, commentstatus, likes, likesstatus, viewComments, ViewLikesSetter, LikeUnlike }} posts={datas?.data?.AllPosts} batmans={datas?.data?.AllBatman} postsFetcher={postsFetcher} />
                }
            </div>
        )
    }

}
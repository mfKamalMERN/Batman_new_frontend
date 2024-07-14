
import { useNavigate } from "react-router-dom"

export const TableDisplayer = ({ batmans, FollowUnfollow }) => {
    const nav = useNavigate()


    // const FollowUnfollow = (batmantofollowid) => {
    //     axios.put(`http://localhost:9000/followbatman`, { batmantofollowid })
    //         .then(res => toast(res.data.Msg))
    //         .catch(er => console.log(er))
    // }


    return (
        <div className="table" style={{ marginTop: "2%", display: "flex", justifyContent: "center" }}>

            <table border={1} style={{ width: "40%" }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Avatar</th>
                        <th>Posts</th>
                        <th>Following</th>
                        <th>Followers</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        batmans?.map((batman) => (

                            <tr key={batman?._id}>

                                <td>{batman?.Name}</td>

                                <td onClick={() => nav(`/myprofile/${batman?._id}`)}><img src={batman?.DP} alt="" style={{ width: "37px", borderRadius: "80px", marginTop: "10%" }} /></td>

                                <td><button onClick={() => nav(`/home/${batman?._id}`)} style={{ backgroundColor: "darkgreen", color: 'wheat', borderRadius: "15px" }}>{batman?.Posts.length}</button></td>

                                <td>{batman?.Following.length}</td>

                                <td>{batman?.Followers.length}</td>
                                {
                                    batman?.Followers.includes(localStorage.getItem('Id')) ?
                                        <td><button onClick={() => FollowUnfollow(batman._id)} style={{ backgroundColor: "darkred", color: "wheat", borderRadius: '15px' }}>Unfollow</button></td>
                                        :
                                        <td><button onClick={() => FollowUnfollow(batman._id)} style={{ backgroundColor: "darkgreen", color: "wheat", borderRadius: '15px' }}>Follow</button></td>
                                }

                            </tr>

                        ))
                    }

                </tbody>

            </table>
        </div>
    )
}
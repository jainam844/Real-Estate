import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Suspense, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Skeleton } from "@mui/material"; // Import Skeleton from MUI

function ProfilePage() {
  const { currentUser, updateUser } = useContext(AuthContext)
  const navigate = useNavigate();
  const data = useLoaderData();
  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      localStorage.removeItem("user")
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const renderCardSkeletons = () => {
    return Array(6).fill().map((_, index) => (
      <div key={index} className="skeletonCard">
        <Skeleton variant="rectangular" width={210} height={118} />
        <Skeleton width="60%" />
        <Skeleton width="80%" />
      </div>
    ));
  };
  
  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>

            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "noavatar.jpg"} alt="" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>My List</h1>
            <Link to="/add">
              <button>Create New Post</button>
            </Link>
          </div>
          <Suspense fallback={<div className="skeletonContainer">{renderCardSkeletons()}</div>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) =>
                <List posts={postResponse.data.userPosts} />
              }
            </Await>
          </Suspense>


          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<div className="skeletonContainer">{renderCardSkeletons()}</div>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) =>
                <List posts={postResponse.data.savedPosts} />
              }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import { Skeleton } from "@mui/material"; // Import Skeleton from MUI

function ListPage() {
  const data = useLoaderData();

  // Render skeleton for cards (Placeholder while loading)
  const renderCardSkeletons = () => {
    return Array(6).fill().map((_, index) => (
      <div key={index} className="skeletonCard">
        <Skeleton variant="rectangular" width={210} height={118} />
        <Skeleton width="60%" />
        <Skeleton width="80%" />
      </div>
    ));
  };

  // Render skeleton for map (Placeholder while loading)
  const renderMapSkeleton = () => (
    <Skeleton variant="rectangular" width="100%" height={400} />
  );

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <Suspense fallback={<div className="skeletonContainer">{renderCardSkeletons()}</div>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) =>
                postResponse && Array.isArray(postResponse.data) ? (
                  postResponse.data.length > 0 ? (
                    postResponse.data.map((post) => (
                      <Card key={post.id} item={post} />
                    ))
                  ) : (
                    <p>No posts available</p>
                  )
                ) : (
                  <p>Invalid data format</p>
                )
              }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
        <Suspense fallback={renderMapSkeleton()}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading map!</p>}
          >
            {(postResponse) =>
              <Map items={postResponse.data} />
            }
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;

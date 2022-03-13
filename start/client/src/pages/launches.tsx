import { gql, useQuery } from "@apollo/client";
import { LaunchTile, Header, Button, Loading } from "../components";
import styled, { css } from "react-emotion";

import React, { Fragment, useState } from "react";
import { RouteComponentProps } from "@reach/router";

import * as GetLaunchListTypes from "./__generated__/GetLaunchList";
import { between } from "polished";

// Stying
import { mq } from "../styling/mq";

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

export const GET_LAUNCHES = gql`
  query GetLaunchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface LaunchesProps extends RouteComponentProps {}

const Launches: React.FC<LaunchesProps> = () => {
  const { data, loading, error, fetchMore } = useQuery<
    GetLaunchListTypes.GetLaunchList,
    GetLaunchListTypes.GetLaunchListVariables
  >(GET_LAUNCHES);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <Fragment>
      <Header />
      <LaunchTileContainer>
        {data.launches &&
          data.launches.launches &&
          data.launches.launches.map((launch: any) => (
            <LaunchTile key={launch.id} launch={launch} />
          ))}
      </LaunchTileContainer>
      {data.launches &&
        data.launches.hasMore &&
        (isLoadingMore ? (
          <Loading />
        ) : (
          <Button
            onClick={async () => {
              setIsLoadingMore(true);
              await fetchMore({
                variables: {
                  after: data.launches.cursor,
                },
              });
              setIsLoadingMore(false);
            }}
          >
            Load More
          </Button>
        ))}
    </Fragment>
  );
};

const LaunchTileContainer = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  border: "1px solid red",
  gridGap: "1rem",
  marginBottom: "1rem",
  // ${mq('mobile')} {
  //   border: "1px solid green",
  //   color: 'gray'
  // }},
});

export default Launches;

import React from "react";
import GrooveFeedList from "../components/Groove/GrooveTotalFeed/GrooveFeedList";
import GrooveHeader from "../components/Groove/GrooveHeader";
import GrooveFooter from "../components/Groove/GrooveFooter";
import styled from "styled-components";

function Home({ user }) {
  return (
    <Wrapper>
      <GrooveHeader user={user} />
      <GrooveFeedList user={user} />
      <GrooveFooter />
    </Wrapper>
  );
}

export default Home;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

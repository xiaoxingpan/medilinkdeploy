import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import ResponsiveVideoEmbed from "../helpers/ResponsiveVideoEmbed.js";

const Container = styled.div`
  ${tw`relative -mx-8 bg-center bg-cover`}
  background-image: url("https://static.wixstatic.com/media/3b1f25_efc1908db3fa487d88c92f3e48ce0350.jpg/v1/fill/w_640,h_236,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3b1f25_efc1908db3fa487d88c92f3e48ce0350.jpg");
`;
const Heading = styled.h1`
    ${tw`text-3xl text-center lg:text-left sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-100 leading-none`}
    span {
      ${tw`inline-block mt-2`}
    }
  `;
const SlantedBackground = styled.span`
  ${tw`relative text-primary-500 px-4 -mx-4 py-2`}
  &::before {
    content: "";
    ${tw`absolute inset-0 bg-gray-100 transform -skew-x-12 -z-10`}
  }
`;
const OpacityOverlay = tw.div`z-10 absolute inset-0 bg-primary-500 opacity-10`;
const HeroContainer = tw.div`z-20 relative px-4 sm:px-8 max-w-screen-xl mx-auto`;
const TwoColumn = tw.div`pt-24 pb-32 px-4 flex justify-between items-center flex-col lg:flex-row`;
const LeftColumn = tw.div`flex flex-col items-center lg:block`;
const RightColumn = tw.div`w-full sm:w-5/6 lg:w-1/2 mt-16 lg:mt-0 lg:pl-8`;
const Actions = styled.div`
  ${tw`relative max-w-md text-center mx-auto lg:mx-0 mt-8`}
  input {
    ${tw`sm:pr-48 pl-8 py-4 sm:py-5 rounded-full border-2 w-full font-medium focus:outline-none transition duration-300  focus:border-primary-500 hover:border-gray-500`}
  }
  button {
    ${tw`w-full sm:absolute right-0 top-0 bottom-0 bg-primary-500 text-gray-100 font-bold mr-2 my-4 sm:my-2 rounded-full py-4 flex items-center justify-center sm:w-40 sm:leading-none focus:outline-none hover:bg-primary-900 transition duration-300`}
  }
`;

const StyledResponsiveVideoEmbed = styled(ResponsiveVideoEmbed)`
      padding-bottom: 56.25% !important;
      padding-top: 0px !important;
      ${tw`rounded`}
      iframe {
        ${tw`rounded bg-black shadow-xl`}
      }
    `;

function Hero() {
    return (
        <Container>
            <OpacityOverlay />
            <HeroContainer>
                <TwoColumn>
                    <LeftColumn>
                        <Heading>
                            <span>Wellness in Your Pocket:</span>
                            <br />
                            <SlantedBackground>Your Clinic, <br />Anytime, Anywhere.</SlantedBackground>
                        </Heading>
                        <Actions>
                            <input type="text" placeholder="Your E-mail Address" />
                            <button>Book Now</button>
                        </Actions>
                    </LeftColumn>
                    <RightColumn>
                        <StyledResponsiveVideoEmbed
                            url="https://www.youtube.com/embed/74DWwSxsVSs"
                            background="transparent"
                        />
                    </RightColumn>
                </TwoColumn>
            </HeroContainer>
        </Container>
    );
}

export default Hero;
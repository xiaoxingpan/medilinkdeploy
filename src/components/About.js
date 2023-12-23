import React from "react";
import styled from "styled-components";
import tw from "twin.macro";

const Container = tw.div`relative`;

const ThreeColumnContainer = styled.div`
  ${tw`flex flex-col items-center md:items-stretch md:flex-row flex-wrap md:justify-center max-w-screen-lg mx-auto pt-20 md:pt-24`}
`;
const Heading = tw.h2`text-4xl sm:text-5xl font-black tracking-wide text-center w-full`;
const Description = tw.p`mt-4 text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100 max-w-xl w-full text-center`;
const VerticalSpacer = tw.div`mt-10 w-full`
const Column = styled.div`
  ${tw`md:w-1/2 lg:w-1/3 max-w-sm`}
`;
const Card = styled.div`
  ${tw`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left h-full mx-4 px-2 py-8`}
  .imageContainer {
    ${tw`border text-center rounded-full p-5 flex-shrink-0`}
    img {
      ${tw`w-6 h-6`}
    }
  }
  .textContainer {
    ${tw`sm:ml-4 mt-4 sm:mt-2`}
  }
  .title {
    ${tw`mt-4 tracking-wide font-bold text-2xl leading-none`}
  }
  .description {
    ${tw`mt-1 sm:mt-4 font-medium text-secondary-100 leading-loose`}
  }
`;


function About() {
    const heading = "Welcome to MediLink";
    const description = "MediLink is an innovative healthcare application designed to facilitate easy and efficient communication between doctors and patients. Our platform is built with the utmost focus on providing a seamless experience for both medical professionals and users.";
    const defaultCards = [
        {
            title: "Secure",
            description: "Register and interact securely with our platform. Your privacy and data security are our top priorities."
        },
        {
            title: "24/7 Support",
            description: "Access round-the-clock support for any questions or assistance you may need. We are always here to help."
        },
        {
            title: "Reliable",
            description: "Experience reliable and efficient communication with healthcare professionals at your fingertips."
        },

        {
            title: "Flexible",
            description: "Benefit from a flexible healthcare experience, with options to choose the mode of consultation that suits your needs."
        },
        {
            title: "Traceable",
            description: "Retrieve and check your medical records and prescriptions at anytime you want."
        },
        {
            title: "Fast",
            description: "Experience fast and efficient communication, ensuring timely responses and healthcare services."
        },
    ];

    return (
        <Container>
            <ThreeColumnContainer>
                <Heading>{heading}</Heading>
                {description && <Description>{description}</Description>}
                <VerticalSpacer />
                {defaultCards.map((card, i) => (
                    <Column key={i}>
                        <Card>
                            <span className="textContainer">
                                <span className="title">{card.title || "Fully Secure"}</span>
                                <p className="description">
                                    {card.description || "Lorem ipsum donor amet siti ceali ut enim ad minim veniam, quis nostrud."}
                                </p>
                            </span>
                        </Card>
                    </Column>
                ))}
            </ThreeColumnContainer>
        </Container>
    );
};

export default About;

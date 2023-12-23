import React from "react";
import { motion } from "framer-motion";
import tw from "twin.macro";
import styled from "styled-components";
import useAnimatedNavToggler from "../helpers/useAnimatedNavToggler.js";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";

const HeaderContainer = tw.header`
 justify-between items-center
  max-w-screen-2xl mx-auto my-3
`;

export const NavLinks = tw.div`inline-block`;

export const NavLink = tw.a`
  text-lg my-2 lg:text-sm lg:mx-6 lg:my-0
  font-semibold tracking-wide transition duration-300
  pb-1 border-b-2 border-transparent hover:border-primary-500 hocus:text-primary-500
`;

export const PrimaryLink = tw(NavLink)`
  lg:mx-0
  px-8 py-3 rounded bg-primary-500 text-gray-100
  hocus:bg-primary-700 hocus:text-gray-200 focus:shadow-outline
  border-b-0
`;

export const LogoLink = styled(NavLink)`
  ${tw`flex items-center font-black border-b-0 text-2xl! ml-0!`};

  img {
    ${tw`w-10 mr-3`}
  }
`;

export const MemberNavLinksContainer = tw.nav` flex flex-1 items-center justify-between`;
export const NavToggle = tw.button`
   z-30 focus:outline-none hocus:text-primary-500 transition duration-300 me-8
`;
export const MemberNavLinks = motion(styled.div`
  ${tw`z-30 fixed top-0 inset-x-0 mx-4 my-6 p-8 border text-center rounded-lg text-gray-900 bg-white`}
  ${NavLinks} {
    ${tw`flex flex-col items-center`}
  }
`);

export const DefaultNavLinks = tw.nav`
 lg:flex flex-1 justify-between items-center 
`;

const Header = ({
  roundedHeaderButton = false,
}) => {
  const defaultLinks = [
    <NavLinks key={1}>
      <NavLink href="/Login" tw="lg:ml-12!">
        Login
      </NavLink>
      <PrimaryLink css={roundedHeaderButton && tw`rounded-full`} href="/Signup">
        Sign Up
      </PrimaryLink>
    </NavLinks>,
  ];

  const LinksMember = [
    <NavLinks key={1}>
      <NavLink href="/#">Profile</NavLink>
      <NavLink href="/#">Contact Us</NavLink>
      <NavLink href="/#">??</NavLink>
      <NavLink href="/#">Management Center</NavLink>

      <PrimaryLink css={roundedHeaderButton && tw`rounded-full`} href="/#">
        Logout
      </PrimaryLink>
    </NavLinks>,
  ];

  const { showNavLinks, animation, toggleNavbar } = useAnimatedNavToggler();

  const defaultLogoLink = (
    <LogoLink href="/">
      <img src="./assets/images/logo.png" alt="" />
      MediLink
    </LogoLink>
  );
  const isLogin = false;

  return (
    <HeaderContainer>
      {isLogin ? (
        <MemberNavLinksContainer>
          {defaultLogoLink}
          <MemberNavLinks
            initial={{ x: "150%", display: "none" }}
            animate={animation}
          >
            {LinksMember}
          </MemberNavLinks>
          <NavToggle
            onClick={toggleNavbar}
            className={showNavLinks ? "open" : "closed"}
          >
            {showNavLinks ? (
              <MdClose tw="w-6 h-6" />
            ) : (
              <GiHamburgerMenu tw="w-6 h-6" />
            )}
          </NavToggle>
        </MemberNavLinksContainer>
      ) : (
        <DefaultNavLinks>
          {defaultLogoLink}
          {defaultLinks}
        </DefaultNavLinks>
      )}
    </HeaderContainer>
  );
};

export default Header;


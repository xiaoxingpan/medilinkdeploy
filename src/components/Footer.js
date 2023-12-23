import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { FiFacebook } from "react-icons/fi";
import { FiTwitter } from "react-icons/fi";
import { FiYoutube } from "react-icons/fi";

const Container = tw.div`relative bg-gray-200 -mx-8 -mb-8 px-8`;
const FiveColumns = tw.div`max-w-screen-xl mx-auto py-16 lg:py-20 flex flex-wrap justify-between`;

const Column = tw.div`md:w-1/5`;
const WideColumn = tw(Column)`text-center md:text-left w-full md:w-2/5 mb-10 md:mb-0`;

const ColumnHeading = tw.h5`font-bold`;

const LinkList = tw.ul`mt-4 text-sm font-medium`;
const LinkListItem = tw.li`mt-3`;
const Link = tw.a`border-b-2 border-transparent hocus:text-primary-500 hocus:border-primary-500 pb-1 transition duration-300`;

const LogoContainer = tw.div`flex items-center justify-center md:justify-start`;
const LogoImg = tw.img`w-8`;
const LogoText = tw.h5`ml-2 text-xl font-black text-primary-500`;

const CompanyDescription = tw.p`mt-4 max-w-xs font-medium text-sm mx-auto md:mx-0 md:mr-4 `;
const CopyrightText = tw.p`text-center text-sm sm:text-base mt-8 md:mt-0 font-medium text-gray-500`;
const SocialLinksContainer = tw.div`mt-4 `;
const SocialLink = styled.a`
  ${tw`cursor-pointer inline-block p-2 rounded-full bg-gray-700 text-gray-100 hover:bg-gray-900 transition duration-300 mr-4`}
  svg {
    ${tw`w-4 h-4`}
  }
`;

function Footer() {
    return (
        <Container>
            <FiveColumns>
                <WideColumn>
                    <LogoContainer>
                        <LogoImg src="" />
                        <LogoText>MediLink Inc.</LogoText>
                    </LogoContainer>
                    <CompanyDescription>
                        MediLink is an innovative healthcare platform designed to facilitate easy and efficient communication between doctors and patients.
                    </CompanyDescription>
                    <SocialLinksContainer>
                        <SocialLink href="https://facebook.com">
                            <FiFacebook />
                        </SocialLink>
                        <SocialLink href="https://twitter.com">
                            <FiTwitter />
                        </SocialLink>
                        <SocialLink href="https://youtube.com">
                            <FiYoutube />
                        </SocialLink>
                    </SocialLinksContainer>


                </WideColumn>
                <Column>
                    <ColumnHeading>Quick Links</ColumnHeading>
                    <LinkList>
                        <LinkListItem>
                            <Link href="#">Book Now</Link>
                        </LinkListItem>
                        <LinkListItem>
                            <Link href="#">FAQs</Link>
                        </LinkListItem>
                        <LinkListItem>
                            <Link href="#">Support</Link>
                        </LinkListItem>
                    </LinkList>
                </Column>
                <Column>
                    <ColumnHeading>Service</ColumnHeading>
                    <LinkList>
                        <LinkListItem>
                            <Link href="#">Log In</Link>
                        </LinkListItem>
                        <LinkListItem>
                            <Link href="#">Departments</Link>
                        </LinkListItem>
                        <LinkListItem>
                            <Link href="#">Doctors</Link>
                        </LinkListItem>
                    </LinkList>
                </Column>
                <Column>
                    <ColumnHeading>Legal</ColumnHeading>
                    <LinkList>
                        <LinkListItem>
                            <Link href="#">Privacy Policy</Link>
                        </LinkListItem>
                        <LinkListItem>
                            <Link href="#">Terms of Service</Link>
                        </LinkListItem>
                        <LinkListItem>
                            <Link href="#">Disclaimer</Link>
                        </LinkListItem>
                    </LinkList>
                </Column>
            </FiveColumns>
            <CopyrightText>&copy; 2023 Shiyuan Xu, Chang Liu, Jing Wei, Li Qian, Qianfeng Sun, Xiaoxing Pan. All Rights Reserved.</CopyrightText>
        </Container>
    );
};

export default Footer;

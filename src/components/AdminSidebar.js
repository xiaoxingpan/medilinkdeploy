import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import tw from "twin.macro";
import { FaUserDoctor } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import { FaCalendarCheck } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { PiTreeStructure } from "react-icons/pi";
import { FaHospitalUser } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { ImProfile } from "react-icons/im";
import { FaChartLine } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";


export const Heading = tw.div`ps-8 pt-8 mb-8 text-3xl font-bold text-primary-500 tracking-wide uppercase`;
export const SubHeading = tw.div`ps-8 mt-5 mb-2 text-xl font-bold text-primary-200 tracking-wide uppercase`;
export const SidebarContainer = tw.div`w-72 h-screen bg-gray-100 justify-between`;
export const ChevronContainer = tw.div`absolute `;


function AdminSidebar() {
    return (
        <div>
            <SidebarContainer>
                <Heading>MediLink</Heading>
                <SubHeading>Menu</SubHeading>
                <Menu
                    menuItemStyles={{
                        button: {
                            // color: '#742cff',
                            fontSize: '1.5rem',
                            fontWeight: 'unbold',
                        },
                        [`&.active`]: {
                            backgroundColor: '#8344ff',
                            color: '#8344ff',
                        },
                    }}
                >
                    <MenuItem
                        active={true}
                        icon={<RxDashboard />}>  Dashboard </MenuItem>
                    <SubMenu
                        icon={<FaUserFriends />} label="Users">
                        <MenuItem icon={<FaUserDoctor />}> Doctors </MenuItem>
                        <MenuItem icon={<FaHospitalUser />}> Patient </MenuItem>
                    </SubMenu>
                    <MenuItem icon={<PiTreeStructure />}> Department </MenuItem>
                    <MenuItem icon={<FaCalendarCheck />}> Appointment </MenuItem>
                    <MenuItem icon={<AiFillMessage />}> Message </MenuItem>
                    <SubMenu icon={<IoMdSettings />} label="Setting">
                        <MenuItem icon={<ImProfile />}> Profile </MenuItem>
                    </SubMenu>
                </Menu>
                <SubHeading>Other</SubHeading>
                <Menu
                    menuItemStyles={{
                        button: {
                            // color: '#742cff',
                            fontSize: '1.5rem',
                            fontWeight: 'unbold',
                        },
                        [`&.active`]: {
                            backgroundColor: '#8344ff',
                            color: '#8344ff',
                        },
                    }}>
                    <MenuItem icon={<FaChartLine />}> Charts </MenuItem>
                </Menu>

                <Heading></Heading>

                <Menu
                    menuItemStyles={{
                        button: {
                            // color: '#742cff',
                            fontSize: '1.5rem',
                            fontWeight: 'unbold',
                        },
                        [`&.active`]: {
                            backgroundColor: '#8344ff',
                            color: '#8344ff',
                        },
                    }}>
                    <MenuItem icon={<RiLogoutBoxRLine />}> Logout </MenuItem>
                </Menu>

            </SidebarContainer>
        </div>
    )
}
export default AdminSidebar;
"use client"

import { useEffect, useState } from "react"
import styled from "@emotion/styled"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { Provider } from "react-redux"

import { Container, For, Image, Show } from "@chakra-ui/react"
import { Avatar } from "@components/ui/avatar"
import { storage } from "@utils/index"
import { store } from "./store"

import Header from "./components/Header"

import homepageBg from "@img/homepage/homepageBg.png" // 顶部彩色背景图
import editAvatar from "@img/homepage/editAvatar.png" // 编辑头像icon
import editProfileIconf from "@img/homepage/editProfile.svg"
import shoppingAddressIcon from "@img/homepage/shoppingAddress.svg"
import settingIcon from "@img/homepage/setting.svg"
import LinkIcon from "@img/homepage/linkIcon.svg"

import { queryProfileData } from "@lib/request/profile"
import { profileDataType } from "@definitions/profile"
import { setData } from "./profileSlice"

const operatorList = [
  {
    key: "editProfile",
    label: "Edit Profile",
    icon: editProfileIconf,
    link: "editprofile",
    isDanger: false,
    redirectable: true
  },
  {
    key: "shoppingAddress",
    label: "Shipping Address",
    icon: shoppingAddressIcon,
    link: "address",
    redirectable: true,
    isDanger: false
  },
  {
    key: "setting",
    label: "Settings",
    icon: settingIcon,
    link: "setting",
    redirectable: true,
    isDanger: false
  }
]

function Profile() {
  const dispatch = useDispatch()
  const route = useRouter()
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    pronouns: "",
    bio: "",
    avatar_url: ""
  })

  // 切换到子页面
  const handleJump = (link: string) => {
    route.push(`/profile/${link}`)
  }

  const queryData = async () => {
    const user_id = storage.get("user_id")
    if (user_id) {
      const params = {
        user_id: +user_id as number
      }
      const { success, data, message } = await queryProfileData(params)

      if (success) {
        const newProfileData = {
          ...profileData,
          ...data
        }

        setProfileData(newProfileData)

        dispatch(setData(newProfileData))
      } else {
        // todo error handler
      }
    }
  }

  useEffect(() => {
    queryData()
  }, [])

  return (
    <Container p={0} position={"relative"}>
      <Header title="Profile" />

      {/* 头像 */}
      <AvatarWrapper className="profile-avatar-container">
        <Image src={homepageBg.src} alt="" w={"100%"} h={"100%"} />
        <AvatarContainer>
          <AvatarBg>
            <Avatar
              background={"linear-gradient(to bottom, #ffd2d3, #ffbada)"}
              w={"calc(100% - 8pt)"}
              h={"calc(100% - 8pt)"}
              name=""
              src={`/assets/images/homepage/avatar/${profileData.avatar_url ? profileData.avatar_url + ".png" : "defaultAvatar.svg"}`}
            />
            <EiitAvatarBtn>
              <Image
                src={editAvatar.src}
                alt="edit-icon"
                onClick={() => {
                  handleJump("editavatar")
                }}
              />
            </EiitAvatarBtn>
          </AvatarBg>
        </AvatarContainer>
      </AvatarWrapper>

      {/* name */}
      <Name className="homepage-name-wrapper">{profileData.first_name + " " + profileData.last_name}</Name>

      {/* pronouns */}
      <Show when={profileData.pronouns}>
        <Pronouns className="homepage-pronouns-wrapper">
          <span>{profileData.pronouns}</span>
        </Pronouns>
      </Show>

      {/* bio */}
      <Bio className="homepage-bio-wrapper">
        {profileData.bio.split("\n").map((item, index) => (
          <div key={item + index}>{item}</div>
        ))}
      </Bio>

      {/* operators */}
      <OperatorWrapper className="homepage-operator-wrapper">
        <For each={operatorList}>
          {(item, index): React.ReactNode => {
            return (
              <OperatorBox
                key={item.key}
                onClick={() => {
                  handleJump(item.link)
                }}
              >
                <div>
                  <Image src={item.icon.src} alt={`${item.key}-icon`} />
                  <OperatorLabel isDanger={item.isDanger}>{item.label}</OperatorLabel>
                </div>
                <Show when={item.redirectable}>
                  <Image src={LinkIcon.src} alt="link-icon" />
                </Show>
              </OperatorBox>
            )
          }}
        </For>
      </OperatorWrapper>
    </Container>
  )
}
const AvatarWrapper = styled.div`
  position: absolute;
  height: 25vh;
  width: 100vw;
  top: 0;
  z-index: 0;
  &::after {
    content: "";
    padding: 20px;
    height: 20px;
    display: inline-block;
    width: 100%;
    bottom: -5px;
    position: absolute;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    backdrop-filter: blur(10px);
  }
`

const AvatarContainer = styled.div`
  z-index: 1;
  width: 25vw;
  height: 25vw;
  position: absolute;
  background: #fff;
  border-radius: 50%;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);

  display: flex;
  align-items: center;
  justify-content: center;
`
const AvatarBg = styled.div`
  background: linear-gradient(to bottom, rgba(255, 144, 144, 1), rgba(254, 75, 163, 1));
  width: calc(100% - 8pt);
  height: calc(100% - 8pt);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`
const EiitAvatarBtn = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 22pt;
  height: 22px;
`

const Name = styled.div`
  margin: 25vh 0 8pt;
  text-align: center;
  font-weight: 500;
  font-size: 1.5rem;
`
const Pronouns = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8pt;

  & > span {
    background: #fdebeb;
    border-radius: 40pt;
    font-weight: 400;
    font-size: 1rem;
    color: #ee3939;
    padding: 2pt 10pt;
  }
`
const Bio = styled.div`
  padding: 0 24pt;
  text-align: center;
  & > div {
    margin-bottom: 4pt;
  }
`

interface OperatorLabelProps {
  isDanger?: boolean
}

const OperatorWrapper = styled.div`
  margin-top: 24pt;
`
const OperatorBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 24pt;
  height: 60px;
  border-bottom: 1px solid #f0f0f0;

  & > div:first-child {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    font-weight: 400;
    font-size: 1rem;
    color: #171717;

    & > img {
      margin-right: 4pt;
    }
  }

  & img {
    width: 18pt;
    height: 18pt;
  }
`
const OperatorLabel = styled.div<OperatorLabelProps>`
  color: ${props => (props.isDanger ? "#F50C00" : "#171717")};
`

export default () => {
  return (
    <Provider store={store}>
      <Profile />
    </Provider>
  )
}

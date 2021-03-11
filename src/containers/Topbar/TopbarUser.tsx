import React, { useState, useContext } from "react";
import Popover from "../../components/uielements/popover";
import userpic from "../../assets/images/user.png";
import TopbarDropdownWrapper from "./TopbarDropdown.styles";
import useLogin from "../../hooks/use-login.hook";
import { ChangePassword } from "../PasswordManagement/ChangePassword";
import { SecurityContext, RolesEnum } from "../../contexts/security.context";
import styled from "styled-components";

const UserLabel = styled.div`
  width:800px;
  position: absolute;
  right: 60px;
  top: 12px; 
  text-align: right; 
  font-size: 15px;
  font-weight: bold;
`

export default function TopbarUser() {
  const [modalOpened, setModalOpened] = useState(false);
  const [visible, setVisibility] = React.useState(false);
  const [security] = useContext(SecurityContext);
  const { doLogout } = useLogin();
  function handleVisibleChange() {
    setVisibility(visible => !visible);
  }
  const changePassword = () => {
    setModalOpened(true)
  }

  const content = (
    <TopbarDropdownWrapper className="isoUserDropdown">
      <a className="isoDropdownLink" onClick={() => changePassword()} href="# ">
        Cambiar Contraseña
      </a>
      <a className="isoDropdownLink" onClick={() => doLogout()} href="# ">
        Cerrar Sesión
      </a>
    </TopbarDropdownWrapper>
  );

  const isAdmin = security.user?.roles.map(r => r.name).includes(RolesEnum.Admin) || false
  const isGasStationAdmin = security.user?.roles.map(r => r.name).includes(RolesEnum.GasStationAdmin) || false
  const isSeller = security.user?.roles.map(r => r.name).includes(RolesEnum.Seller) || false
  const isCoverageOperator = security.user?.roles.map(r => r.name).includes(RolesEnum.CoverageOperator) || false
  
  return (
    <>
      {isAdmin && <UserLabel>Administrador</UserLabel>}
      {isGasStationAdmin && <UserLabel>{"Administrador de " + security.user?.gasStationAdministrator?.gasStation.name}</UserLabel>}
      {isSeller && <UserLabel>{"Playero " + security.user?.seller?.name + " - " + security.user?.seller?.gasStation.name}</UserLabel>}
      {isCoverageOperator && <UserLabel>Cobertura</UserLabel>}
      <Popover
        content={content}
        trigger="click"
        visible={visible}
        onVisibleChange={handleVisibleChange}
        arrowPointAtCenter={true}
        placement="bottomLeft"
      >

        <div className="isoImgWrapper">
          <img alt="user" src={userpic} />
          <span className="userActivity online" />
        </div>
      </Popover>
      <ChangePassword
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onFinished={() => setModalOpened(false)}
      />
    </>
  );
}

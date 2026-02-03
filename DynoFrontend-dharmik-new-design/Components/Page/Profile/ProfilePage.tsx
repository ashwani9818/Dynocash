import { Grid } from "@mui/material";
import React from "react";

import { TokenData } from "@/utils/types";
import UpdatePassword from "./UpdatePassword";
import AccountSetting from "./AccountSetting";

const ProfilePage = ({ tokenData }: { tokenData: TokenData }) => {
  return (
    <Grid container columnSpacing={3} sx={{ rowGap: 2 }}>
      <Grid item md={6} xs={12}>
        <AccountSetting tokenData={tokenData} />
      </Grid>
      <Grid item md={6} xs={12}>
        <UpdatePassword />
      </Grid>
    </Grid>
  );
};

export default ProfilePage;

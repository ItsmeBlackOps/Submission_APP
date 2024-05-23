import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import Badge from "@mui/joy/Badge";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Dropdown from "@mui/joy/Dropdown";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import ListDivider from "@mui/joy/ListDivider";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Chip from "@mui/joy/Chip";
import AddIcon from "@mui/icons-material/Add";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded";
import { useAuth } from "../utils/AuthContent";
import { account } from "../AppWriteConfig";

const Header = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [color, setColor] = React.useState("primary");
  const buttonColors = {
    primary: "primary",
    neutral: "grey",
    danger: "error",
    success: "success",
    warning: "warning",
  };
  const textColor = (bgColor) => {
    switch (bgColor) {
      case "primary":
        return "white";
      case "neutral":
        return "black";
      case "danger":
        return "white";
      case "success":
        return "white";
      case "warning":
        return "black";
      default:
        return "black";
    }
  };
  const handleColorChange = () => {
    const colors = ["primary", "neutral", "danger", "success", "warning"];
    const nextColorIndex = colors.indexOf(color) + 1;
    setColor(colors[nextColorIndex] ?? colors[0]);
  };

  return (
    <Sheet
      variant="solid"
      color={color}
      invertedColors
      sx={{
        position: "fixed",
        top: 0,
        width: "100%",
        display: "flex",
        alignItems: "center",
        p: 2,
        zIndex: 1100, // Ensures the header stays above other elements
        borderRadius: { xs: 0, sm: "sm" },
        boxSizing: "border-box", // Ensures padding is included in the width
        minWidth: "min-content",
        ...(color !== "warning" && {
          background: (theme) =>
            `linear-gradient(to top, ${theme.vars.palette[color][600]}, ${theme.vars.palette[color][500]})`,
        }),
      }}
    >
      <IconButton
        variant="soft"
        size="sm"
        onClick={handleColorChange}
        color={buttonColors[color]}
      >
        <ColorLensRoundedIcon fontSize="small" />
      </IconButton>

      <Box sx={{ display: "flex", flexShrink: 0, gap: 2, ml: "auto" }}>
        {user ? (
          <>
            <Button
              component={Link}
              to="/"
              color={buttonColors[color]}
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                color: textColor(buttonColors[color]),
              }}
            >
              Home
            </Button>
            {/* {user.labels[0] === 'admin' && (
              <Button component={Link} to="/demo" sx={{ display: { xs: 'none', md: 'inline-flex' } }}
              >
                Demo
              </Button>
            )} */}
            {(user.labels[0] === "Manager" || user.labels[0] === "admin") && (
              <Button
                component={Link}
                to="/candidate"
                color={buttonColors[color]}
                sx={{ display: { xs: "none", md: "inline-flex" } }}
              >
                Candidates
              </Button>
            )}
            {(user.labels[0] === "compliance" ||
              user.labels[0] === "admin") && (
              <>
                <Button
                  component={Link}
                  to="/Email"
                  color={buttonColors[color]}
                  sx={{ display: { xs: "none", md: "inline-flex" } }}
                >
                  Email
                </Button>
                <Button
                  component={Link}
                  to="/Templates"
                  color={buttonColors[color]}
                  sx={{ display: { xs: "none", md: "inline-flex" } }}
                >
                  Payment Table
                </Button>
              </>
            )}
            <Button
              component={Link}
              to="/form"
              color={buttonColors[color]}
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              Form
            </Button>
            <Button
              component={Link}
              to="/submissions"
              color={buttonColors[color]}
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              Submissions
            </Button>
            <Button
              component={Link}
              to="/interviews"
              color={buttonColors[color]}
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              Interviews
            </Button>
            <Button onClick={logoutUser} color="inherit" variant="outlined">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              component={Link}
              to="/login"
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/SignUp"
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              Create User
            </Button>
          </>
        )}
      </Box>
    </Sheet>
  );
};

export default Header;

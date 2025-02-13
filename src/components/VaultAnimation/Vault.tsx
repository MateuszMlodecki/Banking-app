import { useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

const SafeContainer = styled(Box)({
  width: 440,
  height: 440,
  borderRadius: "50%",
  background: "#111",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.6)",
  cursor: "pointer",
});

const OuterRing = styled(Box)({
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  border: "12px solid #6a0dad",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "inset 0px 8px 20px rgba(0, 0, 0, 0.7)",
  transition: "transform 1s ease-in-out",
});

const InnerWheel = styled(Box)({
  width: 180,
  height: 180,
  borderRadius: "50%",
  background: "#222",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "inset 0px 8px 24px rgba(0,0,0,0.7)",
  border: "6px solid #333",
});

const Handle = styled(Box)({
  width: 160,
  height: 24,
  background: "#444",
  position: "absolute",
  right: -50,
  top: "50%",
  transform: "translateY(-50%) scaleX(-1)",
  borderRadius: 5,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.7)",
  "&::before": {
    content: '""',
    width: 24,
    height: 90,
    background: "#333",
    position: "absolute",
    left: 0,
    borderRadius: 5,
  },
});

const CenterKnob = styled(Box)({
  width: 30,
  height: 30,
  borderRadius: "50%",
  background: "#99ff66",
  boxShadow: "0px 0px 16px rgba(153, 255, 102, 0.8)",
});

const DialMarkers = styled(Box)({
  position: "absolute",
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
  top: -15,
  left: 0,
});

export const Vault = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <SafeContainer
      onClick={() => navigate("/Login")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <OuterRing
        sx={{
          transform: isHovered ? "rotate(360deg)" : "rotate(0deg)",
        }}
      >
        <DialMarkers>
          {[...Array(30)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                width: 8,
                height: i % 5 === 0 ? 24 : 12,
                background: "#6a0dad",
                top: "210px",
                left: "50%",
                transform: `translateX(-50%) rotate(${
                  i * 12
                }deg) translateY(-190px)`,
                transformOrigin: "center center",
              }}
            />
          ))}
        </DialMarkers>
        <InnerWheel>
          <CenterKnob />
        </InnerWheel>
      </OuterRing>
      <Handle />
    </SafeContainer>
  );
};

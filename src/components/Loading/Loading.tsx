import "ldrs/ring";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import "./Loading.css";

function Loading() {
  return (
    <div className="loading-container">
      <Ring size="40" stroke="5" bgOpacity="0" speed="2" color="black" />
    </div>
  );
}

export default Loading;
